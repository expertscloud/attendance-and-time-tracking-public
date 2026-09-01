import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import eslintPlugin from 'vite-plugin-eslint';

const __dirname = path.dirname('./');

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    eslintPlugin({ failOnError: true, failOnWarning: false }),
  ],
  build: {
    outDir: 'build',
    emptyOutDir: true,
    target: 'baseline-widely-available', // Vite 7 default target
  },
  server: {
    port: 3000,
    open: true,
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
