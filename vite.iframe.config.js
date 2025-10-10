// vite.iframe.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  root: resolve(__dirname, 'src/iframe-app'),
  publicDir: resolve(__dirname, 'src/iframe-app/public'),
  build: {
    outDir: resolve(__dirname, 'dist/iframe'),
    emptyOutDir: true,
    minify: false // Disable minification for now
  },
  plugins: [vue()],
  server: {
    port: 3001,
    cors: true
  }
});