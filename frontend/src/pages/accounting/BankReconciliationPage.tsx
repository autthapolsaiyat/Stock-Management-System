import React, { useState, useEffect } from 'react';
import {
  Card, Table, Button, Space, Tag, Modal, Form, Input, Select, DatePicker,
  message, Typography, Row, Col, Statistic, Checkbox, Divider
} from 'antd';
import {
  BankOutlined, CheckCircleOutlined, SyncOutlined, 
  FileTextOutlined, SaveOutlined
} from '@ant-design/icons';
import { bankReconciliationApi, bankAccountsApi } from '../../services/api';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

interface BankAccount {
  id: number;
  accountNo: string;
  accountName: string;
  bankName: string;
  currentBalance: number;
}

interface ReconciliationItem {
  id: number;
  date: string;
  docNo: string;
  description: string;
  debitAmount: number;
  creditAmount: number;
  type: 'BOOK' | 'BANK';
  isReconciled: boolean;
  reconciledDate?: string;
}

interface ReconciliationSummary {
  bookBalance: number;
  bankBalance: number;
  unreconciledDeposits: number;
  unreconciledWithdrawals: number;
  adjustedBookBalance: number;
  adjustedBankBalance: number;
  difference: number;
}

const BankReconciliationPage: React.FC = () => {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [selectedBankId, setSelectedBankId] = useState<number | null>(null);
  const [asOfDate, setAsOfDate] = useState(dayjs());
  const [bookItems, setBookItems] = useState<ReconciliationItem[]>([]);
  const [bankItems, setBankItems] = useState<ReconciliationItem[]>([]);
  const [summary, setSummary] = useState<ReconciliationSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedBookIds, setSelectedBookIds] = useState<number[]>([]);
  const [selectedBankIds, setSelectedBankIds] = useState<number[]>([]);
  const [bankStatementBalance, setBankStatementBalance] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadBankAccounts();
  }, []);

  const loadBankAccounts = async () => {
    try {
      const res = await bankAccountsApi.getAll();
      setBankAccounts(res.data);
    } catch (error) {
      console.error('Error loading bank accounts:', error);
    }
  };

  const loadReconciliation = async () => {
    if (!selectedBankId) return;

    try {
      setLoading(true);
      const res = await bankReconciliationApi.getItems(
        selectedBankId,
        asOfDate.format('YYYY-MM-DD')
      );
      setBookItems(res.data.bookItems || []);
      setBankItems(res.data.bankItems || []);
      setSummary(res.data.summary);
      setSelectedBookIds([]);
      setSelectedBankIds([]);
    } catch (error) {
      console.error('Error loading reconciliation:', error);
      message.error('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const handleReconcile = async () => {
    if (selectedBookIds.length === 0 && selectedBankIds.length === 0) {
      message.warning('กรุณาเลือกรายการที่ต้องการกระทบยอด');
      return;
    }

    try {
      await bankReconciliationApi.reconcile({
        bankAccountId: selectedBankId!,
        asOfDate: asOfDate.format('YYYY-MM-DD'),
        bookItemIds: selectedBookIds,
        bankItemIds: selectedBankIds,
      });
      message.success('กระทบยอดสำเร็จ');
      loadReconciliation();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const handleAutoReconcile = async () => {
    if (!selectedBankId) return;

    try {
      const res = await bankReconciliationApi.autoReconcile(
        selectedBankId,
        asOfDate.format('YYYY-MM-DD')
      );
      message.success(`กระทบยอดอัตโนมัติสำเร็จ ${res.data.reconciledCount} รายการ`);
      loadReconciliation();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const bookColumns = [
    {
      title: (
        <Checkbox
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedBookIds(bookItems.filter(i => !i.isReconciled).map(i => i.id));
            } else {
              setSelectedBookIds([]);
            }
          }}
          checked={selectedBookIds.length === bookItems.filter(i => !i.isReconciled).length && selectedBookIds.length > 0}
        />
      ),
      width: 40,
      render: (_: unknown, record: ReconciliationItem) => (
        <Checkbox
          checked={selectedBookIds.includes(record.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedBookIds([...selectedBookIds, record.id]);
            } else {
              setSelectedBookIds(selectedBookIds.filter(id => id !== record.id));
            }
          }}
          disabled={record.isReconciled}
        />
      ),
    },
    {
      title: 'วันที่',
      dataIndex: 'date',
      key: 'date',
      width: 100,
      render: (date: string) => dayjs(date).format('DD/MM/YY'),
    },
    {
      title: 'เลขที่',
      dataIndex: 'docNo',
      key: 'docNo',
      width: 100,
    },
    {
      title: 'รายละเอียด',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'ฝาก',
      dataIndex: 'debitAmount',
      key: 'debitAmount',
      width: 100,
      align: 'right' as const,
      render: (val: number) => val > 0 ? formatCurrency(val) : '-',
    },
    {
      title: 'ถอน',
      dataIndex: 'creditAmount',
      key: 'creditAmount',
      width: 100,
      align: 'right' as const,
      render: (val: number) => val > 0 ? formatCurrency(val) : '-',
    },
    {
      title: 'สถานะ',
      dataIndex: 'isReconciled',
      key: 'isReconciled',
      width: 80,
      render: (isReconciled: boolean) => (
        <Tag color={isReconciled ? 'success' : 'default'}>
          {isReconciled ? '✓' : '-'}
        </Tag>
      ),
    },
  ];

  const selectedBank = bankAccounts.find(b => b.id === selectedBankId);

  return (
    <div style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Space>
            <BankOutlined style={{ fontSize: 24 }} />
            <Title level={4} style={{ margin: 0 }}>กระทบยอดธนาคาร (Bank Reconciliation)</Title>
          </Space>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col span={8}>
            <Text strong>บัญชีธนาคาร:</Text>
            <Select
              style={{ width: '100%', marginTop: 4 }}
              placeholder="เลือกบัญชีธนาคาร"
              value={selectedBankId}
              onChange={setSelectedBankId}
            >
              {bankAccounts.map(b => (
                <Option key={b.id} value={b.id}>
                  {b.bankName} - {b.accountNo} ({b.accountName})
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={6}>
            <Text strong>ณ วันที่:</Text>
            <DatePicker
              style={{ width: '100%', marginTop: 4 }}
              value={asOfDate}
              onChange={(date) => date && setAsOfDate(date)}
            />
          </Col>
          <Col span={10}>
            <div style={{ marginTop: 22 }}>
              <Space>
                <Button 
                  type="primary" 
                  icon={<SyncOutlined />} 
                  onClick={loadReconciliation}
                  disabled={!selectedBankId}
                >
                  โหลดข้อมูล
                </Button>
                <Button 
                  icon={<CheckCircleOutlined />} 
                  onClick={handleAutoReconcile}
                  disabled={!selectedBankId}
                >
                  กระทบยอดอัตโนมัติ
                </Button>
                <Button 
                  icon={<FileTextOutlined />} 
                  onClick={() => setModalVisible(true)}
                  disabled={!selectedBankId}
                >
                  ใส่ยอด Bank Statement
                </Button>
              </Space>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Summary */}
      {summary && (
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="ยอดตามบัญชี (Book)"
                value={summary.bookBalance}
                precision={2}
                prefix="฿"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="ยอดตาม Bank Statement"
                value={bankStatementBalance || summary.bankBalance}
                precision={2}
                prefix="฿"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="รายการค้างกระทบ"
                value={bookItems.filter(i => !i.isReconciled).length}
                suffix="รายการ"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="ผลต่าง"
                value={summary.difference}
                precision={2}
                prefix="฿"
                valueStyle={{ color: Math.abs(summary.difference) < 0.01 ? '#3f8600' : '#cf1322' }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Tables */}
      <Row gutter={16}>
        <Col span={24}>
          <Card 
            title="รายการในบัญชี (Book Entries)"
            extra={
              <Button 
                type="primary" 
                icon={<SaveOutlined />} 
                onClick={handleReconcile}
                disabled={selectedBookIds.length === 0}
              >
                กระทบยอดที่เลือก ({selectedBookIds.length})
              </Button>
            }
          >
            <Table
              columns={bookColumns}
              dataSource={bookItems}
              rowKey="id"
              loading={loading}
              size="small"
              pagination={{ pageSize: 10 }}
              rowClassName={(record) => record.isReconciled ? 'reconciled-row' : ''}
              locale={{ emptyText: 'เลือกบัญชีและกดโหลดข้อมูล' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Reconciliation Summary Card */}
      {summary && (
        <Card style={{ marginTop: 16 }}>
          <Title level={5}>สรุปการกระทบยอด</Title>
          <Row gutter={32}>
            <Col span={12}>
              <table style={{ width: '100%' }}>
                <tbody>
                  <tr>
                    <td>ยอดคงเหลือตามบัญชี</td>
                    <td style={{ textAlign: 'right' }}>{formatCurrency(summary.bookBalance)}</td>
                  </tr>
                  <tr>
                    <td>บวก: เงินฝากระหว่างทาง</td>
                    <td style={{ textAlign: 'right' }}>{formatCurrency(summary.unreconciledDeposits)}</td>
                  </tr>
                  <tr>
                    <td>หัก: เช็คค้างจ่าย</td>
                    <td style={{ textAlign: 'right' }}>({formatCurrency(summary.unreconciledWithdrawals)})</td>
                  </tr>
                  <tr style={{ borderTop: '2px solid #1890ff' }}>
                    <td><Text strong>ยอดปรับปรุงตามบัญชี</Text></td>
                    <td style={{ textAlign: 'right' }}><Text strong>{formatCurrency(summary.adjustedBookBalance)}</Text></td>
                  </tr>
                </tbody>
              </table>
            </Col>
            <Col span={12}>
              <table style={{ width: '100%' }}>
                <tbody>
                  <tr>
                    <td>ยอดคงเหลือตาม Bank Statement</td>
                    <td style={{ textAlign: 'right' }}>{formatCurrency(bankStatementBalance || summary.bankBalance)}</td>
                  </tr>
                  <tr>
                    <td colSpan={2}>&nbsp;</td>
                  </tr>
                  <tr>
                    <td colSpan={2}>&nbsp;</td>
                  </tr>
                  <tr style={{ borderTop: '2px solid #1890ff' }}>
                    <td><Text strong>ยอดปรับปรุงตาม Bank</Text></td>
                    <td style={{ textAlign: 'right' }}><Text strong>{formatCurrency(summary.adjustedBankBalance)}</Text></td>
                  </tr>
                </tbody>
              </table>
            </Col>
          </Row>
          <Divider />
          <Row justify="center">
            <Col>
              {Math.abs(summary.difference) < 0.01 ? (
                <Tag color="success" style={{ fontSize: 16, padding: '8px 16px' }}>
                  <CheckCircleOutlined /> ยอดตรงกัน
                </Tag>
              ) : (
                <Tag color="error" style={{ fontSize: 16, padding: '8px 16px' }}>
                  ผลต่าง: {formatCurrency(summary.difference)} บาท
                </Tag>
              )}
            </Col>
          </Row>
        </Card>
      )}

      {/* Bank Statement Balance Modal */}
      <Modal
        title="ใส่ยอด Bank Statement"
        open={modalVisible}
        onOk={() => {
          setModalVisible(false);
          loadReconciliation();
        }}
        onCancel={() => setModalVisible(false)}
        okText="ตกลง"
        cancelText="ยกเลิก"
      >
        <Form layout="vertical">
          <Form.Item label="ยอดคงเหลือตาม Bank Statement">
            <Input
              type="number"
              value={bankStatementBalance}
              onChange={(e) => setBankStatementBalance(Number(e.target.value))}
              prefix="฿"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form>
      </Modal>

      <style>{`
        .reconciled-row {
          background-color: #f6ffed !important;
        }
      `}</style>
    </div>
  );
};

export default BankReconciliationPage;
