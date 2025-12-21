import { useState, useEffect } from 'react';
import { Card, Form, Input, Button, message, Avatar, Divider, Space, Tag, Spin } from 'antd';
import { UserOutlined, KeyOutlined, SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const { TextArea } = Input;

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/user-settings/profile');
      profileForm.setFieldsValue(res.data);
    } catch (error) {
      // Use default from user context
      profileForm.setFieldsValue({
        position: '',
        department: '',
        phone: '',
        skills: '',
        achievements: '',
      });
    }
    setLoading(false);
  };

  const handleSaveProfile = async (values: any) => {
    setSaving(true);
    try {
      await api.put('/api/user-settings/profile', values);
      message.success('บันทึกข้อมูลสำเร็จ');
      if (refreshUser) refreshUser();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
    setSaving(false);
  };

  const handleChangePassword = async (values: any) => {
    setLoading(true);
    try {
      await api.put('/api/auth/change-password', {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      message.success('เปลี่ยนรหัสผ่านสำเร็จ');
      passwordForm.resetFields();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'รหัสผ่านปัจจุบันไม่ถูกต้อง');
    }
    setLoading(false);
  };

  const roleColors: Record<string, string> = {
    ADMIN: 'red',
    MANAGER: 'purple',
    SALES: 'blue',
    SALES_STANDARD: 'cyan',
    SALES_FORENSIC: 'geekblue',
    SALES_TOOLLAB: 'lime',
    SALES_MAINTENANCE: 'orange',
    WAREHOUSE: 'green',
    PURCHASING: 'gold',
    ACCOUNTING: 'magenta',
    VIEWER: 'default',
  };

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      {/* Back Button */}
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/intro')}
        style={{ marginBottom: 16 }}
      >
        กลับหน้าหลัก
      </Button>

      {/* Profile Header */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Avatar 
            size={80} 
            icon={<UserOutlined />}
            style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
          />
          <div>
            <h2 style={{ margin: 0, fontSize: 24 }}>{user?.fullName}</h2>
            <p style={{ margin: '4px 0', color: '#6b7280' }}>@{user?.username}</p>
            <Space>
              {user?.roles?.map((role: string) => (
                <Tag key={role} color={roleColors[role] || 'default'}>{role}</Tag>
              ))}
            </Space>
          </div>
        </div>
      </Card>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}><Spin size="large" /></div>
      ) : (
        <>
          {/* Profile Info */}
          <Card title="📋 ข้อมูลส่วนตัว (แสดงในนามบัตร)" style={{ marginBottom: 24 }}>
            <Form
              form={profileForm}
              layout="vertical"
              onFinish={handleSaveProfile}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Form.Item name="position" label="ตำแหน่ง">
                  <Input placeholder="เช่น Sales Executive, Manager" />
                </Form.Item>
                <Form.Item name="department" label="แผนก">
                  <Input placeholder="เช่น ฝ่ายขาย, ฝ่ายบัญชี" />
                </Form.Item>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Form.Item name="phone" label="เบอร์โทรศัพท์">
                  <Input placeholder="0xx-xxx-xxxx" />
                </Form.Item>
                <Form.Item name="startDate" label="วันที่เริ่มงาน">
                  <Input placeholder="เช่น 15 ธ.ค. 2551" />
                </Form.Item>
              </div>

              <Divider>ข้อมูลสำหรับด้านหลังนามบัตร</Divider>

              <Form.Item 
                name="skills" 
                label="💡 ความเชี่ยวชาญ / รายการผ่านการเทรน"
                extra="ใส่หลายรายการคั่นด้วยเครื่องหมาย , (comma)"
              >
                <TextArea 
                  rows={3} 
                  placeholder="เช่น Sales, Customer Service, Product Knowledge, ISO 9001"
                />
              </Form.Item>

              <Form.Item 
                name="achievements" 
                label="🏆 ผลงานที่ผ่านมา"
                extra="ใส่หลายรายการคั่นด้วยเครื่องหมาย , (comma)"
              >
                <TextArea 
                  rows={3} 
                  placeholder="เช่น Top Sales 2023, Customer Satisfaction Award, ยอดขาย 10 ล้าน"
                />
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={saving}
                  icon={<SaveOutlined />}
                >
                  บันทึกข้อมูล
                </Button>
              </Form.Item>
            </Form>
          </Card>

          {/* Change Password */}
          <Card title={<><KeyOutlined /> เปลี่ยนรหัสผ่าน</>}>
            <Form
              form={passwordForm}
              layout="vertical"
              onFinish={handleChangePassword}
              style={{ maxWidth: 400 }}
            >
              <Form.Item
                name="currentPassword"
                label="รหัสผ่านปัจจุบัน"
                rules={[{ required: true, message: 'กรุณาระบุรหัสผ่านปัจจุบัน' }]}
              >
                <Input.Password placeholder="รหัสผ่านปัจจุบัน" />
              </Form.Item>

              <Divider />

              <Form.Item
                name="newPassword"
                label="รหัสผ่านใหม่"
                rules={[
                  { required: true, message: 'กรุณาระบุรหัสผ่านใหม่' },
                  { min: 6, message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' },
                ]}
              >
                <Input.Password placeholder="รหัสผ่านใหม่ (อย่างน้อย 6 ตัวอักษร)" />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="ยืนยันรหัสผ่านใหม่"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'กรุณายืนยันรหัสผ่านใหม่' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('รหัสผ่านไม่ตรงกัน'));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="ยืนยันรหัสผ่านใหม่" />
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  icon={<SaveOutlined />}
                >
                  เปลี่ยนรหัสผ่าน
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
