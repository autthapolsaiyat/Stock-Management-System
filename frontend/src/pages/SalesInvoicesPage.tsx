import React, { useEffect, useState } from 'react';
import { Table, Button, Card, Space, Tag, message, Modal, Form, Select, InputNumber, Input, DatePicker } from 'antd';
import { PlusOutlined, EyeOutlined, CheckOutlined, CloseOutlined, RollbackOutlined } from '@ant-design/icons';
import { salesInvoicesApi, customersApi, warehousesApi, productsApi } from '../services/api';
import { SalesInvoice, Customer, Warehouse, Product } from '../types';
import dayjs from 'dayjs';

const SalesInvoicesPage: React.FC = () => {
  const [invoices, setInvoices] = useState<SalesInvoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<SalesInvoice | null>(null);
  const [items, setItems] = useState<any[]>([{ productId: undefined, qty: 1, unitPrice: 0 }]);
  const [form] = Form.useForm();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [invRes, custRes, whRes, prodRes] = await Promise.all([
        salesInvoicesApi.getAll(),
        customersApi.getAll(),
        warehousesApi.getAll(),
        productsApi.getAll(),
      ]);
      setInvoices(invRes.data || []);
      setCustomers(custRes.data || []);
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
    setItems([{ productId: undefined, qty: 1, unitPrice: 0 }]);
    setModalVisible(true);
  };

  const handleView = async (id: number) => {
    try {
      const res = await salesInvoicesApi.getById(id);
      setSelectedInvoice(res.data);
      setDetailVisible(true);
    } catch (error) {
      message.error('ไม่สามารถโหลดข้อมูลได้');
    }
  };

  const handlePost = async (id: number) => {
    try {
      await salesInvoicesApi.post(id);
      message.success('ลงบัญชีสำเร็จ');
      loadData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const handleCancel = async (id: number) => {
    try {
      await salesInvoicesApi.cancel(id);
      message.success('ยกเลิกสำเร็จ');
      loadData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const handleCreditNote = (id: number, docNo: string) => {
    Modal.confirm({
      title: 'สร้างใบลดหนี้ (Credit Note)',
      content: (
        <div>
          <p>คุณต้องการสร้างใบลดหนี้สำหรับ <strong>{docNo}</strong> ใช่หรือไม่?</p>
          <p style={{ color: '#f97373', fontSize: 12 }}>
            ใบลดหนี้จะลดยอดลูกหนี้ตามจำนวนเต็มของใบแจ้งหนี้เดิม
          </p>
        </div>
      ),
      okText: 'ยืนยันสร้างใบลดหนี้',
      okButtonProps: { danger: true },
      cancelText: 'ยกเลิก',
      onOk: async () => {
        try {
          await salesInvoicesApi.createCreditNote(id, 'สร้างใบลดหนี้จากหน้า UI');
          message.success('สร้างใบลดหนี้สำเร็จ');
          loadData();
        } catch (error: any) {
          message.error(error.response?.data?.message || 'ไม่สามารถสร้างใบลดหนี้ได้');
        }
      },
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      const payload = {
        ...values,
        docDate: values.docDate?.format('YYYY-MM-DD'),
        items: items.filter(i => i.productId).map((item, idx) => ({
          ...item,
          lineNo: idx + 1,
          lineTotal: (item.qty || 0) * (item.unitPrice || 0),
        })),
      };
      await salesInvoicesApi.create(payload);
      message.success('สร้างใบขายสินค้าสำเร็จ');
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
      if (product) newItems[index].unitPrice = product.sellingPrice || 0;
    }
    setItems(newItems);
  };

  const statusColors: Record<string, string> = { DRAFT: 'default', draft: 'default', confirmed: 'processing', POSTED: 'success', posted: 'success', PAID: 'success', paid: 'success', cancelled: 'error', CREDIT_NOTE: 'warning' };
  const statusLabels: Record<string, string> = { DRAFT: 'ร่าง', draft: 'ร่าง', confirmed: 'ยืนยัน', POSTED: 'ลงบัญชี', posted: 'ลงบัญชี', PAID: 'ชำระแล้ว', paid: 'ชำระแล้ว', cancelled: 'ยกเลิก', CREDIT_NOTE: 'ใบลดหนี้' };

  const columns = [
    { title: 'เลขที่', dataIndex: 'docFullNo', key: 'docNo', width: 140 },
    { title: 'วันที่', dataIndex: 'docDate', key: 'docDate', width: 110, render: (d: string) => d ? dayjs(d).format('DD/MM/YYYY') : '-' },
    { title: 'เลข QT', dataIndex: 'quotationDocNo', key: 'quotationDocNo', width: 160 },
    { title: 'ลูกค้า', key: 'customer', render: (_: any, r: SalesInvoice) => customers.find(c => c.id === r.customerId)?.name || '-' },
    { title: 'คลัง', key: 'warehouse', render: (_: any, r: SalesInvoice) => warehouses.find(w => w.id === r.warehouseId)?.name || '-' },
    { title: 'ยอดรวม', dataIndex: 'grandTotal', key: 'totalAmount', align: 'right' as const, render: (v: number) => `฿${(v || 0).toLocaleString()}` },
    { title: 'สถานะ', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={statusColors[s]}>{statusLabels[s] || s}</Tag> },
    {
      title: 'จัดการ', key: 'actions', width: 150,
      render: (_: any, r: SalesInvoice) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} onClick={() => handleView(r.id)} style={{ color: '#22d3ee' }} />
          {r.status?.toUpperCase() === 'DRAFT' && (
            <>
              <Button type="text" icon={<CheckOutlined />} onClick={() => handlePost(r.id)} style={{ color: '#10b981' }} />
              <Button type="text" icon={<CloseOutlined />} onClick={() => handleCancel(r.id)} style={{ color: '#f97373' }} />
            </>
          )}
          {['POSTED', 'PAID'].includes(r.status?.toUpperCase() || '') && !r.hasCreditNote && (
            <Button type="primary" danger icon={<RollbackOutlined />} onClick={() => handleCreditNote(r.id, r.docFullNo || '')}>
              ใบลดหนี้
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="text-gradient">ใบขายสินค้า</h1>
        <p>จัดการใบขายสินค้าและตัดสต็อก</p>
      </div>

      <Card className="card-holo">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate} className="btn-holo">สร้างใบขาย</Button>
        </div>
        <Table columns={columns} dataSource={invoices} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
      </Card>

      {/* Create Modal */}
      <Modal title="สร้างใบขายสินค้า" open={modalVisible} onCancel={() => setModalVisible(false)} footer={null} width={800}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Space style={{ width: '100%' }} size={16}>
            <Form.Item name="customerId" label="ลูกค้า" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Select placeholder="เลือกลูกค้า" options={customers.map(c => ({ value: c.id, label: c.name }))} />
            </Form.Item>
            <Form.Item name="warehouseId" label="คลังสินค้า" rules={[{ required: true }]} style={{ flex: 1 }}>
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
              <Button type="primary" htmlType="submit" className="btn-holo">สร้างใบขาย</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Detail Modal */}
      <Modal title={`ใบขาย: ${selectedInvoice?.docNo || ''}`} open={detailVisible} onCancel={() => setDetailVisible(false)} footer={null} width={700}>
        {selectedInvoice && (
          <div>
            <p><strong>ลูกค้า:</strong> {customers.find(c => c.id === selectedInvoice.customerId)?.name}</p>
            <p><strong>คลัง:</strong> {warehouses.find(w => w.id === selectedInvoice.warehouseId)?.name}</p>
            <p><strong>สถานะ:</strong> <Tag color={statusColors[selectedInvoice.status]}>{statusLabels[selectedInvoice.status]}</Tag></p>
            <Table
              columns={[
                { title: 'สินค้า', key: 'product', render: (_: any, r: any) => products.find(p => p.id === r.productId)?.name || '-' },
                { title: 'จำนวน', dataIndex: 'qty', align: 'right' as const },
                { title: 'ราคา', dataIndex: 'unitPrice', align: 'right' as const, render: (v: number) => `฿${v?.toLocaleString()}` },
                { title: 'รวม', dataIndex: 'lineTotal', align: 'right' as const, render: (v: number) => `฿${v?.toLocaleString()}` },
              ]}
              dataSource={selectedInvoice.items || []}
              rowKey="id"
              pagination={false}
              size="small"
            />
            <div style={{ textAlign: 'right', marginTop: 16, fontSize: 18 }}>
              <strong>ยอดรวม: ฿{selectedInvoice.grandTotal?.toLocaleString()}</strong>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SalesInvoicesPage;
