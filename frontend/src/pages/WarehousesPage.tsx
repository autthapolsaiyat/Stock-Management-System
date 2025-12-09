import React, { useEffect, useState } from 'react';
import { Table, Button, Card, Space, Input, Modal, Form, Tag, message } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined } from '@ant-design/icons';
import { warehousesApi } from '../services/api';
import { Warehouse } from '../types';

const WarehousesPage: React.FC = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await warehousesApi.getAll();
      setWarehouses(response.data || []);
    } catch (error) {
      message.error('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => { setEditingWarehouse(null); form.resetFields(); setModalVisible(true); };
  const handleEdit = (record: Warehouse) => { setEditingWarehouse(record); form.setFieldsValue(record); setModalVisible(true); };

  const handleSubmit = async (values: any) => {
    try {
      if (editingWarehouse) {
        await warehousesApi.update(editingWarehouse.id, values);
        message.success('แก้ไขข้อมูลสำเร็จ');
      } else {
        await warehousesApi.create(values);
        message.success('เพิ่มคลังสินค้าสำเร็จ');
      }
      setModalVisible(false);
      loadData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const columns = [
    { title: 'รหัส', dataIndex: 'code', key: 'code', width: 120 },
    { title: 'ชื่อคลังสินค้า', dataIndex: 'name', key: 'name' },
    { title: 'ที่อยู่', dataIndex: 'address', key: 'address' },
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
      render: (_: any, record: Warehouse) => (
        <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} style={{ color: '#22d3ee' }} />
      ),
    },
  ];

  const filteredWarehouses = warehouses.filter(
    (w) => w.code?.toLowerCase().includes(searchText.toLowerCase()) || w.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="text-gradient">คลังสินค้า</h1>
        <p>จัดการข้อมูลคลังสินค้าในระบบ</p>
      </div>

      <Card className="card-holo">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <Input placeholder="ค้นหาคลังสินค้า..." prefix={<SearchOutlined style={{ color: '#9ca3af' }} />} value={searchText} onChange={(e) => setSearchText(e.target.value)} style={{ width: 300 }} />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate} className="btn-holo">เพิ่มคลังสินค้า</Button>
        </div>
        <Table columns={columns} dataSource={filteredWarehouses} rowKey="id" loading={loading} pagination={{ pageSize: 10, showTotal: (total) => `ทั้งหมด ${total} รายการ` }} />
      </Card>

      <Modal title={editingWarehouse ? 'แก้ไขข้อมูลคลังสินค้า' : 'เพิ่มคลังสินค้าใหม่'} open={modalVisible} onCancel={() => setModalVisible(false)} footer={null} width={500}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="code" label="รหัสคลัง" rules={[{ required: true }]}><Input placeholder="WH-001" /></Form.Item>
          <Form.Item name="name" label="ชื่อคลังสินค้า" rules={[{ required: true }]}><Input placeholder="ชื่อคลังสินค้า" /></Form.Item>
          <Form.Item name="address" label="ที่อยู่"><Input.TextArea rows={2} /></Form.Item>
          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setModalVisible(false)}>ยกเลิก</Button>
              <Button type="primary" htmlType="submit" className="btn-holo">{editingWarehouse ? 'บันทึก' : 'เพิ่ม'}</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WarehousesPage;
