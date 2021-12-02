import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react({
      exclude: [/\.(stories|spec|test)\.(t|j)sx?$/, /__tests__/]
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    minify: 'terser',
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'react-rover',
      fileName: (format) => `react-rover.${format}.js`
    },
    rollupOptions: {
      // Externalize the deps that shouldn't be bundled into the library
      external: ['react', 'react-dom'],
      output: {
        // Provide global variables to use in the UMD build
        // for those externalized deps
        globals: {
          react: 'React'
        }
      }
    }
  }
});
