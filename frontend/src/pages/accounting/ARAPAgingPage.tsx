import React, { useState, useEffect } from 'react';
import {
  Card, Table, Typography, Row, Col, DatePicker, Tabs, Statistic, Space
} from 'antd';
import {
  RiseOutlined, FallOutlined, WarningOutlined
} from '@ant-design/icons';
import { arApi, apApi, arApDashboardApi } from '../../services/api';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

interface AgingData {
  asOfDate: string;
  details: AgingDetail[];
  totals: AgingTotals;
}

interface AgingDetail {
  partnerId: number;
  partnerCode: string;
  partnerName: string;
  CURRENT: number;
  '1-30': number;
  '31-60': number;
  '61-90': number;
  '90+': number;
  total: number;
}

interface AgingTotals {
  CURRENT: number;
  '1-30': number;
  '31-60': number;
  '61-90': number;
  '90+': number;
  total: number;
}

interface DashboardSummary {
  ar: { totalOutstanding: number; overdueAmount: number; overdueCount: number };
  ap: { totalOutstanding: number; overdueAmount: number; overdueCount: number };
}

const ARAPAgingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('ar');
  const [loading, setLoading] = useState(true);
  const [asOfDate, setAsOfDate] = useState(dayjs());
  const [arData, setARData] = useState<AgingData | null>(null);
  const [apData, setAPData] = useState<AgingData | null>(null);
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    loadData();
  }, [asOfDate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const dateStr = asOfDate.format('YYYY-MM-DD');
      const [arRes, apRes, dashRes] = await Promise.all([
        arApi.getAging(dateStr),
        apApi.getAging(dateStr),
        arApDashboardApi.getSummary(),
      ]);
      setARData(arRes.data);
      setAPData(apRes.data);
      setDashboard(dashRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const columns = (type: 'AR' | 'AP') => [
    {
      title: 'รหัส',
      dataIndex: 'partnerCode',
      key: 'partnerCode',
      width: 100,
    },
    {
      title: type === 'AR' ? 'ชื่อลูกค้า' : 'ชื่อผู้จำหน่าย',
      dataIndex: 'partnerName',
      key: 'partnerName',
    },
    {
      title: 'ยังไม่ครบกำหนด',
      dataIndex: 'CURRENT',
      key: 'CURRENT',
      align: 'right' as const,
      width: 130,
      render: (val: number) => val > 0 ? formatCurrency(val) : '-',
    },
    {
      title: '1-30 วัน',
      dataIndex: '1-30',
      key: '1-30',
      align: 'right' as const,
      width: 110,
      render: (val: number) => val > 0 ? formatCurrency(val) : '-',
    },
    {
      title: '31-60 วัน',
      dataIndex: '31-60',
      key: '31-60',
      align: 'right' as const,
      width: 110,
      render: (val: number) => val > 0 ? formatCurrency(val) : '-',
    },
    {
      title: '61-90 วัน',
      dataIndex: '61-90',
      key: '61-90',
      align: 'right' as const,
      width: 110,
      render: (val: number) => val > 0 ? formatCurrency(val) : '-',
    },
    {
      title: '90+ วัน',
      dataIndex: '90+',
      key: '90+',
      align: 'right' as const,
      width: 110,
      render: (val: number) => (
        <Text type={val > 0 ? 'danger' : undefined}>
          {val > 0 ? formatCurrency(val) : '-'}
        </Text>
      ),
    },
    {
      title: 'รวม',
      dataIndex: 'total',
      key: 'total',
      align: 'right' as const,
      width: 130,
      render: (val: number) => <Text strong>{formatCurrency(val)}</Text>,
    },
  ];

  const renderSummaryRow = (totals: AgingTotals) => (
    <Table.Summary.Row style={{ background: '#e6f7ff' }}>
      <Table.Summary.Cell index={0} colSpan={2}>
        <Text strong>รวมทั้งหมด</Text>
      </Table.Summary.Cell>
      <Table.Summary.Cell index={1} align="right">
        <Text strong>{formatCurrency(totals.CURRENT)}</Text>
      </Table.Summary.Cell>
      <Table.Summary.Cell index={2} align="right">
        <Text strong>{formatCurrency(totals['1-30'])}</Text>
      </Table.Summary.Cell>
      <Table.Summary.Cell index={3} align="right">
        <Text strong>{formatCurrency(totals['31-60'])}</Text>
      </Table.Summary.Cell>
      <Table.Summary.Cell index={4} align="right">
        <Text strong>{formatCurrency(totals['61-90'])}</Text>
      </Table.Summary.Cell>
      <Table.Summary.Cell index={5} align="right">
        <Text strong type="danger">{formatCurrency(totals['90+'])}</Text>
      </Table.Summary.Cell>
      <Table.Summary.Cell index={6} align="right">
        <Text strong style={{ fontSize: 16 }}>{formatCurrency(totals.total)}</Text>
      </Table.Summary.Cell>
    </Table.Summary.Row>
  );

  const tabItems = [
    {
      key: 'ar',
      label: (
        <Space>
          <RiseOutlined />
          ลูกหนี้ (AR)
        </Space>
      ),
      children: (
        <Table
          columns={columns('AR')}
          dataSource={arData?.details || []}
          rowKey="partnerId"
          loading={loading}
          size="small"
          pagination={false}
          summary={() => arData?.totals ? renderSummaryRow(arData.totals) : null}
          locale={{ emptyText: 'ไม่มียอดค้างชำระ' }}
        />
      ),
    },
    {
      key: 'ap',
      label: (
        <Space>
          <FallOutlined />
          เจ้าหนี้ (AP)
        </Space>
      ),
      children: (
        <Table
          columns={columns('AP')}
          dataSource={apData?.details || []}
          rowKey="partnerId"
          loading={loading}
          size="small"
          pagination={false}
          summary={() => apData?.totals ? renderSummaryRow(apData.totals) : null}
          locale={{ emptyText: 'ไม่มียอดค้างชำระ' }}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={4}>รายงานอายุลูกหนี้/เจ้าหนี้ (AR/AP Aging Report)</Title>

      {/* Dashboard Summary */}
      {dashboard && (
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="ลูกหนี้ค้างชำระ"
                value={dashboard.ar.totalOutstanding}
                precision={2}
                prefix="฿"
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="ลูกหนี้เกินกำหนด"
                value={dashboard.ar.overdueAmount}
                precision={2}
                prefix={<WarningOutlined />}
                suffix={<Text type="secondary" style={{ fontSize: 14 }}> ({dashboard.ar.overdueCount} รายการ)</Text>}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="เจ้าหนี้ค้างชำระ"
                value={dashboard.ap.totalOutstanding}
                precision={2}
                prefix="฿"
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="เจ้าหนี้เกินกำหนด"
                value={dashboard.ap.overdueAmount}
                precision={2}
                prefix={<WarningOutlined />}
                suffix={<Text type="secondary" style={{ fontSize: 14 }}> ({dashboard.ap.overdueCount} รายการ)</Text>}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Filter */}
      <Card style={{ marginBottom: 16 }}>
        <Space>
          <Text>ณ วันที่:</Text>
          <DatePicker
            value={asOfDate}
            onChange={(date) => date && setAsOfDate(date)}
          />
        </Space>
      </Card>

      {/* Tabs */}
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
        />
      </Card>
    </div>
  );
};

export default ARAPAgingPage;
