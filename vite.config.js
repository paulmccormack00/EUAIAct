import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'eu-ai-act-data': ['./src/data/eu-ai-act-data.js'],
          'plain-summaries': ['./src/data/plain-summaries.js'],
          'annexes-data': ['./src/data/annexes.js'],
          'recital-maps': ['./src/data/recital-maps.js'],
        },
      },
    },
  },
})
