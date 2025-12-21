import React from 'react';
import { Card, Typography, Button, Space, Divider, Row, Col, Steps, Tag } from 'antd';
import { 
  QrcodeOutlined, 
  MobileOutlined, 
  AppleOutlined, 
  AndroidOutlined,
  WindowsOutlined,
  ChromeOutlined,
  DownloadOutlined,
  ShareAltOutlined,
  PlusSquareOutlined,
  CheckCircleOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  SyncOutlined,
  RocketOutlined
} from '@ant-design/icons';
import { QRCodeSVG } from 'qrcode.react';

const { Title, Text } = Typography;

const APP_URL = 'https://witty-mushroom-0d3c50600.3.azurestaticapps.net';

const InstallAppPage: React.FC = () => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SVS Stock Management System',
          text: 'ติดตั้งแอป SVS Stock เพื่อจัดการสต็อกสินค้า',
          url: APP_URL,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(APP_URL);
      alert('คัดลอก URL แล้ว!');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e1b4b 100%)',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <img 
            src="/icons/icon-192x192.png" 
            alt="SVS Stock" 
            style={{ width: 100, height: 100, marginBottom: 20 }}
          />
          <Title level={2} style={{ color: '#fff', margin: 0 }}>
            SVS Stock Management System
          </Title>
          <Text style={{ color: '#9ca3af', fontSize: 16 }}>
            ระบบจัดการสต็อกสินค้า
          </Text>
        </div>

        {/* QR Code Card */}
        <Card
          style={{ 
            background: 'rgba(255,255,255,0.95)',
            borderRadius: 24,
            textAlign: 'center',
            marginBottom: 24
          }}
        >
          <Title level={3} style={{ marginBottom: 8 }}>
            <QrcodeOutlined style={{ marginRight: 8, color: '#7c3aed' }} />
            สแกนเพื่อติดตั้งแอป
          </Title>
          <Text type="secondary">
            ใช้กล้องมือถือสแกน QR Code นี้
          </Text>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            margin: '30px 0',
            padding: 20,
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 4px 20px rgba(124,58,237,0.15)'
          }}>
            <QRCodeSVG 
              value={APP_URL}
              size={220}
              level="H"
              includeMargin
              imageSettings={{
                src: '/icons/icon-72x72.png',
                height: 40,
                width: 40,
                excavate: true,
              }}
              style={{ borderRadius: 8 }}
            />
          </div>

          <Space>
            <Button 
              type="primary" 
              icon={<ShareAltOutlined />}
              size="large"
              onClick={handleShare}
              style={{ borderRadius: 20 }}
            >
              แชร์ลิงก์
            </Button>
            <Button 
              icon={<DownloadOutlined />}
              size="large"
              onClick={() => window.open(APP_URL, '_blank')}
              style={{ borderRadius: 20 }}
            >
              เปิดเว็บ
            </Button>
          </Space>

          <Divider />

          <Text copyable={{ text: APP_URL }} style={{ fontSize: 14 }}>
            {APP_URL}
          </Text>
        </Card>

        {/* Installation Instructions */}
        <Row gutter={[16, 16]}>
          {/* iOS */}
          <Col xs={24} md={8}>
            <Card
              title={
                <Space>
                  <AppleOutlined style={{ fontSize: 24 }} />
                  <span>iPhone / iPad</span>
                </Space>
              }
              style={{ 
                background: 'rgba(255,255,255,0.95)',
                borderRadius: 16,
                height: '100%'
              }}
            >
              <Steps
                direction="vertical"
                size="small"
                current={-1}
                items={[
                  { 
                    title: 'เปิด Safari',
                    description: 'สแกน QR Code ด้วยกล้อง'
                  },
                  { 
                    title: 'กดปุ่ม Share',
                    description: <ShareAltOutlined style={{ fontSize: 18 }} />
                  },
                  { 
                    title: 'Add to Home Screen',
                    description: <PlusSquareOutlined style={{ fontSize: 18 }} />
                  },
                  { 
                    title: 'กด Add',
                    description: <CheckCircleOutlined style={{ color: '#10b981' }} />
                  },
                ]}
              />
            </Card>
          </Col>

          {/* Android */}
          <Col xs={24} md={8}>
            <Card
              title={
                <Space>
                  <AndroidOutlined style={{ fontSize: 24, color: '#3ddc84' }} />
                  <span>Android</span>
                </Space>
              }
              style={{ 
                background: 'rgba(255,255,255,0.95)',
                borderRadius: 16,
                height: '100%'
              }}
            >
              <Steps
                direction="vertical"
                size="small"
                current={-1}
                items={[
                  { 
                    title: 'เปิด Chrome',
                    description: 'สแกน QR Code ด้วยกล้อง'
                  },
                  { 
                    title: 'กดเมนู ⋮',
                    description: 'มุมขวาบน'
                  },
                  { 
                    title: 'Install App',
                    description: 'หรือ Add to Home screen'
                  },
                  { 
                    title: 'กด Install',
                    description: <CheckCircleOutlined style={{ color: '#10b981' }} />
                  },
                ]}
              />
            </Card>
          </Col>

          {/* Desktop */}
          <Col xs={24} md={8}>
            <Card
              title={
                <Space>
                  <WindowsOutlined style={{ fontSize: 24, color: '#0078d4' }} />
                  <span>Windows / Mac</span>
                </Space>
              }
              style={{ 
                background: 'rgba(255,255,255,0.95)',
                borderRadius: 16,
                height: '100%'
              }}
            >
              <Steps
                direction="vertical"
                size="small"
                current={-1}
                items={[
                  { 
                    title: 'เปิด Chrome',
                    description: <ChromeOutlined style={{ fontSize: 18 }} />
                  },
                  { 
                    title: 'ไปที่เว็บไซต์',
                    description: 'พิมพ์ URL หรือสแกน QR'
                  },
                  { 
                    title: 'กดไอคอน ⊕',
                    description: 'ใน Address bar ขวามือ'
                  },
                  { 
                    title: 'กด Install',
                    description: <CheckCircleOutlined style={{ color: '#10b981' }} />
                  },
                ]}
              />
            </Card>
          </Col>
        </Row>

        {/* Features */}
        <Card
          style={{ 
            background: 'rgba(255,255,255,0.95)',
            borderRadius: 16,
            marginTop: 24,
            textAlign: 'center'
          }}
        >
          <Title level={4}>✨ คุณสมบัติของแอป</Title>
          <Space wrap style={{ justifyContent: 'center' }}>
            <Tag color="purple" style={{ padding: '5px 15px', fontSize: 14 }}>
              <MobileOutlined /> ใช้งานได้ทุกอุปกรณ์
            </Tag>
            <Tag color="blue" style={{ padding: '5px 15px', fontSize: 14 }}>
              <ThunderboltOutlined /> เปิดเร็ว (Cache ในเครื่อง)
            </Tag>
            <Tag color="green" style={{ padding: '5px 15px', fontSize: 14 }}>
              <RocketOutlined /> เหมือน Native App
            </Tag>
            <Tag color="orange" style={{ padding: '5px 15px', fontSize: 14 }}>
              <SyncOutlined /> อัพเดทอัตโนมัติ
            </Tag>
            <Tag color="cyan" style={{ padding: '5px 15px', fontSize: 14 }}>
              <SafetyOutlined /> ปลอดภัย HTTPS
            </Tag>
          </Space>
        </Card>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Text style={{ color: '#6b7280' }}>
            © 2025 SVS Stock Management System
          </Text>
        </div>
      </div>
    </div>
  );
};

export default InstallAppPage;
