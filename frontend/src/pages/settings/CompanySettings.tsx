import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, message, Spin, Tabs, Upload, Image, Divider } from 'antd';
import { SaveOutlined, UploadOutlined } from '@ant-design/icons';
import { systemSettingsApi, uploadApi } from '../../services/api';



const CompanySettings: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [signatureUrl, setSignatureUrl] = useState<string>('');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingSignature, setUploadingSignature] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const [thRes, enRes, companyRes] = await Promise.all([
        systemSettingsApi.getByCategory('COMPANY_TH'),
        systemSettingsApi.getByCategory('COMPANY_EN'),
        systemSettingsApi.getByCategory('COMPANY'),
      ]);

      const allSettings = [...(thRes.data || []), ...(enRes.data || []), ...(companyRes.data || [])];
      const values: any = {};
      
      allSettings.forEach((s: any) => {
        values[s.settingKey] = s.settingValue;
        if (s.settingKey === 'COMPANY_LOGO_URL') setLogoUrl(s.settingValue);
        if (s.settingKey === 'COMPANY_SIGNATURE_URL') setSignatureUrl(s.settingValue);
      });

      form.setFieldsValue(values);
    } catch (error) {
      message.error('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const values = form.getFieldsValue();
      const updates = Object.entries(values).map(([key, value]) => ({
        key,
        value: value || '',
      }));

      await systemSettingsApi.updateBulk(updates);
      message.success('บันทึกสำเร็จ');
    } catch (error) {
      message.error('ไม่สามารถบันทึกได้');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadLogo = async (file: File) => {
    setUploadingLogo(true);
    try {
      const response = await uploadApi.uploadImage(file);
      const url = response.data.url;
      setLogoUrl(url);
      form.setFieldValue('COMPANY_LOGO_URL', url);
      message.success('อัพโหลดโลโก้สำเร็จ');
    } catch (error) {
      message.error('อัพโหลดไม่สำเร็จ');
    } finally {
      setUploadingLogo(false);
    }
    return false;
  };

  const handleUploadSignature = async (file: File) => {
    setUploadingSignature(true);
    try {
      const response = await uploadApi.uploadImage(file);
      const url = response.data.url;
      setSignatureUrl(url);
      form.setFieldValue('COMPANY_SIGNATURE_URL', url);
      message.success('อัพโหลดลายเซ็นสำเร็จ');
    } catch (error) {
      message.error('อัพโหลดไม่สำเร็จ');
    } finally {
      setUploadingSignature(false);
    }
    return false;
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>;
  }

  const tabItems = [
    {
      key: 'thai',
      label: '🇹🇭 ข้อมูลภาษาไทย',
      children: (
        <div>
          <Form.Item label="ชื่อบริษัท (ไทย)" name="COMPANY_NAME_TH">
            <Input placeholder="บริษัท แสงวิทย์ ซายน์ จำกัด" />
          </Form.Item>
          <Form.Item label="ที่อยู่บรรทัด 1 (ไทย)" name="COMPANY_ADDRESS1_TH">
            <Input placeholder="123/4-5 ซอยสมเด็จพระปิ่นเกล้า 9" />
          </Form.Item>
          <Form.Item label="ที่อยู่บรรทัด 2 (ไทย)" name="COMPANY_ADDRESS2_TH">
            <Input placeholder="แขวงอรุณอมรินทร์ เขตบางกอกน้อย" />
          </Form.Item>
          <Form.Item label="ที่อยู่บรรทัด 3 (ไทย)" name="COMPANY_ADDRESS3_TH">
            <Input placeholder="กรุงเทพฯ 10700" />
          </Form.Item>
          <Form.Item label="โทรศัพท์ (ไทย)" name="COMPANY_PHONE_TH">
            <Input placeholder="(662) 886-9200-7" />
          </Form.Item>
          <Form.Item label="แฟกซ์ (ไทย)" name="COMPANY_FAX_TH">
            <Input placeholder="(662) 433-9168" />
          </Form.Item>
          <Form.Item label="เลขประจำตัวผู้เสียภาษี (ไทย)" name="COMPANY_TAX_ID_TH">
            <Input placeholder="0105545053424" />
          </Form.Item>
        </div>
      ),
    },
    {
      key: 'english',
      label: '🇬🇧 ข้อมูลภาษาอังกฤษ',
      children: (
        <div>
          <Form.Item label="Company Name (EN)" name="COMPANY_NAME_EN">
            <Input placeholder="Saengvith Science Co.,Ltd." />
          </Form.Item>
          <Form.Item label="Address Line 1 (EN)" name="COMPANY_ADDRESS1_EN">
            <Input placeholder="123/4-5 Soi Somdetphrapinklao 9" />
          </Form.Item>
          <Form.Item label="Address Line 2 (EN)" name="COMPANY_ADDRESS2_EN">
            <Input placeholder="Arun Amarin, Bangkoknoi, Bangkok 10700 Thailand" />
          </Form.Item>
          <Form.Item label="Address Line 3 (EN)" name="COMPANY_ADDRESS3_EN">
            <Input placeholder="Somdetphrapinklao Road" />
          </Form.Item>
          <Form.Item label="Phone (EN)" name="COMPANY_PHONE_EN">
            <Input placeholder="(662) 886-9200-7" />
          </Form.Item>
          <Form.Item label="Fax (EN)" name="COMPANY_FAX_EN">
            <Input placeholder="(662) 433-9168" />
          </Form.Item>
          <Form.Item label="Tax ID (EN)" name="COMPANY_TAX_ID_EN">
            <Input placeholder="0105545053424" />
          </Form.Item>
        </div>
      ),
    },
    {
      key: 'general',
      label: '⚙️ ข้อมูลทั่วไป',
      children: (
        <div>
          <Form.Item label="อีเมล" name="COMPANY_EMAIL">
            <Input placeholder="info@saengvithscience.co.th" />
          </Form.Item>
          <Form.Item label="เลขประจำตัวผู้เสียภาษี" name="COMPANY_TAX_ID">
            <Input placeholder="0105545053424" />
          </Form.Item>
          
          <Divider>ข้อมูลกรรมการผู้จัดการ</Divider>
          
          <Form.Item label="ชื่อกรรมการผู้จัดการ" name="COMPANY_MD_NAME">
            <Input placeholder="นายวิทยา แซ่ตั้ง" />
          </Form.Item>
          <Form.Item label="ตำแหน่ง" name="COMPANY_MD_TITLE">
            <Input placeholder="กรรมการผู้จัดการ / Managing Director" />
          </Form.Item>
        </div>
      ),
    },
    {
      key: 'images',
      label: '🖼️ รูปภาพ',
      children: (
        <div>
          <Form.Item label="โลโก้บริษัท" name="COMPANY_LOGO_URL">
            <Input placeholder="URL ของโลโก้" style={{ marginBottom: 10 }} />
          </Form.Item>
          <div style={{ marginBottom: 20 }}>
            {logoUrl && (
              <div style={{ marginBottom: 10 }}>
                <Image src={logoUrl} alt="Company Logo" style={{ maxHeight: 100 }} />
              </div>
            )}
            <Upload
              beforeUpload={handleUploadLogo}
              showUploadList={false}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />} loading={uploadingLogo}>
                อัพโหลดโลโก้ใหม่
              </Button>
            </Upload>
          </div>

          <Divider />

          <Form.Item label="ลายเซ็นกรรมการผู้จัดการ" name="COMPANY_SIGNATURE_URL">
            <Input placeholder="URL ของลายเซ็น" style={{ marginBottom: 10 }} />
          </Form.Item>
          <div>
            {signatureUrl && (
              <div style={{ marginBottom: 10 }}>
                <Image src={signatureUrl} alt="MD Signature" style={{ maxHeight: 80 }} />
              </div>
            )}
            <Upload
              beforeUpload={handleUploadSignature}
              showUploadList={false}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />} loading={uploadingSignature}>
                อัพโหลดลายเซ็นใหม่
              </Button>
            </Upload>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 24 }}>🏢 ตั้งค่าข้อมูลบริษัท</h1>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          size="large"
          loading={saving}
          onClick={handleSave}
        >
          บันทึก
        </Button>
      </div>

      <Card>
        <Form form={form} layout="vertical">
          <Tabs items={tabItems} />
        </Form>
      </Card>
    </div>
  );
};

export default CompanySettings;
