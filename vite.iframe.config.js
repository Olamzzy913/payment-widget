import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  root: resolve(__dirname, 'src/iframe-app'),
  publicDir: false,
  build: {
    outDir: resolve(__dirname, 'dist/iframe'),
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'src/iframe-app/index.html')
    },
    // Add these for better production build
    assetsDir: 'assets',
    sourcemap: false
  },
  // Set base path for assets
  base: './',
});