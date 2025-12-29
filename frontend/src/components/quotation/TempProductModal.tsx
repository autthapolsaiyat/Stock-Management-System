import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Row, Col, Tag, message, Spin } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { unitsApi } from '../../services/api';

const { TextArea } = Input;

interface Unit {
  id: number;
  code: string;
  name: string;
}

interface TempProductModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (product: any) => void;
}

const TempProductModal: React.FC<TempProductModalProps> = ({ open, onClose, onAdd }) => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [marginPreview, setMarginPreview] = useState<number>(0);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loadingUnits, setLoadingUnits] = useState(false);

  useEffect(() => {
    if (open) {
      loadUnits();
    }
  }, [open]);

  const loadUnits = async () => {
    setLoadingUnits(true);
    try {
      const response = await unitsApi.getAll();
      setUnits(response.data || []);
    } catch (error) {
      console.error('Error loading units:', error);
      // Fallback to default units if API fails
      setUnits([
        { id: 1, code: 'ea', name: 'ชิ้น (ea)' },
        { id: 2, code: 'set', name: 'ชุด (set)' },
        { id: 3, code: 'box', name: 'กล่อง (box)' },
        { id: 4, code: 'pack', name: 'แพ็ค (pack)' },
        { id: 5, code: 'unit', name: 'หน่วย (unit)' },
      ]);
    } finally {
      setLoadingUnits(false);
    }
  };

  const handleCostChange = (cost: number | null) => {
    const suggestedPrice = (cost || 0) * 1.3;
    form.setFieldValue('suggestedPrice', Math.round(suggestedPrice));
    calculateMargin(cost || 0, suggestedPrice);
  };

  const handlePriceChange = (price: number | null) => {
    const cost = form.getFieldValue('estimatedCost') || 0;
    calculateMargin(cost, price || 0);
  };

  const calculateMargin = (cost: number, price: number) => {
    if (price > 0) {
      const margin = ((price - cost) / price) * 100;
      setMarginPreview(margin);
    } else {
      setMarginPreview(0);
    }
  };

  const getMarginColor = (margin: number) => {
    if (margin < 10) return 'error';
    if (margin < 20) return 'warning';
    return 'success';
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      
      const tempProduct = {
        ...values,
        tempCode: `TEMP-${Date.now()}`,
      };
      
      onAdd(tempProduct);
      form.resetFields();
      setMarginPreview(0);
      message.success('เพิ่มสินค้าชั่วคราวแล้ว');
    } catch (error) {
      // Validation error
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    setMarginPreview(0);
    onClose();
  };

  return (
    <Modal
      title={
        <span>
          <span style={{ color: '#faad14', marginRight: 8 }}>🔶</span>
          เพิ่มสินค้าชั่วคราว
        </span>
      }
      open={open}
      onCancel={handleClose}
      onOk={handleSubmit}
      okText="เพิ่มสินค้า"
      cancelText="ยกเลิก"
      confirmLoading={saving}
      width={600}
      destroyOnClose
    >
      {/* Info Banner */}
      <div style={{ 
        padding: 12, 
        marginBottom: 16, 
        borderRadius: 8,
        background: 'linear-gradient(135deg, rgba(250,173,20,0.15), rgba(250,173,20,0.05))',
        border: '1px solid rgba(250,173,20,0.3)',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <InfoCircleOutlined style={{ color: '#faad14', marginTop: 3 }} />
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>
            สินค้าชั่วคราวใช้สำหรับสินค้าที่ยังไม่มีในระบบ จะถูกแปลงเป็นสินค้าจริงเมื่อรับของเข้าสต็อก
          </div>
        </div>
      </div>

      <Form form={form} layout="vertical">
        <Form.Item 
          label="ชื่อสินค้า" 
          name="name" 
          rules={[{ required: true, message: 'กรุณากรอกชื่อสินค้า' }]}
        >
          <Input placeholder="ระบุชื่อสินค้า" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="ยี่ห้อ" name="brand">
              <Input placeholder="ระบุยี่ห้อ (ถ้ามี)" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="รุ่น" name="model">
              <Input placeholder="ระบุรุ่น (ถ้ามี)" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="รายละเอียด" name="description">
          <TextArea rows={3} placeholder="รายละเอียดเพิ่มเติม (ถ้ามี)" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item 
              label="หน่วย" 
              name="unit" 
              rules={[{ required: true, message: 'กรุณาเลือกหน่วย' }]}
              initialValue="ea"
            >
              <Select
                showSearch
                placeholder="เลือกหน่วย"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase()) ||
                  (option?.value as string)?.toLowerCase().includes(input.toLowerCase())
                }
                loading={loadingUnits}
                notFoundContent={loadingUnits ? <Spin size="small" /> : 'ไม่พบหน่วย'}
              >
                {units.map(unit => (
                  <Select.Option key={unit.id} value={unit.code || unit.name}>
                    {unit.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item 
              label="ต้นทุนโดยประมาณ" 
              name="estimatedCost" 
              rules={[{ required: true, message: 'กรุณากรอกต้นทุน' }]}
            >
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                placeholder="0"
                formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(v) => v!.replace(/,/g, '') as any}
                onChange={handleCostChange}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item 
              label="ราคาเสนอ" 
              name="suggestedPrice"
              tooltip="ระบบคำนวณอัตโนมัติ +30% หรือกรอกเอง"
            >
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                placeholder="อัตโนมัติ +30%"
                formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(v) => v!.replace(/,/g, '') as any}
                onChange={handlePriceChange}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Margin Preview */}
        {marginPreview > 0 && (
          <div style={{ 
            padding: 12, 
            borderRadius: 8,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>Margin โดยประมาณ:</span>
            <Tag color={getMarginColor(marginPreview)} style={{ margin: 0 }}>
              {marginPreview.toFixed(1)}%
              {marginPreview < 10 && ' ⚠️ ต่ำ'}
            </Tag>
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default TempProductModal;
