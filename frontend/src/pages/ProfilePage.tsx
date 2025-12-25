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
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: '', color: '#d9d9d9', status: 'normal' as const });

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

          {isAdmin && (
            <Panel 
              header={<span style={{ fontWeight: 600 }}>🛡️ คู่มือ Admin</span>} 
              key="admin"
              style={{ marginBottom: 8, borderRadius: 8, overflow: 'hidden' }}
            >
              {adminGuide}
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
