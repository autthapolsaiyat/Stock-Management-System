import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://svs-stock-api.bravetree-eb71039c.southeastasia.azurecontainerapps.io',
        changeOrigin: true,
      }
    }
  }
})
