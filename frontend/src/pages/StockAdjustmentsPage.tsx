import React, { useEffect, useState } from 'react';
import { Table, Button, Card, Space, Tag, message, Modal, Form, Select, InputNumber, Input, DatePicker } from 'antd';
import { PlusOutlined, EyeOutlined, CheckOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import { stockAdjustmentsApi, warehousesApi } from '../services/api';
import dayjs from 'dayjs';

interface StockAdjustment {
  id: number;
  doc_full_no: string;
  warehouse_id: number;
  warehouse_name: string;
  doc_date: string;
  adjustment_type: string;
  reason: string;
  status: string;
  total_qty_adjust: number;
  total_value_adjust: number;
  total_items: number;
  items?: any[];
}

interface Warehouse {
  id: number;
  name: string;
}

interface ProductStock {
  id: number;
  code: string;
  name: string;
  unit: string;
  qty_on_hand: number;
  avg_cost: number;
}

const StockAdjustmentsPage: React.FC = () => {
  const [adjustments, setAdjustments] = useState<StockAdjustment[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [products, setProducts] = useState<ProductStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedAdjustment, setSelectedAdjustment] = useState<StockAdjustment | null>(null);
  const [items, setItems] = useState<any[]>([{ productId: undefined, qtyAdjust: 0, qtyCounted: 0 }]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<number | null>(null);
  const [adjustmentType, setAdjustmentType] = useState<string>('ADJ_COUNT');
  const [form] = Form.useForm();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [adjRes, whRes] = await Promise.all([
        stockAdjustmentsApi.getAll(),
        warehousesApi.getAll(),
      ]);
      setAdjustments(adjRes.data || []);
      setWarehouses(whRes.data || []);
    } catch (error) {
      message.error('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async (warehouseId: number) => {
    try {
      const res = await stockAdjustmentsApi.getProducts(warehouseId);
      setProducts(res.data || []);
    } catch (error) {
      message.error('ไม่สามารถโหลดข้อมูลสินค้าได้');
    }
  };

  const handleCreate = () => {
    form.resetFields();
    setItems([{ productId: undefined, qtyAdjust: 0, qtyCounted: 0 }]);
    setProducts([]);
    setSelectedWarehouse(null);
    setAdjustmentType('ADJ_COUNT');
    setModalVisible(true);
  };

  const handleWarehouseChange = (warehouseId: number) => {
    setSelectedWarehouse(warehouseId);
    loadProducts(warehouseId);
    form.setFieldValue('warehouseId', warehouseId);
  };

  const handleView = async (id: number) => {
    try {
      const res = await stockAdjustmentsApi.getById(id);
      setSelectedAdjustment(res.data);
      setDetailVisible(true);
    } catch (error) {
      message.error('ไม่สามารถโหลดข้อมูลได้');
    }
  };

  const handlePost = async (id: number) => {
    Modal.confirm({
      title: 'ยืนยันการปรับสต็อก',
      content: 'ต้องการยืนยันการปรับสต็อกหรือไม่? การดำเนินการนี้จะส่งผลต่อยอดสต็อกในระบบ',
      okText: 'ยืนยัน',
      cancelText: 'ยกเลิก',
      onOk: async () => {
        try {
          await stockAdjustmentsApi.post(id);
          message.success('ปรับสต็อกสำเร็จ');
          loadData();
          setDetailVisible(false);
        } catch (error: any) {
          message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
        }
      }
    });
  };

  const handleCancel = async (id: number) => {
    Modal.confirm({
      title: 'ยกเลิกการปรับสต็อก',
      content: 'ต้องการยกเลิกการปรับสต็อกหรือไม่? ระบบจะทำการกลับรายการสต็อก',
      okText: 'ยกเลิก',
      cancelText: 'ไม่',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await stockAdjustmentsApi.cancel(id);
          message.success('ยกเลิกสำเร็จ');
          loadData();
          setDetailVisible(false);
        } catch (error: any) {
          message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
        }
      }
    });
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: 'ลบใบปรับสต็อก',
      content: 'ต้องการลบใบปรับสต็อกนี้หรือไม่?',
      okText: 'ลบ',
      cancelText: 'ยกเลิก',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await stockAdjustmentsApi.delete(id);
          message.success('ลบสำเร็จ');
          loadData();
        } catch (error: any) {
          message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
        }
      }
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      const payload = {
        ...values,
        docDate: values.docDate?.format('YYYY-MM-DD') || dayjs().format('YYYY-MM-DD'),
        adjustmentType,
        items: items.filter(i => i.productId).map((item, idx) => {
          const product = products.find(p => p.id === item.productId);
          return {
            ...item,
            lineNo: idx + 1,
            itemCode: product?.code,
            itemName: product?.name,
            unit: product?.unit,
            unitCost: product?.avg_cost || 0,
          };
        }),
      };
      await stockAdjustmentsApi.create(payload);
      message.success('สร้างใบปรับสต็อกสำเร็จ');
      setModalVisible(false);
      loadData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const addItem = () => setItems([...items, { productId: undefined, qtyAdjust: 0, qtyCounted: 0 }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));
  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index][field] = value;
    
    // Auto calculate qtyAdjust for ADJ_COUNT
    if (field === 'qtyCounted' && adjustmentType === 'ADJ_COUNT') {
      const product = products.find(p => p.id === newItems[index].productId);
      const qtySystem = product?.qty_on_hand || 0;
      newItems[index].qtyAdjust = value - qtySystem;
    }
    
    setItems(newItems);
  };

  const adjustmentTypes = [
    { value: 'ADJ_IN', label: '➕ เพิ่มสต็อก', color: 'green' },
    { value: 'ADJ_OUT', label: '➖ ลดสต็อก', color: 'red' },
    { value: 'ADJ_COUNT', label: '📊 ปรับตามการนับ', color: 'blue' },
  ];

  const statusColors: Record<string, string> = { DRAFT: 'default', POSTED: 'success', CANCELLED: 'error' };
  const statusLabels: Record<string, string> = { DRAFT: 'ร่าง', POSTED: 'ปรับแล้ว', CANCELLED: 'ยกเลิก' };

  const columns = [
    { title: 'เลขที่', dataIndex: 'doc_full_no', key: 'doc_full_no', width: 150 },
    { title: 'วันที่', dataIndex: 'doc_date', key: 'doc_date', width: 110, render: (d: string) => d ? dayjs(d).format('DD/MM/YYYY') : '-' },
    { title: 'คลัง', dataIndex: 'warehouse_name', key: 'warehouse_name' },
    { 
      title: 'ประเภท', dataIndex: 'adjustment_type', key: 'adjustment_type', 
      render: (t: string) => {
        const type = adjustmentTypes.find(a => a.value === t);
        return <Tag color={type?.color}>{type?.label || t}</Tag>;
      }
    },
    { title: 'เหตุผล', dataIndex: 'reason', key: 'reason', ellipsis: true },
    { 
      title: 'จำนวนปรับ', dataIndex: 'total_qty_adjust', key: 'total_qty_adjust', 
      align: 'right' as const,
      render: (v: number) => (
        <span style={{ color: v >= 0 ? '#22c55e' : '#ef4444' }}>
          {v >= 0 ? '+' : ''}{Number(v).toLocaleString()}
        </span>
      )
    },
    { title: 'สถานะ', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={statusColors[s]}>{statusLabels[s] || s}</Tag> },
    {
      title: 'จัดการ', key: 'actions', width: 140,
      render: (_: any, r: StockAdjustment) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} onClick={() => handleView(r.id)} style={{ color: '#22d3ee' }} />
          {r.status === 'DRAFT' && (
            <>
              <Button type="text" icon={<CheckOutlined />} onClick={() => handlePost(r.id)} style={{ color: '#10b981' }} title="ยืนยัน" />
              <Button type="text" icon={<DeleteOutlined />} onClick={() => handleDelete(r.id)} style={{ color: '#ef4444' }} title="ลบ" />
            </>
          )}
          {r.status === 'POSTED' && (
            <Button type="text" icon={<CloseOutlined />} onClick={() => handleCancel(r.id)} style={{ color: '#f59e0b' }} title="ยกเลิก" />
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="text-gradient">📦 ปรับปรุงสต็อก</h1>
        <p>จัดการการปรับยอดสินค้าคงคลัง (Stock Adjustment)</p>
      </div>

      <Card className="card-holo">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate} className="btn-holo">สร้างใบปรับสต็อก</Button>
        </div>
        <Table columns={columns} dataSource={adjustments} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
      </Card>

      {/* Create Modal */}
      <Modal title="สร้างใบปรับสต็อก" open={modalVisible} onCancel={() => setModalVisible(false)} footer={null} width={900}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Space style={{ width: '100%', marginBottom: 16 }} size={16}>
            <Form.Item name="warehouseId" label="คลังสินค้า" rules={[{ required: true }]} style={{ flex: 1, marginBottom: 0 }}>
              <Select 
                placeholder="เลือกคลัง" 
                options={warehouses.map(w => ({ value: w.id, label: w.name }))} 
                onChange={handleWarehouseChange}
              />
            </Form.Item>
            <Form.Item label="ประเภทการปรับ" style={{ flex: 1, marginBottom: 0 }}>
              <Select 
                value={adjustmentType}
                onChange={setAdjustmentType}
                options={adjustmentTypes}
              />
            </Form.Item>
            <Form.Item name="docDate" label="วันที่" style={{ flex: 1, marginBottom: 0 }} initialValue={dayjs()}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Space>

          <Form.Item name="reason" label="เหตุผล" rules={[{ required: true }]}>
            <Input placeholder="เช่น นับสต็อกประจำเดือน, สินค้าชำรุด, รับบริจาค" />
          </Form.Item>

          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#e5e7eb', display: 'block', marginBottom: 8 }}>รายการสินค้า</label>
            {!selectedWarehouse ? (
              <div style={{ padding: 20, textAlign: 'center', color: '#94a3b8', background: '#1e293b', borderRadius: 8 }}>
                กรุณาเลือกคลังสินค้าก่อน
              </div>
            ) : (
              <>
                {items.map((item, idx) => {
                  const product = products.find(p => p.id === item.productId);
                  return (
                    <Space key={idx} style={{ width: '100%', marginBottom: 8 }} align="start">
                      <Select
                        placeholder="เลือกสินค้า" style={{ width: 300 }} value={item.productId}
                        onChange={(v) => updateItem(idx, 'productId', v)}
                        options={products.map(p => ({ 
                          value: p.id, 
                          label: `${p.code} - ${p.name} (คงเหลือ: ${p.qty_on_hand})` 
                        }))}
                        showSearch filterOption={(input, opt) => (opt?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                      />
                      {adjustmentType === 'ADJ_COUNT' ? (
                        <>
                          <div style={{ width: 100, textAlign: 'center', padding: '4px 8px', background: '#334155', borderRadius: 4 }}>
                            <div style={{ fontSize: 10, color: '#94a3b8' }}>ในระบบ</div>
                            <div style={{ color: '#e2e8f0' }}>{product?.qty_on_hand || 0}</div>
                          </div>
                          <InputNumber 
                            min={0} 
                            value={item.qtyCounted} 
                            onChange={(v) => updateItem(idx, 'qtyCounted', v)} 
                            placeholder="นับได้" 
                            style={{ width: 100 }} 
                            addonBefore="นับได้"
                          />
                          <div style={{ 
                            width: 100, textAlign: 'center', padding: '4px 8px', 
                            background: item.qtyAdjust >= 0 ? '#064e3b' : '#7f1d1d', 
                            borderRadius: 4 
                          }}>
                            <div style={{ fontSize: 10, color: '#94a3b8' }}>ผลต่าง</div>
                            <div style={{ color: item.qtyAdjust >= 0 ? '#22c55e' : '#ef4444' }}>
                              {item.qtyAdjust >= 0 ? '+' : ''}{item.qtyAdjust || 0}
                            </div>
                          </div>
                        </>
                      ) : (
                        <InputNumber 
                          min={0} 
                          value={Math.abs(item.qtyAdjust || 0)} 
                          onChange={(v) => updateItem(idx, 'qtyAdjust', v)} 
                          placeholder="จำนวน" 
                          style={{ width: 120 }} 
                          addonBefore={adjustmentType === 'ADJ_IN' ? '+' : '-'}
                        />
                      )}
                      {items.length > 1 && <Button type="text" danger onClick={() => removeItem(idx)}>ลบ</Button>}
                    </Space>
                  );
                })}
                <Button type="dashed" onClick={addItem} style={{ width: '100%' }}>+ เพิ่มรายการ</Button>
              </>
            )}
          </div>

          <Form.Item name="remark" label="หมายเหตุ"><Input.TextArea rows={2} /></Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setModalVisible(false)}>ยกเลิก</Button>
              <Button type="primary" htmlType="submit" className="btn-holo">สร้างใบปรับสต็อก</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Detail Modal */}
      <Modal 
        title={`ใบปรับสต็อก: ${selectedAdjustment?.doc_full_no || ''}`} 
        open={detailVisible} 
        onCancel={() => setDetailVisible(false)} 
        footer={
          selectedAdjustment?.status === 'DRAFT' ? (
            <Space>
              <Button onClick={() => setDetailVisible(false)}>ปิด</Button>
              <Button type="primary" icon={<CheckOutlined />} onClick={() => handlePost(selectedAdjustment.id)}>
                ยืนยันปรับสต็อก
              </Button>
            </Space>
          ) : selectedAdjustment?.status === 'POSTED' ? (
            <Space>
              <Button onClick={() => setDetailVisible(false)}>ปิด</Button>
              <Button danger icon={<CloseOutlined />} onClick={() => handleCancel(selectedAdjustment.id)}>
                ยกเลิกการปรับสต็อก
              </Button>
            </Space>
          ) : null
        }
        width={800}
      >
        {selectedAdjustment && (
          <div>
            <Space style={{ marginBottom: 16 }} size={24}>
              <div><strong>คลังสินค้า:</strong> {selectedAdjustment.warehouse_name}</div>
              <div><strong>วันที่:</strong> {dayjs(selectedAdjustment.doc_date).format('DD/MM/YYYY')}</div>
              <div>
                <strong>ประเภท:</strong> 
                <Tag color={adjustmentTypes.find(t => t.value === selectedAdjustment.adjustment_type)?.color} style={{ marginLeft: 8 }}>
                  {adjustmentTypes.find(t => t.value === selectedAdjustment.adjustment_type)?.label}
                </Tag>
              </div>
              <div>
                <strong>สถานะ:</strong> 
                <Tag color={statusColors[selectedAdjustment.status]} style={{ marginLeft: 8 }}>
                  {statusLabels[selectedAdjustment.status]}
                </Tag>
              </div>
            </Space>
            <div style={{ marginBottom: 16 }}><strong>เหตุผล:</strong> {selectedAdjustment.reason}</div>
            
            <Table
              columns={[
                { title: 'รหัส', dataIndex: 'item_code', width: 100 },
                { title: 'สินค้า', dataIndex: 'item_name' },
                { title: 'หน่วย', dataIndex: 'unit', width: 80 },
                { title: 'ในระบบ', dataIndex: 'qty_system', align: 'right' as const, width: 100, render: (v: number) => Number(v).toLocaleString() },
                { title: 'นับได้', dataIndex: 'qty_counted', align: 'right' as const, width: 100, render: (v: number) => Number(v).toLocaleString() },
                { 
                  title: 'ปรับ', dataIndex: 'qty_adjust', align: 'right' as const, width: 100,
                  render: (v: number) => (
                    <span style={{ color: v >= 0 ? '#22c55e' : '#ef4444', fontWeight: 600 }}>
                      {v >= 0 ? '+' : ''}{Number(v).toLocaleString()}
                    </span>
                  )
                },
                { 
                  title: 'มูลค่า', dataIndex: 'value_adjust', align: 'right' as const, width: 120,
                  render: (v: number) => (
                    <span style={{ color: v >= 0 ? '#22c55e' : '#ef4444' }}>
                      ฿{Number(v).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  )
                },
              ]}
              dataSource={selectedAdjustment.items || []}
              rowKey="id"
              pagination={false}
              size="small"
              summary={() => (
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={5}><strong>รวม</strong></Table.Summary.Cell>
                  <Table.Summary.Cell index={1} align="right">
                    <strong style={{ color: selectedAdjustment.total_qty_adjust >= 0 ? '#22c55e' : '#ef4444' }}>
                      {selectedAdjustment.total_qty_adjust >= 0 ? '+' : ''}{Number(selectedAdjustment.total_qty_adjust).toLocaleString()}
                    </strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2} align="right">
                    <strong style={{ color: selectedAdjustment.total_value_adjust >= 0 ? '#22c55e' : '#ef4444' }}>
                      ฿{Number(selectedAdjustment.total_value_adjust).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </strong>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              )}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StockAdjustmentsPage;
