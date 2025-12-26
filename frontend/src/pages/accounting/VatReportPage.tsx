import React, { useState, useEffect } from 'react';
import {
  Card, Table, Typography, Row, Col, DatePicker, Tabs, Button, Space, Statistic, Tag, Alert
} from 'antd';
import {
  PrinterOutlined, DownloadOutlined,
  RiseOutlined, FallOutlined, CalculatorOutlined
} from '@ant-design/icons';
import { vatReportApi } from '../../services/api';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

interface VatTransaction {
  id: number;
  docNo: string;
  docDate: string;
  partnerName: string;
  partnerTaxId: string;
  description: string;
  baseAmount: number;
  vatRate: number;
  vatAmount: number;
  totalAmount: number;
  docType: string;
}

interface VatSummary {
  period: string;
  year: number;
  month: number;
  outputVat: number;
  outputVatCount: number;
  inputVat: number;
  inputVatCount: number;
  netVat: number;
  isPayable: boolean;
}

const VatReportPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('output');
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  
  const [outputVat, setOutputVat] = useState<VatTransaction[]>([]);
  const [inputVat, setInputVat] = useState<VatTransaction[]>([]);
  const [summary, setSummary] = useState<VatSummary | null>(null);

  useEffect(() => {
    loadData();
  }, [selectedMonth]);

  const loadData = async () => {
    try {
      setLoading(true);
      const year = selectedMonth.year();
      const month = selectedMonth.month() + 1;
      
      const [outputRes, inputRes, summaryRes] = await Promise.all([
        vatReportApi.getOutputVat(year, month),
        vatReportApi.getInputVat(year, month),
        vatReportApi.getSummary(year, month),
      ]);
      
      setOutputVat(outputRes.data);
      setInputVat(inputRes.data);
      setSummary(summaryRes.data);
    } catch (error) {
      console.error('Error loading VAT report:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('th-TH', { minimumFractionDigits: 2 });
  };

  const outputColumns = [
    {
      title: 'ลำดับ',
      key: 'index',
      width: 60,
      render: (_: unknown, __: unknown, index: number) => index + 1,
    },
    {
      title: 'วันที่',
      dataIndex: 'docDate',
      key: 'docDate',
      width: 100,
      render: (date: string) => dayjs(date).format('DD/MM/YY'),
    },
    {
      title: 'เลขที่ใบกำกับภาษี',
      dataIndex: 'docNo',
      key: 'docNo',
      width: 140,
    },
    {
      title: 'ชื่อผู้ซื้อสินค้า/รับบริการ',
      dataIndex: 'partnerName',
      key: 'partnerName',
    },
    {
      title: 'เลขผู้เสียภาษี',
      dataIndex: 'partnerTaxId',
      key: 'partnerTaxId',
      width: 140,
    },
    {
      title: 'มูลค่าสินค้า/บริการ',
      dataIndex: 'baseAmount',
      key: 'baseAmount',
      width: 130,
      align: 'right' as const,
      render: (val: number) => formatCurrency(val),
    },
    {
      title: 'ภาษีมูลค่าเพิ่ม',
      dataIndex: 'vatAmount',
      key: 'vatAmount',
      width: 120,
      align: 'right' as const,
      render: (val: number) => <Text strong>{formatCurrency(val)}</Text>,
    },
  ];

  const inputColumns = [
    {
      title: 'ลำดับ',
      key: 'index',
      width: 60,
      render: (_: unknown, __: unknown, index: number) => index + 1,
    },
    {
      title: 'วันที่',
      dataIndex: 'docDate',
      key: 'docDate',
      width: 100,
      render: (date: string) => dayjs(date).format('DD/MM/YY'),
    },
    {
      title: 'เลขที่ใบกำกับภาษี',
      dataIndex: 'docNo',
      key: 'docNo',
      width: 140,
    },
    {
      title: 'ชื่อผู้ขายสินค้า/ให้บริการ',
      dataIndex: 'partnerName',
      key: 'partnerName',
    },
    {
      title: 'เลขผู้เสียภาษี',
      dataIndex: 'partnerTaxId',
      key: 'partnerTaxId',
      width: 140,
    },
    {
      title: 'มูลค่าสินค้า/บริการ',
      dataIndex: 'baseAmount',
      key: 'baseAmount',
      width: 130,
      align: 'right' as const,
      render: (val: number) => formatCurrency(val),
    },
    {
      title: 'ภาษีมูลค่าเพิ่ม',
      dataIndex: 'vatAmount',
      key: 'vatAmount',
      width: 120,
      align: 'right' as const,
      render: (val: number) => <Text strong>{formatCurrency(val)}</Text>,
    },
  ];

  const outputVatTotal = outputVat.reduce((sum, v) => sum + v.vatAmount, 0);
  const inputVatTotal = inputVat.reduce((sum, v) => sum + v.vatAmount, 0);

  const outputVatTable = (
    <Table
      columns={outputColumns}
      dataSource={outputVat}
      rowKey="id"
      loading={loading}
      size="small"
      pagination={false}
      summary={() => (
        <Table.Summary.Row style={{ background: '#e6f7ff' }}>
          <Table.Summary.Cell index={0} colSpan={5}>
            <Text strong>รวมภาษีขาย</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={1} align="right">
            <Text strong>{formatCurrency(outputVat.reduce((sum, v) => sum + v.baseAmount, 0))}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={2} align="right">
            <Text strong style={{ color: '#1890ff', fontSize: 16 }}>{formatCurrency(outputVatTotal)}</Text>
          </Table.Summary.Cell>
        </Table.Summary.Row>
      )}
    />
  );

  const inputVatTable = (
    <Table
      columns={inputColumns}
      dataSource={inputVat}
      rowKey="id"
      loading={loading}
      size="small"
      pagination={false}
      summary={() => (
        <Table.Summary.Row style={{ background: '#fff7e6' }}>
          <Table.Summary.Cell index={0} colSpan={5}>
            <Text strong>รวมภาษีซื้อ</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={1} align="right">
            <Text strong>{formatCurrency(inputVat.reduce((sum, v) => sum + v.baseAmount, 0))}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={2} align="right">
            <Text strong style={{ color: '#fa8c16', fontSize: 16 }}>{formatCurrency(inputVatTotal)}</Text>
          </Table.Summary.Cell>
        </Table.Summary.Row>
      )}
    />
  );

  const tabItems = [
    {
      key: 'output',
      label: (
        <Space>
          <RiseOutlined />
          รายงานภาษีขาย ({outputVat.length} รายการ)
        </Space>
      ),
      children: outputVatTable,
    },
    {
      key: 'input',
      label: (
        <Space>
          <FallOutlined />
          รายงานภาษีซื้อ ({inputVat.length} รายการ)
        </Space>
      ),
      children: inputVatTable,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Space>
            <CalculatorOutlined style={{ fontSize: 24 }} />
            <Title level={4} style={{ margin: 0 }}>รายงานภาษีซื้อ-ขาย (ภ.พ.30)</Title>
          </Space>
        </Col>
        <Col>
          <Space>
            <DatePicker
              picker="month"
              value={selectedMonth}
              onChange={(date) => date && setSelectedMonth(date)}
              format="MMMM YYYY"
              style={{ width: 200 }}
            />
            <Button icon={<PrinterOutlined />} onClick={() => window.print()}>
              พิมพ์
            </Button>
            <Button icon={<DownloadOutlined />}>
              ส่งออก Excel
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Summary Cards */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="ภาษีขาย"
              value={summary?.outputVat || 0}
              precision={2}
              prefix="฿"
              valueStyle={{ color: '#1890ff' }}
              suffix={<Text type="secondary" style={{ fontSize: 12 }}>({summary?.outputVatCount || 0} รายการ)</Text>}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="ภาษีซื้อ"
              value={summary?.inputVat || 0}
              precision={2}
              prefix="฿"
              valueStyle={{ color: '#fa8c16' }}
              suffix={<Text type="secondary" style={{ fontSize: 12 }}>({summary?.inputVatCount || 0} รายการ)</Text>}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="ภาษีสุทธิ"
              value={Math.abs(summary?.netVat || 0)}
              precision={2}
              prefix="฿"
              valueStyle={{ color: summary?.isPayable ? '#cf1322' : '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ background: summary?.isPayable ? '#fff2f0' : '#f6ffed' }}>
            <div style={{ textAlign: 'center' }}>
              <Text type="secondary">สถานะ</Text>
              <div style={{ marginTop: 8 }}>
                {summary?.isPayable ? (
                  <Tag color="error" style={{ fontSize: 16, padding: '4px 16px' }}>
                    ต้องชำระภาษี
                  </Tag>
                ) : (
                  <Tag color="success" style={{ fontSize: 16, padding: '4px 16px' }}>
                    ขอคืนภาษี
                  </Tag>
                )}
              </div>
              <div style={{ marginTop: 8, fontSize: 18, fontWeight: 'bold' }}>
                {formatCurrency(Math.abs(summary?.netVat || 0))} บาท
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* VAT Calculation Info */}
      <Alert
        message="การคำนวณภาษี ภ.พ.30"
        description={
          <Row gutter={16}>
            <Col span={8}>
              <Text>ภาษีขาย: {formatCurrency(summary?.outputVat || 0)} บาท</Text>
            </Col>
            <Col span={8}>
              <Text>หัก ภาษีซื้อ: {formatCurrency(summary?.inputVat || 0)} บาท</Text>
            </Col>
            <Col span={8}>
              <Text strong>
                {summary?.isPayable ? 'ภาษีที่ต้องชำระ' : 'ภาษีที่ขอคืน'}: {formatCurrency(Math.abs(summary?.netVat || 0))} บาท
              </Text>
            </Col>
          </Row>
        }
        type={summary?.isPayable ? 'warning' : 'success'}
        showIcon
        style={{ marginBottom: 16 }}
      />

      {/* Data Tables */}
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
        />
      </Card>

      {/* Filing Info */}
      <Card style={{ marginTop: 16 }}>
        <Title level={5}>ข้อมูลการยื่นแบบ ภ.พ.30</Title>
        <Row gutter={16}>
          <Col span={8}>
            <Text type="secondary">เดือนภาษี</Text>
            <div><Text strong>{selectedMonth.format('MMMM')} พ.ศ. {selectedMonth.year() + 543}</Text></div>
          </Col>
          <Col span={8}>
            <Text type="secondary">กำหนดยื่นแบบ</Text>
            <div>
              <Text strong>
                ภายในวันที่ 15 {selectedMonth.add(1, 'month').format('MMMM')} {selectedMonth.add(1, 'month').year() + 543}
              </Text>
            </div>
          </Col>
          <Col span={8}>
            <Text type="secondary">ยื่นทาง</Text>
            <div>
              <a href="https://rdserver.rd.go.th" target="_blank" rel="noopener noreferrer">
                www.rd.go.th (e-Filing)
              </a>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default VatReportPage;
