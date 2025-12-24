import React, { useEffect, useState } from 'react';
import { Table, Card, Select, Space, Tag, Button } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { stockApi, productsApi, warehousesApi } from '../services/api';
import { StockBalance, Product, Warehouse } from '../types';
import { StockBalanceReportPrint } from '../components/print';

const StockBalancePage: React.FC = () => {
  const [stockBalances, setStockBalances] = useState<StockBalance[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ productId: undefined, warehouseId: undefined });
  const [printVisible, setPrintVisible] = useState(false);

  useEffect(() => { loadMasterData(); }, []);
  useEffect(() => { loadStockBalance(); }, [filters]);

  const loadMasterData = async () => {
    try {
      const [productsRes, warehousesRes] = await Promise.all([
        productsApi.getAll(),
        warehousesApi.getAll(),
      ]);
      setProducts(productsRes.data || []);
      setWarehouses(warehousesRes.data || []);
    } catch (error) {
      console.error('Failed to load master data');
    }
  };

  const loadStockBalance = async () => {
    setLoading(true);
    try {
      const response = await stockApi.getBalance(filters);
      setStockBalances(response.data || []);
    } catch (error) {
      console.error('Failed to load stock balance');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'สินค้า',
      key: 'product',
      render: (_: any, record: StockBalance) => {
        const product = products.find((p) => p.id === record.productId);
        return (
          <div>
            <div style={{ fontWeight: 500 }}>{product?.name || `Product #${record.productId}`}</div>
            <div style={{ color: '#9ca3af', fontSize: 12 }}>{product?.code}</div>
          </div>
        );
      },
    },
    {
      title: 'คลังสินค้า',
      key: 'warehouse',
      render: (_: any, record: StockBalance) => {
        const warehouse = warehouses.find((w) => w.id === record.warehouseId);
        return warehouse?.name || `WH #${record.warehouseId}`;
      },
    },
    {
      title: 'คงเหลือ',
      dataIndex: 'qtyOnHand',
      key: 'qtyOnHand',
      align: 'right' as const,
      render: (qty: number, record: any) => {
        const product = products.find((p) => p.id === record.productId);
        const isLow = product && qty < (product.minStock || 10);
        return (
          <Tag color={isLow ? 'error' : 'success'} style={{ fontSize: 14, padding: '4px 12px' }}>
            {(qty || 0).toLocaleString()}
          </Tag>
        );
      },
    },
    {
      title: 'จอง',
      dataIndex: 'qtyReserved',
      key: 'qtyReserved',
      align: 'right' as const,
      render: (qty: number) => <span style={{ color: '#fbbf24' }}>{(qty || 0).toLocaleString()}</span>,
    },
    {
      title: 'พร้อมใช้',
      dataIndex: 'qtyAvailable',
      key: 'qtyAvailable',
      align: 'right' as const,
      render: (qty: number) => <span style={{ color: '#22d3ee' }}>{(qty || 0).toLocaleString()}</span>,
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="text-gradient">ยอดสินค้าคงเหลือ</h1>
        <p>ตรวจสอบยอดสินค้าคงเหลือในแต่ละคลัง</p>
      </div>

      <Card className="card-holo">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
          <Space wrap>
            <Select
              placeholder="เลือกสินค้า"
              allowClear
              style={{ width: 250 }}
              value={filters.productId}
              onChange={(v) => setFilters({ ...filters, productId: v })}
              options={products.map((p) => ({ value: p.id, label: `${p.code} - ${p.name}` }))}
              showSearch
              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            />
            <Select
              placeholder="เลือกคลังสินค้า"
              allowClear
              style={{ width: 200 }}
              value={filters.warehouseId}
              onChange={(v) => setFilters({ ...filters, warehouseId: v })}
              options={warehouses.map((w) => ({ value: w.id, label: w.name }))}
            />
          </Space>
          <Button type="primary" icon={<PrinterOutlined />} onClick={() => setPrintVisible(true)} className="btn-holo">
            พิมพ์รายงาน
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={stockBalances}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 15, showTotal: (total) => `ทั้งหมด ${total} รายการ` }}
        />
      </Card>

      {/* Print Report */}
      <StockBalanceReportPrint
        open={printVisible}
        onClose={() => setPrintVisible(false)}
      />
    </div>
  );
};

export default StockBalancePage;
