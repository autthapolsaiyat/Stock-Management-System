import React, { useState, useEffect } from 'react';
import {
  Card, Table, Button, Space, Tag, Modal, Form, Input, Select, DatePicker,
  message, Popconfirm, Typography, Row, Col, Divider, InputNumber, Statistic
} from 'antd';
import {
  PlusOutlined, DeleteOutlined, EyeOutlined, PrinterOutlined,
  FileDoneOutlined, AuditOutlined
} from '@ant-design/icons';
import { withholdingTaxApi, suppliersApi } from '../../services/api';
import dayjs from 'dayjs';
import { WithholdingTaxPrintPreview } from '../../components/print';

const { Title, Text } = Typography;
const { Option } = Select;

interface WithholdingTax {
  id: number;
  docNo: string;
  docDate: string;
  paymentDate: string;
  payerId: number;
  payerName: string;
  payerTaxId: string;
  payerAddress: string;
  payeeId: number;
  payeeName: string;
  payeeTaxId: string;
  payeeAddress: string;
  formType: 'PND1' | 'PND3' | 'PND53';
  incomeType: string;
  incomeDescription: string;
  incomeAmount: number;
  taxRate: number;
  taxAmount: number;
  paymentType: 'CASH' | 'CHEQUE' | 'TRANSFER';
  status: string;
  createdAt: string;
}

interface Supplier {
  id: number;
  code: string;
  name: string;
  taxId: string;
  address: string;
}

const FORM_TYPES = [
  { value: 'PND1', label: 'ภ.ง.ด.1 (หักจากบุคคล)' },
  { value: 'PND3', label: 'ภ.ง.ด.3 (หักจากบุคคลธรรมดา)' },
  { value: 'PND53', label: 'ภ.ง.ด.53 (หักจากนิติบุคคล)' },
];

const INCOME_TYPES = [
  { value: '1', label: '1. เงินเดือน ค่าจ้าง เบี้ยเลี้ยง โบนัส (40(1))' },
  { value: '2', label: '2. ค่าธรรมเนียม ค่านายหน้า (40(2))' },
  { value: '3', label: '3. ค่าลิขสิทธิ์ (40(3))' },
  { value: '4a', label: '4(ก) ดอกเบี้ย' },
  { value: '4b', label: '4(ข) เงินปันผล เงินส่วนแบ่งกำไร' },
  { value: '5', label: '5. ค่าเช่าทรัพย์สิน (40(5))' },
  { value: '6', label: '6. ค่าวิชาชีพอิสระ (40(6))' },
  { value: '7', label: '7. ค่ารับเหมา ค่าบริการ (40(7)(8))' },
  { value: '8', label: '8. รางวัล ส่วนลด (3 เตรส)' },
];

const TAX_RATES = [
  { value: 1, label: '1%' },
  { value: 2, label: '2%' },
  { value: 3, label: '3%' },
  { value: 5, label: '5%' },
  { value: 10, label: '10%' },
  { value: 15, label: '15%' },
];

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  DRAFT: { label: 'ฉบับร่าง', color: 'warning' },
  ISSUED: { label: 'ออกแล้ว', color: 'success' },
  SUBMITTED: { label: 'ยื่นแล้ว', color: 'blue' },
  CANCELLED: { label: 'ยกเลิก', color: 'error' },
};

