import { create } from 'zustand';

interface AdminState {
  isAdmin: boolean;
  login: (code: string) => boolean;
  logout: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  isAdmin: false,
  login: (code: string) => {
    if (code === 'admin') {
      set({ isAdmin: true });
      return true;
    }
    return false;
  },
  logout: () => set({ isAdmin: false }),
}));