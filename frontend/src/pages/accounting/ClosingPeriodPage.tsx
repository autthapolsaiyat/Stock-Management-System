import React, { useState, useEffect } from 'react';
import {
  Card, Table, Button, Space, Tag, Modal, Select,
  message, Typography, Row, Col, Statistic, Alert, Steps, Popconfirm, Progress
} from 'antd';
import {
  LockOutlined, UnlockOutlined, CheckCircleOutlined, 
  CloseCircleOutlined, CalendarOutlined, FileProtectOutlined
} from '@ant-design/icons';
import { closingPeriodApi } from '../../services/api';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

interface ClosingPeriod {
  id: number;
  year: number;
  month: number;
  periodName: string;
  startDate: string;
  endDate: string;
  status: string;
  closedAt?: string;
  closedBy?: string;
  journalCount: number;
  totalDebit: number;
  totalCredit: number;
}

interface ClosingCheck {
  name: string;
  passed: boolean;
  message: string;
}

interface ClosingCheckResult {
  canClose: boolean;
  checks: ClosingCheck[];
  warnings: string[];
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  OPEN: { label: 'เปิด', color: 'processing', icon: <UnlockOutlined /> },
  CLOSED: { label: 'ปิดแล้ว', color: 'success', icon: <LockOutlined /> },
  REOPENED: { label: 'เปิดใหม่', color: 'warning', icon: <UnlockOutlined /> },
};

const MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

