import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown, Button, Switch, Tag } from 'antd';
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
  HistoryOutlined,
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { SettingOutlined } from '@ant-design/icons';
import { useTheme } from '../contexts/ThemeContext';
import FloatingFlowProgress from '../components/FloatingFlowProgress';
import FloatingHomeButton from '../components/FloatingHomeButton';

const { Sider, Content, Header, Footer } = Layout;

const quotationTypeLabels: Record<string, { text: string; icon: string; color: string }> = {
  STANDARD: { text: 'ทั่วไป', icon: '📦', color: 'blue' },
  FORENSIC: { text: 'นิติวิทย์', icon: '🔬', color: 'purple' },
  MAINTENANCE: { text: 'บำรุงรักษา', icon: '🔧', color: 'green' },
};

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isSalesOnly, getQuotationType } = useAuth();
  const { mode, toggleTheme } = useTheme();

  const salesOnly = isSalesOnly();
  const quotationType = getQuotationType();

  // Full menu for admin/manager
  const fullMenuItems = [
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
      key: 'settings-menu',
      icon: <SettingOutlined />,
      label: 'ตั้งค่า',
      children: [
        { key: '/settings', icon: <SettingOutlined />, label: 'ตั้งค่าส่วนตัว' },
        { key: '/settings/company', icon: <SettingOutlined />, label: 'ตั้งค่าบริษัท' },
        { key: '/admin/activity-logs', icon: <HistoryOutlined />, label: 'บันทึกกิจกรรม' },
      ],
    },
    {
      key: 'stock',
      icon: <InboxOutlined />,
      label: 'คลังสินค้า',
      children: [
        { key: '/stock-balance', icon: <DatabaseOutlined />, label: 'ยอดคงเหลือ' },
        { key: '/stock-card', icon: <FileTextOutlined />, label: 'Stock Card' },
        { key: '/stock-valuation', icon: <DollarOutlined />, label: 'มูลค่าสต็อก' },
        { key: '/stock-movement', icon: <SwapOutlined />, label: 'การเคลื่อนไหว' },
        { key: '/stock-issues', icon: <ExportOutlined />, label: 'เบิกสินค้า' },
        { key: '/stock-transfers', icon: <SwapOutlined />, label: 'โอนสินค้า' },
        { key: '/stock-adjustments', icon: <SwapOutlined />, label: 'ปรับปรุงสต็อก' },
        { key: '/stock-counts', icon: <FileTextOutlined />, label: 'นับสต็อก' },
      ],
    },
  ];

  // Limited menu for sales users
  const salesMenuItems = [
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'ตั้งค่าส่วนตัว',
    },
    {
      key: '/quotations',
      icon: <FileTextOutlined />,
      label: 'ใบเสนอราคา',
    },
  ];

  const menuItems = salesOnly ? salesMenuItems : fullMenuItems;

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

  const typeConfig = quotationType ? quotationTypeLabels[quotationType] : null;

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

        {/* User Type Badge */}
        {!collapsed && typeConfig && (
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)' }}>
            <Tag color={typeConfig.color} style={{ width: '100%', textAlign: 'center', padding: '4px 8px' }}>
              {typeConfig.icon} กลุ่ม{typeConfig.text}
            </Tag>
          </div>
        )}

        {/* Menu */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={salesOnly ? [] : ['master', 'sales', 'purchase', 'stock']}
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
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--text-primary)', lineHeight: 1.2 }}>
                    {user?.fullName || user?.username || 'Admin'}
                  </span>
                  {typeConfig && (
                    <span style={{ color: 'var(--text-secondary)', fontSize: 11 }}>
                      {typeConfig.icon} {typeConfig.text}
                    </span>
                  )}
                </div>
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

        {/* Floating Home Button */}
        <FloatingHomeButton />

        {/* Floating Flow Progress */}
        <FloatingFlowProgress />

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
