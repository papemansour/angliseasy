import React, { useState } from 'react';
import { Upload, Check, X } from 'lucide-react';

interface DocumentUploadProps {
  onUpload: (file: File) => void;
}

export function DocumentUpload({ onUpload }: DocumentUploadProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    if (code !== 'imp') {
      setError('Invalid upload code');
      return;
    }

    onUpload(file);
    setFile(null);
    setCode('');
    setError('');
  };

  return (
    <div className="border rounded-lg p-4 mt-4 bg-gray-50">
      <h4 className="font-semibold mb-3">Upload Document</h4>
      
      <div className="space-y-3">
        <div>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter upload code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 border rounded px-3 py-2"
          />
          <button
            onClick={handleUpload}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 flex items-center gap-2"
          >
            <Upload size={16} />
            Upload
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-500 text-sm">
            <X size={16} />
            {error}
          </div>
        )}

        {file && (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <Check size={16} />
            {file.name} selected
          </div>
        )}
      </div>
    </div>
  );
}