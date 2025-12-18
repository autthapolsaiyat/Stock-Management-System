import React, { useState, useEffect } from 'react';
import { 
  Modal, Form, Input, InputNumber, Row, Col, 
  Button, message, Spin, Divider 
} from 'antd';
import { SaveOutlined, SettingOutlined } from '@ant-design/icons';
import { systemSettingsApi } from '../../services/api';

const { TextArea } = Input;

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ open, onClose, onSave }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      loadSettings();
    }
  }, [open]);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const response = await systemSettingsApi.getAll();
      const settings: Record<string, any> = {};
      
      response.data.forEach((s: any) => {
        settings[s.settingKey] = s.settingType === 'JSON' 
          ? JSON.parse(s.settingValue || '{}')
          : s.settingValue;
      });

      form.setFieldsValue({
        // Defaults
        validDays: parseInt(settings.QT_VALID_DAYS) || 30,
        deliveryDays: parseInt(settings.QT_DELIVERY_DAYS) || 120,
        creditTermDays: parseInt(settings.QT_CREDIT_TERM_DAYS) || 30,
        minMarginPercent: parseFloat(settings.QT_MIN_MARGIN_PERCENT) || 10,
        varianceAlertPercent: parseFloat(settings.QT_VARIANCE_ALERT_PERCENT) || 5,
        // Default texts
        paymentTerms: settings.DEFAULT_PAYMENT_TERMS || '',
        deliveryTerms: settings.DEFAULT_DELIVERY_TERMS || '',
        footerNote: settings.DEFAULT_FOOTER_NOTE || '',
      });
    } catch (error) {
      message.error('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      const settings = [
        // Defaults
        { key: 'QT_VALID_DAYS', value: String(values.validDays) },
        { key: 'QT_DELIVERY_DAYS', value: String(values.deliveryDays) },
        { key: 'QT_CREDIT_TERM_DAYS', value: String(values.creditTermDays) },
        { key: 'QT_MIN_MARGIN_PERCENT', value: String(values.minMarginPercent) },
        { key: 'QT_VARIANCE_ALERT_PERCENT', value: String(values.varianceAlertPercent) },
        // Default texts
        { key: 'DEFAULT_PAYMENT_TERMS', value: values.paymentTerms },
        { key: 'DEFAULT_DELIVERY_TERMS', value: values.deliveryTerms },
        { key: 'DEFAULT_FOOTER_NOTE', value: values.footerNote },
      ];

      await systemSettingsApi.updateBulk(settings);
      message.success('บันทึกสำเร็จ');
      onSave();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={<span><SettingOutlined /> ตั้งค่าเริ่มต้นใบเสนอราคา</span>}
      open={open}
      onCancel={onClose}
      width={700}
      footer={[
        <Button key="cancel" onClick={onClose}>
          ยกเลิก
        </Button>,
        <Button
          key="save"
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSave}
          loading={saving}
        >
          บันทึกเป็นค่าเริ่มต้น
        </Button>,
      ]}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Spin size="large" />
        </div>
      ) : (
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={24}>
              <Divider orientation="left">📅 ค่าเริ่มต้นเอกสาร</Divider>
            </Col>
            <Col span={8}>
              <Form.Item label="ยืนราคา (วัน)" name="validDays">
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="กำหนดส่งสินค้า (วัน)" name="deliveryDays">
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="กำหนดชำระเงิน (วัน)" name="creditTermDays">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Margin ขั้นต่ำ (%)" name="minMarginPercent">
                <InputNumber min={0} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="แจ้งเตือน Cost Variance (%)" name="varianceAlertPercent">
                <InputNumber min={0} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Divider orientation="left">📝 ข้อความเริ่มต้น</Divider>
            </Col>
            <Col span={24}>
              <Form.Item label="เงื่อนไขการชำระเงิน" name="paymentTerms">
                <TextArea rows={2} placeholder="ชำระเงินภายใน 30 วัน หลังจากส่งมอบสินค้า" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="เงื่อนไขการส่งมอบ" name="deliveryTerms">
                <TextArea rows={2} placeholder="จัดส่งถึงหน้างาน ไม่รวมค่าติดตั้ง" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="หมายเหตุท้ายเอกสาร" name="footerNote">
                <TextArea rows={2} placeholder="ราคานี้ไม่รวม VAT 7%" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      )}
    </Modal>
  );
};

export default SettingsModal;
