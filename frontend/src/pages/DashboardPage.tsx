import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Table, Tag } from 'antd';
import {
  ShoppingOutlined,
  TeamOutlined,
  ShopOutlined,
  InboxOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import { productsApi, customersApi, suppliersApi, stockApi, salesInvoicesApi } from '../services/api';

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    products: 0,
    customers: 0,
    suppliers: 0,
    lowStock: 0,
  });
  const [stockBalances, setStockBalances] = useState<any[]>([]);
  const [recentInvoices, setRecentInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [productsRes, customersRes, suppliersRes, stockRes, invoicesRes] = await Promise.all([
        productsApi.getAll(),
        customersApi.getAll(),
        suppliersApi.getAll(),
        stockApi.getBalance(),
        salesInvoicesApi.getAll(),
      ]);

      setStats({
        products: productsRes.data?.length || 0,
        customers: customersRes.data?.length || 0,
        suppliers: suppliersRes.data?.length || 0,
        lowStock: stockRes.data?.filter((s: any) => s.qtyOnHand < 10).length || 0,
      });

      setStockBalances(stockRes.data?.slice(0, 5) || []);
      setRecentInvoices(invoicesRes.data?.slice(0, 5) || []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stockColumns = [
    {
      title: 'สินค้า',
      dataIndex: ['product', 'name'],
      key: 'product',
      render: (_: any, record: any) => record.product?.name || `Product #${record.productId}`,
    },
    {
      title: 'คลัง',
      dataIndex: ['warehouse', 'name'],
      key: 'warehouse',
      render: (_: any, record: any) => record.warehouse?.name || `WH #${record.warehouseId}`,
    },
    {
      title: 'คงเหลือ',
      dataIndex: 'qtyOnHand',
      key: 'qtyOnHand',
      render: (qty: number) => (
        <span style={{ color: qty < 10 ? '#f97373' : '#10b981' }}>
          {qty?.toLocaleString() || 0}
        </span>
      ),
    },
  ];

  const invoiceColumns = [
    {
      title: 'เลขที่',
      dataIndex: 'docNo',
      key: 'docNo',
    },
    {
      title: 'ลูกค้า',
      dataIndex: ['customer', 'name'],
      key: 'customer',
      render: (_: any, record: any) => record.customer?.name || '-',
    },
    {
      title: 'ยอดรวม',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => `฿${amount?.toLocaleString() || 0}`,
    },
    {
      title: 'สถานะ',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: Record<string, string> = {
          draft: 'default',
          confirmed: 'processing',
          posted: 'success',
          cancelled: 'error',
        };
        const labels: Record<string, string> = {
          draft: 'ร่าง',
          confirmed: 'ยืนยันแล้ว',
          posted: 'ลงบัญชีแล้ว',
          cancelled: 'ยกเลิก',
        };
        return <Tag color={colors[status]}>{labels[status] || status}</Tag>;
      },
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="text-gradient">แดชบอร์ด</h1>
        <p>ภาพรวมระบบจัดการคลังสินค้า</p>
      </div>

      {/* Stats Cards */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="card-holo">
            <Statistic
              title="สินค้าทั้งหมด"
              value={stats.products}
              prefix={<ShoppingOutlined style={{ color: '#7c3aed' }} />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="card-holo">
            <Statistic
              title="ลูกค้า"
              value={stats.customers}
              prefix={<TeamOutlined style={{ color: '#22d3ee' }} />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="card-holo">
            <Statistic
              title="ผู้จำหน่าย"
              value={stats.suppliers}
              prefix={<ShopOutlined style={{ color: '#ec4899' }} />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="card-holo">
            <Statistic
              title="สินค้าใกล้หมด"
              value={stats.lowStock}
              prefix={<InboxOutlined style={{ color: '#f97373' }} />}
              valueStyle={{ color: stats.lowStock > 0 ? '#f97373' : '#10b981' }}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      {/* Tables */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card
            className="card-holo"
            title={
              <span style={{ color: '#e5e7eb' }}>
                <InboxOutlined style={{ marginRight: 8, color: '#7c3aed' }} />
                ยอดสินค้าคงเหลือ
              </span>
            }
          >
            <Table
              columns={stockColumns}
              dataSource={stockBalances}
              pagination={false}
              rowKey="id"
              size="small"
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            className="card-holo"
            title={
              <span style={{ color: '#e5e7eb' }}>
                <ArrowUpOutlined style={{ marginRight: 8, color: '#10b981' }} />
                ใบขายล่าสุด
              </span>
            }
          >
            <Table
              columns={invoiceColumns}
              dataSource={recentInvoices}
              pagination={false}
              rowKey="id"
              size="small"
              loading={loading}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
