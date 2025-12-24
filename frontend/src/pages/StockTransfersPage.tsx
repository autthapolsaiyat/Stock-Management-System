import React, { useEffect, useState } from 'react';
import { Table, Button, Card, Space, Tag, message, Modal, Form, Select, InputNumber, Input, DatePicker } from 'antd';
import { PlusOutlined, EyeOutlined, CheckOutlined, PrinterOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import { stockTransfersApi, warehousesApi, productsApi } from '../services/api';
import { Warehouse, Product } from '../types';
import { StockTransferPrintPreview } from '../components/print';
import dayjs from 'dayjs';

interface StockTransfer {
  id: number;
  docNo: string;
  docFullNo?: string;
  docDate: string;
  fromWarehouseId: number;
  toWarehouseId: number;
  status: string;
  remark?: string;
  items: any[];
}

const StockTransfersPage: React.FC = () => {
  const [transfers, setTransfers] = useState<StockTransfer[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [printVisible, setPrintVisible] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<StockTransfer | null>(null);
  const [items, setItems] = useState<any[]>([{ productId: undefined, qty: 1 }]);
  const [form] = Form.useForm();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [transRes, whRes, prodRes] = await Promise.all([
        stockTransfersApi.getAll(),
        warehousesApi.getAll(),
        productsApi.getAll(),
      ]);
      setTransfers(transRes.data || []);
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
    setItems([{ productId: undefined, qty: 1 }]);
    setModalVisible(true);
  };

  const handleView = async (id: number) => {
    try {
      const res = await stockTransfersApi.getById(id);
      setSelectedTransfer(res.data);
      setDetailVisible(true);
    } catch (error) {
      message.error('ไม่สามารถโหลดข้อมูลได้');
    }
  };

  const handlePost = async (id: number) => {
    try {
      await stockTransfersApi.post(id);
      message.success('โอนสินค้าสำเร็จ');
      loadData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const handleCancel = async (id: number) => {
    Modal.confirm({
      title: <span style={{ color: '#fff' }}>ยืนยันยกเลิก</span>,
      content: <span style={{ color: '#d1d5db' }}>คุณต้องการยกเลิกใบโอนสินค้านี้หรือไม่? สต็อกจะถูกคืนกลับคลังต้นทาง</span>,
      okText: 'ยกเลิกใบโอน',
      cancelText: 'ไม่',
      okButtonProps: { danger: true },
      className: 'dark-modal-confirm',
      onOk: async () => {
        try {
          await stockTransfersApi.cancel(id);
          message.success('ยกเลิกใบโอนสินค้าสำเร็จ');
          loadData();
        } catch (error: any) {
          message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
        }
      },
    });
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: <span style={{ color: '#fff' }}>ยืนยันลบ</span>,
      content: <span style={{ color: '#d1d5db' }}>คุณต้องการลบใบโอนสินค้านี้หรือไม่?</span>,
      okText: 'ลบ',
      cancelText: 'ไม่',
      okButtonProps: { danger: true },
      className: 'dark-modal-confirm',
      onOk: async () => {
        try {
          await stockTransfersApi.delete(id);
          message.success('ลบใบโอนสินค้าสำเร็จ');
          loadData();
        } catch (error: any) {
          message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
        }
      },
    });
  };

  const handleSubmit = async (values: any) => {
    if (values.fromWarehouseId === values.toWarehouseId) {
      message.error('คลังต้นทางและปลายทางต้องไม่เหมือนกัน');
      return;
    }
    try {
      const payload = {
        ...values,
        docDate: values.docDate?.format('YYYY-MM-DD'),
        items: items.filter(i => i.productId).map((item, idx) => ({
          ...item,
          lineNo: idx + 1,
        })),
      };
      await stockTransfersApi.create(payload);
      message.success('สร้างใบโอนสินค้าสำเร็จ');
      setModalVisible(false);
      loadData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const addItem = () => setItems([...items, { productId: undefined, qty: 1 }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));
  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const statusColors: Record<string, string> = { DRAFT: 'default', POSTED: 'success', CANCELLED: 'error', draft: 'default', posted: 'success', cancelled: 'error' };
  const statusLabels: Record<string, string> = { DRAFT: 'ร่าง', POSTED: 'โอนแล้ว', CANCELLED: 'ยกเลิก', draft: 'ร่าง', posted: 'โอนแล้ว', cancelled: 'ยกเลิก' };

  const columns = [
    { title: 'เลขที่', dataIndex: 'docFullNo', key: 'docFullNo', width: 150, render: (v: string, r: any) => v || r.docNo || '-' },
    { title: 'วันที่', dataIndex: 'docDate', key: 'docDate', width: 110, render: (d: string) => d ? dayjs(d).format('DD/MM/YYYY') : '-' },
    { title: 'จากคลัง', key: 'fromWarehouse', render: (_: any, r: StockTransfer) => warehouses.find(w => w.id === r.fromWarehouseId)?.name || '-' },
    { title: 'ไปคลัง', key: 'toWarehouse', render: (_: any, r: StockTransfer) => warehouses.find(w => w.id === r.toWarehouseId)?.name || '-' },
    { title: 'สถานะ', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={statusColors[s]}>{statusLabels[s] || s}</Tag> },
    {
      title: 'จัดการ', key: 'actions', width: 160,
      render: (_: any, r: StockTransfer) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} onClick={() => handleView(r.id)} style={{ color: '#22d3ee' }} title="ดูรายละเอียด" />
          {(r.status === 'POSTED' || r.status === 'posted') && (
            <>
              <Button type="text" icon={<PrinterOutlined />} onClick={async () => { await handleView(r.id); setPrintVisible(true); }} style={{ color: '#8b5cf6' }} title="พิมพ์" />
              <Button type="text" icon={<CloseOutlined />} onClick={() => handleCancel(r.id)} style={{ color: '#f59e0b' }} title="ยกเลิก" />
            </>
          )}
          {(r.status === 'DRAFT' || r.status === 'draft') && (
            <>
              <Button type="text" icon={<CheckOutlined />} onClick={() => handlePost(r.id)} style={{ color: '#10b981' }} title="โอนสินค้า" />
              <Button type="text" icon={<DeleteOutlined />} onClick={() => handleDelete(r.id)} style={{ color: '#ef4444' }} title="ลบ" />
            </>
          )}
          {(r.status === 'CANCELLED' || r.status === 'cancelled') && (
            <Button type="text" icon={<DeleteOutlined />} onClick={() => handleDelete(r.id)} style={{ color: '#ef4444' }} title="ลบ" />
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="text-gradient">โอนสินค้า</h1>
        <p>โอนสินค้าระหว่างคลัง</p>
      </div>

      <Card className="card-holo">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate} className="btn-holo">สร้างใบโอน</Button>
        </div>
        <Table columns={columns} dataSource={transfers} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
      </Card>

      {/* Create Modal */}
      <Modal title="สร้างใบโอนสินค้า" open={modalVisible} onCancel={() => setModalVisible(false)} footer={null} width={700}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Space style={{ width: '100%' }} size={16}>
            <Form.Item name="fromWarehouseId" label="จากคลัง" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Select placeholder="เลือกคลังต้นทาง" options={warehouses.map(w => ({ value: w.id, label: w.name }))} />
            </Form.Item>
            <Form.Item name="toWarehouseId" label="ไปคลัง" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Select placeholder="เลือกคลังปลายทาง" options={warehouses.map(w => ({ value: w.id, label: w.name }))} />
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
                  placeholder="เลือกสินค้า" style={{ width: 300 }} value={item.productId}
                  onChange={(v) => updateItem(idx, 'productId', v)}
                  options={products.map(p => ({ value: p.id, label: `${p.code} - ${p.name}` }))}
                  showSearch filterOption={(input, opt) => (opt?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                />
                <InputNumber min={1} value={item.qty} onChange={(v) => updateItem(idx, 'qty', v)} placeholder="จำนวน" style={{ width: 120 }} />
                {items.length > 1 && <Button type="text" danger onClick={() => removeItem(idx)}>ลบ</Button>}
              </Space>
            ))}
            <Button type="dashed" onClick={addItem} style={{ width: '100%' }}>+ เพิ่มรายการ</Button>
          </div>

          <Form.Item name="remark" label="หมายเหตุ"><Input.TextArea rows={2} /></Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setModalVisible(false)}>ยกเลิก</Button>
              <Button type="primary" htmlType="submit" className="btn-holo">สร้างใบโอน</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Detail Modal */}
      <Modal title={`ใบโอน: ${selectedTransfer?.docNo || ''}`} open={detailVisible} onCancel={() => setDetailVisible(false)} footer={null} width={600}>
        {selectedTransfer && (
          <div>
            <p><strong>จากคลัง:</strong> {warehouses.find(w => w.id === selectedTransfer.fromWarehouseId)?.name}</p>
            <p><strong>ไปคลัง:</strong> {warehouses.find(w => w.id === selectedTransfer.toWarehouseId)?.name}</p>
            <p><strong>สถานะ:</strong> <Tag color={statusColors[selectedTransfer.status]}>{statusLabels[selectedTransfer.status]}</Tag></p>
            <Table
              columns={[
                { title: 'สินค้า', key: 'product', render: (_: any, r: any) => products.find(p => p.id === r.productId)?.name || '-' },
                { title: 'จำนวน', dataIndex: 'qty', align: 'right' as const },
              ]}
              dataSource={selectedTransfer.items || []}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </div>
        )}
      </Modal>

      {/* Print Preview */}
      <StockTransferPrintPreview
        open={printVisible}
        onClose={() => setPrintVisible(false)}
        transfer={selectedTransfer}
      />
    </div>
  );
};

export default StockTransfersPage;
