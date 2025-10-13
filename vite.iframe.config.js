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
    }
  },
  server: {
    port: 3001,
    cors: true,
    // Add these server options to fix the dependency issue
    fs: {
      allow: ['..']
    }
  },
  // Optimize dependencies to prevent the outdated error
  optimizeDeps: {
    include: ['vue']
  }
});