import React from 'react';
import { Book, Download, ExternalLink } from 'lucide-react';
import { Book as BookType } from '../../store/libraryStore';

interface BookCardProps {
  book: BookType;
}

export function BookCard({ book }: BookCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {book.coverUrl ? (
            <img
              src={book.coverUrl}
              alt={book.title}
              className="w-24 h-32 object-cover rounded"
            />
          ) : (
            <div className="w-24 h-32 bg-gray-100 rounded flex items-center justify-center">
              <Book className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <h5 className="font-semibold text-lg mb-1">{book.title}</h5>
          <p className="text-sm text-gray-600 mb-2">{book.author}</p>
          <p className="text-sm text-gray-500 mb-4 line-clamp-2">
            {book.description}
          </p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{book.fileSize}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.open(book.fileUrl, '_blank')}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                title="Ouvrir dans un nouvel onglet"
              >
                <ExternalLink size={18} />
              </button>
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = book.fileUrl;
                  link.download = `${book.title}.pdf`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                title="Télécharger"
              >
                <Download size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}