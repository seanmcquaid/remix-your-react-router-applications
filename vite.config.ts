import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    reactRouter({
      ssr: true,
    }),
    checker({ typescript: true }),
    tsconfigPaths(),
  ],
  preview: {
    port: 3000,
    open: true,
  },
  server: {
    port: 3000,
    open: true,
  },
});
