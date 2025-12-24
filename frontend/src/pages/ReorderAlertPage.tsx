import React, { useEffect, useState } from 'react';
import { Card, Table, Select, Button, Space, Tag, Spin, Row, Col, Statistic, message, Alert, Tooltip } from 'antd';
import { 
  AlertOutlined, 
  DownloadOutlined,
  ReloadOutlined,
  WarningOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../services/api';

interface Category {
  id: number;
  name: string;
}

interface Warehouse {
  id: number;
  code: string;
  name: string;
}

interface ReorderAlert {
  productId: number;
  productCode: string;
  productName: string;
  unit: string;
  categoryName: string;
  warehouseId: number;
  warehouseCode: string;
  warehouseName: string;
  qtyOnHand: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  avgCost: number;
  alertLevel: 'CRITICAL' | 'WARNING' | 'NORMAL' | 'OVERSTOCK';
  suggestedOrderQty: number;
  estimatedCost: number;
}

interface AlertData {
  summary: {
    totalProducts: number;
    critical: number;
    warning: number;
    normal: number;
    totalAlerts: number;
    totalEstimatedCost: number;
  };
  alerts: ReorderAlert[];
}

const ReorderAlertPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState<number | null>(null);
  const [alertData, setAlertData] = useState<AlertData | null>(null);
  const [darkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  useEffect(() => {
    loadMasterData();
  }, []);

  useEffect(() => {
    loadAlerts();
  }, [selectedWarehouse, selectedCategory]);

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

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (selectedWarehouse) params.warehouseId = selectedWarehouse;
      if (selectedCategory) params.categoryId = selectedCategory;
      
      const response = await api.get('/api/stock/reorder-alerts', { params });
      setAlertData(response.data);
    } catch (error) {
      console.error('Error loading alerts:', error);
      message.error('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (!alertData || !alertData.alerts.length) {
      message.warning('ไม่มีข้อมูลให้ส่งออก');
      return;
    }

    const headers = ['รหัสสินค้า', 'ชื่อสินค้า', 'หน่วย', 'หมวดหมู่', 'คลังสินค้า', 'คงเหลือ', 'จุดสั่งซื้อ', 'Min Stock', 'Max Stock', 'ระดับ', 'แนะนำสั่ง', 'ประมาณการ'];
    
    const levelLabels: Record<string, string> = {
      'CRITICAL': 'วิกฤต',
      'WARNING': 'เตือน',
    };
    
    const rows = alertData.alerts.map(item => [
      item.productCode,
      item.productName,
      item.unit || '-',
      item.categoryName,
      item.warehouseName,
      item.qtyOnHand.toFixed(2),
      item.reorderPoint.toFixed(2),
      item.minStock.toFixed(2),
      item.maxStock.toFixed(2),
      levelLabels[item.alertLevel] || item.alertLevel,
      item.suggestedOrderQty.toFixed(0),
      item.estimatedCost.toFixed(2),
    ]);

    const csvContent = [
      `รายงานแจ้งเตือนจุดสั่งซื้อ (Reorder Point Alert)`,
      `วันที่พิมพ์: ${dayjs().format('DD/MM/YYYY HH:mm')}`,
      `สินค้าวิกฤต: ${alertData.summary.critical} รายการ, สินค้าเตือน: ${alertData.summary.warning} รายการ`,
      '',
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `ReorderAlert_${dayjs().format('YYYYMMDD_HHmm')}.csv`;
    link.click();
    message.success('ส่งออก CSV สำเร็จ');
  };

  const formatCurrency = (value: number) => {
    return `฿${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatQty = (value: number) => {
    return value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  const getAlertTag = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return <Tag color="red" icon={<ExclamationCircleOutlined />}>วิกฤต</Tag>;
      case 'WARNING':
        return <Tag color="orange" icon={<WarningOutlined />}>เตือน</Tag>;
      default:
        return <Tag>{level}</Tag>;
    }
  };

  const getStockStatus = (qty: number, min: number, reorder: number) => {
    const percentage = reorder > 0 ? (qty / reorder) * 100 : 100;
    let color = '#52c41a';
    if (qty <= 0) color = '#ff4d4f';
    else if (qty <= min) color = '#ff4d4f';
    else if (qty <= reorder) color = '#faad14';
    
    return (
      <Tooltip title={`${formatQty(qty)} / ${formatQty(reorder)} (${percentage.toFixed(0)}%)`}>
        <div style={{ 
          width: '100%', 
          height: 8, 
          background: darkMode ? 'rgba(255,255,255,0.1)' : '#f0f0f0', 
          borderRadius: 4,
          overflow: 'hidden'
        }}>
          <div style={{ 
            width: `${Math.min(percentage, 100)}%`, 
            height: '100%', 
            background: color,
            borderRadius: 4,
          }} />
        </div>
      </Tooltip>
    );
  };

  const columns = [
    {
      title: 'ระดับ',
      dataIndex: 'alertLevel',
      key: 'alertLevel',
      width: 90,
      render: (level: string) => getAlertTag(level),
      filters: [
        { text: 'วิกฤต', value: 'CRITICAL' },
        { text: 'เตือน', value: 'WARNING' },
      ],
      onFilter: (value: any, record: ReorderAlert) => record.alertLevel === value,
    },
    {
      title: 'รหัสสินค้า',
      dataIndex: 'productCode',
      key: 'productCode',
      width: 110,
      sorter: (a: ReorderAlert, b: ReorderAlert) => a.productCode.localeCompare(b.productCode),
    },
    {
      title: 'ชื่อสินค้า',
      dataIndex: 'productName',
      key: 'productName',
      ellipsis: true,
    },
    {
      title: 'คลังสินค้า',
      dataIndex: 'warehouseName',
      key: 'warehouseName',
      width: 120,
      filters: warehouses.map(w => ({ text: w.name, value: w.name })),
      onFilter: (value: any, record: ReorderAlert) => record.warehouseName === value,
    },
    {
      title: 'คงเหลือ',
      dataIndex: 'qtyOnHand',
      key: 'qtyOnHand',
      width: 100,
      align: 'right' as const,
      sorter: (a: ReorderAlert, b: ReorderAlert) => a.qtyOnHand - b.qtyOnHand,
      render: (qty: number, record: ReorderAlert) => (
        <span style={{ 
          color: qty <= 0 ? '#ff4d4f' : qty <= record.minStock ? '#ff4d4f' : qty <= record.reorderPoint ? '#faad14' : '#52c41a',
          fontWeight: qty <= record.minStock ? 'bold' : 'normal'
        }}>
          {formatQty(qty)}
        </span>
      ),
    },
    {
      title: 'สถานะ',
      key: 'status',
      width: 120,
      render: (_: any, record: ReorderAlert) => getStockStatus(record.qtyOnHand, record.minStock, record.reorderPoint),
    },
    {
      title: 'จุดสั่งซื้อ',
      dataIndex: 'reorderPoint',
      key: 'reorderPoint',
      width: 90,
      align: 'right' as const,
      render: (qty: number) => formatQty(qty),
    },
    {
      title: 'Min/Max',
      key: 'minMax',
      width: 100,
      align: 'center' as const,
      render: (_: any, record: ReorderAlert) => (
        <span style={{ fontSize: 12 }}>
          {formatQty(record.minStock)} / {formatQty(record.maxStock)}
        </span>
      ),
    },
    {
      title: 'แนะนำสั่ง',
      dataIndex: 'suggestedOrderQty',
      key: 'suggestedOrderQty',
      width: 100,
      align: 'right' as const,
      sorter: (a: ReorderAlert, b: ReorderAlert) => a.suggestedOrderQty - b.suggestedOrderQty,
      render: (qty: number) => (
        <span style={{ color: '#1890ff', fontWeight: 'bold' }}>
          {formatQty(qty)}
        </span>
      ),
    },
    {
      title: 'ประมาณการ',
      dataIndex: 'estimatedCost',
      key: 'estimatedCost',
      width: 120,
      align: 'right' as const,
      sorter: (a: ReorderAlert, b: ReorderAlert) => a.estimatedCost - b.estimatedCost,
      render: (cost: number) => formatCurrency(cost),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <Card 
        title={<><AlertOutlined /> แจ้งเตือนจุดสั่งซื้อ (Reorder Point Alert)</>}
        style={{ marginBottom: 16 }}
      >
        <Row gutter={[16, 16]} align="middle">
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
              <Button type="primary" icon={<ReloadOutlined />} onClick={loadAlerts} loading={loading}>
                รีเฟรช
              </Button>
              <Button icon={<DownloadOutlined />} onClick={exportCSV} disabled={!alertData?.alerts.length}>
                CSV
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Content */}
      <Spin spinning={loading}>
        {alertData && (
          <>
            {/* Alert Banner */}
            {alertData.summary.critical > 0 && (
              <Alert
                message={`พบสินค้าวิกฤต ${alertData.summary.critical} รายการ ที่ต้องสั่งซื้อด่วน!`}
                type="error"
                showIcon
                icon={<ExclamationCircleOutlined />}
                style={{ marginBottom: 16 }}
              />
            )}

            {/* Summary Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
              <Col xs={12} sm={6}>
                <Card style={{ background: 'linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)', border: 'none' }}>
                  <Statistic
                    title={<span style={{ color: 'rgba(255,255,255,0.85)' }}><ExclamationCircleOutlined /> วิกฤต</span>}
                    value={alertData.summary.critical}
                    suffix="รายการ"
                    valueStyle={{ color: '#fff', fontSize: 28, fontWeight: 700 }}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6}>
                <Card style={{ background: 'linear-gradient(135deg, #faad14 0%, #ffc53d 100%)', border: 'none' }}>
                  <Statistic
                    title={<span style={{ color: 'rgba(255,255,255,0.85)' }}><WarningOutlined /> เตือน</span>}
                    value={alertData.summary.warning}
                    suffix="รายการ"
                    valueStyle={{ color: '#fff', fontSize: 28, fontWeight: 700 }}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6}>
                <Card style={{ background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)', border: 'none' }}>
                  <Statistic
                    title={<span style={{ color: 'rgba(255,255,255,0.85)' }}><CheckCircleOutlined /> ปกติ</span>}
                    value={alertData.summary.normal}
                    suffix="รายการ"
                    valueStyle={{ color: '#fff', fontSize: 28, fontWeight: 700 }}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6}>
                <Card style={{ background: 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)', border: 'none' }}>
                  <Statistic
                    title={<span style={{ color: 'rgba(255,255,255,0.85)' }}><ShoppingCartOutlined /> ประมาณการสั่งซื้อ</span>}
                    value={alertData.summary.totalEstimatedCost}
                    precision={0}
                    prefix="฿"
                    valueStyle={{ color: '#fff', fontSize: 24, fontWeight: 700 }}
                  />
                </Card>
              </Col>
            </Row>

            {/* Data Table */}
            <Card title={`📋 รายการแจ้งเตือน (${alertData.alerts.length} รายการ)`}>
              {alertData.alerts.length > 0 ? (
                <Table
                  dataSource={alertData.alerts}
                  columns={columns}
                  rowKey={(record) => `${record.productId}-${record.warehouseId}`}
                  pagination={{ pageSize: 50, showSizeChanger: true, showTotal: (total) => `ทั้งหมด ${total} รายการ` }}
                  scroll={{ x: 1200 }}
                  size="small"
                  rowClassName={(record) => record.alertLevel === 'CRITICAL' ? 'critical-row' : ''}
                  summary={() => (
                    <Table.Summary fixed>
                      <Table.Summary.Row style={{ background: darkMode ? 'rgba(255,255,255,0.05)' : '#fafafa', fontWeight: 'bold' }}>
                        <Table.Summary.Cell index={0} colSpan={8}>รวมทั้งหมด</Table.Summary.Cell>
                        <Table.Summary.Cell index={1} align="right">
                          <span style={{ color: '#1890ff' }}>
                            {formatQty(alertData.alerts.reduce((s, i) => s + i.suggestedOrderQty, 0))}
                          </span>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={2} align="right">
                          <span style={{ color: '#722ed1', fontWeight: 'bold' }}>
                            {formatCurrency(alertData.summary.totalEstimatedCost)}
                          </span>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    </Table.Summary>
                  )}
                />
              ) : (
                <div style={{ textAlign: 'center', padding: 40, color: '#52c41a' }}>
                  <CheckCircleOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                  <p>ไม่มีสินค้าที่ต้องแจ้งเตือน - สต็อกอยู่ในระดับปกติ</p>
                </div>
              )}
            </Card>

            {/* Info */}
            <Card style={{ marginTop: 16 }}>
              <div style={{ fontSize: 12, color: '#888' }}>
                <strong>หมายเหตุ:</strong>
                <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
                  <li><Tag color="red">วิกฤต</Tag> = คงเหลือ ≤ Min Stock หรือ หมด</li>
                  <li><Tag color="orange">เตือน</Tag> = คงเหลือ ≤ Reorder Point</li>
                  <li>แนะนำสั่ง = (Max Stock หรือ Reorder Point x 2) - คงเหลือ</li>
                  <li>ประมาณการ = แนะนำสั่ง x ต้นทุนมาตรฐาน</li>
                </ul>
              </div>
            </Card>
          </>
        )}

        {!alertData && !loading && (
          <Card>
            <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
              <AlertOutlined style={{ fontSize: 48, marginBottom: 16 }} />
              <p>กำลังโหลดข้อมูล...</p>
            </div>
          </Card>
        )}
      </Spin>

      <style>{`
        .critical-row {
          background: ${darkMode ? 'rgba(255, 77, 79, 0.1)' : 'rgba(255, 77, 79, 0.05)'} !important;
        }
        .critical-row:hover > td {
          background: ${darkMode ? 'rgba(255, 77, 79, 0.15)' : 'rgba(255, 77, 79, 0.1)'} !important;
        }
      `}</style>
    </div>
  );
};

export default ReorderAlertPage;
