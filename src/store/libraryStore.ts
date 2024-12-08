import { create } from 'zustand';

export interface Book {
  id: string;
  levelId: string;
  title: string;
  author: string;
  description: string;
  coverUrl?: string;
  fileUrl: string;
  uploadedAt: string;
  fileSize: string;
}

interface LibraryStore {
  books: { [levelId: string]: Book[] };
  addBook: (levelId: string, book: Book) => void;
  deleteBook: (levelId: string, bookId: string) => void;
  getBooks: (levelId: string) => Book[];
}

export const useLibraryStore = create<LibraryStore>((set, get) => ({
  books: {},
  addBook: (levelId: string, book: Book) => {
    set((state) => ({
      books: {
        ...state.books,
        [levelId]: [...(state.books[levelId] || []), book],
      },
    }));
  },
  deleteBook: (levelId: string, bookId: string) => {
    set((state) => ({
      books: {
        ...state.books,
        [levelId]: state.books[levelId]?.filter(book => book.id !== bookId) || [],
      },
    }));
  },
  getBooks: (levelId: string) => {
    return get().books[levelId] || [];
  },
}));