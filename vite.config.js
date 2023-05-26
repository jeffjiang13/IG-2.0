import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build', // Add this line to specify 'build' as the output directory
    chunkSizeWarningLimit: 1600
  },
  resolve: {
    alias: {
      'react-query/devtools': 'react-query/es/devtools/index'
    }
  }
});
