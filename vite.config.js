// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  // build: {
  //   rollupOptions: {
  //     external: ['react-quill','react-quill/dist/quill.snow.css'] // Add react-quill to external if necessary
  //   }
  // }
});