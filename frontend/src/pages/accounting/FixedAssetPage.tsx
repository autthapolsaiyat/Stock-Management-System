import React, { useState, useEffect } from 'react';
import {
  Card, Table, Button, Space, Tag, Modal, Form, Input, Select, DatePicker,
  message, Popconfirm, Typography, Row, Col, InputNumber, Tabs, Statistic
} from 'antd';
import {
  PlusOutlined, DeleteOutlined, EditOutlined, EyeOutlined,
  CarOutlined, HomeOutlined, ToolOutlined, LaptopOutlined,
  CalculatorOutlined
} from '@ant-design/icons';
import { fixedAssetsApi } from '../../services/api';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface FixedAsset {
  id: number;
  assetCode: string;
  name: string;
  description: string;
  category: string;
  location: string;
  acquisitionDate: string;
  acquisitionCost: number;
  usefulLife: number;
  salvageValue: number;
  depreciationMethod: string;
  accumulatedDepreciation: number;
  netBookValue: number;
  status: string;
  disposalDate?: string;
  disposalAmount?: number;
  depreciationHistory: DepreciationEntry[];
}

interface DepreciationEntry {
  id: number;
  year: number;
  month: number;
  depreciationAmount: number;
  accumulatedDepreciation: number;
  netBookValue: number;
  createdAt: string;
}

const ASSET_CATEGORIES = [
  { value: 'BUILDING', label: 'อาคารและสิ่งปลูกสร้าง', icon: <HomeOutlined />, life: 20 },
  { value: 'VEHICLE', label: 'ยานพาหนะ', icon: <CarOutlined />, life: 5 },
  { value: 'MACHINERY', label: 'เครื่องจักรและอุปกรณ์', icon: <ToolOutlined />, life: 5 },
  { value: 'FURNITURE', label: 'เครื่องตกแต่งและเฟอร์นิเจอร์', icon: <HomeOutlined />, life: 5 },
  { value: 'COMPUTER', label: 'คอมพิวเตอร์และอุปกรณ์', icon: <LaptopOutlined />, life: 3 },
  { value: 'OTHER', label: 'สินทรัพย์อื่นๆ', icon: <ToolOutlined />, life: 5 },
];

const DEPRECIATION_METHODS = [
  { value: 'STRAIGHT_LINE', label: 'วิธีเส้นตรง (Straight Line)' },
  { value: 'DECLINING_BALANCE', label: 'วิธียอดลดลง (Declining Balance)' },
];

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: 'ใช้งาน', color: 'success' },
  DISPOSED: { label: 'จำหน่ายแล้ว', color: 'default' },
  FULLY_DEPRECIATED: { label: 'หมดค่าเสื่อม', color: 'warning' },
};

