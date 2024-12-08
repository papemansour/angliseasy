import React from 'react';
import { Book as BookIcon } from 'lucide-react';
import { useLibraryStore } from '../../store/libraryStore';
import { BookCard } from './BookCard';

interface LibrarySectionProps {
  levelId: string;
}

export function LibrarySection({ levelId }: LibrarySectionProps) {
  const { getBooks } = useLibraryStore();
  const books = getBooks(levelId);

  if (books.length === 0) {
    return (
      <div className="border-t pt-4">
        <div className="flex items-center gap-2 text-gray-600">
          <BookIcon size={20} />
          <h4 className="font-semibold">Bibliothèque numérique</h4>
        </div>
        <p className="text-gray-500 text-sm mt-2">
          Aucun livre disponible pour ce niveau pour le moment.
        </p>
      </div>
    );
  }

  return (
    <div className="border-t pt-4">
      <div className="flex items-center gap-2 text-blue-600 mb-4">
        <BookIcon size={20} />
        <h4 className="font-semibold">Bibliothèque numérique</h4>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}