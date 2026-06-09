import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'web/dist',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    // Proxy SSE + API calls to the Node collector server
    proxy: {
      '/api': 'http://localhost:4317',
      '/events': 'http://localhost:4317',
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'web/src/**/*.test.{ts,tsx}'],
  },
})
