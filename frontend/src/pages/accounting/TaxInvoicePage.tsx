import React, { useState, useEffect } from 'react';
import {
  Card, Table, Button, Space, Tag, Modal, Form, Input, Select, DatePicker,
  message, Popconfirm, Typography, Row, Col, Divider, InputNumber, Tabs, Statistic
} from 'antd';
import {
  PlusOutlined, DeleteOutlined, EyeOutlined, PrinterOutlined,
  FileTextOutlined, FileDoneOutlined, FileExcelOutlined
} from '@ant-design/icons';
import { taxInvoicesApi, customersApi } from '../../services/api';
import dayjs from 'dayjs';
import { TaxInvoicePrintPreview } from '../../components/print';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface TaxInvoice {
  id: number;
  docNo: string;
  docType: 'TAX_INVOICE' | 'DEBIT_NOTE' | 'CREDIT_NOTE';
  docDate: string;
  customerId: number;
  customerName: string;
  customerTaxId: string;
  customerAddress: string;
  referenceDocNo?: string;
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  totalAmount: number;
  status: string;
  reason?: string;
  lines: TaxInvoiceLine[];
  createdAt: string;
}

interface TaxInvoiceLine {
  id?: number;
  lineNo: number;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface Customer {
  id: number;
  code: string;
  name: string;
  taxId: string;
  address: string;
}

const DOC_TYPE_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  TAX_INVOICE: { label: 'ใบกำกับภาษี', color: 'blue', icon: <FileTextOutlined /> },
  DEBIT_NOTE: { label: 'ใบเพิ่มหนี้', color: 'orange', icon: <FileDoneOutlined /> },
  CREDIT_NOTE: { label: 'ใบลดหนี้', color: 'green', icon: <FileExcelOutlined /> },
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  DRAFT: { label: 'ฉบับร่าง', color: 'warning' },
  ISSUED: { label: 'ออกแล้ว', color: 'success' },
  CANCELLED: { label: 'ยกเลิก', color: 'error' },
};

const TaxInvoicePage: React.FC = () => {
  const [invoices, setInvoices] = useState<TaxInvoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<TaxInvoice | null>(null);
  const [docType, setDocType] = useState<'TAX_INVOICE' | 'DEBIT_NOTE' | 'CREDIT_NOTE'>('TAX_INVOICE');
  const [form] = Form.useForm();
  const [lines, setLines] = useState<TaxInvoiceLine[]>([
    { lineNo: 1, description: '', quantity: 1, unitPrice: 0, amount: 0 },
  ]);
  const [activeTab, setActiveTab] = useState('all');
  const [printModalVisible, setPrintModalVisible] = useState(false);

  const [filters, setFilters] = useState({
    startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD'),
    docType: '',
  });

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [invoicesRes, customersRes] = await Promise.all([
        taxInvoicesApi.getAll(filters),
        customersApi.getAll(),
      ]);
      setInvoices(invoicesRes.data);
      setCustomers(customersRes.data);
    } catch (error) {
      message.error('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (type: 'TAX_INVOICE' | 'DEBIT_NOTE' | 'CREDIT_NOTE') => {
    setDocType(type);
    form.resetFields();
    form.setFieldsValue({
      docDate: dayjs(),
      vatRate: 7,
    });
    setLines([{ lineNo: 1, description: '', quantity: 1, unitPrice: 0, amount: 0 }]);
    setModalVisible(true);
  };

  const handleView = async (invoice: TaxInvoice) => {
    try {
      const res = await taxInvoicesApi.getById(invoice.id);
      setSelectedInvoice(res.data);
      setViewModalVisible(true);
    } catch (error) {
      message.error('เกิดข้อผิดพลาด');
    }
  };

  const handlePrint = async (invoice: TaxInvoice) => {
    try {
      const res = await taxInvoicesApi.getById(invoice.id);
      setSelectedInvoice(res.data);
      setPrintModalVisible(true);
    } catch (error) {
      message.error('เกิดข้อผิดพลาด');
    }
  };

  const handleCustomerChange = (customerId: number) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      form.setFieldsValue({
        customerTaxId: customer.taxId,
        customerAddress: customer.address,
      });
    }
  };

  const handleAddLine = () => {
    setLines([...lines, {
      lineNo: lines.length + 1,
      description: '',
      quantity: 1,
      unitPrice: 0,
      amount: 0,
    }]);
  };

  const handleRemoveLine = (index: number) => {
    if (lines.length <= 1) return;
    const newLines = lines.filter((_, i) => i !== index).map((l, i) => ({ ...l, lineNo: i + 1 }));
    setLines(newLines);
  };

  const handleLineChange = (index: number, field: string, value: any) => {
    const newLines = [...lines];
    newLines[index] = { ...newLines[index], [field]: value };
    if (field === 'quantity' || field === 'unitPrice') {
      newLines[index].amount = (newLines[index].quantity || 0) * (newLines[index].unitPrice || 0);
    }
    setLines(newLines);
  };

  const calculateTotals = () => {
    const subtotal = lines.reduce((sum, l) => sum + (l.amount || 0), 0);
    const vatRate = form.getFieldValue('vatRate') || 7;
    const vatAmount = subtotal * (vatRate / 100);
    const totalAmount = subtotal + vatAmount;
    return { subtotal, vatAmount, totalAmount };
  };

