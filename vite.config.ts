import path from 'path';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import { vitePlugin as remix } from '@remix-run/dev';

export default defineConfig({
  plugins: [
    remix({
      ssr: false,
    }),
    checker({ typescript: true }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './app'),
    },
  },
  preview: {
    port: 3000,
    open: true,
  },
  server: {
    port: 3000,
    open: true,
  },
});
