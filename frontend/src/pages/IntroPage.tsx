import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Avatar, Modal, Switch, message, Spin, Dropdown } from 'antd';
import { 
  UserOutlined, SafetyOutlined, EnvironmentOutlined, FileTextOutlined,
  ShareAltOutlined, CopyOutlined, EditOutlined, SettingOutlined,
  LogoutOutlined, ShoppingCartOutlined, InboxOutlined, ToolOutlined,
  DollarOutlined, FileSearchOutlined, BarChartOutlined, CalculatorOutlined,
  BankOutlined, AuditOutlined
} from '@ant-design/icons';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../contexts/AuthContext';
import { useBranding } from '../contexts/BrandingContext';
import api from '../services/api';

const IntroPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { systemName, systemSubtitle, systemLogo } = useBranding();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  const [quotationStats, setQuotationStats] = useState({ total: 0, ordered: 0, totalAmount: 0 });
  const [adminStats, setAdminStats] = useState({ users: 0, roles: 0, logs: 0 });
  const [dashboardStats, setDashboardStats] = useState({ stockValue: 0, products: 0, categories: 0 });
  const [stockStats, setStockStats] = useState({ total: 0, low: 0, warning: 0 });
  const [poStats, setPoStats] = useState({ total: 0, pending: 0, totalAmount: 0 });
  const [accountingStats, setAccountingStats] = useState({ journalEntries: 0, pendingPayments: 0, pendingReceipts: 0, totalAR: 0, totalAP: 0 });
  const [profile, setProfile] = useState<any>({});
  
  const checkInStats = { present: 18, leave: 2, month: 'ธ.ค. 2568' };
  const repairStats = { waiting: 5, inProgress: 3, completed: 12 };
  const salesStats = { monthly: 2500000, compared: 12.5, target: 75 };
  const contractStats = { expiring30: 20, totalValue: 10000000, nextExpiry: '15 ม.ค. 68' };

  const isSuperAdmin = user?.roles?.includes('SUPER_ADMIN');
  const isAdmin = isSuperAdmin || user?.roles?.includes('ADMIN');
  const isManager = isSuperAdmin || user?.roles?.some((r: string) => ['ADMIN', 'MANAGER'].includes(r));
  const isSales = isSuperAdmin || user?.roles?.some((r: string) => 
    ['ADMIN', 'SALES', 'SALES_STANDARD', 'SALES_FORENSIC', 'SALES_TOOLLAB', 'SALES_MAINTENANCE', 'MANAGER'].includes(r)
  );
  const isStock = isSuperAdmin || user?.roles?.some((r: string) => ['ADMIN', 'STOCK', 'WAREHOUSE', 'MANAGER'].includes(r));
  const isPurchase = isSuperAdmin || user?.roles?.some((r: string) => ['ADMIN', 'PURCHASE', 'MANAGER'].includes(r));
  const isAccount = isSuperAdmin || user?.roles?.some((r: string) => ['ADMIN', 'ACCOUNT', 'ACCOUNTANT', 'ACCOUNTING', 'FINANCE', 'MANAGER'].includes(r));
  const isBasicOnly = user?.roles?.length === 1 && user?.roles?.includes('BASIC');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => { localStorage.setItem('darkMode', String(darkMode)); }, [darkMode]);
  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      try { const r = await api.get('/api/user-settings/profile'); setProfile(r.data || {}); } catch {}
      if (isSales) { try { const r = await api.get('/quotations'); const q = r.data || []; setQuotationStats({ total: q.length, ordered: q.filter((x: any) => x.status === 'ORDERED' || x.status === 'CONFIRMED').length, totalAmount: q.reduce((s: number, x: any) => s + (x.totalAmount || 0), 0) }); } catch {} }
      if (isAdmin) { try { const [u, ro] = await Promise.all([api.get('/users'), api.get('/roles')]); setAdminStats({ users: u.data?.length || 0, roles: ro.data?.length || 0, logs: 0 }); } catch {} }
      if (isManager) { try { const [p, s] = await Promise.all([api.get('/api/products'), api.get('/api/stock/balance')]); setDashboardStats({ stockValue: (s.data || []).reduce((sum: number, x: any) => sum + ((x.quantity || 0) * (x.avgCost || 0)), 0), products: p.data?.length || 0, categories: new Set(p.data?.map((x: any) => x.category?.id)).size }); } catch {} }
      if (isStock) { try { const r = await api.get('/api/stock/balance'); const s = r.data || []; setStockStats({ total: s.length, low: s.filter((x: any) => x.quantity <= 0).length, warning: s.filter((x: any) => x.quantity > 0 && x.quantity <= 10).length }); } catch {} }
      if (isPurchase) { try { const r = await api.get('/api/purchase-orders'); const p = r.data || []; setPoStats({ total: p.length, pending: p.filter((x: any) => x.status === 'PENDING' || x.status === 'DRAFT').length, totalAmount: p.reduce((s: number, x: any) => s + (x.totalAmount || 0), 0) }); } catch {} }
      if (isAccount) { try { 
        const [jeRes, arRes, apRes] = await Promise.all([
          api.get('/api/accounting/journal-entries').catch(() => ({ data: [] })),
          api.get('/api/accounting/ar-ap/aging?type=AR').catch(() => ({ data: { summary: { totalOutstanding: 0 } } })),
          api.get('/api/accounting/ar-ap/aging?type=AP').catch(() => ({ data: { summary: { totalOutstanding: 0 } } })),
        ]);
        const je = jeRes.data || [];
        setAccountingStats({ 
          journalEntries: je.length, 
          pendingPayments: je.filter((x: any) => x.status === 'DRAFT').length,
          pendingReceipts: 0,
          totalAR: arRes.data?.summary?.totalOutstanding || 0,
          totalAP: apRes.data?.summary?.totalOutstanding || 0
        }); 
      } catch {} }
    } catch {}
    setLoading(false);
  };

  const firstName = user?.fullName?.split(' ').pop() || user?.fullName?.split(' ')[0] || 'User';
  const calculateExperience = (d: string) => { if (!d) return ''; try { const p = d.split(' '); const m: Record<string, number> = { 'ม.ค.': 0, 'ก.พ.': 1, 'มี.ค.': 2, 'เม.ย.': 3, 'พ.ค.': 4, 'มิ.ย.': 5, 'ก.ค.': 6, 'ส.ค.': 7, 'ก.ย.': 8, 'ต.ค.': 9, 'พ.ย.': 10, 'ธ.ค.': 11 }; const s = new Date(parseInt(p[2]) - 543, m[p[1]] || 0, parseInt(p[0])); return Math.floor((Date.now() - s.getTime()) / (365.25 * 24 * 60 * 60 * 1000)) + ' ปี'; } catch { return ''; } };

  const businessCard = { name: user?.fullName || 'ไม่ระบุชื่อ', position: profile?.position || '', department: profile?.department || '', phone: profile?.phone || '', email: user?.email || '', company: 'บริษัท แสงวิทย์ ซายน์ จำกัด', startDate: profile?.startDate || '', experience: profile?.startDate ? calculateExperience(profile.startDate) : '', skills: profile?.skills ? profile.skills.split(',').map((s: string) => s.trim()).filter(Boolean) : [] };
  const vCardData = `BEGIN:VCARD\nVERSION:3.0\nFN:${businessCard.name}\nORG:${businessCard.company}\nTITLE:${businessCard.position}\nTEL:${businessCard.phone}\nEMAIL:${businessCard.email}\nEND:VCARD`;
  const shareCard = async () => { if (navigator.share) { await navigator.share({ title: businessCard.name, text: `${businessCard.name} - ${businessCard.position}\n${businessCard.phone}` }); } else { copyToClipboard(); } };
  const copyToClipboard = () => { navigator.clipboard.writeText(`${businessCard.name}\n${businessCard.position}\n${businessCard.phone}`); message.success('คัดลอกข้อมูลแล้ว'); };
  const formatCurrency = (a: number) => a >= 1000000 ? `฿${(a / 1000000).toFixed(1)}M` : a >= 1000 ? `฿${(a / 1000).toFixed(0)}K` : `฿${a.toFixed(0)}`;
  const handleLogout = () => { logout(); navigate('/login'); };

  const userMenuItems = [
    { key: 'profile', icon: <UserOutlined />, label: 'โปรไฟล์', onClick: () => navigate(isBasicOnly ? '/basic-profile' : '/profile') },
    ...(!isBasicOnly ? [{ key: 'settings', icon: <SettingOutlined />, label: 'ตั้งค่า', onClick: () => navigate('/settings') }] : []),
    { type: 'divider' as const },
    { key: 'logout', icon: <LogoutOutlined />, label: 'ออกจากระบบ', onClick: handleLogout, danger: true },
  ];

  const cardStyle = { width: isMobile ? '100%' : 280, maxWidth: 320, padding: isMobile ? 20 : 24, borderRadius: 20, background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)', cursor: 'pointer', transition: 'all 0.3s ease', position: 'relative' as const };

  const CardIcon = ({ gradient, icon }: { gradient: string; icon: React.ReactNode }) => (
    <div style={{ width: 64, height: 64, borderRadius: '50%', background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28, color: '#fff' }}>{icon}</div>
  );

  const Badge = ({ text, gradient }: { text: string; gradient: string }) => (
    <div style={{ position: 'absolute', top: 12, right: 12, padding: '4px 10px', borderRadius: 10, background: gradient, color: '#fff', fontSize: 10, fontWeight: 600 }}>{text}</div>
  );

  const StatRow = ({ icon, label, value, color }: { icon: string; label: string; value: string | number; color: string }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
      <span style={{ fontSize: 12, color: darkMode ? 'rgba(255,255,255,0.6)' : '#6b7280' }}>{icon} {label}</span>
      <span style={{ fontSize: 14, fontWeight: 600, color }}>{value}</span>
    </div>
  );

  const StatsBox = ({ children }: { children: React.ReactNode }) => (
    <div style={{ background: darkMode ? 'rgba(255,255,255,0.05)' : '#f8fafc', borderRadius: 12, padding: 12, marginBottom: 12 }}>
      {loading ? <div style={{ textAlign: 'center', padding: 10 }}><Spin size="small" /></div> : children}
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: darkMode ? 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)' : 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 50%, #cbd5e1 100%)', paddingBottom: 40 }}>
      {/* HEADER */}
      <header style={{ background: darkMode ? 'rgba(10, 10, 15, 0.9)' : 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)', borderBottom: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 100, padding: isMobile ? '12px 16px' : '16px 24px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 14 }}>
            <div style={{ width: isMobile ? 40 : 48, height: isMobile ? 40 : 48, borderRadius: 12, overflow: 'hidden', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <img src={systemLogo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = `<span style="color:#22c55e;font-weight:700;font-size:16px">${systemName.substring(0, 3).toUpperCase()}</span>`; }} />
            </div>
            <div>
              <h1 className="text-gradient" style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, margin: 0, lineHeight: 1.2 }}>{isMobile ? systemName.substring(0, 3).toUpperCase() : systemName}</h1>
              {!isMobile && systemSubtitle && <p style={{ fontSize: 11, color: darkMode ? 'rgba(255,255,255,0.5)' : '#6b7280', margin: 0 }}>{systemSubtitle}</p>}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 16 }}>
            <Switch checked={darkMode} onChange={setDarkMode} checkedChildren="🌙" unCheckedChildren="☀️" />
            <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
              <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 12, padding: isMobile ? '6px 10px' : '8px 16px', borderRadius: 12, background: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)', cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} size={isMobile ? 32 : 38} style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, color: darkMode ? '#fff' : '#1f2937', fontSize: isMobile ? 12 : 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: isMobile ? 70 : 150 }}>{isMobile ? firstName : user?.fullName}</div>
                  <div style={{ fontSize: isMobile ? 10 : 11, color: darkMode ? 'rgba(255,255,255,0.6)' : '#6b7280' }}>{user?.roles?.[0] || 'USER'}</div>
                </div>
              </div>
            </Dropdown>
          </div>
        </div>
      </header>

      <div style={{ padding: isMobile ? '24px 16px' : '40px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 24 : 40 }}>
          <h2 style={{ fontSize: isMobile ? 26 : 32, color: darkMode ? '#fbbf24' : '#d97706', marginBottom: 8 }}>สวัสดี, {firstName}! 👋</h2>
          <p style={{ color: darkMode ? 'rgba(255,255,255,0.6)' : '#6b7280' }}>เลือกสิ่งที่ต้องการทำวันนี้</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: isMobile ? 16 : 24, maxWidth: 1200, margin: '0 auto 40px' }}>
          {/* Card 1: นามบัตร */}
          <div onClick={() => setProfileModalOpen(true)} style={cardStyle}>
            <CardIcon gradient="linear-gradient(135deg, #3b82f6, #8b5cf6)" icon={<UserOutlined />} />
            <h3 style={{ fontSize: 18, fontWeight: 600, color: darkMode ? '#fff' : '#1f2937', marginBottom: 4, textAlign: 'center' }}>นามบัตร</h3>
            <p style={{ fontSize: 12, color: darkMode ? 'rgba(255,255,255,0.5)' : '#9ca3af', marginBottom: 16, textAlign: 'center' }}>ดูและแชร์ข้อมูลติดต่อ</p>
            <StatsBox>
              <div style={{ fontSize: 13, fontWeight: 600, color: darkMode ? '#fff' : '#1f2937' }}>{businessCard.name}</div>
              <div style={{ fontSize: 11, color: darkMode ? 'rgba(255,255,255,0.6)' : '#6b7280' }}>{businessCard.position}</div>
              <div style={{ fontSize: 11, color: '#3b82f6', marginTop: 4 }}>📱 {businessCard.phone}</div>
            </StatsBox>
            <Button type="primary" block style={{ borderRadius: 10, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', border: 'none' }} icon={<ShareAltOutlined />} onClick={(e) => { e.stopPropagation(); shareCard(); }}>แชร์นามบัตร</Button>
          </div>

          {/* Card 2: เช็คอิน */}
          <div onClick={() => navigate('/checkin')} style={cardStyle}>
            <CardIcon gradient="linear-gradient(135deg, #10b981, #059669)" icon={<EnvironmentOutlined />} />
            <h3 style={{ fontSize: 18, fontWeight: 600, color: darkMode ? '#fff' : '#1f2937', marginBottom: 4, textAlign: 'center' }}>เช็คอิน</h3>
            <p style={{ fontSize: 12, color: darkMode ? 'rgba(255,255,255,0.5)' : '#9ca3af', marginBottom: 16, textAlign: 'center' }}>บันทึกเวลาเข้า-ออกงาน</p>
            <StatsBox>
              <StatRow icon="✅" label="เข้างาน" value={`${checkInStats.present} วัน`} color="#10b981" />
              <StatRow icon="❌" label="ลา" value={`${checkInStats.leave} วัน`} color="#ef4444" />
              <div style={{ fontSize: 11, color: darkMode ? 'rgba(255,255,255,0.4)' : '#9ca3af', textAlign: 'center' }}>📅 {checkInStats.month}</div>
            </StatsBox>
            <Button block style={{ borderRadius: 10, background: darkMode ? 'rgba(255,255,255,0.1)' : '#f0fdf4', border: 'none', color: '#10b981' }}>⏰ เช็คอิน</Button>
          </div>

          {/* Card 3: ใบเสนอราคา */}
          {isSales && (
            <div onClick={() => navigate('/quotations')} style={cardStyle}>
              <CardIcon gradient="linear-gradient(135deg, #f59e0b, #d97706)" icon={<FileTextOutlined />} />
              <h3 style={{ fontSize: 18, fontWeight: 600, color: darkMode ? '#fff' : '#1f2937', marginBottom: 4, textAlign: 'center' }}>ใบเสนอราคา</h3>
              <p style={{ fontSize: 12, color: darkMode ? 'rgba(255,255,255,0.5)' : '#9ca3af', marginBottom: 16, textAlign: 'center' }}>สร้างและจัดการใบเสนอราคา</p>
              <StatsBox>
                <StatRow icon="📄" label="สร้างแล้ว" value={`${quotationStats.total} ใบ`} color={darkMode ? '#fff' : '#1f2937'} />
                <StatRow icon="✅" label="สั่งซื้อแล้ว" value={`${quotationStats.ordered} ใบ`} color="#10b981" />
                <StatRow icon="💰" label="ยอดรวม" value={formatCurrency(quotationStats.totalAmount)} color="#f59e0b" />
              </StatsBox>
              <Button type="primary" block style={{ borderRadius: 10, background: 'linear-gradient(135deg, #f59e0b, #d97706)', border: 'none' }} onClick={(e) => { e.stopPropagation(); navigate('/quotations/new'); }}>+ สร้างใบเสนอราคา</Button>
            </div>
          )}

          {/* Card 4: Super Admin */}
          {isAdmin && (
            <div onClick={() => navigate('/admin/users')} style={cardStyle}>
              <Badge text="Admin" gradient="linear-gradient(135deg, #ef4444, #dc2626)" />
              <CardIcon gradient="linear-gradient(135deg, #ef4444, #dc2626)" icon={<SafetyOutlined />} />
              <h3 style={{ fontSize: 18, fontWeight: 600, color: darkMode ? '#fff' : '#1f2937', marginBottom: 4, textAlign: 'center' }}>Super Admin</h3>
              <p style={{ fontSize: 12, color: darkMode ? 'rgba(255,255,255,0.5)' : '#9ca3af', marginBottom: 16, textAlign: 'center' }}>จัดการผู้ใช้และสิทธิ์</p>
              <StatsBox>
                <StatRow icon="👥" label="ผู้ใช้" value={`${adminStats.users} คน`} color={darkMode ? '#fff' : '#1f2937'} />
                <StatRow icon="🔑" label="สิทธิ์" value={`${adminStats.roles} ประเภท`} color="#8b5cf6" />
                <StatRow icon="📋" label="Logs" value={`${adminStats.logs} รายการ`} color="#ef4444" />
              </StatsBox>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button block style={{ borderRadius: 10, background: darkMode ? 'rgba(255,255,255,0.1)' : '#fef2f2', border: 'none', color: '#ef4444', flex: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/admin/users'); }}>👥</Button>
                <Button block style={{ borderRadius: 10, background: darkMode ? 'rgba(255,255,255,0.1)' : '#fef2f2', border: 'none', color: '#ef4444', flex: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/admin/activity-logs'); }}>📋</Button>
                <Button block style={{ borderRadius: 10, background: darkMode ? 'rgba(255,255,255,0.1)' : '#fef2f2', border: 'none', color: '#ef4444', flex: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/settings'); }}>⚙️</Button>
              </div>
            </div>
          )}

          {/* Card 5: Dashboard */}
          {isManager && (
            <div onClick={() => navigate('/dashboard-detail')} style={cardStyle}>
              <Badge text="ผู้บริหาร" gradient="linear-gradient(135deg, #6366f1, #4f46e5)" />
              <CardIcon gradient="linear-gradient(135deg, #6366f1, #4f46e5)" icon={<BarChartOutlined />} />
              <h3 style={{ fontSize: 18, fontWeight: 600, color: darkMode ? '#fff' : '#1f2937', marginBottom: 4, textAlign: 'center' }}>Dashboard</h3>
              <p style={{ fontSize: 12, color: darkMode ? 'rgba(255,255,255,0.5)' : '#9ca3af', marginBottom: 16, textAlign: 'center' }}>ภาพรวมธุรกิจ & รายงาน</p>
              <StatsBox>
                <StatRow icon="💰" label="มูลค่าสต๊อก" value={formatCurrency(dashboardStats.stockValue)} color="#22c55e" />
                <StatRow icon="📦" label="สินค้า" value={`${dashboardStats.products.toLocaleString()} รายการ`} color={darkMode ? '#fff' : '#1f2937'} />
                <StatRow icon="🗂️" label="หมวดหมู่" value={`${dashboardStats.categories} กลุ่ม`} color="#6366f1" />
              </StatsBox>
              <Button type="primary" block style={{ borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none' }}>ดูรายละเอียด →</Button>
            </div>
          )}

          {/* Card 6: ติดตามงานซ่อม */}
          <div onClick={() => message.info('🚧 ฟีเจอร์ติดตามงานซ่อมกำลังพัฒนา เร็วๆ นี้!')} style={cardStyle}>
            <Badge text="เร็วๆ นี้" gradient="linear-gradient(135deg, #f59e0b, #d97706)" />
            <CardIcon gradient="linear-gradient(135deg, #ec4899, #db2777)" icon={<ToolOutlined />} />
            <h3 style={{ fontSize: 18, fontWeight: 600, color: darkMode ? '#fff' : '#1f2937', marginBottom: 4, textAlign: 'center' }}>ติดตามงานซ่อม</h3>
            <p style={{ fontSize: 12, color: darkMode ? 'rgba(255,255,255,0.5)' : '#9ca3af', marginBottom: 16, textAlign: 'center' }}>จัดการงานซ่อมบำรุง</p>
            <StatsBox>
              <StatRow icon="🔴" label="รอดำเนินการ" value={`${repairStats.waiting} งาน`} color="#ef4444" />
              <StatRow icon="🟡" label="กำลังซ่อม" value={`${repairStats.inProgress} งาน`} color="#f59e0b" />
              <StatRow icon="🟢" label="เสร็จแล้ว" value={`${repairStats.completed} งาน`} color="#22c55e" />
            </StatsBox>
            <Button block style={{ borderRadius: 10, background: darkMode ? 'rgba(255,255,255,0.1)' : '#fdf2f8', border: 'none', color: '#ec4899' }}>ดูงานซ่อม</Button>
          </div>

          {/* Card 7: คลังสินค้า */}
          {isStock && (
            <div onClick={() => navigate('/stock-balance')} style={cardStyle}>
              <CardIcon gradient="linear-gradient(135deg, #0ea5e9, #0284c7)" icon={<InboxOutlined />} />
              <h3 style={{ fontSize: 18, fontWeight: 600, color: darkMode ? '#fff' : '#1f2937', marginBottom: 4, textAlign: 'center' }}>คลังสินค้า</h3>
              <p style={{ fontSize: 12, color: darkMode ? 'rgba(255,255,255,0.5)' : '#9ca3af', marginBottom: 16, textAlign: 'center' }}>ดูยอดสต๊อกคงเหลือ</p>
              <StatsBox>
                <StatRow icon="📦" label="สินค้าทั้งหมด" value={`${stockStats.total.toLocaleString()} รายการ`} color={darkMode ? '#fff' : '#1f2937'} />
                <StatRow icon="🔴" label="สต๊อกต่ำ" value={`${stockStats.low} รายการ`} color="#ef4444" />
                <StatRow icon="🟡" label="ใกล้หมด" value={`${stockStats.warning} รายการ`} color="#f59e0b" />
              </StatsBox>
              <Button type="primary" block style={{ borderRadius: 10, background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', border: 'none' }}>ดูคลังสินค้า</Button>
            </div>
          )}

          {/* Card 8: ใบสั่งซื้อ */}
          {isPurchase && (
            <div onClick={() => navigate('/purchase-orders')} style={cardStyle}>
              <CardIcon gradient="linear-gradient(135deg, #a855f7, #9333ea)" icon={<ShoppingCartOutlined />} />
              <h3 style={{ fontSize: 18, fontWeight: 600, color: darkMode ? '#fff' : '#1f2937', marginBottom: 4, textAlign: 'center' }}>ใบสั่งซื้อ</h3>
              <p style={{ fontSize: 12, color: darkMode ? 'rgba(255,255,255,0.5)' : '#9ca3af', marginBottom: 16, textAlign: 'center' }}>จัดการใบสั่งซื้อสินค้า</p>
              <StatsBox>
                <StatRow icon="📋" label="PO ทั้งหมด" value={`${poStats.total} ใบ`} color={darkMode ? '#fff' : '#1f2937'} />
                <StatRow icon="🟡" label="รอรับสินค้า" value={`${poStats.pending} ใบ`} color="#f59e0b" />
                <StatRow icon="💰" label="มูลค่ารวม" value={formatCurrency(poStats.totalAmount)} color="#a855f7" />
              </StatsBox>
              <Button type="primary" block style={{ borderRadius: 10, background: 'linear-gradient(135deg, #a855f7, #9333ea)', border: 'none' }} onClick={(e) => { e.stopPropagation(); navigate('/purchase-orders/new'); }}>+ สร้างใบสั่งซื้อ</Button>
            </div>
          )}

          {/* Card 9: รายงานขาย */}
          {isManager && (
            <div onClick={() => message.info('🚧 ฟีเจอร์รายงานขายกำลังพัฒนา เร็วๆ นี้!')} style={cardStyle}>
              <Badge text="ผู้บริหาร" gradient="linear-gradient(135deg, #6366f1, #4f46e5)" />
              <CardIcon gradient="linear-gradient(135deg, #22c55e, #16a34a)" icon={<DollarOutlined />} />
              <h3 style={{ fontSize: 18, fontWeight: 600, color: darkMode ? '#fff' : '#1f2937', marginBottom: 4, textAlign: 'center' }}>รายงานขาย</h3>
              <p style={{ fontSize: 12, color: darkMode ? 'rgba(255,255,255,0.5)' : '#9ca3af', marginBottom: 16, textAlign: 'center' }}>ดูยอดขายและเป้าหมาย</p>
              <StatsBox>
                <StatRow icon="💰" label="ยอดขายเดือนนี้" value={formatCurrency(salesStats.monthly)} color="#22c55e" />
                <StatRow icon="📈" label="เทียบเดือนก่อน" value={`+${salesStats.compared}%`} color="#22c55e" />
                <StatRow icon="🎯" label="เป้าหมาย" value={`${salesStats.target}%`} color="#f59e0b" />
              </StatsBox>
              <Button block style={{ borderRadius: 10, background: darkMode ? 'rgba(255,255,255,0.1)' : '#f0fdf4', border: 'none', color: '#22c55e' }}>ดูรายงาน</Button>
            </div>
          )}

          {/* Card 10: ติดตามคู่สัญญา */}
          {isManager && (
            <div onClick={() => message.info('🚧 ฟีเจอร์ติดตามคู่สัญญากำลังพัฒนา เร็วๆ นี้!')} style={cardStyle}>
              <Badge text="เร็วๆ นี้" gradient="linear-gradient(135deg, #f59e0b, #d97706)" />
              <CardIcon gradient="linear-gradient(135deg, #f43f5e, #e11d48)" icon={<FileSearchOutlined />} />
              <h3 style={{ fontSize: 18, fontWeight: 600, color: darkMode ? '#fff' : '#1f2937', marginBottom: 4, textAlign: 'center' }}>ติดตามคู่สัญญา</h3>
              <p style={{ fontSize: 12, color: darkMode ? 'rgba(255,255,255,0.5)' : '#9ca3af', marginBottom: 16, textAlign: 'center' }}>จัดการสัญญาและวันครบกำหนด</p>
              <StatsBox>
                <StatRow icon="⚠️" label="ใกล้ครบ 30 วัน" value={`${contractStats.expiring30} คู่สัญญา`} color="#f59e0b" />
                <StatRow icon="💰" label="ยอดทั้งหมด" value={formatCurrency(contractStats.totalValue)} color={darkMode ? '#fff' : '#1f2937'} />
                <StatRow icon="📅" label="ครบกำหนดเร็วสุด" value={contractStats.nextExpiry} color="#ef4444" />
              </StatsBox>
              <Button block style={{ borderRadius: 10, background: darkMode ? 'rgba(255,255,255,0.1)' : '#fff1f2', border: 'none', color: '#f43f5e' }}>ดูคู่สัญญา</Button>
            </div>
          )}

          {/* Card 11: ระบบบัญชี */}
          {isAccount && (
            <div onClick={() => navigate('/accounting/journal-entries')} style={cardStyle}>
              <Badge text="บัญชี" gradient="linear-gradient(135deg, #14b8a6, #0d9488)" />
              <CardIcon gradient="linear-gradient(135deg, #14b8a6, #0d9488)" icon={<CalculatorOutlined />} />
              <h3 style={{ fontSize: 18, fontWeight: 600, color: darkMode ? '#fff' : '#1f2937', marginBottom: 4, textAlign: 'center' }}>ระบบบัญชี</h3>
              <p style={{ fontSize: 12, color: darkMode ? 'rgba(255,255,255,0.5)' : '#9ca3af', marginBottom: 16, textAlign: 'center' }}>บันทึกบัญชี & รายงานการเงิน</p>
              <StatsBox>
                <StatRow icon="📝" label="รายการบันทึก" value={`${accountingStats.journalEntries} รายการ`} color={darkMode ? '#fff' : '#1f2937'} />
                <StatRow icon="📥" label="ลูกหนี้ค้างรับ" value={formatCurrency(accountingStats.totalAR)} color="#22c55e" />
                <StatRow icon="📤" label="เจ้าหนี้ค้างจ่าย" value={formatCurrency(accountingStats.totalAP)} color="#ef4444" />
              </StatsBox>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button block style={{ borderRadius: 10, background: darkMode ? 'rgba(255,255,255,0.1)' : '#f0fdfa', border: 'none', color: '#14b8a6', flex: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/accounting/journal-entries'); }}>📒</Button>
                <Button block style={{ borderRadius: 10, background: darkMode ? 'rgba(255,255,255,0.1)' : '#f0fdfa', border: 'none', color: '#14b8a6', flex: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/accounting/payment-receipts'); }}>💵</Button>
                <Button block style={{ borderRadius: 10, background: darkMode ? 'rgba(255,255,255,0.1)' : '#f0fdfa', border: 'none', color: '#14b8a6', flex: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/accounting/financial-reports'); }}>📊</Button>
              </div>
            </div>
          )}

          {/* Card 12: ภาษี & เอกสาร */}
          {isAccount && (
            <div onClick={() => navigate('/accounting/tax-invoices')} style={cardStyle}>
              <Badge text="บัญชี" gradient="linear-gradient(135deg, #14b8a6, #0d9488)" />
              <CardIcon gradient="linear-gradient(135deg, #8b5cf6, #7c3aed)" icon={<AuditOutlined />} />
              <h3 style={{ fontSize: 18, fontWeight: 600, color: darkMode ? '#fff' : '#1f2937', marginBottom: 4, textAlign: 'center' }}>ภาษี & เอกสาร</h3>
              <p style={{ fontSize: 12, color: darkMode ? 'rgba(255,255,255,0.5)' : '#9ca3af', marginBottom: 16, textAlign: 'center' }}>ใบกำกับภาษี หัก ณ ที่จ่าย VAT</p>
              <StatsBox>
                <StatRow icon="🧾" label="ใบกำกับภาษี" value="ออกใบกำกับ" color={darkMode ? '#fff' : '#1f2937'} />
                <StatRow icon="📋" label="หัก ณ ที่จ่าย" value="ภ.ง.ด." color="#8b5cf6" />
                <StatRow icon="📑" label="รายงาน VAT" value="ภ.พ.30" color="#f59e0b" />
              </StatsBox>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button block style={{ borderRadius: 10, background: darkMode ? 'rgba(255,255,255,0.1)' : '#faf5ff', border: 'none', color: '#8b5cf6', flex: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/accounting/tax-invoices'); }}>🧾</Button>
                <Button block style={{ borderRadius: 10, background: darkMode ? 'rgba(255,255,255,0.1)' : '#faf5ff', border: 'none', color: '#8b5cf6', flex: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/accounting/withholding-tax'); }}>📋</Button>
                <Button block style={{ borderRadius: 10, background: darkMode ? 'rgba(255,255,255,0.1)' : '#faf5ff', border: 'none', color: '#8b5cf6', flex: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/accounting/vat-report'); }}>📑</Button>
              </div>
            </div>
          )}

          {/* Card 13: สินทรัพย์ & ธนาคาร */}
          {isAccount && (
            <div onClick={() => navigate('/accounting/fixed-assets')} style={cardStyle}>
              <Badge text="บัญชี" gradient="linear-gradient(135deg, #14b8a6, #0d9488)" />
              <CardIcon gradient="linear-gradient(135deg, #f59e0b, #d97706)" icon={<BankOutlined />} />
              <h3 style={{ fontSize: 18, fontWeight: 600, color: darkMode ? '#fff' : '#1f2937', marginBottom: 4, textAlign: 'center' }}>สินทรัพย์ & ธนาคาร</h3>
              <p style={{ fontSize: 12, color: darkMode ? 'rgba(255,255,255,0.5)' : '#9ca3af', marginBottom: 16, textAlign: 'center' }}>ทะเบียนสินทรัพย์ กระทบยอด</p>
              <StatsBox>
                <StatRow icon="🏢" label="สินทรัพย์ถาวร" value="ทะเบียน FA" color={darkMode ? '#fff' : '#1f2937'} />
                <StatRow icon="🏦" label="กระทบยอดธนาคาร" value="Bank Recon" color="#f59e0b" />
                <StatRow icon="💳" label="ผังบัญชี" value="COA" color="#0ea5e9" />
              </StatsBox>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button block style={{ borderRadius: 10, background: darkMode ? 'rgba(255,255,255,0.1)' : '#fffbeb', border: 'none', color: '#f59e0b', flex: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/accounting/fixed-assets'); }}>🏢</Button>
                <Button block style={{ borderRadius: 10, background: darkMode ? 'rgba(255,255,255,0.1)' : '#fffbeb', border: 'none', color: '#f59e0b', flex: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/accounting/bank-reconciliation'); }}>🏦</Button>
                <Button block style={{ borderRadius: 10, background: darkMode ? 'rgba(255,255,255,0.1)' : '#fffbeb', border: 'none', color: '#f59e0b', flex: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/accounting/chart-of-accounts'); }}>💳</Button>
              </div>
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: 60, color: darkMode ? 'rgba(255,255,255,0.3)' : '#9ca3af', fontSize: 12 }}>Developed by Boy © Autthapol Saiyat</div>
      </div>

      {/* Profile Modal */}
      <Modal title={null} open={profileModalOpen} onCancel={() => { setProfileModalOpen(false); setCardFlipped(false); }} footer={null} width={400} centered styles={{ content: { background: 'transparent', boxShadow: 'none', padding: 0 }, body: { padding: 0 } }}>
        <div onDoubleClick={() => setCardFlipped(!cardFlipped)} style={{ perspective: '1000px', cursor: 'pointer' }}>
          <div style={{ position: 'relative', width: '100%', height: 420, transformStyle: 'preserve-3d', transition: 'transform 0.6s ease', transform: cardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
            <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)' }}>
              <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #0d2137 100%)', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div><div style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>SAENGVITH SCIENCE</div><div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10 }}>Scientific Equipment & Services</div></div>
                <div style={{ background: '#fff', borderRadius: 6, padding: 6 }}><QRCodeSVG value={vCardData} size={50} level="M" /></div>
              </div>
              <div style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                  <Avatar size={60} icon={<UserOutlined />} style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }} />
                  <div><h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1f2937' }}>{businessCard.name}</h2><p style={{ margin: '2px 0 0', fontSize: 13, color: '#3b82f6', fontWeight: 600 }}>{businessCard.position}</p><p style={{ margin: '2px 0 0', fontSize: 11, color: '#6b7280' }}>{businessCard.department}</p></div>
                </div>
                <div style={{ height: 1, background: '#e5e7eb', margin: '16px 0' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ fontSize: 16 }}>📱</span><div><div style={{ fontSize: 10, color: '#9ca3af' }}>โทรศัพท์</div><div style={{ fontSize: 13, color: '#1f2937', fontWeight: 500 }}>{businessCard.phone}</div></div></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ fontSize: 16 }}>✉️</span><div><div style={{ fontSize: 10, color: '#9ca3af' }}>อีเมล</div><div style={{ fontSize: 13, color: '#1f2937', fontWeight: 500 }}>{businessCard.email}</div></div></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ fontSize: 16 }}>🏢</span><div><div style={{ fontSize: 10, color: '#9ca3af' }}>บริษัท</div><div style={{ fontSize: 13, color: '#1f2937', fontWeight: 500 }}>{businessCard.company}</div></div></div>
                </div>
              </div>
              <div style={{ textAlign: 'center', padding: '8px 0', color: '#9ca3af', fontSize: 10 }}>👆 แตะสองครั้งเพื่อดูรายละเอียดเพิ่มเติม</div>
            </div>
            <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: 'linear-gradient(135deg, #1e3a5f 0%, #0d2137 100%)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}><div style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>📋 ข้อมูลเพิ่มเติม</div></div>
              <div style={{ padding: '20px 24px', color: '#fff' }}>
                <div style={{ marginBottom: 20 }}><div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>🗓️ ประสบการณ์ทำงาน</div><div style={{ fontSize: 22, fontWeight: 700, color: '#22d3ee' }}>{businessCard.experience}</div><div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>เริ่มงาน: {businessCard.startDate}</div></div>
                <div style={{ marginBottom: 20 }}><div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>💡 ความเชี่ยวชาญ</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{businessCard.skills.map((s: string, i: number) => <span key={i} style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 11 }}>{s}</span>)}</div></div>
              </div>
              <div style={{ textAlign: 'center', padding: '8px 0', color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>👆 แตะสองครั้งเพื่อกลับด้านหน้า</div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 16 }}>
          <Button type="primary" icon={<ShareAltOutlined />} onClick={shareCard} style={{ borderRadius: 8 }}>แชร์</Button>
          <Button icon={<CopyOutlined />} onClick={copyToClipboard} style={{ borderRadius: 8 }}>คัดลอก</Button>
          <Button icon={<EditOutlined />} onClick={() => navigate('/profile')} style={{ borderRadius: 8 }}>แก้ไข</Button>
        </div>
      </Modal>
    </div>
  );
};

export default IntroPage;
