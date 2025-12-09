import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Card,
  Space,
  Input,
  Modal,
  Form,
  InputNumber,
  Tag,
  message,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { customersApi } from '../services/api';
import { Customer } from '../types';

const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await customersApi.getAll();
      setCustomers(response.data || []);
    } catch (error) {
      message.error('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCustomer(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Customer) => {
    setEditingCustomer(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingCustomer) {
        await customersApi.update(editingCustomer.id, values);
        message.success('แก้ไขข้อมูลสำเร็จ');
      } else {
        await customersApi.create(values);
        message.success('เพิ่มลูกค้าสำเร็จ');
      }
      setModalVisible(false);
      loadData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const columns = [
    { title: 'รหัส', dataIndex: 'code', key: 'code', width: 120 },
    { title: 'ชื่อลูกค้า', dataIndex: 'name', key: 'name' },
    { title: 'เลขประจำตัวผู้เสียภาษี', dataIndex: 'taxId', key: 'taxId' },
    { title: 'โทรศัพท์', dataIndex: 'phone', key: 'phone' },
    { title: 'อีเมล', dataIndex: 'email', key: 'email' },
    {
      title: 'วงเงินเครดิต',
      dataIndex: 'creditLimit',
      key: 'creditLimit',
      align: 'right' as const,
      render: (val: number) => val ? `฿${val.toLocaleString()}` : '-',
    },
    {
      title: 'สถานะ',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive !== false ? 'success' : 'default'}>
          {isActive !== false ? 'ใช้งาน' : 'ไม่ใช้งาน'}
        </Tag>
      ),
    },
    {
      title: 'จัดการ',
      key: 'actions',
      width: 80,
      render: (_: any, record: Customer) => (
        <Button
          type="text"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
          style={{ color: '#22d3ee' }}
        />
      ),
    },
  ];

  const filteredCustomers = customers.filter(
    (c) =>
      c.code?.toLowerCase().includes(searchText.toLowerCase()) ||
      c.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="text-gradient">ลูกค้า</h1>
        <p>จัดการข้อมูลลูกค้าในระบบ</p>
      </div>

      <Card className="card-holo">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <Input
            placeholder="ค้นหาลูกค้า..."
            prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate} className="btn-holo">
            เพิ่มลูกค้า
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredCustomers}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `ทั้งหมด ${total} รายการ` }}
        />
      </Card>

      <Modal
        title={editingCustomer ? 'แก้ไขข้อมูลลูกค้า' : 'เพิ่มลูกค้าใหม่'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Space style={{ width: '100%' }} size={16}>
            <Form.Item name="code" label="รหัสลูกค้า" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Input placeholder="เช่น CUST-001" />
            </Form.Item>
            <Form.Item name="name" label="ชื่อลูกค้า" rules={[{ required: true }]} style={{ flex: 2 }}>
              <Input placeholder="ชื่อลูกค้า" />
            </Form.Item>
          </Space>

          <Form.Item name="taxId" label="เลขประจำตัวผู้เสียภาษี">
            <Input placeholder="เลขประจำตัวผู้เสียภาษี 13 หลัก" />
          </Form.Item>

          <Form.Item name="address" label="ที่อยู่">
            <Input.TextArea rows={2} placeholder="ที่อยู่" />
          </Form.Item>

          <Space style={{ width: '100%' }} size={16}>
            <Form.Item name="phone" label="โทรศัพท์" style={{ flex: 1 }}>
              <Input placeholder="เบอร์โทรศัพท์" />
            </Form.Item>
            <Form.Item name="email" label="อีเมล" style={{ flex: 1 }}>
              <Input placeholder="อีเมล" />
            </Form.Item>
          </Space>

          <Space style={{ width: '100%' }} size={16}>
            <Form.Item name="creditLimit" label="วงเงินเครดิต" style={{ flex: 1 }}>
              <InputNumber style={{ width: '100%' }} min={0} formatter={(v) => `฿ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
            </Form.Item>
            <Form.Item name="creditTermDays" label="ระยะเวลาเครดิต (วัน)" style={{ flex: 1 }}>
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
          </Space>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setModalVisible(false)}>ยกเลิก</Button>
              <Button type="primary" htmlType="submit" className="btn-holo">
                {editingCustomer ? 'บันทึก' : 'เพิ่มลูกค้า'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomersPage;
