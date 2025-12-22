import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Avatar, Modal, Switch, message, Spin } from 'antd';
import { 
  UserOutlined, SafetyOutlined, EnvironmentOutlined, FileTextOutlined,
  ShareAltOutlined, CopyOutlined, EditOutlined, SettingOutlined,
  AppstoreOutlined, TeamOutlined, BarChartOutlined
} from '@ant-design/icons';
import { QRCode } from 'antd';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const IntroPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Stats
  const [quotationStats, setQuotationStats] = useState({ total: 0, ordered: 0, totalAmount: 0 });
  const [adminStats, setAdminStats] = useState({ users: 0, roles: 0, logs: 0 });
  const [profile, setProfile] = useState<any>({});
  
  // Mock check-in data
  const checkInStats = { present: 18, leave: 2, month: 'ธ.ค. 2568' };

  const isAdmin = user?.roles?.includes('ADMIN');
  const isSales = user?.roles?.some((r: string) => 
    ['ADMIN', 'SALES', 'SALES_STANDARD', 'SALES_FORENSIC', 'SALES_TOOLLAB', 'SALES_MAINTENANCE'].includes(r)
  );

  useEffect(() => {
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Fetch profile
      try {
        const profileRes = await api.get('/api/user-settings/profile');
        setProfile(profileRes.data || {});
      } catch (e) {
        console.log('No profile yet');
      }

      // Fetch quotation stats
      if (isSales) {
        const qtRes = await api.get('/quotations');
        const quotations = qtRes.data || [];
        const ordered = quotations.filter((q: any) => q.status === 'ORDERED' || q.status === 'CONFIRMED');
        const totalAmount = quotations.reduce((sum: number, q: any) => sum + (q.totalAmount || 0), 0);
        setQuotationStats({
          total: quotations.length,
          ordered: ordered.length,
          totalAmount
        });
      }
      
      // Fetch admin stats
      if (isAdmin) {
        const [usersRes, rolesRes] = await Promise.all([
          api.get('/users'),
          api.get('/roles')
        ]);
        setAdminStats({
          users: usersRes.data?.length || 0,
          roles: rolesRes.data?.length || 0,
          logs: 156 // Mock
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
    setLoading(false);
  };

  const firstName = user?.fullName?.split(' ').pop() || user?.fullName?.split(' ')[0] || 'User';

  const calculateExperience = (startDate: string) => {
    if (!startDate) return '';
    try {
      const parts = startDate.split(' ');
      const thaiMonths: Record<string, number> = {
        'ม.ค.': 0, 'ก.พ.': 1, 'มี.ค.': 2, 'เม.ย.': 3, 'พ.ค.': 4, 'มิ.ย.': 5,
        'ก.ค.': 6, 'ส.ค.': 7, 'ก.ย.': 8, 'ต.ค.': 9, 'พ.ย.': 10, 'ธ.ค.': 11
      };
      const day = parseInt(parts[0]);
      const month = thaiMonths[parts[1]] || 0;
      const year = parseInt(parts[2]) - 543;
      const start = new Date(year, month, day);
      const now = new Date();
      const years = Math.floor((now.getTime() - start.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      return years + ' ปี';
    } catch {
      return '';
    }
  };

  const businessCard = {
    name: user?.fullName || 'ไม่ระบุชื่อ',
    position: profile?.position || '',
    department: profile?.department || '',
    phone: profile?.phone || '',
    email: user?.email || '',
    company: 'บริษัท แสงวิทย์ ซายน์ จำกัด',
    startDate: profile?.startDate || '',
    experience: profile?.startDate ? calculateExperience(profile.startDate) : '',
    skills: profile?.skills ? profile.skills.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
    achievements: profile?.achievements ? profile.achievements.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
  };

  // URL สำหรับดาวน์โหลด vCard
  const vCardUrl = `https://svs-stock-api.azurewebsites.net/api/vcard/${user?.username || 'unknown'}`;

  const shareCard = async () => {
    if (navigator.share) {
      await navigator.share({
        title: businessCard.name,
        text: `${businessCard.name} - ${businessCard.position}\n${businessCard.phone}\n${businessCard.email}`,
      });
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(
      `${businessCard.name}\n${businessCard.position}\n${businessCard.phone}\n${businessCard.email}`
    );
    message.success('คัดลอกข้อมูลแล้ว');
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `฿${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `฿${(amount / 1000).toFixed(0)}K`;
    return `฿${amount.toFixed(0)}`;
  };

  const cardStyle = {
    width: 280,
    padding: 24,
    borderRadius: 20,
    background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(20px)',
    border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative' as const,
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: darkMode 
        ? 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)'
        : 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 50%, #cbd5e1 100%)',
      padding: '40px 20px',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: 1200,
        margin: '0 auto 40px',
      }}>
        <h1 style={{ 
          fontSize: 28, 
          fontWeight: 700, 
          color: '#22c55e',
          margin: 0,
        }}>
          SVS Business Suite
        </h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Switch
            checked={darkMode}
            onChange={setDarkMode}
            checkedChildren="🌙"
            unCheckedChildren="☀️"
          />
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 12,
            padding: '8px 16px',
            borderRadius: 12,
            background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
          }}>
            <Avatar icon={<UserOutlined />} style={{ background: '#3b82f6' }} />
            <div>
              <div style={{ fontWeight: 600, color: darkMode ? '#fff' : '#1f2937', fontSize: 14 }}>
                {user?.fullName}
              </div>
              <div style={{ fontSize: 11, color: darkMode ? 'rgba(255,255,255,0.6)' : '#6b7280' }}>
                {user?.roles?.join(', ')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h2 style={{ 
          fontSize: 32, 
          color: darkMode ? '#fbbf24' : '#d97706',
          marginBottom: 8,
        }}>
          สวัสดี, {firstName}! 👋
        </h2>
        <p style={{ color: darkMode ? 'rgba(255,255,255,0.6)' : '#6b7280' }}>
          เลือกสิ่งที่ต้องการทำวันนี้
        </p>
      </div>

      {/* Cards Grid */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 24,
        maxWidth: 1200,
        margin: '0 auto 40px',
      }}>
        {/* Card 1: นามบัตร */}
        <div 
          onClick={() => setProfileModalOpen(true)}
          style={cardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(59,130,246,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: 28,
            color: '#fff',
          }}>
            <UserOutlined />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: darkMode ? '#fff' : '#1f2937', marginBottom: 4, textAlign: 'center' }}>
            นามบัตร
          </h3>
          <p style={{ fontSize: 12, color: darkMode ? 'rgba(255,255,255,0.5)' : '#9ca3af', marginBottom: 16, textAlign: 'center' }}>
            ดูและแชร์ข้อมูลติดต่อ
          </p>
          
          <div style={{ 
            background: darkMode ? 'rgba(255,255,255,0.05)' : '#f8fafc',
            borderRadius: 12,
            padding: 12,
            marginBottom: 12,
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: darkMode ? '#fff' : '#1f2937' }}>
              {businessCard.name}
            </div>
            <div style={{ fontSize: 11, color: darkMode ? 'rgba(255,255,255,0.6)' : '#6b7280' }}>
              {businessCard.position}
            </div>
            <div style={{ fontSize: 11, color: '#3b82f6', marginTop: 4 }}>
              📱 {businessCard.phone}
            </div>
          </div>

          <Button 
            type="primary" 
            block 
            style={{ borderRadius: 10, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', border: 'none' }}
            icon={<ShareAltOutlined />}
            onClick={(e) => { e.stopPropagation(); shareCard(); }}
          >
            แชร์นามบัตร
          </Button>
        </div>

        {/* Card 2: เช็คอิน */}
        <div 
          onClick={() => message.info('🚧 ฟีเจอร์เช็คอินกำลังพัฒนา เร็วๆ นี้!')}
          style={cardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(16,185,129,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{
            position: 'absolute',
            top: 12,
            right: 12,
            padding: '4px 10px',
            borderRadius: 10,
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: '#fff',
            fontSize: 10,
            fontWeight: 600,
          }}>
            เร็วๆ นี้
          </div>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: 28,
            color: '#fff',
          }}>
            <EnvironmentOutlined />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: darkMode ? '#fff' : '#1f2937', marginBottom: 4, textAlign: 'center' }}>
            เช็คอิน
          </h3>
          <p style={{ fontSize: 12, color: darkMode ? 'rgba(255,255,255,0.5)' : '#9ca3af', marginBottom: 16, textAlign: 'center' }}>
            บันทึกเวลาเข้า-ออกงาน
          </p>
          
          <div style={{ 
            background: darkMode ? 'rgba(255,255,255,0.05)' : '#f8fafc',
            borderRadius: 12,
            padding: 12,
            marginBottom: 12,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: darkMode ? 'rgba(255,255,255,0.6)' : '#6b7280' }}>✅ เข้างาน</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#10b981' }}>{checkInStats.present} วัน</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: darkMode ? 'rgba(255,255,255,0.6)' : '#6b7280' }}>❌ ลา</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#ef4444' }}>{checkInStats.leave} วัน</span>
            </div>
            <div style={{ fontSize: 11, color: darkMode ? 'rgba(255,255,255,0.4)' : '#9ca3af', textAlign: 'center' }}>
              📅 {checkInStats.month}
            </div>
          </div>

          <Button 
            block 
            style={{ 
              borderRadius: 10, 
              background: darkMode ? 'rgba(255,255,255,0.1)' : '#f0fdf4',
              border: 'none',
              color: '#10b981',
            }}
          >
            ⏰ เช็คอิน
          </Button>
        </div>

        {/* Card 3: ใบเสนอราคา (Sales Only) */}
        {isSales && (
          <div 
            onClick={() => navigate('/quotations')}
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(245,158,11,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: 28,
              color: '#fff',
            }}>
              <FileTextOutlined />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: darkMode ? '#fff' : '#1f2937', marginBottom: 4, textAlign: 'center' }}>
              ใบเสนอราคา
            </h3>
            <p style={{ fontSize: 12, color: darkMode ? 'rgba(255,255,255,0.5)' : '#9ca3af', marginBottom: 16, textAlign: 'center' }}>
              สร้างและจัดการใบเสนอราคา
            </p>
            
            <div style={{ 
              background: darkMode ? 'rgba(255,255,255,0.05)' : '#f8fafc',
              borderRadius: 12,
              padding: 12,
              marginBottom: 12,
            }}>
              {loading ? (
                <div style={{ textAlign: 'center', padding: 10 }}><Spin size="small" /></div>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: darkMode ? 'rgba(255,255,255,0.6)' : '#6b7280' }}>📄 สร้างแล้ว</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: darkMode ? '#fff' : '#1f2937' }}>{quotationStats.total} ใบ</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: darkMode ? 'rgba(255,255,255,0.6)' : '#6b7280' }}>✓ สั่งซื้อแล้ว</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#10b981' }}>{quotationStats.ordered} ใบ</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: darkMode ? 'rgba(255,255,255,0.6)' : '#6b7280' }}>💰 ยอดรวม</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#f59e0b' }}>{formatCurrency(quotationStats.totalAmount)}</span>
                  </div>
                </>
              )}
            </div>

            <Button 
              type="primary"
              block 
              style={{ 
                borderRadius: 10, 
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                border: 'none',
              }}
              onClick={(e) => { e.stopPropagation(); navigate('/quotations/new'); }}
            >
              + สร้างใบเสนอราคา
            </Button>
          </div>
        )}

        {/* Card 4: Super Admin (Admin Only) */}
        {isAdmin && (
          <div 
            onClick={() => navigate('/admin/users')}
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(239,68,68,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{
              position: 'absolute',
              top: 12,
              right: 12,
              padding: '4px 10px',
              borderRadius: 10,
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: '#fff',
              fontSize: 10,
              fontWeight: 600,
            }}>
              Admin
            </div>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: 28,
              color: '#fff',
            }}>
              <SafetyOutlined />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: darkMode ? '#fff' : '#1f2937', marginBottom: 4, textAlign: 'center' }}>
              Super Admin
            </h3>
            <p style={{ fontSize: 12, color: darkMode ? 'rgba(255,255,255,0.5)' : '#9ca3af', marginBottom: 16, textAlign: 'center' }}>
              จัดการผู้ใช้และสิทธิ์
            </p>
            
            <div style={{ 
              background: darkMode ? 'rgba(255,255,255,0.05)' : '#f8fafc',
              borderRadius: 12,
              padding: 12,
              marginBottom: 12,
            }}>
              {loading ? (
                <div style={{ textAlign: 'center', padding: 10 }}><Spin size="small" /></div>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: darkMode ? 'rgba(255,255,255,0.6)' : '#6b7280' }}>👥 ผู้ใช้</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: darkMode ? '#fff' : '#1f2937' }}>{adminStats.users} คน</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: darkMode ? 'rgba(255,255,255,0.6)' : '#6b7280' }}>🔑 สิทธิ์</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#8b5cf6' }}>{adminStats.roles} ประเภท</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: darkMode ? 'rgba(255,255,255,0.6)' : '#6b7280' }}>📋 Logs</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#ef4444' }}>{adminStats.logs} รายการ</span>
                  </div>
                </>
              )}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <Button 
                block 
                style={{ 
                  borderRadius: 10, 
                  background: darkMode ? 'rgba(255,255,255,0.1)' : '#fef2f2',
                  border: 'none',
                  color: '#ef4444',
                  flex: 1,
                }}
                onClick={(e) => { e.stopPropagation(); navigate('/admin/users'); }}
              >
                👥
              </Button>
              <Button 
                block 
                style={{ 
                  borderRadius: 10, 
                  background: darkMode ? 'rgba(255,255,255,0.1)' : '#fef2f2',
                  border: 'none',
                  color: '#ef4444',
                  flex: 1,
                }}
                onClick={(e) => { e.stopPropagation(); navigate('/admin/activity-logs'); }}
              >
                📋
              </Button>
              <Button 
                block 
                style={{ 
                  borderRadius: 10, 
                  background: darkMode ? 'rgba(255,255,255,0.1)' : '#fef2f2',
                  border: 'none',
                  color: '#ef4444',
                  flex: 1,
                }}
                onClick={(e) => { e.stopPropagation(); navigate('/settings'); }}
              >
                ⚙️
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Shortcuts */}
      <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
        <h3 style={{ 
          fontSize: 14, 
          color: darkMode ? 'rgba(255,255,255,0.5)' : '#9ca3af',
          marginBottom: 16,
        }}>
          ทางลัด
        </h3>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 12 }}>
          <Button 
            onClick={() => navigate('/products')}
            style={{ borderRadius: 10, background: darkMode ? 'rgba(255,255,255,0.05)' : '#fff', color: darkMode ? '#fff' : '#1f2937' }}
            icon={<AppstoreOutlined />}
          >
            สินค้า
          </Button>
          <Button 
            onClick={() => navigate('/customers')}
            style={{ borderRadius: 10, background: darkMode ? 'rgba(255,255,255,0.05)' : '#fff', color: darkMode ? '#fff' : '#1f2937' }}
            icon={<TeamOutlined />}
          >
            ลูกค้า
          </Button>
          <Button 
            onClick={() => navigate('/quotations')}
            style={{ borderRadius: 10, background: darkMode ? 'rgba(255,255,255,0.05)' : '#fff', color: darkMode ? '#fff' : '#1f2937' }}
            icon={<FileTextOutlined />}
          >
            ใบเสนอราคา
          </Button>
          <Button 
            onClick={() => navigate('/dashboard')}
            style={{ borderRadius: 10, background: darkMode ? 'rgba(255,255,255,0.05)' : '#fff', color: darkMode ? '#fff' : '#1f2937' }}
            icon={<BarChartOutlined />}
          >
            Dashboard
          </Button>
          <Button 
            onClick={() => navigate('/settings')}
            style={{ borderRadius: 10, background: darkMode ? 'rgba(255,255,255,0.05)' : '#fff', color: darkMode ? '#fff' : '#1f2937' }}
            icon={<SettingOutlined />}
          >
            ตั้งค่า
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: 60,
        color: darkMode ? 'rgba(255,255,255,0.3)' : '#9ca3af',
        fontSize: 12,
      }}>
        Developed by Boy © Autthapol Saiyat
      </div>

      {/* Profile Modal - Business Card with Flip */}
      <Modal
        title={null}
        open={profileModalOpen}
        onCancel={() => { setProfileModalOpen(false); setCardFlipped(false); }}
        footer={null}
        width={400}
        centered
        styles={{ content: { background: 'transparent', boxShadow: 'none', padding: 0 }, body: { padding: 0 } }}
      >
        <div 
          onDoubleClick={() => setCardFlipped(!cardFlipped)}
          style={{ perspective: '1000px', cursor: 'pointer' }}
        >
          <div style={{
            position: 'relative',
            width: '100%',
            height: 420,
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
              <div style={{
                background: 'linear-gradient(135deg, #1e3a5f 0%, #0d2137 100%)',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>SAENGVITH SCIENCE</div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10 }}>Scientific Equipment & Services</div>
                </div>
                <div style={{ background: '#fff', borderRadius: 6, padding: 6 }}>
                  <QRCode value={vCardUrl} size={50} />
                </div>
              </div>

              <div style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                  <Avatar size={60} icon={<UserOutlined />} style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }} />
                  <div>
                    <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1f2937' }}>{businessCard.name}</h2>
                    <p style={{ margin: '2px 0 0', fontSize: 13, color: '#3b82f6', fontWeight: 600 }}>{businessCard.position}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 11, color: '#6b7280' }}>{businessCard.department}</p>
                  </div>
                </div>

                <div style={{ height: 1, background: '#e5e7eb', margin: '16px 0' }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 16 }}>📱</span>
                    <div>
                      <div style={{ fontSize: 10, color: '#9ca3af' }}>โทรศัพท์</div>
                      <div style={{ fontSize: 13, color: '#1f2937', fontWeight: 500 }}>{businessCard.phone}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 16 }}>✉️</span>
                    <div>
                      <div style={{ fontSize: 10, color: '#9ca3af' }}>อีเมล</div>
                      <div style={{ fontSize: 13, color: '#1f2937', fontWeight: 500 }}>{businessCard.email}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 16 }}>🏢</span>
                    <div>
                      <div style={{ fontSize: 10, color: '#9ca3af' }}>บริษัท</div>
                      <div style={{ fontSize: 13, color: '#1f2937', fontWeight: 500 }}>{businessCard.company}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'center', padding: '8px 0', color: '#9ca3af', fontSize: 10 }}>
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
              <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>📋 ข้อมูลเพิ่มเติม</div>
              </div>
              <div style={{ padding: '20px 24px', color: '#fff' }}>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>🗓️ ประสบการณ์ทำงาน</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#22d3ee' }}>{businessCard.experience}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>เริ่มงาน: {businessCard.startDate}</div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>💡 ความเชี่ยวชาญ</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {businessCard.skills.map((skill: string, idx: number) => (
                      <span key={idx} style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 11 }}>{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'center', padding: '8px 0', color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>
                👆 แตะสองครั้งเพื่อกลับด้านหน้า
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 16 }}>
          <Button type="primary" icon={<ShareAltOutlined />} onClick={shareCard} style={{ borderRadius: 8 }}>แชร์</Button>
          <Button icon={<CopyOutlined />} onClick={copyToClipboard} style={{ borderRadius: 8 }}>คัดลอก</Button>
          <Button icon={<EditOutlined />} onClick={() => navigate('/settings')} style={{ borderRadius: 8 }}>แก้ไข</Button>
        </div>
      </Modal>
    </div>
  );
};

export default IntroPage;
