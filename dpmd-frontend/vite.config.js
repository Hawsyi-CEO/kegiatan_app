import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      // Proxy semua permintaan yang diawali dengan '/api' ke backend Laravel
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        // Hapus prefix '/api' dari path sebelum dikirim ke backend
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});