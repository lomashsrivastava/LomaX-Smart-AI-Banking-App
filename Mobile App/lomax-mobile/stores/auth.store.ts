import { create } from 'zustand';
import { storage } from '@/utils/storage';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  customerId?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  loadFromStorage: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: async (user, token, refreshToken) => {
    await storage.setToken(token);
    await storage.setRefreshToken(refreshToken);
    await storage.setUser(user);
    set({ user, token, isAuthenticated: true });
  },

  logout: async () => {
    await storage.clearAll();
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadFromStorage: async () => {
    try {
      const [token, user] = await Promise.all([
        storage.getToken(),
        storage.getUser(),
      ]);
      if (token && user) {
        set({ user, token, isAuthenticated: true });
      }
    } finally {
      set({ isLoading: false });
    }
  },
}));
