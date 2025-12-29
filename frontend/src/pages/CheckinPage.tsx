import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Row, Col, Typography, Space, message, Input, Statistic, List, Tag, Spin } from 'antd';
import { 
  LoginOutlined, LogoutOutlined, ClockCircleOutlined, 
  CalendarOutlined, CheckCircleOutlined, WarningOutlined,
  HistoryOutlined, FileTextOutlined, HomeOutlined, SettingOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { checkinApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface CheckinRecord {
  id: number;
  checkinDate: string;
  clockInTime: string;
  clockInStatus: string;
  clockInLateMinutes: number;
  clockInNote: string;
  clockOutTime: string;
  clockOutStatus: string;
  clockOutEarlyMinutes: number;
  clockOutNote: string;
  otHours: number;
}

interface TodayStatus {
  date: string;
  clockInTime: string;
  clockOutTime: string;
  gracePeriod: number;
  record: CheckinRecord | null;
}

interface MonthlySummary {
  workDays: number;
  lateDays: number;
  earlyLeaveDays: number;
  leaveDays: number;
}

const CheckinPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [note, setNote] = useState('');
  const [todayStatus, setTodayStatus] = useState<TodayStatus | null>(null);
  const [history, setHistory] = useState<CheckinRecord[]>([]);
  const [monthlySummary, setMonthlySummary] = useState<MonthlySummary | null>(null);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [statusRes, historyRes, summaryRes] = await Promise.all([
        checkinApi.getTodayStatus(),
        checkinApi.getHistory(5),
        checkinApi.getMonthlySummary(),
      ]);
      setTodayStatus(statusRes.data);
      setHistory(historyRes.data);
      setMonthlySummary(summaryRes.data);
    } catch (error) {
      console.error('Load data error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Get GPS location
  const getLocation = (): Promise<{ latitude: number; longitude: number } | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  };

  const handleClockIn = async () => {
    setCheckingIn(true);
    try {
      const location = await getLocation();
      await checkinApi.clockIn({
        latitude: location?.latitude,
        longitude: location?.longitude,
        note: note || undefined,
      });
      message.success('เช็คอินเข้างานสำเร็จ');
      setNote('');
      loadData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    } finally {
      setCheckingIn(false);
    }
  };

  const handleClockOut = async () => {
    setCheckingOut(true);
    try {
      const location = await getLocation();
      await checkinApi.clockOut({
        latitude: location?.latitude,
        longitude: location?.longitude,
        note: note || undefined,
      });
      message.success('เช็คออกสำเร็จ');
      setNote('');
      loadData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    } finally {
      setCheckingOut(false);
    }
  };

  // Calculate time remaining before late
  const getTimeStatus = () => {
    if (!todayStatus) return null;

    const [hours, minutes] = todayStatus.clockInTime.split(':').map(Number);
    const expectedTime = new Date();
    expectedTime.setHours(hours, minutes + todayStatus.gracePeriod, 0, 0);

    const diff = expectedTime.getTime() - currentTime.getTime();
    const isLate = diff < 0;
    const minutesLeft = Math.floor(Math.abs(diff) / 60000);
    const secondsLeft = Math.floor((Math.abs(diff) % 60000) / 1000);

    return { isLate, minutesLeft, secondsLeft };
  };

  const timeStatus = getTimeStatus();

  const formatTime = (dateStr: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('th-TH', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Spin size="large" />
      </div>
    );
  }

  const record = todayStatus?.record;
  const hasClockIn = !!record?.clockInTime;
  const hasClockOut = !!record?.clockOutTime;

  // Check if user is admin
  const isAdmin = user?.roles?.some((r: string) => 
    ['ADMIN', 'SUPER_ADMIN', 'MANAGER', 'HR'].includes(r)
  );

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      paddingBottom: 24
    }}>
      {/* Header Bar */}
      <div style={{ 
        background: 'rgba(15, 23, 42, 0.95)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <Space>
          <Button 
            type="text" 
            icon={<HomeOutlined />} 
            onClick={() => navigate('/intro')}
            style={{ color: '#fff' }}
          >
            หน้าหลัก
          </Button>
        </Space>
        <Title level={4} style={{ margin: 0, color: '#fff' }}>
          <ClockCircleOutlined /> ระบบเช็คอิน
        </Title>
        <Space>
          {isAdmin && (
            <>
              <Button 
                type="text" 
                icon={<BarChartOutlined />} 
                onClick={() => navigate('/checkin/report')}
                style={{ color: '#fff' }}
              >
                รายงาน
              </Button>
              <Button 
                type="text" 
                icon={<SettingOutlined />} 
                onClick={() => navigate('/checkin/admin')}
                style={{ color: '#fff' }}
              >
                ตั้งค่า
              </Button>
            </>
          )}
        </Space>
      </div>

      <div style={{ padding: '24px', maxWidth: 800, margin: '0 auto' }}>

      {/* Current Time Card */}
      <Card 
        style={{ marginBottom: 24, textAlign: 'center' }}
        className="card-holo"
      >
        <Text type="secondary">
          <CalendarOutlined /> {currentTime.toLocaleDateString('th-TH', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
        <Title level={1} style={{ margin: '16px 0', fontFamily: 'monospace' }}>
          {currentTime.toLocaleTimeString('th-TH')}
        </Title>
        
        {!hasClockIn && timeStatus && (
          <Tag 
            color={timeStatus.isLate ? 'red' : 'green'} 
            style={{ fontSize: 14, padding: '4px 12px' }}
          >
            {timeStatus.isLate 
              ? `⏰ สายแล้ว ${timeStatus.minutesLeft} นาที` 
              : `✅ เหลืออีก ${timeStatus.minutesLeft}:${timeStatus.secondsLeft.toString().padStart(2, '0')} นาที`
            }
          </Tag>
        )}
      </Card>

      {/* Clock In/Out Status */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card 
            style={{ 
              textAlign: 'center',
              background: hasClockIn ? 'rgba(34, 197, 94, 0.1)' : undefined,
              borderColor: hasClockIn ? '#22c55e' : undefined
            }}
          >
            <LoginOutlined style={{ fontSize: 32, color: '#22c55e' }} />
            <Title level={4} style={{ margin: '8px 0 4px' }}>เข้างาน</Title>
            <Text style={{ fontSize: 20, fontWeight: 600 }}>
              {hasClockIn ? formatTime(record.clockInTime) : '-'}
            </Text>
            <br />
            {hasClockIn && (
              <Tag color={record.clockInStatus === 'LATE' ? 'red' : 'green'} style={{ marginTop: 8 }}>
                {record.clockInStatus === 'LATE' 
                  ? `สาย ${record.clockInLateMinutes} นาที` 
                  : 'ปกติ'
                }
              </Tag>
            )}
            {!hasClockIn && <Tag style={{ marginTop: 8 }}>รอเช็คอิน</Tag>}
          </Card>
        </Col>
        <Col span={12}>
          <Card 
            style={{ 
              textAlign: 'center',
              background: hasClockOut ? 'rgba(59, 130, 246, 0.1)' : undefined,
              borderColor: hasClockOut ? '#3b82f6' : undefined
            }}
          >
            <LogoutOutlined style={{ fontSize: 32, color: '#3b82f6' }} />
            <Title level={4} style={{ margin: '8px 0 4px' }}>ออกงาน</Title>
            <Text style={{ fontSize: 20, fontWeight: 600 }}>
              {hasClockOut ? formatTime(record.clockOutTime) : '-'}
            </Text>
            <br />
            {hasClockOut && record.otHours > 0 && (
              <Tag color="blue" style={{ marginTop: 8 }}>
                OT {record.otHours} ชม.
              </Tag>
            )}
            {!hasClockOut && <Tag style={{ marginTop: 8 }}>รอเช็คออก</Tag>}
          </Card>
        </Col>
      </Row>

      {/* Note Input */}
      <Card style={{ marginBottom: 24 }} className="card-holo">
        <Text strong><FileTextOutlined /> หมายเหตุ (ถ้ามี)</Text>
        <TextArea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="เช่น วันนี้มีประชุมที่สยามกับลูกค้า"
          rows={2}
          style={{ marginTop: 8 }}
        />
      </Card>

      {/* Action Buttons */}
      <Space direction="vertical" style={{ width: '100%', marginBottom: 24 }}>
        {!hasClockIn && (
          <Button
            type="primary"
            size="large"
            block
            icon={<LoginOutlined />}
            loading={checkingIn}
            onClick={handleClockIn}
            style={{ height: 56, fontSize: 18, background: '#22c55e', borderColor: '#22c55e' }}
          >
            CHECK-IN เข้างาน
          </Button>
        )}
        
        {hasClockIn && !hasClockOut && (
          <Button
            type="primary"
            size="large"
            block
            icon={<LogoutOutlined />}
            loading={checkingOut}
            onClick={handleClockOut}
            style={{ height: 56, fontSize: 18, background: '#3b82f6', borderColor: '#3b82f6' }}
          >
            CHECK-OUT ออกงาน
          </Button>
        )}

        {hasClockIn && hasClockOut && (
          <div style={{ textAlign: 'center', padding: 16 }}>
            <CheckCircleOutlined style={{ fontSize: 48, color: '#22c55e' }} />
            <Title level={4} style={{ marginTop: 8 }}>เช็คอินวันนี้เสร็จสิ้น</Title>
          </div>
        )}
      </Space>

      {/* Monthly Summary */}
      {monthlySummary && (
        <Card title="📊 สรุปเดือนนี้" style={{ marginBottom: 24 }} className="card-holo">
          <Row gutter={16}>
            <Col span={6}>
              <Statistic 
                title="มาทำงาน" 
                value={monthlySummary.workDays} 
                suffix="วัน"
                valueStyle={{ color: '#22c55e' }}
              />
            </Col>
            <Col span={6}>
              <Statistic 
                title="มาสาย" 
                value={monthlySummary.lateDays} 
                suffix="ครั้ง"
                valueStyle={{ color: monthlySummary.lateDays > 0 ? '#ef4444' : '#22c55e' }}
              />
            </Col>
            <Col span={6}>
              <Statistic 
                title="ลา" 
                value={monthlySummary.leaveDays} 
                suffix="วัน"
                valueStyle={{ color: '#3b82f6' }}
              />
            </Col>
            <Col span={6}>
              <Statistic 
                title="ออกก่อน" 
                value={monthlySummary.earlyLeaveDays} 
                suffix="ครั้ง"
                valueStyle={{ color: monthlySummary.earlyLeaveDays > 0 ? '#f59e0b' : '#22c55e' }}
              />
            </Col>
          </Row>
        </Card>
      )}

      {/* History */}
      <Card 
        title={<><HistoryOutlined /> ประวัติเช็คอินล่าสุด</>} 
        className="card-holo"
      >
        <List
          dataSource={history}
          renderItem={(item) => (
            <List.Item>
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Text>{formatDate(item.checkinDate)}</Text>
                <Space>
                  <Tag color="green">☀️ {formatTime(item.clockInTime)}</Tag>
                  <Tag color="blue">🌙 {item.clockOutTime ? formatTime(item.clockOutTime) : '-'}</Tag>
                  {item.clockInStatus === 'LATE' ? (
                    <Tag color="red"><WarningOutlined /> สาย {item.clockInLateMinutes}น.</Tag>
                  ) : (
                    <Tag color="green"><CheckCircleOutlined /> ปกติ</Tag>
                  )}
                </Space>
              </Space>
            </List.Item>
          )}
          locale={{ emptyText: 'ยังไม่มีประวัติ' }}
        />
      </Card>
      </div>
    </div>
  );
};

export default CheckinPage;
