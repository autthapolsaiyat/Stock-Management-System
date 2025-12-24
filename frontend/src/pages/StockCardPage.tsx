import React, { useEffect, useState } from 'react';
import { Card, Table, Select, DatePicker, Button, Space, Tag, Spin, Row, Col, Statistic, message, Descriptions } from 'antd';
import { 
  FileTextOutlined, 
  PrinterOutlined, 
  DownloadOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../services/api';
import { StockCardPrintPreview } from '../components/print';

const { RangePicker } = DatePicker;

interface Product {
  id: number;
  code: string;
  name: string;
}

interface Warehouse {
  id: number;
  code: string;
  name: string;
}

interface StockCardTransaction {
  id: number;
  date: string;
  type: 'IN' | 'OUT';
  referenceType: string;
  referenceId: number;
  warehouseId: number;
  qtyIn: number;
  qtyOut: number;
  unitCost: number;
  totalCost: number;
  balanceQty: number;
  balanceValue: number;
}

interface StockCardData {
  productId: number;
  warehouseId: number | null;
  openingBalance: { qty: number; value: number };
  closingBalance: { qty: number; value: number };
  currentBalance: { qty: number; avgCost: number };
  transactions: StockCardTransaction[];
}

const StockCardPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [stockCard, setStockCard] = useState<StockCardData | null>(null);
  const [darkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [printVisible, setPrintVisible] = useState(false);

  useEffect(() => {
    loadMasterData();
  }, []);

  const loadMasterData = async () => {
    try {
      const [productsRes, warehousesRes] = await Promise.all([
        api.get('/api/products'),
        api.get('/api/warehouses'),
      ]);
      setProducts(productsRes.data || []);
      setWarehouses(warehousesRes.data || []);
    } catch (error) {
      console.error('Error loading master data:', error);
    }
  };

  const loadStockCard = async () => {
    if (!selectedProduct) {
      message.warning('กรุณาเลือกสินค้า');
      return;
    }
    
    setLoading(true);
    try {
      const params: any = { productId: selectedProduct };
      if (selectedWarehouse) params.warehouseId = selectedWarehouse;
      if (dateRange) {
        params.startDate = dateRange[0].format('YYYY-MM-DD');
        params.endDate = dateRange[1].format('YYYY-MM-DD');
      }
      
      const response = await api.get('/api/stock/card', { params });
      setStockCard(response.data);
    } catch (error) {
      console.error('Error loading stock card:', error);
      message.error('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (!stockCard || !stockCard.transactions.length) {
      message.warning('ไม่มีข้อมูลให้ส่งออก');
      return;
    }

    const product = products.find(p => p.id === selectedProduct);
    const headers = ['วันที่', 'ประเภท', 'อ้างอิง', 'รับเข้า', 'จ่ายออก', 'ต้นทุน/หน่วย', 'มูลค่า', 'คงเหลือ', 'มูลค่าคงเหลือ'];
    
    const rows = stockCard.transactions.map(tx => [
      dayjs(tx.date).format('DD/MM/YYYY HH:mm'),
      tx.type === 'IN' ? 'รับเข้า' : 'จ่ายออก',
      `${tx.referenceType}-${tx.referenceId || ''}`,
      tx.qtyIn || '',
      tx.qtyOut || '',
      tx.unitCost.toFixed(2),
      tx.totalCost.toFixed(2),
      tx.balanceQty.toFixed(2),
      tx.balanceValue.toFixed(2),
    ]);

    const csvContent = [
      `Stock Card - ${product?.code} ${product?.name}`,
      `วันที่พิมพ์: ${dayjs().format('DD/MM/YYYY HH:mm')}`,
      '',
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `StockCard_${product?.code}_${dayjs().format('YYYYMMDD')}.csv`;
    link.click();
    message.success('ส่งออก CSV สำเร็จ');
  };

  const getReferenceLabel = (type: string) => {
    const labels: Record<string, string> = {
      'GR': 'รับสินค้า',
      'GOODS_RECEIPT': 'รับสินค้า',
      'ISSUE': 'เบิกสินค้า',
      'STOCK_ISSUE': 'เบิกสินค้า',
      'TRANSFER_IN': 'รับโอน',
      'TRANSFER_OUT': 'โอนออก',
      'STOCK_TRANSFER': 'โอนสินค้า',
      'ADJ_IN': 'ปรับเพิ่ม',
      'ADJ_OUT': 'ปรับลด',
      'STOCK_ADJUSTMENT': 'ปรับปรุง',
      'COUNT': 'นับสต็อก',
      'STOCK_COUNT': 'นับสต็อก',
      'SALES': 'ขาย',
      'SALES_INVOICE': 'ใบขาย',
    };
    return labels[type] || type;
  };

  const columns = [
    {
      title: 'วันที่',
      dataIndex: 'date',
      key: 'date',
      width: 150,
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'ประเภท',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => (
        <Tag color={type === 'IN' ? 'green' : 'red'} icon={type === 'IN' ? <ArrowDownOutlined /> : <ArrowUpOutlined />}>
          {type === 'IN' ? 'รับเข้า' : 'จ่ายออก'}
        </Tag>
      ),
    },
    {
      title: 'รายการอ้างอิง',
      key: 'reference',
      width: 150,
      render: (_: any, record: StockCardTransaction) => (
        <span>
          {getReferenceLabel(record.referenceType)}
          {record.referenceId && <Tag style={{ marginLeft: 4 }}>#{record.referenceId}</Tag>}
        </span>
      ),
    },
    {
      title: 'รับเข้า',
      dataIndex: 'qtyIn',
      key: 'qtyIn',
      width: 100,
      align: 'right' as const,
      render: (qty: number) => qty > 0 ? <span style={{ color: '#52c41a', fontWeight: 600 }}>+{qty.toLocaleString()}</span> : '-',
    },
    {
      title: 'จ่ายออก',
      dataIndex: 'qtyOut',
      key: 'qtyOut',
      width: 100,
      align: 'right' as const,
      render: (qty: number) => qty > 0 ? <span style={{ color: '#ff4d4f', fontWeight: 600 }}>-{qty.toLocaleString()}</span> : '-',
    },
    {
      title: 'ต้นทุน/หน่วย',
      dataIndex: 'unitCost',
      key: 'unitCost',
      width: 120,
      align: 'right' as const,
      render: (cost: number) => `฿${cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    },
    {
      title: 'มูลค่า',
      dataIndex: 'totalCost',
      key: 'totalCost',
      width: 120,
      align: 'right' as const,
      render: (cost: number) => `฿${cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    },
    {
      title: 'คงเหลือ',
      dataIndex: 'balanceQty',
      key: 'balanceQty',
      width: 100,
      align: 'right' as const,
      render: (qty: number) => <strong>{qty.toLocaleString()}</strong>,
    },
    {
      title: 'มูลค่าคงเหลือ',
      dataIndex: 'balanceValue',
      key: 'balanceValue',
      width: 130,
      align: 'right' as const,
      render: (value: number) => <strong>฿{value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>,
    },
  ];

  const selectedProductData = products.find(p => p.id === selectedProduct);

  return (
    <div style={{ padding: 24 }}>
      {/* Filter Section */}
      <Card 
        title={<><FileTextOutlined /> Stock Card - ประวัติเคลื่อนไหวสินค้า</>}
        style={{ marginBottom: 16 }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8} lg={6}>
            <label style={{ display: 'block', marginBottom: 4, color: darkMode ? '#e0e0e0' : '#666' }}>
              สินค้า <span style={{ color: 'red' }}>*</span>
            </label>
            <Select
              showSearch
              placeholder="เลือกสินค้า"
              style={{ width: '100%' }}
              value={selectedProduct}
              onChange={setSelectedProduct}
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={products.map(p => ({
                value: p.id,
                label: `${p.code} - ${p.name}`,
              }))}
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
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
          <Col xs={24} sm={12} md={8} lg={6}>
            <label style={{ display: 'block', marginBottom: 4, color: darkMode ? '#e0e0e0' : '#666' }}>
              ช่วงวันที่
            </label>
            <RangePicker
              style={{ width: '100%' }}
              value={dateRange}
              onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs] | null)}
              format="DD/MM/YYYY"
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <label style={{ display: 'block', marginBottom: 4, opacity: 0 }}>.</label>
            <Space>
              <Button type="primary" icon={<ReloadOutlined />} onClick={loadStockCard} loading={loading}>
                แสดงข้อมูล
              </Button>
              <Button icon={<PrinterOutlined />} onClick={() => setPrintVisible(true)} disabled={!stockCard}>
                พิมพ์
              </Button>
              <Button icon={<DownloadOutlined />} onClick={exportCSV} disabled={!stockCard}>
                CSV
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Stock Card Content */}
      <Spin spinning={loading}>
        {stockCard && (
          <div>
            <Card style={{ marginBottom: 16 }}>
              {/* Header */}
              <Descriptions title={`Stock Card: ${selectedProductData?.code} - ${selectedProductData?.name}`} bordered column={{ xs: 1, sm: 2, md: 4 }}>
                <Descriptions.Item label="รหัสสินค้า">{selectedProductData?.code}</Descriptions.Item>
                <Descriptions.Item label="ชื่อสินค้า">{selectedProductData?.name}</Descriptions.Item>
                <Descriptions.Item label="คลังสินค้า">
                  {selectedWarehouse 
                    ? warehouses.find(w => w.id === selectedWarehouse)?.name || 'ไม่ระบุ'
                    : 'ทุกคลัง'
                  }
                </Descriptions.Item>
                <Descriptions.Item label="ช่วงวันที่">
                  {dateRange 
                    ? `${dateRange[0].format('DD/MM/YYYY')} - ${dateRange[1].format('DD/MM/YYYY')}`
                    : 'ทั้งหมด'
                  }
                </Descriptions.Item>
              </Descriptions>

              {/* Summary Stats */}
              <Row gutter={16} style={{ marginTop: 16, marginBottom: 16 }}>
                <Col xs={12} sm={6}>
                  <Card size="small" style={{ background: darkMode ? 'rgba(255,255,255,0.05)' : '#f6ffed', border: '1px solid #b7eb8f' }}>
                    <Statistic 
                      title="ยอดยกมา" 
                      value={stockCard.openingBalance.qty} 
                      suffix="หน่วย"
                      valueStyle={{ color: '#52c41a' }}
                    />
                    <div style={{ fontSize: 12, color: '#888' }}>
                      ฿{stockCard.openingBalance.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                  </Card>
                </Col>
                <Col xs={12} sm={6}>
                  <Card size="small" style={{ background: darkMode ? 'rgba(255,255,255,0.05)' : '#e6f7ff', border: '1px solid #91d5ff' }}>
                    <Statistic 
                      title="รับเข้ารวม" 
                      value={stockCard.transactions.reduce((sum, tx) => sum + tx.qtyIn, 0)} 
                      suffix="หน่วย"
                      valueStyle={{ color: '#1890ff' }}
                    />
                    <div style={{ fontSize: 12, color: '#888' }}>
                      ฿{stockCard.transactions.reduce((sum, tx) => sum + (tx.type === 'IN' ? tx.totalCost : 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                  </Card>
                </Col>
                <Col xs={12} sm={6}>
                  <Card size="small" style={{ background: darkMode ? 'rgba(255,255,255,0.05)' : '#fff2e8', border: '1px solid #ffbb96' }}>
                    <Statistic 
                      title="จ่ายออกรวม" 
                      value={stockCard.transactions.reduce((sum, tx) => sum + tx.qtyOut, 0)} 
                      suffix="หน่วย"
                      valueStyle={{ color: '#fa8c16' }}
                    />
                    <div style={{ fontSize: 12, color: '#888' }}>
                      ฿{stockCard.transactions.reduce((sum, tx) => sum + (tx.type === 'OUT' ? tx.totalCost : 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                  </Card>
                </Col>
                <Col xs={12} sm={6}>
                  <Card size="small" style={{ background: darkMode ? 'rgba(255,255,255,0.05)' : '#f9f0ff', border: '1px solid #d3adf7' }}>
                    <Statistic 
                      title="ยอดคงเหลือ" 
                      value={stockCard.closingBalance.qty} 
                      suffix="หน่วย"
                      valueStyle={{ color: '#722ed1' }}
                    />
                    <div style={{ fontSize: 12, color: '#888' }}>
                      ฿{stockCard.closingBalance.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                  </Card>
                </Col>
              </Row>

              {/* Transactions Table */}
              <Table
                dataSource={stockCard.transactions}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 50, showSizeChanger: true, showTotal: (total) => `ทั้งหมด ${total} รายการ` }}
                scroll={{ x: 1200 }}
                size="small"
                summary={() => (
                  <Table.Summary fixed>
                    <Table.Summary.Row style={{ background: darkMode ? 'rgba(255,255,255,0.05)' : '#fafafa', fontWeight: 'bold' }}>
                      <Table.Summary.Cell index={0} colSpan={3}>รวม</Table.Summary.Cell>
                      <Table.Summary.Cell index={1} align="right">
                        <span style={{ color: '#52c41a' }}>
                          +{stockCard.transactions.reduce((sum, tx) => sum + tx.qtyIn, 0).toLocaleString()}
                        </span>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={2} align="right">
                        <span style={{ color: '#ff4d4f' }}>
                          -{stockCard.transactions.reduce((sum, tx) => sum + tx.qtyOut, 0).toLocaleString()}
                        </span>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={3} colSpan={2}></Table.Summary.Cell>
                      <Table.Summary.Cell index={4} align="right">
                        {stockCard.closingBalance.qty.toLocaleString()}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={5} align="right">
                        ฿{stockCard.closingBalance.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                )}
              />
            </Card>
          </div>
        )}

        {!stockCard && !loading && (
          <Card>
            <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
              <FileTextOutlined style={{ fontSize: 48, marginBottom: 16 }} />
              <p>เลือกสินค้าและกดปุ่ม "แสดงข้อมูล" เพื่อดู Stock Card</p>
            </div>
          </Card>
        )}
      </Spin>

      {/* Print Preview Modal */}
      <StockCardPrintPreview
        open={printVisible}
        onClose={() => setPrintVisible(false)}
        data={stockCard}
        product={selectedProduct ? products.find(p => p.id === selectedProduct) : undefined}
        warehouseName={selectedWarehouse ? warehouses.find(w => w.id === selectedWarehouse)?.name : undefined}
        dateRange={dateRange ? [dateRange[0].format('YYYY-MM-DD'), dateRange[1].format('YYYY-MM-DD')] : undefined}
      />
    </div>
  );
};

export default StockCardPage;
