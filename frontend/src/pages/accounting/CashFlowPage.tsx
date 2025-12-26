import React, { useState, useEffect } from 'react';
import {
  Card, Typography, Row, Col, DatePicker, Button, Space, Statistic, Table, Divider, Tag
} from 'antd';
import {
  DollarOutlined, PrinterOutlined, DownloadOutlined, RiseOutlined, FallOutlined,
  BankOutlined, ShoppingCartOutlined, ToolOutlined
} from '@ant-design/icons';
import { cashFlowApi } from '../../services/api';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

interface CashFlowData {
  period: {
    startDate: string;
    endDate: string;
  };
  operatingActivities: CashFlowSection;
  investingActivities: CashFlowSection;
  financingActivities: CashFlowSection;
  summary: {
    netCashFromOperating: number;
    netCashFromInvesting: number;
    netCashFromFinancing: number;
    netChangeInCash: number;
    beginningCash: number;
    endingCash: number;
  };
}

interface CashFlowSection {
  items: CashFlowItem[];
  total: number;
}

interface CashFlowItem {
  description: string;
  amount: number;
  isSubtotal?: boolean;
}

const CashFlowPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(dayjs().startOf('year'));
  const [endDate, setEndDate] = useState(dayjs());
  const [data, setData] = useState<CashFlowData | null>(null);

  useEffect(() => {
    loadData();
  }, [startDate, endDate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await cashFlowApi.getStatement(
        startDate.format('YYYY-MM-DD'),
        endDate.format('YYYY-MM-DD')
      );
      setData(res.data);
    } catch (error) {
      console.error('Error loading cash flow:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    const formatted = Math.abs(value).toLocaleString('th-TH', { minimumFractionDigits: 2 });
    if (value < 0) return `(${formatted})`;
    return formatted;
  };

  const renderSection = (title: string, icon: React.ReactNode, section: CashFlowSection | undefined, color: string) => {
    if (!section) return null;
    
    return (
      <Card 
        title={
          <Space>
            {icon}
            <span>{title}</span>
          </Space>
        }
        style={{ marginBottom: 16 }}
        size="small"
      >
        <Table
          dataSource={section.items}
          rowKey="description"
          pagination={false}
          size="small"
          showHeader={false}
          columns={[
            {
              dataIndex: 'description',
              key: 'description',
              render: (text: string, record: CashFlowItem) => (
                <Text strong={record.isSubtotal} style={{ paddingLeft: record.isSubtotal ? 0 : 24 }}>
                  {text}
                </Text>
              ),
            },
            {
              dataIndex: 'amount',
              key: 'amount',
              width: 150,
              align: 'right',
              render: (val: number, record: CashFlowItem) => (
                <Text 
                  strong={record.isSubtotal} 
                  style={{ color: val < 0 ? '#cf1322' : undefined }}
                >
                  {formatCurrency(val)}
                </Text>
              ),
            },
          ]}
          summary={() => (
            <Table.Summary.Row style={{ background: '#fafafa' }}>
              <Table.Summary.Cell index={0}>
                <Text strong>รวม{title}</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1} align="right">
                <Text strong style={{ fontSize: 16, color: section.total >= 0 ? color : '#cf1322' }}>
                  {formatCurrency(section.total)}
                </Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
      </Card>
    );
  };

  return (
    <div style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Space>
            <DollarOutlined style={{ fontSize: 24 }} />
            <Title level={4} style={{ margin: 0 }}>งบกระแสเงินสด (Cash Flow Statement)</Title>
          </Space>
        </Col>
        <Col>
          <Space>
            <DatePicker
              value={startDate}
              onChange={(date) => date && setStartDate(date)}
              placeholder="วันที่เริ่มต้น"
            />
            <Text>ถึง</Text>
            <DatePicker
              value={endDate}
              onChange={(date) => date && setEndDate(date)}
              placeholder="วันที่สิ้นสุด"
            />
            <Button icon={<PrinterOutlined />} onClick={() => window.print()}>
              พิมพ์
            </Button>
            <Button icon={<DownloadOutlined />}>
              ส่งออก
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Summary Cards */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title={
                <Space>
                  <ShoppingCartOutlined />
                  <span>กิจกรรมดำเนินงาน</span>
                </Space>
              }
              value={data?.summary.netCashFromOperating || 0}
              precision={2}
              prefix="฿"
              valueStyle={{ 
                color: (data?.summary.netCashFromOperating || 0) >= 0 ? '#3f8600' : '#cf1322' 
              }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={
                <Space>
                  <ToolOutlined />
                  <span>กิจกรรมลงทุน</span>
                </Space>
              }
              value={data?.summary.netCashFromInvesting || 0}
              precision={2}
              prefix="฿"
              valueStyle={{ 
                color: (data?.summary.netCashFromInvesting || 0) >= 0 ? '#3f8600' : '#cf1322' 
              }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={
                <Space>
                  <BankOutlined />
                  <span>กิจกรรมจัดหาเงิน</span>
                </Space>
              }
              value={data?.summary.netCashFromFinancing || 0}
              precision={2}
              prefix="฿"
              valueStyle={{ 
                color: (data?.summary.netCashFromFinancing || 0) >= 0 ? '#3f8600' : '#cf1322' 
              }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ background: (data?.summary.netChangeInCash || 0) >= 0 ? '#f6ffed' : '#fff2f0' }}>
            <Statistic
              title="เงินสดเพิ่ม(ลด)สุทธิ"
              value={data?.summary.netChangeInCash || 0}
              precision={2}
              prefix={
                (data?.summary.netChangeInCash || 0) >= 0 
                  ? <RiseOutlined style={{ color: '#3f8600' }} /> 
                  : <FallOutlined style={{ color: '#cf1322' }} />
              }
              suffix=" บาท"
              valueStyle={{ 
                color: (data?.summary.netChangeInCash || 0) >= 0 ? '#3f8600' : '#cf1322' 
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Cash Flow Sections */}
      {renderSection(
        'กระแสเงินสดจากกิจกรรมดำเนินงาน',
        <ShoppingCartOutlined />,
        data?.operatingActivities,
        '#1890ff'
      )}

      {renderSection(
        'กระแสเงินสดจากกิจกรรมลงทุน',
        <ToolOutlined />,
        data?.investingActivities,
        '#722ed1'
      )}

      {renderSection(
        'กระแสเงินสดจากกิจกรรมจัดหาเงิน',
        <BankOutlined />,
        data?.financingActivities,
        '#fa8c16'
      )}

      {/* Summary */}
      <Card title="สรุปกระแสเงินสด">
        <Table
          dataSource={[
            { key: '1', description: 'กระแสเงินสดสุทธิจากกิจกรรมดำเนินงาน', amount: data?.summary.netCashFromOperating || 0 },
            { key: '2', description: 'กระแสเงินสดสุทธิจากกิจกรรมลงทุน', amount: data?.summary.netCashFromInvesting || 0 },
            { key: '3', description: 'กระแสเงินสดสุทธิจากกิจกรรมจัดหาเงิน', amount: data?.summary.netCashFromFinancing || 0 },
            { key: '4', description: 'เงินสดและรายการเทียบเท่าเงินสดเพิ่มขึ้น(ลดลง)สุทธิ', amount: data?.summary.netChangeInCash || 0, highlight: true },
            { key: '5', description: 'เงินสดและรายการเทียบเท่าเงินสดต้นงวด', amount: data?.summary.beginningCash || 0 },
            { key: '6', description: 'เงินสดและรายการเทียบเท่าเงินสดปลายงวด', amount: data?.summary.endingCash || 0, highlight: true },
          ]}
          pagination={false}
          size="small"
          showHeader={false}
          rowClassName={(record: any) => record.highlight ? 'highlight-row' : ''}
          columns={[
            {
              dataIndex: 'description',
              key: 'description',
              render: (text: string, record: any) => (
                <Text strong={record.highlight}>{text}</Text>
              ),
            },
            {
              dataIndex: 'amount',
              key: 'amount',
              width: 180,
              align: 'right',
              render: (val: number, record: any) => (
                <Text 
                  strong={record.highlight} 
                  style={{ 
                    color: val < 0 ? '#cf1322' : (record.highlight ? '#3f8600' : undefined),
                    fontSize: record.highlight ? 16 : 14
                  }}
                >
                  {formatCurrency(val)}
                </Text>
              ),
            },
          ]}
        />

        <Divider />

        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <BankOutlined style={{ fontSize: 24, color: '#1890ff' }} />
              <div>
                <Text type="secondary">เงินสดต้นงวด</Text>
                <div style={{ fontSize: 20 }}>{formatCurrency(data?.summary.beginningCash || 0)} บาท</div>
              </div>
            </Space>
          </Col>
          <Col>
            <Tag color={(data?.summary.netChangeInCash || 0) >= 0 ? 'success' : 'error'} style={{ fontSize: 16, padding: '8px 16px' }}>
              {(data?.summary.netChangeInCash || 0) >= 0 ? '+' : ''}{formatCurrency(data?.summary.netChangeInCash || 0)}
            </Tag>
          </Col>
          <Col>
            <Space>
              <BankOutlined style={{ fontSize: 24, color: '#52c41a' }} />
              <div>
                <Text type="secondary">เงินสดปลายงวด</Text>
                <div style={{ fontSize: 20, color: '#52c41a', fontWeight: 'bold' }}>
                  {formatCurrency(data?.summary.endingCash || 0)} บาท
                </div>
              </div>
            </Space>
          </Col>
        </Row>
      </Card>

      <style>{`
        .highlight-row {
          background-color: #e6f7ff !important;
        }
      `}</style>
    </div>
  );
};

export default CashFlowPage;
