import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import thTH from 'antd/locale/th_TH';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ActiveQuotationProvider } from './contexts/ActiveQuotationContext';
import './styles/global.css';

// ✅ PWA: Register Service Worker with Auto Update (vite-plugin-pwa)
import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  // ✅ เมื่อ SW ลงทะเบียนสำเร็จ - check update ทุก 1 ชั่วโมง
  onRegisteredSW(swUrl, registration) {
    if (registration) {
      setInterval(async () => {
        if (registration.installing || !navigator) return;
        
        // เช็คว่าออนไลน์อยู่ไหม
        if ('connection' in navigator && !navigator.onLine) return;
        
        // Fetch SW ใหม่โดยไม่ใช้ cache
        const resp = await fetch(swUrl, {
          cache: 'no-store',
          headers: {
            'cache': 'no-store',
            'cache-control': 'no-cache',
          },
        });
        
        if (resp?.status === 200) {
          await registration.update();
        }
      }, 60 * 60 * 1000); // Check ทุก 1 ชั่วโมง
    }
  },
  
  // ✅ เมื่อมี update พร้อมติดตั้ง
  onNeedRefresh() {
    // Auto update mode จะ reload อัตโนมัติ
    // แต่ถ้าต้องการแจ้ง user ก่อน:
    if (confirm('🔄 มีเวอร์ชันใหม่! กด OK เพื่ออัพเดท')) {
      updateSW(true);
    }
  },
  
  // ✅ เมื่อ SW พร้อมทำงาน offline
  onOfflineReady() {
    console.log('✅ App พร้อมใช้งาน Offline แล้ว');
  },
  
  // ✅ เมื่อเกิด error
  onRegisterError(error) {
    console.error('❌ Service Worker registration failed:', error);
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ConfigProvider
        locale={thTH}
        theme={{
          algorithm: theme.darkAlgorithm,
          token: {
            colorPrimary: '#3b82f6',
            borderRadius: 8,
          },
        }}
      >
        <ThemeProvider>
          <AuthProvider>
            <ActiveQuotationProvider>
              <App />
            </ActiveQuotationProvider>
          </AuthProvider>
        </ThemeProvider>
      </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>
);
