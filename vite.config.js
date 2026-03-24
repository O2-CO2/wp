import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const apiUrl = env.VITE_API_URL;

  if (!apiUrl) {
    throw new Error('VITE_API_URL is required in .env for dev proxy and production build.');
  }

  const apiOrigin = new URL(apiUrl).origin;

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/wp-json': {
          target: apiOrigin,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
})
