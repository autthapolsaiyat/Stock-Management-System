import React, { useState, useEffect } from 'react';
import {
  Card, Table, Button, Space, Tag, Modal, Form, Input, Select, DatePicker,
  message, Popconfirm, Typography, Row, Col, Divider, InputNumber
} from 'antd';
import {
  PlusOutlined, DeleteOutlined, EyeOutlined, CheckOutlined,
  CloseOutlined, PrinterOutlined, WalletOutlined
} from '@ant-design/icons';
import { paymentVouchersApi, chartOfAccountsApi, suppliersApi, bankAccountsApi } from '../../services/api';
import { PaymentVoucherPrintPreview } from '../../components/print';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface PaymentVoucher {
  id: number;
  docNo: string;
  docDate: string;
  supplierId: number;
  supplierName: string;
  bankAccountId?: number;
  bankAccountName?: string;
  paymentMethod: string;
  totalAmount: number;
  description: string;
  status: string;
  lines: PaymentVoucherLine[];
  createdAt: string;
}

interface PaymentVoucherLine {
  id?: number;
  lineNo: number;
  accountId: number;
  accountCode?: string;
  accountName?: string;
  description: string;
  amount: number;
  referenceDocNo?: string;
}

interface Supplier {
  id: number;
  code: string;
  name: string;
}

interface BankAccount {
  id: number;
  accountNo: string;
  accountName: string;
  bankName: string;
}

interface Account {
  id: number;
  code: string;
  name: string;
}

const PAYMENT_METHODS = [
  { value: 'CASH', label: 'เงินสด' },
  { value: 'TRANSFER', label: 'โอนเงิน' },
  { value: 'CHEQUE', label: 'เช็ค' },
];

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  DRAFT: { label: 'ฉบับร่าง', color: 'warning' },
  POSTED: { label: 'บันทึกแล้ว', color: 'success' },
  CANCELLED: { label: 'ยกเลิก', color: 'error' },
};

