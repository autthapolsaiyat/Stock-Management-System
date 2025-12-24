import React, { useEffect, useState } from 'react';
import { Table, Button, Card, Space, Tag, message, Modal, Form, Select, Input, DatePicker, Progress, InputNumber } from 'antd';
import { PlusOutlined, EyeOutlined, PlayCircleOutlined, CheckOutlined, FileDoneOutlined, SyncOutlined, DeleteOutlined, StopOutlined, PrinterOutlined } from '@ant-design/icons';
import { stockCountsApi, warehousesApi, categoriesApi } from '../services/api';
import { StockCountPrintPreview } from '../components/print';
import dayjs from 'dayjs';

interface StockCount {
  id: number;
  doc_full_no: string;
  warehouse_id: number;
  warehouse_name: string;
  count_date: string;
  count_type: string;
  description: string;
  status: string;
  total_items: number;
  counted_items: number;
  variance_items: number;
  total_variance_value: number;
  adjustment_id: number;
  items?: any[];
}

interface Warehouse {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

const StockCountsPage: React.FC = () => {
  const [counts, setCounts] = useState<StockCount[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [printVisible, setPrintVisible] = useState(false);
  const [printType, setPrintType] = useState<'count_sheet' | 'variance_report'>('count_sheet');
  const [selectedCount, setSelectedCount] = useState<StockCount | null>(null);
  const [countType, setCountType] = useState<string>('FULL');
  const [countingItem, setCountingItem] = useState<any>(null);
  const [form] = Form.useForm();
  const [countForm] = Form.useForm();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [countRes, whRes, catRes] = await Promise.all([
        stockCountsApi.getAll(),
        warehousesApi.getAll(),
        categoriesApi.getAll(),
      ]);
      setCounts(countRes.data || []);
      setWarehouses(whRes.data || []);
      setCategories(catRes.data || []);
    } catch (error) {
      message.error('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    form.resetFields();
    setCountType('FULL');
    setModalVisible(true);
  };

  const handleView = async (id: number) => {
    try {
      const res = await stockCountsApi.getById(id);
      setSelectedCount(res.data);
      setDetailVisible(true);
    } catch (error) {
      message.error('ไม่สามารถโหลดข้อมูลได้');
    }
  };

  const handleStart = async (id: number) => {
    Modal.confirm({
      title: <span style={{ color: '#f8fafc', fontSize: 18, fontWeight: 600 }}>🚀 เริ่มนับสต็อก</span>,
      content: <span style={{ color: '#e2e8f0', fontSize: 14 }}>ต้องการเริ่มนับสต็อกหรือไม่?<br/>ระบบจะอัพเดทยอดสต็อกในระบบให้เป็นปัจจุบัน</span>,
      okText: 'เริ่มนับ',
      cancelText: 'ยกเลิก',
      className: 'dark-modal',
      onOk: async () => {
        try {
          await stockCountsApi.start(id);
          message.success('เริ่มนับสต็อกแล้ว');
          loadData();
          handleView(id);
        } catch (error: any) {
          message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
        }
      }
    });
  };

  const handleComplete = async (id: number) => {
    Modal.confirm({
      title: <span style={{ color: '#f8fafc', fontSize: 18, fontWeight: 600 }}>✅ เสร็จสิ้นการนับ</span>,
      content: <span style={{ color: '#e2e8f0', fontSize: 14 }}>ยืนยันว่านับสินค้าครบทุกรายการแล้ว?</span>,
      okText: 'เสร็จสิ้น',
      cancelText: 'ยกเลิก',
      className: 'dark-modal',
      onOk: async () => {
        try {
          await stockCountsApi.complete(id);
          message.success('เสร็จสิ้นการนับแล้ว');
          loadData();
          handleView(id);
        } catch (error: any) {
          message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
        }
      }
    });
  };

  const handleApprove = async (id: number) => {
    Modal.confirm({
      title: <span style={{ color: '#f8fafc', fontSize: 18, fontWeight: 600 }}>📋 อนุมัติผลการนับ</span>,
      content: <span style={{ color: '#e2e8f0', fontSize: 14 }}>ต้องการอนุมัติผลการนับสต็อกหรือไม่?</span>,
      okText: 'อนุมัติ',
      cancelText: 'ยกเลิก',
      className: 'dark-modal',
      onOk: async () => {
        try {
          await stockCountsApi.approve(id);
          message.success('อนุมัติแล้ว');
          loadData();
          handleView(id);
        } catch (error: any) {
          message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
        }
      }
    });
  };

  const handleCreateAdjustment = async (id: number) => {
    Modal.confirm({
      title: <span style={{ color: '#f8fafc', fontSize: 18, fontWeight: 600 }}>🔄 สร้างใบปรับสต็อก</span>,
      content: <span style={{ color: '#e2e8f0', fontSize: 14 }}>ต้องการสร้างใบปรับสต็อกจากผลการนับหรือไม่?<br/>จะสร้างเฉพาะรายการที่มีผลต่าง</span>,
      okText: 'สร้าง',
      cancelText: 'ยกเลิก',
      className: 'dark-modal',
      onOk: async () => {
        try {
          const res = await stockCountsApi.createAdjustment(id);
          message.success(`สร้างใบปรับสต็อก ${res.data.adjustment?.doc_full_no} แล้ว`);
          loadData();
          handleView(id);
        } catch (error: any) {
          message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
        }
      }
    });
  };

  const handleCancelCount = async (id: number) => {
    Modal.confirm({
      title: <span style={{ color: '#f8fafc', fontSize: 18, fontWeight: 600 }}>⛔ ยกเลิกการนับ</span>,
      content: <span style={{ color: '#e2e8f0', fontSize: 14 }}>ต้องการยกเลิกการนับสต็อกนี้หรือไม่?<br/>ข้อมูลการนับทั้งหมดจะถูกล้าง</span>,
      okText: 'ยกเลิกการนับ',
      cancelText: 'ไม่',
      okButtonProps: { danger: true },
      className: 'dark-modal',
      onOk: async () => {
        try {
          await stockCountsApi.cancel(id);
          message.success('ยกเลิกการนับแล้ว');
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
      title: <span style={{ color: '#f8fafc', fontSize: 18, fontWeight: 600 }}>🗑️ ลบใบนับสต็อก</span>,
      content: <span style={{ color: '#e2e8f0', fontSize: 14 }}>ต้องการลบใบนับสต็อกนี้หรือไม่?<br/>การดำเนินการนี้ไม่สามารถย้อนกลับได้</span>,
      okText: 'ลบ',
      cancelText: 'ยกเลิก',
      okButtonProps: { danger: true },
      className: 'dark-modal',
      onOk: async () => {
        try {
          await stockCountsApi.delete(id);
          message.success('ลบสำเร็จ');
          loadData();
        } catch (error: any) {
          message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
        }
      }
    });
  };

  const handleUpdateItemCount = async () => {
    try {
      const values = countForm.getFieldsValue();
      await stockCountsApi.updateItem(selectedCount!.id, countingItem.id, {
        qtyCount1: values.qtyCount1,
        qtyCount2: values.qtyCount2,
        remark: values.remark,
      });
      message.success('บันทึกผลนับแล้ว');
      setCountingItem(null);
      handleView(selectedCount!.id);
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const payload = {
        ...values,
        countDate: values.countDate?.format('YYYY-MM-DD') || dayjs().format('YYYY-MM-DD'),
        countType,
        categoryIds: countType === 'PARTIAL' ? values.categoryIds : undefined,
      };
      await stockCountsApi.create(payload);
      message.success('สร้างใบนับสต็อกสำเร็จ');
      setModalVisible(false);
      loadData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const countTypes = [
    { value: 'FULL', label: '📦 นับทั้งคลัง' },
    { value: 'PARTIAL', label: '📂 นับบางหมวด' },
    { value: 'CYCLE', label: '🔄 นับวนรอบ' },
  ];

  const statusColors: Record<string, string> = { 
    DRAFT: 'default', 
    IN_PROGRESS: 'processing', 
    COMPLETED: 'warning',
    APPROVED: 'success', 
    ADJUSTED: 'purple',
    CANCELLED: 'error'
  };
  const statusLabels: Record<string, string> = { 
    DRAFT: 'ร่าง', 
    IN_PROGRESS: 'กำลังนับ', 
    COMPLETED: 'นับเสร็จ',
    APPROVED: 'อนุมัติแล้ว', 
    ADJUSTED: 'ปรับสต็อกแล้ว',
    CANCELLED: 'ยกเลิก'
  };

  const columns = [
    { title: 'เลขที่', dataIndex: 'doc_full_no', key: 'doc_full_no', width: 150 },
    { title: 'วันที่', dataIndex: 'count_date', key: 'count_date', width: 110, render: (d: string) => d ? dayjs(d).format('DD/MM/YYYY') : '-' },
    { title: 'คลัง', dataIndex: 'warehouse_name', key: 'warehouse_name' },
    { 
      title: 'ประเภท', dataIndex: 'count_type', key: 'count_type', 
      render: (t: string) => countTypes.find(c => c.value === t)?.label || t
    },
    { 
      title: 'ความคืบหน้า', key: 'progress', width: 150,
      render: (_: any, r: StockCount) => {
        const percent = r.total_items > 0 ? Math.round((r.counted_items / r.total_items) * 100) : 0;
        return (
          <div>
            <Progress percent={percent} size="small" status={percent === 100 ? 'success' : 'active'} />
            <div style={{ fontSize: 11, color: '#94a3b8' }}>{r.counted_items}/{r.total_items} รายการ</div>
          </div>
        );
      }
    },
    { 
      title: 'ผลต่าง', key: 'variance', width: 100,
      render: (_: any, r: StockCount) => (
        <span style={{ color: r.variance_items > 0 ? '#f59e0b' : '#22c55e' }}>
          {r.variance_items} รายการ
        </span>
      )
    },
    { title: 'สถานะ', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={statusColors[s]}>{statusLabels[s] || s}</Tag> },
    {
      title: 'จัดการ', key: 'actions', width: 200,
      render: (_: any, r: StockCount) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} onClick={() => handleView(r.id)} style={{ color: '#22d3ee' }} title="ดูรายละเอียด" />
          {r.status === 'DRAFT' && (
            <>
              <Button type="text" icon={<PrinterOutlined />} onClick={async () => { await handleView(r.id); setPrintType('count_sheet'); setPrintVisible(true); }} style={{ color: '#8b5cf6' }} title="พิมพ์ใบนับ" />
              <Button type="text" icon={<PlayCircleOutlined />} onClick={() => handleStart(r.id)} style={{ color: '#10b981' }} title="เริ่มนับ" />
              <Button type="text" icon={<DeleteOutlined />} onClick={() => handleDelete(r.id)} style={{ color: '#ef4444' }} title="ลบ" />
            </>
          )}
          {r.status === 'IN_PROGRESS' && (
            <>
              <Button type="text" icon={<PrinterOutlined />} onClick={async () => { await handleView(r.id); setPrintType('count_sheet'); setPrintVisible(true); }} style={{ color: '#8b5cf6' }} title="พิมพ์ใบนับ" />
              <Button type="text" icon={<CheckOutlined />} onClick={() => handleComplete(r.id)} style={{ color: '#f59e0b' }} title="เสร็จสิ้น" />
              <Button type="text" icon={<StopOutlined />} onClick={() => handleCancelCount(r.id)} style={{ color: '#ef4444' }} title="ยกเลิกการนับ" />
            </>
          )}
          {r.status === 'COMPLETED' && (
            <>
              <Button type="text" icon={<PrinterOutlined />} onClick={async () => { await handleView(r.id); setPrintType('variance_report'); setPrintVisible(true); }} style={{ color: '#8b5cf6' }} title="พิมพ์รายงานผลต่าง" />
              <Button type="text" icon={<FileDoneOutlined />} onClick={() => handleApprove(r.id)} style={{ color: '#8b5cf6' }} title="อนุมัติ" />
              <Button type="text" icon={<StopOutlined />} onClick={() => handleCancelCount(r.id)} style={{ color: '#ef4444' }} title="ยกเลิกการนับ" />
            </>
          )}
          {r.status === 'APPROVED' && (
            <>
              <Button type="text" icon={<PrinterOutlined />} onClick={async () => { await handleView(r.id); setPrintType('variance_report'); setPrintVisible(true); }} style={{ color: '#8b5cf6' }} title="พิมพ์รายงานผลต่าง" />
              {!r.adjustment_id && (
                <Button type="text" icon={<SyncOutlined />} onClick={() => handleCreateAdjustment(r.id)} style={{ color: '#ec4899' }} title="สร้างใบปรับสต็อก" />
              )}
            </>
          )}
          {r.status === 'CANCELLED' && (
            <Button type="text" icon={<DeleteOutlined />} onClick={() => handleDelete(r.id)} style={{ color: '#ef4444' }} title="ลบ" />
          )}
        </Space>
      ),
    },
  ];

  const countStatusColors: Record<string, string> = {
    NOT_COUNTED: '#64748b',
    COUNTED: '#22c55e',
    RECOUNTED: '#3b82f6',
    VERIFIED: '#8b5cf6',
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="text-gradient">📋 นับสต็อก</h1>
        <p>จัดการการตรวจนับสินค้าคงคลัง (Physical Inventory)</p>
      </div>

      <Card className="card-holo">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate} className="btn-holo">สร้างใบนับสต็อก</Button>
        </div>
        <Table columns={columns} dataSource={counts} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
      </Card>

      {/* Create Modal */}
      <Modal title="สร้างใบนับสต็อก" open={modalVisible} onCancel={() => setModalVisible(false)} footer={null} width={600}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="warehouseId" label="คลังสินค้า" rules={[{ required: true }]}>
            <Select placeholder="เลือกคลัง" options={warehouses.map(w => ({ value: w.id, label: w.name }))} />
          </Form.Item>

          <Form.Item label="ประเภทการนับ">
            <Select value={countType} onChange={setCountType} options={countTypes} />
          </Form.Item>

          {countType === 'PARTIAL' && (
            <Form.Item name="categoryIds" label="หมวดหมู่ที่ต้องการนับ" rules={[{ required: true }]}>
              <Select 
                mode="multiple" 
                placeholder="เลือกหมวดหมู่" 
                options={categories.map(c => ({ value: c.id, label: c.name }))} 
              />
            </Form.Item>
          )}

          <Form.Item name="countDate" label="วันที่นับ" initialValue={dayjs()}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="description" label="รายละเอียด">
            <Input placeholder="เช่น นับสต็อกประจำเดือน ธ.ค. 2568" />
          </Form.Item>

          <Form.Item name="remark" label="หมายเหตุ"><Input.TextArea rows={2} /></Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setModalVisible(false)}>ยกเลิก</Button>
              <Button type="primary" htmlType="submit" className="btn-holo">สร้างใบนับสต็อก</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Detail Modal */}
      <Modal 
        title={`ใบนับสต็อก: ${selectedCount?.doc_full_no || ''}`} 
        open={detailVisible} 
        onCancel={() => setDetailVisible(false)} 
        footer={
          <Space>
            <Button onClick={() => setDetailVisible(false)}>ปิด</Button>
            {selectedCount?.status === 'DRAFT' && (
              <Button type="primary" icon={<PlayCircleOutlined />} onClick={() => handleStart(selectedCount.id)}>เริ่มนับ</Button>
            )}
            {selectedCount?.status === 'IN_PROGRESS' && (
              <Button type="primary" icon={<CheckOutlined />} onClick={() => handleComplete(selectedCount.id)}>เสร็จสิ้นการนับ</Button>
            )}
            {selectedCount?.status === 'COMPLETED' && (
              <Button type="primary" icon={<FileDoneOutlined />} onClick={() => handleApprove(selectedCount.id)}>อนุมัติ</Button>
            )}
            {selectedCount?.status === 'APPROVED' && !selectedCount?.adjustment_id && (
              <Button type="primary" icon={<SyncOutlined />} onClick={() => handleCreateAdjustment(selectedCount.id)}>สร้างใบปรับสต็อก</Button>
            )}
          </Space>
        }
        width={1000}
      >
        {selectedCount && (
          <div>
            <Space style={{ marginBottom: 16 }} size={24}>
              <div><strong>คลัง:</strong> {selectedCount.warehouse_name}</div>
              <div><strong>วันที่:</strong> {dayjs(selectedCount.count_date).format('DD/MM/YYYY')}</div>
              <div><strong>ประเภท:</strong> {countTypes.find(t => t.value === selectedCount.count_type)?.label}</div>
              <div>
                <strong>สถานะ:</strong> 
                <Tag color={statusColors[selectedCount.status]} style={{ marginLeft: 8 }}>
                  {statusLabels[selectedCount.status]}
                </Tag>
              </div>
            </Space>

            <div style={{ marginBottom: 16 }}>
              <Progress 
                percent={selectedCount.total_items > 0 ? Math.round((selectedCount.counted_items / selectedCount.total_items) * 100) : 0} 
                status={selectedCount.counted_items === selectedCount.total_items ? 'success' : 'active'}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: 12 }}>
                <span>นับแล้ว {selectedCount.counted_items}/{selectedCount.total_items} รายการ</span>
                <span style={{ color: selectedCount.variance_items > 0 ? '#f59e0b' : '#22c55e' }}>
                  มีผลต่าง {selectedCount.variance_items} รายการ
                </span>
              </div>
            </div>
            
            <Table
              columns={[
                { title: 'รหัส', dataIndex: 'item_code', width: 100 },
                { title: 'สินค้า', dataIndex: 'item_name' },
                { title: 'หน่วย', dataIndex: 'unit', width: 70 },
                { title: 'ในระบบ', dataIndex: 'qty_system', align: 'right' as const, width: 90, render: (v: number) => Number(v).toLocaleString() },
                { title: 'นับครั้งที่ 1', dataIndex: 'qty_count1', align: 'right' as const, width: 100, render: (v: number) => v !== null ? Number(v).toLocaleString() : '-' },
                { title: 'นับครั้งที่ 2', dataIndex: 'qty_count2', align: 'right' as const, width: 100, render: (v: number) => v !== null ? Number(v).toLocaleString() : '-' },
                { title: 'ยืนยัน', dataIndex: 'qty_final', align: 'right' as const, width: 90, render: (v: number) => v !== null ? Number(v).toLocaleString() : '-' },
                { 
                  title: 'ผลต่าง', dataIndex: 'qty_variance', align: 'right' as const, width: 90,
                  render: (v: number) => (
                    <span style={{ color: v === 0 ? '#22c55e' : v > 0 ? '#3b82f6' : '#ef4444', fontWeight: 600 }}>
                      {v > 0 ? '+' : ''}{Number(v).toLocaleString()}
                    </span>
                  )
                },
                { 
                  title: 'สถานะ', dataIndex: 'count_status', width: 100,
                  render: (s: string) => (
                    <Tag color={countStatusColors[s]} style={{ fontSize: 11 }}>
                      {s === 'NOT_COUNTED' ? 'ยังไม่นับ' : s === 'COUNTED' ? 'นับแล้ว' : s === 'RECOUNTED' ? 'นับซ้ำ' : 'ตรวจแล้ว'}
                    </Tag>
                  )
                },
                {
                  title: '', key: 'action', width: 60,
                  render: (_: any, r: any) => selectedCount.status === 'IN_PROGRESS' && (
                    <Button 
                      size="small" 
                      type="primary"
                      onClick={() => {
                        setCountingItem(r);
                        countForm.setFieldsValue({
                          qtyCount1: r.qty_count1,
                          qtyCount2: r.qty_count2,
                          remark: r.remark,
                        });
                      }}
                    >
                      นับ
                    </Button>
                  )
                },
              ]}
              dataSource={selectedCount.items || []}
              rowKey="id"
              pagination={false}
              size="small"
              scroll={{ y: 400 }}
            />
          </div>
        )}
      </Modal>

