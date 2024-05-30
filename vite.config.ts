import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: 'src/',
  base: './',
  publicDir: '../public',
  server: {
    host: true,
    open: true
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext'
    }
  },
  esbuild: {
    supported: {
      'top-level-await': true
    }
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: true,
    assetsInlineLimit: 0,
    target: 'esnext'
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src'),
      components: path.resolve(__dirname, './src/components'),
      lib: path.resolve(__dirname, './src/lib'),
      scenarios: path.resolve(__dirname, './src/scenarios')
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
  },
  assetsInclude: []
});
