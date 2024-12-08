import { create } from 'zustand';
import { Document } from '../types/course';

interface HomeworkStore {
  homework: { [levelId: string]: Document[] };
  completedHomework: { [levelId: string]: Document[] };
  addHomework: (levelId: string, document: Document) => void;
  addCompletedHomework: (levelId: string, document: Document) => void;
  getHomework: (levelId: string) => Document[];
  getCompletedHomework: (levelId: string) => Document[];
  deleteHomework: (levelId: string, documentId: string) => void;
  deleteCompletedHomework: (levelId: string, documentId: string) => void;
}

export const useHomeworkStore = create<HomeworkStore>((set, get) => ({
  homework: {},
  completedHomework: {},
  addHomework: (levelId: string, document: Document) => {
    set((state) => ({
      homework: {
        ...state.homework,
        [levelId]: [...(state.homework[levelId] || []), document],
      },
    }));
  },
  addCompletedHomework: (levelId: string, document: Document) => {
    set((state) => ({
      completedHomework: {
        ...state.completedHomework,
        [levelId]: [...(state.completedHomework[levelId] || []), document],
      },
    }));
  },
  getHomework: (levelId: string) => {
    return get().homework[levelId] || [];
  },
  getCompletedHomework: (levelId: string) => {
    return get().completedHomework[levelId] || [];
  },
  deleteHomework: (levelId: string, documentId: string) => {
    set((state) => ({
      homework: {
        ...state.homework,
        [levelId]: state.homework[levelId]?.filter(doc => doc.id !== documentId) || [],
      },
    }));
  },
  deleteCompletedHomework: (levelId: string, documentId: string) => {
    set((state) => ({
      completedHomework: {
        ...state.completedHomework,
        [levelId]: state.completedHomework[levelId]?.filter(doc => doc.id !== documentId) || [],
      },
    }));
  },
}));