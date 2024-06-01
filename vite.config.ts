import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import tsconfigPaths from 'vite-tsconfig-paths';
import { vitePlugin as remix } from '@remix-run/dev';
import { installGlobals } from '@remix-run/node';

installGlobals();

export default defineConfig({
  plugins: [
    remix({
      ssr: false,
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
