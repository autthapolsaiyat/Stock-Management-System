import React, { useState, useEffect } from 'react';
import { 
  Modal, Tabs, Form, Input, InputNumber, Row, Col, 
  Upload, Button, Checkbox, message, Spin, Divider 
} from 'antd';
import { 
  UploadOutlined, DeleteOutlined, SaveOutlined, 
  BankOutlined, UserOutlined, SettingOutlined 
} from '@ant-design/icons';
import { systemSettingsApi, uploadApi } from '../../services/api';

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
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [signatureUrl, setSignatureUrl] = useState<string>('');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingSignature, setUploadingSignature] = useState(false);

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
        // Company Thai
        companyNameTh: settings.COMPANY_NAME_TH || '',
        address1Th: settings.COMPANY_ADDRESS1_TH || '',
        address2Th: settings.COMPANY_ADDRESS2_TH || '',
        address3Th: settings.COMPANY_ADDRESS3_TH || '',
        address4Th: settings.COMPANY_ADDRESS4_TH || '',
        phoneTh: settings.COMPANY_PHONE_TH || '',
        faxTh: settings.COMPANY_FAX_TH || '',
        taxIdTh: settings.COMPANY_TAX_ID_TH || '',
        // Company English
        companyNameEn: settings.COMPANY_NAME_EN || '',
        address1En: settings.COMPANY_ADDRESS1_EN || '',
        address2En: settings.COMPANY_ADDRESS2_EN || '',
        address3En: settings.COMPANY_ADDRESS3_EN || '',
        phoneEn: settings.COMPANY_PHONE_EN || '',
        faxEn: settings.COMPANY_FAX_EN || '',
        taxIdEn: settings.COMPANY_TAX_ID_EN || '',
        // Common
        companyEmail: settings.COMPANY_EMAIL || '',
        displayLang: settings.COMPANY_DISPLAY_LANG || 'BOTH',
        // Seller
        sellerName: settings.SELLER_NAME || '',
        sellerSurname: settings.SELLER_SURNAME || '',
        sellerNickname: settings.SELLER_NICKNAME || '',
        sellerPhone: settings.SELLER_PHONE || '',
        sellerEmail: settings.SELLER_EMAIL || '',
        signaturePosition: settings.SELLER_SIGNATURE_POSITION || 'ผู้จัดทำ',
        // Display options
        showFullName: settings.SELLER_DISPLAY_OPTIONS?.fullName ?? true,
        showNickname: settings.SELLER_DISPLAY_OPTIONS?.nickname ?? false,
        showSellerPhone: settings.SELLER_DISPLAY_OPTIONS?.phone ?? true,
        showSellerEmail: settings.SELLER_DISPLAY_OPTIONS?.email ?? false,
        showSignature: settings.SELLER_DISPLAY_OPTIONS?.signature ?? true,
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

      setLogoUrl(settings.COMPANY_LOGO_URL || '');
      setSignatureUrl(settings.SELLER_SIGNATURE_URL || '');
    } catch (error) {
      message.error('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadLogo = async (file: File) => {
    setUploadingLogo(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const response = await uploadApi.uploadBase64(base64, 'company');
        setLogoUrl(response.data.url);
        message.success('อัพโหลดโลโก้สำเร็จ');
        setUploadingLogo(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      message.error('อัพโหลดไม่สำเร็จ');
      setUploadingLogo(false);
    }
    return false;
  };

  const handleUploadSignature = async (file: File) => {
    setUploadingSignature(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const response = await uploadApi.uploadBase64(base64, 'signatures');
        setSignatureUrl(response.data.url);
        message.success('อัพโหลดลายเซ็นสำเร็จ');
        setUploadingSignature(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      message.error('อัพโหลดไม่สำเร็จ');
      setUploadingSignature(false);
    }
    return false;
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      const settings = [
        // Company Thai
        { key: 'COMPANY_NAME_TH', value: values.companyNameTh },
        { key: 'COMPANY_ADDRESS1_TH', value: values.address1Th },
        { key: 'COMPANY_ADDRESS2_TH', value: values.address2Th },
        { key: 'COMPANY_ADDRESS3_TH', value: values.address3Th },
        { key: 'COMPANY_ADDRESS4_TH', value: values.address4Th },
        { key: 'COMPANY_PHONE_TH', value: values.phoneTh },
        { key: 'COMPANY_FAX_TH', value: values.faxTh },
        { key: 'COMPANY_TAX_ID_TH', value: values.taxIdTh },
        // Company English
        { key: 'COMPANY_NAME_EN', value: values.companyNameEn },
        { key: 'COMPANY_ADDRESS1_EN', value: values.address1En },
        { key: 'COMPANY_ADDRESS2_EN', value: values.address2En },
        { key: 'COMPANY_ADDRESS3_EN', value: values.address3En },
        { key: 'COMPANY_PHONE_EN', value: values.phoneEn },
        { key: 'COMPANY_FAX_EN', value: values.faxEn },
        { key: 'COMPANY_TAX_ID_EN', value: values.taxIdEn },
        // Common
        { key: 'COMPANY_EMAIL', value: values.companyEmail },
        { key: 'COMPANY_LOGO_URL', value: logoUrl },
        { key: 'COMPANY_DISPLAY_LANG', value: values.displayLang },
        // Seller
        { key: 'SELLER_NAME', value: values.sellerName },
        { key: 'SELLER_SURNAME', value: values.sellerSurname },
        { key: 'SELLER_NICKNAME', value: values.sellerNickname },
        { key: 'SELLER_PHONE', value: values.sellerPhone },
        { key: 'SELLER_EMAIL', value: values.sellerEmail },
        { key: 'SELLER_SIGNATURE_URL', value: signatureUrl },
        { key: 'SELLER_SIGNATURE_POSITION', value: values.signaturePosition },
        { 
          key: 'SELLER_DISPLAY_OPTIONS', 
          value: JSON.stringify({
            fullName: values.showFullName,
            nickname: values.showNickname,
            phone: values.showSellerPhone,
            email: values.showSellerEmail,
            signature: values.showSignature,
          })
        },
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

  const tabItems = [
    {
      key: 'company',
      label: <span><BankOutlined /> ข้อมูลบริษัท</span>,
      children: (
        <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: 8 }}>
          <Row gutter={24}>
            {/* Logo */}
            <Col span={24}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                marginBottom: 24,
                padding: 16,
                background: '#fafafa',
                borderRadius: 8
              }}>
                <div style={{ textAlign: 'center' }}>
                  {logoUrl ? (
                    <div style={{ marginBottom: 12 }}>
                      <img 
                        src={logoUrl} 
                        alt="Logo" 
                        style={{ maxWidth: 200, maxHeight: 80 }} 
                      />
                    </div>
                  ) : (
                    <div style={{ 
                      width: 200, 
                      height: 80, 
                      border: '2px dashed #d9d9d9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 12,
                      borderRadius: 8
                    }}>
                      🏢 LOGO
                    </div>
                  )}
                  <Upload
                    accept="image/*"
                    showUploadList={false}
                    beforeUpload={handleUploadLogo}
                  >
                    <Button icon={<UploadOutlined />} loading={uploadingLogo}>
                      อัพโหลดโลโก้
                    </Button>
                  </Upload>
                  {logoUrl && (
                    <Button 
                      type="text" 
                      danger 
                      icon={<DeleteOutlined />}
                      onClick={() => setLogoUrl('')}
                      style={{ marginLeft: 8 }}
                    >
                      ลบ
                    </Button>
                  )}
                  <div style={{ fontSize: 12, color: '#888', marginTop: 8 }}>
                    แนะนำ: PNG/JPG ขนาด 200x80px พื้นหลังโปร่งใส
                  </div>
                </div>
              </div>
            </Col>

            {/* Thai */}
            <Col xs={24} md={12}>
              <Divider orientation="left">🇹🇭 ภาษาไทย</Divider>
              <Form.Item label="ชื่อบริษัท" name="companyNameTh">
                <Input placeholder="บริษัท ABC จำกัด" />
              </Form.Item>
              <Form.Item label="ที่อยู่ บรรทัด 1" name="address1Th">
                <Input placeholder="123/4-5 ซอยสมเด็จพระปิ่นเกล้า 9" />
              </Form.Item>
              <Form.Item label="ที่อยู่ บรรทัด 2" name="address2Th">
                <Input placeholder="ถ.สมเด็จพระปิ่นเกล้า" />
              </Form.Item>
              <Form.Item label="ที่อยู่ บรรทัด 3" name="address3Th">
                <Input placeholder="แขวงอรุณอมรินทร์ เขตบางกอกน้อย" />
              </Form.Item>
              <Form.Item label="ที่อยู่ บรรทัด 4" name="address4Th">
                <Input placeholder="กรุงเทพฯ 10700" />
              </Form.Item>
              <Form.Item label="โทรศัพท์" name="phoneTh">
                <Input placeholder="(662) 886-9200-7" />
              </Form.Item>
              <Form.Item label="แฟกซ์" name="faxTh">
                <Input placeholder="(662) 433-9168" />
              </Form.Item>
              <Form.Item label="เลขประจำตัวผู้เสียภาษี" name="taxIdTh">
                <Input placeholder="0105545053424" />
              </Form.Item>
            </Col>

            {/* English */}
            <Col xs={24} md={12}>
              <Divider orientation="left">🇬🇧 English</Divider>
              <Form.Item label="Company Name" name="companyNameEn">
                <Input placeholder="ABC Co., Ltd." />
              </Form.Item>
              <Form.Item label="Address Line 1" name="address1En">
                <Input placeholder="123/4-5 Soi Somdetphrapinklao 9" />
              </Form.Item>
              <Form.Item label="Address Line 2" name="address2En">
                <Input placeholder="Somdetphrapinklao Road" />
              </Form.Item>
              <Form.Item label="Address Line 3" name="address3En">
                <Input placeholder="Arun Amarin, Bangkoknoi, Bangkok 10700" />
              </Form.Item>
              <Form.Item label="Tel" name="phoneEn">
                <Input placeholder="(662) 886-9200-7" />
              </Form.Item>
              <Form.Item label="Fax" name="faxEn">
                <Input placeholder="(662) 433-9168" />
              </Form.Item>
              <Form.Item label="Tax ID" name="taxIdEn">
                <Input placeholder="015545053424" />
              </Form.Item>
            </Col>

            {/* Common */}
            <Col span={24}>
              <Divider orientation="left">📧 ข้อมูลทั่วไป</Divider>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="อีเมล" name="companyEmail">
                    <Input placeholder="info@company.co.th" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="แสดงในเอกสาร" name="displayLang">
                    <Checkbox.Group>
                      <Checkbox value="TH">ไทย</Checkbox>
                      <Checkbox value="EN">English</Checkbox>
                      <Checkbox value="BOTH">ทั้งสองภาษา</Checkbox>
                    </Checkbox.Group>
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: 'seller',
      label: <span><UserOutlined /> ผู้ขาย & ลายเซ็น</span>,
      children: (
        <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: 8 }}>
          <Row gutter={16}>
            <Col span={24}>
              <Divider orientation="left">👤 ข้อมูลผู้ขาย</Divider>
            </Col>
            <Col span={8}>
              <Form.Item label="ชื่อ" name="sellerName">
                <Input placeholder="สมชาย" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="นามสกุล" name="sellerSurname">
                <Input placeholder="ใจดี" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="ชื่อเล่น/ชื่อย่อ" name="sellerNickname">
                <Input placeholder="ชาย" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="เบอร์โทร" name="sellerPhone">
                <Input placeholder="081-xxx-xxxx" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="อีเมล" name="sellerEmail">
                <Input placeholder="somchai@company.com" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <div style={{ marginBottom: 16 }}>
                <span style={{ marginRight: 16 }}>แสดงในเอกสาร:</span>
                <Form.Item name="showFullName" valuePropName="checked" noStyle>
                  <Checkbox>ชื่อ-นามสกุลเต็ม</Checkbox>
                </Form.Item>
                <Form.Item name="showNickname" valuePropName="checked" noStyle>
                  <Checkbox>ชื่อย่อ</Checkbox>
                </Form.Item>
                <Form.Item name="showSellerPhone" valuePropName="checked" noStyle>
                  <Checkbox>เบอร์โทร</Checkbox>
                </Form.Item>
                <Form.Item name="showSellerEmail" valuePropName="checked" noStyle>
                  <Checkbox>อีเมล</Checkbox>
                </Form.Item>
              </div>
            </Col>

            <Col span={24}>
              <Divider orientation="left">✍️ ลายเซ็น</Divider>
            </Col>
            <Col span={12}>
              <div style={{ 
                border: '2px dashed #d9d9d9', 
                borderRadius: 8, 
                padding: 16,
                textAlign: 'center',
                minHeight: 120,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
              }}>
                {signatureUrl ? (
                  <img 
                    src={signatureUrl} 
                    alt="Signature" 
                    style={{ maxWidth: '100%', maxHeight: 80 }} 
                  />
                ) : (
                  <span style={{ color: '#888' }}>ยังไม่มีลายเซ็น</span>
                )}
              </div>
              <div style={{ marginTop: 12, textAlign: 'center' }}>
                <Upload
                  accept="image/*"
                  showUploadList={false}
                  beforeUpload={handleUploadSignature}
                >
                  <Button icon={<UploadOutlined />} loading={uploadingSignature}>
                    อัพโหลดลายเซ็น
                  </Button>
                </Upload>
                {signatureUrl && (
                  <Button 
                    type="text" 
                    danger 
                    icon={<DeleteOutlined />}
                    onClick={() => setSignatureUrl('')}
                    style={{ marginLeft: 8 }}
                  >
                    ลบ
                  </Button>
                )}
              </div>
            </Col>
            <Col span={12}>
              <Form.Item name="showSignature" valuePropName="checked">
                <Checkbox>แสดงลายเซ็นในเอกสาร</Checkbox>
              </Form.Item>
              <Form.Item label="ตำแหน่ง" name="signaturePosition">
                <Input placeholder="ผู้จัดทำ" />
              </Form.Item>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: 'defaults',
      label: <span><SettingOutlined /> ค่าเริ่มต้น</span>,
      children: (
        <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: 8 }}>
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
        </div>
      ),
    },
  ];

  return (
    <Modal
      title="⚙️ ตั้งค่าใบเสนอราคา"
      open={open}
      onCancel={onClose}
      width={900}
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
          <Tabs items={tabItems} />
        </Form>
      )}
    </Modal>
  );
};

export default SettingsModal;
