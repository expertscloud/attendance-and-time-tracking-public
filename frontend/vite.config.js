import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import eslintPlugin from 'vite-plugin-eslint';
import electron from 'vite-plugin-electron/simple';
import { Schema, ValidateEnv } from '@julr/vite-plugin-validate-env';

const __dirname = path.dirname('./');

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    ValidateEnv({
      validator: 'builtin',
      schema: {
        VITE_FRONTEND_URL: Schema.string(),
        VITE_BACKEND_URL: Schema.string(),
        // Google Geolocation API key — required for getCurrentPosition on
        // Linux (Chromium's network provider). Optional so web/dev builds
        // don't fail.
        VITE_GOOGLE_API_KEY: Schema.string.optional(),
      },
    }),
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    eslintPlugin({ failOnError: true, failOnWarning: false }),
    electron({
      main: {
        entry: 'electron/main.js',
      },
      preload: {
        input: path.join(__dirname, 'electron/preload.js'),
      },
    }),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'baseline-widely-available',
  },
  server: {
    port: 3000,
  },
  base: './',
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
