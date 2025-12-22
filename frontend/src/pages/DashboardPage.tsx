import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spin, Progress, List, Tag, Statistic } from 'antd';
import {
  DollarOutlined,
  ShoppingOutlined,
  TeamOutlined,
  ShopOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  RiseOutlined,
  InboxOutlined,
  FileTextOutlined,
  CreditCardOutlined,
} from '@ant-design/icons';
import api from '../services/api';

interface CategoryStock {
  category: string;
  products: number;
  stock_value: number;
}

interface TopProduct {
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
  pendingQuotations: number;
  pendingPOs: number;
  pendingInvoices: number;
}

const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
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
    pendingQuotations: 0,
    pendingPOs: 0,
    pendingInvoices: 0,
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

      // คำนวณมูลค่าสต็อกรวม
      const totalStockValue = stockBalances.reduce((sum: number, sb: any) => {
        return sum + (parseFloat(sb.qtyOnHand || sb.qty_on_hand || 0) * parseFloat(sb.avgCost || sb.avg_cost || 0));
      }, 0);

      // คำนวณสต็อกต่ำ/ปกติ
      let lowStock = 0, warningStock = 0, normalStock = 0;
      stockBalances.forEach((sb: any) => {
        const qty = parseFloat(sb.qtyOnHand || sb.qty_on_hand || 0);
        if (qty <= 0) lowStock++;
        else if (qty < 5) warningStock++;
        else normalStock++;
      });

      // จัดกลุ่มตาม Category
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

      // Top 5 สินค้ามูลค่าสูงสุด
      const productValues = products.map((p: any) => {
        const sb = stockBalances.find((s: any) => s.productId === p.id || s.product_id === p.id);
        const value = sb ? parseFloat(sb.qtyOnHand || sb.qty_on_hand || 0) * parseFloat(sb.avgCost || sb.avg_cost || 0) : 0;
        return { code: p.code, name: p.name, total_value: value };
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
        pendingQuotations: 0,
        pendingPOs: 0,
        pendingInvoices: 0,
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

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spin size="large" tip="กำลังโหลดข้อมูล..." />
      </div>
    );
  }

  return (
    <div className="page-container" style={{ padding: '24px', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ 
          fontSize: 28, 
          fontWeight: 700, 
          background: 'linear-gradient(90deg, #00d4ff, #7b2cbf)', 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent',
          marginBottom: 8
        }}>
          📊 Dashboard Overview
        </h1>
        <p style={{ color: '#9ca3af', margin: 0 }}>ภาพรวมธุรกิจ SVS Business Suite</p>
      </div>

      {/* KPI Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: 16,
            }}
            bodyStyle={{ padding: 20 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: 14 }}>💰 มูลค่าสต็อก</p>
                <h2 style={{ color: '#fff', margin: '8px 0 4px', fontSize: 28, fontWeight: 700 }}>
                  {formatCurrency(data.totalStockValue)}
                </h2>
                <Tag color="green" style={{ border: 'none' }}>
                  <RiseOutlined /> Active
                </Tag>
              </div>
              <DollarOutlined style={{ fontSize: 48, color: 'rgba(255,255,255,0.3)' }} />
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              border: 'none',
              borderRadius: 16,
            }}
            bodyStyle={{ padding: 20 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: 14 }}>📦 สินค้าทั้งหมด</p>
                <h2 style={{ color: '#fff', margin: '8px 0 4px', fontSize: 28, fontWeight: 700 }}>
                  {data.totalProducts.toLocaleString()}
                </h2>
                <Tag color="purple" style={{ border: 'none' }}>
                  {data.categoryStats.length} หมวดหมู่
                </Tag>
              </div>
              <ShoppingOutlined style={{ fontSize: 48, color: 'rgba(255,255,255,0.3)' }} />
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              border: 'none',
              borderRadius: 16,
            }}
            bodyStyle={{ padding: 20 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: 14 }}>👥 ลูกค้า</p>
                <h2 style={{ color: '#fff', margin: '8px 0 4px', fontSize: 28, fontWeight: 700 }}>
                  {data.totalCustomers.toLocaleString()}
                </h2>
                <Tag color="cyan" style={{ border: 'none' }}>
                  5 กลุ่ม
                </Tag>
              </div>
              <TeamOutlined style={{ fontSize: 48, color: 'rgba(255,255,255,0.3)' }} />
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              border: 'none',
              borderRadius: 16,
            }}
            bodyStyle={{ padding: 20 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: 14 }}>🏭 ผู้จำหน่าย</p>
                <h2 style={{ color: '#fff', margin: '8px 0 4px', fontSize: 28, fontWeight: 700 }}>
                  {data.totalSuppliers.toLocaleString()}
                </h2>
                <Tag color="orange" style={{ border: 'none' }}>
                  Active
                </Tag>
              </div>
              <ShopOutlined style={{ fontSize: 48, color: 'rgba(255,255,255,0.3)' }} />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* Category Bar Chart */}
        <Col xs={24} lg={14}>
          <Card 
            title={<span style={{ color: '#fff' }}>📊 มูลค่าสต็อกตามหมวด</span>}
            style={{ 
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 16,
            }}
            headStyle={{ background: 'transparent', border: 'none' }}
            bodyStyle={{ padding: 20 }}
          >
            {data.categoryStats.slice(0, 8).map((cat, index) => (
              <div key={index} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: '#e0e0e0', fontSize: 13 }}>{cat.category}</span>
                  <span style={{ color: '#00d4ff', fontWeight: 600 }}>{formatCurrency(cat.stock_value)}</span>
                </div>
                <Progress 
                  percent={(cat.stock_value / getMaxCategoryValue()) * 100} 
                  showInfo={false}
                  strokeColor={{
                    '0%': '#667eea',
                    '100%': '#764ba2',
                  }}
                  trailColor="rgba(255,255,255,0.1)"
                  size="small"
                />
              </div>
            ))}
          </Card>
        </Col>

        {/* Top Products */}
        <Col xs={24} lg={10}>
          <Card 
            title={<span style={{ color: '#fff' }}>🏆 Top 5 สินค้ามูลค่าสูงสุด</span>}
            style={{ 
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 16,
            }}
            headStyle={{ background: 'transparent', border: 'none' }}
            bodyStyle={{ padding: 20 }}
          >
            <List
              dataSource={data.topProducts}
              renderItem={(item, index) => (
                <List.Item style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '12px 0' }}>
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
                      color: index < 3 ? '#000' : '#fff'
                    }}>
                      {index + 1}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: '#e0e0e0', fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.name}
                      </div>
                      <div style={{ color: '#9ca3af', fontSize: 11 }}>{item.code}</div>
                    </div>
                    <div style={{ color: '#00d4ff', fontWeight: 600, fontSize: 14 }}>
                      {formatCurrency(item.total_value)}
                    </div>
                  </div>
                </List.Item>
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
            title={<span style={{ color: '#fff' }}>📦 สถานะสต็อก</span>}
            style={{ 
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 16,
            }}
            headStyle={{ background: 'transparent', border: 'none' }}
            bodyStyle={{ padding: 20 }}
          >
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <Progress
                type="dashboard"
                percent={Math.round((data.normalStockCount / (data.lowStockCount + data.warningStockCount + data.normalStockCount)) * 100)}
                strokeColor="#52c41a"
                trailColor="rgba(255,255,255,0.1)"
                format={(percent) => (
                  <span style={{ color: '#fff', fontSize: 20 }}>{percent}%<br/><span style={{ fontSize: 12, color: '#9ca3af' }}>ปกติ</span></span>
                )}
              />
            </div>
            <Row gutter={16}>
              <Col span={8} style={{ textAlign: 'center' }}>
                <Statistic 
                  title={<span style={{ color: '#9ca3af', fontSize: 12 }}>🔴 ต่ำ</span>}
                  value={data.lowStockCount}
                  valueStyle={{ color: '#ff4d4f', fontSize: 20 }}
                />
              </Col>
              <Col span={8} style={{ textAlign: 'center' }}>
                <Statistic 
                  title={<span style={{ color: '#9ca3af', fontSize: 12 }}>🟡 เตือน</span>}
                  value={data.warningStockCount}
                  valueStyle={{ color: '#faad14', fontSize: 20 }}
                />
              </Col>
              <Col span={8} style={{ textAlign: 'center' }}>
                <Statistic 
                  title={<span style={{ color: '#9ca3af', fontSize: 12 }}>🟢 ปกติ</span>}
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
            title={<span style={{ color: '#fff' }}>⚠️ แจ้งเตือน & งานค้าง</span>}
            style={{ 
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 16,
              height: '100%'
            }}
            headStyle={{ background: 'transparent', border: 'none' }}
            bodyStyle={{ padding: 20 }}
          >
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(255,77,79,0.1)', borderRadius: 8, marginBottom: 8 }}>
                <span style={{ color: '#ff4d4f' }}><WarningOutlined /> สต็อกต่ำ (ต้องสั่งซื้อ)</span>
                <Tag color="red">{data.lowStockCount}</Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(250,173,20,0.1)', borderRadius: 8, marginBottom: 8 }}>
                <span style={{ color: '#faad14' }}><ClockCircleOutlined /> สต็อกใกล้หมด</span>
                <Tag color="gold">{data.warningStockCount}</Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(82,196,26,0.1)', borderRadius: 8 }}>
                <span style={{ color: '#52c41a' }}><CheckCircleOutlined /> สต็อกปกติ</span>
                <Tag color="green">{data.normalStockCount}</Tag>
              </div>
            </div>
          </Card>
        </Col>

        {/* Quick Stats */}
        <Col xs={24} lg={8}>
          <Card 
            title={<span style={{ color: '#fff' }}>📋 สรุปข้อมูล</span>}
            style={{ 
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 16,
              height: '100%'
            }}
            headStyle={{ background: 'transparent', border: 'none' }}
            bodyStyle={{ padding: 20 }}
          >
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(102,126,234,0.1)', borderRadius: 8, marginBottom: 8 }}>
                <span style={{ color: '#667eea' }}><InboxOutlined /> หมวดหมู่สินค้า</span>
                <Tag color="purple">{data.categoryStats.length}</Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(0,212,255,0.1)', borderRadius: 8, marginBottom: 8 }}>
                <span style={{ color: '#00d4ff' }}><FileTextOutlined /> กลุ่มลูกค้า</span>
                <Tag color="cyan">5</Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(250,240,154,0.1)', borderRadius: 8 }}>
                <span style={{ color: '#fee140' }}><CreditCardOutlined /> มูลค่าสต็อกรวม</span>
                <Tag color="gold">{formatFullCurrency(data.totalStockValue)}</Tag>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
