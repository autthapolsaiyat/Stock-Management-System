import React, { useEffect, useState } from 'react';
import { Table, Button, Card, Space, Tag, message, Modal, Form, Select, InputNumber, Input, DatePicker } from 'antd';
import { PlusOutlined, EyeOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { purchaseOrdersApi, suppliersApi, productsApi } from '../services/api';
import { PurchaseOrder, Supplier, Product } from '../types';
import dayjs from 'dayjs';

const PurchaseOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [items, setItems] = useState<any[]>([{ productId: undefined, qty: 1, unitPrice: 0 }]);
  const [form] = Form.useForm();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [poRes, suppRes, prodRes] = await Promise.all([
        purchaseOrdersApi.getAll(),
        suppliersApi.getAll(),
        productsApi.getAll(),
      ]);
      setOrders(poRes.data || []);
      setSuppliers(suppRes.data || []);
      setProducts(prodRes.data || []);
    } catch (error) {
      message.error('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    form.resetFields();
    setItems([{ productId: undefined, qty: 1, unitPrice: 0 }]);
    setModalVisible(true);
  };

  const handleView = async (id: number) => {
    try {
      const res = await purchaseOrdersApi.getById(id);
      setSelectedOrder(res.data);
      setDetailVisible(true);
    } catch (error) {
      message.error('ไม่สามารถโหลดข้อมูลได้');
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await purchaseOrdersApi.approve(id);
      message.success('อนุมัติสำเร็จ');
      loadData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const handleCancel = async (id: number) => {
    try {
      await purchaseOrdersApi.cancel(id);
      message.success('ยกเลิกสำเร็จ');
      loadData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const payload = {
        ...values,
        docDate: values.docDate?.format('YYYY-MM-DD'),
        expectedDate: values.expectedDate?.format('YYYY-MM-DD'),
        items: items.filter(i => i.productId).map((item, idx) => ({
          ...item,
          lineNo: idx + 1,
          lineTotal: (item.qty || 0) * (item.unitPrice || 0),
        })),
      };
      await purchaseOrdersApi.create(payload);
      message.success('สร้างใบสั่งซื้อสำเร็จ');
      setModalVisible(false);
      loadData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const addItem = () => setItems([...items, { productId: undefined, qty: 1, unitPrice: 0 }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));
  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index][field] = value;
    if (field === 'productId') {
      const product = products.find(p => p.id === value);
      if (product) newItems[index].unitPrice = product.standardCost || 0;
    }
    setItems(newItems);
  };

  const statusColors: Record<string, string> = { draft: 'default', approved: 'success', cancelled: 'error' };
  const statusLabels: Record<string, string> = { draft: 'ร่าง', approved: 'อนุมัติ', cancelled: 'ยกเลิก' };

  const columns = [
    { title: 'เลขที่', dataIndex: 'docNo', key: 'docNo', width: 140 },
    { title: 'วันที่', dataIndex: 'docDate', key: 'docDate', width: 110, render: (d: string) => d ? dayjs(d).format('DD/MM/YYYY') : '-' },
    { title: 'ผู้จำหน่าย', key: 'supplier', render: (_: any, r: PurchaseOrder) => suppliers.find(s => s.id === r.supplierId)?.name || '-' },
    { title: 'ยอดรวม', dataIndex: 'totalAmount', key: 'totalAmount', align: 'right' as const, render: (v: number) => `฿${(v || 0).toLocaleString()}` },
    { title: 'สถานะ', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={statusColors[s]}>{statusLabels[s] || s}</Tag> },
    {
      title: 'จัดการ', key: 'actions', width: 150,
      render: (_: any, r: PurchaseOrder) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} onClick={() => handleView(r.id)} style={{ color: '#22d3ee' }} />
          {r.status === 'draft' && (
            <>
              <Button type="text" icon={<CheckOutlined />} onClick={() => handleApprove(r.id)} style={{ color: '#10b981' }} />
              <Button type="text" icon={<CloseOutlined />} onClick={() => handleCancel(r.id)} style={{ color: '#f97373' }} />
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="text-gradient">ใบสั่งซื้อ</h1>
        <p>จัดการใบสั่งซื้อสินค้าจากผู้จำหน่าย</p>
      </div>

      <Card className="card-holo">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate} className="btn-holo">สร้างใบสั่งซื้อ</Button>
        </div>
        <Table columns={columns} dataSource={orders} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
      </Card>

      {/* Create Modal */}
      <Modal title="สร้างใบสั่งซื้อ" open={modalVisible} onCancel={() => setModalVisible(false)} footer={null} width={800}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Space style={{ width: '100%' }} size={16}>
            <Form.Item name="supplierId" label="ผู้จำหน่าย" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Select placeholder="เลือกผู้จำหน่าย" options={suppliers.map(s => ({ value: s.id, label: s.name }))} />
            </Form.Item>
            <Form.Item name="docDate" label="วันที่" style={{ flex: 1 }}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="expectedDate" label="กำหนดส่ง" style={{ flex: 1 }}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Space>

          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#e5e7eb', display: 'block', marginBottom: 8 }}>รายการสินค้า</label>
            {items.map((item, idx) => (
              <Space key={idx} style={{ width: '100%', marginBottom: 8 }} align="center">
                <Select
                  placeholder="เลือกสินค้า" style={{ width: 250 }} value={item.productId}
                  onChange={(v) => updateItem(idx, 'productId', v)}
                  options={products.map(p => ({ value: p.id, label: `${p.code} - ${p.name}` }))}
                  showSearch filterOption={(input, opt) => (opt?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                />
                <InputNumber min={1} value={item.qty} onChange={(v) => updateItem(idx, 'qty', v)} placeholder="จำนวน" style={{ width: 100 }} />
                <InputNumber min={0} value={item.unitPrice} onChange={(v) => updateItem(idx, 'unitPrice', v)} placeholder="ราคา" style={{ width: 120 }} />
                <span style={{ color: '#9ca3af', width: 100 }}>= ฿{((item.qty || 0) * (item.unitPrice || 0)).toLocaleString()}</span>
                {items.length > 1 && <Button type="text" danger onClick={() => removeItem(idx)}>ลบ</Button>}
              </Space>
            ))}
            <Button type="dashed" onClick={addItem} style={{ width: '100%' }}>+ เพิ่มรายการ</Button>
          </div>

          <Form.Item name="remark" label="หมายเหตุ"><Input.TextArea rows={2} /></Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setModalVisible(false)}>ยกเลิก</Button>
              <Button type="primary" htmlType="submit" className="btn-holo">สร้างใบสั่งซื้อ</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Detail Modal */}
      <Modal title={`ใบสั่งซื้อ: ${selectedOrder?.docNo || ''}`} open={detailVisible} onCancel={() => setDetailVisible(false)} footer={null} width={700}>
        {selectedOrder && (
          <div>
            <p><strong>ผู้จำหน่าย:</strong> {suppliers.find(s => s.id === selectedOrder.supplierId)?.name}</p>
            <p><strong>สถานะ:</strong> <Tag color={statusColors[selectedOrder.status]}>{statusLabels[selectedOrder.status]}</Tag></p>
            <Table
              columns={[
                { title: 'สินค้า', key: 'product', render: (_: any, r: any) => products.find(p => p.id === r.productId)?.name || '-' },
                { title: 'จำนวน', dataIndex: 'qty', align: 'right' as const },
                { title: 'ราคา', dataIndex: 'unitPrice', align: 'right' as const, render: (v: number) => `฿${v?.toLocaleString()}` },
                { title: 'รวม', dataIndex: 'lineTotal', align: 'right' as const, render: (v: number) => `฿${v?.toLocaleString()}` },
              ]}
              dataSource={selectedOrder.items || []}
              rowKey="id"
              pagination={false}
              size="small"
            />
            <div style={{ textAlign: 'right', marginTop: 16, fontSize: 18 }}>
              <strong>ยอดรวม: ฿{selectedOrder.totalAmount?.toLocaleString()}</strong>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PurchaseOrdersPage;
