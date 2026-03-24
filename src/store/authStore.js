
import { create } from 'zustand';
import { STORAGE_KEYS } from '../utils/constants';

const readStoredAuth = () => {
  const token = localStorage.getItem(STORAGE_KEYS.token);
  const rawUser = localStorage.getItem(STORAGE_KEYS.user);

  if (!token || token === 'undefined' || token === 'null') {
    return { token: null, user: null, isAuthenticated: false };
  }

  try {
    return {
      token,
      user: rawUser ? JSON.parse(rawUser) : null,
      isAuthenticated: true,
    };
  } catch {
    return { token, user: null, isAuthenticated: true };
  }
};

export const useAuthStore = create((set) => ({
  ...readStoredAuth(),

  setAuth: ({ token, ...userData }) => {
    if (!token) {
      localStorage.removeItem(STORAGE_KEYS.token);
      localStorage.removeItem(STORAGE_KEYS.user);
      set({ token: null, user: null, isAuthenticated: false });
      return;
    }

    localStorage.setItem(STORAGE_KEYS.token, token);
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(userData));

    set({
      token,
      user: userData,
      isAuthenticated: true,
    });
  },

  hydrateAuth: () => {
    set(readStoredAuth());
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.user);
    set({ token: null, user: null, isAuthenticated: false });
  },
}));
