import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, Select, Row, Col, message } from 'antd';
import { tempProductsApi } from '../../services/api';

const { TextArea } = Input;
const { Option } = Select;

interface TempProductModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (product: any) => void;
  quotationId?: number;
}

const TempProductModal: React.FC<TempProductModalProps> = ({
  open,
  onClose,
  onAdd,
  quotationId,
}) => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      // Calculate suggested price if not provided
      if (!values.suggestedPrice && values.estimatedCost) {
        values.suggestedPrice = values.estimatedCost * 1.3; // Default 30% margin
      }

      const payload = {
        ...values,
        sourceQuotationId: quotationId,
      };

      const response = await tempProductsApi.create(payload);
      message.success('เพิ่มสินค้าชั่วคราวสำเร็จ');
      onAdd(response.data);
      form.resetFields();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    } finally {
      setSaving(false);
    }
  };

  const handleCostChange = (cost: number | null) => {
    if (cost) {
      const currentPrice = form.getFieldValue('suggestedPrice');
      if (!currentPrice) {
        form.setFieldValue('suggestedPrice', Math.round(cost * 1.3)); // 30% margin
      }
    }
  };

  return (
    <Modal
      title="🔶 เพิ่มสินค้าชั่วคราว"
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      onOk={handleSubmit}
      okText="เพิ่มสินค้า"
      cancelText="ยกเลิก"
      confirmLoading={saving}
      width={600}
    >
      <div style={{ 
        padding: 12, 
        background: '#fff7e6', 
        borderRadius: 8, 
        marginBottom: 16 
      }}>
        💡 สินค้าชั่วคราวใช้สำหรับสินค้าที่ยังไม่มีในระบบ จะถูกแปลงเป็นสินค้าจริงเมื่อรับของเข้าสต๊อก
      </div>

      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="ชื่อสินค้า"
              name="name"
              rules={[{ required: true, message: 'กรุณาระบุชื่อสินค้า' }]}
            >
              <Input placeholder="ชื่อสินค้า" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="ยี่ห้อ" name="brand">
              <Input placeholder="ยี่ห้อ" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="รุ่น" name="model">
              <Input placeholder="รุ่น" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="รายละเอียด" name="description">
              <TextArea rows={2} placeholder="รายละเอียดเพิ่มเติม" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="หน่วย"
              name="unit"
              initialValue="ea"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="ea">ชิ้น (ea)</Option>
                <Option value="set">ชุด (set)</Option>
                <Option value="box">กล่อง (box)</Option>
                <Option value="pack">แพ็ค (pack)</Option>
                <Option value="unit">หน่วย (unit)</Option>
                <Option value="pc">อัน (pc)</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="ต้นทุนโดยประมาณ"
              name="estimatedCost"
              rules={[{ required: true, message: 'กรุณาระบุต้นทุน' }]}
            >
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(v) => v!.replace(/,/g, '') as any}
                placeholder="0"
                onChange={handleCostChange}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="ราคาเสนอ"
              name="suggestedPrice"
            >
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(v) => v!.replace(/,/g, '') as any}
                placeholder="อัตโนมัติ +30%"
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Margin Preview */}
        <Form.Item noStyle shouldUpdate>
          {({ getFieldValue }) => {
            const cost = getFieldValue('estimatedCost') || 0;
            const price = getFieldValue('suggestedPrice') || cost * 1.3;
            const margin = price > 0 ? ((price - cost) / price) * 100 : 0;
            
            return cost > 0 ? (
              <div style={{ 
                padding: 12, 
                background: '#f5f5f5', 
                borderRadius: 8,
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>Margin คาดการณ์:</span>
                <span style={{ 
                  fontWeight: 'bold',
                  color: margin < 10 ? '#faad14' : margin >= 20 ? '#52c41a' : '#1890ff'
                }}>
                  {margin.toFixed(1)}% 
                  {margin < 10 && ' ⚠️'}
                </span>
              </div>
            ) : null;
          }}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TempProductModal;
