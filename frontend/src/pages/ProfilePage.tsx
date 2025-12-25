import { useState, useEffect } from 'react';
import { Card, Form, Input, Button, message, Avatar, Divider, Space, Tag, Spin, Collapse, Steps, Progress } from 'antd';
import { 
  UserOutlined, KeyOutlined, SaveOutlined, 
  BookOutlined, FileTextOutlined, ShoppingCartOutlined, 
  InboxOutlined, DollarOutlined, TeamOutlined,
  SafetyOutlined, DatabaseOutlined, CheckCircleOutlined,
  CheckOutlined, CloseOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const { TextArea } = Input;
const { Panel } = Collapse;

// Password Strength Configuration
const PASSWORD_RULES = [
  { key: 'length', label: 'อย่างน้อย 8 ตัวอักษร', test: (p: string) => p.length >= 8 },
  { key: 'lowercase', label: 'มีตัวพิมพ์เล็ก (a-z)', test: (p: string) => /[a-z]/.test(p) },
  { key: 'uppercase', label: 'มีตัวพิมพ์ใหญ่ (A-Z)', test: (p: string) => /[A-Z]/.test(p) },
  { key: 'number', label: 'มีตัวเลข (0-9)', test: (p: string) => /[0-9]/.test(p) },
  { key: 'special', label: 'มีอักขระพิเศษ (!@#$%^&*)', test: (p: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p) },
];

const getPasswordStrength = (password: string): { score: number; label: string; color: string; status: 'exception' | 'active' | 'success' | 'normal' } => {
  if (!password) return { score: 0, label: '', color: '#d9d9d9', status: 'normal' };
  
  let passedRules = 0;
  PASSWORD_RULES.forEach(rule => {
    if (rule.test(password)) passedRules++;
  });
  
  if (passedRules <= 1) return { score: 20, label: 'อ่อนมาก', color: '#ff4d4f', status: 'exception' };
  if (passedRules === 2) return { score: 40, label: 'อ่อน', color: '#fa8c16', status: 'exception' };
  if (passedRules === 3) return { score: 60, label: 'ปานกลาง', color: '#fadb14', status: 'active' };
  if (passedRules === 4) return { score: 80, label: 'แข็งแรง', color: '#52c41a', status: 'success' };
  return { score: 100, label: 'แข็งแรงมาก', color: '#1890ff', status: 'success' };
};

const ProfilePage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [newPassword, setNewPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<{ score: number; label: string; color: string; status: 'exception' | 'active' | 'success' | 'normal' }>({ score: 0, label: '', color: '#d9d9d9', status: 'normal' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/user-settings/profile');
      profileForm.setFieldsValue(res.data);
    } catch (error) {
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
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
    setSaving(false);
  };

  const handleChangePassword = async (values: any) => {
    // Check password strength before submit
    if (passwordStrength.score < 60) {
      message.error('รหัสผ่านไม่แข็งแรงพอ กรุณาใช้รหัสผ่านที่ปลอดภัยกว่านี้');
      return;
    }
    
    setLoading(true);
    try {
      await api.put('/api/auth/change-password', {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      message.success('เปลี่ยนรหัสผ่านสำเร็จ');
      passwordForm.resetFields();
      setNewPassword('');
      setPasswordStrength({ score: 0, label: '', color: '#d9d9d9', status: 'normal' });
    } catch (error: any) {
      message.error(error.response?.data?.message || 'รหัสผ่านปัจจุบันไม่ถูกต้อง');
    }
    setLoading(false);
  };

  const handlePasswordChange = (value: string) => {
    setNewPassword(value);
    setPasswordStrength(getPasswordStrength(value));
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
    STOCK: 'green',
    PURCHASING: 'gold',
    ACCOUNTING: 'magenta',
    VIEWER: 'default',
  };

  // Check user roles
  const isAdmin = user?.roles?.includes('ADMIN');
  const isManager = user?.roles?.includes('MANAGER');
  const isSales = user?.roles?.some((r: string) => 
    ['SALES', 'SALES_STANDARD', 'SALES_FORENSIC', 'SALES_TOOLLAB', 'SALES_MAINTENANCE'].includes(r)
  );
  const isStock = user?.roles?.some((r: string) => ['STOCK', 'WAREHOUSE'].includes(r));

  // User Manual Content
  const salesGuide = (
    <div>
      <h4 style={{ color: '#f59e0b', marginBottom: 16 }}>📋 ขั้นตอนการทำงาน Sales</h4>
      
      <Steps
        direction="vertical"
        size="small"
        current={-1}
        items={[
          {
            title: '1. สร้างใบเสนอราคา',
            description: (
              <div style={{ fontSize: 13, color: '#9ca3af' }}>
                <p>• ไปที่เมนู <Tag color="orange">ใบเสนอราคา</Tag></p>
                <p>• กดปุ่ม "+ สร้างใบเสนอราคา"</p>
                <p>• เลือกลูกค้า, เพิ่มสินค้า, กำหนดราคาและส่วนลด</p>
                <p>• กดบันทึก (สถานะ: ร่าง)</p>
              </div>
            ),
            icon: <FileTextOutlined style={{ color: '#f59e0b' }} />,
          },
          {
            title: '2. ยืนยันใบเสนอราคา',
            description: (
              <div style={{ fontSize: 13, color: '#9ca3af' }}>
                <p>• ตรวจสอบข้อมูลให้ถูกต้อง</p>
                <p>• กดปุ่ม "ยืนยัน" (สถานะ: ยืนยันแล้ว)</p>
                <p>• สามารถพิมพ์ใบเสนอราคาให้ลูกค้าได้</p>
              </div>
            ),
            icon: <CheckCircleOutlined style={{ color: '#10b981' }} />,
          },
          {
            title: '3. ติดตาม Flow',
            description: (
              <div style={{ fontSize: 13, color: '#9ca3af' }}>
                <p>• ดู Floating Progress Bar ด้านล่าง</p>
                <p>• ติดตามสถานะ: QT → PO → GR → INV → PAID</p>
              </div>
            ),
            icon: <DollarOutlined style={{ color: '#8b5cf6' }} />,
          },
        ]}
      />

      <Divider />
      
      <h4 style={{ marginBottom: 12 }}>💡 Tips</h4>
      <ul style={{ fontSize: 13, color: '#9ca3af', paddingLeft: 20 }}>
        <li>ใช้ปุ่ม "คัดลอก" เพื่อสร้างใบเสนอราคาใหม่จากใบเดิม</li>
        <li>ตรวจสอบ Margin % ก่อนยืนยันใบเสนอราคา</li>
        <li>สามารถแก้ไขได้เฉพาะใบที่ยังเป็น "ร่าง"</li>
      </ul>
    </div>
  );

  const stockGuide = (
    <div>
      <h4 style={{ color: '#06b6d4', marginBottom: 16 }}>📦 ขั้นตอนการทำงาน Stock</h4>
      
      <Steps
        direction="vertical"
        size="small"
        current={-1}
        items={[
          {
            title: '1. รับสินค้าเข้า (Goods Receipt)',
            description: (
              <div style={{ fontSize: 13, color: '#9ca3af' }}>
                <p>• ไปที่เมนู <Tag color="cyan">ใบรับสินค้า</Tag></p>
                <p>• เลือกจาก PO ที่ approved แล้ว</p>
                <p>• ตรวจสอบจำนวนและ Post เข้าสต็อก</p>
              </div>
            ),
            icon: <InboxOutlined style={{ color: '#06b6d4' }} />,
          },
          {
            title: '2. เบิกสินค้า (Stock Issue)',
            description: (
              <div style={{ fontSize: 13, color: '#9ca3af' }}>
                <p>• ไปที่เมนู <Tag color="green">เบิกสินค้า</Tag></p>
                <p>• เลือกคลังต้นทาง</p>
                <p>• เพิ่มรายการสินค้าที่ต้องการเบิก</p>
                <p>• Post เพื่อตัดสต็อก</p>
              </div>
            ),
            icon: <InboxOutlined style={{ color: '#10b981' }} />,
          },
          {
            title: '3. โอนสินค้า (Stock Transfer)',
            description: (
              <div style={{ fontSize: 13, color: '#9ca3af' }}>
                <p>• ไปที่เมนู <Tag color="blue">โอนสินค้า</Tag></p>
                <p>• เลือกคลังต้นทาง และคลังปลายทาง</p>
                <p>• เพิ่มรายการสินค้าที่ต้องการโอน</p>
                <p>• Post เพื่อย้ายสต็อก</p>
              </div>
            ),
            icon: <InboxOutlined style={{ color: '#3b82f6' }} />,
          },
          {
            title: '4. ตรวจสอบยอดคงเหลือ',
            description: (
              <div style={{ fontSize: 13, color: '#9ca3af' }}>
                <p>• ไปที่เมนู <Tag color="purple">ยอดคงเหลือ</Tag></p>
                <p>• ดูสต็อกแยกตามคลัง</p>
                <p>• ระบบคำนวณต้นทุนแบบ FIFO</p>
              </div>
            ),
            icon: <DatabaseOutlined style={{ color: '#8b5cf6' }} />,
          },
        ]}
      />

      <Divider />
      
      <h4 style={{ marginBottom: 12 }}>💡 Tips</h4>
      <ul style={{ fontSize: 13, color: '#9ca3af', paddingLeft: 20 }}>
        <li>ตรวจสอบ GR ก่อน Post เสมอ - ไม่สามารถแก้ไขหลัง Post</li>
        <li>ถ้า Post ผิด ให้ทำ "Reverse" เพื่อกลับรายการ</li>
        <li>สินค้าที่ใกล้หมด จะแสดงสีแดงใน Stock Balance</li>
      </ul>
    </div>
  );

  const adminGuide = (
    <div>
      <h4 style={{ color: '#ef4444', marginBottom: 16 }}>🛡️ คู่มือ Admin</h4>
      
      <Steps
        direction="vertical"
        size="small"
        current={-1}
        items={[
          {
            title: '1. จัดการผู้ใช้',
            description: (
              <div style={{ fontSize: 13, color: '#9ca3af' }}>
                <p>• ไปที่ <Tag color="red">Super Admin → ผู้ใช้</Tag></p>
                <p>• เพิ่ม/แก้ไข/ลบ ผู้ใช้งาน</p>
                <p>• กำหนด Role และ quotationType</p>
              </div>
            ),
            icon: <TeamOutlined style={{ color: '#ef4444' }} />,
          },
          {
            title: '2. ตั้งค่าบริษัท',
            description: (
              <div style={{ fontSize: 13, color: '#9ca3af' }}>
                <p>• ไปที่ <Tag color="purple">ตั้งค่า → ตั้งค่าบริษัท</Tag></p>
                <p>• กำหนดชื่อบริษัท, ที่อยู่, เลขประจำตัวผู้เสียภาษี</p>
                <p>• ตั้งค่าเลขที่เอกสาร</p>
              </div>
            ),
            icon: <SafetyOutlined style={{ color: '#8b5cf6' }} />,
          },
          {
            title: '3. ดู Activity Logs',
            description: (
              <div style={{ fontSize: 13, color: '#9ca3af' }}>
                <p>• ไปที่ <Tag color="orange">Super Admin → Logs</Tag></p>
                <p>• ตรวจสอบการใช้งานระบบ</p>
                <p>• ดูประวัติการ Login</p>
              </div>
            ),
            icon: <DatabaseOutlined style={{ color: '#f59e0b' }} />,
          },
        ]}
      />

      <Divider />
      
      <h4 style={{ marginBottom: 12 }}>⚙️ การตั้งค่า Role</h4>
      <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
            <th style={{ padding: 8, textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Role</th>
            <th style={{ padding: 8, textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>สิทธิ์การใช้งาน</th>
          </tr>
        </thead>
        <tbody style={{ color: '#9ca3af' }}>
          <tr><td style={{ padding: 8 }}><Tag color="red">ADMIN</Tag></td><td>เข้าถึงทุกเมนู + จัดการผู้ใช้</td></tr>
          <tr><td style={{ padding: 8 }}><Tag color="purple">MANAGER</Tag></td><td>เข้าถึงทุกเมนู (ยกเว้นจัดการผู้ใช้)</td></tr>
          <tr><td style={{ padding: 8 }}><Tag color="cyan">SALES_STANDARD</Tag></td><td>ใบเสนอราคา (กลุ่มทั่วไป)</td></tr>
          <tr><td style={{ padding: 8 }}><Tag color="geekblue">SALES_FORENSIC</Tag></td><td>ใบเสนอราคา (กลุ่มนิติวิทย์)</td></tr>
          <tr><td style={{ padding: 8 }}><Tag color="orange">SALES_MAINTENANCE</Tag></td><td>ใบเสนอราคา (กลุ่มบำรุงรักษา)</td></tr>
          <tr><td style={{ padding: 8 }}><Tag color="green">STOCK</Tag></td><td>จัดการคลังสินค้า</td></tr>
        </tbody>
      </table>
    </div>
  );

  const managerGuide = (
    <div>
      <h4 style={{ color: '#8b5cf6', marginBottom: 16 }}>👔 คู่มือ Manager</h4>
      
      <Steps
        direction="vertical"
        size="small"
        current={-1}
        items={[
          {
            title: '1. อนุมัติใบสั่งซื้อ (PO)',
            description: (
              <div style={{ fontSize: 13, color: '#9ca3af' }}>
                <p>• ไปที่ <Tag color="blue">ใบสั่งซื้อ</Tag></p>
                <p>• ตรวจสอบ PO ที่รอการอนุมัติ</p>
                <p>• กดปุ่ม "อนุมัติ" เพื่ออนุมัติ</p>
              </div>
            ),
            icon: <ShoppingCartOutlined style={{ color: '#3b82f6' }} />,
          },
          {
            title: '2. ดู Dashboard',
            description: (
              <div style={{ fontSize: 13, color: '#9ca3af' }}>
                <p>• ดูภาพรวมยอดขาย</p>
                <p>• ติดตามสถานะใบเสนอราคา</p>
                <p>• ตรวจสอบสต็อกสินค้า</p>
              </div>
            ),
            icon: <DatabaseOutlined style={{ color: '#10b981' }} />,
          },
          {
            title: '3. ติดตามงาน (Coming Soon)',
            description: (
              <div style={{ fontSize: 13, color: '#9ca3af' }}>
                <p>• ติดตามคู่สัญญาที่จะหมดประกัน</p>
                <p>• ติดตามงานซ่อมบำรุง</p>
              </div>
            ),
            icon: <FileTextOutlined style={{ color: '#f59e0b' }} />,
          },
        ]}
      />
    </div>
  );

  // ===== NEW GUIDES =====
  
  const purchasingGuide = (
    <div>
      <h4 style={{ color: '#3b82f6', marginBottom: 16 }}>🛒 คู่มือจัดซื้อ (Purchasing)</h4>
      
      <Steps
        direction="vertical"
        size="small"
        current={-1}
        items={[
          {
            title: '1. สร้างใบสั่งซื้อ (PO)',
            description: (
              <div style={{ fontSize: 13, color: '#9ca3af' }}>
                <p>• ไปที่เมนู <Tag color="blue">ใบสั่งซื้อ</Tag></p>
                <p>• กดปุ่ม "+ สร้างใบสั่งซื้อ"</p>
                <p>• เลือก Supplier, เพิ่มสินค้าที่ต้องการสั่งซื้อ</p>
                <p>• ระบุราคา จำนวน และวันที่ต้องการ</p>
                <p>• กดบันทึก (สถานะ: ร่าง)</p>
              </div>
            ),
            icon: <ShoppingCartOutlined style={{ color: '#3b82f6' }} />,
          },
          {
            title: '2. ส่งขออนุมัติ',
            description: (
              <div style={{ fontSize: 13, color: '#9ca3af' }}>
                <p>• ตรวจสอบข้อมูลให้ถูกต้อง</p>
                <p>• กดปุ่ม "ส่งขออนุมัติ"</p>
                <p>• รอ Manager อนุมัติ</p>
              </div>
            ),
            icon: <FileTextOutlined style={{ color: '#f59e0b' }} />,
          },
          {
            title: '3. ส่ง PO ให้ Supplier',
            description: (
              <div style={{ fontSize: 13, color: '#9ca3af' }}>
                <p>• หลังจากได้รับการอนุมัติ</p>
                <p>• กดปุ่ม "ส่ง PO"</p>
                <p>• พิมพ์ PO ส่งให้ Supplier</p>
              </div>
            ),
            icon: <CheckCircleOutlined style={{ color: '#10b981' }} />,
          },
          {
            title: '4. รอรับสินค้า',
            description: (
              <div style={{ fontSize: 13, color: '#9ca3af' }}>
                <p>• ติดตาม PO ที่รอรับสินค้า</p>
                <p>• เมื่อสินค้ามาถึง ให้ Stock ทำ Goods Receipt (GR)</p>
              </div>
            ),
            icon: <InboxOutlined style={{ color: '#06b6d4' }} />,
          },
        ]}
      />

      <Divider />
      
      <h4 style={{ marginBottom: 12 }}>📊 สถานะ PO</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        <Tag color="default">ร่าง (Draft)</Tag>
        <Tag color="orange">รออนุมัติ</Tag>
        <Tag color="green">อนุมัติแล้ว</Tag>
        <Tag color="blue">ส่งแล้ว</Tag>
        <Tag color="cyan">รับสินค้าบางส่วน</Tag>
        <Tag color="purple">รับสินค้าครบ</Tag>
        <Tag color="red">ยกเลิก</Tag>
      </div>

      <h4 style={{ marginBottom: 12 }}>💡 Tips</h4>
      <ul style={{ fontSize: 13, color: '#9ca3af', paddingLeft: 20 }}>
        <li>สามารถสร้าง PO จากใบเสนอราคาได้โดยตรง</li>
        <li>ตรวจสอบราคาและเงื่อนไขก่อนส่งขออนุมัติ</li>
        <li>PO ที่ส่งแล้วไม่สามารถแก้ไขได้ ต้องยกเลิกและสร้างใหม่</li>
      </ul>
    </div>
  );

  const stockReportsGuide = (
    <div>
      <h4 style={{ color: '#8b5cf6', marginBottom: 16 }}>📊 คู่มือรายงานสต็อก</h4>
      
      <div style={{ marginBottom: 24 }}>
        <h5 style={{ marginBottom: 12, color: '#06b6d4' }}>📦 ยอดคงเหลือ (Stock Balance)</h5>
        <div style={{ fontSize: 13, color: '#9ca3af', paddingLeft: 16 }}>
          <p>• แสดงยอดสินค้าคงเหลือแต่ละคลัง</p>
          <p>• ดูต้นทุนเฉลี่ย (Average Cost)</p>
          <p>• <span style={{ color: '#ef4444' }}>สีแดง</span> = สินค้าใกล้หมด (ต่ำกว่า Safety Stock)</p>
          <p>• <span style={{ color: '#f59e0b' }}>สีส้ม</span> = สินค้าถึงจุดสั่งซื้อ (Reorder Point)</p>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <h5 style={{ marginBottom: 12, color: '#10b981' }}>📋 Stock Card</h5>
        <div style={{ fontSize: 13, color: '#9ca3af', paddingLeft: 16 }}>
          <p>• แสดงประวัติการเคลื่อนไหวสินค้า</p>
          <p>• เลือกสินค้าและช่วงวันที่</p>
          <p>• ดูรายการ รับเข้า/จ่ายออก พร้อมยอดคงเหลือ</p>
          <p>• Export เป็น Excel ได้</p>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <h5 style={{ marginBottom: 12, color: '#f59e0b' }}>💰 Stock Valuation</h5>
        <div style={{ fontSize: 13, color: '#9ca3af', paddingLeft: 16 }}>
          <p>• คำนวณมูลค่าสินค้าคงคลัง</p>
          <p>• ใช้วิธี FIFO (First In First Out)</p>
          <p>• แสดงต้นทุนต่อหน่วย และมูลค่ารวม</p>
          <p>• ใช้สำหรับปิดบัญชีสิ้นเดือน/ปี</p>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <h5 style={{ marginBottom: 12, color: '#ef4444' }}>📅 Expiry Alert</h5>
        <div style={{ fontSize: 13, color: '#9ca3af', paddingLeft: 16 }}>
          <p>• แสดงสินค้าที่ใกล้หมดอายุ</p>
          <p>• ตั้งค่าจำนวนวันแจ้งเตือนล่วงหน้าได้</p>
          <p>• แสดง Lot/Batch Number</p>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <h5 style={{ marginBottom: 12, color: '#3b82f6' }}>🔄 Stock Movement</h5>
        <div style={{ fontSize: 13, color: '#9ca3af', paddingLeft: 16 }}>
          <p>• รายงานการเคลื่อนไหวสินค้าทั้งหมด</p>
          <p>• กรองตามประเภท: รับเข้า, เบิกออก, โอน, ปรับปรุง</p>
          <p>• กรองตามคลัง และช่วงเวลา</p>
        </div>
      </div>

      <Divider />
      
      <h4 style={{ marginBottom: 12 }}>💡 Tips</h4>
      <ul style={{ fontSize: 13, color: '#9ca3af', paddingLeft: 20 }}>
        <li>ตรวจสอบ Stock Balance เป็นประจำ</li>
        <li>Export รายงานสำหรับ Auditor ได้</li>
        <li>ใช้ Barcode Scanner เพื่อค้นหาสินค้าเร็วขึ้น</li>
      </ul>
    </div>
  );

  const settingsGuide = (
    <div>
      <h4 style={{ color: '#f59e0b', marginBottom: 16 }}>⚙️ คู่มือการตั้งค่า</h4>
      
      <div style={{ marginBottom: 24 }}>
        <h5 style={{ marginBottom: 12, color: '#3b82f6' }}>👤 ตั้งค่าส่วนตัว</h5>
        <div style={{ fontSize: 13, color: '#9ca3af', paddingLeft: 16 }}>
          <p>• <strong>ข้อมูลผู้ขาย:</strong> ชื่อ, เบอร์โทร, อีเมล, ลายเซ็น</p>
          <p>• <strong>ค่าเริ่มต้นใบเสนอราคา:</strong> วันยืนราคา, วันส่งมอบ, เครดิต</p>
          <p>• ไปที่ <Tag color="blue">ตั้งค่า → ตั้งค่าส่วนตัว</Tag></p>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <h5 style={{ marginBottom: 12, color: '#10b981' }}>🏢 ตั้งค่าบริษัท (Admin เท่านั้น)</h5>
        <div style={{ fontSize: 13, color: '#9ca3af', paddingLeft: 16 }}>
          <p>• ชื่อบริษัท, ที่อยู่, เลขประจำตัวผู้เสียภาษี</p>
          <p>• โลโก้บริษัท</p>
          <p>• ข้อมูลธนาคาร</p>
          <p>• ไปที่ <Tag color="green">ตั้งค่า → ตั้งค่าบริษัท</Tag></p>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <h5 style={{ marginBottom: 12, color: '#8b5cf6' }}>📁 Master Data</h5>
        <div style={{ fontSize: 13, color: '#9ca3af', paddingLeft: 16 }}>
          <p>• <strong>หมวดหมู่สินค้า:</strong> จัดกลุ่มสินค้า</p>
          <p>• <strong>หน่วยสินค้า:</strong> ชิ้น, กล่อง, ลัง, etc.</p>
          <p>• <strong>คลังสินค้า:</strong> เพิ่ม/แก้ไขคลัง</p>
          <p>• ไปที่ <Tag color="purple">ตั้งค่า → หน้าหลัก</Tag></p>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <h5 style={{ marginBottom: 12, color: '#ef4444' }}>🔔 ตั้งค่าการแจ้งเตือน</h5>
        <div style={{ fontSize: 13, color: '#9ca3af', paddingLeft: 16 }}>
          <p>• แจ้งเตือนสินค้าใกล้หมด (Reorder Point)</p>
          <p>• แจ้งเตือนสินค้าหมดอายุ (Expiry Alert)</p>
          <p>• กำหนดจำนวนวันแจ้งเตือนล่วงหน้า</p>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <h5 style={{ marginBottom: 12, color: '#06b6d4' }}>📄 รูปแบบเลขที่เอกสาร</h5>
        <div style={{ fontSize: 13, color: '#9ca3af', paddingLeft: 16 }}>
          <p>• ตั้งค่า Prefix: QT, PO, GR, INV, SI</p>
          <p>• รูปแบบ: PREFIX-YYMMDD-XXX</p>
          <p>• ตัวอย่าง: QT-251225-001</p>
        </div>
      </div>

      <Divider />
      
      <h4 style={{ marginBottom: 12 }}>💡 Tips</h4>
      <ul style={{ fontSize: 13, color: '#9ca3af', paddingLeft: 20 }}>
        <li>ตั้งค่าข้อมูลผู้ขายก่อนสร้างใบเสนอราคา</li>
        <li>อัพโหลดลายเซ็นโดยการ Paste รูปภาพ (Ctrl+V)</li>
        <li>ตรวจสอบเลขประจำตัวผู้เสียภาษีให้ถูกต้อง</li>
      </ul>
    </div>
  );

  const masterDataGuide = (
    <div>
      <h4 style={{ color: '#06b6d4', marginBottom: 16 }}>📚 คู่มือจัดการข้อมูลหลัก</h4>
      
      <div style={{ marginBottom: 24 }}>
        <h5 style={{ marginBottom: 12, color: '#3b82f6' }}>📦 สินค้า (Products)</h5>
        <div style={{ fontSize: 13, color: '#9ca3af', paddingLeft: 16 }}>
          <p>• เพิ่ม/แก้ไข/ลบ สินค้า</p>
          <p>• กำหนด: รหัส, ชื่อ, หมวดหมู่, หน่วย</p>
          <p>• ตั้งราคาขาย, ต้นทุน, Safety Stock</p>
          <p>• อัพโหลดรูปภาพสินค้า</p>
          <p>• ไปที่ <Tag color="blue">สินค้า</Tag></p>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <h5 style={{ marginBottom: 12, color: '#10b981' }}>👥 ลูกค้า (Customers)</h5>
        <div style={{ fontSize: 13, color: '#9ca3af', paddingLeft: 16 }}>
          <p>• เพิ่ม/แก้ไข/ลบ ลูกค้า</p>
          <p>• กำหนด: รหัส, ชื่อ, ที่อยู่, เลขประจำตัวผู้เสียภาษี</p>
          <p>• ข้อมูลติดต่อ: เบอร์โทร, อีเมล, ผู้ติดต่อ</p>
          <p>• วงเงินเครดิต และจำนวนวันเครดิต</p>
          <p>• ไปที่ <Tag color="green">ลูกค้า</Tag></p>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <h5 style={{ marginBottom: 12, color: '#f59e0b' }}>🏭 Supplier</h5>
        <div style={{ fontSize: 13, color: '#9ca3af', paddingLeft: 16 }}>
          <p>• เพิ่ม/แก้ไข/ลบ Supplier</p>
          <p>• กำหนด: รหัส, ชื่อ, ที่อยู่, เลขประจำตัวผู้เสียภาษี</p>
          <p>• ข้อมูลติดต่อ และเงื่อนไขการค้า</p>
          <p>• ไปที่ <Tag color="orange">Supplier</Tag></p>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <h5 style={{ marginBottom: 12, color: '#8b5cf6' }}>🏪 คลังสินค้า (Warehouse)</h5>
        <div style={{ fontSize: 13, color: '#9ca3af', paddingLeft: 16 }}>
          <p>• เพิ่ม/แก้ไข คลังสินค้า</p>
          <p>• กำหนด: รหัส, ชื่อ, ที่ตั้ง</p>
          <p>• เปิด/ปิด การใช้งานคลัง</p>
          <p>• ไปที่ <Tag color="purple">คลังสินค้า</Tag></p>
        </div>
      </div>

      <Divider />
      
      <h4 style={{ marginBottom: 12 }}>💡 Tips</h4>
      <ul style={{ fontSize: 13, color: '#9ca3af', paddingLeft: 20 }}>
        <li>รหัสสินค้า/ลูกค้า/Supplier ไม่สามารถแก้ไขได้หลังบันทึก</li>
        <li>ลบข้อมูลที่ถูกใช้งานแล้วไม่ได้ (มีการอ้างอิง)</li>
        <li>ใช้ Import Excel เพื่อเพิ่มข้อมูลจำนวนมาก</li>
      </ul>
    </div>
  );

  const auditLogGuide = (
    <div>
      <h4 style={{ color: '#ef4444', marginBottom: 16 }}>📝 คู่มือ Audit Log (ISO Compliance)</h4>
      
      <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 16 }}>
        <p>ระบบบันทึก Log ทุกการกระทำเพื่อความปลอดภัยและตรวจสอบย้อนหลังตามมาตรฐาน ISO</p>
      </div>

      <div style={{ marginBottom: 24 }}>
        <h5 style={{ marginBottom: 12, color: '#3b82f6' }}>📋 ข้อมูลที่บันทึก</h5>
        <div style={{ fontSize: 13, color: '#9ca3af', paddingLeft: 16 }}>
          <p>• วันเวลาที่กระทำ</p>
          <p>• ผู้ใช้งาน (User)</p>
          <p>• IP Address</p>
          <p>• Module (เช่น QUOTATION, PRODUCT)</p>
          <p>• Action (เช่น CREATE, UPDATE, DELETE)</p>
          <p>• รายละเอียดการเปลี่ยนแปลง</p>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <h5 style={{ marginBottom: 12, color: '#10b981' }}>✅ Module ที่บันทึก</h5>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <Tag color="blue">PRODUCT</Tag>
          <Tag color="green">CUSTOMER</Tag>
          <Tag color="orange">SUPPLIER</Tag>
          <Tag color="gold">QUOTATION</Tag>
          <Tag color="cyan">PURCHASE_ORDER</Tag>
          <Tag color="purple">GOODS_RECEIPT</Tag>
          <Tag color="magenta">STOCK_ADJUSTMENT</Tag>
          <Tag color="lime">STOCK_TRANSFER</Tag>
          <Tag color="red">USER</Tag>
          <Tag color="geekblue">SECURITY</Tag>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <h5 style={{ marginBottom: 12, color: '#f59e0b' }}>🔍 การค้นหา Log</h5>
        <div style={{ fontSize: 13, color: '#9ca3af', paddingLeft: 16 }}>
          <p>• ไปที่ <Tag color="red">Super Admin → Activity Logs</Tag></p>
          <p>• กรองตาม Module, Action, User</p>
          <p>• กรองตามช่วงเวลา</p>
          <p>• Export เป็น CSV สำหรับ Auditor</p>
        </div>
      </div>

      <Divider />

      <h4 style={{ marginBottom: 12 }}>🔐 Security Events</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        <Tag color="green">LOGIN_SUCCESS</Tag>
        <Tag color="orange">LOGIN_FAILED</Tag>
        <Tag color="red">ACCOUNT_LOCKED</Tag>
        <Tag color="purple">PASSWORD_CHANGED</Tag>
        <Tag color="magenta">PERMISSION_DENIED</Tag>
      </div>
      
      <h4 style={{ marginBottom: 12 }}>💡 หมายเหตุ</h4>
      <ul style={{ fontSize: 13, color: '#9ca3af', paddingLeft: 20 }}>
        <li>Log จะถูกเก็บไว้ 90 วัน แล้วลบอัตโนมัติ</li>
        <li>ไม่สามารถแก้ไขหรือลบ Log ได้</li>
        <li>ใช้สำหรับตรวจสอบความปลอดภัยและ Compliance</li>
      </ul>
    </div>
  );

  const generalGuide = (
    <div>
      <h4 style={{ color: '#22c55e', marginBottom: 16 }}>🏠 การใช้งานทั่วไป</h4>
      
      <div style={{ marginBottom: 20 }}>
        <h5 style={{ marginBottom: 8 }}>🎨 ธีมสี</h5>
        <p style={{ fontSize: 13, color: '#9ca3af' }}>
          กดปุ่ม ☀️/🌙 ที่มุมขวาบนเพื่อสลับโหมด Light/Dark
        </p>
      </div>

      <div style={{ marginBottom: 20 }}>
        <h5 style={{ marginBottom: 8 }}>🏠 ปุ่ม Home ลอย</h5>
        <p style={{ fontSize: 13, color: '#9ca3af' }}>
          • กด "หน้าหลัก" เพื่อกลับไปหน้า Intro<br/>
          • กด ☰ เพื่อย่อปุ่ม<br/>
          • กด ✕ เพื่อซ่อนปุ่ม (กดปุ่มเล็กๆ เพื่อแสดงใหม่)
        </p>
      </div>

      <div style={{ marginBottom: 20 }}>
        <h5 style={{ marginBottom: 8 }}>📱 ติดตั้งแอป (PWA)</h5>
        <p style={{ fontSize: 13, color: '#9ca3af' }}>
          เข้า <a href="/install" style={{ color: '#3b82f6' }}>/install</a> เพื่อติดตั้งแอปลงอุปกรณ์
        </p>
      </div>

      <div style={{ marginBottom: 20 }}>
        <h5 style={{ marginBottom: 8 }}>🔐 เปลี่ยนรหัสผ่าน</h5>
        <p style={{ fontSize: 13, color: '#9ca3af' }}>
          เลื่อนลงด้านล่างของหน้านี้เพื่อเปลี่ยนรหัสผ่าน
        </p>
      </div>
    </div>
  );

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
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

      {/* User Manual */}
      <Card 
        title={<><BookOutlined /> คู่มือการใช้งาน</>}
        style={{ marginBottom: 24 }}
      >
        <Collapse 
          defaultActiveKey={['general']}
          expandIconPosition="end"
          style={{ background: 'transparent', border: 'none' }}
        >
          <Panel 
            header={<span style={{ fontWeight: 600 }}>🏠 การใช้งานทั่วไป</span>} 
            key="general"
            style={{ marginBottom: 8, borderRadius: 8, overflow: 'hidden' }}
          >
            {generalGuide}
          </Panel>

          {(isSales || isAdmin) && (
            <Panel 
              header={<span style={{ fontWeight: 600 }}>📋 คู่มือ Sales - ใบเสนอราคา</span>} 
              key="sales"
              style={{ marginBottom: 8, borderRadius: 8, overflow: 'hidden' }}
            >
              {salesGuide}
            </Panel>
          )}

          {(isStock || isAdmin) && (
            <Panel 
              header={<span style={{ fontWeight: 600 }}>📦 คู่มือ Stock - คลังสินค้า</span>} 
              key="stock"
              style={{ marginBottom: 8, borderRadius: 8, overflow: 'hidden' }}
            >
              {stockGuide}
            </Panel>
          )}

          {(isManager || isAdmin) && (
            <Panel 
              header={<span style={{ fontWeight: 600 }}>👔 คู่มือ Manager</span>} 
              key="manager"
              style={{ marginBottom: 8, borderRadius: 8, overflow: 'hidden' }}
            >
              {managerGuide}
            </Panel>
          )}

          {/* Purchasing Guide - for PURCHASING role or Admin */}
          <Panel 
            header={<span style={{ fontWeight: 600 }}>🛒 คู่มือจัดซื้อ - ใบสั่งซื้อ (PO)</span>} 
            key="purchasing"
            style={{ marginBottom: 8, borderRadius: 8, overflow: 'hidden' }}
          >
            {purchasingGuide}
          </Panel>

          {/* Stock Reports Guide */}
          {(isStock || isManager || isAdmin) && (
            <Panel 
              header={<span style={{ fontWeight: 600 }}>📊 คู่มือรายงานสต็อก</span>} 
              key="stockReports"
              style={{ marginBottom: 8, borderRadius: 8, overflow: 'hidden' }}
            >
              {stockReportsGuide}
            </Panel>
          )}

          {/* Master Data Guide */}
          <Panel 
            header={<span style={{ fontWeight: 600 }}>📚 คู่มือข้อมูลหลัก (Master Data)</span>} 
            key="masterData"
            style={{ marginBottom: 8, borderRadius: 8, overflow: 'hidden' }}
          >
            {masterDataGuide}
          </Panel>

          {/* Settings Guide */}
          <Panel 
            header={<span style={{ fontWeight: 600 }}>⚙️ คู่มือการตั้งค่า</span>} 
            key="settings"
            style={{ marginBottom: 8, borderRadius: 8, overflow: 'hidden' }}
          >
            {settingsGuide}
          </Panel>

          {isAdmin && (
            <Panel 
              header={<span style={{ fontWeight: 600 }}>🛡️ คู่มือ Admin</span>} 
              key="admin"
              style={{ marginBottom: 8, borderRadius: 8, overflow: 'hidden' }}
            >
              {adminGuide}
            </Panel>
          )}

          {/* Audit Log Guide - Admin only */}
          {isAdmin && (
            <Panel 
              header={<span style={{ fontWeight: 600 }}>📝 คู่มือ Audit Log (ISO)</span>} 
              key="auditLog"
              style={{ marginBottom: 8, borderRadius: 8, overflow: 'hidden' }}
            >
              {auditLogGuide}
            </Panel>
          )}
        </Collapse>
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
                  { min: 8, message: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร' },
                ]}
              >
                <Input.Password 
                  placeholder="รหัสผ่านใหม่ (อย่างน้อย 8 ตัวอักษร)" 
                  onChange={(e) => handlePasswordChange(e.target.value)}
                />
              </Form.Item>

              {/* Password Strength Meter */}
              {newPassword && (
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 13 }}>ความแข็งแรง:</span>
                    <span style={{ color: passwordStrength.color, fontWeight: 600 }}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <Progress 
                    percent={passwordStrength.score} 
                    showInfo={false}
                    strokeColor={passwordStrength.color}
                    size="small"
                  />
                  
                  {/* Password Rules Checklist */}
                  <div style={{ 
                    marginTop: 12, 
                    padding: 12, 
                    background: 'rgba(255,255,255,0.05)', 
                    borderRadius: 8,
                    fontSize: 13 
                  }}>
                    {PASSWORD_RULES.map(rule => {
                      const passed = rule.test(newPassword);
                      return (
                        <div 
                          key={rule.key} 
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 8,
                            marginBottom: 4,
                            color: passed ? '#52c41a' : '#ff4d4f'
                          }}
                        >
                          {passed ? <CheckOutlined /> : <CloseOutlined />}
                          <span>{rule.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

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
                  disabled={passwordStrength.score < 60}
                >
                  เปลี่ยนรหัสผ่าน
                </Button>
                {passwordStrength.score > 0 && passwordStrength.score < 60 && (
                  <span style={{ marginLeft: 12, color: '#fa8c16', fontSize: 13 }}>
                    ⚠️ รหัสผ่านต้องมีความแข็งแรงระดับ "ปานกลาง" ขึ้นไป
                  </span>
                )}
              </Form.Item>
            </Form>
          </Card>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
