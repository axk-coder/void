import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    port: 5173,
    host: true,
    hmr: false,
    ws: false,
    watch: {
      ignored: ['**/dist/**', '**/map.txt', '**/.git/**', '**/*.log']
    }
  },
  build: {
    target: 'esnext',
    outDir: 'dist'
  }
});