const ClosingPeriodPage: React.FC = () => {
  const [periods, setPeriods] = useState<ClosingPeriod[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  const [closeModalVisible, setCloseModalVisible] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<ClosingPeriod | null>(null);
  const [checkResult, setCheckResult] = useState<ClosingCheckResult | null>(null);
  const [checking, setChecking] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    loadPeriods();
  }, [selectedYear]);

  const loadPeriods = async () => {
    try {
      setLoading(true);
      const res = await closingPeriodApi.getByYear(selectedYear);
      setPeriods(res.data);
    } catch (error) {
      console.error('Error loading periods:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInitializeYear = async () => {
    try {
      await closingPeriodApi.initializeYear(selectedYear);
      message.success('สร้างงวดบัญชีสำเร็จ');
      loadPeriods();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const handleOpenCloseModal = async (period: ClosingPeriod) => {
    setSelectedPeriod(period);
    setCloseModalVisible(true);
    setCheckResult(null);
    
    setChecking(true);
    try {
      const res = await closingPeriodApi.checkClosing(period.id);
      setCheckResult(res.data);
    } catch (error) {
      message.error('เกิดข้อผิดพลาดในการตรวจสอบ');
    } finally {
      setChecking(false);
    }
  };

  const handleClosePeriod = async () => {
    if (!selectedPeriod) return;
    
    setClosing(true);
    try {
      await closingPeriodApi.close(selectedPeriod.id);
      message.success('ปิดงวดบัญชีสำเร็จ');
      setCloseModalVisible(false);
      loadPeriods();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    } finally {
      setClosing(false);
    }
  };

  const handleReopenPeriod = async (id: number) => {
    const reason = window.prompt('ระบุเหตุผลที่เปิดงวดใหม่:');
    if (!reason) return;
    
    try {
      await closingPeriodApi.reopen(id, reason);
      message.success('เปิดงวดบัญชีใหม่สำเร็จ');
      loadPeriods();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('th-TH', { minimumFractionDigits: 2 });
  };

  const getYearOptions = () => {
    const currentYear = dayjs().year();
    const years = [];
    for (let y = currentYear - 2; y <= currentYear + 1; y++) {
      years.push(y);
    }
    return years;
  };

  const closedCount = periods.filter(p => p.status === 'CLOSED').length;
  const openCount = periods.filter(p => p.status === 'OPEN' || p.status === 'REOPENED').length;

  const columns = [
    {
      title: 'งวด',
      dataIndex: 'periodName',
      key: 'periodName',
      render: (_: unknown, record: ClosingPeriod) => (
        <Space>
          <CalendarOutlined />
          <Text strong>{MONTHS[record.month - 1]} {record.year + 543}</Text>
        </Space>
      ),
    },
    {
      title: 'ช่วงวันที่',
      key: 'dateRange',
      render: (_: unknown, record: ClosingPeriod) => (
        <Text type="secondary">
          {dayjs(record.startDate).format('DD/MM/YY')} - {dayjs(record.endDate).format('DD/MM/YY')}
        </Text>
      ),
    },
    {
      title: 'รายการบันทึก',
      dataIndex: 'journalCount',
      key: 'journalCount',
      align: 'center' as const,
      render: (count: number) => <Tag>{count} รายการ</Tag>,
    },
    {
      title: 'ยอดเดบิต',
      dataIndex: 'totalDebit',
      key: 'totalDebit',
      align: 'right' as const,
      render: (val: number) => formatCurrency(val),
    },
    {
      title: 'ยอดเครดิต',
      dataIndex: 'totalCredit',
      key: 'totalCredit',
      align: 'right' as const,
      render: (val: number) => formatCurrency(val),
    },
    {
      title: 'สถานะ',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => {
        const config = STATUS_CONFIG[status];
        return (
          <Tag color={config?.color} icon={config?.icon}>
            {config?.label || status}
          </Tag>
        );
      },
    },
    {
      title: 'จัดการ',
      key: 'action',
      width: 150,
      render: (_: unknown, record: ClosingPeriod) => (
        <Space>
          {(record.status === 'OPEN' || record.status === 'REOPENED') && (
            <Button 
              type="primary" 
              size="small" 
              icon={<LockOutlined />}
              onClick={() => handleOpenCloseModal(record)}
            >
              ปิดงวด
            </Button>
          )}
          {record.status === 'CLOSED' && (
            <Popconfirm
              title="ต้องการเปิดงวดบัญชีนี้ใหม่?"
              description="การเปิดงวดใหม่จะทำให้สามารถบันทึกรายการได้"
              onConfirm={() => handleReopenPeriod(record.id)}
            >
              <Button size="small" icon={<UnlockOutlined />}>
                เปิดใหม่
              </Button>
            </Popconfirm>
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
            <FileProtectOutlined style={{ fontSize: 24 }} />
            <Title level={4} style={{ margin: 0 }}>ปิดงวดบัญชี (Period Closing)</Title>
          </Space>
        </Col>
        <Col>
          <Space>
            <Text>ปีบัญชี:</Text>
            <Select value={selectedYear} onChange={setSelectedYear} style={{ width: 120 }}>
              {getYearOptions().map(y => (
                <Option key={y} value={y}>{y + 543}</Option>
              ))}
            </Select>
            {periods.length === 0 && (
              <Button type="primary" onClick={handleInitializeYear}>
                สร้างงวดบัญชี
              </Button>
            )}
          </Space>
        </Col>
      </Row>

      {/* Summary */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="งวดที่ปิดแล้ว"
              value={closedCount}
              suffix={`/ ${periods.length}`}
              prefix={<LockOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="งวดที่ยังเปิด"
              value={openCount}
              prefix={<UnlockOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Text strong>ความคืบหน้าการปิดงวด</Text>
            <Progress 
              percent={periods.length > 0 ? Math.round((closedCount / periods.length) * 100) : 0} 
              status={closedCount === periods.length ? 'success' : 'active'}
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={periods}
          rowKey="id"
          loading={loading}
          pagination={false}
          size="small"
          locale={{ emptyText: 'ยังไม่มีงวดบัญชี กดปุ่ม "สร้างงวดบัญชี" เพื่อเริ่มต้น' }}
        />
      </Card>

      {/* Close Period Modal */}
      <Modal
        title={`ปิดงวดบัญชี - ${selectedPeriod ? MONTHS[selectedPeriod.month - 1] : ''} ${selectedPeriod ? selectedPeriod.year + 543 : ''}`}
        open={closeModalVisible}
        onCancel={() => setCloseModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setCloseModalVisible(false)}>
            ยกเลิก
          </Button>,
          <Button 
            key="close" 
            type="primary" 
            danger
            icon={<LockOutlined />}
            onClick={handleClosePeriod}
            loading={closing}
            disabled={!checkResult?.canClose}
          >
            ยืนยันปิดงวด
          </Button>,
        ]}
        width={600}
      >
        <Alert
          message="คำเตือน"
          description="หลังจากปิดงวดบัญชีแล้ว จะไม่สามารถบันทึกหรือแก้ไขรายการในงวดนี้ได้"
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <Title level={5}>ผลการตรวจสอบ</Title>
        
        {checking ? (
          <div style={{ textAlign: 'center', padding: 24 }}>กำลังตรวจสอบ...</div>
        ) : checkResult ? (
          <>
            <Steps
              direction="vertical"
              size="small"
              items={checkResult.checks.map(check => ({
                title: check.name,
                description: check.message,
                status: check.passed ? 'finish' : 'error',
                icon: check.passed ? <CheckCircleOutlined /> : <CloseCircleOutlined />,
              }))}
            />

            {checkResult.warnings.length > 0 && (
              <Alert
                type="warning"
                message="ข้อควรระวัง"
                description={
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {checkResult.warnings.map((w, i) => <li key={i}>{w}</li>)}
                  </ul>
                }
                style={{ marginTop: 16 }}
              />
            )}

            {!checkResult.canClose && (
              <Alert
                type="error"
                message="ไม่สามารถปิดงวดได้"
                description="กรุณาแก้ไขปัญหาที่พบก่อนดำเนินการปิดงวด"
                style={{ marginTop: 16 }}
              />
            )}
          </>
        ) : null}
      </Modal>
    </div>
  );
};

export default ClosingPeriodPage;