const FixedAssetPage: React.FC = () => {
  const [assets, setAssets] = useState<FixedAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editingAsset, setEditingAsset] = useState<FixedAsset | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<FixedAsset | null>(null);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fixedAssetsApi.getAll();
      setAssets(res.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (asset?: FixedAsset) => {
    if (asset) {
      setEditingAsset(asset);
      form.setFieldsValue({
        ...asset,
        acquisitionDate: dayjs(asset.acquisitionDate),
      });
    } else {
      setEditingAsset(null);
      form.resetFields();
      form.setFieldsValue({
        acquisitionDate: dayjs(),
        depreciationMethod: 'STRAIGHT_LINE',
        salvageValue: 1,
      });
    }
    setModalVisible(true);
  };

  const handleView = async (asset: FixedAsset) => {
    try {
      const res = await fixedAssetsApi.getById(asset.id);
      setSelectedAsset(res.data);
      setViewModalVisible(true);
    } catch (error) {
      message.error('เกิดข้อผิดพลาด');
    }
  };

  const handleCategoryChange = (category: string) => {
    const cat = ASSET_CATEGORIES.find(c => c.value === category);
    if (cat) {
      form.setFieldsValue({ usefulLife: cat.life });
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        ...values,
        acquisitionDate: values.acquisitionDate.format('YYYY-MM-DD'),
      };

      if (editingAsset) {
        await fixedAssetsApi.update(editingAsset.id, data);
        message.success('แก้ไขสินทรัพย์สำเร็จ');
      } else {
        await fixedAssetsApi.create(data);
        message.success('เพิ่มสินทรัพย์สำเร็จ');
      }
      setModalVisible(false);
      loadData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const handleCalculateDepreciation = async () => {
    try {
      const year = dayjs().year();
      const month = dayjs().month() + 1;
      await fixedAssetsApi.calculateDepreciation(year, month);
      message.success('คำนวณค่าเสื่อมราคาสำเร็จ');
      loadData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const handleDispose = async (id: number) => {
    const amount = window.prompt('ระบุราคาขาย/จำหน่าย (บาท):');
    if (amount === null) return;
    
    try {
      await fixedAssetsApi.dispose(id, {
        disposalDate: dayjs().format('YYYY-MM-DD'),
        disposalAmount: parseFloat(amount) || 0,
      });
      message.success('จำหน่ายสินทรัพย์สำเร็จ');
      loadData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('th-TH', { minimumFractionDigits: 2 });
  };

  const totalCost = assets.filter(a => a.status === 'ACTIVE').reduce((sum, a) => sum + a.acquisitionCost, 0);
  const totalAccumDepreciation = assets.filter(a => a.status === 'ACTIVE').reduce((sum, a) => sum + a.accumulatedDepreciation, 0);
  const totalNetBookValue = assets.filter(a => a.status === 'ACTIVE').reduce((sum, a) => sum + a.netBookValue, 0);

  const columns = [
    {
      title: 'รหัส',
      dataIndex: 'assetCode',
      key: 'assetCode',
      width: 100,
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'ชื่อสินทรัพย์',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'ประเภท',
      dataIndex: 'category',
      key: 'category',
      width: 150,
      render: (cat: string) => {
        const category = ASSET_CATEGORIES.find(c => c.value === cat);
        return (
          <Space>
            {category?.icon}
            <span>{category?.label || cat}</span>
          </Space>
        );
      },
    },
    {
      title: 'วันที่ได้มา',
      dataIndex: 'acquisitionDate',
      key: 'acquisitionDate',
      width: 110,
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'ราคาทุน',
      dataIndex: 'acquisitionCost',
      key: 'acquisitionCost',
      width: 120,
      align: 'right' as const,
      render: (val: number) => formatCurrency(val),
    },
    {
      title: 'ค่าเสื่อมสะสม',
      dataIndex: 'accumulatedDepreciation',
      key: 'accumulatedDepreciation',
      width: 120,
      align: 'right' as const,
      render: (val: number) => <Text type="danger">{formatCurrency(val)}</Text>,
    },
    {
      title: 'มูลค่าสุทธิ',
      dataIndex: 'netBookValue',
      key: 'netBookValue',
      width: 120,
      align: 'right' as const,
      render: (val: number) => <Text strong style={{ color: '#3f8600' }}>{formatCurrency(val)}</Text>,
    },
    {
      title: 'สถานะ',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const config = STATUS_CONFIG[status];
        return <Tag color={config?.color}>{config?.label}</Tag>;
      },
    },
    {
      title: 'จัดการ',
      key: 'action',
      width: 150,
      render: (_: unknown, record: FixedAsset) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} onClick={() => handleView(record)} />
          {record.status === 'ACTIVE' && (
            <>
              <Button type="text" icon={<EditOutlined />} onClick={() => handleOpenModal(record)} />
              <Popconfirm title="ต้องการจำหน่ายสินทรัพย์นี้?" onConfirm={() => handleDispose(record.id)}>
                <Button type="text" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  const filteredAssets = activeTab === 'all' ? assets : assets.filter(a => a.category === activeTab);

  return (
    <div style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Space>
            <ToolOutlined style={{ fontSize: 24 }} />
            <Title level={4} style={{ margin: 0 }}>ทะเบียนสินทรัพย์ถาวร</Title>
          </Space>
        </Col>
        <Col>
          <Space>
            <Button icon={<CalculatorOutlined />} onClick={handleCalculateDepreciation}>
              คำนวณค่าเสื่อมราคา
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
              เพิ่มสินทรัพย์
            </Button>
          </Space>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic title="จำนวนสินทรัพย์" value={assets.filter(a => a.status === 'ACTIVE').length} suffix="รายการ" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="ราคาทุนรวม" value={totalCost} precision={2} prefix="฿" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="ค่าเสื่อมราคาสะสม" value={totalAccumDepreciation} precision={2} prefix="฿" valueStyle={{ color: '#cf1322' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="มูลค่าสุทธิตามบัญชี" value={totalNetBookValue} precision={2} prefix="฿" valueStyle={{ color: '#3f8600' }} />
          </Card>
        </Col>
      </Row>

      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'all', label: 'ทั้งหมด' },
            ...ASSET_CATEGORIES.map(c => ({
              key: c.value,
              label: <Space>{c.icon} {c.label}</Space>,
            })),
          ]}
        />
        <Table columns={columns} dataSource={filteredAssets} rowKey="id" loading={loading} size="small" />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingAsset ? 'แก้ไขสินทรัพย์' : 'เพิ่มสินทรัพย์ใหม่'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={800}
        okText="บันทึก"
        cancelText="ยกเลิก"
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="assetCode" label="รหัสสินทรัพย์" rules={[{ required: true }]}>
                <Input placeholder="เช่น FA-001" />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item name="name" label="ชื่อสินทรัพย์" rules={[{ required: true }]}>
                <Input placeholder="เช่น เครื่องคอมพิวเตอร์ Dell" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="category" label="ประเภท" rules={[{ required: true }]}>
                <Select onChange={handleCategoryChange}>
                  {ASSET_CATEGORIES.map(c => (
                    <Option key={c.value} value={c.value}><Space>{c.icon} {c.label}</Space></Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="location" label="สถานที่">
                <Input placeholder="เช่น สำนักงานใหญ่" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="acquisitionDate" label="วันที่ได้มา" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="acquisitionCost" label="ราคาทุน" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} min={0} formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="salvageValue" label="มูลค่าซาก" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} min={1} formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="usefulLife" label="อายุการใช้งาน (ปี)" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} min={1} max={50} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="depreciationMethod" label="วิธีคิดค่าเสื่อมราคา" rules={[{ required: true }]}>
                <Select>
                  {DEPRECIATION_METHODS.map(m => (<Option key={m.value} value={m.value}>{m.label}</Option>))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="รายละเอียดเพิ่มเติม">
            <TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>

      {/* View Modal */}
      <Modal
        title={`รายละเอียดสินทรัพย์ - ${selectedAsset?.assetCode}`}
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[<Button key="close" onClick={() => setViewModalVisible(false)}>ปิด</Button>]}
        width={900}
      >
        {selectedAsset && (
          <>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={8}><Text type="secondary">รหัส</Text><div><Text strong>{selectedAsset.assetCode}</Text></div></Col>
              <Col span={16}><Text type="secondary">ชื่อ</Text><div><Text strong>{selectedAsset.name}</Text></div></Col>
            </Row>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={8}><Text type="secondary">ประเภท</Text><div>{ASSET_CATEGORIES.find(c => c.value === selectedAsset.category)?.label}</div></Col>
              <Col span={8}><Text type="secondary">วันที่ได้มา</Text><div>{dayjs(selectedAsset.acquisitionDate).format('DD/MM/YYYY')}</div></Col>
              <Col span={8}><Text type="secondary">อายุการใช้งาน</Text><div>{selectedAsset.usefulLife} ปี</div></Col>
            </Row>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={8}><Text type="secondary">ราคาทุน</Text><div style={{ fontSize: 18 }}>{formatCurrency(selectedAsset.acquisitionCost)}</div></Col>
              <Col span={8}><Text type="secondary">ค่าเสื่อมราคาสะสม</Text><div style={{ fontSize: 18, color: '#cf1322' }}>{formatCurrency(selectedAsset.accumulatedDepreciation)}</div></Col>
              <Col span={8}><Text type="secondary">มูลค่าสุทธิ</Text><div style={{ fontSize: 18, color: '#3f8600', fontWeight: 'bold' }}>{formatCurrency(selectedAsset.netBookValue)}</div></Col>
            </Row>
            {selectedAsset.depreciationHistory && selectedAsset.depreciationHistory.length > 0 && (
              <>
                <Title level={5} style={{ marginTop: 24 }}>ประวัติค่าเสื่อมราคา</Title>
                <Table
                  dataSource={selectedAsset.depreciationHistory}
                  rowKey="id"
                  size="small"
                  pagination={false}
                  columns={[
                    { title: 'ปี', dataIndex: 'year', width: 80 },
                    { title: 'เดือน', dataIndex: 'month', width: 80 },
                    { title: 'ค่าเสื่อมราคา', dataIndex: 'depreciationAmount', align: 'right', render: formatCurrency },
                    { title: 'ค่าเสื่อมสะสม', dataIndex: 'accumulatedDepreciation', align: 'right', render: formatCurrency },
                    { title: 'มูลค่าสุทธิ', dataIndex: 'netBookValue', align: 'right', render: (v: number) => <Text strong>{formatCurrency(v)}</Text> },
                  ]}
                />
              </>
            )}
          </>
        )}
      </Modal>
    </div>
  );
};

export default FixedAssetPage;
