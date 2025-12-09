import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider, theme } from 'antd'
import thTH from 'antd/locale/th_TH'
import App from './App'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
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

// Inner app component that uses theme context
const ThemedApp: React.FC = () => {
  const { mode } = useTheme();
  const currentTheme = mode === 'dark' ? darkTheme : lightTheme;

  return (
    <ConfigProvider theme={currentTheme} locale={thTH}>
      <AuthProvider>
        <App />
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
