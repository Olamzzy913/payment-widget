import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  root: resolve(__dirname, 'src/iframe-app'),
  publicDir: resolve(__dirname, 'public'),
  build: {
    outDir: resolve(__dirname, 'dist/iframe'),
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'src/iframe-app/index.html')
    },
    assetsDir: 'assets',
    sourcemap: false
  },
  server: {
    port: 3001,
    cors: true
  },
  preview: {
    port: 3001,
    cors: true
  }
});