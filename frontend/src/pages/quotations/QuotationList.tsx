import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table, Button, Tag, Space, Input, Select, Card, message, Popconfirm, Tooltip
} from 'antd';
import {
  PlusOutlined, SearchOutlined, EyeOutlined, EditOutlined, ArrowLeftOutlined,
  CloseCircleOutlined, DeleteOutlined, FileTextOutlined, PrinterOutlined
} from '@ant-design/icons';
import QuotationPrintPreview from '../../components/quotation/QuotationPrintPreview';
import { quotationsApi } from '../../services/api';

const { Option } = Select;

const typeLabels: Record<string, { text: string; color: string; icon: string }> = {
  STANDARD: { text: 'Accustandard/PT', color: 'blue', icon: '🧪' },
  FORENSIC: { text: 'นิติวิทยาศาสตร์', color: 'purple', icon: '🔬' },
  MAINTENANCE: { text: 'บำรุงรักษา', color: 'green', icon: '🔧' },
  LAB: { text: 'เครื่องมือวิทยาศาสตร์', color: 'orange', icon: '🏭' },
};

const statusLabels: Record<string, { text: string; color: string }> = {
  DRAFT: { text: 'ร่าง', color: 'default' },
  PENDING: { text: 'รออนุมัติ', color: 'orange' },
  APPROVED: { text: 'อนุมัติแล้ว', color: 'green' },
  SENT: { text: 'ส่งแล้ว', color: 'blue' },
  CONFIRMED: { text: 'ยืนยันแล้ว', color: 'cyan' },
  PARTIALLY_CLOSED: { text: 'ปิดบางส่วน', color: 'geekblue' },
  CLOSED: { text: 'ปิดแล้ว', color: 'green' },
  CANCELLED: { text: 'ยกเลิก', color: 'red' },
};

interface QuotationData {
  id: number;
  docFullNo?: string;
  quotationType?: string;
  customerName?: string;
  docDate?: string;
  grandTotal?: number;
  subtotal?: number;
  discountAmount?: number;
  afterDiscount?: number;
  taxAmount?: number;
  expectedMarginPercent?: number;
  requiresMarginApproval?: boolean;
  marginApproved?: boolean;
  status?: string;
  items?: any[];
}

