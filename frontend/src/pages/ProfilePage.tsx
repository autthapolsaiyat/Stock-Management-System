import { useState } from 'react';
import { Card, Form, Input, Button, message, Avatar, Descriptions, Divider, Space, Tag } from 'antd';
import { UserOutlined, KeyOutlined, MailOutlined, SaveOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const ProfilePage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [passwordForm] = Form.useForm();

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
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      {/* Profile Info */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24 }}>
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

        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label={<><MailOutlined /> อีเมล</>}>
            {user?.email || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="ประเภทใบเสนอราคา">
            {user?.quotationType || 'ไม่ระบุ'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Change Password */}
      <Card 
        title={<><KeyOutlined /> เปลี่ยนรหัสผ่าน</>}
      >
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
    </div>
  );
};

export default ProfilePage;
