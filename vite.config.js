import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  base: './',
  plugins: [viteSingleFile()],
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
