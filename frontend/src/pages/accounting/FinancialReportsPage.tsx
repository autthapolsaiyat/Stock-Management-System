import React, { useState, useEffect } from 'react';
import {
  Card, Table, Typography, Row, Col, DatePicker, Tabs, Button, Space, Statistic
} from 'antd';
import {
  FileTextOutlined, LineChartOutlined, BankOutlined, PrinterOutlined
} from '@ant-design/icons';
import { financialReportsApi } from '../../services/api';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

interface TrialBalanceRow {
  accountId: number;
  accountCode: string;
  accountName: string;
  accountType: string;
  debit: number;
  credit: number;
  debitBalance: number;
  creditBalance: number;
}

interface ProfitLossData {
  startDate: string;
  endDate: string;
  revenue: { details: any[]; total: number };
  expense: { details: any[]; total: number };
  netProfit: number;
  netProfitPercent: number;
}

interface BalanceSheetData {
  asOfDate: string;
  assets: { details: any[]; total: number };
  liabilities: { details: any[]; total: number };
  equity: { details: any[]; retainedEarnings: number; total: number };
  totalLiabilitiesAndEquity: number;
  isBalanced: boolean;
}

const FinancialReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('trial-balance');
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(dayjs().startOf('year'));
  const [endDate, setEndDate] = useState(dayjs());
  const [asOfDate, setAsOfDate] = useState(dayjs());
  
  const [trialBalance, setTrialBalance] = useState<{ details: TrialBalanceRow[]; totals: any } | null>(null);
  const [profitLoss, setProfitLoss] = useState<ProfitLossData | null>(null);
  const [balanceSheet, setBalanceSheet] = useState<BalanceSheetData | null>(null);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const loadTrialBalance = async () => {
    try {
      setLoading(true);
      const res = await financialReportsApi.getTrialBalance(
        startDate.format('YYYY-MM-DD'),
        endDate.format('YYYY-MM-DD')
      );
      setTrialBalance(res.data);
    } catch (error) {
      console.error('Error loading trial balance:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProfitLoss = async () => {
    try {
      setLoading(true);
      const res = await financialReportsApi.getProfitLoss(
        startDate.format('YYYY-MM-DD'),
        endDate.format('YYYY-MM-DD')
      );
      setProfitLoss(res.data);
    } catch (error) {
      console.error('Error loading P&L:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBalanceSheet = async () => {
    try {
      setLoading(true);
      const res = await financialReportsApi.getBalanceSheet(asOfDate.format('YYYY-MM-DD'));
      setBalanceSheet(res.data);
    } catch (error) {
      console.error('Error loading balance sheet:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'trial-balance') loadTrialBalance();
    else if (activeTab === 'profit-loss') loadProfitLoss();
    else if (activeTab === 'balance-sheet') loadBalanceSheet();
  }, [activeTab]);

  const handleLoadReport = () => {
    if (activeTab === 'trial-balance') loadTrialBalance();
    else if (activeTab === 'profit-loss') loadProfitLoss();
    else if (activeTab === 'balance-sheet') loadBalanceSheet();
  };

  // Trial Balance Tab
  const trialBalanceTab = (
    <Table
      columns={[
        { title: 'รหัสบัญชี', dataIndex: 'accountCode', width: 100 },
        { title: 'ชื่อบัญชี', dataIndex: 'accountName' },
        {
          title: 'เดบิต',
          dataIndex: 'debit',
          align: 'right' as const,
          width: 130,
          render: (val: number) => val > 0 ? formatCurrency(val) : '-',
        },
        {
          title: 'เครดิต',
          dataIndex: 'credit',
          align: 'right' as const,
          width: 130,
          render: (val: number) => val > 0 ? formatCurrency(val) : '-',
        },
        {
          title: 'ยอดเดบิต',
          dataIndex: 'debitBalance',
          align: 'right' as const,
          width: 130,
          render: (val: number) => val > 0 ? formatCurrency(val) : '-',
        },
        {
          title: 'ยอดเครดิต',
          dataIndex: 'creditBalance',
          align: 'right' as const,
          width: 130,
          render: (val: number) => val > 0 ? formatCurrency(val) : '-',
        },
      ]}
      dataSource={trialBalance?.details || []}
      rowKey="accountId"
      loading={loading}
      pagination={false}
      size="small"
      summary={() => trialBalance?.totals ? (
        <Table.Summary.Row style={{ background: '#e6f7ff' }}>
          <Table.Summary.Cell index={0} colSpan={2}>
            <Text strong>รวม</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={1} align="right">-</Table.Summary.Cell>
          <Table.Summary.Cell index={2} align="right">-</Table.Summary.Cell>
          <Table.Summary.Cell index={3} align="right">
            <Text strong>{formatCurrency(trialBalance.totals.totalDebit)}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={4} align="right">
            <Text strong>{formatCurrency(trialBalance.totals.totalCredit)}</Text>
          </Table.Summary.Cell>
        </Table.Summary.Row>
      ) : null}
    />
  );

  // Profit & Loss Tab
  const profitLossTab = profitLoss && (
    <div>
      <Card title="รายได้" size="small" style={{ marginBottom: 16, background: '#f6ffed' }}>
        <Table
          columns={[
            { title: 'รหัส', dataIndex: 'accountCode', width: 100 },
            { title: 'ชื่อบัญชี', dataIndex: 'accountName' },
            {
              title: 'จำนวนเงิน',
              dataIndex: 'balance',
              align: 'right' as const,
              width: 150,
              render: (val: number) => formatCurrency(val),
            },
          ]}
          dataSource={profitLoss.revenue.details}
          rowKey="accountId"
          pagination={false}
          size="small"
          summary={() => (
            <Table.Summary.Row style={{ background: '#d9f7be' }}>
              <Table.Summary.Cell index={0} colSpan={2}>
                <Text strong>รวมรายได้</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1} align="right">
                <Text strong>{formatCurrency(profitLoss.revenue.total)}</Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
      </Card>

      <Card title="ค่าใช้จ่าย" size="small" style={{ marginBottom: 16, background: '#fff2f0' }}>
        <Table
          columns={[
            { title: 'รหัส', dataIndex: 'accountCode', width: 100 },
            { title: 'ชื่อบัญชี', dataIndex: 'accountName' },
            {
              title: 'จำนวนเงิน',
              dataIndex: 'balance',
              align: 'right' as const,
              width: 150,
              render: (val: number) => formatCurrency(val),
            },
          ]}
          dataSource={profitLoss.expense.details}
          rowKey="accountId"
          pagination={false}
          size="small"
          summary={() => (
            <Table.Summary.Row style={{ background: '#ffccc7' }}>
              <Table.Summary.Cell index={0} colSpan={2}>
                <Text strong>รวมค่าใช้จ่าย</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1} align="right">
                <Text strong>{formatCurrency(profitLoss.expense.total)}</Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
      </Card>

      <Card style={{ background: profitLoss.netProfit >= 0 ? '#f6ffed' : '#fff2f0' }}>
        <Row gutter={16}>
          <Col span={12}>
            <Statistic
              title="กำไร(ขาดทุน)สุทธิ"
              value={profitLoss.netProfit}
              precision={2}
              prefix="฿"
              valueStyle={{ color: profitLoss.netProfit >= 0 ? '#3f8600' : '#cf1322', fontSize: 28 }}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title="อัตรากำไรสุทธิ"
              value={profitLoss.netProfitPercent}
              precision={2}
              suffix="%"
              valueStyle={{ color: profitLoss.netProfit >= 0 ? '#3f8600' : '#cf1322' }}
            />
          </Col>
        </Row>
      </Card>
    </div>
  );

  // Balance Sheet Tab
  const balanceSheetTab = balanceSheet && (
    <Row gutter={24}>
      <Col span={12}>
        <Card title="สินทรัพย์" size="small" style={{ background: '#e6f7ff' }}>
          <Table
            columns={[
              { title: 'รหัส', dataIndex: 'accountCode', width: 80 },
              { title: 'ชื่อบัญชี', dataIndex: 'accountName' },
              {
                title: 'จำนวนเงิน',
                dataIndex: 'balance',
                align: 'right' as const,
                width: 130,
                render: (val: number) => formatCurrency(val),
              },
            ]}
            dataSource={balanceSheet.assets.details}
            rowKey="accountId"
            pagination={false}
            size="small"
            summary={() => (
              <Table.Summary.Row style={{ background: '#bae7ff' }}>
                <Table.Summary.Cell index={0} colSpan={2}>
                  <Text strong>รวมสินทรัพย์</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="right">
                  <Text strong style={{ fontSize: 16 }}>{formatCurrency(balanceSheet.assets.total)}</Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )}
          />
        </Card>
      </Col>
      <Col span={12}>
        <Card title="หนี้สิน" size="small" style={{ background: '#fff2f0', marginBottom: 16 }}>
          <Table
            columns={[
              { title: 'รหัส', dataIndex: 'accountCode', width: 80 },
              { title: 'ชื่อบัญชี', dataIndex: 'accountName' },
              {
                title: 'จำนวนเงิน',
                dataIndex: 'balance',
                align: 'right' as const,
                width: 130,
                render: (val: number) => formatCurrency(Math.abs(val)),
              },
            ]}
            dataSource={balanceSheet.liabilities.details}
            rowKey="accountId"
            pagination={false}
            size="small"
            summary={() => (
              <Table.Summary.Row style={{ background: '#ffccc7' }}>
                <Table.Summary.Cell index={0} colSpan={2}>
                  <Text strong>รวมหนี้สิน</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="right">
                  <Text strong>{formatCurrency(balanceSheet.liabilities.total)}</Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )}
          />
        </Card>

        <Card title="ส่วนของผู้ถือหุ้น" size="small" style={{ background: '#f9f0ff' }}>
          <Table
            columns={[
              { title: 'รหัส', dataIndex: 'accountCode', width: 80 },
              { title: 'ชื่อบัญชี', dataIndex: 'accountName' },
              {
                title: 'จำนวนเงิน',
                dataIndex: 'balance',
                align: 'right' as const,
                width: 130,
                render: (val: number) => formatCurrency(Math.abs(val)),
              },
            ]}
            dataSource={[
              ...balanceSheet.equity.details,
              { accountId: 0, accountCode: '', accountName: 'กำไรสะสมปีปัจจุบัน', balance: balanceSheet.equity.retainedEarnings },
            ]}
            rowKey="accountId"
            pagination={false}
            size="small"
            summary={() => (
              <Table.Summary.Row style={{ background: '#efdbff' }}>
                <Table.Summary.Cell index={0} colSpan={2}>
                  <Text strong>รวมส่วนของผู้ถือหุ้น</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="right">
                  <Text strong>{formatCurrency(balanceSheet.equity.total)}</Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )}
          />
        </Card>

        <Card style={{ marginTop: 16, background: balanceSheet.isBalanced ? '#f6ffed' : '#fff2f0' }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Text strong>รวมหนี้สินและส่วนของผู้ถือหุ้น</Text>
            </Col>
            <Col>
              <Text strong style={{ fontSize: 18 }}>
                {formatCurrency(balanceSheet.totalLiabilitiesAndEquity)}
              </Text>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );

  const tabItems = [
    {
      key: 'trial-balance',
      label: (
        <Space>
          <FileTextOutlined />
          งบทดลอง
        </Space>
      ),
      children: trialBalanceTab,
    },
    {
      key: 'profit-loss',
      label: (
        <Space>
          <LineChartOutlined />
          งบกำไรขาดทุน
        </Space>
      ),
      children: profitLossTab,
    },
    {
      key: 'balance-sheet',
      label: (
        <Space>
          <BankOutlined />
          งบดุล
        </Space>
      ),
      children: balanceSheetTab,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4} style={{ margin: 0 }}>รายงานการเงิน</Title>
        </Col>
        <Col>
          <Button icon={<PrinterOutlined />} onClick={() => window.print()}>
            พิมพ์
          </Button>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: 16 }}>
        <Space size="large">
          {activeTab !== 'balance-sheet' ? (
            <>
              <Space>
                <Text>วันที่เริ่มต้น:</Text>
                <DatePicker
                  value={startDate}
                  onChange={(date) => date && setStartDate(date)}
                />
              </Space>
              <Space>
                <Text>วันที่สิ้นสุด:</Text>
                <DatePicker
                  value={endDate}
                  onChange={(date) => date && setEndDate(date)}
                />
              </Space>
            </>
          ) : (
            <Space>
              <Text>ณ วันที่:</Text>
              <DatePicker
                value={asOfDate}
                onChange={(date) => date && setAsOfDate(date)}
              />
            </Space>
          )}
          <Button type="primary" onClick={handleLoadReport}>
            แสดงรายงาน
          </Button>
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

export default FinancialReportsPage;