const QuotationList: React.FC = () => {
  const navigate = useNavigate();
  const [quotations, setQuotations] = useState<QuotationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [printPreviewOpen, setPrintPreviewOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<QuotationData | null>(null);
  const [loadingPrint, setLoadingPrint] = useState(false);

  useEffect(() => {
    fetchQuotations();
  }, [filterType, filterStatus]);

  const fetchQuotations = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (filterType) params.type = filterType;
      if (filterStatus) params.status = filterStatus;
      const response = await quotationsApi.getAll(params);
      setQuotations(response.data || []);
    } catch (error) {
      console.error('Fetch error:', error);
      message.error('ไม่สามารถโหลดข้อมูลได้');
      setQuotations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    try {
      await quotationsApi.cancel(id);
      message.success('ยกเลิกใบเสนอราคาสำเร็จ');
      fetchQuotations();
    } catch (error) {
      message.error('ไม่สามารถยกเลิกได้');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await quotationsApi.delete(id);
      message.success('ลบใบเสนอราคาสำเร็จ');
      fetchQuotations();
    } catch (error) {
      message.error('ไม่สามารถลบได้');
    }
  };

  const handlePrint = async (record: QuotationData) => {
    setLoadingPrint(true);
    try {
      // Fetch full quotation data with items
      const response = await quotationsApi.getById(record.id);
      setSelectedQuotation(response.data);
      setPrintPreviewOpen(true);
    } catch (error) {
      message.error('ไม่สามารถโหลดข้อมูลใบเสนอราคาได้');
    } finally {
      setLoadingPrint(false);
    }
  };

  const filteredData = quotations.filter(q => 
    !searchText || 
    q.docFullNo?.toLowerCase().includes(searchText.toLowerCase()) ||
    q.customerName?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'เลขที่',
      dataIndex: 'docFullNo',
      key: 'docFullNo',
      width: 140,
      render: (text: string, record: QuotationData) => (
        <Button type="link" onClick={() => navigate(`/quotations/${record.id}`)}>
          {text || '-'}
        </Button>
      ),
    },
    {
      title: 'ประเภท',
      dataIndex: 'quotationType',
      key: 'quotationType',
      width: 150,
      render: (type: string) => {
        const config = typeLabels[type] || { text: type || 'ไม่ระบุ', color: 'default', icon: '📄' };
        return (
          <Tag color={config.color}>
            {config.icon} {config.text}
          </Tag>
        );
      },
    },
    {
      title: 'ลูกค้า',
      dataIndex: 'customerName',
      key: 'customerName',
      ellipsis: true,
      render: (text: string) => text || '-',
    },
    {
      title: 'วันที่',
      dataIndex: 'docDate',
      key: 'docDate',
      width: 110,
      render: (date: string) => date ? new Date(date).toLocaleDateString('th-TH') : '-',
    },
    {
      title: 'ยอดรวม',
      dataIndex: 'grandTotal',
      key: 'grandTotal',
      width: 130,
      align: 'right' as const,
      render: (val: number) => `฿${Number(val || 0).toLocaleString('th-TH', { minimumFractionDigits: 2 })}`,
    },
    {
      title: 'Margin',
      dataIndex: 'expectedMarginPercent',
      key: 'expectedMarginPercent',
      width: 90,
      align: 'center' as const,
      render: (val: number, record: QuotationData) => {
        const percent = Number(val || 0);
        const isLow = record.requiresMarginApproval && !record.marginApproved;
        return (
          <Tag color={isLow ? 'warning' : percent >= 20 ? 'green' : 'blue'}>
            {percent.toFixed(1)}%
            {isLow && ' ⚠️'}
          </Tag>
        );
      },
    },
    {
      title: 'สถานะ',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => {
        const config = statusLabels[status] || { text: status || 'ไม่ระบุ', color: 'default' };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'จัดการ',
      key: 'actions',
      width: 200,
      render: (_: any, record: QuotationData) => (
        <Space size="small">
          <Tooltip title="ดูรายละเอียด">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/quotations/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="พิมพ์">
            <Button
              type="text"
              icon={<PrinterOutlined />}
              loading={loadingPrint}
              onClick={() => handlePrint(record)}
            />
          </Tooltip>
          {record.status === 'DRAFT' && (
            <Tooltip title="แก้ไข">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => navigate(`/quotations/${record.id}/edit`)}
              />
            </Tooltip>
          )}
          {(['CONFIRMED', 'PARTIALLY_CLOSED'] as string[]).includes(record.status || '') && (
            <Tooltip title="สร้าง PO">
              <Button
                type="text"
                icon={<FileTextOutlined />}
                onClick={() => navigate(`/purchase-orders/new?quotationId=${record.id}`)}
              />
            </Tooltip>
          )}
          {['DRAFT', 'PENDING'].includes(record.status || '') && (
            <Popconfirm
              title="ยืนยันการยกเลิก?"
              onConfirm={() => handleCancel(record.id!)}
            >
              <Tooltip title="ยกเลิก">
                <Button type="text" danger icon={<CloseCircleOutlined />} />
              </Tooltip>
            </Popconfirm>
          )}
          {record.status === 'CANCELLED' && (
            <Popconfirm
              title="ลบใบเสนอราคานี้?"
              onConfirm={() => handleDelete(record.id!)}
            >
              <Tooltip title="ลบ">
                <Button type="text" danger icon={<DeleteOutlined />} />
              </Tooltip>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="page-container">
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/intro')}
        style={{ marginBottom: 16 }}
      >
        กลับหน้าหลัก
      </Button>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 24 }}>📋 ใบเสนอราคา</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => navigate('/quotations/new')}
        >
          สร้างใบเสนอราคา
        </Button>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input
            placeholder="ค้นหา..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
            allowClear
          />
          <Select
            placeholder="ประเภท"
            value={filterType || undefined}
            onChange={setFilterType}
            style={{ width: 180 }}
            allowClear
          >
            <Option value="STANDARD">🧪 Accustandard/PT</Option>
            <Option value="FORENSIC">🔬 นิติวิทยาศาสตร์</Option>
            <Option value="MAINTENANCE">🔧 บำรุงรักษา</Option>
            <Option value="LAB">🏭 เครื่องมือวิทยาศาสตร์</Option>
          </Select>
          <Select
            placeholder="สถานะ"
            value={filterStatus || undefined}
            onChange={setFilterStatus}
            style={{ width: 150 }}
            allowClear
          >
            <Option value="DRAFT">ร่าง</Option>
            <Option value="PENDING">รออนุมัติ</Option>
            <Option value="APPROVED">อนุมัติแล้ว</Option>
            <Option value="SENT">ส่งแล้ว</Option>
            <Option value="CONFIRMED">ยืนยันแล้ว</Option>
            <Option value="CLOSED">ปิดแล้ว</Option>
            <Option value="CANCELLED">ยกเลิก</Option>
          </Select>
        </Space>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showTotal: (total, range) => `แสดง ${range[0]}-${range[1]} จาก ${total} รายการ`,
          }}
        />
      </Card>

      {selectedQuotation && (
        <QuotationPrintPreview
          open={printPreviewOpen}
          onClose={() => {
            setPrintPreviewOpen(false);
            setSelectedQuotation(null);
          }}
          quotation={{
            docFullNo: selectedQuotation.docFullNo,
            docDate: selectedQuotation.docDate,
            grandTotal: Number(selectedQuotation.grandTotal) || 0,
            subtotal: Number(selectedQuotation.subtotal) || 0,
            discountAmount: Number(selectedQuotation.discountAmount) || 0,
            afterDiscount: Number(selectedQuotation.afterDiscount) || 0,
            taxAmount: Number(selectedQuotation.taxAmount) || 0,
          }}
          items={selectedQuotation.items || []}
          customer={null}
        />
      )}
    </div>
  );
};

export default QuotationList;
