import React, { useEffect, useState } from 'react';
import { Card, Table, Select, Button, Space, Tag, Spin, Row, Col, message, Input, Modal, Form, DatePicker } from 'antd';
import { 
  BarcodeOutlined, 
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../services/api';

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

interface SerialNumber {
  id: number;
  serialNo: string;
  productId: number;
  productCode: string;
  productName: string;
  warehouseId: number;
  status: string;
  grDocNo: string;
  receivedDate: string;
  invoiceDocNo: string;
  soldDate: string;
  lotNo: string;
  expiryDate: string;
  notes: string;
  createdAt: string;
}

const SerialNumberPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [serials, setSerials] = useState<SerialNumber[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [form] = Form.useForm();
  const [darkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  useEffect(() => {
    loadMasterData();
  }, []);

  useEffect(() => {
    loadSerials();
  }, [selectedProduct, selectedWarehouse, selectedStatus]);

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

  const loadSerials = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (selectedProduct) params.productId = selectedProduct;
      if (selectedWarehouse) params.warehouseId = selectedWarehouse;
      if (selectedStatus) params.status = selectedStatus;
      if (searchText) params.search = searchText;
      
      const response = await api.get('/api/stock/serial-numbers', { params });
      setSerials(response.data || []);
    } catch (error) {
      console.error('Error loading serials:', error);
      message.error('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadSerials();
  };

  const handleCreate = (bulk: boolean = false) => {
    setBulkMode(bulk);
    form.resetFields();
    setModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (bulkMode) {
        const serialNumbers = values.serialNumbers
          .split('\n')
          .map((s: string) => s.trim())
          .filter((s: string) => s);
        
        const result = await api.post('/api/stock/serial-numbers/bulk', {
          productId: values.productId,
          serialNumbers,
          warehouseId: values.warehouseId,
          lotNo: values.lotNo,
          expiryDate: values.expiryDate?.format('YYYY-MM-DD'),
        });
        
        message.success(`สร้างสำเร็จ ${result.data.created} รายการ, ข้าม ${result.data.skipped} รายการ`);
      } else {
        await api.post('/api/stock/serial-numbers', {
          productId: values.productId,
          serialNo: values.serialNo,
          warehouseId: values.warehouseId,
          lotNo: values.lotNo,
          expiryDate: values.expiryDate?.format('YYYY-MM-DD'),
          notes: values.notes,
        });
        message.success('สร้าง Serial Number สำเร็จ');
      }
      setModalVisible(false);
      loadSerials();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await api.post(`/api/stock/serial-numbers/${id}/status`, { status: newStatus });
      message.success('อัพเดทสถานะสำเร็จ');
      loadSerials();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const exportCSV = () => {
    if (!serials.length) {
      message.warning('ไม่มีข้อมูลให้ส่งออก');
      return;
    }

    const headers = ['Serial No', 'รหัสสินค้า', 'ชื่อสินค้า', 'สถานะ', 'Lot No', 'วันหมดอายุ', 'GR เลขที่', 'วันที่รับ', 'Invoice เลขที่', 'วันที่ขาย'];
    
    const statusLabels: Record<string, string> = {
      'IN_STOCK': 'ในสต็อก',
      'SOLD': 'ขายแล้ว',
      'RESERVED': 'จองแล้ว',
      'DEFECTIVE': 'ชำรุด',
      'RETURNED': 'คืนสินค้า',
    };
    
    const rows = serials.map(item => [
      item.serialNo,
      item.productCode,
      item.productName,
      statusLabels[item.status] || item.status,
      item.lotNo || '-',
      item.expiryDate ? dayjs(item.expiryDate).format('DD/MM/YYYY') : '-',
      item.grDocNo || '-',
      item.receivedDate ? dayjs(item.receivedDate).format('DD/MM/YYYY') : '-',
      item.invoiceDocNo || '-',
      item.soldDate ? dayjs(item.soldDate).format('DD/MM/YYYY') : '-',
    ]);

    const csvContent = [
      `รายงาน Serial Number`,
      `วันที่พิมพ์: ${dayjs().format('DD/MM/YYYY HH:mm')}`,
      '',
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `SerialNumbers_${dayjs().format('YYYYMMDD_HHmm')}.csv`;
    link.click();
    message.success('ส่งออก CSV สำเร็จ');
  };

  const getStatusTag = (status: string) => {
    const config: Record<string, { color: string; label: string }> = {
      'IN_STOCK': { color: 'green', label: 'ในสต็อก' },
      'SOLD': { color: 'blue', label: 'ขายแล้ว' },
      'RESERVED': { color: 'orange', label: 'จองแล้ว' },
      'DEFECTIVE': { color: 'red', label: 'ชำรุด' },
      'RETURNED': { color: 'purple', label: 'คืนสินค้า' },
    };
    const { color, label } = config[status] || { color: 'default', label: status };
    return <Tag color={color}>{label}</Tag>;
  };

  const columns = [
    {
      title: 'Serial No',
      dataIndex: 'serialNo',
      key: 'serialNo',
      width: 150,
      sorter: (a: SerialNumber, b: SerialNumber) => a.serialNo.localeCompare(b.serialNo),
    },
    {
      title: 'สินค้า',
      key: 'product',
      width: 200,
      render: (_: any, r: SerialNumber) => (
        <div>
          <div style={{ fontWeight: 500 }}>{r.productCode}</div>
          <div style={{ fontSize: 12, color: '#888' }}>{r.productName}</div>
        </div>
      ),
    },
    {
      title: 'สถานะ',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => getStatusTag(status),
      filters: [
        { text: 'ในสต็อก', value: 'IN_STOCK' },
        { text: 'ขายแล้ว', value: 'SOLD' },
        { text: 'จองแล้ว', value: 'RESERVED' },
        { text: 'ชำรุด', value: 'DEFECTIVE' },
        { text: 'คืนสินค้า', value: 'RETURNED' },
      ],
      onFilter: (value: any, record: SerialNumber) => record.status === value,
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
      render: (v: string) => v ? dayjs(v).format('DD/MM/YYYY') : '-',
    },
    {
      title: 'GR เลขที่',
      dataIndex: 'grDocNo',
      key: 'grDocNo',
      width: 130,
      render: (v: string) => v || '-',
    },
    {
      title: 'Invoice',
      dataIndex: 'invoiceDocNo',
      key: 'invoiceDocNo',
      width: 130,
      render: (v: string) => v || '-',
    },
    {
      title: 'จัดการ',
      key: 'actions',
      width: 150,
      render: (_: any, r: SerialNumber) => (
        <Select
          size="small"
          value={r.status}
          onChange={(v) => handleStatusChange(r.id, v)}
          style={{ width: 120 }}
          options={[
            { value: 'IN_STOCK', label: 'ในสต็อก' },
            { value: 'SOLD', label: 'ขายแล้ว' },
            { value: 'RESERVED', label: 'จองแล้ว' },
            { value: 'DEFECTIVE', label: 'ชำรุด' },
            { value: 'RETURNED', label: 'คืนสินค้า' },
          ]}
        />
      ),
    },
  ];

  // Summary stats
  const statusCounts = {
    inStock: serials.filter(s => s.status === 'IN_STOCK').length,
    sold: serials.filter(s => s.status === 'SOLD').length,
    reserved: serials.filter(s => s.status === 'RESERVED').length,
    defective: serials.filter(s => s.status === 'DEFECTIVE').length,
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <Card 
        title={<><BarcodeOutlined /> Serial Number Tracking</>}
        style={{ marginBottom: 16 }}
        extra={
          <Space>
            <Button icon={<PlusOutlined />} onClick={() => handleCreate(false)}>
              เพิ่ม Serial
            </Button>
            <Button icon={<PlusOutlined />} onClick={() => handleCreate(true)}>
              เพิ่มหลายรายการ
            </Button>
          </Space>
        }
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={5}>
            <Select
              placeholder="เลือกสินค้า"
              style={{ width: '100%' }}
              value={selectedProduct}
              onChange={setSelectedProduct}
              allowClear
              showSearch
              filterOption={(input, opt) => (opt?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              options={[
                { value: null, label: 'ทุกสินค้า' },
                ...products.map(p => ({
                  value: p.id,
                  label: `${p.code} - ${p.name}`,
                })),
              ]}
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="สถานะ"
              style={{ width: '100%' }}
              value={selectedStatus}
              onChange={setSelectedStatus}
              allowClear
              options={[
                { value: null, label: 'ทุกสถานะ' },
                { value: 'IN_STOCK', label: 'ในสต็อก' },
                { value: 'SOLD', label: 'ขายแล้ว' },
                { value: 'RESERVED', label: 'จองแล้ว' },
                { value: 'DEFECTIVE', label: 'ชำรุด' },
                { value: 'RETURNED', label: 'คืนสินค้า' },
              ]}
            />
          </Col>
          <Col xs={24} sm={12} md={5}>
            <Input
              placeholder="ค้นหา Serial No"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={handleSearch}
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Space>
              <Button type="primary" icon={<ReloadOutlined />} onClick={loadSerials} loading={loading}>
                ค้นหา
              </Button>
              <Button icon={<DownloadOutlined />} onClick={exportCSV} disabled={!serials.length}>
                CSV
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Summary */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={6}>
          <Card size="small" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)', border: 'none' }}>
            <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12 }}>ในสต็อก</div>
            <div style={{ color: '#fff', fontSize: 24, fontWeight: 700 }}>{statusCounts.inStock}</div>
          </Card>
        </Col>
        <Col xs={6}>
          <Card size="small" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)', border: 'none' }}>
            <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12 }}>ขายแล้ว</div>
            <div style={{ color: '#fff', fontSize: 24, fontWeight: 700 }}>{statusCounts.sold}</div>
          </Card>
        </Col>
        <Col xs={6}>
          <Card size="small" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #faad14 0%, #ffc53d 100%)', border: 'none' }}>
            <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12 }}>จองแล้ว</div>
            <div style={{ color: '#fff', fontSize: 24, fontWeight: 700 }}>{statusCounts.reserved}</div>
          </Card>
        </Col>
        <Col xs={6}>
          <Card size="small" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)', border: 'none' }}>
            <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12 }}>ชำรุด</div>
            <div style={{ color: '#fff', fontSize: 24, fontWeight: 700 }}>{statusCounts.defective}</div>
          </Card>
        </Col>
      </Row>

      {/* Data Table */}
      <Spin spinning={loading}>
        <Card title={`📋 รายการ Serial Number (${serials.length} รายการ)`}>
          <Table
            dataSource={serials}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 50, showSizeChanger: true, showTotal: (total) => `ทั้งหมด ${total} รายการ` }}
            scroll={{ x: 1200 }}
            size="small"
          />
        </Card>
      </Spin>

      {/* Create Modal */}
      <Modal
        title={bulkMode ? 'เพิ่ม Serial Number หลายรายการ' : 'เพิ่ม Serial Number'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item 
            name="productId" 
            label="สินค้า" 
            rules={[{ required: true, message: 'กรุณาเลือกสินค้า' }]}
          >
            <Select
              placeholder="เลือกสินค้า"
              showSearch
              filterOption={(input, opt) => (opt?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              options={products.map(p => ({
                value: p.id,
                label: `${p.code} - ${p.name}`,
              }))}
            />
          </Form.Item>
          
          {bulkMode ? (
            <Form.Item 
              name="serialNumbers" 
              label="Serial Numbers (หนึ่งรายการต่อบรรทัด)"
              rules={[{ required: true, message: 'กรุณากรอก Serial Numbers' }]}
            >
              <Input.TextArea rows={6} placeholder="SN001&#10;SN002&#10;SN003" />
            </Form.Item>
          ) : (
            <Form.Item 
              name="serialNo" 
              label="Serial Number"
              rules={[{ required: true, message: 'กรุณากรอก Serial Number' }]}
            >
              <Input placeholder="เช่น SN-2024-001" />
            </Form.Item>
          )}
          
          <Form.Item name="warehouseId" label="คลังสินค้า">
            <Select
              placeholder="เลือกคลัง"
              allowClear
              options={warehouses.map(w => ({
                value: w.id,
                label: `${w.code} - ${w.name}`,
              }))}
            />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="lotNo" label="Lot No">
                <Input placeholder="Lot Number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="expiryDate" label="วันหมดอายุ">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          
          {!bulkMode && (
            <Form.Item name="notes" label="หมายเหตุ">
              <Input.TextArea rows={2} />
            </Form.Item>
          )}
          
          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setModalVisible(false)}>ยกเลิก</Button>
              <Button type="primary" htmlType="submit">
                {bulkMode ? 'สร้างทั้งหมด' : 'สร้าง Serial'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SerialNumberPage;
