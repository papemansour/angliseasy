import React, { useState } from 'react';
import { Upload, Book as BookIcon, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useLibraryStore, Book } from '../../store/libraryStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { formatFileSize } from '../../utils/formatters';

interface AdminLibraryProps {
  levelId: string;
  levelName: string;
}

export function AdminLibrary({ levelId, levelName }: AdminLibraryProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [bookInfo, setBookInfo] = useState({
    title: '',
    author: '',
    description: '',
    coverUrl: '',
  });

  const { addBook, deleteBook, getBooks } = useLibraryStore();
  const books = getBooks(levelId);

  const handleUpload = () => {
    if (!selectedFile) {
      toast.error('Veuillez sélectionner un fichier PDF');
      return;
    }

    if (!bookInfo.title || !bookInfo.author) {
      toast.error('Le titre et l\'auteur sont requis');
      return;
    }

    if (!selectedFile.type.includes('pdf')) {
      toast.error('Seuls les fichiers PDF sont acceptés');
      return;
    }

    const newBook: Book = {
      id: Math.random().toString(36).substr(2, 9),
      levelId,
      title: bookInfo.title,
      author: bookInfo.author,
      description: bookInfo.description,
      coverUrl: bookInfo.coverUrl,
      fileUrl: URL.createObjectURL(selectedFile),
      uploadedAt: new Date().toLocaleString(),
      fileSize: formatFileSize(selectedFile.size),
    };

    addBook(levelId, newBook);
    toast.success('Livre ajouté avec succès');
    setSelectedFile(null);
    setBookInfo({ title: '', author: '', description: '', coverUrl: '' });
  };

  return (
    <div className="border-t pt-4">
      <h4 className="font-semibold mb-4">Bibliothèque numérique - {levelName}</h4>
      
      <div className="space-y-4 mb-6">
        <Input
          placeholder="Titre du livre"
          value={bookInfo.title}
          onChange={(e) => setBookInfo({ ...bookInfo, title: e.target.value })}
        />
        <Input
          placeholder="Auteur"
          value={bookInfo.author}
          onChange={(e) => setBookInfo({ ...bookInfo, author: e.target.value })}
        />
        <Input
          placeholder="Description (optionnel)"
          value={bookInfo.description}
          onChange={(e) => setBookInfo({ ...bookInfo, description: e.target.value })}
        />
        <Input
          placeholder="URL de la couverture (optionnel)"
          value={bookInfo.coverUrl}
          onChange={(e) => setBookInfo({ ...bookInfo, coverUrl: e.target.value })}
        />
        <div>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="text-xs text-gray-500 mt-1">Formats acceptés: PDF uniquement</p>
        </div>
        <Button
          onClick={handleUpload}
          icon={Upload}
          disabled={!selectedFile || !bookInfo.title || !bookInfo.author}
        >
          Ajouter le livre
        </Button>
      </div>

      <div className="space-y-4">
        <h5 className="font-medium">Livres disponibles ({books.length})</h5>
        <div className="grid gap-4">
          {books.map((book) => (
            <div
              key={book.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <BookIcon className="text-blue-600" size={20} />
                <div>
                  <h6 className="font-medium">{book.title}</h6>
                  <p className="text-sm text-gray-600">{book.author}</p>
                  <p className="text-xs text-gray-500">
                    Ajouté le {book.uploadedAt} • {book.fileSize}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  deleteBook(levelId, book.id);
                  toast.success('Livre supprimé avec succès');
                }}
                className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                title="Supprimer"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}