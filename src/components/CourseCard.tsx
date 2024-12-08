import React, { useState } from 'react';
import { Course, Document } from '../types/course';
import { DocumentUpload } from './DocumentUpload';
import { DocumentList } from './DocumentList';
import { FileText, Clock } from 'lucide-react';
import { GoogleMeet } from './GoogleMeet';

interface CourseCardProps {
  course: Course;
  meetLink: string;
}

export function CourseCard({ course, meetLink }: CourseCardProps) {
  const [documents, setDocuments] = useState<Document[]>([]);

  const handleUpload = (file: File) => {
    const newDocument: Document = {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      uploadedAt: new Date().toLocaleString(),
      url: URL.createObjectURL(file),
      size: formatFileSize(file.size),
    };
    setDocuments([...documents, newDocument]);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="border rounded p-4 hover:bg-gray-50">
      <h4 className="font-semibold text-lg">{course.title}</h4>
      <p className="text-sm text-gray-600 mt-1">{course.description}</p>
      
      <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
        <Clock size={16} />
        <span>Duration: {course.duration}</span>
      </div>

      <DocumentUpload onUpload={handleUpload} />

      {documents.length > 0 && <DocumentList documents={documents} />}

      <GoogleMeet courseTitle={course.title} meetLink={meetLink} />
    </div>
  );
}