      {/* Count Input Modal */}
      <Modal 
        title={`บันทึกผลนับ: ${countingItem?.item_code} - ${countingItem?.item_name}`} 
        open={!!countingItem} 
        onCancel={() => setCountingItem(null)} 
        onOk={handleUpdateItemCount}
        okText="บันทึก"
        cancelText="ยกเลิก"
      >
        {countingItem && (
          <Form form={countForm} layout="vertical">
            <div style={{ 
              padding: 16, 
              background: '#1e293b', 
              borderRadius: 8, 
              marginBottom: 16,
              display: 'flex',
              justifyContent: 'space-around',
              textAlign: 'center'
            }}>
              <div>
                <div style={{ color: '#94a3b8', fontSize: 12 }}>ยอดในระบบ</div>
                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#e2e8f0' }}>{Number(countingItem.qty_system).toLocaleString()}</div>
              </div>
              <div>
                <div style={{ color: '#94a3b8', fontSize: 12 }}>หน่วย</div>
                <div style={{ fontSize: 18, color: '#e2e8f0' }}>{countingItem.unit || '-'}</div>
              </div>
            </div>

            <Form.Item name="qtyCount1" label="จำนวนที่นับได้ (ครั้งที่ 1)" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} size="large" />
            </Form.Item>

            <Form.Item name="qtyCount2" label="จำนวนที่นับได้ (ครั้งที่ 2 - นับซ้ำ)">
              <InputNumber min={0} style={{ width: '100%' }} placeholder="กรอกเมื่อต้องการนับซ้ำ" />
            </Form.Item>

            <Form.Item name="remark" label="หมายเหตุ">
              <Input.TextArea rows={2} />
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* Print Preview */}
      <StockCountPrintPreview
        open={printVisible}
        onClose={() => setPrintVisible(false)}
        stockCount={selectedCount}
        printType={printType}
      />
    </div>
  );
};

export default StockCountsPage;
