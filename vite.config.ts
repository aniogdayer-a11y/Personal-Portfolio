import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  optimizeDeps: { entries: ['index.html'] },
  server: { host: '::', port: 5173, strictPort: true, watch: { ignored: ['**/tmp/**'] } },
  plugins: [
    react(),
    tailwindcss(),
  ],
})
