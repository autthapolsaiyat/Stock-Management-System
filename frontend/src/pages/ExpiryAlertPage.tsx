import React, { useEffect, useState } from 'react';
import { Card, Table, Select, Button, Space, Tag, Spin, Row, Col, Statistic, message, Alert, InputNumber } from 'antd';
import { 
  ClockCircleOutlined, 
  DownloadOutlined,
  ReloadOutlined,
  WarningOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../services/api';

interface Warehouse {
  id: number;
  code: string;
  name: string;
}

interface ExpiryAlert {
  itemId: number;
  productId: number;
  productCode: string;
  productName: string;
  categoryName: string;
  warehouseId: number;
  warehouseName: string;
  lotNo: string;
  expiryDate: string;
  qty: number;
  grDocNo: string;
  daysUntilExpiry: number;
  alertLevel: 'EXPIRED' | 'CRITICAL' | 'WARNING' | 'NORMAL';
}

interface AlertData {
  summary: {
    totalItems: number;
    expired: number;
    warning: number;
    normal: number;
    totalAlerts: number;
  };
  alerts: ExpiryAlert[];
}

const ExpiryAlertPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<number | null>(null);
  const [daysAhead, setDaysAhead] = useState<number>(90);
  const [alertData, setAlertData] = useState<AlertData | null>(null);
  const [darkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  useEffect(() => {
    loadMasterData();
  }, []);

  useEffect(() => {
    loadAlerts();
  }, [selectedWarehouse, daysAhead]);

  const loadMasterData = async () => {
    try {
      const warehousesRes = await api.get('/api/warehouses');
      setWarehouses(warehousesRes.data || []);
    } catch (error) {
      console.error('Error loading master data:', error);
    }
  };

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const params: any = { daysAhead };
      if (selectedWarehouse) params.warehouseId = selectedWarehouse;
      
      const response = await api.get('/api/stock/expiry-alerts', { params });
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

    const headers = ['รหัสสินค้า', 'ชื่อสินค้า', 'หมวดหมู่', 'คลังสินค้า', 'Lot No', 'วันหมดอายุ', 'คงเหลือ', 'เหลือ (วัน)', 'สถานะ', 'GR เลขที่'];
    
    const levelLabels: Record<string, string> = {
      'EXPIRED': 'หมดอายุแล้ว',
      'CRITICAL': 'ใกล้หมดอายุมาก',
      'WARNING': 'ใกล้หมดอายุ',
    };
    
    const rows = alertData.alerts.map(item => [
      item.productCode,
      item.productName,
      item.categoryName,
      item.warehouseName,
      item.lotNo || '-',
      dayjs(item.expiryDate).format('DD/MM/YYYY'),
      item.qty.toFixed(2),
      item.daysUntilExpiry,
      levelLabels[item.alertLevel] || item.alertLevel,
      item.grDocNo,
    ]);

    const csvContent = [
      `รายงานแจ้งเตือนสินค้าหมดอายุ (Expiry Alert)`,
      `วันที่พิมพ์: ${dayjs().format('DD/MM/YYYY HH:mm')}`,
      `แจ้งเตือนล่วงหน้า: ${daysAhead} วัน`,
      '',
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `ExpiryAlert_${dayjs().format('YYYYMMDD_HHmm')}.csv`;
    link.click();
    message.success('ส่งออก CSV สำเร็จ');
  };

  const formatQty = (value: number) => {
    return value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  const getAlertTag = (level: string, days: number) => {
    switch (level) {
      case 'EXPIRED':
        return <Tag color="red" icon={<StopOutlined />}>หมดอายุแล้ว ({Math.abs(days)} วัน)</Tag>;
      case 'CRITICAL':
        return <Tag color="orange" icon={<ExclamationCircleOutlined />}>เหลือ {days} วัน</Tag>;
      case 'WARNING':
        return <Tag color="gold" icon={<WarningOutlined />}>เหลือ {days} วัน</Tag>;
      default:
        return <Tag color="green">ปกติ</Tag>;
    }
  };

  const columns = [
    {
      title: 'สถานะ',
      key: 'alertLevel',
      width: 150,
      render: (_: any, record: ExpiryAlert) => getAlertTag(record.alertLevel, record.daysUntilExpiry),
      filters: [
        { text: 'หมดอายุแล้ว', value: 'EXPIRED' },
        { text: 'ใกล้หมดอายุมาก', value: 'CRITICAL' },
        { text: 'ใกล้หมดอายุ', value: 'WARNING' },
      ],
      onFilter: (value: any, record: ExpiryAlert) => record.alertLevel === value,
    },
    {
      title: 'รหัสสินค้า',
      dataIndex: 'productCode',
      key: 'productCode',
      width: 110,
    },
    {
      title: 'ชื่อสินค้า',
      dataIndex: 'productName',
      key: 'productName',
      ellipsis: true,
    },
    {
      title: 'Lot No',
      dataIndex: 'lotNo',
      key: 'lotNo',
      width: 100,
      render: (v: string) => v || '-',
    },
    {
      title: 'วันหมดอายุ',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      width: 110,
      render: (v: string) => dayjs(v).format('DD/MM/YYYY'),
      sorter: (a: ExpiryAlert, b: ExpiryAlert) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime(),
    },
    {
      title: 'คงเหลือ',
      dataIndex: 'qty',
      key: 'qty',
      width: 90,
      align: 'right' as const,
      render: (qty: number) => formatQty(qty),
    },
    {
      title: 'คลังสินค้า',
      dataIndex: 'warehouseName',
      key: 'warehouseName',
      width: 120,
      filters: warehouses.map(w => ({ text: w.name, value: w.name })),
      onFilter: (value: any, record: ExpiryAlert) => record.warehouseName === value,
    },
    {
      title: 'GR เลขที่',
      dataIndex: 'grDocNo',
      key: 'grDocNo',
      width: 130,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <Card 
        title={<><ClockCircleOutlined /> แจ้งเตือนสินค้าหมดอายุ (Expiry Alert)</>}
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
              แจ้งเตือนล่วงหน้า (วัน)
            </label>
            <InputNumber
              min={1}
              max={365}
              value={daysAhead}
              onChange={(v) => setDaysAhead(v || 90)}
              style={{ width: '100%' }}
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
            {alertData.summary.expired > 0 && (
              <Alert
                message={`พบสินค้าหมดอายุแล้ว ${alertData.summary.expired} รายการ!`}
                type="error"
                showIcon
                icon={<StopOutlined />}
                style={{ marginBottom: 16 }}
              />
            )}

            {/* Summary Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
              <Col xs={12} sm={6}>
                <Card style={{ background: 'linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)', border: 'none' }}>
                  <Statistic
                    title={<span style={{ color: 'rgba(255,255,255,0.85)' }}><StopOutlined /> หมดอายุแล้ว</span>}
                    value={alertData.summary.expired}
                    suffix="รายการ"
                    valueStyle={{ color: '#fff', fontSize: 28, fontWeight: 700 }}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6}>
                <Card style={{ background: 'linear-gradient(135deg, #faad14 0%, #ffc53d 100%)', border: 'none' }}>
                  <Statistic
                    title={<span style={{ color: 'rgba(255,255,255,0.85)' }}><WarningOutlined /> ใกล้หมดอายุ</span>}
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
                <Card style={{ background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)', border: 'none' }}>
                  <Statistic
                    title={<span style={{ color: 'rgba(255,255,255,0.85)' }}><ClockCircleOutlined /> ทั้งหมด</span>}
                    value={alertData.summary.totalItems}
                    suffix="รายการ"
                    valueStyle={{ color: '#fff', fontSize: 28, fontWeight: 700 }}
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
                  rowKey="itemId"
                  pagination={{ pageSize: 50, showSizeChanger: true, showTotal: (total) => `ทั้งหมด ${total} รายการ` }}
                  scroll={{ x: 1100 }}
                  size="small"
                  rowClassName={(record) => 
                    record.alertLevel === 'EXPIRED' ? 'expired-row' : 
                    record.alertLevel === 'CRITICAL' ? 'critical-row' : ''
                  }
                />
              ) : (
                <div style={{ textAlign: 'center', padding: 40, color: '#52c41a' }}>
                  <CheckCircleOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                  <p>ไม่มีสินค้าที่ใกล้หมดอายุในช่วง {daysAhead} วันข้างหน้า</p>
                </div>
              )}
            </Card>

            {/* Info */}
            <Card style={{ marginTop: 16 }}>
              <div style={{ fontSize: 12, color: '#888' }}>
                <strong>หมายเหตุ:</strong>
                <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
                  <li><Tag color="red">หมดอายุแล้ว</Tag> = เลยวันหมดอายุแล้ว</li>
                  <li><Tag color="orange">ใกล้หมดอายุมาก</Tag> = เหลือไม่เกิน 30 วัน</li>
                  <li><Tag color="gold">ใกล้หมดอายุ</Tag> = เหลือไม่เกิน {daysAhead} วัน</li>
                </ul>
              </div>
            </Card>
          </>
        )}

        {!alertData && !loading && (
          <Card>
            <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
              <ClockCircleOutlined style={{ fontSize: 48, marginBottom: 16 }} />
              <p>กำลังโหลดข้อมูล...</p>
            </div>
          </Card>
        )}
      </Spin>

      <style>{`
        .expired-row {
          background: ${darkMode ? 'rgba(255, 77, 79, 0.15)' : 'rgba(255, 77, 79, 0.08)'} !important;
        }
        .expired-row:hover > td {
          background: ${darkMode ? 'rgba(255, 77, 79, 0.2)' : 'rgba(255, 77, 79, 0.12)'} !important;
        }
        .critical-row {
          background: ${darkMode ? 'rgba(250, 173, 20, 0.1)' : 'rgba(250, 173, 20, 0.05)'} !important;
        }
        .critical-row:hover > td {
          background: ${darkMode ? 'rgba(250, 173, 20, 0.15)' : 'rgba(250, 173, 20, 0.1)'} !important;
        }
      `}</style>
    </div>
  );
};

export default ExpiryAlertPage;
