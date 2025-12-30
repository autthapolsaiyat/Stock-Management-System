import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Avatar, Button, Form, Input, message, Divider, Tag } from 'antd';
import { UserOutlined, LockOutlined, ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { useBranding } from '../contexts/BrandingContext';
import api from '../services/api';

const BasicProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { systemName, systemLogo } = useBranding();
  const [passwordForm] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const handleChangePassword = async (values: any) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('รหัสผ่านใหม่ไม่ตรงกัน');
      return;
    }
    
    setSaving(true);
    try {
      await api.put('/api/auth/change-password', {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      message.success('เปลี่ยนรหัสผ่านสำเร็จ');
      passwordForm.resetFields();
      setShowPasswordForm(false);
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เปลี่ยนรหัสผ่านไม่สำเร็จ');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      {/* Header */}
      <div style={{ 
        width: '100%', 
        maxWidth: 500, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: 20,
      }}>
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/intro')}
          style={{ color: '#fff' }}
        >
          กลับ
        </Button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {systemLogo && <img src={systemLogo} alt="logo" style={{ height: 32 }} />}
          <span style={{ color: '#fff', fontWeight: 600 }}>{systemName}</span>
        </div>
        <div style={{ width: 60 }} />
      </div>

      {/* Profile Card */}
      <Card 
        style={{ 
          width: '100%', 
          maxWidth: 500, 
          borderRadius: 20,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
      >
        {/* Avatar & Info */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Avatar 
            size={100} 
            icon={<UserOutlined />}
            style={{ 
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              marginBottom: 16,
            }}
          />
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>
            {user?.fullName || 'ผู้ใช้งาน'}
          </h2>
          <p style={{ color: '#6b7280', margin: '4px 0 12px' }}>
            @{user?.username}
          </p>
          <Tag color="purple">BASIC</Tag>
        </div>

        <Divider />

        {/* User Info */}
        <div style={{ marginBottom: 24 }}>
          <h4 style={{ marginBottom: 12, color: '#374151' }}>📋 ข้อมูลส่วนตัว</h4>
          
          <div style={{ 
            background: '#f9fafb', 
            borderRadius: 12, 
            padding: 16,
          }}>
            <div style={{ marginBottom: 12 }}>
              <span style={{ color: '#6b7280', fontSize: 12 }}>ชื่อ-นามสกุล</span>
              <div style={{ fontWeight: 500 }}>{user?.fullName || '-'}</div>
            </div>
            
            <div style={{ marginBottom: 12 }}>
              <span style={{ color: '#6b7280', fontSize: 12 }}>ชื่อผู้ใช้</span>
              <div style={{ fontWeight: 500 }}>{user?.username || '-'}</div>
            </div>
            
            <div>
              <span style={{ color: '#6b7280', fontSize: 12 }}>อีเมล</span>
              <div style={{ fontWeight: 500 }}>{user?.email || '-'}</div>
            </div>
          </div>
        </div>

        <Divider />

        {/* Change Password Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h4 style={{ margin: 0, color: '#374151' }}>🔒 เปลี่ยนรหัสผ่าน</h4>
            {!showPasswordForm && (
              <Button 
                type="link" 
                onClick={() => setShowPasswordForm(true)}
                icon={<LockOutlined />}
              >
                เปลี่ยน
              </Button>
            )}
          </div>

          {showPasswordForm && (
            <Form
              form={passwordForm}
              layout="vertical"
              onFinish={handleChangePassword}
              style={{ 
                background: '#f9fafb', 
                borderRadius: 12, 
                padding: 16,
              }}
            >
              <Form.Item
                name="currentPassword"
                label="รหัสผ่านปัจจุบัน"
                rules={[{ required: true, message: 'กรุณากรอกรหัสผ่านปัจจุบัน' }]}
              >
                <Input.Password placeholder="รหัสผ่านปัจจุบัน" />
              </Form.Item>

              <Form.Item
                name="newPassword"
                label="รหัสผ่านใหม่"
                rules={[
                  { required: true, message: 'กรุณากรอกรหัสผ่านใหม่' },
                  { min: 6, message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' },
                ]}
              >
                <Input.Password placeholder="รหัสผ่านใหม่" />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="ยืนยันรหัสผ่านใหม่"
                rules={[{ required: true, message: 'กรุณายืนยันรหัสผ่านใหม่' }]}
              >
                <Input.Password placeholder="ยืนยันรหัสผ่านใหม่" />
              </Form.Item>

              <div style={{ display: 'flex', gap: 8 }}>
                <Button 
                  onClick={() => {
                    setShowPasswordForm(false);
                    passwordForm.resetFields();
                  }}
                  style={{ flex: 1 }}
                >
                  ยกเลิก
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={saving}
                  icon={<SaveOutlined />}
                  style={{ 
                    flex: 1,
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    border: 'none',
                  }}
                >
                  บันทึก
                </Button>
              </div>
            </Form>
          )}
        </div>
      </Card>

      {/* Footer */}
      <div style={{ 
        marginTop: 20, 
        color: 'rgba(255,255,255,0.6)', 
        fontSize: 12,
        textAlign: 'center',
      }}>
        © {new Date().getFullYear()} {systemName}
      </div>
    </div>
  );
};

export default BasicProfilePage;
