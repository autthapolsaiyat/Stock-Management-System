import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Modal, QRCode, Space, Switch, message } from 'antd';
import { 
  UserOutlined, 
  EnvironmentOutlined, 
  FileTextOutlined,
  ShareAltOutlined,
  CopyOutlined,
  EditOutlined,
  ExperimentOutlined,
  ToolOutlined,
  SafetyCertificateOutlined,
  AppstoreOutlined,
  InboxOutlined,
  ExportOutlined,
  SwapOutlined,
  DollarOutlined,
  BarChartOutlined,
  SunOutlined,
  MoonOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

const IntroPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  
  // Role-based permissions
  const userRole = user?.roles?.[0] || 'sales';
  const salesTypes: string[] = ['PT', 'FORENSIC', 'MAINTENANCE', 'EQUIPMENT'];
  
  const isSales = ['sales', 'admin'].includes(userRole);
  const isStock = ['stock', 'admin'].includes(userRole);
  const isAccounting = ['accounting', 'admin'].includes(userRole);
  const isAdmin = userRole === 'admin';

  // Sales type configs
  const salesTypeConfig = {
    PT: { icon: <ExperimentOutlined />, label: 'Accustandard/PT', color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' },
    FORENSIC: { icon: <SafetyCertificateOutlined />, label: 'นิติวิทยาศาสตร์', color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' },
    MAINTENANCE: { icon: <ToolOutlined />, label: 'บำรุงรักษา', color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
    EQUIPMENT: { icon: <AppstoreOutlined />, label: 'เครื่องมือวิทยาศาสตร์', color: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #059669)' },
  };

  // Digital Business Card data
  const businessCard = {
    name: user?.fullName || 'สุนิสา แก้ววิเศษ',
    position: 'Sales Executive',
    department: 'ฝ่ายขาย',
    phone: '085-070-9938',
    email: user?.email || 'sunisa@saengvith.co.th',
    company: 'บริษัท แสงวิทย์ ซายน์ จำกัด',
    address: '123/4-5 ซอยสมเด็จพระปิ่นเกล้า 9 ถ.สมเด็จพระปิ่นเกล้า แขวงอรุณอมรินทร์ เขตบางกอกน้อย กรุงเทพฯ 10700',
    website: 'www.saengvithscience.co.th',
    startDate: '15 ธ.ค. 2551',
    experience: '17 ปี',
    skills: ['Sales', 'Customer Service', 'Product Knowledge'],
    achievements: ['Top Sales 2023', 'Customer Satisfaction Award'],
  };

  const vCardData = `BEGIN:VCARD
VERSION:3.0
N:${businessCard.name}
FN:${businessCard.name}
ORG:${businessCard.company}
TITLE:${businessCard.position}
TEL:${businessCard.phone}
EMAIL:${businessCard.email}
URL:${businessCard.website}
END:VCARD`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${businessCard.name}\n${businessCard.position}\n${businessCard.phone}\n${businessCard.email}`);
    message.success('คัดลอกข้อมูลแล้ว');
  };

  const shareCard = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: businessCard.name,
          text: `${businessCard.name}\n${businessCard.position}\n${businessCard.phone}\n${businessCard.email}`,
        });
      } catch (err) {
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: darkMode 
        ? 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)'
        : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '20px',
      transition: 'all 0.3s ease',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40,
        padding: '0 20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <img 
            src="/logo.png" 
            alt="SVS" 
            style={{ height: 50, filter: darkMode ? 'brightness(1.2)' : 'none' }}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <h1 style={{ 
            margin: 0, 
            fontSize: 28, 
            fontWeight: 700,
            background: 'linear-gradient(135deg, #22d3ee, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            SVS Stock
          </h1>
        </div>
        
        <Space size="large">
          <Switch
            checked={darkMode}
            onChange={setDarkMode}
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
          />
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 12,
            color: darkMode ? '#fff' : '#1f2937',
          }}>
            <Avatar 
              size={44} 
              icon={<UserOutlined />}
              style={{ 
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                cursor: 'pointer',
              }}
              onClick={() => setProfileModalOpen(true)}
            />
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{businessCard.name}</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>{businessCard.position}</div>
            </div>
          </div>
        </Space>
      </div>

      {/* Welcome */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <h2 style={{ 
          fontSize: 32, 
          fontWeight: 300,
          color: darkMode ? '#fff' : '#1f2937',
          marginBottom: 8,
        }}>
          สวัสดี, <span style={{ fontWeight: 600 }}>{user?.fullName?.split(' ')[0] || 'คุณ'}!</span> 👋
        </h2>
        <p style={{ 
          fontSize: 16, 
          color: darkMode ? 'rgba(255,255,255,0.6)' : '#6b7280',
        }}>
          เลือกสิ่งที่ต้องการทำวันนี้
        </p>
      </div>

      {/* Main Cards */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 24,
        flexWrap: 'wrap',
        marginBottom: 48,
        padding: '0 20px',
      }}>
        {/* Card 1: Profile */}
        <div 
          onClick={() => setProfileModalOpen(true)}
          style={{
            width: 280,
            padding: 32,
            borderRadius: 24,
            background: darkMode 
              ? 'rgba(255,255,255,0.05)'
              : 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(20px)',
            border: darkMode 
              ? '1px solid rgba(255,255,255,0.1)'
              : '1px solid rgba(0,0,0,0.1)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textAlign: 'center',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(59,130,246,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: 36,
            color: '#fff',
          }}>
            <UserOutlined />
          </div>
          <h3 style={{ 
            fontSize: 20, 
            fontWeight: 600, 
            color: darkMode ? '#fff' : '#1f2937',
            marginBottom: 8,
          }}>
            โปรไฟล์ของฉัน
          </h3>
          <p style={{ 
            fontSize: 14, 
            color: darkMode ? 'rgba(255,255,255,0.6)' : '#6b7280',
            marginBottom: 16,
          }}>
            ดูและแก้ไขข้อมูลส่วนตัว
          </p>
          <div style={{
            padding: '8px 16px',
            borderRadius: 20,
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            color: '#fff',
            fontSize: 13,
            fontWeight: 500,
          }}>
            📱 แชร์นามบัตร
          </div>
        </div>

        {/* Card 2: Check-in */}
        <div 
          onClick={() => message.info('🚧 กำลังพัฒนา - เร็วๆ นี้!')}
          style={{
            width: 280,
            padding: 32,
            borderRadius: 24,
            background: darkMode 
              ? 'rgba(255,255,255,0.05)'
              : 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(20px)',
            border: darkMode 
              ? '1px solid rgba(255,255,255,0.1)'
              : '1px solid rgba(0,0,0,0.1)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textAlign: 'center',
            position: 'relative',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(16,185,129,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{
            position: 'absolute',
            top: 16,
            right: 16,
            padding: '4px 12px',
            borderRadius: 12,
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: '#fff',
            fontSize: 11,
            fontWeight: 600,
          }}>
            เร็วๆ นี้
          </div>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: 36,
            color: '#fff',
          }}>
            <EnvironmentOutlined />
          </div>
          <h3 style={{ 
            fontSize: 20, 
            fontWeight: 600, 
            color: darkMode ? '#fff' : '#1f2937',
            marginBottom: 8,
          }}>
            เช็คอิน
          </h3>
          <p style={{ 
            fontSize: 14, 
            color: darkMode ? 'rgba(255,255,255,0.6)' : '#6b7280',
          }}>
            บันทึกเวลาเข้า-ออกงาน
          </p>
        </div>

        {/* Card 3: Create Quotation (Sales Only) */}
        {isSales && (
          <div 
            style={{
              width: 320,
              padding: 32,
              borderRadius: 24,
              background: darkMode 
                ? 'rgba(255,255,255,0.05)'
                : 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(20px)',
              border: darkMode 
                ? '1px solid rgba(255,255,255,0.1)'
                : '1px solid rgba(0,0,0,0.1)',
              textAlign: 'center',
            }}
          >
            <div style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: 36,
              color: '#fff',
            }}>
              <FileTextOutlined />
            </div>
            <h3 style={{ 
              fontSize: 20, 
              fontWeight: 600, 
              color: darkMode ? '#fff' : '#1f2937',
              marginBottom: 16,
            }}>
              สร้างใบเสนอราคา
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 12,
            }}>
              {(isAdmin ? Object.keys(salesTypeConfig) : salesTypes).map((type: string) => {
                const config = salesTypeConfig[type as keyof typeof salesTypeConfig];
                if (!config) return null;
                return (
                  <Button
                    key={type}
                    onClick={() => navigate(`/quotations/new?type=${type}`)}
                    style={{
                      height: 'auto',
                      padding: '12px 8px',
                      borderRadius: 12,
                      background: config.gradient,
                      border: 'none',
                      color: '#fff',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <span style={{ fontSize: 20 }}>{config.icon}</span>
                    <span style={{ fontSize: 11, fontWeight: 500 }}>{config.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </div>


        {/* Card 4: Super Admin (Admin Only) */}
        {isAdmin && (
          <div 
            onClick={() => navigate('/admin/users')}
            style={{
              width: 320,
              padding: 32,
              borderRadius: 24,
              background: darkMode 
                ? 'rgba(255,255,255,0.05)'
                : 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(20px)',
              border: darkMode 
                ? '1px solid rgba(255,255,255,0.1)'
                : '1px solid rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'center',
              position: 'relative',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(239,68,68,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{
              position: 'absolute',
              top: 16,
              right: 16,
              padding: '4px 12px',
              borderRadius: 12,
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: '#fff',
              fontSize: 11,
              fontWeight: 600,
            }}>
              Admin
            </div>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: 36,
              color: '#fff',
            }}>
              <SafetyOutlined />
            </div>
            <h3 style={{ 
              fontSize: 20, 
              fontWeight: 600, 
              color: darkMode ? '#fff' : '#1f2937',
              marginBottom: 8,
            }}>
              Super Admin
            </h3>
            <p style={{ 
              fontSize: 14, 
              color: darkMode ? 'rgba(255,255,255,0.6)' : '#6b7280',
              marginBottom: 16,
            }}>
              จัดการผู้ใช้และสิทธิ์
            </p>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 8,
            }}>
              <Button
                size="small"
                onClick={(e) => { e.stopPropagation(); navigate('/admin/users'); }}
                style={{
                  borderRadius: 8,
                  background: darkMode ? 'rgba(255,255,255,0.1)' : '#fef2f2',
                  border: 'none',
                  color: darkMode ? '#fff' : '#dc2626',
                }}
              >
                👥 ผู้ใช้
              </Button>
              <Button
                size="small"
                onClick={(e) => { e.stopPropagation(); navigate('/admin/activity-logs'); }}
                style={{
                  borderRadius: 8,
                  background: darkMode ? 'rgba(255,255,255,0.1)' : '#fef2f2',
                  border: 'none',
                  color: darkMode ? '#fff' : '#dc2626',
                }}
              >
                📋 Log
              </Button>
            </div>
          </div>
        )}

      {/* Quick Access - Role Based */}
      <div style={{ 
        maxWidth: 1000, 
        margin: '0 auto',
        padding: '0 20px',
      }}>
        <h3 style={{ 
          fontSize: 16, 
          color: darkMode ? 'rgba(255,255,255,0.6)' : '#6b7280',
          marginBottom: 16,
          textAlign: 'center',
        }}>
          ทางลัด
        </h3>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 16,
          flexWrap: 'wrap',
        }}>
          {/* Sales shortcuts */}
          {isSales && (
            <>
              <Button 
                onClick={() => navigate('/products')}
                style={{
                  height: 48,
                  borderRadius: 12,
                  background: darkMode ? 'rgba(255,255,255,0.05)' : '#fff',
                  border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e5e7eb',
                  color: darkMode ? '#fff' : '#1f2937',
                }}
                icon={<AppstoreOutlined />}
              >
                สินค้า
              </Button>
              <Button 
                onClick={() => navigate('/customers')}
                style={{
                  height: 48,
                  borderRadius: 12,
                  background: darkMode ? 'rgba(255,255,255,0.05)' : '#fff',
                  border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e5e7eb',
                  color: darkMode ? '#fff' : '#1f2937',
                }}
                icon={<UserOutlined />}
              >
                ลูกค้า
              </Button>
              <Button 
                onClick={() => navigate('/quotations')}
                style={{
                  height: 48,
                  borderRadius: 12,
                  background: darkMode ? 'rgba(255,255,255,0.05)' : '#fff',
                  border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e5e7eb',
                  color: darkMode ? '#fff' : '#1f2937',
                }}
                icon={<FileTextOutlined />}
              >
                ใบเสนอราคา
              </Button>
            </>
          )}

          {/* Stock shortcuts */}
          {isStock && (
            <>
              <Button 
                onClick={() => navigate('/goods-receipts')}
                style={{
                  height: 48,
                  borderRadius: 12,
                  background: darkMode ? 'rgba(255,255,255,0.05)' : '#fff',
                  border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e5e7eb',
                  color: darkMode ? '#fff' : '#1f2937',
                }}
                icon={<InboxOutlined />}
              >
                รับสินค้า
              </Button>
              <Button 
                onClick={() => navigate('/stock-requisitions')}
                style={{
                  height: 48,
                  borderRadius: 12,
                  background: darkMode ? 'rgba(255,255,255,0.05)' : '#fff',
                  border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e5e7eb',
                  color: darkMode ? '#fff' : '#1f2937',
                }}
                icon={<ExportOutlined />}
              >
                เบิกสินค้า
              </Button>
              <Button 
                onClick={() => navigate('/stock-transfers')}
                style={{
                  height: 48,
                  borderRadius: 12,
                  background: darkMode ? 'rgba(255,255,255,0.05)' : '#fff',
                  border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e5e7eb',
                  color: darkMode ? '#fff' : '#1f2937',
                }}
                icon={<SwapOutlined />}
              >
                โอนสินค้า
              </Button>
            </>
          )}

          {/* Accounting shortcuts */}
          {isAccounting && (
            <>
              <Button 
                onClick={() => navigate('/sales-invoices')}
                style={{
                  height: 48,
                  borderRadius: 12,
                  background: darkMode ? 'rgba(255,255,255,0.05)' : '#fff',
                  border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e5e7eb',
                  color: darkMode ? '#fff' : '#1f2937',
                }}
                icon={<DollarOutlined />}
              >
                ใบแจ้งหนี้
              </Button>
              <Button 
                onClick={() => navigate('/reports')}
                style={{
                  height: 48,
                  borderRadius: 12,
                  background: darkMode ? 'rgba(255,255,255,0.05)' : '#fff',
                  border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e5e7eb',
                  color: darkMode ? '#fff' : '#1f2937',
                }}
                icon={<BarChartOutlined />}
              >
                รายงาน
              </Button>
            </>
          )}

          {/* Admin - Dashboard */}
          {isAdmin && (
            <Button 
              type="primary"
              onClick={() => navigate('/dashboard')}
              style={{
                height: 48,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                border: 'none',
              }}
              icon={<BarChartOutlined />}
            >
              Dashboard
            </Button>
          )}
        </div>
      </div>

      {/* Profile Modal - Digital Business Card with Flip */}
      <Modal
        title={null}
        open={profileModalOpen}
        onCancel={() => { setProfileModalOpen(false); setCardFlipped(false); }}
        footer={null}
        width={420}
        centered
        styles={{
          content: {
            background: 'transparent',
            boxShadow: 'none',
            padding: 0,
          },
          body: {
            padding: 0,
          },
        }}
      >
        {/* Flip Card Container */}
        <div 
          onDoubleClick={() => setCardFlipped(!cardFlipped)}
          style={{
            perspective: '1000px',
            cursor: 'pointer',
          }}
        >
          <div style={{
            position: 'relative',
            width: '100%',
            height: 480,
            transformStyle: 'preserve-3d',
            transition: 'transform 0.6s ease',
            transform: cardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}>
            {/* Front Side */}
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              background: '#fff',
              borderRadius: 16,
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)',
            }}>
              {/* Card Top - Logo & Company */}
              <div style={{
                background: 'linear-gradient(135deg, #1e3a5f 0%, #0d2137 100%)',
                padding: '24px 28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ color: '#fff', fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
                    SAENGVITH SCIENCE
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>
                    Scientific Equipment & Services
                  </div>
                </div>
                <div style={{
                  background: '#fff',
                  borderRadius: 8,
                  padding: 8,
                }}>
                  <QRCode value={vCardData} size={60} />
                </div>
              </div>

              {/* Card Body - Personal Info */}
              <div style={{ padding: '24px 28px' }}>
                <div style={{ display: 'flex', gap: 20 }}>
                  <Avatar 
                    size={72} 
                    icon={<UserOutlined />}
                    style={{ 
                      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#1f2937' }}>
                      {businessCard.name}
                    </h2>
                    <p style={{ margin: '4px 0 0', fontSize: 14, color: '#3b82f6', fontWeight: 600 }}>
                      {businessCard.position}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: 12, color: '#6b7280' }}>
                      {businessCard.department}
                    </p>
                  </div>
                </div>

                <div style={{ height: 1, background: '#e5e7eb', margin: '20px 0' }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', fontSize: 16 }}>📱</div>
                    <div>
                      <div style={{ fontSize: 11, color: '#9ca3af' }}>โทรศัพท์</div>
                      <div style={{ fontSize: 14, color: '#1f2937', fontWeight: 500 }}>{businessCard.phone}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', fontSize: 16 }}>✉️</div>
                    <div>
                      <div style={{ fontSize: 11, color: '#9ca3af' }}>อีเมล</div>
                      <div style={{ fontSize: 14, color: '#1f2937', fontWeight: 500 }}>{businessCard.email}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', fontSize: 16 }}>🏢</div>
                    <div>
                      <div style={{ fontSize: 11, color: '#9ca3af' }}>บริษัท</div>
                      <div style={{ fontSize: 14, color: '#1f2937', fontWeight: 500 }}>{businessCard.company}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hint */}
              <div style={{ textAlign: 'center', padding: '8px 0', color: '#9ca3af', fontSize: 11 }}>
                👆 แตะสองครั้งเพื่อดูรายละเอียดเพิ่มเติม
              </div>
            </div>

            {/* Back Side */}
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              background: 'linear-gradient(135deg, #1e3a5f 0%, #0d2137 100%)',
              borderRadius: 16,
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)',
            }}>
              {/* Back Header */}
              <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>
                  📋 ข้อมูลเพิ่มเติม
                </div>
              </div>

              {/* Back Content */}
              <div style={{ padding: '24px 28px', color: '#fff' }}>
                {/* Experience */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>
                    🗓️ ประสบการณ์ทำงาน
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#22d3ee' }}>
                    {businessCard.experience}
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
                    เริ่มงาน: {businessCard.startDate}
                  </div>
                </div>

                {/* Skills */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>
                    💡 ความเชี่ยวชาญ
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {businessCard.skills.map((skill: string, idx: number) => (
                      <span key={idx} style={{
                        padding: '6px 12px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: 20,
                        fontSize: 12,
                      }}>{skill}</span>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>
                    🏆 ผลงานเด่น
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {businessCard.achievements.map((ach: string, idx: number) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ color: '#fbbf24' }}>★</span>
                        <span style={{ fontSize: 13 }}>{ach}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>
                    📍 ที่อยู่บริษัท
                  </div>
                  <div style={{ fontSize: 12, lineHeight: 1.6 }}>
                    {businessCard.address}
                  </div>
                </div>
              </div>

              {/* Hint */}
              <div style={{ textAlign: 'center', padding: '8px 0', color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>
                👆 แตะสองครั้งเพื่อกลับด้านหน้า
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 12,
          marginTop: 16,
        }}>
          <Button 
            type="primary"
            icon={<ShareAltOutlined />}
            onClick={shareCard}
            style={{ borderRadius: 8, background: '#3b82f6' }}
          >
            แชร์
          </Button>
          <Button 
            icon={<CopyOutlined />}
            onClick={copyToClipboard}
            style={{ borderRadius: 8, background: '#fff' }}
          >
            คัดลอก
          </Button>
          <Button 
            icon={<EditOutlined />}
            onClick={() => navigate('/profile')}
            style={{ borderRadius: 8, background: '#fff' }}
          >
            แก้ไข
          </Button>
        </div>
      </Modal>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        marginTop: 48,
        padding: 20,
        color: darkMode ? 'rgba(255,255,255,0.4)' : '#9ca3af',
        fontSize: 12,
      }}>
        © 2025 Saengvith Science Co.,Ltd. | SVS Stock v1.0
      </div>
    </div>
  );
};

export default IntroPage;
