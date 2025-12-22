import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spin, Progress, List, Tag, Statistic } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  DollarOutlined,
  ShoppingOutlined,
  TeamOutlined,
  ShopOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  InboxOutlined,
  FileTextOutlined,
  CreditCardOutlined,
  RightOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import api from '../services/api';

interface CategoryStock {
  category: string;
  products: number;
  stock_value: number;
}

interface TopProduct {
  id: number;
  code: string;
  name: string;
  total_value: number;
}

interface DashboardData {
  totalStockValue: number;
  totalProducts: number;
  totalCustomers: number;
  totalSuppliers: number;
  categoryStats: CategoryStock[];
  topProducts: TopProduct[];
  lowStockCount: number;
  warningStockCount: number;
  normalStockCount: number;
}

const DashboardDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [darkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [data, setData] = useState<DashboardData>({
    totalStockValue: 0,
    totalProducts: 0,
    totalCustomers: 0,
    totalSuppliers: 0,
    categoryStats: [],
    topProducts: [],
    lowStockCount: 0,
    warningStockCount: 0,
    normalStockCount: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [productsRes, customersRes, suppliersRes, stockRes] = await Promise.all([
        api.get('/api/products'),
        api.get('/api/customers'),
        api.get('/api/suppliers'),
        api.get('/api/stock/balance'),
      ]);

      const products = productsRes.data || [];
      const customers = customersRes.data || [];
      const suppliers = suppliersRes.data || [];
      const stockBalances = stockRes.data || [];

      const totalStockValue = stockBalances.reduce((sum: number, sb: any) => {
        return sum + (parseFloat(sb.qtyOnHand || sb.qty_on_hand || 0) * parseFloat(sb.avgCost || sb.avg_cost || 0));
      }, 0);

      let lowStock = 0, warningStock = 0, normalStock = 0;
      stockBalances.forEach((sb: any) => {
        const qty = parseFloat(sb.qtyOnHand || sb.qty_on_hand || 0);
        if (qty <= 0) lowStock++;
        else if (qty < 5) warningStock++;
        else normalStock++;
      });

      const categoryMap = new Map<string, { products: number; value: number }>();
      products.forEach((p: any) => {
        const catName = p.category?.name || '📦 Others';
        const sb = stockBalances.find((s: any) => s.productId === p.id || s.product_id === p.id);
        const value = sb ? parseFloat(sb.qtyOnHand || sb.qty_on_hand || 0) * parseFloat(sb.avgCost || sb.avg_cost || 0) : 0;
        
        if (!categoryMap.has(catName)) {
          categoryMap.set(catName, { products: 0, value: 0 });
        }
        const cat = categoryMap.get(catName)!;
        cat.products++;
        cat.value += value;
      });

      const categoryStats: CategoryStock[] = Array.from(categoryMap.entries())
        .map(([category, data]) => ({
          category,
          products: data.products,
          stock_value: data.value,
        }))
        .sort((a, b) => b.stock_value - a.stock_value);

      const productValues = products.map((p: any) => {
        const sb = stockBalances.find((s: any) => s.productId === p.id || s.product_id === p.id);
        const value = sb ? parseFloat(sb.qtyOnHand || sb.qty_on_hand || 0) * parseFloat(sb.avgCost || sb.avg_cost || 0) : 0;
        return { id: p.id, code: p.code, name: p.name, total_value: value };
      }).sort((a: TopProduct, b: TopProduct) => b.total_value - a.total_value).slice(0, 5);

      setData({
        totalStockValue,
        totalProducts: products.length,
        totalCustomers: customers.length,
        totalSuppliers: suppliers.length,
        categoryStats,
        topProducts: productValues,
        lowStockCount: lowStock,
        warningStockCount: warningStock,
        normalStockCount: normalStock,
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `฿${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `฿${(value / 1000).toFixed(0)}K`;
    return `฿${value.toFixed(0)}`;
  };

  const formatFullCurrency = (value: number) => {
    return `฿${value.toLocaleString('th-TH', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const getMaxCategoryValue = () => {
    return Math.max(...data.categoryStats.map(c => c.stock_value), 1);
  };

  // Colors based on theme
  const colors = {
    bg: darkMode ? 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)' : 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)',
    cardBg: darkMode ? 'rgba(255,255,255,0.05)' : '#ffffff',
    cardBorder: darkMode ? 'rgba(255,255,255,0.1)' : '#e8e8e8',
    textPrimary: darkMode ? '#e0e0e0' : '#1f2937',
    textSecondary: darkMode ? '#9ca3af' : '#6b7280',
    textValue: darkMode ? '#00d4ff' : '#667eea',
    hoverBg: darkMode ? 'rgba(102,126,234,0.2)' : 'rgba(102,126,234,0.08)',
  };

  // KPI Card Component
  const KPICard = ({ 
    title, 
    value, 
    subtitle, 
    icon, 
    gradient, 
    onClick 
  }: { 
    title: string; 
    value: string | number; 
    subtitle: string; 
    icon: React.ReactNode; 
    gradient: string;
    onClick: () => void;
  }) => (
    <div 
      onClick={onClick}
      style={{ 
        background: gradient,
        border: 'none',
        borderRadius: 16,
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        position: 'relative',
        overflow: 'hidden',
        padding: 20,
        minHeight: 140,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.85)', margin: 0, fontSize: 14, fontWeight: 500 }}>{title}</p>
          <h2 style={{ color: '#fff', margin: '8px 0 4px', fontSize: 28, fontWeight: 700 }}>
            {value}
          </h2>
          <Tag color="rgba(255,255,255,0.2)" style={{ border: 'none', color: '#fff' }}>
            {subtitle}
          </Tag>
        </div>
        <div style={{ fontSize: 48, color: 'rgba(255,255,255,0.3)' }}>{icon}</div>
      </div>
      <div style={{ 
        position: 'absolute', 
        bottom: 12, 
        right: 16, 
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 4
      }}>
        ดูรายละเอียด <RightOutlined />
      </div>
    </div>
  );

  // KPI Cards Data
  const kpiCards = [
    {
      title: '💰 มูลค่าสต็อก',
      value: formatCurrency(data.totalStockValue),
      subtitle: 'Active',
      icon: <DollarOutlined />,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      onClick: () => navigate('/stock-balance'),
    },
    {
      title: '📦 สินค้าทั้งหมด',
      value: data.totalProducts.toLocaleString(),
      subtitle: `${data.categoryStats.length} หมวดหมู่`,
      icon: <ShoppingOutlined />,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      onClick: () => navigate('/products'),
    },
    {
      title: '👥 ลูกค้า',
      value: data.totalCustomers.toLocaleString(),
      subtitle: '5 กลุ่ม',
      icon: <TeamOutlined />,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      onClick: () => navigate('/customers'),
    },
    {
      title: '🏭 ผู้จำหน่าย',
      value: data.totalSuppliers.toLocaleString(),
      subtitle: 'Active',
      icon: <ShopOutlined />,
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      onClick: () => navigate('/suppliers'),
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', background: colors.bg }}>
        <Spin size="large" tip="กำลังโหลดข้อมูล..." />
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: colors.bg,
      padding: '24px',
    }}>
      {/* Header */}
      <div style={{ 
        maxWidth: 1400, 
        margin: '0 auto',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
      }}>
        <div 
          onClick={() => navigate('/intro')}
          style={{ 
            width: 40, 
            height: 40, 
            borderRadius: '50%', 
            background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: colors.textPrimary,
          }}
        >
          <ArrowLeftOutlined />
        </div>
        <div>
          <h1 style={{ 
            fontSize: 28, 
            fontWeight: 700, 
            color: colors.textPrimary,
            margin: 0,
          }}>
            📊 Dashboard Overview
          </h1>
          <p style={{ color: colors.textSecondary, margin: 0 }}>ภาพรวมธุรกิจ SVS Business Suite</p>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* KPI Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {kpiCards.map((card, index) => (
            <Col xs={12} sm={12} md={6} key={index}>
              <KPICard {...card} />
            </Col>
          ))}
        </Row>

        {/* Charts Row */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {/* Category Bar Chart */}
          <Col xs={24} lg={14}>
            <Card 
              title={<span style={{ color: colors.textPrimary, fontWeight: 600 }}>📊 มูลค่าสต็อกตามหมวด</span>}
              style={{ 
                background: colors.cardBg,
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: 16,
              }}
              headStyle={{ background: 'transparent', border: 'none' }}
              bodyStyle={{ padding: 20 }}
            >
              {data.categoryStats.slice(0, 8).map((cat, index) => (
                <div 
                  key={index} 
                  onClick={() => navigate(`/products`)}
                  style={{ 
                    padding: '12px 16px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    marginBottom: 8,
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = colors.hoverBg}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, color: colors.textPrimary }}>{cat.category}</span>
                    <span style={{ fontWeight: 600, color: colors.textValue }}>{formatCurrency(cat.stock_value)}</span>
                  </div>
                  <Progress 
                    percent={(cat.stock_value / getMaxCategoryValue()) * 100} 
                    showInfo={false}
                    strokeColor={{
                      '0%': '#667eea',
                      '100%': '#764ba2',
                    }}
                    trailColor={darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'}
                    size="small"
                  />
                </div>
              ))}
            </Card>
          </Col>

          {/* Top Products */}
          <Col xs={24} lg={10}>
            <Card 
              title={<span style={{ color: colors.textPrimary, fontWeight: 600 }}>🏆 Top 5 สินค้ามูลค่าสูงสุด</span>}
              style={{ 
                background: colors.cardBg,
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: 16,
              }}
              headStyle={{ background: 'transparent', border: 'none' }}
              bodyStyle={{ padding: 20 }}
            >
              <List
                dataSource={data.topProducts}
                renderItem={(item, index) => (
                  <div 
                    onClick={() => navigate(`/products`)}
                    style={{ 
                      borderBottom: `1px solid ${colors.cardBorder}`,
                      padding: '12px 8px',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                      borderRadius: 8,
                      margin: '0 -8px',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = colors.hoverBg}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <div style={{ 
                        width: 28, 
                        height: 28, 
                        borderRadius: '50%', 
                        background: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : '#667eea',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        marginRight: 12,
                        fontSize: 12,
                        fontWeight: 700,
                        color: index < 3 ? '#000' : '#fff',
                        flexShrink: 0,
                      }}>
                        {index + 1}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, color: colors.textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: 11, color: colors.textSecondary }}>{item.code}</div>
                      </div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: colors.textValue, flexShrink: 0, marginLeft: 8 }}>
                        {formatCurrency(item.total_value)}
                      </div>
                    </div>
                  </div>
                )}
              />
            </Card>
          </Col>
        </Row>

        {/* Bottom Row */}
        <Row gutter={[16, 16]}>
          {/* Stock Status */}
          <Col xs={24} sm={24} lg={8}>
            <Card 
              title={<span style={{ color: colors.textPrimary, fontWeight: 600 }}>📦 สถานะสต็อก</span>}
              style={{ 
                background: colors.cardBg,
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: 16,
                cursor: 'pointer',
              }}
              headStyle={{ background: 'transparent', border: 'none' }}
              bodyStyle={{ padding: 20 }}
              onClick={() => navigate('/stock-balance')}
            >
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <Progress
                  type="dashboard"
                  percent={Math.round((data.normalStockCount / (data.lowStockCount + data.warningStockCount + data.normalStockCount || 1)) * 100)}
                  strokeColor="#52c41a"
                  trailColor={darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'}
                  format={(percent) => (
                    <span>
                      <span style={{ fontSize: 24, fontWeight: 700, color: colors.textPrimary }}>{percent}%</span>
                      <br/>
                      <span style={{ fontSize: 12, color: colors.textSecondary }}>ปกติ</span>
                    </span>
                  )}
                />
              </div>
              <Row gutter={16}>
                <Col span={8} style={{ textAlign: 'center' }}>
                  <Statistic 
                    title={<span style={{ fontSize: 12, color: colors.textSecondary }}>🔴 ต่ำ</span>}
                    value={data.lowStockCount}
                    valueStyle={{ color: '#ff4d4f', fontSize: 20 }}
                  />
                </Col>
                <Col span={8} style={{ textAlign: 'center' }}>
                  <Statistic 
                    title={<span style={{ fontSize: 12, color: colors.textSecondary }}>🟡 เตือน</span>}
                    value={data.warningStockCount}
                    valueStyle={{ color: '#faad14', fontSize: 20 }}
                  />
                </Col>
                <Col span={8} style={{ textAlign: 'center' }}>
                  <Statistic 
                    title={<span style={{ fontSize: 12, color: colors.textSecondary }}>🟢 ปกติ</span>}
                    value={data.normalStockCount}
                    valueStyle={{ color: '#52c41a', fontSize: 20 }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Alerts */}
          <Col xs={24} sm={12} lg={8}>
            <Card 
              title={<span style={{ color: colors.textPrimary, fontWeight: 600 }}>⚠️ แจ้งเตือน & งานค้าง</span>}
              style={{ 
                background: colors.cardBg,
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: 16,
              }}
              headStyle={{ background: 'transparent', border: 'none' }}
              bodyStyle={{ padding: 20 }}
            >
              <div 
                onClick={() => navigate('/stock-balance')}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '12px 16px', 
                  background: 'rgba(255,77,79,0.1)', 
                  borderRadius: 8, 
                  marginBottom: 8,
                  cursor: 'pointer',
                }}
              >
                <span style={{ color: '#ff4d4f' }}><WarningOutlined /> สต็อกต่ำ (ต้องสั่งซื้อ)</span>
                <Tag color="red">{data.lowStockCount}</Tag>
              </div>
              <div 
                onClick={() => navigate('/stock-balance')}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '12px 16px', 
                  background: 'rgba(250,173,20,0.1)', 
                  borderRadius: 8, 
                  marginBottom: 8,
                  cursor: 'pointer',
                }}
              >
                <span style={{ color: '#faad14' }}><ClockCircleOutlined /> สต็อกใกล้หมด</span>
                <Tag color="gold">{data.warningStockCount}</Tag>
              </div>
              <div 
                onClick={() => navigate('/stock-balance')}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '12px 16px', 
                  background: 'rgba(82,196,26,0.1)', 
                  borderRadius: 8,
                  cursor: 'pointer',
                }}
              >
                <span style={{ color: '#52c41a' }}><CheckCircleOutlined /> สต็อกปกติ</span>
                <Tag color="green">{data.normalStockCount}</Tag>
              </div>
            </Card>
          </Col>

          {/* Quick Stats */}
          <Col xs={24} sm={12} lg={8}>
            <Card 
              title={<span style={{ color: colors.textPrimary, fontWeight: 600 }}>📋 สรุปข้อมูล</span>}
              style={{ 
                background: colors.cardBg,
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: 16,
              }}
              headStyle={{ background: 'transparent', border: 'none' }}
              bodyStyle={{ padding: 20 }}
            >
              <div 
                onClick={() => navigate('/categories')}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '12px 16px', 
                  background: 'rgba(102,126,234,0.1)', 
                  borderRadius: 8, 
                  marginBottom: 8,
                  cursor: 'pointer',
                }}
              >
                <span style={{ color: '#667eea' }}><InboxOutlined /> หมวดหมู่สินค้า</span>
                <Tag color="purple">{data.categoryStats.length}</Tag>
              </div>
              <div 
                onClick={() => navigate('/customers')}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '12px 16px', 
                  background: 'rgba(0,188,212,0.1)', 
                  borderRadius: 8, 
                  marginBottom: 8,
                  cursor: 'pointer',
                }}
              >
                <span style={{ color: '#00bcd4' }}><FileTextOutlined /> กลุ่มลูกค้า</span>
                <Tag color="cyan">5</Tag>
              </div>
              <div 
                onClick={() => navigate('/stock-balance')}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '12px 16px', 
                  background: 'rgba(250,173,20,0.1)', 
                  borderRadius: 8,
                  cursor: 'pointer',
                }}
              >
                <span style={{ color: '#faad14' }}><CreditCardOutlined /> มูลค่าสต็อกรวม</span>
                <Tag color="gold">{formatFullCurrency(data.totalStockValue)}</Tag>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default DashboardDetailPage;
