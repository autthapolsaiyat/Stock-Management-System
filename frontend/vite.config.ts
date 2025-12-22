import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
      },
      includeAssets: ['favicon.ico', 'icons/*.png'],
      manifest: {
        name: 'SVS Business Suite',
        short_name: 'SVS',
        description: 'ระบบจัดการธุรกิจ แสงวิทย์ ซายน์',
        theme_color: '#22c55e',
        background_color: '#0a0a0f',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/intro',
        icons: [
          {
            src: 'icons/icon-72x72.png',
            sizes: '72x72',
            type: 'image/png'
          },
          {
            src: 'icons/icon-96x96.png',
            sizes: '96x96',
            type: 'image/png'
          },
          {
            src: 'icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: 'icons/icon-144x144.png',
            sizes: '144x144',
            type: 'image/png'
          },
          {
            src: 'icons/icon-152x152.png',
            sizes: '152x152',
            type: 'image/png'
          },
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      devOptions: {
        enabled: false,
      }
    })
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://svs-api.happycoast-35a65ad5.southeastasia.azurecontainerapps.io',
        changeOrigin: true,
        secure: false,
      },
      '/quotations': {
        target: 'https://svs-api.happycoast-35a65ad5.southeastasia.azurecontainerapps.io',
        changeOrigin: true,
        secure: false,
      },
      '/users': {
        target: 'https://svs-api.happycoast-35a65ad5.southeastasia.azurecontainerapps.io',
        changeOrigin: true,
        secure: false,
      },
      '/roles': {
        target: 'https://svs-api.happycoast-35a65ad5.southeastasia.azurecontainerapps.io',
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: 'https://svs-api.happycoast-35a65ad5.southeastasia.azurecontainerapps.io',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
