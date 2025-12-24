import { useState, useEffect } from 'react';
import { 
  Card, Table, Input, Space, Tag, DatePicker, Select, 
  Button, Typography, message, Tooltip
} from 'antd';
import { 
  HistoryOutlined, SearchOutlined, ReloadOutlined,
  FilterOutlined, DownloadOutlined
} from '@ant-design/icons';
import { auditLogsApi } from '../../services/api';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Text } = Typography;

interface AuditLog {
  id: number;
  module: string;
  action: string;
  documentId: number | null;
  documentNo: string | null;
  userId: number;
  userName: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  details: any;
  createdAt: string;
}

interface ModuleOption {
  value: string;
  label: string;
}

interface ActionOption {
  value: string;
  label: string;
}

const ActivityLogPage = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [actionFilter, setActionFilter] = useState<string | null>(null);
  const [moduleFilter, setModuleFilter] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20 });
  
  const [moduleOptions, setModuleOptions] = useState<ModuleOption[]>([]);
  const [actionOptions, setActionOptions] = useState<ActionOption[]>([]);

  useEffect(() => {
    fetchOptions();
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [moduleFilter, actionFilter, dateRange, pagination.current, pagination.pageSize]);

  const fetchOptions = async () => {
    try {
      const [modulesRes, actionsRes] = await Promise.all([
        auditLogsApi.getModules(),
        auditLogsApi.getActions(),
      ]);
      setModuleOptions(modulesRes.data);
      setActionOptions(actionsRes.data);
    } catch (error) {
      // Use fallback options
      setModuleOptions([
        { value: 'STOCK_ISSUE', label: 'เบิกสินค้า' },
        { value: 'STOCK_TRANSFER', label: 'โอนสินค้า' },
        { value: 'STOCK_ADJUSTMENT', label: 'ปรับปรุงสต็อก' },
        { value: 'STOCK_COUNT', label: 'นับสต็อก' },
        { value: 'STOCK_BALANCE', label: 'ยอดคงเหลือ' },
        { value: 'QUOTATION', label: 'ใบเสนอราคา' },
        { value: 'PURCHASE_ORDER', label: 'ใบสั่งซื้อ' },
        { value: 'GOODS_RECEIPT', label: 'ใบรับสินค้า' },
        { value: 'SALES_INVOICE', label: 'ใบขายสินค้า' },
        { value: 'AUTH', label: 'การยืนยันตัวตน' },
      ]);
      setActionOptions([
        { value: 'VIEW', label: 'ดู' },
        { value: 'CREATE', label: 'สร้าง' },
        { value: 'UPDATE', label: 'แก้ไข' },
        { value: 'DELETE', label: 'ลบ' },
        { value: 'POST', label: 'ผ่านรายการ' },
        { value: 'CANCEL', label: 'ยกเลิก' },
        { value: 'APPROVE', label: 'อนุมัติ' },
      ]);
    }
  };

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params: any = {
        limit: pagination.pageSize,
        offset: (pagination.current - 1) * pagination.pageSize,
      };
      
      if (moduleFilter) params.module = moduleFilter;
      if (actionFilter) params.action = actionFilter;
      if (dateRange) {
        params.startDate = dateRange[0].startOf('day').toISOString();
        params.endDate = dateRange[1].endOf('day').toISOString();
      }

      const response = await auditLogsApi.getAll(params);
      setLogs(response.data.data);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
      message.error('ไม่สามารถโหลดข้อมูลได้');
      setLogs([]);
    }
    setLoading(false);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const params: any = {};
      if (moduleFilter) params.module = moduleFilter;
      if (actionFilter) params.action = actionFilter;
      if (dateRange) {
        params.startDate = dateRange[0].startOf('day').toISOString();
        params.endDate = dateRange[1].endOf('day').toISOString();
      }

      const response = await auditLogsApi.exportCsv(params);
      
      // Create download link
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `audit-logs-${dayjs().format('YYYY-MM-DD-HHmmss')}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
      
      message.success('ส่งออกข้อมูลสำเร็จ');
    } catch (error) {
      console.error('Failed to export:', error);
      message.error('ไม่สามารถส่งออกข้อมูลได้');
    }
    setExporting(false);
  };

  const clearFilters = () => {
    setSearchText('');
    setActionFilter(null);
    setModuleFilter(null);
    setDateRange(null);
    setPagination({ ...pagination, current: 1 });
  };

  const actionColors: Record<string, string> = {
    LOGIN: 'green',
    LOGOUT: 'default',
    CREATE: 'blue',
    UPDATE: 'orange',
    DELETE: 'red',
    VIEW: 'default',
    POST: 'purple',
    CANCEL: 'volcano',
    APPROVE: 'cyan',
    REJECT: 'red',
    EXPORT: 'geekblue',
  };

  const moduleColors: Record<string, string> = {
    AUTH: 'blue',
    USER: 'purple',
    QUOTATION: 'green',
    PURCHASE_ORDER: 'orange',
    GOODS_RECEIPT: 'lime',
    SALES_INVOICE: 'magenta',
    STOCK_ISSUE: 'red',
    STOCK_TRANSFER: 'cyan',
    STOCK_ADJUSTMENT: 'gold',
    STOCK_COUNT: 'geekblue',
    STOCK_BALANCE: 'volcano',
  };

  // Client-side search filter
  const filteredLogs = logs.filter((log) => {
    if (!searchText) return true;
    const searchLower = searchText.toLowerCase();
    return (
      log.userName?.toLowerCase().includes(searchLower) ||
      log.documentNo?.toLowerCase().includes(searchLower) ||
      log.module?.toLowerCase().includes(searchLower) ||
      log.action?.toLowerCase().includes(searchLower)
    );
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
      width: 150,
      render: (_: any, record: AuditLog) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.userName || '-'}</div>
          <div style={{ fontSize: 11, color: '#6b7280' }}>ID: {record.userId}</div>
        </div>
      ),
    },
    {
      title: 'การกระทำ',
      dataIndex: 'action',
      key: 'action',
      width: 100,
      render: (action: string) => (
        <Tag color={actionColors[action] || 'default'}>{action}</Tag>
      ),
    },
    {
      title: 'โมดูล',
      dataIndex: 'module',
      key: 'module',
      width: 140,
      render: (module: string) => (
        <Tag color={moduleColors[module] || 'default'}>{module}</Tag>
      ),
    },
    {
      title: 'เอกสาร',
      key: 'document',
      width: 150,
      render: (_: any, record: AuditLog) => (
        record.documentNo ? (
          <Text code style={{ fontSize: 12 }}>{record.documentNo}</Text>
        ) : (
          <Text type="secondary">-</Text>
        )
      ),
    },
    {
      title: 'รายละเอียด',
      dataIndex: 'details',
      key: 'details',
      ellipsis: true,
      render: (details: any) => (
        details ? (
          <Tooltip title={JSON.stringify(details, null, 2)}>
            <Text style={{ fontSize: 12 }} ellipsis>
              {typeof details === 'object' ? JSON.stringify(details) : details}
            </Text>
          </Tooltip>
        ) : '-'
      ),
    },
    {
      title: 'IP Address',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      width: 130,
      render: (ip: string) => (
        ip ? <Text code style={{ fontSize: 11 }}>{ip}</Text> : '-'
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* Info Banner */}
      <Card 
        style={{ marginBottom: 16, background: '#fef3c7', border: '1px solid #f59e0b' }}
        styles={{ body: { padding: 16 } }}
      >
        <Space>
          <span style={{ fontSize: 20 }}>⚖️</span>
          <div>
            <div style={{ fontWeight: 600, color: '#92400e' }}>
              บันทึกกิจกรรมตาม พ.ร.บ. คอมพิวเตอร์ พ.ศ. 2560
            </div>
            <div style={{ fontSize: 12, color: '#a16207' }}>
              ข้อมูลจะถูกเก็บรักษาไว้อย่างน้อย 90 วัน ตามกฎหมายกำหนด (ลบอัตโนมัติทุกวัน 02:00 น.)
            </div>
          </div>
        </Space>
      </Card>

      <Card
        title={
          <Space>
            <HistoryOutlined />
            <span>บันทึกกิจกรรม (Audit Log)</span>
            <Tag color="blue">{total} รายการ</Tag>
          </Space>
        }
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchLogs} loading={loading}>
              รีเฟรช
            </Button>
            <Button 
              icon={<DownloadOutlined />} 
              onClick={handleExport}
              loading={exporting}
            >
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
            style={{ width: 200 }}
            allowClear
          />
          <Select
            placeholder="การกระทำ"
            value={actionFilter}
            onChange={(value) => {
              setActionFilter(value);
              setPagination({ ...pagination, current: 1 });
            }}
            style={{ width: 150 }}
            allowClear
            options={actionOptions}
          />
          <Select
            placeholder="โมดูล"
            value={moduleFilter}
            onChange={(value) => {
              setModuleFilter(value);
              setPagination({ ...pagination, current: 1 });
            }}
            style={{ width: 180 }}
            allowClear
            options={moduleOptions}
          />
          <RangePicker
            value={dateRange}
            onChange={(dates) => {
              setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs]);
              setPagination({ ...pagination, current: 1 });
            }}
            format="DD/MM/YYYY"
            placeholder={['วันที่เริ่ม', 'วันที่สิ้นสุด']}
          />
          <Button 
            icon={<FilterOutlined />} 
            onClick={clearFilters}
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
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: total,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (t) => `ทั้งหมด ${t} รายการ`,
            onChange: (page, pageSize) => {
              setPagination({ current: page, pageSize: pageSize || 20 });
            },
          }}
          size="small"
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
};

export default ActivityLogPage;
