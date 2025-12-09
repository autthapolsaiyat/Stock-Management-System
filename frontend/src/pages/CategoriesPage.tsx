import React, { useEffect, useState } from 'react';
import { Table, Button, Card, Space, message, Modal, Form, Input, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { productsApi } from '../services/api';
import { ProductCategory } from '../types';

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await productsApi.getCategories();
      setCategories(res.data || []);
    } catch (error) {
      message.error('ไม่สามารถโหลดข้อมูลหมวดหมู่ได้');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCategory(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (category: ProductCategory) => {
    setEditingCategory(category);
    form.setFieldsValue(category);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await productsApi.deleteCategory(id);
      message.success('ลบหมวดหมู่สำเร็จ');
      loadCategories();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'ไม่สามารถลบหมวดหมู่ได้');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingCategory) {
        await productsApi.updateCategory(editingCategory.id, values);
        message.success('แก้ไขหมวดหมู่สำเร็จ');
      } else {
        await productsApi.createCategory(values);
        message.success('เพิ่มหมวดหมู่สำเร็จ');
      }
      setModalVisible(false);
      loadCategories();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const columns = [
    {
      title: 'รหัส',
      dataIndex: 'code',
      key: 'code',
      width: 120,
    },
    {
      title: 'ชื่อหมวดหมู่',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'คำอธิบาย',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => text || '-',
    },
    {
      title: 'จัดการ',
      key: 'actions',
      width: 120,
      render: (_: any, record: ProductCategory) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ color: '#22d3ee' }}
          />
          <Popconfirm
            title="ยืนยันการลบ"
            description="คุณต้องการลบหมวดหมู่นี้หรือไม่?"
            onConfirm={() => handleDelete(record.id)}
            okText="ลบ"
            cancelText="ยกเลิก"
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              style={{ color: '#f97373' }}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="text-gradient">หมวดหมู่สินค้า</h1>
        <p>จัดการหมวดหมู่สินค้า</p>
      </div>

      <Card className="card-holo">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
            className="btn-holo"
          >
            เพิ่มหมวดหมู่
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={categories}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingCategory ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="code"
            label="รหัสหมวดหมู่"
            rules={[{ required: true, message: 'กรุณากรอกรหัสหมวดหมู่' }]}
          >
            <Input placeholder="เช่น CAT001" disabled={!!editingCategory} />
          </Form.Item>

          <Form.Item
            name="name"
            label="ชื่อหมวดหมู่"
            rules={[{ required: true, message: 'กรุณากรอกชื่อหมวดหมู่' }]}
          >
            <Input placeholder="เช่น อุปกรณ์อิเล็กทรอนิกส์" />
          </Form.Item>

          <Form.Item name="description" label="คำอธิบาย">
            <Input.TextArea rows={3} placeholder="รายละเอียดเพิ่มเติม" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setModalVisible(false)}>ยกเลิก</Button>
              <Button type="primary" htmlType="submit" className="btn-holo">
                {editingCategory ? 'บันทึก' : 'เพิ่ม'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoriesPage;
