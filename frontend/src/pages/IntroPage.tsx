import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Avatar, Modal, Switch, message, Spin } from 'antd';
import { 
  UserOutlined, SafetyOutlined, EnvironmentOutlined, FileTextOutlined,
  ShareAltOutlined, CopyOutlined, EditOutlined, SettingOutlined,
  AppstoreOutlined, TeamOutlined, BarChartOutlined, ToolOutlined,
  InboxOutlined, ShoppingCartOutlined, DollarOutlined, AuditOutlined
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
  
  const [quotationStats, setQuotationStats] = useState({ total: 0, ordered: 0, totalAmount: 0 });
  const [adminStats, setAdminStats] = useState({ users: 0, roles: 0, logs: 0 });
  const [dashboardStats, setDashboardStats] = useState({ stockValue: 0, products: 0, categories: 0 });
  const [stockStats, setStockStats] = useState({ total: 0, low: 0, warning: 0 });
  const [poStats, setPoStats] = useState({ total: 0, pending: 0, totalAmount: 0 });
  const [profile, setProfile] = useState<any>({});
  
  const checkInStats = { present: 18, leave: 2, month: 'ธ.ค. 2568' };
  const repairStats = { pending: 5, inProgress: 3, completed: 12 };
  const salesStats = { thisMonth: 2500000, growth: 12.5, target: 75 };
  const contractStats = { expiring: 20, totalValue: 10000000, nearestDate: '15 ม.ค. 68' };

  const isSuperAdmin = user?.roles?.includes('SUPER_ADMIN');
  const isAdmin = isSuperAdmin || user?.roles?.includes('ADMIN');
  const isManager = isSuperAdmin || user?.roles?.some((r: string) => ['ADMIN', 'MANAGER'].includes(r));
  const isSales = isSuperAdmin || user?.roles?.some((r: string) => ['ADMIN', 'SALES', 'SALES_STANDARD', 'SALES_FORENSIC', 'SALES_TOOLLAB', 'SALES_MAINTENANCE'].includes(r));
  const isStock = isSuperAdmin || user?.roles?.some((r: string) => ['ADMIN', 'STOCK', 'WAREHOUSE'].includes(r));
  const isPurchase = isSuperAdmin || user?.roles?.some((r: string) => ['ADMIN', 'PURCHASE', 'MANAGER'].includes(r));

  useEffect(() => { localStorage.setItem('darkMode', String(darkMode)); }, [darkMode]);
  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      try { const profileRes = await api.get('/api/user-settings/profile'); setProfile(profileRes.data || {}); } catch (e) {}
      if (isSales) { try { const qtRes = await api.get('/quotations'); const quotations = qtRes.data || []; const ordered = quotations.filter((q: any) => q.status === 'ORDERED' || q.status === 'CONFIRMED'); setQuotationStats({ total: quotations.length, ordered: ordered.length, totalAmount: quotations.reduce((sum: number, q: any) => sum + (q.totalAmount || 0), 0) }); } catch (e) {} }
      if (isAdmin) { try { const [usersRes, rolesRes] = await Promise.all([api.get('/users'), api.get('/roles')]); setAdminStats({ users: usersRes.data?.length || 0, roles: rolesRes.data?.length || 0, logs: 156 }); } catch (e) {} }
      if (isManager || isStock) { try { const [productsRes, stockRes] = await Promise.all([api.get('/api/products'), api.get('/api/stock/balance')]); const products = productsRes.data || []; const stockBalances = stockRes.data || []; const totalValue = stockBalances.reduce((sum: number, sb: any) => sum + (parseFloat(sb.qtyOnHand || sb.qty_on_hand || 0) * parseFloat(sb.avgCost || sb.avg_cost || 0)), 0); const categories = new Set(products.map((p: any) => p.category?.name).filter(Boolean)); let low = 0, warning = 0; stockBalances.forEach((sb: any) => { const qty = parseFloat(sb.qtyOnHand || sb.qty_on_hand || 0); if (qty <= 0) low++; else if (qty < 5) warning++; }); setDashboardStats({ stockValue: totalValue, products: products.length, categories: categories.size }); setStockStats({ total: products.length, low, warning }); } catch (e) {} }
      if (isPurchase) { try { const poRes = await api.get('/api/purchase-orders'); const pos = poRes.data || []; setPoStats({ total: pos.length, pending: pos.filter((po: any) => po.status === 'PENDING' || po.status === 'APPROVED').length, totalAmount: pos.reduce((sum: number, po: any) => sum + (po.totalAmount || 0), 0) }); } catch (e) {} }
    } catch (error) { console.error('Error:', error); }
    setLoading(false);
  };

  const firstName = user?.fullName?.split(' ').pop() || user?.fullName?.split(' ')[0] || 'User';
  const calculateExperience = (startDate: string) => { if (!startDate) return ''; try { const parts = startDate.split(' '); const thaiMonths: Record<string, number> = { 'ม.ค.': 0, 'ก.พ.': 1, 'มี.ค.': 2, 'เม.ย.': 3, 'พ.ค.': 4, 'มิ.ย.': 5, 'ก.ค.': 6, 'ส.ค.': 7, 'ก.ย.': 8, 'ต.ค.': 9, 'พ.ย.': 10, 'ธ.ค.': 11 }; const start = new Date(parseInt(parts[2]) - 543, thaiMonths[parts[1]] || 0, parseInt(parts[0])); return Math.floor((new Date().getTime() - start.getTime()) / (365.25 * 24 * 60 * 60 * 1000)) + ' ปี'; } catch { return ''; } };
  const businessCard = { name: user?.fullName || 'ไม่ระบุชื่อ', position: profile?.position || '', department: profile?.department || '', phone: profile?.phone || '', email: user?.email || '', company: 'บริษัท แสงวิทย์ ซายน์ จำกัด', startDate: profile?.startDate || '', experience: profile?.startDate ? calculateExperience(profile.startDate) : '', skills: profile?.skills ? profile.skills.split(',').map((s: string) => s.trim()).filter(Boolean) : [] };
  const vCardData = `BEGIN:VCARD\nVERSION:3.0\nFN:${businessCard.name}\nORG:${businessCard.company}\nTITLE:${businessCard.position}\nTEL:${businessCard.phone}\nEMAIL:${businessCard.email}\nEND:VCARD`;
  const shareCard = async () => { if (navigator.share) { await navigator.share({ title: businessCard.name, text: `${businessCard.name} - ${businessCard.position}\n${businessCard.phone}\n${businessCard.email}` }); } else { copyToClipboard(); } };
  const copyToClipboard = () => { navigator.clipboard.writeText(`${businessCard.name}\n${businessCard.position}\n${businessCard.phone}\n${businessCard.email}`); message.success('คัดลอกข้อมูลแล้ว'); };
  const formatCurrency = (amount: number) => { if (amount >= 1000000) return `฿${(amount / 1000000).toFixed(1)}M`; if (amount >= 1000) return `฿${(amount / 1000).toFixed(0)}K`; return `฿${amount.toFixed(0)}`; };

  const cardStyle = { width: 280, padding: 24, borderRadius: 20, background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)', cursor: 'pointer', transition: 'all 0.3s ease', position: 'relative' as const };
  const statBoxStyle = { background: darkMode ? 'rgba(255,255,255,0.05)' : '#f8fafc', borderRadius: 12, padding: 12, marginBottom: 12 };
  const statRowStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: 8 };
  const labelStyle = { fontSize: 12, color: darkMode ? 'rgba(255,255,255,0.6)' : '#6b7280' };
  const valueStyle = (color: string) => ({ fontSize: 14, fontWeight: 600, color });
  const titleStyle = { fontSize: 18, fontWeight: 600, color: darkMode ? '#fff' : '#1f2937', marginBottom: 4, textAlign: 'center' as const };
  const descStyle = { fontSize: 12, color: darkMode ? 'rgba(255,255,255,0.5)' : '#9ca3af', marginBottom: 16, textAlign: 'center' as const };
  const badgeStyle = (gradient: string) => ({ position: 'absolute' as const, top: 12, right: 12, padding: '4px 10px', borderRadius: 10, background: gradient, color: '#fff', fontSize: 10, fontWeight: 600 });
  const iconCircleStyle = (gradient: string) => ({ width: 64, height: 64, borderRadius: '50%', background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28, color: '#fff' });
  const handleCardHover = (e: React.MouseEvent<HTMLDivElement>, shadowColor: string, isEnter: boolean) => { if (isEnter) { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = `0 20px 40px ${shadowColor}`; } else { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; } };

  return (
    <div style={{ minHeight: '100vh', background: darkMode ? 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)' : 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 50%, #cbd5e1 100%)', padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1400, margin: '0 auto 40px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#22c55e', margin: 0 }}>SVS Business Suite</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Switch checked={darkMode} onChange={setDarkMode} checkedChildren="🌙" unCheckedChildren="☀️" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 16px', borderRadius: 12, background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}>
            <Avatar icon={<UserOutlined />} style={{ background: '#3b82f6' }} />
            <div>
              <div style={{ fontWeight: 600, color: darkMode ? '#fff' : '#1f2937', fontSize: 14 }}>{user?.fullName}</div>
              <div style={{ fontSize: 11, color: darkMode ? 'rgba(255,255,255,0.6)' : '#6b7280' }}>{user?.roles?.join(', ')}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h2 style={{ fontSize: 32, color: darkMode ? '#fbbf24' : '#d97706', marginBottom: 8 }}>สวัสดี, {firstName}! 👋</h2>
        <p style={{ color: darkMode ? 'rgba(255,255,255,0.6)' : '#6b7280' }}>เลือกสิ่งที่ต้องการทำวันนี้</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 24, maxWidth: 1400, margin: '0 auto 40px' }}>
        
        {/* Card 1: นามบัตร */}
        <div onClick={() => setProfileModalOpen(true)} style={cardStyle} onMouseEnter={(e) => handleCardHover(e, 'rgba(59,130,246,0.2)', true)} onMouseLeave={(e) => handleCardHover(e, '', false)}>
          <div style={iconCircleStyle('linear-gradient(135deg, #3b82f6, #8b5cf6)')}><UserOutlined /></div>
          <h3 style={titleStyle}>นามบัตร</h3>
          <p style={descStyle}>ดูและแชร์ข้อมูลติดต่อ</p>
          <div style={statBoxStyle}>
            <div style={{ fontSize: 13, fontWeight: 600, color: darkMode ? '#fff' : '#1f2937' }}>{businessCard.name}</div>
            <div style={{ fontSize: 11, color: darkMode ? 'rgba(255,255,255,0.6)' : '#6b7280' }}>{businessCard.position}</div>
            <div style={{ fontSize: 11, color: '#3b82f6', marginTop: 4 }}>📱 {businessCard.phone}</div>
          </div>
          <Button type="primary" block style={{ borderRadius: 10, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', border: 'none' }} icon={<ShareAltOutlined />} onClick={(e) => { e.stopPropagation(); shareCard(); }}>แชร์นามบัตร</Button>
        </div>

        {/* Card 2: เช็คอิน */}
        <div onClick={() => message.info('🚧 ฟีเจอร์เช็คอินกำลังพัฒนา เร็วๆ นี้!')} style={cardStyle} onMouseEnter={(e) => handleCardHover(e, 'rgba(16,185,129,0.2)', true)} onMouseLeave={(e) => handleCardHover(e, '', false)}>
          <div style={badgeStyle('linear-gradient(135deg, #f59e0b, #d97706)')}>เร็วๆ นี้</div>
          <div style={iconCircleStyle('linear-gradient(135deg, #10b981, #059669)')}><EnvironmentOutlined /></div>
          <h3 style={titleStyle}>เช็คอิน</h3>
          <p style={descStyle}>บันทึกเวลาเข้า-ออกงาน</p>
          <div style={statBoxStyle}>
            <div style={statRowStyle}><span style={labelStyle}>✅ เข้างาน</span><span style={valueStyle('#10b981')}>{checkInStats.present} วัน</span></div>
            <div style={statRowStyle}><span style={labelStyle}>❌ ลา</span><span style={valueStyle('#ef4444')}>{checkInStats.leave} วัน</span></div>
            <div style={{ fontSize: 11, color: darkMode ? 'rgba(255,255,255,0.4)' : '#9ca3af', textAlign: 'center' }}>📅 {checkInStats.month}</div>
          </div>
          <Button block style={{ borderRadius: 10, background: darkMode ? 'rgba(255,255,255,0.1)' : '#f0fdf4', border: 'none', color: '#10b981' }}>⏰ เช็คอิน</Button>
        </div>

        {/* Card 3: ใบเสนอราคา */}
        {isSales && (
          <div onClick={() => navigate('/quotations')} style={cardStyle} onMouseEnter={(e) => handleCardHover(e, 'rgba(245,158,11,0.2)', true)} onMouseLeave={(e) => handleCardHover(e, '', false)}>
            <div style={iconCircleStyle('linear-gradient(135deg, #f59e0b, #d97706)')}><FileTextOutlined /></div>
            <h3 style={titleStyle}>ใบเสนอราคา</h3>
            <p style={descStyle}>สร้างและจัดการใบเสนอราคา</p>
            <div style={statBoxStyle}>
              {loading ? <div style={{ textAlign: 'center', padding: 10 }}><Spin size="small" /></div> : <>
                <div style={statRowStyle}><span style={labelStyle}>📋 สร้างแล้ว</span><span style={valueStyle(darkMode ? '#fff' : '#1f2937')}>{quotationStats.total} ใบ</span></div>
                <div style={statRowStyle}><span style={labelStyle}>✅ สั่งซื้อแล้ว</span><span style={valueStyle('#10b981')}>{quotationStats.ordered} ใบ</span></div>
                <div style={statRowStyle}><span style={labelStyle}>💰 ยอดรวม</span><span style={valueStyle('#f59e0b')}>{formatCurrency(quotationStats.totalAmount)}</span></div>
              </>}
            </div>
            <Button type="primary" block style={{ borderRadius: 10, background: 'linear-gradient(135deg, #f59e0b, #d97706)', border: 'none' }} onClick={(e) => { e.stopPropagation(); navigate('/quotations/new'); }}>+ สร้างใบเสนอราคา</Button>
          </div>
        )}

        {/* Card 4: Super Admin */}
        {isAdmin && (
          <div onClick={() => navigate('/admin/users')} style={cardStyle} onMouseEnter={(e) => handleCardHover(e, 'rgba(239,68,68,0.2)', true)} onMouseLeave={(e) => handleCardHover(e, '', false)}>
            <div style={badgeStyle('linear-gradient(135deg, #ef4444, #dc2626)')}>Admin</div>
            <div style={iconCircleStyle('linear-gradient(135deg, #ef4444, #dc2626)')}><SafetyOutlined /></div>
            <h3 style={titleStyle}>Super Admin</h3>
            <p style={descStyle}>จัดการผู้ใช้และสิทธิ์</p>
            <div style={statBoxStyle}>
              {loading ? <div style={{ textAlign: 'center', padding: 10 }}><Spin size="small" /></div> : <>
                <div style={statRowStyle}><span style={labelStyle}>👥 ผู้ใช้</span><span style={valueStyle(darkMode ? '#fff' : '#1f2937')}>{adminStats.users} คน</span></div>
                <div style={statRowStyle}><span style={labelStyle}>🔑 สิทธิ์</span><span style={valueStyle('#8b5cf6')}>{adminStats.roles} ประเภท</span></div>
                <div style={statRowStyle}><span style={labelStyle}>📋 Logs</span><span style={valueStyle('#ef4444')}>{adminStats.logs} รายการ</span></div>
              </>}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button block style={{ borderRadius: 10, background: darkMode ? 'rgba(255,255,255,0.1)' : '#fef2f2', border: 'none', color: '#ef4444', flex: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/admin/users'); }}>👥</Button>
              <Button block style={{ borderRadius: 10, background: darkMode ? 'rgba(255,255,255,0.1)' : '#fef2f2', border: 'none', color: '#ef4444', flex: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/admin/activity-logs'); }}>📋</Button>
              <Button block style={{ borderRadius: 10, background: darkMode ? 'rgba(255,255,255,0.1)' : '#fef2f2', border: 'none', color: '#ef4444', flex: 1 }} onClick={(e) => { e.stopPropagation(); navigate('/settings'); }}>⚙️</Button>
            </div>
          </div>
        )}

        {/* Card 5: Dashboard */}
        {isManager && (
          <div onClick={() => navigate('/dashboard-detail')} style={cardStyle} onMouseEnter={(e) => handleCardHover(e, 'rgba(102,126,234,0.3)', true)} onMouseLeave={(e) => handleCardHover(e, '', false)}>
            <div style={badgeStyle('linear-gradient(135deg, #667eea, #764ba2)')}>ผู้บริหาร</div>
            <div style={iconCircleStyle('linear-gradient(135deg, #667eea, #764ba2)')}><BarChartOutlined /></div>
            <h3 style={titleStyle}>Dashboard</h3>
            <p style={descStyle}>ภาพรวมธุรกิจ & รายงาน</p>
            <div style={statBoxStyle}>
              {loading ? <div style={{ textAlign: 'center', padding: 10 }}><Spin size="small" /></div> : <>
                <div style={statRowStyle}><span style={labelStyle}>💰 มูลค่าสต็อก</span><span style={valueStyle('#667eea')}>{formatCurrency(dashboardStats.stockValue)}</span></div>
                <div style={statRowStyle}><span style={labelStyle}>📦 สินค้า</span><span style={valueStyle(darkMode ? '#fff' : '#1f2937')}>{dashboardStats.products.toLocaleString()} รายการ</span></div>
                <div style={statRowStyle}><span style={labelStyle}>📊 หมวดหมู่</span><span style={valueStyle('#8b5cf6')}>{dashboardStats.categories} กลุ่ม</span></div>
              </>}
            </div>
            <Button type="primary" block style={{ borderRadius: 10, background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none' }} onClick={(e) => { e.stopPropagation(); navigate('/dashboard-detail'); }}>ดูรายละเอียด →</Button>
          </div>
        )}

        {/* Card 6: ติดตามงานซ่อม */}
        <div onClick={() => message.info('🚧 ฟีเจอร์ติดตามงานซ่อมกำลังพัฒนา!')} style={cardStyle} onMouseEnter={(e) => handleCardHover(e, 'rgba(168,85,247,0.2)', true)} onMouseLeave={(e) => handleCardHover(e, '', false)}>
          <div style={badgeStyle('linear-gradient(135deg, #a855f7, #7c3aed)')}>เร็วๆ นี้</div>
          <div style={iconCircleStyle('linear-gradient(135deg, #a855f7, #7c3aed)')}><ToolOutlined /></div>
          <h3 style={titleStyle}>ติดตามงานซ่อม</h3>
          <p style={descStyle}>จัดการงานซ่อมบำรุง</p>
          <div style={statBoxStyle}>
            <div style={statRowStyle}><span style={labelStyle}>🔴 รอดำเนินการ</span><span style={valueStyle('#ef4444')}>{repairStats.pending} งาน</span></div>
            <div style={statRowStyle}><span style={labelStyle}>🟡 กำลังซ่อม</span><span style={valueStyle('#f59e0b')}>{repairStats.inProgress} งาน</span></div>
            <div style={statRowStyle}><span style={labelStyle}>🟢 เสร็จแล้ว</span><span style={valueStyle('#10b981')}>{repairStats.completed} งาน</span></div>
          </div>
          <Button block style={{ borderRadius: 10, background: darkMode ? 'rgba(255,255,255,0.1)' : '#faf5ff', border: 'none', color: '#a855f7' }}>ดูงานซ่อม</Button>
        </div>

        {/* Card 7: คลังสินค้า */}
        {(isStock || isManager) && (
          <div onClick={() => navigate('/stock-balance')} style={cardStyle} onMouseEnter={(e) => handleCardHover(e, 'rgba(6,182,212,0.2)', true)} onMouseLeave={(e) => handleCardHover(e, '', false)}>
            <div style={iconCircleStyle('linear-gradient(135deg, #06b6d4, #0891b2)')}><InboxOutlined /></div>
            <h3 style={titleStyle}>คลังสินค้า</h3>
            <p style={descStyle}>ดูยอดสต็อกคงเหลือ</p>
            <div style={statBoxStyle}>
              {loading ? <div style={{ textAlign: 'center', padding: 10 }}><Spin size="small" /></div> : <>
                <div style={statRowStyle}><span style={labelStyle}>📦 สินค้าทั้งหมด</span><span style={valueStyle(darkMode ? '#fff' : '#1f2937')}>{stockStats.total.toLocaleString()} รายการ</span></div>
                <div style={statRowStyle}><span style={labelStyle}>🔴 สต็อกต่ำ</span><span style={valueStyle('#ef4444')}>{stockStats.low} รายการ</span></div>
                <div style={statRowStyle}><span style={labelStyle}>🟡 ใกล้หมด</span><span style={valueStyle('#f59e0b')}>{stockStats.warning} รายการ</span></div>
              </>}
            </div>
            <Button type="primary" block style={{ borderRadius: 10, background: 'linear-gradient(135deg, #06b6d4, #0891b2)', border: 'none' }} onClick={(e) => { e.stopPropagation(); navigate('/stock-balance'); }}>ดูคลังสินค้า</Button>
          </div>
        )}

        {/* Card 8: ใบสั่งซื้อ */}
        {isPurchase && (
          <div onClick={() => navigate('/purchase-orders')} style={cardStyle} onMouseEnter={(e) => handleCardHover(e, 'rgba(236,72,153,0.2)', true)} onMouseLeave={(e) => handleCardHover(e, '', false)}>
            <div style={iconCircleStyle('linear-gradient(135deg, #ec4899, #db2777)')}><ShoppingCartOutlined /></div>
            <h3 style={titleStyle}>ใบสั่งซื้อ</h3>
            <p style={descStyle}>จัดการใบสั่งซื้อสินค้า</p>
            <div style={statBoxStyle}>
              {loading ? <div style={{ textAlign: 'center', padding: 10 }}><Spin size="small" /></div> : <>
                <div style={statRowStyle}><span style={labelStyle}>📋 PO ทั้งหมด</span><span style={valueStyle(darkMode ? '#fff' : '#1f2937')}>{poStats.total} ใบ</span></div>
                <div style={statRowStyle}><span style={labelStyle}>🕐 รอรับสินค้า</span><span style={valueStyle('#f59e0b')}>{poStats.pending} ใบ</span></div>
                <div style={statRowStyle}><span style={labelStyle}>💰 มูลค่ารวม</span><span style={valueStyle('#ec4899')}>{formatCurrency(poStats.totalAmount)}</span></div>
              </>}
            </div>
            <Button type="primary" block style={{ borderRadius: 10, background: 'linear-gradient(135deg, #ec4899, #db2777)', border: 'none' }} onClick={(e) => { e.stopPropagation(); navigate('/purchase-orders'); }}>+ สร้างใบสั่งซื้อ</Button>
          </div>
        )}

        {/* Card 9: รายงานขาย */}
        {isManager && (
          <div onClick={() => message.info('🚧 ฟีเจอร์รายงานขายกำลังพัฒนา!')} style={cardStyle} onMouseEnter={(e) => handleCardHover(e, 'rgba(34,197,94,0.2)', true)} onMouseLeave={(e) => handleCardHover(e, '', false)}>
            <div style={badgeStyle('linear-gradient(135deg, #22c55e, #16a34a)')}>ผู้บริหาร</div>
            <div style={iconCircleStyle('linear-gradient(135deg, #22c55e, #16a34a)')}><DollarOutlined /></div>
            <h3 style={titleStyle}>รายงานขาย</h3>
            <p style={descStyle}>ดูยอดขายและเป้าหมาย</p>
            <div style={statBoxStyle}>
              <div style={statRowStyle}><span style={labelStyle}>📈 ยอดขายเดือนนี้</span><span style={valueStyle('#22c55e')}>{formatCurrency(salesStats.thisMonth)}</span></div>
              <div style={statRowStyle}><span style={labelStyle}>📊 เทียบเดือนก่อน</span><span style={valueStyle('#10b981')}>+{salesStats.growth}%</span></div>
              <div style={statRowStyle}><span style={labelStyle}>🎯 เป้าหมาย</span><span style={valueStyle('#f59e0b')}>{salesStats.target}%</span></div>
            </div>
            <Button block style={{ borderRadius: 10, background: darkMode ? 'rgba(255,255,255,0.1)' : '#f0fdf4', border: 'none', color: '#22c55e' }}>ดูรายงาน</Button>
          </div>
        )}

        {/* Card 10: ติดตามคู่สัญญา */}
        {isManager && (
          <div onClick={() => message.info('🚧 ฟีเจอร์ติดตามคู่สัญญากำลังพัฒนา!')} style={cardStyle} onMouseEnter={(e) => handleCardHover(e, 'rgba(251,146,60,0.2)', true)} onMouseLeave={(e) => handleCardHover(e, '', false)}>
            <div style={badgeStyle('linear-gradient(135deg, #fb923c, #ea580c)')}>เร็วๆ นี้</div>
            <div style={iconCircleStyle('linear-gradient(135deg, #fb923c, #ea580c)')}><AuditOutlined /></div>
            <h3 style={titleStyle}>ติดตามคู่สัญญา</h3>
            <p style={descStyle}>จัดการสัญญาและวันครบกำหนด</p>
            <div style={statBoxStyle}>
              <div style={statRowStyle}><span style={labelStyle}>⏰ ใกล้ครบ 30 วัน</span><span style={valueStyle('#fb923c')}>{contractStats.expiring} คู่สัญญา</span></div>
              <div style={statRowStyle}><span style={labelStyle}>💰 ยอดทั้งหมด</span><span style={valueStyle(darkMode ? '#fff' : '#1f2937')}>{formatCurrency(contractStats.totalValue)}</span></div>
              <div style={statRowStyle}><span style={labelStyle}>📅 ครบกำหนดเร็วสุด</span><span style={valueStyle('#ef4444')}>{contractStats.nearestDate}</span></div>
            </div>
            <Button block style={{ borderRadius: 10, background: darkMode ? 'rgba(255,255,255,0.1)' : '#fff7ed', border: 'none', color: '#fb923c' }}>ดูคู่สัญญา</Button>
          </div>
        )}
      </div>

      {/* Shortcuts */}
      <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
        <h3 style={{ fontSize: 14, color: darkMode ? 'rgba(255,255,255,0.5)' : '#9ca3af', marginBottom: 16 }}>ทางลัด</h3>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 12 }}>
          <Button onClick={() => navigate('/products')} style={{ borderRadius: 10, background: darkMode ? 'rgba(255,255,255,0.05)' : '#fff', color: darkMode ? '#fff' : '#1f2937' }} icon={<AppstoreOutlined />}>สินค้า</Button>
          <Button onClick={() => navigate('/customers')} style={{ borderRadius: 10, background: darkMode ? 'rgba(255,255,255,0.05)' : '#fff', color: darkMode ? '#fff' : '#1f2937' }} icon={<TeamOutlined />}>ลูกค้า</Button>
          <Button onClick={() => navigate('/quotations')} style={{ borderRadius: 10, background: darkMode ? 'rgba(255,255,255,0.05)' : '#fff', color: darkMode ? '#fff' : '#1f2937' }} icon={<FileTextOutlined />}>ใบเสนอราคา</Button>
          <Button onClick={() => navigate('/dashboard')} style={{ borderRadius: 10, background: darkMode ? 'rgba(255,255,255,0.05)' : '#fff', color: darkMode ? '#fff' : '#1f2937' }} icon={<BarChartOutlined />}>Dashboard</Button>
          <Button onClick={() => navigate('/settings')} style={{ borderRadius: 10, background: darkMode ? 'rgba(255,255,255,0.05)' : '#fff', color: darkMode ? '#fff' : '#1f2937' }} icon={<SettingOutlined />}>ตั้งค่า</Button>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: 60, color: darkMode ? 'rgba(255,255,255,0.3)' : '#9ca3af', fontSize: 12 }}>Developed by Boy © Autthapol Saiyat</div>

      {/* Profile Modal */}
      <Modal title={null} open={profileModalOpen} onCancel={() => { setProfileModalOpen(false); setCardFlipped(false); }} footer={null} width={400} centered styles={{ content: { background: 'transparent', boxShadow: 'none', padding: 0 }, body: { padding: 0 } }}>
        <div onDoubleClick={() => setCardFlipped(!cardFlipped)} style={{ perspective: '1000px', cursor: 'pointer' }}>
          <div style={{ position: 'relative', width: '100%', height: 420, transformStyle: 'preserve-3d', transition: 'transform 0.6s ease', transform: cardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
            <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)' }}>
              <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #0d2137 100%)', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div><div style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>SAENGVITH SCIENCE</div><div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10 }}>Scientific Equipment & Services</div></div>
                <div style={{ background: '#fff', borderRadius: 6, padding: 6 }}><QRCode value={vCardData} size={50} /></div>
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
                <div style={{ marginBottom: 20 }}><div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>💡 ความเชี่ยวชาญ</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{businessCard.skills.map((skill: string, idx: number) => <span key={idx} style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 11 }}>{skill}</span>)}</div></div>
              </div>
              <div style={{ textAlign: 'center', padding: '8px 0', color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>👆 แตะสองครั้งเพื่อกลับด้านหน้า</div>
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