const PaymentVoucherPage: React.FC = () => {
  const [vouchers, setVouchers] = useState<PaymentVoucher[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [printModalVisible, setPrintModalVisible] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<PaymentVoucher | null>(null);
  const [form] = Form.useForm();
  const [lines, setLines] = useState<PaymentVoucherLine[]>([
    { lineNo: 1, accountId: 0, description: '', amount: 0 },
  ]);

  const [filters, setFilters] = useState({
    startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD'),
    status: '',
  });

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [vouchersRes, suppliersRes, bankRes, accountsRes] = await Promise.all([
        paymentVouchersApi.getAll(filters),
        suppliersApi.getAll(),
        bankAccountsApi.getAll(),
        chartOfAccountsApi.getAll(),
      ]);
      setVouchers(vouchersRes.data);
      setSuppliers(suppliersRes.data);
      setBankAccounts(bankRes.data);
      setAccounts(accountsRes.data);
    } catch (error) {
      message.error('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    form.resetFields();
    form.setFieldsValue({
      docDate: dayjs(),
      paymentMethod: 'TRANSFER',
    });
    setLines([{ lineNo: 1, accountId: 0, description: '', amount: 0 }]);
    setModalVisible(true);
  };

  const handleView = async (voucher: PaymentVoucher) => {
    try {
      const res = await paymentVouchersApi.getById(voucher.id);
      setSelectedVoucher(res.data);
      setViewModalVisible(true);
    } catch (error) {
      message.error('เกิดข้อผิดพลาด');
    }
  };

  const handlePrint = async (voucher: PaymentVoucher) => {
    try {
      const res = await paymentVouchersApi.getById(voucher.id);
      setSelectedVoucher(res.data);
      setPrintModalVisible(true);
    } catch (error) {
      message.error('เกิดข้อผิดพลาด');
    }
  };

  const handleAddLine = () => {
    setLines([...lines, {
      lineNo: lines.length + 1,
      accountId: 0,
      description: '',
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
    setLines(newLines);
  };

  const calculateTotal = () => {
    return lines.reduce((sum, l) => sum + (Number(l.amount) || 0), 0);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        ...values,
        docDate: values.docDate.format('YYYY-MM-DD'),
        totalAmount: calculateTotal(),
        lines: lines.filter(l => l.accountId && l.amount > 0),
      };

      await paymentVouchersApi.create(data);
      message.success('สร้างใบสำคัญจ่ายสำเร็จ');
      setModalVisible(false);
      loadData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const handlePost = async (id: number) => {
    try {
      await paymentVouchersApi.post(id);
      message.success('บันทึกสำเร็จ');
      loadData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const handleCancel = async (id: number) => {
    const reason = window.prompt('ระบุเหตุผลที่ยกเลิก:');
    if (!reason) return;
    try {
      await paymentVouchersApi.cancel(id, reason);
      message.success('ยกเลิกสำเร็จ');
      loadData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await paymentVouchersApi.delete(id);
      message.success('ลบสำเร็จ');
      loadData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const columns = [
    {
      title: 'เลขที่เอกสาร',
      dataIndex: 'docNo',
      key: 'docNo',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'วันที่',
      dataIndex: 'docDate',
      key: 'docDate',
      width: 110,
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'ผู้จำหน่าย',
      dataIndex: 'supplierName',
      key: 'supplierName',
    },
    {
      title: 'วิธีชำระ',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 100,
      render: (method: string) => {
        const m = PAYMENT_METHODS.find(p => p.value === method);
        return <Tag>{m?.label || method}</Tag>;
      },
    },
    {
      title: 'จำนวนเงิน',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 130,
      align: 'right' as const,
      render: (val: number) => (
        <Text strong style={{ color: '#cf1322' }}>
          {Number(val).toLocaleString('th-TH', { minimumFractionDigits: 2 })}
        </Text>
      ),
    },
    {
      title: 'สถานะ',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const config = STATUS_CONFIG[status];
        return <Tag color={config?.color}>{config?.label || status}</Tag>;
      },
    },
    {
      title: 'จัดการ',
      key: 'action',
      width: 180,
      render: (_: unknown, record: PaymentVoucher) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} onClick={() => handleView(record)} />
          <Button type="text" icon={<PrinterOutlined />} onClick={() => handlePrint(record)} />
          {record.status === 'DRAFT' && (
            <>
              <Popconfirm title="ต้องการบันทึกรายการนี้?" onConfirm={() => handlePost(record.id)}>
                <Button type="text" icon={<CheckOutlined />} style={{ color: 'green' }} />
              </Popconfirm>
              <Popconfirm title="ต้องการลบรายการนี้?" onConfirm={() => handleDelete(record.id)}>
                <Button type="text" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </>
          )}
          {record.status === 'POSTED' && (
            <Button type="text" danger icon={<CloseOutlined />} onClick={() => handleCancel(record.id)} />
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <Space>
              <WalletOutlined style={{ fontSize: 24, color: '#cf1322' }} />
              <Title level={4} style={{ margin: 0 }}>ใบสำคัญจ่าย (Payment Voucher)</Title>
            </Space>
          </Col>
          <Col>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenModal}>
              สร้างใบสำคัญจ่าย
            </Button>
          </Col>
        </Row>

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
          <Col span={6}>
            <Select
              placeholder="สถานะ"
              value={filters.status || undefined}
              onChange={(value) => setFilters({ ...filters, status: value || '' })}
              style={{ width: '100%' }}
              allowClear
            >
              <Option value="DRAFT">ฉบับร่าง</Option>
              <Option value="POSTED">บันทึกแล้ว</Option>
              <Option value="CANCELLED">ยกเลิก</Option>
            </Select>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={vouchers}
          rowKey="id"
          loading={loading}
          size="small"
        />
      </Card>

      {/* Create Modal */}
      <Modal
        title="สร้างใบสำคัญจ่าย"
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={900}
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
              <Form.Item name="supplierId" label="ผู้จำหน่าย" rules={[{ required: true, message: 'กรุณาเลือกผู้จำหน่าย' }]}>
                <Select showSearch optionFilterProp="children" placeholder="เลือกผู้จำหน่าย">
                  {suppliers.map(s => (
                    <Option key={s.id} value={s.id}>{s.code} - {s.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="paymentMethod" label="วิธีชำระเงิน" rules={[{ required: true }]}>
                <Select>
                  {PAYMENT_METHODS.map(p => (
                    <Option key={p.value} value={p.value}>{p.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="bankAccountId" label="บัญชีธนาคาร">
                <Select allowClear placeholder="เลือกบัญชี">
                  {bankAccounts.map(b => (
                    <Option key={b.id} value={b.id}>{b.bankName} - {b.accountNo}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="description" label="หมายเหตุ">
                <TextArea rows={1} />
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Divider>รายการจ่ายเงิน</Divider>

        <Table
          dataSource={lines}
          rowKey="lineNo"
          pagination={false}
          size="small"
          columns={[
            { title: '#', dataIndex: 'lineNo', width: 50 },
            {
              title: 'บัญชี',
              dataIndex: 'accountId',
              render: (_: unknown, record: any, index: number) => (
                <Select
                  style={{ width: '100%' }}
                  value={record.accountId || undefined}
                  onChange={(value) => handleLineChange(index, 'accountId', value)}
                  showSearch
                  optionFilterProp="children"
                  placeholder="เลือกบัญชี"
                >
                  {accounts.map(a => (
                    <Option key={a.id} value={a.id}>{a.code} - {a.name}</Option>
                  ))}
                </Select>
              ),
            },
            {
              title: 'รายละเอียด',
              dataIndex: 'description',
              width: 200,
              render: (_: unknown, record: any, index: number) => (
                <Input
                  value={record.description}
                  onChange={(e) => handleLineChange(index, 'description', e.target.value)}
                />
              ),
            },
            {
              title: 'จำนวนเงิน',
              dataIndex: 'amount',
              width: 150,
              render: (_: unknown, record: any, index: number) => (
                <InputNumber
                  value={record.amount}
                  onChange={(value) => handleLineChange(index, 'amount', value || 0)}
                  style={{ width: '100%' }}
                  min={0}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
              ),
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
          footer={() => (
            <Row justify="space-between">
              <Col>
                <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddLine}>
                  เพิ่มรายการ
                </Button>
              </Col>
              <Col>
                <Text strong style={{ fontSize: 16, color: '#cf1322' }}>
                  รวม: {calculateTotal().toLocaleString('th-TH', { minimumFractionDigits: 2 })} บาท
                </Text>
              </Col>
            </Row>
          )}
        />
      </Modal>

      {/* View Modal */}
      <Modal
        title={`รายละเอียดใบสำคัญจ่าย - ${selectedVoucher?.docNo}`}
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedVoucher && (
          <>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={8}>
                <Text type="secondary">วันที่</Text>
                <div>{dayjs(selectedVoucher.docDate).format('DD/MM/YYYY')}</div>
              </Col>
              <Col span={8}>
                <Text type="secondary">ผู้จำหน่าย</Text>
                <div>{selectedVoucher.supplierName}</div>
              </Col>
              <Col span={8}>
                <Text type="secondary">สถานะ</Text>
                <div>
                  <Tag color={STATUS_CONFIG[selectedVoucher.status]?.color}>
                    {STATUS_CONFIG[selectedVoucher.status]?.label}
                  </Tag>
                </div>
              </Col>
            </Row>

            <Table
              dataSource={selectedVoucher.lines}
              rowKey="id"
              pagination={false}
              size="small"
              columns={[
                { title: 'รหัสบัญชี', dataIndex: 'accountCode', width: 100 },
                { title: 'ชื่อบัญชี', dataIndex: 'accountName' },
                { title: 'รายละเอียด', dataIndex: 'description' },
                {
                  title: 'จำนวนเงิน',
                  dataIndex: 'amount',
                  width: 130,
                  align: 'right',
                  render: (val: number) => Number(val).toLocaleString('th-TH', { minimumFractionDigits: 2 }),
                },
              ]}
              summary={() => (
                <Table.Summary.Row style={{ background: '#fff2f0' }}>
                  <Table.Summary.Cell index={0} colSpan={3}>
                    <Text strong>รวมทั้งสิ้น</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1} align="right">
                    <Text strong style={{ color: '#cf1322' }}>
                      {Number(selectedVoucher.totalAmount).toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                    </Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              )}
            />
          </>
        )}
      </Modal>

      {/* Print Modal */}
      {selectedVoucher && (
        <PaymentVoucherPrintPreview
          open={printModalVisible}
          onClose={() => setPrintModalVisible(false)}
          voucher={selectedVoucher}
        />
      )}
    </div>
  );
};

export default PaymentVoucherPage;
