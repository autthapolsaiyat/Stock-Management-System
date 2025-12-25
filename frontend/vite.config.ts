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
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB limit
      },
      includeAssets: ['icons/*.png', 'screenshot-*.png'],
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
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icons/icon-96x96.png',
            sizes: '96x96',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icons/icon-144x144.png',
            sizes: '144x144',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icons/icon-152x152.png',
            sizes: '152x152',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        screenshots: [
          {
            src: 'screenshot-wide.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide',
            label: 'SVS Business Suite Dashboard'
          },
          {
            src: 'screenshot-narrow.png',
            sizes: '750x1334',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'SVS Business Suite Mobile'
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
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-antd': ['antd', '@ant-design/icons'],
          'vendor-charts': ['recharts'],
        },
      },
    },
  },
});
// Updated: Thu Dec 25 21:13:21 +07 2025
