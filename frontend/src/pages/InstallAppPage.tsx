import React, { useEffect, useState } from 'react';
import { Card, Typography, Button, Space, Divider, Row, Col, Steps, Tag, Modal, Spin } from 'antd';
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
  CheckCircleOutlined
} from '@ant-design/icons';
import { QRCodeSVG } from 'qrcode.react';

const { Title, Text } = Typography;

const APP_URL = 'https://witty-mushroom-0d3c50600.3.azurestaticapps.net';

// Store the install prompt globally
let deferredPrompt: any = null;

const InstallAppPage: React.FC = () => {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed (standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone === true;
    setIsStandalone(standalone);
    
    if (standalone) {
      setIsInstalled(true);
      // Redirect to home after 2 seconds if already installed
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
      return;
    }

    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e;
      setCanInstall(true);
      
      // Auto trigger install prompt after a short delay
      setTimeout(() => {
        handleInstallClick();
      }, 1000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setCanInstall(false);
      deferredPrompt = null;
    });

    // Check if prompt was already captured
    if (deferredPrompt) {
      setCanInstall(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    setIsInstalling(true);
    
    try {
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user's response
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
    } catch (err) {
      console.error('Install error:', err);
    } finally {
      setIsInstalling(false);
      deferredPrompt = null;
      setCanInstall(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SVS Business Suite',
          text: 'ติดตั้งแอป SVS Business Suite',
          url: APP_URL + '/install',
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(APP_URL + '/install');
      Modal.success({
        title: 'คัดลอก URL แล้ว!',
        content: APP_URL + '/install',
      });
    }
  };

  // Show success screen if already installed
  if (isInstalled || isStandalone) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e1b4b 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
      }}>
        <Card style={{ 
          background: 'rgba(255,255,255,0.95)',
          borderRadius: 24,
          textAlign: 'center',
          maxWidth: 400
        }}>
          <CheckCircleOutlined style={{ fontSize: 80, color: '#10b981', marginBottom: 20 }} />
          <Title level={2} style={{ color: '#10b981', margin: 0 }}>
            ติดตั้งสำเร็จ!
          </Title>
          <Text style={{ fontSize: 16, display: 'block', marginTop: 16 }}>
            แอป SVS Business Suite พร้อมใช้งานแล้ว
          </Text>
          <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
            กำลังเปิดแอป...
          </Text>
          <Spin style={{ marginTop: 20 }} />
        </Card>
      </div>
    );
  }

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
            SVS Business Suite
          </Title>
          <Text style={{ color: '#9ca3af', fontSize: 16 }}>
            Saengvith Science Co., Ltd.
          </Text>
        </div>

        {/* Install Button Card - Show prominently if can install */}
        {canInstall && (
          <Card
            style={{ 
              background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
              borderRadius: 24,
              textAlign: 'center',
              marginBottom: 24,
              border: 'none'
            }}
          >
            <DownloadOutlined style={{ fontSize: 48, color: '#fff', marginBottom: 16 }} />
            <Title level={3} style={{ color: '#fff', marginBottom: 8 }}>
              พร้อมติดตั้งแล้ว!
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.9)', display: 'block', marginBottom: 20 }}>
              กดปุ่มด้านล่างเพื่อติดตั้งแอปลงอุปกรณ์
            </Text>
            <Button 
              type="primary" 
              size="large"
              icon={<DownloadOutlined />}
              onClick={handleInstallClick}
              loading={isInstalling}
              style={{ 
                borderRadius: 20, 
                height: 50, 
                paddingInline: 40,
                fontSize: 18,
                background: '#fff',
                color: '#7c3aed',
                border: 'none',
                fontWeight: 600
              }}
            >
              {isInstalling ? 'กำลังติดตั้ง...' : 'ติดตั้งแอป'}
            </Button>
          </Card>
        )}

        {/* iOS Instructions - Show if iOS device */}
        {isIOS && !canInstall && (
          <Card
            style={{ 
              background: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
              borderRadius: 24,
              textAlign: 'center',
              marginBottom: 24,
              border: 'none'
            }}
          >
            <AppleOutlined style={{ fontSize: 48, color: '#fff', marginBottom: 16 }} />
            <Title level={3} style={{ color: '#fff', marginBottom: 8 }}>
              วิธีติดตั้งบน iPhone/iPad
            </Title>
            <div style={{ textAlign: 'left', color: '#fff', padding: '0 20px' }}>
              <p>1. กดปุ่ม <ShareAltOutlined /> Share ด้านล่าง Safari</p>
              <p>2. เลื่อนหา <PlusSquareOutlined /> "Add to Home Screen"</p>
              <p>3. กด "Add" ที่มุมขวาบน</p>
            </div>
          </Card>
        )}

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
            {canInstall ? 'แชร์ให้เพื่อนร่วมงาน' : 'สแกนเพื่อติดตั้งแอป'}
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
              value={APP_URL + '/install'}
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
            {canInstall && (
              <Button 
                icon={<DownloadOutlined />}
                size="large"
                onClick={handleInstallClick}
                loading={isInstalling}
                style={{ borderRadius: 20 }}
              >
                ติดตั้งแอป
              </Button>
            )}
          </Space>

          <Divider />

          <Text copyable={{ text: APP_URL + '/install' }} style={{ fontSize: 14 }}>
            {APP_URL}/install
          </Text>
        </Card>

        {/* Installation Instructions - Only show if can't auto-install */}
        {!canInstall && (
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
        )}

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
              📴 ใช้งาน Offline ได้
            </Tag>
            <Tag color="green" style={{ padding: '5px 15px', fontSize: 14 }}>
              🚀 เปิดเร็วเหมือน Native App
            </Tag>
            <Tag color="orange" style={{ padding: '5px 15px', fontSize: 14 }}>
              🔄 อัพเดทอัตโนมัติ
            </Tag>
            <Tag color="cyan" style={{ padding: '5px 15px', fontSize: 14 }}>
              🔒 ปลอดภัย HTTPS
            </Tag>
          </Space>
        </Card>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Text style={{ color: '#6b7280' }}>
            Developed by Boy © Autthapol Saiyat
          </Text>
        </div>
      </div>
    </div>
  );
};

export default InstallAppPage;
