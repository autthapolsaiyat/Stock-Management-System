import React, { useEffect, useState } from 'react';
import { Table, Button, Card, Space, Tag, message, Modal, Form, Select, InputNumber, Input, DatePicker } from 'antd';
import { PlusOutlined, EyeOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { goodsReceiptsApi, suppliersApi, warehousesApi, productsApi } from '../services/api';
import { GoodsReceipt, Supplier, Warehouse, Product } from '../types';
import dayjs from 'dayjs';

const GoodsReceiptsPage: React.FC = () => {
  const [receipts, setReceipts] = useState<GoodsReceipt[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<GoodsReceipt | null>(null);
  const [items, setItems] = useState<any[]>([{ productId: undefined, qty: 1, unitCost: 0 }]);
  const [form] = Form.useForm();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [grnRes, suppRes, whRes, prodRes] = await Promise.all([
        goodsReceiptsApi.getAll(),
        suppliersApi.getAll(),
        warehousesApi.getAll(),
        productsApi.getAll(),
      ]);
      setReceipts(grnRes.data || []);
      setSuppliers(suppRes.data || []);
      setWarehouses(whRes.data || []);
      setProducts(prodRes.data || []);
    } catch (error) {
      message.error('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    form.resetFields();
    setItems([{ productId: undefined, qty: 1, unitCost: 0 }]);
    setModalVisible(true);
  };

  const handleView = async (id: number) => {
    try {
      const res = await goodsReceiptsApi.getById(id);
      setSelectedReceipt(res.data);
      setDetailVisible(true);
    } catch (error) {
      message.error('ไม่สามารถโหลดข้อมูลได้');
    }
  };

  const handlePost = async (id: number) => {
    try {
      await goodsReceiptsApi.post(id);
      message.success('รับเข้าสต็อกสำเร็จ');
      loadData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const handleCancel = async (id: number) => {
    try {
      await goodsReceiptsApi.cancel(id);
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
        items: items.filter(i => i.productId).map((item, idx) => ({
          ...item,
          lineNo: idx + 1,
          lineTotal: (item.qty || 0) * (item.unitCost || 0),
        })),
      };
      await goodsReceiptsApi.create(payload);
      message.success('สร้างใบรับสินค้าสำเร็จ');
      setModalVisible(false);
      loadData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const addItem = () => setItems([...items, { productId: undefined, qty: 1, unitCost: 0 }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));
  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index][field] = value;
    if (field === 'productId') {
      const product = products.find(p => p.id === value);
      if (product) newItems[index].unitCost = product.standardCost || 0;
    }
    setItems(newItems);
  };

  const statusColors: Record<string, string> = { draft: 'default', posted: 'success', cancelled: 'error' };
  const statusLabels: Record<string, string> = { draft: 'ร่าง', posted: 'รับแล้ว', cancelled: 'ยกเลิก' };

  const columns = [
    { title: 'เลขที่', dataIndex: 'docNo', key: 'docNo', width: 140 },
    { title: 'วันที่', dataIndex: 'docDate', key: 'docDate', width: 110, render: (d: string) => d ? dayjs(d).format('DD/MM/YYYY') : '-' },
    { title: 'ผู้จำหน่าย', key: 'supplier', render: (_: any, r: GoodsReceipt) => suppliers.find(s => s.id === r.supplierId)?.name || '-' },
    { title: 'คลัง', key: 'warehouse', render: (_: any, r: GoodsReceipt) => warehouses.find(w => w.id === r.warehouseId)?.name || '-' },
    { title: 'ยอดรวม', dataIndex: 'totalAmount', key: 'totalAmount', align: 'right' as const, render: (v: number) => `฿${(v || 0).toLocaleString()}` },
    { title: 'สถานะ', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={statusColors[s]}>{statusLabels[s] || s}</Tag> },
    {
      title: 'จัดการ', key: 'actions', width: 150,
      render: (_: any, r: GoodsReceipt) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} onClick={() => handleView(r.id)} style={{ color: '#22d3ee' }} />
          {r.status === 'draft' && (
            <>
              <Button type="text" icon={<CheckOutlined />} onClick={() => handlePost(r.id)} style={{ color: '#10b981' }} title="รับเข้าสต็อก" />
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
        <h1 className="text-gradient">ใบรับสินค้า</h1>
        <p>จัดการใบรับสินค้าเข้าคลัง (GRN)</p>
      </div>

      <Card className="card-holo">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate} className="btn-holo">สร้างใบรับสินค้า</Button>
        </div>
        <Table columns={columns} dataSource={receipts} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
      </Card>

      {/* Create Modal */}
      <Modal title="สร้างใบรับสินค้า" open={modalVisible} onCancel={() => setModalVisible(false)} footer={null} width={800}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Space style={{ width: '100%' }} size={16}>
            <Form.Item name="supplierId" label="ผู้จำหน่าย" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Select placeholder="เลือกผู้จำหน่าย" options={suppliers.map(s => ({ value: s.id, label: s.name }))} />
            </Form.Item>
            <Form.Item name="warehouseId" label="รับเข้าคลัง" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Select placeholder="เลือกคลัง" options={warehouses.map(w => ({ value: w.id, label: w.name }))} />
            </Form.Item>
            <Form.Item name="docDate" label="วันที่" style={{ flex: 1 }}>
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
                <InputNumber min={0} value={item.unitCost} onChange={(v) => updateItem(idx, 'unitCost', v)} placeholder="ต้นทุน" style={{ width: 120 }} />
                <span style={{ color: '#9ca3af', width: 100 }}>= ฿{((item.qty || 0) * (item.unitCost || 0)).toLocaleString()}</span>
                {items.length > 1 && <Button type="text" danger onClick={() => removeItem(idx)}>ลบ</Button>}
              </Space>
            ))}
            <Button type="dashed" onClick={addItem} style={{ width: '100%' }}>+ เพิ่มรายการ</Button>
          </div>

          <Form.Item name="remark" label="หมายเหตุ"><Input.TextArea rows={2} /></Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setModalVisible(false)}>ยกเลิก</Button>
              <Button type="primary" htmlType="submit" className="btn-holo">สร้างใบรับสินค้า</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Detail Modal */}
      <Modal title={`ใบรับสินค้า: ${selectedReceipt?.docNo || ''}`} open={detailVisible} onCancel={() => setDetailVisible(false)} footer={null} width={700}>
        {selectedReceipt && (
          <div>
            <p><strong>ผู้จำหน่าย:</strong> {suppliers.find(s => s.id === selectedReceipt.supplierId)?.name}</p>
            <p><strong>คลังสินค้า:</strong> {warehouses.find(w => w.id === selectedReceipt.warehouseId)?.name}</p>
            <p><strong>สถานะ:</strong> <Tag color={statusColors[selectedReceipt.status]}>{statusLabels[selectedReceipt.status]}</Tag></p>
            <Table
              columns={[
                { title: 'สินค้า', key: 'product', render: (_: any, r: any) => products.find(p => p.id === r.productId)?.name || '-' },
                { title: 'จำนวน', dataIndex: 'qty', align: 'right' as const },
                { title: 'ต้นทุน', dataIndex: 'unitCost', align: 'right' as const, render: (v: number) => `฿${v?.toLocaleString()}` },
                { title: 'รวม', dataIndex: 'lineTotal', align: 'right' as const, render: (v: number) => `฿${v?.toLocaleString()}` },
              ]}
              dataSource={selectedReceipt.items || []}
              rowKey="id"
              pagination={false}
              size="small"
            />
            <div style={{ textAlign: 'right', marginTop: 16, fontSize: 18 }}>
              <strong>ยอดรวม: ฿{selectedReceipt.totalAmount?.toLocaleString()}</strong>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default GoodsReceiptsPage;