const WithholdingTaxPage: React.FC = () => {
  const [certificates, setCertificates] = useState<WithholdingTax[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedCert, setSelectedCert] = useState<WithholdingTax | null>(null);
  const [printModalVisible, setPrintModalVisible] = useState(false);
  const [form] = Form.useForm();

  const [filters, setFilters] = useState({
    startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD'),
    formType: '',
  });

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [certsRes, suppliersRes] = await Promise.all([
        withholdingTaxApi.getAll(filters),
        suppliersApi.getAll(),
      ]);
      setCertificates(certsRes.data);
      setSuppliers(suppliersRes.data);
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
      paymentDate: dayjs(),
      formType: 'PND53',
      taxRate: 3,
      paymentType: 'TRANSFER',
    });
    setModalVisible(true);
  };

  const handleView = async (cert: WithholdingTax) => {
    try {
      const res = await withholdingTaxApi.getById(cert.id);
      setSelectedCert(res.data);
      setViewModalVisible(true);
    } catch (error) {
      message.error('เกิดข้อผิดพลาด');
    }
  };

  const handlePrint = async (cert: WithholdingTax) => {
    try {
      const res = await withholdingTaxApi.getById(cert.id);
      setSelectedCert(res.data);
      setPrintModalVisible(true);
    } catch (error) {
      message.error('เกิดข้อผิดพลาด');
    }
  };

  const handlePayeeChange = (supplierId: number) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    if (supplier) {
      form.setFieldsValue({
        payeeName: supplier.name,
        payeeTaxId: supplier.taxId,
        payeeAddress: supplier.address,
      });
    }
  };

  const handleIncomeChange = () => {
    const incomeAmount = form.getFieldValue('incomeAmount') || 0;
    const taxRate = form.getFieldValue('taxRate') || 0;
    const taxAmount = incomeAmount * (taxRate / 100);
    form.setFieldsValue({ taxAmount });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        ...values,
        docDate: values.docDate.format('YYYY-MM-DD'),
        paymentDate: values.paymentDate.format('YYYY-MM-DD'),
      };

      await withholdingTaxApi.create(data);
      message.success('สร้างหนังสือรับรองสำเร็จ');
      setModalVisible(false);
      loadData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const handleIssue = async (id: number) => {
    try {
      await withholdingTaxApi.issue(id);
      message.success('ออกหนังสือรับรองสำเร็จ');
      loadData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await withholdingTaxApi.delete(id);
      message.success('ลบสำเร็จ');
      loadData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('th-TH', { minimumFractionDigits: 2 });
  };

  // Summary stats
  const totalTaxAmount = certificates.filter(c => c.status !== 'CANCELLED')
    .reduce((sum, c) => sum + c.taxAmount, 0);
  const pnd3Total = certificates.filter(c => c.formType === 'PND3' && c.status !== 'CANCELLED')
    .reduce((sum, c) => sum + c.taxAmount, 0);
  const pnd53Total = certificates.filter(c => c.formType === 'PND53' && c.status !== 'CANCELLED')
    .reduce((sum, c) => sum + c.taxAmount, 0);

  const columns = [
    {
      title: 'เลขที่',
      dataIndex: 'docNo',
      key: 'docNo',
      width: 120,
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'วันที่จ่าย',
      dataIndex: 'paymentDate',
      key: 'paymentDate',
      width: 110,
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'ประเภท',
      dataIndex: 'formType',
      key: 'formType',
      width: 100,
      render: (type: string) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: 'ผู้รับเงิน',
      dataIndex: 'payeeName',
      key: 'payeeName',
    },
    {
      title: 'เลขผู้เสียภาษี',
      dataIndex: 'payeeTaxId',
      key: 'payeeTaxId',
      width: 140,
    },
    {
      title: 'ประเภทเงินได้',
      dataIndex: 'incomeType',
      key: 'incomeType',
      width: 100,
      render: (type: string) => {
        
        return type;
      },
    },
    {
      title: 'จำนวนเงิน',
      dataIndex: 'incomeAmount',
      key: 'incomeAmount',
      width: 120,
      align: 'right' as const,
      render: (val: number) => formatCurrency(val),
    },
    {
      title: 'อัตรา',
      dataIndex: 'taxRate',
      key: 'taxRate',
      width: 70,
      align: 'center' as const,
      render: (val: number) => `${val}%`,
    },
    {
      title: 'ภาษีหัก',
      dataIndex: 'taxAmount',
      key: 'taxAmount',
      width: 110,
      align: 'right' as const,
      render: (val: number) => <Text strong style={{ color: '#cf1322' }}>{formatCurrency(val)}</Text>,
    },
    {
      title: 'สถานะ',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (status: string) => {
        const config = STATUS_CONFIG[status];
        return <Tag color={config?.color}>{config?.label}</Tag>;
      },
    },
    {
      title: 'จัดการ',
      key: 'action',
      width: 130,
      render: (_: unknown, record: WithholdingTax) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} onClick={() => handleView(record)} />
          <Button type="text" icon={<PrinterOutlined />} onClick={() => handlePrint(record)} />
          {record.status === 'DRAFT' && (
            <>
              <Popconfirm title="ต้องการออกหนังสือรับรองนี้?" onConfirm={() => handleIssue(record.id)}>
                <Button type="text" icon={<FileDoneOutlined />} style={{ color: 'green' }} />
              </Popconfirm>
              <Popconfirm title="ต้องการลบรายการนี้?" onConfirm={() => handleDelete(record.id)}>
                <Button type="text" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Space>
            <AuditOutlined style={{ fontSize: 24 }} />
            <Title level={4} style={{ margin: 0 }}>หนังสือรับรองหัก ณ ที่จ่าย</Title>
          </Space>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenModal}>
            สร้างหนังสือรับรอง
          </Button>
        </Col>
      </Row>

      {/* Summary Stats */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="ภาษีหัก ณ ที่จ่ายรวม"
              value={totalTaxAmount}
              precision={2}
              prefix="฿"
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="ภ.ง.ด.3 (บุคคลธรรมดา)"
              value={pnd3Total}
              precision={2}
              prefix="฿"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="ภ.ง.ด.53 (นิติบุคคล)"
              value={pnd53Total}
              precision={2}
              prefix="฿"
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
          <Col span={6}>
            <Select
              placeholder="ประเภทแบบ"
              value={filters.formType || undefined}
              onChange={(value) => setFilters({ ...filters, formType: value || '' })}
              style={{ width: '100%' }}
              allowClear
            >
              {FORM_TYPES.map(f => (
                <Option key={f.value} value={f.value}>{f.label}</Option>
              ))}
            </Select>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={certificates}
          rowKey="id"
          loading={loading}
          size="small"
          scroll={{ x: 1300 }}
        />
      </Card>

      {/* Create Modal */}
      <Modal
        title="สร้างหนังสือรับรองหัก ณ ที่จ่าย"
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={900}
        okText="บันทึก"
        cancelText="ยกเลิก"
      >
        <Form form={form} layout="vertical">
          <Divider orientation="left">ข้อมูลเอกสาร</Divider>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="docDate" label="วันที่ออกหนังสือ" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="paymentDate" label="วันที่จ่ายเงิน" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="formType" label="ประเภทแบบ" rules={[{ required: true }]}>
                <Select>
                  {FORM_TYPES.map(f => (
                    <Option key={f.value} value={f.value}>{f.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">ผู้ถูกหักภาษี (ผู้รับเงิน)</Divider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="payeeId" label="เลือกผู้จำหน่าย" rules={[{ required: true }]}>
                <Select 
                  showSearch 
                  optionFilterProp="children" 
                  placeholder="เลือกผู้จำหน่าย"
                  onChange={handlePayeeChange}
                >
                  {suppliers.map(s => (
                    <Option key={s.id} value={s.id}>{s.code} - {s.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="payeeTaxId" label="เลขประจำตัวผู้เสียภาษี" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="payeeName" label="ชื่อ" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="payeeAddress" label="ที่อยู่" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">รายละเอียดการจ่ายเงิน</Divider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="incomeType" label="ประเภทเงินได้" rules={[{ required: true }]}>
                <Select>
                  {INCOME_TYPES.map(i => (
                    <Option key={i.value} value={i.value}>{i.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="incomeDescription" label="รายละเอียด">
                <Input placeholder="เช่น ค่าบริการ, ค่าเช่า" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="incomeAmount" label="จำนวนเงินที่จ่าย" rules={[{ required: true }]}>
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  onChange={handleIncomeChange}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="taxRate" label="อัตราภาษี (%)" rules={[{ required: true }]}>
                <Select onChange={handleIncomeChange}>
                  {TAX_RATES.map(r => (
                    <Option key={r.value} value={r.value}>{r.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="taxAmount" label="ภาษีที่หัก">
                <InputNumber
                  style={{ width: '100%' }}
                  disabled
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="paymentType" label="วิธีการจ่าย" rules={[{ required: true }]}>
                <Select>
                  <Option value="CASH">เงินสด</Option>
                  <Option value="CHEQUE">เช็ค</Option>
                  <Option value="TRANSFER">โอนเงิน</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* View Modal */}
      <Modal
        title={`หนังสือรับรองหัก ณ ที่จ่าย - ${selectedCert?.docNo}`}
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
        width={800}
      >
        {selectedCert && (
          <div style={{ padding: 16 }}>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <Card size="small" title="ผู้หักภาษี (ผู้จ่ายเงิน)">
                  <p><strong>ชื่อ:</strong> {selectedCert.payerName}</p>
                  <p><strong>เลขผู้เสียภาษี:</strong> {selectedCert.payerTaxId}</p>
                  <p><strong>ที่อยู่:</strong> {selectedCert.payerAddress}</p>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" title="ผู้ถูกหักภาษี (ผู้รับเงิน)">
                  <p><strong>ชื่อ:</strong> {selectedCert.payeeName}</p>
                  <p><strong>เลขผู้เสียภาษี:</strong> {selectedCert.payeeTaxId}</p>
                  <p><strong>ที่อยู่:</strong> {selectedCert.payeeAddress}</p>
                </Card>
              </Col>
            </Row>
            <Card size="small" title="รายละเอียดการหักภาษี">
              <Row gutter={16}>
                <Col span={8}>
                  <Text type="secondary">ประเภทแบบ</Text>
                  <div><Tag color="blue">{selectedCert.formType}</Tag></div>
                </Col>
                <Col span={8}>
                  <Text type="secondary">วันที่จ่ายเงิน</Text>
                  <div>{dayjs(selectedCert.paymentDate).format('DD/MM/YYYY')}</div>
                </Col>
                <Col span={8}>
                  <Text type="secondary">ประเภทเงินได้</Text>
                  <div>{selectedCert.incomeType}</div>
                </Col>
              </Row>
              <Divider />
              <Row gutter={16}>
                <Col span={8}>
                  <Text type="secondary">จำนวนเงินที่จ่าย</Text>
                  <div style={{ fontSize: 18 }}>{formatCurrency(selectedCert.incomeAmount)}</div>
                </Col>
                <Col span={8}>
                  <Text type="secondary">อัตราภาษี</Text>
                  <div style={{ fontSize: 18 }}>{selectedCert.taxRate}%</div>
                </Col>
                <Col span={8}>
                  <Text type="secondary">ภาษีที่หักไว้</Text>
                  <div style={{ fontSize: 18, color: '#cf1322', fontWeight: 'bold' }}>
                    {formatCurrency(selectedCert.taxAmount)}
                  </div>
                </Col>
              </Row>
            </Card>
          </div>
        )}
      </Modal>

      {/* Print Modal */}
      <WithholdingTaxPrintPreview
        open={printModalVisible}
        onClose={() => setPrintModalVisible(false)}
        data={selectedCert}
      />
    </div>
  );
};

export default WithholdingTaxPage;
