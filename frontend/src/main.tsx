import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider, theme, Modal, Button } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import thTH from 'antd/locale/th_TH'
import App from './App'
import { AuthProvider } from './contexts/AuthContext'
import { ActiveQuotationProvider } from './contexts/ActiveQuotationContext'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import { registerSW } from 'virtual:pwa-register'
import './styles/global.css'

// Theme configurations
const darkTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#7c3aed',
    colorSuccess: '#10b981',
    colorWarning: '#fbbf24',
    colorError: '#f97373',
    colorInfo: '#22d3ee',
    colorBgBase: '#020617',
    colorBgContainer: 'rgba(15,23,42,0.96)',
    colorBgElevated: 'rgba(15,23,42,0.96)',
    colorBgLayout: '#020617',
    colorBorder: 'rgba(55,65,81,0.9)',
    colorText: '#e5e7eb',
    colorTextSecondary: '#9ca3af',
    fontFamily: "'Prompt', system-ui, sans-serif",
    borderRadius: 8,
  },
  components: {
    Button: { borderRadius: 999, controlHeight: 40 },
    Input: { borderRadius: 8 },
    Card: { borderRadius: 16 },
    Menu: { itemBg: 'transparent', subMenuItemBg: 'transparent' },
    Table: { headerBg: 'rgba(15,23,42,0.8)', rowHoverBg: 'rgba(124,58,237,0.1)' },
  },
}

const lightTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#7c3aed',
    colorSuccess: '#10b981',
    colorWarning: '#fbbf24',
    colorError: '#ef4444',
    colorInfo: '#0891b2',
    colorBgBase: '#f8fafc',
    colorBgContainer: 'rgba(255,255,255,0.96)',
    colorBgElevated: 'rgba(255,255,255,0.96)',
    colorBgLayout: '#f1f5f9',
    colorBorder: 'rgba(203,213,225,0.9)',
    colorText: '#1e293b',
    colorTextSecondary: '#64748b',
    fontFamily: "'Prompt', system-ui, sans-serif",
    borderRadius: 8,
  },
  components: {
    Button: { borderRadius: 999, controlHeight: 40 },
    Input: { borderRadius: 8 },
    Card: { borderRadius: 16 },
    Menu: { itemBg: 'transparent', subMenuItemBg: 'transparent' },
    Table: { headerBg: 'rgba(248,250,252,0.95)', rowHoverBg: 'rgba(124,58,237,0.08)' },
  },
}

// PWA Update Popup Component
const PWAUpdatePopup: React.FC = () => {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [updateSW, setUpdateSW] = useState<(() => Promise<void>) | null>(null);

  useEffect(() => {
    const update = registerSW({
      onNeedRefresh() {
        setNeedRefresh(true);
      },
      onOfflineReady() {
        console.log('App ready for offline use');
      },
      onRegisteredSW(swUrl, registration) {
        if (registration) {
          setInterval(() => {
            registration.update();
          }, 60 * 1000);
        }
      },
    });
    setUpdateSW(() => update);
  }, []);

  const handleUpdate = async () => {
    if (updateSW) {
      await updateSW();
      window.location.reload();
    }
  };

  return (
    <Modal
      open={needRefresh}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <ReloadOutlined style={{ fontSize: 24, color: '#fff' }} />
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 600 }}>มีเวอร์ชันใหม่! 🎉</div>
            <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 400 }}>SVS Business Suite</div>
          </div>
        </div>
      }
      footer={null}
      closable={false}
      centered
      width={400}
    >
      <div style={{ padding: '16px 0' }}>
        <p style={{ marginBottom: 20, color: '#4b5563' }}>
          แอปพลิเคชันมีการอัปเดตใหม่ กดปุ่มด้านล่างเพื่อรีเฟรชและใช้งานเวอร์ชันล่าสุด
        </p>
        
        <div style={{ 
          background: '#f0fdf4', 
          borderRadius: 12, 
          padding: 16, 
          marginBottom: 20,
          border: '1px solid #bbf7d0'
        }}>
          <div style={{ fontSize: 13, color: '#166534' }}>
            ✨ <strong>มีอะไรใหม่:</strong>
          </div>
          <ul style={{ margin: '8px 0 0 0', paddingLeft: 20, color: '#166534', fontSize: 13 }}>
            <li>ปรับปรุงประสิทธิภาพการทำงาน</li>
            <li>แก้ไขข้อผิดพลาดที่พบ</li>
            <li>เพิ่มฟีเจอร์ใหม่</li>
          </ul>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <Button 
            onClick={() => setNeedRefresh(false)}
            style={{ flex: 1, height: 44, borderRadius: 10 }}
          >
            ภายหลัง
          </Button>
          <Button 
            type="primary" 
            onClick={handleUpdate}
            icon={<ReloadOutlined />}
            style={{ 
              flex: 2, 
              height: 44, 
              borderRadius: 10,
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              border: 'none',
            }}
          >
            อัปเดตเลย
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Inner app component that uses theme context
const ThemedApp: React.FC = () => {
  const { mode } = useTheme();
  const currentTheme = mode === 'dark' ? darkTheme : lightTheme;

  return (
    <ConfigProvider theme={currentTheme} locale={thTH}>
      <AuthProvider>
        <ActiveQuotationProvider>
          <PWAUpdatePopup />
          <App />
        </ActiveQuotationProvider>
      </AuthProvider>
    </ConfigProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ThemedApp />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
