import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, 'temp-build')
  },
  server: {proxy: {
    '/api': {
      target: 'https://api.trackier.com',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ""),
      secure: false,
  }}
}
});