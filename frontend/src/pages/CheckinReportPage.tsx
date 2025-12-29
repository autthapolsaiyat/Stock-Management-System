import React, { useState, useEffect } from 'react';
import { Card, Table, Row, Col, Typography, Statistic, DatePicker, Button, Space, Input, message } from 'antd';
import { 
  FileTextOutlined, DownloadOutlined, SearchOutlined,
  TeamOutlined, ClockCircleOutlined, CalendarOutlined
} from '@ant-design/icons';
import { checkinApi } from '../services/api';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';

const { Title, Text } = Typography;

interface ReportRow {
  index: number;
  userId: number;
  fullName: string;
  nickname: string;
  lateHours: number;
  earlyLeaveCount: number;
  earlyLeaveHours: number;
  workDays: number;
  otHours: number;
  vacation: number;
  personal: number;
  sick: number;
  maternity: number;
  ordination: number;
  sickHalf: number;
  personalHalf: number;
  totalLeaveDays: number;
}

interface ReportTotals {
  totalEmployees: number;
  totalLateHours: number;
  totalEarlyLeave: number;
  totalVacation: number;
  totalPersonal: number;
  totalSick: number;
  totalMaternity: number;
  totalOrdination: number;
  totalSickHalf: number;
  totalPersonalHalf: number;
  totalLeaveDays: number;
  totalWorkDays: number;
  totalOtHours: number;
}

const CheckinReportPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [searchText, setSearchText] = useState('');
  const [report, setReport] = useState<ReportRow[]>([]);
  const [totals, setTotals] = useState<ReportTotals | null>(null);

  useEffect(() => {
    loadReport();
  }, [selectedMonth]);

  const loadReport = async () => {
    setLoading(true);
    try {
      const res = await checkinApi.getMonthlyReport(
        selectedMonth.year(),
        selectedMonth.month() + 1
      );
      setReport(res.data.report);
      setTotals(res.data.totals);
    } catch (error) {
      console.error('Load report error:', error);
      message.error('ไม่สามารถโหลดรายงานได้');
    } finally {
      setLoading(false);
    }
  };

  const filteredReport = report.filter(row => 
    row.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
    row.nickname?.toLowerCase().includes(searchText.toLowerCase())
  );

  const exportToExcel = () => {
    const exportData = filteredReport.map((row, idx) => ({
      'ลำดับ': idx + 1,
      'ชื่อ-นามสกุล': row.fullName,
      'ชื่อเล่น': row.nickname,
      'ขาด (ชม.)': row.lateHours,
      'ออกก่อน (ครั้ง)': row.earlyLeaveCount,
      'พักร้อน': row.vacation,
      'กิจส่วนตัว': row.personal,
      'ป่วย': row.sick,
      'คลอด': row.maternity,
      'อุปสมบท': row.ordination,
      'ป่วยครึ่งวัน': row.sickHalf,
      'กิจครึ่งวัน': row.personalHalf,
      'รวมวันลา': row.totalLeaveDays,
      'มาทำงาน (วัน)': row.workDays,
      'OT (ชม.)': row.otHours,
    }));

    // Add totals row
    if (totals) {
      exportData.push({
        'ลำดับ': 'รวม' as any,
        'ชื่อ-นามสกุล': '',
        'ชื่อเล่น': '',
        'ขาด (ชม.)': totals.totalLateHours,
        'ออกก่อน (ครั้ง)': totals.totalEarlyLeave,
        'พักร้อน': totals.totalVacation,
        'กิจส่วนตัว': totals.totalPersonal,
        'ป่วย': totals.totalSick,
        'คลอด': totals.totalMaternity,
        'อุปสมบท': totals.totalOrdination,
        'ป่วยครึ่งวัน': totals.totalSickHalf,
        'กิจครึ่งวัน': totals.totalPersonalHalf,
        'รวมวันลา': totals.totalLeaveDays,
        'มาทำงาน (วัน)': totals.totalWorkDays,
        'OT (ชม.)': totals.totalOtHours,
      });
    }

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'รายงาน');
    
    const fileName = `รายงานขาดลามาสาย_${selectedMonth.format('YYYY-MM')}.xlsx`;
    XLSX.writeFile(wb, fileName);
    message.success('ส่งออก Excel สำเร็จ');
  };

  const columns = [
    {
      title: 'ลำดับ',
      dataIndex: 'index',
      width: 60,
      fixed: 'left' as const,
    },
    {
      title: 'ชื่อ-นามสกุล',
      dataIndex: 'fullName',
      width: 180,
      fixed: 'left' as const,
    },
    {
      title: 'ชื่อเล่น',
      dataIndex: 'nickname',
      width: 80,
    },
    {
      title: 'ขาด (ชม.)',
      dataIndex: 'lateHours',
      width: 90,
      align: 'center' as const,
      render: (val: number) => val > 0 ? <Text type="danger">{val}</Text> : val,
    },
    {
      title: 'ออกก่อน',
      dataIndex: 'earlyLeaveCount',
      width: 80,
      align: 'center' as const,
      render: (val: number) => val > 0 ? <Text type="warning">{val}</Text> : val,
    },
    {
      title: 'พักร้อน',
      dataIndex: 'vacation',
      width: 70,
      align: 'center' as const,
    },
    {
      title: 'กิจส่วนตัว',
      dataIndex: 'personal',
      width: 85,
      align: 'center' as const,
    },
    {
      title: 'ป่วย',
      dataIndex: 'sick',
      width: 60,
      align: 'center' as const,
    },
    {
      title: 'คลอด',
      dataIndex: 'maternity',
      width: 60,
      align: 'center' as const,
    },
    {
      title: 'อุปสมบท',
      dataIndex: 'ordination',
      width: 75,
      align: 'center' as const,
    },
    {
      title: 'ป่วยครึ่งวัน',
      dataIndex: 'sickHalf',
      width: 90,
      align: 'center' as const,
    },
    {
      title: 'กิจครึ่งวัน',
      dataIndex: 'personalHalf',
      width: 85,
      align: 'center' as const,
    },
    {
      title: 'รวมวันลา',
      dataIndex: 'totalLeaveDays',
      width: 85,
      align: 'center' as const,
      render: (val: number) => <Text strong>{val}</Text>,
    },
    {
      title: 'มาทำงาน',
      dataIndex: 'workDays',
      width: 85,
      align: 'center' as const,
      render: (val: number) => <Text type="success" strong>{val}</Text>,
    },
    {
      title: 'OT (ชม.)',
      dataIndex: 'otHours',
      width: 80,
      align: 'center' as const,
      render: (val: number) => val > 0 ? <Text type="success">{val}</Text> : val,
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ margin: 0 }}>
            <FileTextOutlined /> รายงานการขาด ลา มาสาย
          </Title>
        </Col>
        <Col>
          <Space>
            <DatePicker
              picker="month"
              value={selectedMonth}
              onChange={(date) => date && setSelectedMonth(date)}
              format="MMMM YYYY"
              allowClear={false}
            />
            <Input
              placeholder="ค้นหาชื่อ..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={exportToExcel}
            >
              Export Excel
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Summary Stats */}
      {totals && (
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={4}>
            <Card className="card-holo">
              <Statistic
                title={<><TeamOutlined /> พนักงาน</>}
                value={totals.totalEmployees}
                suffix="คน"
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card className="card-holo">
              <Statistic
                title={<><ClockCircleOutlined /> มาสาย</>}
                value={Math.round(totals.totalLateHours * 10) / 10}
                suffix="ชม."
                valueStyle={{ color: totals.totalLateHours > 0 ? '#ef4444' : undefined }}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card className="card-holo">
              <Statistic
                title={<><CalendarOutlined /> ลารวม</>}
                value={totals.totalLeaveDays}
                suffix="วัน"
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card className="card-holo">
              <Statistic
                title="ออกก่อน"
                value={totals.totalEarlyLeave}
                suffix="ครั้ง"
                valueStyle={{ color: totals.totalEarlyLeave > 0 ? '#f59e0b' : undefined }}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card className="card-holo">
              <Statistic
                title="มาทำงาน"
                value={totals.totalWorkDays}
                suffix="วัน"
                valueStyle={{ color: '#22c55e' }}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card className="card-holo">
              <Statistic
                title="OT รวม"
                value={Math.round(totals.totalOtHours * 10) / 10}
                suffix="ชม."
                valueStyle={{ color: '#3b82f6' }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Report Table */}
      <Card className="card-holo">
        <Table
          columns={columns}
          dataSource={filteredReport}
          rowKey="userId"
          loading={loading}
          scroll={{ x: 1400 }}
          pagination={{ 
            pageSize: 50,
            showSizeChanger: true,
            showTotal: (total) => `ทั้งหมด ${total} คน`
          }}
          summary={() => totals ? (
            <Table.Summary fixed>
              <Table.Summary.Row style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
                <Table.Summary.Cell index={0} colSpan={3}>
                  <Text strong>รวม</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3} align="center">
                  <Text strong type="danger">{Math.round(totals.totalLateHours * 10) / 10}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4} align="center">
                  <Text strong>{totals.totalEarlyLeave}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5} align="center">
                  <Text strong>{totals.totalVacation}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6} align="center">
                  <Text strong>{totals.totalPersonal}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={7} align="center">
                  <Text strong>{totals.totalSick}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={8} align="center">
                  <Text strong>{totals.totalMaternity}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={9} align="center">
                  <Text strong>{totals.totalOrdination}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={10} align="center">
                  <Text strong>{totals.totalSickHalf}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={11} align="center">
                  <Text strong>{totals.totalPersonalHalf}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={12} align="center">
                  <Text strong>{totals.totalLeaveDays}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={13} align="center">
                  <Text strong type="success">{totals.totalWorkDays}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={14} align="center">
                  <Text strong type="success">{Math.round(totals.totalOtHours * 10) / 10}</Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          ) : null}
        />
      </Card>
    </div>
  );
};

export default CheckinReportPage;
