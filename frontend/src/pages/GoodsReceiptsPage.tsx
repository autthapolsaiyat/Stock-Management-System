import React, { useEffect, useState, useMemo } from 'react';
import { Table, Button, Card, Space, Tag, message, Modal, Form, Select, InputNumber, Input, DatePicker, Divider, Typography } from 'antd';
import { PlusOutlined, EyeOutlined, CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
import { goodsReceiptsApi, suppliersApi, warehousesApi, productsApi, purchaseOrdersApi } from '../services/api';
import { GoodsReceipt, Supplier, Warehouse, Product, PurchaseOrder } from '../types';
import dayjs from 'dayjs';

const { Text } = Typography;

const GoodsReceiptsPage: React.FC = () => {
  const [receipts, setReceipts] = useState<GoodsReceipt[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<GoodsReceipt | null>(null);
  const [editingReceipt, setEditingReceipt] = useState<GoodsReceipt | null>(null);
  const [items, setItems] = useState<any[]>([{ productId: undefined, qty: 1, unitCost: 0 }]);
  const [form] = Form.useForm();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [grnRes, suppRes, whRes, prodRes, poRes] = await Promise.all([
        goodsReceiptsApi.getAll(),
        suppliersApi.getAll(),
        warehousesApi.getAll(),
        productsApi.getAll(),
        purchaseOrdersApi.getAll(),
      ]);
      setReceipts(grnRes.data || []);
      setSuppliers(suppRes.data || []);
      setWarehouses(whRes.data || []);
      setProducts(prodRes.data || []);
      // Bug #6 Fix: Filter only approved POs
      setPurchaseOrders((poRes.data || []).filter((po: PurchaseOrder) => po.status === 'APPROVED' || po.status === 'approved'));
    } catch (error) {
      message.error('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingReceipt(null);
    form.resetFields();
    setItems([{ productId: undefined, qty: 1, unitCost: 0 }]);
    setModalVisible(true);
  };

  // Bug #5 Fix: Edit GR Draft
  const handleEdit = (record: GoodsReceipt) => {
    setEditingReceipt(record);
    form.setFieldsValue({
      supplierId: record.supplierId,
      warehouseId: record.warehouseId,
      poId: (record as any).purchaseOrderId || (record as any).poId,
      docDate: record.docDate ? dayjs(record.docDate) : null,
      remark: record.remark,
    });
    setItems(record.items?.map((i: any) => ({
      productId: i.productId,
      qty: i.qty,
      unitCost: i.unitCost,
    })) || [{ productId: undefined, qty: 1, unitCost: 0 }]);
    setModalVisible(true);
  };

  // Bug #6 Fix: Import from PO
  const handleImportFromPO = async (poId: number) => {
    try {
      const res = await purchaseOrdersApi.getById(poId);
      const po = res.data;
      
      form.setFieldsValue({
        supplierId: po.supplierId,
        poId: poId,
      });
      
      if (po.items && po.items.length > 0) {
        setItems(po.items.map((item: any) => ({
          productId: item.productId,
          qty: item.qty,
          unitCost: item.unitPrice || 0,
        })));
        message.success(`นำเข้าข้อมูลจากใบสั่งซื้อ ${po.docFullNo || po.docNo} สำเร็จ`);
      }
    } catch (error) {
      message.error('ไม่สามารถดึงข้อมูลจากใบสั่งซื้อได้');
    }
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

  const handleReverse = (id: number, docNo: string) => {
    Modal.confirm({
      title: 'กลับรายการรับสินค้า',
      content: (
        <div>
          <p>คุณต้องการกลับรายการ <strong>{docNo}</strong> ใช่หรือไม่?</p>
          <p style={{ color: '#f97373', fontSize: 12 }}>
            การกลับรายการจะหัก stock ออกและไม่สามารถยกเลิกได้
          </p>
        </div>
      ),
      okText: 'ยืนยันกลับรายการ',
      okButtonProps: { danger: true },
      cancelText: 'ยกเลิก',
      onOk: async () => {
        try {
          await goodsReceiptsApi.reverse(id, 'กลับรายการจากหน้า UI');
          message.success('กลับรายการสำเร็จ');
          loadData();
        } catch (error: any) {
          message.error(error.response?.data?.message || 'ไม่สามารถกลับรายการได้');
        }
      },
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      const payload = {
        ...values,
        docDate: values.docDate?.format('YYYY-MM-DD'),
        purchaseOrderId: values.poId,
        items: items.filter(i => i.productId).map((item, idx) => ({
          ...item,
          lineNo: idx + 1,
          lineTotal: (item.qty || 0) * (item.unitCost || 0),
        })),
        totalAmount: totalAmount,
      };
      
      if (editingReceipt) {
        await goodsReceiptsApi.update(editingReceipt.id, payload);
        message.success('แก้ไขใบรับสินค้าสำเร็จ');
      } else {
        await goodsReceiptsApi.create(payload);
        message.success('สร้างใบรับสินค้าสำเร็จ');
      }
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

  const totalAmount = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.qty || 0) * (item.unitCost || 0), 0);
  }, [items]);

  const statusColors: Record<string, string> = { draft: 'default', posted: 'success', cancelled: 'error', DRAFT: 'default', POSTED: 'success', CANCELLED: 'error', REVERSED: 'warning', reversed: 'warning' };
  const statusLabels: Record<string, string> = { draft: 'ร่าง', posted: 'รับแล้ว', cancelled: 'ยกเลิก', DRAFT: 'ร่าง', POSTED: 'รับแล้ว', CANCELLED: 'ยกเลิก', REVERSED: 'กลับรายการ', reversed: 'กลับรายการ' };

  const columns = [
    { title: 'เลขที่', dataIndex: 'docFullNo', key: 'docFullNo', width: 140, render: (v: string, r: GoodsReceipt) => v || r.docNo },
    { title: 'วันที่', dataIndex: 'docDate', key: 'docDate', width: 110, render: (d: string) => d ? dayjs(d).format('DD/MM/YYYY') : '-' },
    { title: 'เลข PO', dataIndex: 'purchaseOrderDocNo', key: 'poDocNo', width: 130, render: (v: string, r: any) => v || (r.purchaseOrderId ? `PO-${r.purchaseOrderId}` : '-') },
    { title: 'ผู้จำหน่าย', key: 'supplier', render: (_: any, r: GoodsReceipt) => suppliers.find(s => s.id === r.supplierId)?.name || '-' },
    { title: 'คลัง', key: 'warehouse', render: (_: any, r: GoodsReceipt) => warehouses.find(w => w.id === r.warehouseId)?.name || '-' },
    { title: 'ยอดรวม', dataIndex: 'totalAmount', key: 'totalAmount', align: 'right' as const, render: (v: number) => `฿${(v || 0).toLocaleString()}` },
    { title: 'สถานะ', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={statusColors[s] || 'default'}>{statusLabels[s] || s}</Tag> },
    {
      title: 'จัดการ', key: 'actions', width: 250,
      render: (_: any, r: GoodsReceipt) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} onClick={() => handleView(r.id)} style={{ color: '#22d3ee' }} />
          {(r.status === 'draft' || r.status === 'DRAFT') && (
            <>
              {/* Bug #5 Fix: Edit button for draft */}
              <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(r)} style={{ color: '#fbbf24' }} />
              {/* Bug #10 Fix: Clear post button */}
              <Button type="primary" icon={<CheckOutlined />} onClick={() => handlePost(r.id)} style={{ background: '#10b981', borderColor: '#10b981' }}>บันทึกรับ</Button>
              <Button type="text" icon={<CloseOutlined />} onClick={() => handleCancel(r.id)} style={{ color: '#f97373' }} />
            </>
          )}
          {(r.status === 'posted' || r.status === 'POSTED') && (
            <Button type="primary" danger icon={<RollbackOutlined />} onClick={() => handleReverse(r.id, r.docFullNo || '')}>
              กลับรายการ
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="text-gradient">ใบรับสินค้า</h1>
        <p>จัดการการรับสินค้าเข้าคลัง</p>
      </div>

      <Card className="card-holo">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate} className="btn-holo">สร้างใบรับสินค้า</Button>
        </div>
        <Table columns={columns} dataSource={receipts} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
      </Card>

      {/* Create/Edit Modal */}
      <Modal 
        title={editingReceipt ? `แก้ไขใบรับสินค้า: ${editingReceipt.docFullNo || editingReceipt.docNo}` : 'สร้างใบรับสินค้า'} 
        open={modalVisible} 
        onCancel={() => setModalVisible(false)} 
        footer={null} 
        width={900}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {/* Bug #6 Fix: Import from PO dropdown */}
          <Form.Item name="poId" label="นำเข้าจากใบสั่งซื้อ (PO)">
            <Select 
              placeholder="เลือกใบสั่งซื้อ" 
              allowClear
              onChange={(val) => val && handleImportFromPO(val)}
              options={purchaseOrders.map(po => ({ 
                value: po.id, 
                label: `${po.docFullNo || po.docNo} - ${suppliers.find(s => s.id === po.supplierId)?.name || ''}` 
              }))} 
            />
          </Form.Item>

          <Space style={{ width: '100%' }} size={16}>
            <Form.Item name="supplierId" label="ผู้จำหน่าย" rules={[{ required: true, message: 'กรุณาเลือกผู้จำหน่าย' }]} style={{ flex: 1 }}>
              <Select placeholder="เลือกผู้จำหน่าย" options={suppliers.map(s => ({ value: s.id, label: s.name }))} />
            </Form.Item>
            <Form.Item name="warehouseId" label="คลังรับสินค้า" rules={[{ required: true, message: 'กรุณาเลือกคลัง' }]} style={{ flex: 1 }}>
              <Select placeholder="เลือกคลัง" options={warehouses.map(w => ({ value: w.id, label: w.name }))} />
            </Form.Item>
            <Form.Item name="docDate" label="วันที่รับ" style={{ flex: 1 }}>
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

          <Divider />
          <div style={{ textAlign: 'right', marginBottom: 16 }}>
            <Text style={{ fontSize: 18 }}>ยอดรวม: </Text>
            <Text strong style={{ fontSize: 24, color: '#10b981' }}>฿{totalAmount.toLocaleString()}</Text>
          </div>

          <Form.Item name="remark" label="หมายเหตุ"><Input.TextArea rows={2} /></Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setModalVisible(false)}>ยกเลิก</Button>
              <Button type="primary" htmlType="submit" className="btn-holo">
                {editingReceipt ? 'บันทึก' : 'สร้างใบรับสินค้า'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Detail Modal */}
      <Modal title={`ใบรับสินค้า: ${selectedReceipt?.docFullNo || selectedReceipt?.docNo || ''}`} open={detailVisible} onCancel={() => setDetailVisible(false)} footer={null} width={700}>
        {selectedReceipt && (
          <div>
            <p><strong>ผู้จำหน่าย:</strong> {suppliers.find(s => s.id === selectedReceipt.supplierId)?.name}</p>
            <p><strong>คลัง:</strong> {warehouses.find(w => w.id === selectedReceipt.warehouseId)?.name}</p>
            <p><strong>วันที่:</strong> {selectedReceipt.docDate ? dayjs(selectedReceipt.docDate).format('DD/MM/YYYY') : '-'}</p>
            <p><strong>สถานะ:</strong> <Tag color={statusColors[selectedReceipt.status]}>{statusLabels[selectedReceipt.status]}</Tag></p>
            <Table
              columns={[
                { title: 'สินค้า', key: 'product', render: (_: any, r: any) => products.find(p => p.id === r.productId)?.name || '-' },
                { title: 'จำนวน', dataIndex: 'qty', key: 'qty', align: 'right' as const },
                { title: 'ต้นทุน', dataIndex: 'unitCost', key: 'unitCost', align: 'right' as const, render: (v: number) => `฿${(v || 0).toLocaleString()}` },
                { title: 'รวม', dataIndex: 'lineTotal', key: 'lineTotal', align: 'right' as const, render: (v: number) => `฿${(v || 0).toLocaleString()}` },
              ]}
              dataSource={selectedReceipt.items || []}
              rowKey="id"
              pagination={false}
              size="small"
              summary={() => (
                <Table.Summary>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={3} align="right"><strong>ยอดรวม</strong></Table.Summary.Cell>
                    <Table.Summary.Cell index={1} align="right"><strong style={{ color: '#10b981' }}>฿{(selectedReceipt.totalAmount || 0).toLocaleString()}</strong></Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default GoodsReceiptsPage;
