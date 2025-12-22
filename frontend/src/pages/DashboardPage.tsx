import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spin, Progress, List, Tag, Statistic, Carousel } from 'antd';
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

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
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
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
    <Card 
      hoverable
      onClick={onClick}
      style={{ 
        background: gradient,
        border: 'none',
        borderRadius: 16,
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        position: 'relative',
        overflow: 'hidden',
      }}
      bodyStyle={{ padding: 20, minHeight: 140 }}
      className="kpi-card"
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
    </Card>
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spin size="large" tip="กำลังโหลดข้อมูล..." />
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <style>{`
        .dashboard-page {
          padding: 24px;
          min-height: 100vh;
          background: var(--dashboard-bg);
        }
        
        /* Theme Variables - Light Mode Default */
        :root {
          --dashboard-bg: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
          --card-bg: #ffffff;
          --card-border: #e8e8e8;
          --text-primary: #1a1a2e;
          --text-secondary: #666666;
          --text-value: #667eea;
          --hover-bg: rgba(102,126,234,0.08);
          --progress-trail: rgba(0,0,0,0.06);
        }
        
        /* Dark Mode */
        .dark .dashboard-page,
        [data-theme='dark'] .dashboard-page {
          --dashboard-bg: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          --card-bg: rgba(255,255,255,0.05);
          --card-border: rgba(255,255,255,0.1);
          --text-primary: #e0e0e0;
          --text-secondary: #9ca3af;
          --text-value: #00d4ff;
          --hover-bg: rgba(102,126,234,0.2);
          --progress-trail: rgba(255,255,255,0.1);
        }
        
        @media (prefers-color-scheme: dark) {
          .dashboard-page {
            --dashboard-bg: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            --card-bg: rgba(255,255,255,0.05);
            --card-border: rgba(255,255,255,0.1);
            --text-primary: #e0e0e0;
            --text-secondary: #9ca3af;
            --text-value: #00d4ff;
            --hover-bg: rgba(102,126,234,0.2);
            --progress-trail: rgba(255,255,255,0.1);
          }
        }
        
        .dashboard-page {
          background: var(--dashboard-bg);
        }
        
        .kpi-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.15);
        }
        
        .detail-card {
          background: var(--card-bg) !important;
          border: 1px solid var(--card-border) !important;
          border-radius: 16px !important;
          transition: transform 0.2s;
        }
        
        .detail-card:hover {
          transform: translateY(-2px);
        }
        
        .detail-card .ant-card-head {
          background: transparent !important;
          border: none !important;
        }
        
        .detail-card .ant-card-head-title {
          color: var(--text-primary) !important;
        }
        
        .dashboard-title {
          color: var(--text-primary);
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        
        .dashboard-subtitle {
          color: var(--text-secondary);
          margin: 0;
        }
        
        .card-title {
          color: var(--text-primary) !important;
          font-weight: 600;
        }
        
        .text-primary {
          color: var(--text-primary) !important;
        }
        
        .text-secondary {
          color: var(--text-secondary) !important;
        }
        
        .text-value {
          color: var(--text-value) !important;
        }
        
        .category-item {
          padding: 12px 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s;
          margin-bottom: 8px;
        }
        
        .category-item:hover {
          background: var(--hover-bg);
        }
        
        .product-item {
          border-bottom: 1px solid var(--card-border);
          padding: 12px 0;
          cursor: pointer;
          transition: background 0.2s;
          border-radius: 8px;
          margin: 0 -8px;
          padding-left: 8px;
          padding-right: 8px;
        }
        
        .product-item:hover {
          background: var(--hover-bg);
        }
        
        .product-item:last-child {
          border-bottom: none;
        }
        
        .alert-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 8px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .alert-item:hover {
          transform: translateX(4px);
        }
        
        .alert-item:last-child {
          margin-bottom: 0;
        }
        
        /* Progress Bar */
        .ant-progress-bg {
          height: 8px !important;
        }
        
        .ant-progress-inner {
          background: var(--progress-trail) !important;
        }
        
        /* Mobile Carousel */
        .mobile-carousel .slick-dots {
          bottom: -20px;
        }
        
        .mobile-carousel .slick-dots li button {
          background: rgba(102,126,234,0.3) !important;
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        
        .mobile-carousel .slick-dots li.slick-active button {
          background: #667eea !important;
          width: 24px;
          border-radius: 4px;
        }
        
        .mobile-carousel .slick-slide > div {
          padding: 0 8px;
        }
        
        /* Statistic */
        .ant-statistic-title {
          color: var(--text-secondary) !important;
        }
        
        @media (max-width: 768px) {
          .dashboard-page {
            padding: 16px;
          }
          .mobile-carousel {
            margin-bottom: 40px;
          }
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 className="dashboard-title">📊 Dashboard Overview</h1>
        <p className="dashboard-subtitle">ภาพรวมธุรกิจ SVS Business Suite</p>
      </div>

      {/* KPI Cards - Carousel for Mobile, Grid for Desktop */}
      {isMobile ? (
        <Carousel 
          autoplay={false} 
          dots
          className="mobile-carousel"
          style={{ marginBottom: 24 }}
        >
          {kpiCards.map((card, index) => (
            <div key={index}>
              <KPICard {...card} />
            </div>
          ))}
        </Carousel>
      ) : (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {kpiCards.map((card, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <KPICard {...card} />
            </Col>
          ))}
        </Row>
      )}

      {/* Charts Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* Category Bar Chart */}
        <Col xs={24} lg={14}>
          <Card 
            className="detail-card"
            title={<span className="card-title">📊 มูลค่าสต็อกตามหมวด</span>}
            bodyStyle={{ padding: 20 }}
          >
            {data.categoryStats.slice(0, 8).map((cat, index) => (
              <div 
                key={index} 
                className="category-item"
                onClick={() => navigate(`/products`)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span className="text-primary" style={{ fontSize: 13 }}>{cat.category}</span>
                  <span className="text-value" style={{ fontWeight: 600 }}>{formatCurrency(cat.stock_value)}</span>
                </div>
                <Progress 
                  percent={(cat.stock_value / getMaxCategoryValue()) * 100} 
                  showInfo={false}
                  strokeColor={{
                    '0%': '#667eea',
                    '100%': '#764ba2',
                  }}
                  size="small"
                />
              </div>
            ))}
          </Card>
        </Col>

        {/* Top Products */}
        <Col xs={24} lg={10}>
          <Card 
            className="detail-card"
            title={<span className="card-title">🏆 Top 5 สินค้ามูลค่าสูงสุด</span>}
            bodyStyle={{ padding: 20 }}
          >
            <List
              dataSource={data.topProducts}
              renderItem={(item, index) => (
                <div 
                  className="product-item"
                  onClick={() => navigate(`/products`)}
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
                      <div className="text-primary" style={{ fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.name}
                      </div>
                      <div className="text-secondary" style={{ fontSize: 11 }}>{item.code}</div>
                    </div>
                    <div className="text-value" style={{ fontWeight: 600, fontSize: 14, flexShrink: 0, marginLeft: 8 }}>
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
        <Col xs={24} lg={8}>
          <Card 
            className="detail-card"
            title={<span className="card-title">📦 สถานะสต็อก</span>}
            bodyStyle={{ padding: 20 }}
            hoverable
            onClick={() => navigate('/stock-balance')}
          >
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <Progress
                type="dashboard"
                percent={Math.round((data.normalStockCount / (data.lowStockCount + data.warningStockCount + data.normalStockCount || 1)) * 100)}
                strokeColor="#52c41a"
                format={(percent) => (
                  <span>
                    <span className="text-primary" style={{ fontSize: 24, fontWeight: 700 }}>{percent}%</span>
                    <br/>
                    <span className="text-secondary" style={{ fontSize: 12 }}>ปกติ</span>
                  </span>
                )}
              />
            </div>
            <Row gutter={16}>
              <Col span={8} style={{ textAlign: 'center' }}>
                <Statistic 
                  title={<span style={{ fontSize: 12 }}>🔴 ต่ำ</span>}
                  value={data.lowStockCount}
                  valueStyle={{ color: '#ff4d4f', fontSize: 20 }}
                />
              </Col>
              <Col span={8} style={{ textAlign: 'center' }}>
                <Statistic 
                  title={<span style={{ fontSize: 12 }}>🟡 เตือน</span>}
                  value={data.warningStockCount}
                  valueStyle={{ color: '#faad14', fontSize: 20 }}
                />
              </Col>
              <Col span={8} style={{ textAlign: 'center' }}>
                <Statistic 
                  title={<span style={{ fontSize: 12 }}>🟢 ปกติ</span>}
                  value={data.normalStockCount}
                  valueStyle={{ color: '#52c41a', fontSize: 20 }}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Alerts */}
        <Col xs={24} lg={8}>
          <Card 
            className="detail-card"
            title={<span className="card-title">⚠️ แจ้งเตือน & งานค้าง</span>}
            bodyStyle={{ padding: 20 }}
          >
            <div 
              className="alert-item"
              onClick={() => navigate('/stock-balance')}
              style={{ background: 'rgba(255,77,79,0.1)' }}
            >
              <span style={{ color: '#ff4d4f' }}><WarningOutlined /> สต็อกต่ำ (ต้องสั่งซื้อ)</span>
              <Tag color="red">{data.lowStockCount}</Tag>
            </div>
            <div 
              className="alert-item"
              onClick={() => navigate('/stock-balance')}
              style={{ background: 'rgba(250,173,20,0.1)' }}
            >
              <span style={{ color: '#faad14' }}><ClockCircleOutlined /> สต็อกใกล้หมด</span>
              <Tag color="gold">{data.warningStockCount}</Tag>
            </div>
            <div 
              className="alert-item"
              onClick={() => navigate('/stock-balance')}
              style={{ background: 'rgba(82,196,26,0.1)' }}
            >
              <span style={{ color: '#52c41a' }}><CheckCircleOutlined /> สต็อกปกติ</span>
              <Tag color="green">{data.normalStockCount}</Tag>
            </div>
          </Card>
        </Col>

        {/* Quick Stats */}
        <Col xs={24} lg={8}>
          <Card 
            className="detail-card"
            title={<span className="card-title">📋 สรุปข้อมูล</span>}
            bodyStyle={{ padding: 20 }}
          >
            <div 
              className="alert-item"
              onClick={() => navigate('/categories')}
              style={{ background: 'rgba(102,126,234,0.1)' }}
            >
              <span style={{ color: '#667eea' }}><InboxOutlined /> หมวดหมู่สินค้า</span>
              <Tag color="purple">{data.categoryStats.length}</Tag>
            </div>
            <div 
              className="alert-item"
              onClick={() => navigate('/customers')}
              style={{ background: 'rgba(0,188,212,0.1)' }}
            >
              <span style={{ color: '#00bcd4' }}><FileTextOutlined /> กลุ่มลูกค้า</span>
              <Tag color="cyan">5</Tag>
            </div>
            <div 
              className="alert-item"
              onClick={() => navigate('/stock-balance')}
              style={{ background: 'rgba(250,173,20,0.1)' }}
            >
              <span style={{ color: '#faad14' }}><CreditCardOutlined /> มูลค่าสต็อกรวม</span>
              <Tag color="gold">{formatFullCurrency(data.totalStockValue)}</Tag>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
