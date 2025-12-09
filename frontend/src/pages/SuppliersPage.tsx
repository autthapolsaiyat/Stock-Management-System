import React, { useEffect, useState } from 'react';
import { Table, Button, Card, Space, Input, Modal, Form, InputNumber, Tag, message } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined } from '@ant-design/icons';
import { suppliersApi } from '../services/api';
import { Supplier } from '../types';

const SuppliersPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await suppliersApi.getAll();
      setSuppliers(response.data || []);
    } catch (error) {
      message.error('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => { setEditingSupplier(null); form.resetFields(); setModalVisible(true); };
  const handleEdit = (record: Supplier) => { setEditingSupplier(record); form.setFieldsValue(record); setModalVisible(true); };

  const handleSubmit = async (values: any) => {
    try {
      if (editingSupplier) {
        await suppliersApi.update(editingSupplier.id, values);
        message.success('แก้ไขข้อมูลสำเร็จ');
      } else {
        await suppliersApi.create(values);
        message.success('เพิ่มผู้จำหน่ายสำเร็จ');
      }
      setModalVisible(false);
      loadData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const columns = [
    { title: 'รหัส', dataIndex: 'code', key: 'code', width: 120 },
    { title: 'ชื่อผู้จำหน่าย', dataIndex: 'name', key: 'name' },
    { title: 'เลขประจำตัวผู้เสียภาษี', dataIndex: 'taxId', key: 'taxId' },
    { title: 'โทรศัพท์', dataIndex: 'phone', key: 'phone' },
    { title: 'อีเมล', dataIndex: 'email', key: 'email' },
    {
      title: 'สถานะ',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => <Tag color={isActive !== false ? 'success' : 'default'}>{isActive !== false ? 'ใช้งาน' : 'ไม่ใช้งาน'}</Tag>,
    },
    {
      title: 'จัดการ',
      key: 'actions',
      width: 80,
      render: (_: any, record: Supplier) => (
        <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} style={{ color: '#22d3ee' }} />
      ),
    },
  ];

  const filteredSuppliers = suppliers.filter(
    (s) => s.code?.toLowerCase().includes(searchText.toLowerCase()) || s.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="text-gradient">ผู้จำหน่าย</h1>
        <p>จัดการข้อมูลผู้จำหน่ายในระบบ</p>
      </div>

      <Card className="card-holo">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <Input placeholder="ค้นหาผู้จำหน่าย..." prefix={<SearchOutlined style={{ color: '#9ca3af' }} />} value={searchText} onChange={(e) => setSearchText(e.target.value)} style={{ width: 300 }} />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate} className="btn-holo">เพิ่มผู้จำหน่าย</Button>
        </div>
        <Table columns={columns} dataSource={filteredSuppliers} rowKey="id" loading={loading} pagination={{ pageSize: 10, showTotal: (total) => `ทั้งหมด ${total} รายการ` }} />
      </Card>

      <Modal title={editingSupplier ? 'แก้ไขข้อมูลผู้จำหน่าย' : 'เพิ่มผู้จำหน่ายใหม่'} open={modalVisible} onCancel={() => setModalVisible(false)} footer={null} width={600}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Space style={{ width: '100%' }} size={16}>
            <Form.Item name="code" label="รหัส" rules={[{ required: true }]} style={{ flex: 1 }}><Input placeholder="SUPP-001" /></Form.Item>
            <Form.Item name="name" label="ชื่อ" rules={[{ required: true }]} style={{ flex: 2 }}><Input placeholder="ชื่อผู้จำหน่าย" /></Form.Item>
          </Space>
          <Form.Item name="taxId" label="เลขประจำตัวผู้เสียภาษี"><Input /></Form.Item>
          <Form.Item name="address" label="ที่อยู่"><Input.TextArea rows={2} /></Form.Item>
          <Space style={{ width: '100%' }} size={16}>
            <Form.Item name="phone" label="โทรศัพท์" style={{ flex: 1 }}><Input /></Form.Item>
            <Form.Item name="email" label="อีเมล" style={{ flex: 1 }}><Input /></Form.Item>
          </Space>
          <Form.Item name="creditTermDays" label="ระยะเวลาเครดิต (วัน)"><InputNumber style={{ width: '100%' }} min={0} /></Form.Item>
          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setModalVisible(false)}>ยกเลิก</Button>
              <Button type="primary" htmlType="submit" className="btn-holo">{editingSupplier ? 'บันทึก' : 'เพิ่ม'}</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SuppliersPage;
