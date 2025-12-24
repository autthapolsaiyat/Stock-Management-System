import React, { useEffect, useState } from 'react';
import { Card, Table, Select, DatePicker, Button, Space, Tag, Spin, Row, Col, Statistic, message, Progress } from 'antd';
import { 
  DollarOutlined, 
  PrinterOutlined, 
  DownloadOutlined,
  ReloadOutlined,
  PieChartOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../services/api';
import { StockValuationPrintPreview } from '../components/print';

interface Category {
  id: number;
  name: string;
}

interface Warehouse {
  id: number;
  code: string;
  name: string;
}

interface ValuationItem {
  productId: number;
  productCode: string;
  productName: string;
  unit: string;
  categoryId: number;
  categoryName: string;
  warehouseId: number;
  warehouseName: string;
  qty: number;
  avgCost: number;
  value: number;
}

interface CategoryBreakdown {
  categoryId: number;
  categoryName: string;
  qty: number;
  value: number;
}

interface WarehouseBreakdown {
  warehouseId: number;
  warehouseName: string;
  qty: number;
  value: number;
}

interface ValuationData {
  asOfDate: string;
  summary: {
    totalItems: number;
    totalQty: number;
    totalValue: number;
    avgCost: number;
  };
  categoryBreakdown: CategoryBreakdown[];
  warehouseBreakdown: WarehouseBreakdown[];
  items: ValuationItem[];
}

const StockValuationPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState<number | null>(null);
  const [asOfDate, setAsOfDate] = useState<dayjs.Dayjs | null>(dayjs());
  const [valuation, setValuation] = useState<ValuationData | null>(null);
  const [darkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [printVisible, setPrintVisible] = useState(false);

  useEffect(() => {
    loadMasterData();
    loadValuation();
  }, []);

  const loadMasterData = async () => {
    try {
      const [categoriesRes, warehousesRes] = await Promise.all([
        api.get('/api/categories'),
        api.get('/api/warehouses'),
      ]);
      setCategories(categoriesRes.data || []);
      setWarehouses(warehousesRes.data || []);
    } catch (error) {
      console.error('Error loading master data:', error);
    }
  };

  const loadValuation = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (selectedWarehouse) params.warehouseId = selectedWarehouse;
      if (selectedCategory) params.categoryId = selectedCategory;
      if (asOfDate) params.asOfDate = asOfDate.format('YYYY-MM-DD');
      
      const response = await api.get('/api/stock/valuation', { params });
      setValuation(response.data);
    } catch (error) {
      console.error('Error loading valuation:', error);
      message.error('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (!valuation || !valuation.items.length) {
      message.warning('ไม่มีข้อมูลให้ส่งออก');
      return;
    }

    const headers = ['รหัสสินค้า', 'ชื่อสินค้า', 'หน่วย', 'หมวดหมู่', 'คลังสินค้า', 'จำนวน', 'ต้นทุนเฉลี่ย', 'มูลค่า'];
    
    const rows = valuation.items.map(item => [
      item.productCode,
      item.productName,
      item.unit || '-',
      item.categoryName,
      item.warehouseName,
      item.qty.toFixed(2),
      item.avgCost.toFixed(2),
      item.value.toFixed(2),
    ]);

    const csvContent = [
      `รายงานมูลค่าสต็อก ณ วันที่ ${dayjs(valuation.asOfDate).format('DD/MM/YYYY')}`,
      `วันที่พิมพ์: ${dayjs().format('DD/MM/YYYY HH:mm')}`,
      `มูลค่ารวม: ฿${valuation.summary.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      '',
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `StockValuation_${asOfDate?.format('YYYYMMDD') || dayjs().format('YYYYMMDD')}.csv`;
    link.click();
    message.success('ส่งออก CSV สำเร็จ');
  };

  const formatCurrency = (value: number) => {
    return `฿${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatShortCurrency = (value: number) => {
    if (value >= 1000000) return `฿${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `฿${(value / 1000).toFixed(0)}K`;
    return `฿${value.toFixed(0)}`;
  };

  const columns = [
    {
      title: 'รหัสสินค้า',
      dataIndex: 'productCode',
      key: 'productCode',
      width: 120,
      sorter: (a: ValuationItem, b: ValuationItem) => a.productCode.localeCompare(b.productCode),
    },
    {
      title: 'ชื่อสินค้า',
      dataIndex: 'productName',
      key: 'productName',
      ellipsis: true,
      sorter: (a: ValuationItem, b: ValuationItem) => a.productName.localeCompare(b.productName),
    },
    {
      title: 'หมวดหมู่',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 150,
      render: (name: string) => <Tag color="blue">{name}</Tag>,
      filters: valuation?.categoryBreakdown.map(c => ({ text: c.categoryName, value: c.categoryName })) || [],
      onFilter: (value: any, record: ValuationItem) => record.categoryName === value,
    },
    {
      title: 'คลังสินค้า',
      dataIndex: 'warehouseName',
      key: 'warehouseName',
      width: 130,
      render: (name: string) => <Tag color="green">{name}</Tag>,
      filters: valuation?.warehouseBreakdown.map(w => ({ text: w.warehouseName, value: w.warehouseName })) || [],
      onFilter: (value: any, record: ValuationItem) => record.warehouseName === value,
    },
    {
      title: 'จำนวน',
      dataIndex: 'qty',
      key: 'qty',
      width: 100,
      align: 'right' as const,
      sorter: (a: ValuationItem, b: ValuationItem) => a.qty - b.qty,
      render: (qty: number, record: ValuationItem) => `${qty.toLocaleString()} ${record.unit || ''}`,
    },
    {
      title: 'ต้นทุนเฉลี่ย',
      dataIndex: 'avgCost',
      key: 'avgCost',
      width: 120,
      align: 'right' as const,
      sorter: (a: ValuationItem, b: ValuationItem) => a.avgCost - b.avgCost,
      render: (cost: number) => formatCurrency(cost),
    },
    {
      title: 'มูลค่า',
      dataIndex: 'value',
      key: 'value',
      width: 130,
      align: 'right' as const,
      sorter: (a: ValuationItem, b: ValuationItem) => a.value - b.value,
      defaultSortOrder: 'descend' as const,
      render: (value: number) => <strong style={{ color: '#1890ff' }}>{formatCurrency(value)}</strong>,
    },
  ];

  const getMaxCategoryValue = () => {
    return Math.max(...(valuation?.categoryBreakdown.map(c => c.value) || [1]), 1);
  };

  const getMaxWarehouseValue = () => {
    return Math.max(...(valuation?.warehouseBreakdown.map(w => w.value) || [1]), 1);
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Filter Section */}
      <Card 
        title={<><DollarOutlined /> รายงานมูลค่าสต็อก (Stock Valuation Report)</>}
        style={{ marginBottom: 16 }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <label style={{ display: 'block', marginBottom: 4, color: darkMode ? '#e0e0e0' : '#666' }}>
              ณ วันที่
            </label>
            <DatePicker
              style={{ width: '100%' }}
              value={asOfDate}
              onChange={setAsOfDate}
              format="DD/MM/YYYY"
              allowClear={false}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <label style={{ display: 'block', marginBottom: 4, color: darkMode ? '#e0e0e0' : '#666' }}>
              คลังสินค้า
            </label>
            <Select
              placeholder="ทุกคลัง"
              style={{ width: '100%' }}
              value={selectedWarehouse}
              onChange={setSelectedWarehouse}
              allowClear
              options={[
                { value: null, label: 'ทุกคลัง' },
                ...warehouses.map(w => ({
                  value: w.id,
                  label: `${w.code} - ${w.name}`,
                })),
              ]}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <label style={{ display: 'block', marginBottom: 4, color: darkMode ? '#e0e0e0' : '#666' }}>
              หมวดหมู่
            </label>
            <Select
              placeholder="ทุกหมวด"
              style={{ width: '100%' }}
              value={selectedCategory}
              onChange={setSelectedCategory}
              allowClear
              options={[
                { value: null, label: 'ทุกหมวด' },
                ...categories.map(c => ({
                  value: c.id,
                  label: c.name,
                })),
              ]}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <label style={{ display: 'block', marginBottom: 4, opacity: 0 }}>.</label>
            <Space>
              <Button type="primary" icon={<ReloadOutlined />} onClick={loadValuation} loading={loading}>
                แสดงข้อมูล
              </Button>
              <Button icon={<PrinterOutlined />} onClick={() => setPrintVisible(true)} disabled={!valuation}>
                พิมพ์
              </Button>
              <Button icon={<DownloadOutlined />} onClick={exportCSV} disabled={!valuation}>
                CSV
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Valuation Content */}
      <Spin spinning={loading}>
        {valuation && (
          <div>
            {/* Summary Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
              <Col xs={24} sm={12} md={6}>
                <Card style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}>
                  <Statistic
                    title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>💰 มูลค่าสต็อกรวม</span>}
                    value={valuation.summary.totalValue}
                    precision={2}
                    prefix="฿"
                    valueStyle={{ color: '#fff', fontSize: 28, fontWeight: 700 }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', border: 'none' }}>
                  <Statistic
                    title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>📦 จำนวนสินค้า</span>}
                    value={valuation.summary.totalItems}
                    suffix="รายการ"
                    valueStyle={{ color: '#fff', fontSize: 28, fontWeight: 700 }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', border: 'none' }}>
                  <Statistic
                    title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>📊 จำนวนคงเหลือ</span>}
                    value={valuation.summary.totalQty}
                    precision={0}
                    suffix="หน่วย"
                    valueStyle={{ color: '#fff', fontSize: 28, fontWeight: 700 }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', border: 'none' }}>
                  <Statistic
                    title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>💵 ต้นทุนเฉลี่ย</span>}
                    value={valuation.summary.avgCost}
                    precision={2}
                    prefix="฿"
                    suffix="/หน่วย"
                    valueStyle={{ color: '#fff', fontSize: 28, fontWeight: 700 }}
                  />
                </Card>
              </Col>
            </Row>

            {/* Breakdown Charts */}
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
              {/* Category Breakdown */}
              <Col xs={24} lg={12}>
                <Card 
                  title={<><PieChartOutlined /> มูลค่าตามหมวดหมู่</>}
                  style={{ 
                    background: darkMode ? 'rgba(255,255,255,0.05)' : '#fff',
                    border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e8e8e8',
                  }}
                >
                  {valuation.categoryBreakdown.map((cat, index) => (
                    <div key={cat.categoryId || index} style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ color: darkMode ? '#e0e0e0' : '#333' }}>{cat.categoryName}</span>
                        <span style={{ fontWeight: 600, color: '#1890ff' }}>{formatShortCurrency(cat.value)}</span>
                      </div>
                      <Progress 
                        percent={Math.round((cat.value / getMaxCategoryValue()) * 100)} 
                        showInfo={false}
                        strokeColor={['#667eea', '#764ba2', '#11998e', '#f093fb', '#4facfe'][index % 5]}
                      />
                    </div>
                  ))}
                </Card>
              </Col>

              {/* Warehouse Breakdown */}
              <Col xs={24} lg={12}>
                <Card 
                  title={<><BarChartOutlined /> มูลค่าตามคลังสินค้า</>}
                  style={{ 
                    background: darkMode ? 'rgba(255,255,255,0.05)' : '#fff',
                    border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e8e8e8',
                  }}
                >
                  {valuation.warehouseBreakdown.map((wh, index) => (
                    <div key={wh.warehouseId || index} style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ color: darkMode ? '#e0e0e0' : '#333' }}>{wh.warehouseName}</span>
                        <span style={{ fontWeight: 600, color: '#52c41a' }}>{formatShortCurrency(wh.value)}</span>
                      </div>
                      <Progress 
                        percent={Math.round((wh.value / getMaxWarehouseValue()) * 100)} 
                        showInfo={false}
                        strokeColor={['#52c41a', '#faad14', '#1890ff', '#722ed1', '#eb2f96'][index % 5]}
                      />
                    </div>
                  ))}
                </Card>
              </Col>
            </Row>

            {/* Detail Table */}
            <Card 
              title={`📋 รายละเอียดมูลค่าสต็อก ณ วันที่ ${dayjs(valuation.asOfDate).format('DD/MM/YYYY')}`}
              style={{ 
                background: darkMode ? 'rgba(255,255,255,0.05)' : '#fff',
                border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e8e8e8',
              }}
            >
              <Table
                dataSource={valuation.items}
                columns={columns}
                rowKey={(record) => `${record.productId}-${record.warehouseId}`}
                pagination={{ pageSize: 50, showSizeChanger: true, showTotal: (total) => `ทั้งหมด ${total} รายการ` }}
                scroll={{ x: 1000 }}
                size="small"
                summary={() => (
                  <Table.Summary fixed>
                    <Table.Summary.Row style={{ background: darkMode ? 'rgba(255,255,255,0.05)' : '#fafafa', fontWeight: 'bold' }}>
                      <Table.Summary.Cell index={0} colSpan={4}>รวมทั้งหมด</Table.Summary.Cell>
                      <Table.Summary.Cell index={1} align="right">
                        {valuation.summary.totalQty.toLocaleString()}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={2} align="right">-</Table.Summary.Cell>
                      <Table.Summary.Cell index={3} align="right">
                        <strong style={{ color: '#1890ff', fontSize: 16 }}>
                          {formatCurrency(valuation.summary.totalValue)}
                        </strong>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                )}
              />
            </Card>
          </div>
        )}

        {!valuation && !loading && (
          <Card>
            <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
              <DollarOutlined style={{ fontSize: 48, marginBottom: 16 }} />
              <p>กดปุ่ม "แสดงข้อมูล" เพื่อดูรายงานมูลค่าสต็อก</p>
            </div>
          </Card>
        )}
      </Spin>

      {/* Print Preview Modal */}
      <StockValuationPrintPreview
        open={printVisible}
        onClose={() => setPrintVisible(false)}
        data={valuation}
        asOfDate={asOfDate?.format('YYYY-MM-DD')}
        warehouseName={selectedWarehouse ? warehouses.find(w => w.id === selectedWarehouse)?.name : undefined}
        categoryName={selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : undefined}
      />
    </div>
  );
};

export default StockValuationPage;
