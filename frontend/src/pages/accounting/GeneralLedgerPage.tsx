import React, { useState, useEffect } from 'react';
import {
  Card, Table, Typography, Row, Col, DatePicker, Select, Button, Space, Tag
} from 'antd';
import {
  BookOutlined, PrinterOutlined, SearchOutlined, ReloadOutlined
} from '@ant-design/icons';
import { generalLedgerApi, chartOfAccountsApi } from '../../services/api';
import { GeneralLedgerPrintPreview } from '../../components/print';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface Account {
  id: number;
  code: string;
  name: string;
  accountType: string;
  balanceType: string;
}

interface LedgerTransaction {
  id: number;
  date: string;
  docNo: string;
  description: string;
  debitAmount: number;
  creditAmount: number;
  balance: number;
  journalEntryId: number;
}

interface LedgerData {
  account: Account;
  openingBalance: number;
  transactions: LedgerTransaction[];
  closingBalance: number;
  totalDebit: number;
  totalCredit: number;
}

const GeneralLedgerPage: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().startOf('month'),
    dayjs()
  ]);
  const [ledgerData, setLedgerData] = useState<LedgerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [printModalVisible, setPrintModalVisible] = useState(false);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const res = await chartOfAccountsApi.getAll();
      setAccounts(res.data);
    } catch (error) {
      console.error('Error loading accounts:', error);
    }
  };

  const loadLedger = async () => {
    if (!selectedAccountId) return;

    try {
      setLoading(true);
      const res = await generalLedgerApi.getByAccount(
        selectedAccountId,
        dateRange[0].format('YYYY-MM-DD'),
        dateRange[1].format('YYYY-MM-DD')
      );
      setLedgerData(res.data);
    } catch (error) {
      console.error('Error loading ledger:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const columns = [
    {
      title: 'วันที่',
      dataIndex: 'date',
      key: 'date',
      width: 100,
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'เลขที่เอกสาร',
      dataIndex: 'docNo',
      key: 'docNo',
      width: 130,
    },
    {
      title: 'รายละเอียด',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'เดบิต',
      dataIndex: 'debitAmount',
      key: 'debitAmount',
      width: 120,
      align: 'right' as const,
      render: (val: number) => val > 0 ? formatCurrency(val) : '-',
    },
    {
      title: 'เครดิต',
      dataIndex: 'creditAmount',
      key: 'creditAmount',
      width: 120,
      align: 'right' as const,
      render: (val: number) => val > 0 ? formatCurrency(val) : '-',
    },
    {
      title: 'ยอดคงเหลือ',
      dataIndex: 'balance',
      key: 'balance',
      width: 130,
      align: 'right' as const,
      render: (val: number) => (
        <Text strong style={{ color: val >= 0 ? '#3f8600' : '#cf1322' }}>
          {formatCurrency(Math.abs(val))} {val < 0 ? 'Cr' : 'Dr'}
        </Text>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Space>
            <BookOutlined style={{ fontSize: 24 }} />
            <Title level={4} style={{ margin: 0 }}>บัญชีแยกประเภท (General Ledger)</Title>
          </Space>
        </Col>
        <Col>
          <Button 
            icon={<PrinterOutlined />} 
            onClick={() => setPrintModalVisible(true)}
            disabled={!ledgerData}
          >
            พิมพ์
          </Button>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col span={8}>
            <Text strong>บัญชี:</Text>
            <Select
              style={{ width: '100%', marginTop: 4 }}
              placeholder="เลือกบัญชี"
              showSearch
              optionFilterProp="children"
              value={selectedAccountId}
              onChange={setSelectedAccountId}
            >
              {accounts.map(a => (
                <Option key={a.id} value={a.id}>
                  {a.code} - {a.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={8}>
            <Text strong>ช่วงวันที่:</Text>
            <RangePicker
              style={{ width: '100%', marginTop: 4 }}
              value={dateRange}
              onChange={(dates) => dates && setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
            />
          </Col>
          <Col span={8}>
            <div style={{ marginTop: 22 }}>
              <Space>
                <Button 
                  type="primary" 
                  icon={<SearchOutlined />} 
                  onClick={loadLedger}
                  disabled={!selectedAccountId}
                >
                  ค้นหา
                </Button>
                <Button icon={<ReloadOutlined />} onClick={() => {
                  setSelectedAccountId(null);
                  setLedgerData(null);
                }}>
                  ล้าง
                </Button>
              </Space>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Account Info */}
      {ledgerData && (
        <Card style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={6}>
              <Text type="secondary">รหัสบัญชี</Text>
              <div><Text strong>{ledgerData.account.code}</Text></div>
            </Col>
            <Col span={6}>
              <Text type="secondary">ชื่อบัญชี</Text>
              <div><Text strong>{ledgerData.account.name}</Text></div>
            </Col>
            <Col span={6}>
              <Text type="secondary">ประเภท</Text>
              <div>
                <Tag color={
                  ledgerData.account.accountType === 'ASSET' ? 'green' :
                  ledgerData.account.accountType === 'LIABILITY' ? 'red' :
                  ledgerData.account.accountType === 'EQUITY' ? 'purple' :
                  ledgerData.account.accountType === 'REVENUE' ? 'blue' : 'orange'
                }>
                  {ledgerData.account.accountType}
                </Tag>
              </div>
            </Col>
            <Col span={6}>
              <Text type="secondary">ยอดยกมา</Text>
              <div>
                <Text strong style={{ color: ledgerData.openingBalance >= 0 ? '#3f8600' : '#cf1322' }}>
                  {formatCurrency(Math.abs(ledgerData.openingBalance))} {ledgerData.openingBalance < 0 ? 'Cr' : 'Dr'}
                </Text>
              </div>
            </Col>
          </Row>
        </Card>
      )}

      {/* Ledger Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={ledgerData?.transactions || []}
          rowKey="id"
          loading={loading}
          pagination={false}
          size="small"
          locale={{ emptyText: 'เลือกบัญชีและกดค้นหาเพื่อดูข้อมูล' }}
          summary={() => ledgerData ? (
            <>
              <Table.Summary.Row style={{ background: '#fafafa' }}>
                <Table.Summary.Cell index={0} colSpan={3}>
                  <Text strong>รวมเคลื่อนไหว</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="right">
                  <Text strong>{formatCurrency(ledgerData.totalDebit)}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} align="right">
                  <Text strong>{formatCurrency(ledgerData.totalCredit)}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3} />
              </Table.Summary.Row>
              <Table.Summary.Row style={{ background: '#e6f7ff' }}>
                <Table.Summary.Cell index={0} colSpan={5}>
                  <Text strong>ยอดคงเหลือ ณ วันที่ {dayjs(dateRange[1]).format('DD/MM/YYYY')}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="right">
                  <Text strong style={{ fontSize: 16, color: ledgerData.closingBalance >= 0 ? '#3f8600' : '#cf1322' }}>
                    {formatCurrency(Math.abs(ledgerData.closingBalance))} {ledgerData.closingBalance < 0 ? 'Cr' : 'Dr'}
                  </Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          ) : null}
        />
      </Card>

      {/* Print Modal */}
      {ledgerData && (
        <GeneralLedgerPrintPreview
          open={printModalVisible}
          onClose={() => setPrintModalVisible(false)}
          account={ledgerData.account}
          transactions={ledgerData.transactions}
          dateRange={{
            startDate: dateRange[0].format('YYYY-MM-DD'),
            endDate: dateRange[1].format('YYYY-MM-DD'),
          }}
          openingBalance={ledgerData.openingBalance}
        />
      )}
    </div>
  );
};

export default GeneralLedgerPage;
