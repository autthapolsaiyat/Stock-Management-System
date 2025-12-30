import React, { useEffect, useState, useMemo } from 'react';
import { Table, Button, Card, Space, Tag, message, Modal, Form, Select, InputNumber, Input, DatePicker, Divider, Typography } from 'antd';
import { PlusOutlined, EyeOutlined, CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
import { purchaseOrdersApi, suppliersApi, productsApi } from '../services/api';
import { PurchaseOrder, Supplier, Product } from '../types';
import dayjs from 'dayjs';

const { Text } = Typography;

const PurchaseOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [editingOrder, setEditingOrder] = useState<PurchaseOrder | null>(null);
  const [items, setItems] = useState<any[]>([{ productId: undefined, qty: 1, unitPrice: 0 }]);
  const [form] = Form.useForm();
  
  // Quick Add Product
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [productForm] = Form.useForm();
  const [savingProduct, setSavingProduct] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [poRes, suppRes, prodRes, catRes, unitRes] = await Promise.all([
        purchaseOrdersApi.getAll(),
        suppliersApi.getAll(),
        productsApi.getAll(),
        productsApi.getCategories().catch(() => ({ data: [] })),
        productsApi.getUnits().catch(() => ({ data: [] })),
      ]);
      setOrders(poRes.data || []);
      setSuppliers(suppRes.data || []);
      setProducts(prodRes.data || []);
      setCategories(catRes.data || []);
      setUnits(unitRes.data || []);
    } catch (error) {
      message.error('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingOrder(null);
    form.resetFields();
    setItems([{ productId: undefined, qty: 1, unitPrice: 0 }]);
    setModalVisible(true);
  };

  // Bug #4 Fix: Edit PO Draft
  const handleEdit = (record: PurchaseOrder) => {
    setEditingOrder(record);
    form.setFieldsValue({
      supplierId: record.supplierId,
      docDate: record.docDate ? dayjs(record.docDate) : null,
      remark: record.remark,
    });
    setItems(record.items?.map((i: any) => ({
      productId: i.productId,
      qty: i.qty,
      unitPrice: i.unitPrice,
    })) || [{ productId: undefined, qty: 1, unitPrice: 0 }]);
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
        items: items.filter(i => i.productId).map((item, idx) => ({
          ...item,
          lineNo: idx + 1,
          lineTotal: (item.qty || 0) * (item.unitPrice || 0),
        })),
        totalAmount: totalAmount,
      };
      
      if (editingOrder) {
        await purchaseOrdersApi.update(editingOrder.id, payload);
        message.success('แก้ไขใบสั่งซื้อสำเร็จ');
      } else {
        await purchaseOrdersApi.create(payload);
        message.success('สร้างใบสั่งซื้อสำเร็จ');
      }
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

  // Quick Add Product
  const handleOpenProductModal = () => {
    productForm.resetFields();
    setProductModalVisible(true);
  };

  const handleCreateProduct = async (values: any) => {
    setSavingProduct(true);
    try {
      const res = await productsApi.create({
        ...values,
        isActive: true,
      });
      message.success('เพิ่มสินค้าใหม่สำเร็จ');
      
      // Reload products and auto-select new product
      const prodRes = await productsApi.getAll();
      setProducts(prodRes.data || []);
      
      // Auto add to last empty item or create new item
      const newProductId = res.data?.id;
      if (newProductId) {
        const emptyItemIndex = items.findIndex(i => !i.productId);
        if (emptyItemIndex >= 0) {
          updateItem(emptyItemIndex, 'productId', newProductId);
          const product = prodRes.data?.find((p: any) => p.id === newProductId);
          if (product) {
            const newItems = [...items];
            newItems[emptyItemIndex].unitPrice = product.standardCost || values.standardCost || 0;
            setItems(newItems);
          }
        }
      }
      
      setProductModalVisible(false);
    } catch (error: any) {
      message.error(error.response?.data?.message || 'ไม่สามารถเพิ่มสินค้าได้');
    } finally {
      setSavingProduct(false);
    }
  };

  // Bug #2 Fix: Calculate total in real-time
  const totalAmount = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.qty || 0) * (item.unitPrice || 0), 0);
  }, [items]);

  const statusColors: Record<string, string> = { draft: 'default', approved: 'success', cancelled: 'error', DRAFT: 'default', APPROVED: 'success', CANCELLED: 'error' };
  const statusLabels: Record<string, string> = { draft: 'ร่าง', approved: 'อนุมัติ', cancelled: 'ยกเลิก', DRAFT: 'ร่าง', APPROVED: 'อนุมัติ', CANCELLED: 'ยกเลิก' };

  const columns = [
    { title: 'เลขที่', dataIndex: 'docFullNo', key: 'docFullNo', width: 140, render: (v: string, r: PurchaseOrder) => v || r.docNo },
    { title: 'วันที่', dataIndex: 'docDate', key: 'docDate', width: 110, render: (d: string) => d ? dayjs(d).format('DD/MM/YYYY') : '-' },
    { title: 'เลข QT', dataIndex: 'quotationDocNo', key: 'qtDocNo', width: 150, render: (v: string) => v || '-' },
    { title: 'ผู้จำหน่าย', key: 'supplier', render: (_: any, r: PurchaseOrder) => suppliers.find(s => s.id === r.supplierId)?.name || '-' },
    { title: 'ยอดรวม', dataIndex: 'grandTotal', key: 'grandTotal', align: 'right' as const, render: (v: number, r: any) => `฿${(v || r.totalAmount || 0).toLocaleString()}` },
    { title: 'สถานะ', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={statusColors[s] || 'default'}>{statusLabels[s] || s}</Tag> },
    {
      title: 'จัดการ', key: 'actions', width: 220,
      render: (_: any, r: PurchaseOrder) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} onClick={() => handleView(r.id)} style={{ color: '#22d3ee' }} />
          {(r.status === 'draft' || r.status === 'DRAFT') && (
            <>
              {/* Bug #4 Fix: Edit button for draft */}
              <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(r)} style={{ color: '#fbbf24' }} />
              {/* Bug #10 Fix: Clear approve button */}
              <Button type="primary" icon={<CheckOutlined />} onClick={() => handleApprove(r.id)} style={{ background: '#10b981', borderColor: '#10b981' }}>อนุมัติ</Button>
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

      {/* Create/Edit Modal */}
      <Modal 
        title={editingOrder ? `แก้ไขใบสั่งซื้อ: ${editingOrder.docFullNo || editingOrder.docNo}` : 'สร้างใบสั่งซื้อ'} 
        open={modalVisible} 
        onCancel={() => setModalVisible(false)} 
        footer={null} 
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Space style={{ width: '100%' }} size={16}>
            <Form.Item name="supplierId" label="ผู้จำหน่าย" rules={[{ required: true, message: 'กรุณาเลือกผู้จำหน่าย' }]} style={{ flex: 1 }}>
              <Select placeholder="เลือกผู้จำหน่าย" options={suppliers.map(s => ({ value: s.id, label: s.name }))} />
            </Form.Item>
            <Form.Item name="docDate" label="วันที่" style={{ flex: 1 }}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Space>

          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label style={{ color: '#e5e7eb' }}>รายการสินค้า</label>
              <Button type="link" icon={<PlusOutlined />} onClick={handleOpenProductModal} style={{ padding: 0 }}>
                เพิ่มสินค้าใหม่
              </Button>
            </div>
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

          {/* Bug #2 Fix: Show total amount */}
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
                {editingOrder ? 'บันทึก' : 'สร้างใบสั่งซื้อ'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Detail Modal */}
      <Modal title={`ใบสั่งซื้อ: ${selectedOrder?.docFullNo || selectedOrder?.docNo || ''}`} open={detailVisible} onCancel={() => setDetailVisible(false)} footer={null} width={700}>
        {selectedOrder && (
          <div>
            <p><strong>ผู้จำหน่าย:</strong> {suppliers.find(s => s.id === selectedOrder.supplierId)?.name}</p>
            <p><strong>วันที่:</strong> {selectedOrder.docDate ? dayjs(selectedOrder.docDate).format('DD/MM/YYYY') : '-'}</p>
            <p><strong>สถานะ:</strong> <Tag color={statusColors[selectedOrder.status]}>{statusLabels[selectedOrder.status]}</Tag></p>
            <Table
              columns={[
                { title: 'สินค้า', key: 'product', render: (_: any, r: any) => products.find(p => p.id === r.productId)?.name || '-' },
                { title: 'จำนวน', dataIndex: 'qty', key: 'qty', align: 'right' as const },
                { title: 'ราคา', dataIndex: 'unitPrice', key: 'unitPrice', align: 'right' as const, render: (v: number) => `฿${(v || 0).toLocaleString()}` },
                { title: 'รวม', dataIndex: 'lineTotal', key: 'lineTotal', align: 'right' as const, render: (v: number) => `฿${(v || 0).toLocaleString()}` },
              ]}
              dataSource={selectedOrder.items || []}
              rowKey="id"
              pagination={false}
              size="small"
              summary={() => (
                <Table.Summary>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={3} align="right"><strong>ยอดรวม</strong></Table.Summary.Cell>
                    <Table.Summary.Cell index={1} align="right"><strong style={{ color: '#10b981' }}>฿{(selectedOrder.grandTotal || selectedOrder.totalAmount || 0).toLocaleString()}</strong></Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )}
            />
          </div>
        )}
      </Modal>

      {/* Quick Add Product Modal */}
      <Modal
        title="➕ เพิ่มสินค้าใหม่"
        open={productModalVisible}
        onCancel={() => setProductModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form form={productForm} layout="vertical" onFinish={handleCreateProduct}>
          <Form.Item
            name="code"
            label="รหัสสินค้า"
            rules={[{ required: true, message: 'กรุณากรอกรหัสสินค้า' }]}
          >
            <Input placeholder="เช่น PRD-001" />
          </Form.Item>

          <Form.Item
            name="name"
            label="ชื่อสินค้า"
            rules={[{ required: true, message: 'กรุณากรอกชื่อสินค้า' }]}
          >
            <Input placeholder="ชื่อสินค้า" />
          </Form.Item>

          <Space style={{ width: '100%' }} size={16}>
            <Form.Item name="categoryId" label="หมวดหมู่" style={{ flex: 1 }}>
              <Select
                placeholder="เลือกหมวดหมู่"
                allowClear
                options={categories.map((c: any) => ({ value: c.id, label: c.name }))}
              />
            </Form.Item>

            <Form.Item name="unitId" label="หน่วยนับ" style={{ flex: 1 }}>
              <Select
                placeholder="เลือกหน่วย"
                allowClear
                options={units.map((u: any) => ({ value: u.id, label: u.name }))}
              />
            </Form.Item>
          </Space>

          <Space style={{ width: '100%' }} size={16}>
            <Form.Item name="standardCost" label="ราคาทุน" style={{ flex: 1 }}>
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                placeholder="0.00"
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              />
            </Form.Item>

            <Form.Item name="sellingPrice" label="ราคาขาย" style={{ flex: 1 }}>
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                placeholder="0.00"
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              />
            </Form.Item>
          </Space>

          <Form.Item name="description" label="รายละเอียด">
            <Input.TextArea rows={2} placeholder="รายละเอียดสินค้า (ถ้ามี)" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 16 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setProductModalVisible(false)}>ยกเลิก</Button>
              <Button type="primary" htmlType="submit" loading={savingProduct} style={{ background: '#10b981', borderColor: '#10b981' }}>
                เพิ่มสินค้า
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PurchaseOrdersPage;
