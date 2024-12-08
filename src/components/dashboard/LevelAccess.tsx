import React, { useState } from 'react';
import { Upload, Calendar, ExternalLink, Trash2, Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Level, Document } from '../../types/course';
import { useDocumentStore } from '../../store/documentStore';
import { useHomeworkStore } from '../../store/homeworkStore';
import { LibrarySection } from '../library/LibrarySection';
import emailjs from '@emailjs/browser';
import { emailConfig } from '../../config/email';
import { formatFileSize } from '../../utils/formatters';

interface LevelAccessProps {
  level: Level;
}

export function LevelAccess({ level }: LevelAccessProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadCode, setUploadCode] = useState('');
  const [homework, setHomework] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addDocument, getDocuments, deleteDocument } = useDocumentStore();
  const { addCompletedHomework } = useHomeworkStore();
  const documents = getDocuments(level.id);

  const handleUnlock = () => {
    if (password === level.password) {
      setIsUnlocked(true);
      toast.success(`${level.name} level unlocked!`);
    } else {
      toast.error('Invalid password');
    }
  };

  if (!isUnlocked) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Lock className="w-8 h-8 text-blue-600" />
          <h3 className="text-xl font-bold">{level.name}</h3>
        </div>
        <p className="text-gray-600 mb-4">{level.description}</p>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="password"
              placeholder="Enter level password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 border rounded px-3 py-2"
            />
            <button
              onClick={handleUnlock}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Unlock Level
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleDocumentUpload = () => {
    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }

    if (uploadCode !== 'impor') {
      toast.error('Invalid upload code');
      return;
    }

    const newDocument: Document = {
      id: Math.random().toString(36).substr(2, 9),
      name: selectedFile.name,
      uploadedAt: new Date().toLocaleString(),
      url: URL.createObjectURL(selectedFile),
      size: formatFileSize(selectedFile.size),
    };

    addDocument(level.id, newDocument);
    toast.success(`Document "${selectedFile.name}" uploaded successfully`);
    setSelectedFile(null);
    setUploadCode('');
  };

  const handleHomeworkSubmit = async () => {
    if (!homework) {
      toast.error('Please select a homework file');
      return;
    }

    setIsSubmitting(true);
    const now = new Date();
    const submissionTime = `${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`;

    try {
      const newHomework: Document = {
        id: Math.random().toString(36).substr(2, 9),
        name: homework.name,
        uploadedAt: submissionTime,
        url: URL.createObjectURL(homework),
        size: formatFileSize(homework.size),
      };

      addCompletedHomework(level.id, newHomework);

      const reader = new FileReader();
      reader.readAsDataURL(homework);
      
      reader.onload = async () => {
        const base64File = reader.result as string;

        await emailjs.send(
          emailConfig.serviceId,
          emailConfig.templateId,
          {
            to_email: emailConfig.adminEmail,
            subject: `Homework Submission - ${level.name} Level`,
            message: `New homework submission for ${level.name} level\n\nSubmitted on: ${submissionTime}\nFile name: ${homework.name}`,
            attachment: base64File,
          },
          emailConfig.publicKey
        );

        toast.success(`Homework "${homework.name}" submitted successfully`);
        setHomework(null);
      };
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit homework. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-start gap-6">
        {level.imageUrl && (
          <img
            src={level.imageUrl}
            alt={`${level.name} Level`}
            className="w-32 h-32 object-cover rounded-lg"
          />
        )}
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-4">{level.name}</h3>
          
          <div className="space-y-6">
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Upload Document</h4>
              <div className="space-y-3">
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter upload code"
                    value={uploadCode}
                    onChange={(e) => setUploadCode(e.target.value)}
                    className="border rounded px-3 py-2 flex-1"
                  />
                  <button
                    onClick={handleDocumentUpload}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    <Upload size={16} />
                    Upload
                  </button>
                </div>
              </div>
            </div>

            {documents.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Shared Documents</h4>
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center gap-2">
                        <Upload size={16} className="text-blue-600" />
                        <div>
                          <div className="font-medium">{doc.name}</div>
                          <div className="text-xs text-gray-500">
                            {doc.uploadedAt} • {doc.size}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => window.open(doc.url, '_blank')}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          title="Open in new tab"
                        >
                          <ExternalLink size={18} />
                        </button>
                        <button
                          onClick={() => {
                            deleteDocument(level.id, doc.id);
                            toast.success('Document deleted successfully');
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <LibrarySection levelId={level.id} />

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Submit Homework</h4>
              <div className="space-y-3">
                <input
                  type="file"
                  onChange={(e) => setHomework(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} />
                  Due date: {new Date().toLocaleDateString()} at 23:59
                </div>
                <button
                  onClick={handleHomeworkSubmit}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload size={16} />
                  {isSubmitting ? 'Submitting...' : 'Submit Homework'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}