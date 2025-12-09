import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown, Button, Switch } from 'antd';
import {
  DashboardOutlined,
  ShoppingOutlined,
  TeamOutlined,
  ShopOutlined,
  HomeOutlined,
  FileTextOutlined,
  ShoppingCartOutlined,
  InboxOutlined,
  ExportOutlined,
  SwapOutlined,
  DollarOutlined,
  DatabaseOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SunOutlined,
  MoonOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const { Sider, Content, Header, Footer } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useTheme();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'แดชบอร์ด',
    },
    {
      key: 'master',
      icon: <DatabaseOutlined />,
      label: 'ข้อมูลหลัก',
      children: [
        { key: '/products', icon: <ShoppingOutlined />, label: 'สินค้า' },
        { key: '/categories', icon: <AppstoreOutlined />, label: 'หมวดหมู่สินค้า' },
        { key: '/customers', icon: <TeamOutlined />, label: 'ลูกค้า' },
        { key: '/suppliers', icon: <ShopOutlined />, label: 'ผู้จำหน่าย' },
        { key: '/warehouses', icon: <HomeOutlined />, label: 'คลังสินค้า' },
      ],
    },
    {
      key: 'sales',
      icon: <DollarOutlined />,
      label: 'การขาย',
      children: [
        { key: '/quotations', icon: <FileTextOutlined />, label: 'ใบเสนอราคา' },
        { key: '/sales-invoices', icon: <DollarOutlined />, label: 'ใบขายสินค้า' },
      ],
    },
    {
      key: 'purchase',
      icon: <ShoppingCartOutlined />,
      label: 'การซื้อ',
      children: [
        { key: '/purchase-orders', icon: <ShoppingCartOutlined />, label: 'ใบสั่งซื้อ' },
        { key: '/goods-receipts', icon: <InboxOutlined />, label: 'ใบรับสินค้า' },
      ],
    },
    {
      key: 'stock',
      icon: <InboxOutlined />,
      label: 'คลังสินค้า',
      children: [
        { key: '/stock-balance', icon: <DatabaseOutlined />, label: 'ยอดคงเหลือ' },
        { key: '/stock-issues', icon: <ExportOutlined />, label: 'เบิกสินค้า' },
        { key: '/stock-transfers', icon: <SwapOutlined />, label: 'โอนสินค้า' },
      ],
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'โปรไฟล์',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'ออกจากระบบ',
      danger: true,
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      logout();
      navigate('/login');
    } else if (key === 'profile') {
      navigate('/profile');
    }
  };

  return (
    <Layout className="bg-hologram bg-grid" style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={260}
        style={{
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-color)',
        }}
      >
        {/* Logo */}
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          {collapsed ? (
            <span className="text-gradient" style={{ fontSize: 24, fontWeight: 700 }}>
              SVS
            </span>
          ) : (
            <span className="text-gradient" style={{ fontSize: 20, fontWeight: 600 }}>
              SVS Stock
            </span>
          )}
        </div>

        {/* Menu */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={['master', 'sales', 'purchase', 'stock']}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ borderRight: 0, marginTop: 8 }}
        />
      </Sider>

      <Layout>
        {/* Header */}
        <Header
          style={{
            padding: '0 24px',
            background: 'var(--bg-holo)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ color: 'var(--text-primary)', fontSize: 16 }}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Theme Switch */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <SunOutlined style={{ color: mode === 'light' ? '#fbbf24' : 'var(--text-secondary)' }} />
              <Switch
                checked={mode === 'dark'}
                onChange={toggleTheme}
                size="small"
                style={{ 
                  background: mode === 'dark' ? '#7c3aed' : '#cbd5e1',
                }}
              />
              <MoonOutlined style={{ color: mode === 'dark' ? '#a78bfa' : 'var(--text-secondary)' }} />
            </div>

            <Dropdown
            menu={{ items: userMenuItems, onClick: handleMenuClick }}
            placement="bottomRight"
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                cursor: 'pointer',
                padding: '4px 12px',
                borderRadius: 8,
                transition: 'background 0.3s',
              }}
            >
              <Avatar
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                }}
                icon={<UserOutlined />}
              />
              <span style={{ color: 'var(--text-primary)' }}>
                {user?.fullName || user?.username || 'Admin'}
              </span>
            </div>
          </Dropdown>
          </div>
        </Header>

        {/* Content */}
        <Content
          style={{
            margin: 0,
            minHeight: 280,
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Content>

        {/* Footer */}
        <Footer
          style={{
            textAlign: 'center',
            background: 'var(--bg-holo)',
            borderTop: '1px solid var(--border-color)',
            padding: '16px 24px',
            color: 'var(--text-secondary)',
            fontSize: 13,
          }}
        >
          © 2025 Autthapol Saiyat (Boy) - Technology & AI Program Director | Mobile: 085-070-9938 | LINE: boy_saiyat
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
