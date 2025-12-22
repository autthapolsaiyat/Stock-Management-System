import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // ✅ Auto Update - reload ทันทีเมื่อมี version ใหม่
      registerType: 'autoUpdate',
      
      // ✅ Workbox Options
      workbox: {
        // ลบ cache เก่าอัตโนมัติ
        cleanupOutdatedCaches: true,
        // ติดตั้ง SW ใหม่ทันที ไม่ต้องรอ
        skipWaiting: true,
        // ให้ SW ควบคุม client ทันที
        clientsClaim: true,
        // Cache รูปแบบไฟล์เหล่านี้
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
      },
      
      // ✅ Include assets
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      
      // ✅ Manifest
      manifest: {
        name: 'SVS Business Suite',
        short_name: 'SVS',
        description: 'ระบบจัดการธุรกิจ แสงวิทย์ ซายน์',
        theme_color: '#22c55e',
        background_color: '#0a0a0f',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      
      // ✅ Dev options (เปิดใช้ SW ใน dev mode ด้วยถ้าต้องการทดสอบ)
      devOptions: {
        enabled: false, // เปลี่ยนเป็น true ถ้าต้องการทดสอบ PWA ใน dev
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
