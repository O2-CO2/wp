import axios from 'axios';
import { STORAGE_KEYS } from '../utils/constants';

const configuredApiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
const baseURL = import.meta.env.DEV ? '/wp-json' : configuredApiUrl || '/wp-json';

if (!import.meta.env.DEV && !configuredApiUrl) {
  console.warn('VITE_API_URL is not configured. Using same-origin /wp-json in production.');
}

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.token);

  if (token && token !== 'undefined' && token !== 'null') {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url ?? '';
    const isLoginRequest = /\/api\/v1\/token$/.test(url);

    if (status === 401 && !isLoginRequest) {
      localStorage.removeItem(STORAGE_KEYS.token);
      localStorage.removeItem(STORAGE_KEYS.user);
    }

    const apiMessage = error.response?.data?.message ?? error.response?.data?.error_description;
    if (apiMessage) {
      error.message = apiMessage;
    }

    return Promise.reject(error);
  },
);

export default api;
