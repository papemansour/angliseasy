import { create } from 'zustand';
import bcrypt from 'bcryptjs';

interface User {
  email: string;
  password: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (email: string, password: string) => {
    const storedUser = localStorage.getItem(email);
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        set({ user, isAuthenticated: true });
        return true;
      }
    }
    return false;
  },
  register: async (email: string, password: string) => {
    if (localStorage.getItem(email)) {
      return false;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { email, password: hashedPassword };
    localStorage.setItem(email, JSON.stringify(user));
    set({ user, isAuthenticated: true });
    return true;
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));