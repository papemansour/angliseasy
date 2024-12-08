import { create } from 'zustand';
import { Document } from '../types/course';

interface DocumentStore {
  documents: { [levelId: string]: Document[] };
  addDocument: (levelId: string, document: Document) => void;
  deleteDocument: (levelId: string, documentId: string) => void;
  getDocuments: (levelId: string) => Document[];
}

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  documents: {},
  addDocument: (levelId: string, document: Document) => {
    set((state) => ({
      documents: {
        ...state.documents,
        [levelId]: [...(state.documents[levelId] || []), document],
      },
    }));
  },
  deleteDocument: (levelId: string, documentId: string) => {
    set((state) => ({
      documents: {
        ...state.documents,
        [levelId]: state.documents[levelId]?.filter(doc => doc.id !== documentId) || [],
      },
    }));
  },
  getDocuments: (levelId: string) => {
    return get().documents[levelId] || [];
  },
}));