const handleSubmit = async () => {
  try {
    const values = await form.validateFields();
    const { subtotal, vatAmount, totalAmount } = calculateTotals();
    
    // หา customerName จาก customerId
    const customer = customers.find(c => c.id === values.customerId);
    
    const data = {
      ...values,
      docType,
      docDate: values.docDate.format('YYYY-MM-DD'),
      customerName: customer?.name || '',
      subtotal,
      vatAmount,
      totalAmount,
      lines: lines.filter(l => l.description && l.amount > 0),
    };

      await taxInvoicesApi.create(data);
      message.success('สร้างเอกสารสำเร็จ');
      setModalVisible(false);
      loadData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const handleIssue = async (id: number) => {
    try {
      await taxInvoicesApi.issue(id);
      message.success('ออกเอกสารสำเร็จ');
      loadData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const handleCancel = async (id: number) => {
    const reason = window.prompt('ระบุเหตุผลที่ยกเลิก:');
    if (!reason) return;
    try {
      await taxInvoicesApi.cancel(id, reason);
      message.success('ยกเลิกสำเร็จ');
      loadData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('th-TH', { minimumFractionDigits: 2 });
  };

  // Summary stats
  const taxInvoiceTotal = invoices.filter(i => i.docType === 'TAX_INVOICE' && i.status === 'ISSUED')
    .reduce((sum, i) => sum + i.vatAmount, 0);
  const debitNoteTotal = invoices.filter(i => i.docType === 'DEBIT_NOTE' && i.status === 'ISSUED')
    .reduce((sum, i) => sum + i.vatAmount, 0);
  const creditNoteTotal = invoices.filter(i => i.docType === 'CREDIT_NOTE' && i.status === 'ISSUED')
    .reduce((sum, i) => sum + i.vatAmount, 0);

  const columns = [
    {
      title: 'เลขที่เอกสาร',
      dataIndex: 'docNo',
      key: 'docNo',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'ประเภท',
      dataIndex: 'docType',
      key: 'docType',
      width: 130,
      render: (type: string) => {
        const config = DOC_TYPE_CONFIG[type];
        return <Tag color={config?.color} icon={config?.icon}>{config?.label}</Tag>;
      },
    },
    {
      title: 'วันที่',
      dataIndex: 'docDate',
      key: 'docDate',
      width: 110,
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'ลูกค้า',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'เลขผู้เสียภาษี',
      dataIndex: 'customerTaxId',
      key: 'customerTaxId',
      width: 140,
    },
    {
      title: 'มูลค่าก่อน VAT',
      dataIndex: 'subtotal',
      key: 'subtotal',
      width: 130,
      align: 'right' as const,
      render: (val: number) => formatCurrency(val),
    },
    {
      title: 'VAT',
      dataIndex: 'vatAmount',
      key: 'vatAmount',
      width: 100,
      align: 'right' as const,
      render: (val: number) => formatCurrency(val),
    },
    {
      title: 'รวมทั้งสิ้น',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 130,
      align: 'right' as const,
      render: (val: number) => <Text strong>{formatCurrency(val)}</Text>,
    },
    {
      title: 'สถานะ',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const config = STATUS_CONFIG[status];
        return <Tag color={config?.color}>{config?.label}</Tag>;
      },
    },
    {
      title: 'จัดการ',
      key: 'action',
      width: 150,
      render: (_: unknown, record: TaxInvoice) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} onClick={() => handleView(record)} />
          <Button type="text" icon={<PrinterOutlined />} onClick={() => handlePrint(record)} />
          {record.status === 'DRAFT' && (
            <Popconfirm title="ต้องการออกเอกสารนี้?" onConfirm={() => handleIssue(record.id)}>
              <Button type="text" icon={<FileDoneOutlined />} style={{ color: 'green' }} />
            </Popconfirm>
          )}
          {record.status === 'ISSUED' && (
            <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleCancel(record.id)} />
          )}
        </Space>
      ),
    },
  ];

  const filteredInvoices = activeTab === 'all' ? invoices : invoices.filter(i => i.docType === activeTab);

  return (
    <div style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Space>
            <FileTextOutlined style={{ fontSize: 24 }} />
            <Title level={4} style={{ margin: 0 }}>ใบกำกับภาษี / ใบเพิ่มหนี้ / ใบลดหนี้</Title>
          </Space>
        </Col>
        <Col>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal('TAX_INVOICE')}>
              ใบกำกับภาษี
            </Button>
            <Button icon={<PlusOutlined />} onClick={() => handleOpenModal('DEBIT_NOTE')}>
              ใบเพิ่มหนี้
            </Button>
            <Button icon={<PlusOutlined />} onClick={() => handleOpenModal('CREDIT_NOTE')}>
              ใบลดหนี้
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Summary Stats */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="ภาษีขาย (ใบกำกับภาษี)"
              value={taxInvoiceTotal}
              precision={2}
              prefix="฿"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="ภาษีขายเพิ่ม (ใบเพิ่มหนี้)"
              value={debitNoteTotal}
              precision={2}
              prefix="฿"
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="ภาษีขายลด (ใบลดหนี้)"
              value={creditNoteTotal}
              precision={2}
              prefix="฿"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        {/* Filters */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <DatePicker
              placeholder="วันที่เริ่มต้น"
              value={dayjs(filters.startDate)}
              onChange={(date) => setFilters({ ...filters, startDate: date?.format('YYYY-MM-DD') || '' })}
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={6}>
            <DatePicker
              placeholder="วันที่สิ้นสุด"
              value={dayjs(filters.endDate)}
              onChange={(date) => setFilters({ ...filters, endDate: date?.format('YYYY-MM-DD') || '' })}
              style={{ width: '100%' }}
            />
          </Col>
        </Row>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'all', label: 'ทั้งหมด' },
            { key: 'TAX_INVOICE', label: 'ใบกำกับภาษี' },
            { key: 'DEBIT_NOTE', label: 'ใบเพิ่มหนี้' },
            { key: 'CREDIT_NOTE', label: 'ใบลดหนี้' },
          ]}
        />

        <Table
          columns={columns}
          dataSource={filteredInvoices}
          rowKey="id"
          loading={loading}
          size="small"
        />
      </Card>

      {/* Create Modal */}
      <Modal
        title={`สร้าง${DOC_TYPE_CONFIG[docType]?.label}`}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={1000}
        okText="บันทึก"
        cancelText="ยกเลิก"
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="docDate" label="วันที่" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="customerId" label="ลูกค้า" rules={[{ required: true, message: 'กรุณาเลือกลูกค้า' }]}>
                <Select 
                  showSearch 
                  optionFilterProp="children" 
                  placeholder="เลือกลูกค้า"
                  onChange={handleCustomerChange}
                >
                  {customers.map(c => (
                    <Option key={c.id} value={c.id}>{c.code} - {c.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="vatRate" label="อัตรา VAT (%)" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} min={0} max={100} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="customerTaxId" label="เลขประจำตัวผู้เสียภาษี" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item name="customerAddress" label="ที่อยู่" rules={[{ required: true }]}>
                <TextArea rows={1} />
              </Form.Item>
            </Col>
          </Row>
          {(docType === 'DEBIT_NOTE' || docType === 'CREDIT_NOTE') && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="referenceDocNo" label="อ้างอิงใบกำกับภาษีเลขที่" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="reason" label="เหตุผล" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          )}
        </Form>

        <Divider>รายการสินค้า/บริการ</Divider>

        <Table
          dataSource={lines}
          rowKey="lineNo"
          pagination={false}
          size="small"
          columns={[
            { title: '#', dataIndex: 'lineNo', width: 50 },
            {
              title: 'รายละเอียด',
              dataIndex: 'description',
              render: (_: unknown, record: any, index: number) => (
                <Input
                  value={record.description}
                  onChange={(e) => handleLineChange(index, 'description', e.target.value)}
                  placeholder="รายละเอียดสินค้า/บริการ"
                />
              ),
            },
            {
              title: 'จำนวน',
              dataIndex: 'quantity',
              width: 100,
              render: (_: unknown, record: any, index: number) => (
                <InputNumber
                  value={record.quantity}
                  onChange={(value) => handleLineChange(index, 'quantity', value || 0)}
                  style={{ width: '100%' }}
                  min={1}
                />
              ),
            },
            {
              title: 'ราคาต่อหน่วย',
              dataIndex: 'unitPrice',
              width: 150,
              render: (_: unknown, record: any, index: number) => (
                <InputNumber
                  value={record.unitPrice}
                  onChange={(value) => handleLineChange(index, 'unitPrice', value || 0)}
                  style={{ width: '100%' }}
                  min={0}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
              ),
            },
            {
              title: 'จำนวนเงิน',
              dataIndex: 'amount',
              width: 130,
              align: 'right',
              render: (val: number) => formatCurrency(val),
            },
            {
              title: '',
              width: 50,
              render: (_: unknown, __: any, index: number) => (
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemoveLine(index)}
                  disabled={lines.length <= 1}
                />
              ),
            },
          ]}
          footer={() => {
            const { subtotal, vatAmount, totalAmount } = calculateTotals();
            return (
              <Row justify="space-between">
                <Col>
                  <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddLine}>
                    เพิ่มรายการ
                  </Button>
                </Col>
                <Col>
                  <Space direction="vertical" align="end">
                    <Text>มูลค่าก่อน VAT: {formatCurrency(subtotal)}</Text>
                    <Text>VAT {form.getFieldValue('vatRate') || 7}%: {formatCurrency(vatAmount)}</Text>
                    <Text strong style={{ fontSize: 16 }}>รวมทั้งสิ้น: {formatCurrency(totalAmount)} บาท</Text>
                  </Space>
                </Col>
              </Row>
            );
          }}
        />
      </Modal>

      {/* View Modal */}
      <Modal
        title={`รายละเอียด${selectedInvoice ? DOC_TYPE_CONFIG[selectedInvoice.docType]?.label : ''} - ${selectedInvoice?.docNo}`}
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="print" icon={<PrinterOutlined />} onClick={() => { setViewModalVisible(false); setPrintModalVisible(true); }}>
            พิมพ์
          </Button>,
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            ปิด
          </Button>,
        ]}
        width={900}
      >
        {selectedInvoice && (
          <>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={8}>
                <Text type="secondary">วันที่</Text>
                <div>{dayjs(selectedInvoice.docDate).format('DD/MM/YYYY')}</div>
              </Col>
              <Col span={8}>
                <Text type="secondary">ลูกค้า</Text>
                <div>{selectedInvoice.customerName}</div>
              </Col>
              <Col span={8}>
                <Text type="secondary">เลขผู้เสียภาษี</Text>
                <div>{selectedInvoice.customerTaxId}</div>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={24}>
                <Text type="secondary">ที่อยู่</Text>
                <div>{selectedInvoice.customerAddress}</div>
              </Col>
            </Row>

            <Table
              dataSource={selectedInvoice.lines}
              rowKey="id"
              pagination={false}
              size="small"
              columns={[
                { title: 'ลำดับ', dataIndex: 'lineNo', width: 60 },
                { title: 'รายละเอียด', dataIndex: 'description' },
                { title: 'จำนวน', dataIndex: 'quantity', width: 80, align: 'center' },
                { title: 'ราคาต่อหน่วย', dataIndex: 'unitPrice', width: 120, align: 'right', render: formatCurrency },
                { title: 'จำนวนเงิน', dataIndex: 'amount', width: 120, align: 'right', render: formatCurrency },
              ]}
              summary={() => (
                <>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={4} align="right">
                      <Text>มูลค่าก่อน VAT</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} align="right">
                      {formatCurrency(selectedInvoice.subtotal)}
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={4} align="right">
                      <Text>VAT {selectedInvoice.vatRate}%</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} align="right">
                      {formatCurrency(selectedInvoice.vatAmount)}
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                  <Table.Summary.Row style={{ background: '#e6f7ff' }}>
                    <Table.Summary.Cell index={0} colSpan={4} align="right">
                      <Text strong>รวมทั้งสิ้น</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} align="right">
                      <Text strong style={{ fontSize: 16 }}>{formatCurrency(selectedInvoice.totalAmount)}</Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </>
              )}
            />
          </>
        )}
      </Modal>

      {/* Print Modal */}
      <TaxInvoicePrintPreview
        open={printModalVisible}
        onClose={() => setPrintModalVisible(false)}
        invoice={selectedInvoice ? {
          ...selectedInvoice,
          docFullNo: selectedInvoice.docNo,
          customer: {
            name: selectedInvoice.customerName,
            taxId: selectedInvoice.customerTaxId,
            address: selectedInvoice.customerAddress,
          },
          items: selectedInvoice.lines?.map(line => ({
            description: line.description,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
            amount: line.amount,
          }))
        } : null}
      />
    </div>
  );
};

export default TaxInvoicePage;
