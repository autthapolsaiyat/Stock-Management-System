import { useState, useEffect } from 'react';
import { 
  Card, Table, Input, Space, Tag, DatePicker, Select, 
  Button, Typography
} from 'antd';
import { 
  HistoryOutlined, SearchOutlined, ReloadOutlined,
  ExportOutlined, FilterOutlined
} from '@ant-design/icons';
import api from '../../services/api';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Text } = Typography;

interface ActivityLog {
  id: number;
  userId: number;
  username: string;
  fullName: string;
  action: string;
  module: string;
  description: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

const ActivityLogPage = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [actionFilter, setActionFilter] = useState<string | null>(null);
  const [moduleFilter, setModuleFilter] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/activity-logs');
      setLogs(response.data);
    } catch (error) {
      // Mock data for demo
      setLogs([
        { id: 1, userId: 1, username: 'admin', fullName: 'อรรถพล ไสญาติ', action: 'LOGIN', module: 'AUTH', description: 'เข้าสู่ระบบสำเร็จ', ipAddress: '203.150.xxx.xxx', userAgent: 'Chrome/120', createdAt: new Date().toISOString() },
        { id: 2, userId: 1, username: 'admin', fullName: 'อรรถพล ไสญาติ', action: 'CREATE', module: 'QUOTATION', description: 'สร้างใบเสนอราคา QT-2568-0001', ipAddress: '203.150.xxx.xxx', userAgent: 'Chrome/120', createdAt: new Date().toISOString() },
        { id: 3, userId: 2, username: 'sunisa.k', fullName: 'สุนิสา แก้ววิเศษ', action: 'VIEW', module: 'PRODUCT', description: 'ดูรายการสินค้า', ipAddress: '203.150.xxx.xxx', userAgent: 'Safari/17', createdAt: new Date().toISOString() },
        { id: 4, userId: 1, username: 'admin', fullName: 'อรรถพล ไสญาติ', action: 'UPDATE', module: 'USER', description: 'แก้ไขข้อมูลผู้ใช้ ID: 5', ipAddress: '203.150.xxx.xxx', userAgent: 'Chrome/120', createdAt: new Date().toISOString() },
        { id: 5, userId: 3, username: 'wilawan.k', fullName: 'วิลาวรรณ โคตรสมบัติ', action: 'APPROVE', module: 'QUOTATION', description: 'อนุมัติใบเสนอราคา QT-2568-0001', ipAddress: '203.150.xxx.xxx', userAgent: 'Chrome/120', createdAt: new Date().toISOString() },
      ]);
    }
    setLoading(false);
  };

  const actionColors: Record<string, string> = {
    LOGIN: 'green',
    LOGOUT: 'default',
    CREATE: 'blue',
    UPDATE: 'orange',
    DELETE: 'red',
    VIEW: 'default',
    APPROVE: 'purple',
    REJECT: 'red',
    EXPORT: 'cyan',
  };

  const moduleColors: Record<string, string> = {
    AUTH: 'blue',
    USER: 'purple',
    QUOTATION: 'green',
    PO: 'orange',
    INVOICE: 'magenta',
    PRODUCT: 'cyan',
    CUSTOMER: 'geekblue',
    STOCK: 'lime',
  };

  const actionOptions = [
    { value: 'LOGIN', label: 'LOGIN - เข้าสู่ระบบ' },
    { value: 'LOGOUT', label: 'LOGOUT - ออกจากระบบ' },
    { value: 'CREATE', label: 'CREATE - สร้าง' },
    { value: 'UPDATE', label: 'UPDATE - แก้ไข' },
    { value: 'DELETE', label: 'DELETE - ลบ' },
    { value: 'VIEW', label: 'VIEW - ดู' },
    { value: 'APPROVE', label: 'APPROVE - อนุมัติ' },
    { value: 'REJECT', label: 'REJECT - ปฏิเสธ' },
    { value: 'EXPORT', label: 'EXPORT - ส่งออก' },
  ];

  const moduleOptions = [
    { value: 'AUTH', label: 'AUTH - การยืนยันตัวตน' },
    { value: 'USER', label: 'USER - ผู้ใช้งาน' },
    { value: 'QUOTATION', label: 'QUOTATION - ใบเสนอราคา' },
    { value: 'PO', label: 'PO - ใบสั่งซื้อ' },
    { value: 'INVOICE', label: 'INVOICE - ใบแจ้งหนี้' },
    { value: 'PRODUCT', label: 'PRODUCT - สินค้า' },
    { value: 'CUSTOMER', label: 'CUSTOMER - ลูกค้า' },
    { value: 'STOCK', label: 'STOCK - คลังสินค้า' },
  ];

  const filteredLogs = logs.filter((log) => {
    const matchSearch = 
      log.username?.toLowerCase().includes(searchText.toLowerCase()) ||
      log.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
      log.description?.toLowerCase().includes(searchText.toLowerCase());
    const matchAction = !actionFilter || log.action === actionFilter;
    const matchModule = !moduleFilter || log.module === moduleFilter;
    const matchDate = !dateRange || (
      dayjs(log.createdAt).isAfter(dateRange[0].startOf('day')) &&
      dayjs(log.createdAt).isBefore(dateRange[1].endOf('day'))
    );
    return matchSearch && matchAction && matchModule && matchDate;
  });

  const columns = [
    {
      title: 'เวลา',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (date: string) => (
        <Text style={{ fontSize: 12 }}>
          {dayjs(date).format('DD/MM/YYYY HH:mm:ss')}
        </Text>
      ),
    },
    {
      title: 'ผู้ใช้',
      key: 'user',
      width: 180,
      render: (_: any, record: ActivityLog) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.fullName}</div>
          <div style={{ fontSize: 11, color: '#6b7280' }}>@{record.username}</div>
        </div>
      ),
    },
    {
      title: 'การกระทำ',
      dataIndex: 'action',
      key: 'action',
      width: 110,
      render: (action: string) => (
        <Tag color={actionColors[action] || 'default'}>{action}</Tag>
      ),
    },
    {
      title: 'โมดูล',
      dataIndex: 'module',
      key: 'module',
      width: 120,
      render: (module: string) => (
        <Tag color={moduleColors[module] || 'default'}>{module}</Tag>
      ),
    },
    {
      title: 'รายละเอียด',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'IP Address',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      width: 140,
      render: (ip: string) => (
        <Text code style={{ fontSize: 11 }}>{ip}</Text>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* Info Banner */}
      <Card 
        style={{ marginBottom: 16, background: '#fef3c7', border: '1px solid #f59e0b' }}
        bodyStyle={{ padding: 16 }}
      >
        <Space>
          <span style={{ fontSize: 20 }}>⚖️</span>
          <div>
            <div style={{ fontWeight: 600, color: '#92400e' }}>
              บันทึกกิจกรรมตาม พ.ร.บ. คอมพิวเตอร์ พ.ศ. 2560
            </div>
            <div style={{ fontSize: 12, color: '#a16207' }}>
              ข้อมูลจะถูกเก็บรักษาไว้อย่างน้อย 90 วัน ตามกฎหมายกำหนด
            </div>
          </div>
        </Space>
      </Card>

      <Card
        title={
          <Space>
            <HistoryOutlined />
            <span>บันทึกกิจกรรม (Activity Log)</span>
            <Tag color="blue">{filteredLogs.length} รายการ</Tag>
          </Space>
        }
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchLogs}>
              รีเฟรช
            </Button>
            <Button icon={<ExportOutlined />}>
              ส่งออก CSV
            </Button>
          </Space>
        }
      >
        {/* Filters */}
        <div style={{ marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Input
            placeholder="ค้นหา..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
            allowClear
          />
          <Select
            placeholder="การกระทำ"
            value={actionFilter}
            onChange={setActionFilter}
            style={{ width: 180 }}
            allowClear
            options={actionOptions}
          />
          <Select
            placeholder="โมดูล"
            value={moduleFilter}
            onChange={setModuleFilter}
            style={{ width: 200 }}
            allowClear
            options={moduleOptions}
          />
          <RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
            format="DD/MM/YYYY"
            placeholder={['วันที่เริ่ม', 'วันที่สิ้นสุด']}
          />
          <Button 
            icon={<FilterOutlined />} 
            onClick={() => {
              setSearchText('');
              setActionFilter(null);
              setModuleFilter(null);
              setDateRange(null);
            }}
          >
            ล้างตัวกรอง
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredLogs}
          rowKey="id"
          loading={loading}
          pagination={{ 
            pageSize: 20, 
            showSizeChanger: true,
            showTotal: (total) => `ทั้งหมด ${total} รายการ`
          }}
          size="small"
        />
      </Card>
    </div>
  );
};

export default ActivityLogPage;
