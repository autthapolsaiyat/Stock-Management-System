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
  Select,
  message,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import { customersApi, customerGroupsApi } from '../services/api';
import { Customer } from '../types';

interface CustomerGroup {
  id: number;
  code: string;
  name: string;
  description?: string;
}

const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerGroups, setCustomerGroups] = useState<CustomerGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [searchText, setSearchText] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState<number | undefined>(undefined);
  const [form] = Form.useForm();

  // ดึง user's groupId จาก localStorage (ถ้ามี)
  const getUserGroupId = (): number | undefined => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsed = JSON.parse(user);
      return parsed.customerGroupId || undefined;
    }
    return undefined;
  };

  useEffect(() => {
    loadCustomerGroups();
  }, []);

  useEffect(() => {
    loadData();
  }, [selectedGroupId]);

  const loadCustomerGroups = async () => {
    try {
      const response = await customerGroupsApi.getAll();
      setCustomerGroups(response.data || []);
      
      // ตั้งค่า default groupId จาก user (ถ้ามี)
      const userGroupId = getUserGroupId();
      if (userGroupId) {
        setSelectedGroupId(userGroupId);
      }
    } catch (error) {
      console.error('Error loading customer groups:', error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await customersApi.getAll(selectedGroupId);
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
    // ตั้งค่า default groupId
    if (selectedGroupId) {
      form.setFieldsValue({ groupId: selectedGroupId });
    }
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

  const getGroupTag = (groupId: number | undefined) => {
    if (!groupId) return <Tag>ไม่ระบุกลุ่ม</Tag>;
    const group = customerGroups.find(g => g.id === groupId);
    if (!group) return <Tag>-</Tag>;
    
    const colors: Record<string, string> = {
      'ACC': 'purple',
      'FOR': 'blue',
      'SVC': 'orange',
      'SCI': 'green',
      'GEN': 'default',
    };
    return <Tag color={colors[group.code] || 'default'}>{group.name}</Tag>;
  };

  const columns = [
    { title: 'รหัส', dataIndex: 'code', key: 'code', width: 120 },
    { title: 'ชื่อลูกค้า', dataIndex: 'name', key: 'name' },
    {
      title: 'กลุ่ม',
      dataIndex: 'groupId',
      key: 'groupId',
      width: 180,
      render: (groupId: number) => getGroupTag(groupId),
    },
    { title: 'เลขประจำตัวผู้เสียภาษี', dataIndex: 'taxId', key: 'taxId' },
    { title: 'โทรศัพท์', dataIndex: 'phone', key: 'phone' },
    { title: 'อีเมล', dataIndex: 'email', key: 'email' },
    {
      title: 'สถานะ',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
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
          <Space wrap>
            <Input
              placeholder="ค้นหาลูกค้า..."
              prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
            />
            <Select
              placeholder="เลือกกลุ่มลูกค้า"
              value={selectedGroupId}
              onChange={(value) => setSelectedGroupId(value)}
              allowClear
              style={{ width: 200 }}
              suffixIcon={<FilterOutlined />}
            >
              {customerGroups.map(group => (
                <Select.Option key={group.id} value={group.id}>
                  {group.name}
                </Select.Option>
              ))}
            </Select>
          </Space>
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

          <Form.Item name="groupId" label="กลุ่มลูกค้า">
            <Select placeholder="เลือกกลุ่มลูกค้า" allowClear>
              {customerGroups.map(group => (
                <Select.Option key={group.id} value={group.id}>
                  {group.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

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

          <div style={{ background: 'var(--bg-secondary)', padding: 16, borderRadius: 8, marginBottom: 16 }}>
            <div style={{ fontWeight: 600, marginBottom: 12, color: 'var(--text-primary)' }}>👤 ข้อมูลผู้ติดต่อ</div>
            <Form.Item name="contactPerson" label="ชื่อผู้ติดต่อ">
              <Input placeholder="ชื่อผู้ติดต่อ" />
            </Form.Item>
            <Space style={{ width: '100%' }} size={16}>
              <Form.Item name="contactPhone" label="เบอร์โทรผู้ติดต่อ" style={{ flex: 1 }}>
                <Input placeholder="เบอร์โทรผู้ติดต่อ" />
              </Form.Item>
              <Form.Item name="contactEmail" label="อีเมลผู้ติดต่อ" style={{ flex: 1 }}>
                <Input placeholder="อีเมลผู้ติดต่อ" />
              </Form.Item>
            </Space>
          </div>

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
