import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    const success = await login(values.username, values.password);
    setLoading(false);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div
      className="bg-hologram bg-grid"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <Card
        className="card-holo"
        style={{
          width: '100%',
          maxWidth: 420,
          padding: '20px 10px',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1
            className="text-gradient"
            style={{
              fontSize: 36,
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            SVS Stock
          </h1>
          <p style={{ color: '#9ca3af', fontSize: 14 }}>
            ระบบจัดการคลังสินค้า
          </p>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          size="large"
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'กรุณากรอกชื่อผู้ใช้' }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#9ca3af' }} />}
              placeholder="ชื่อผู้ใช้"
              className="input-holo"
              style={{
                background: 'rgba(15,23,42,0.8)',
                borderColor: 'rgba(148,163,184,0.4)',
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'กรุณากรอกรหัสผ่าน' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
              placeholder="รหัสผ่าน"
              className="input-holo"
              style={{
                background: 'rgba(15,23,42,0.8)',
                borderColor: 'rgba(148,163,184,0.4)',
              }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="btn-holo"
              style={{ height: 48 }}
            >
              เข้าสู่ระบบ
            </Button>
          </Form.Item>
        </Form>

        {/* Demo credentials */}
        <div
          style={{
            marginTop: 24,
            padding: 16,
            background: 'rgba(34,211,238,0.1)',
            borderRadius: 8,
            border: '1px solid rgba(34,211,238,0.3)',
          }}
        >
          <p style={{ color: '#67e8f9', fontSize: 12, marginBottom: 4 }}>
            Demo Account:
          </p>
          <p style={{ color: '#9ca3af', fontSize: 12, margin: 0 }}>
            Username: <strong style={{ color: '#e5e7eb' }}>admin</strong> | 
            Password: <strong style={{ color: '#e5e7eb' }}>admin123</strong>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
