import React, { useEffect, useState } from 'react';
import { Card, Table, Select, DatePicker, Button, Space, Tag, Spin, Row, Col, Statistic, message } from 'antd';
import { 
  SwapOutlined, 
  
  DownloadOutlined,
  ReloadOutlined,
  RiseOutlined,
  FallOutlined,
  PauseOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../services/api';

const { RangePicker } = DatePicker;

interface Category {
  id: number;
  name: string;
}

interface Warehouse {
  id: number;
  code: string;
  name: string;
}

interface MovementItem {
  productId: number;
  productCode: string;
  productName: string;
  unit: string;
  categoryName: string;
  qtyIn: number;
  qtyOut: number;
  qtyNet: number;
  valueIn: number;
  valueOut: number;
  valueNet: number;
  transactionCount: number;
  movementClass: 'FAST' | 'MEDIUM' | 'SLOW' | 'NO_MOVEMENT';
}

interface MovementData {
  startDate: string;
  endDate: string;
  summary: {
    totalItems: number;
    totalQtyIn: number;
    totalQtyOut: number;
    totalValueIn: number;
    totalValueOut: number;
    fast: number;
    medium: number;
    slow: number;
    noMovement: number;
  };
  items: MovementItem[];
}

const StockMovementPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs()
  ]);
  const [movement, setMovement] = useState<MovementData | null>(null);
  const [filterClass, setFilterClass] = useState<string | null>(null);
  const [darkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  useEffect(() => {
    loadMasterData();
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

  const loadMovement = async () => {
    if (!dateRange || !dateRange[0] || !dateRange[1]) {
      message.warning('กรุณาเลือกช่วงวันที่');
      return;
    }
    
    setLoading(true);
    try {
      const params: any = {
        startDate: dateRange[0].format('YYYY-MM-DD'),
        endDate: dateRange[1].format('YYYY-MM-DD'),
      };
      if (selectedWarehouse) params.warehouseId = selectedWarehouse;
      if (selectedCategory) params.categoryId = selectedCategory;
      
      const response = await api.get('/api/stock/movement', { params });
      setMovement(response.data);
    } catch (error) {
      console.error('Error loading movement:', error);
      message.error('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (!movement || !movement.items.length) {
      message.warning('ไม่มีข้อมูลให้ส่งออก');
      return;
    }

    const headers = ['รหัสสินค้า', 'ชื่อสินค้า', 'หน่วย', 'หมวดหมู่', 'รับเข้า', 'จ่ายออก', 'สุทธิ', 'มูลค่ารับ', 'มูลค่าจ่าย', 'จำนวน TX', 'ประเภท'];
    
    const classLabels: Record<string, string> = {
      'FAST': 'เคลื่อนไหวเร็ว',
      'MEDIUM': 'เคลื่อนไหวปานกลาง',
      'SLOW': 'เคลื่อนไหวช้า',
      'NO_MOVEMENT': 'ไม่เคลื่อนไหว',
    };
    
    const rows = movement.items.map(item => [
      item.productCode,
      item.productName,
      item.unit || '-',
      item.categoryName,
      item.qtyIn.toFixed(2),
      item.qtyOut.toFixed(2),
      item.qtyNet.toFixed(2),
      item.valueIn.toFixed(2),
      item.valueOut.toFixed(2),
      item.transactionCount,
      classLabels[item.movementClass],
    ]);

    const csvContent = [
      `รายงานการเคลื่อนไหวสินค้า`,
      `ช่วงวันที่: ${dateRange[0].format('DD/MM/YYYY')} - ${dateRange[1].format('DD/MM/YYYY')}`,
      `วันที่พิมพ์: ${dayjs().format('DD/MM/YYYY HH:mm')}`,
      '',
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `StockMovement_${dateRange[0].format('YYYYMMDD')}_${dateRange[1].format('YYYYMMDD')}.csv`;
    link.click();
    message.success('ส่งออก CSV สำเร็จ');
  };

  const formatCurrency = (value: number) => {
    return `฿${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatQty = (value: number) => {
    return value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  const getMovementTag = (movementClass: string) => {
    switch (movementClass) {
      case 'FAST':
        return <Tag color="green" icon={<RiseOutlined />}>เคลื่อนไหวเร็ว</Tag>;
      case 'MEDIUM':
        return <Tag color="blue">ปานกลาง</Tag>;
      case 'SLOW':
        return <Tag color="orange" icon={<FallOutlined />}>เคลื่อนไหวช้า</Tag>;
      case 'NO_MOVEMENT':
        return <Tag color="red" icon={<PauseOutlined />}>ไม่เคลื่อนไหว</Tag>;
      default:
        return <Tag>{movementClass}</Tag>;
    }
  };

  const filteredItems = movement?.items.filter(item => 
    !filterClass || item.movementClass === filterClass
  ) || [];

  const columns = [
    {
      title: 'รหัสสินค้า',
      dataIndex: 'productCode',
      key: 'productCode',
      width: 120,
      sorter: (a: MovementItem, b: MovementItem) => a.productCode.localeCompare(b.productCode),
    },
    {
      title: 'ชื่อสินค้า',
      dataIndex: 'productName',
      key: 'productName',
      ellipsis: true,
    },
    {
      title: 'หมวดหมู่',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 130,
      filters: [...new Set(movement?.items.map(i => i.categoryName) || [])].map(c => ({ text: c, value: c })),
      onFilter: (value: any, record: MovementItem) => record.categoryName === value,
    },
    {
      title: 'รับเข้า',
      dataIndex: 'qtyIn',
      key: 'qtyIn',
      width: 100,
      align: 'right' as const,
      sorter: (a: MovementItem, b: MovementItem) => a.qtyIn - b.qtyIn,
      render: (qty: number) => <span style={{ color: '#52c41a' }}>+{formatQty(qty)}</span>,
    },
    {
      title: 'จ่ายออก',
      dataIndex: 'qtyOut',
      key: 'qtyOut',
      width: 100,
      align: 'right' as const,
      sorter: (a: MovementItem, b: MovementItem) => a.qtyOut - b.qtyOut,
      defaultSortOrder: 'descend' as const,
      render: (qty: number) => <span style={{ color: '#ff4d4f' }}>-{formatQty(qty)}</span>,
    },
    {
      title: 'สุทธิ',
      dataIndex: 'qtyNet',
      key: 'qtyNet',
      width: 100,
      align: 'right' as const,
      render: (qty: number) => (
        <span style={{ color: qty >= 0 ? '#52c41a' : '#ff4d4f', fontWeight: 'bold' }}>
          {qty >= 0 ? '+' : ''}{formatQty(qty)}
        </span>
      ),
    },
    {
      title: 'มูลค่าจ่ายออก',
      dataIndex: 'valueOut',
      key: 'valueOut',
      width: 130,
      align: 'right' as const,
      sorter: (a: MovementItem, b: MovementItem) => a.valueOut - b.valueOut,
      render: (value: number) => formatCurrency(value),
    },
    {
      title: 'TX',
      dataIndex: 'transactionCount',
      key: 'transactionCount',
      width: 60,
      align: 'center' as const,
      sorter: (a: MovementItem, b: MovementItem) => a.transactionCount - b.transactionCount,
    },
    {
      title: 'ประเภท',
      dataIndex: 'movementClass',
      key: 'movementClass',
      width: 140,
      render: (cls: string) => getMovementTag(cls),
      filters: [
        { text: 'เคลื่อนไหวเร็ว', value: 'FAST' },
        { text: 'ปานกลาง', value: 'MEDIUM' },
        { text: 'เคลื่อนไหวช้า', value: 'SLOW' },
        { text: 'ไม่เคลื่อนไหว', value: 'NO_MOVEMENT' },
      ],
      onFilter: (value: any, record: MovementItem) => record.movementClass === value,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* Filter Section */}
      <Card 
        title={<><SwapOutlined /> รายงานการเคลื่อนไหวสินค้า (Stock Movement Report)</>}
        style={{ marginBottom: 16 }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <label style={{ display: 'block', marginBottom: 4, color: darkMode ? '#e0e0e0' : '#666' }}>
              ช่วงวันที่ *
            </label>
            <RangePicker
              style={{ width: '100%' }}
              value={dateRange}
              onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
              format="DD/MM/YYYY"
            />
          </Col>
          <Col xs={24} sm={12} md={5}>
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
          <Col xs={24} sm={12} md={5}>
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
              <Button type="primary" icon={<ReloadOutlined />} onClick={loadMovement} loading={loading}>
                แสดงข้อมูล
              </Button>
              <Button icon={<DownloadOutlined />} onClick={exportCSV} disabled={!movement}>
                CSV
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Content */}
      <Spin spinning={loading}>
        {movement && (
          <>
            {/* Summary Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
              <Col xs={12} sm={6}>
                <Card 
                  style={{ background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)', border: 'none', cursor: 'pointer' }}
                  onClick={() => setFilterClass(filterClass === 'FAST' ? null : 'FAST')}
                >
                  <Statistic
                    title={<span style={{ color: 'rgba(255,255,255,0.85)' }}><RiseOutlined /> เคลื่อนไหวเร็ว</span>}
                    value={movement.summary.fast}
                    suffix="รายการ"
                    valueStyle={{ color: '#fff', fontSize: 24, fontWeight: 700 }}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6}>
                <Card 
                  style={{ background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)', border: 'none', cursor: 'pointer' }}
                  onClick={() => setFilterClass(filterClass === 'MEDIUM' ? null : 'MEDIUM')}
                >
                  <Statistic
                    title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>📊 ปานกลาง</span>}
                    value={movement.summary.medium}
                    suffix="รายการ"
                    valueStyle={{ color: '#fff', fontSize: 24, fontWeight: 700 }}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6}>
                <Card 
                  style={{ background: 'linear-gradient(135deg, #faad14 0%, #ffc53d 100%)', border: 'none', cursor: 'pointer' }}
                  onClick={() => setFilterClass(filterClass === 'SLOW' ? null : 'SLOW')}
                >
                  <Statistic
                    title={<span style={{ color: 'rgba(255,255,255,0.85)' }}><FallOutlined /> เคลื่อนไหวช้า</span>}
                    value={movement.summary.slow}
                    suffix="รายการ"
                    valueStyle={{ color: '#fff', fontSize: 24, fontWeight: 700 }}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6}>
                <Card 
                  style={{ background: 'linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)', border: 'none', cursor: 'pointer' }}
                  onClick={() => setFilterClass(filterClass === 'NO_MOVEMENT' ? null : 'NO_MOVEMENT')}
                >
                  <Statistic
                    title={<span style={{ color: 'rgba(255,255,255,0.85)' }}><PauseOutlined /> ไม่เคลื่อนไหว</span>}
                    value={movement.summary.noMovement}
                    suffix="รายการ"
                    valueStyle={{ color: '#fff', fontSize: 24, fontWeight: 700 }}
                  />
                </Card>
              </Col>
            </Row>

            {/* Movement Summary */}
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
              <Col xs={24} md={12}>
                <Card title="📈 สรุปการรับเข้า">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic 
                        title="จำนวนรวม" 
                        value={movement.summary.totalQtyIn} 
                        precision={0}
                        valueStyle={{ color: '#52c41a' }}
                        prefix="+"
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic 
                        title="มูลค่ารวม" 
                        value={movement.summary.totalValueIn} 
                        precision={2}
                        prefix="฿"
                        valueStyle={{ color: '#52c41a' }}
                      />
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card title="📉 สรุปการจ่ายออก">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic 
                        title="จำนวนรวม" 
                        value={movement.summary.totalQtyOut} 
                        precision={0}
                        valueStyle={{ color: '#ff4d4f' }}
                        prefix="-"
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic 
                        title="มูลค่ารวม" 
                        value={movement.summary.totalValueOut} 
                        precision={2}
                        prefix="฿"
                        valueStyle={{ color: '#ff4d4f' }}
                      />
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>

            {/* Filter indicator */}
            {filterClass && (
              <div style={{ marginBottom: 16 }}>
                <Tag 
                  closable 
                  onClose={() => setFilterClass(null)}
                  color="blue"
                >
                  กรอง: {filterClass === 'FAST' ? 'เคลื่อนไหวเร็ว' : 
                         filterClass === 'MEDIUM' ? 'ปานกลาง' : 
                         filterClass === 'SLOW' ? 'เคลื่อนไหวช้า' : 'ไม่เคลื่อนไหว'}
                </Tag>
              </div>
            )}

            {/* Data Table */}
            <Card 
              title={`📋 รายละเอียดการเคลื่อนไหว (${dateRange[0].format('DD/MM/YYYY')} - ${dateRange[1].format('DD/MM/YYYY')})`}
            >
              <Table
                dataSource={filteredItems}
                columns={columns}
                rowKey="productId"
                pagination={{ pageSize: 50, showSizeChanger: true, showTotal: (total) => `ทั้งหมด ${total} รายการ` }}
                scroll={{ x: 1100 }}
                size="small"
                summary={() => (
                  <Table.Summary fixed>
                    <Table.Summary.Row style={{ background: darkMode ? 'rgba(255,255,255,0.05)' : '#fafafa', fontWeight: 'bold' }}>
                      <Table.Summary.Cell index={0} colSpan={3}>รวมทั้งหมด ({filteredItems.length} รายการ)</Table.Summary.Cell>
                      <Table.Summary.Cell index={1} align="right">
                        <span style={{ color: '#52c41a' }}>+{formatQty(filteredItems.reduce((s, i) => s + i.qtyIn, 0))}</span>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={2} align="right">
                        <span style={{ color: '#ff4d4f' }}>-{formatQty(filteredItems.reduce((s, i) => s + i.qtyOut, 0))}</span>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={3} align="right">
                        {formatQty(filteredItems.reduce((s, i) => s + i.qtyNet, 0))}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={4} align="right">
                        {formatCurrency(filteredItems.reduce((s, i) => s + i.valueOut, 0))}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={5} align="center">
                        {filteredItems.reduce((s, i) => s + i.transactionCount, 0)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={6}></Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                )}
              />
            </Card>
          </>
        )}

        {!movement && !loading && (
          <Card>
            <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
              <SwapOutlined style={{ fontSize: 48, marginBottom: 16 }} />
              <p>เลือกช่วงวันที่และกดปุ่ม "แสดงข้อมูล" เพื่อดูรายงานการเคลื่อนไหว</p>
            </div>
          </Card>
        )}
      </Spin>
    </div>
  );
};

export default StockMovementPage;
