// ==========================================
// AstroMachine Mobile - Store de Autenticação (Zustand)
// ==========================================

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isLargeFont: boolean;
  isHighContrast: boolean;

  setAuth: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  loadSession: () => Promise<void>;
  toggleLargeFont: () => void;
  toggleHighContrast: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: true,
  isLargeFont: false,
  isHighContrast: false,

  setAuth: async (user: User, token: string) => {
    await AsyncStorage.setItem('auth_token', token);
    await AsyncStorage.setItem('auth_user', JSON.stringify(user));
    set({ user, token });
  },

  logout: async () => {
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('auth_user');
    set({ user: null, token: null });
  },

  loadSession: async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const userStr = await AsyncStorage.getItem('auth_user');
      const largeFont = await AsyncStorage.getItem('large_font');
      const highContrast = await AsyncStorage.getItem('high_contrast');

      if (token && userStr) {
        const user = JSON.parse(userStr) as User;
        set({ user, token, isLoading: false, isLargeFont: largeFont === 'true', isHighContrast: highContrast === 'true' });
      } else {
        set({ isLoading: false, isLargeFont: largeFont === 'true', isHighContrast: highContrast === 'true' });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  toggleLargeFont: () => {
    const newVal = !get().isLargeFont;
    AsyncStorage.setItem('large_font', String(newVal));
    set({ isLargeFont: newVal });
  },

  toggleHighContrast: () => {
    const newVal = !get().isHighContrast;
    AsyncStorage.setItem('high_contrast', String(newVal));
    set({ isHighContrast: newVal });
  },
}));
