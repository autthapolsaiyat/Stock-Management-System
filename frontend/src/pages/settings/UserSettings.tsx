import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Switch, Row, Col, Upload, message, Tabs, Divider, InputNumber } from 'antd';
import { SaveOutlined, UploadOutlined, UserOutlined, FileTextOutlined } from '@ant-design/icons';
import { userSettingsApi } from '../../services/api';

const { TextArea } = Input;

const UserSettings: React.FC = () => {
  const [sellerForm] = Form.useForm();
  const [defaultsForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [signatureUrl, setSignatureUrl] = useState<string>('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const [sellerRes, defaultsRes] = await Promise.all([
        userSettingsApi.getSeller(),
        userSettingsApi.getQuotationDefaults(),
      ]);
      
      sellerForm.setFieldsValue(sellerRes.data);
      defaultsForm.setFieldsValue(defaultsRes.data);
      setSignatureUrl(sellerRes.data.signatureUrl || '');
    } catch (error) {
      console.error('Load settings error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSeller = async () => {
    try {
      const values = await sellerForm.validateFields();
      setSaving(true);
      
      await userSettingsApi.updateSeller({
        ...values,
        signatureUrl,
      });
      
      message.success('บันทึกข้อมูลผู้ขายสำเร็จ');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDefaults = async () => {
    try {
      const values = await defaultsForm.validateFields();
      setSaving(true);
      
      await userSettingsApi.updateQuotationDefaults(values);
      
      message.success('บันทึกค่าเริ่มต้นสำเร็จ');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    } finally {
      setSaving(false);
    }
  };

  const handleSignatureUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      setSignatureUrl(base64);
      message.success('อัพโหลดลายเซ็นสำเร็จ');
    };
    reader.readAsDataURL(file);
    return false;
  };

  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = (event) => {
              const base64 = event.target?.result as string;
              if (base64) {
                setSignatureUrl(base64);
                message.success('วางลายเซ็นจาก Clipboard สำเร็จ');
              }
            };
            reader.readAsDataURL(blob);
          }
        }
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, []);

  const tabItems = [
    {
      key: 'seller',
      label: <span><UserOutlined /> ข้อมูลผู้ขาย</span>,
      children: (
        <Card loading={loading}>
          <Form form={sellerForm} layout="vertical">
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item label="ชื่อ" name="name">
                  <Input placeholder="ชื่อจริง" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item label="นามสกุล" name="surname">
                  <Input placeholder="นามสกุล" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item label="ชื่อเล่น" name="nickname">
                  <Input placeholder="ชื่อเล่น" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item label="เบอร์โทร" name="phone">
                  <Input placeholder="เบอร์โทรศัพท์" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="อีเมล" name="email">
                  <Input placeholder="อีเมล" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="ตำแหน่งลายเซ็น" name="signaturePosition">
              <Input placeholder="เช่น ผู้เสนอราคา, Sales Executive" />
            </Form.Item>

            <Form.Item label="ลายเซ็น">
              <div style={{ 
                border: '2px dashed rgba(255,255,255,0.2)', 
                borderRadius: 8, 
                padding: 16,
                textAlign: 'center',
                background: 'rgba(255,255,255,0.02)'
              }}>
                {signatureUrl ? (
                  <div>
                    <img src={signatureUrl} alt="ลายเซ็น" style={{ maxHeight: 100, marginBottom: 12 }} />
                    <div>
                      <Button danger onClick={() => setSignatureUrl('')}>ลบลายเซ็น</Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Upload accept="image/*" showUploadList={false} beforeUpload={handleSignatureUpload}>
                      <Button icon={<UploadOutlined />}>อัพโหลดลายเซ็น</Button>
                    </Upload>
                    <div style={{ marginTop: 8, color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
                      💡 หรือกด Ctrl+V / ⌘+V เพื่อวางรูปจาก Clipboard
                    </div>
                  </div>
                )}
              </div>
            </Form.Item>

            <Divider>ตัวเลือกการแสดงผล</Divider>

            <Row gutter={16}>
              <Col xs={12} md={6}>
                <Form.Item label="แสดงชื่อเต็ม" name={['displayOptions', 'fullName']} valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
              <Col xs={12} md={6}>
                <Form.Item label="แสดงชื่อเล่น" name={['displayOptions', 'nickname']} valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
              <Col xs={12} md={6}>
                <Form.Item label="แสดงเบอร์โทร" name={['displayOptions', 'phone']} valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
              <Col xs={12} md={6}>
                <Form.Item label="แสดงอีเมล" name={['displayOptions', 'email']} valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
              <Col xs={12} md={6}>
                <Form.Item label="แสดงลายเซ็น" name={['displayOptions', 'signature']} valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
            </Row>

            <div style={{ textAlign: 'right', marginTop: 16 }}>
              <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveSeller} loading={saving}>
                บันทึกข้อมูลผู้ขาย
              </Button>
            </div>
          </Form>
        </Card>
      ),
    },
    {
      key: 'defaults',
      label: <span><FileTextOutlined /> ค่าเริ่มต้นใบเสนอราคา</span>,
      children: (
        <Card loading={loading}>
          <Form form={defaultsForm} layout="vertical">
            <Row gutter={16}>
              <Col xs={12} md={8}>
                <Form.Item label="ยืนราคา (วัน)" name="validDays">
                  <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={12} md={8}>
                <Form.Item label="กำหนดส่ง (วัน)" name="deliveryDays">
                  <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={12} md={8}>
                <Form.Item label="เครดิต (วัน)" name="creditTermDays">
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="เงื่อนไขการชำระเงิน" name="paymentTerms">
              <TextArea rows={2} placeholder="เช่น ชำระเงินภายใน 30 วัน หลังจากวันที่ในใบแจ้งหนี้" />
            </Form.Item>

            <Form.Item label="เงื่อนไขการส่งมอบ" name="deliveryTerms">
              <TextArea rows={2} placeholder="เช่น จัดส่งภายใน 120 วัน หลังจากได้รับใบสั่งซื้อ" />
            </Form.Item>

            <Form.Item label="หมายเหตุท้ายเอกสาร" name="footerNote">
              <TextArea rows={3} placeholder="หมายเหตุที่จะแสดงท้ายใบเสนอราคาทุกใบ" />
            </Form.Item>

            <div style={{ textAlign: 'right', marginTop: 16 }}>
              <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveDefaults} loading={saving}>
                บันทึกค่าเริ่มต้น
              </Button>
            </div>
          </Form>
        </Card>
      ),
    },
  ];

  return (
    <div className="page-container">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 24 }}>⚙️ ตั้งค่าส่วนตัว</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>
          ตั้งค่าข้อมูลผู้ขายและค่าเริ่มต้นใบเสนอราคาของคุณ
        </p>
      </div>

      <Tabs items={tabItems} />
    </div>
  );
};

export default UserSettings;
