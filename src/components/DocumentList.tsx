import React from 'react';
import { Download, FileText } from 'lucide-react';
import { Document } from '../types/course';

interface DocumentListProps {
  documents: Document[];
}

export function DocumentList({ documents }: DocumentListProps) {
  const handleDownload = (document: Document) => {
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = document.url;
    link.download = document.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mt-4">
      <h5 className="font-medium mb-2">Course Documents</h5>
      <div className="space-y-2">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-blue-600" />
              <div>
                <div className="font-medium">{doc.name}</div>
                <div className="text-xs text-gray-500">{doc.uploadedAt}</div>
              </div>
            </div>
            <button
              onClick={() => handleDownload(doc)}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
            >
              <Download size={16} />
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}