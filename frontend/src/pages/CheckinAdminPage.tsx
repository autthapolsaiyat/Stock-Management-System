import React, { useState, useEffect } from 'react';
import { Card, Form, Input, InputNumber, Switch, Button, Row, Col, Typography, message, Divider, TimePicker, Space, Tabs, DatePicker, Table, Tag, Popconfirm } from 'antd';
import { 
  SettingOutlined, ClockCircleOutlined, BellOutlined, 
  SaveOutlined, SendOutlined, MessageOutlined, HomeOutlined,
  ArrowLeftOutlined, DeleteOutlined, TeamOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { checkinApi } from '../services/api';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

interface CheckinRecord {
  id: number;
  userId: number;
  userName: string;
  nickname: string;
  clockInTime: string;
  clockOutTime: string;
  clockInStatus: string;
  clockInLateMinutes: number;
  clockOutStatus: string;
  clockOutEarlyMinutes: number;
  otHours: number;
}

interface LeaveRecord {
  id: number;
  userId: number;
  userName: string;
  nickname: string;
  leaveType: string;
  leaveDuration: string;
  leaveDays: number;
  reason: string;
}

const CheckinAdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [sendingSummary, setSendingSummary] = useState(false);

  // Manage records state
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [checkinRecords, setCheckinRecords] = useState<CheckinRecord[]>([]);
  const [leaveRecords, setLeaveRecords] = useState<LeaveRecord[]>([]);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await checkinApi.getSettings();
      const data = res.data;
      form.setFieldsValue({
        ...data,
        clockInTime: dayjs(data.clockInTime, 'HH:mm'),
        clockOutTime: dayjs(data.clockOutTime, 'HH:mm'),
        dailySummaryTime: dayjs(data.dailySummaryTime, 'HH:mm'),
      });
    } catch (error) {
      console.error('Load settings error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (values: any) => {
    setSaving(true);
    try {
      await checkinApi.updateSettings({
        clockInTime: values.clockInTime?.format('HH:mm'),
        clockOutTime: values.clockOutTime?.format('HH:mm'),
        gracePeriodMinutes: values.gracePeriodMinutes,
        lineNotifyToken: values.lineNotifyToken,
        notifyOnCheckin: values.notifyOnCheckin,
        notifyOnCheckout: values.notifyOnCheckout,
        notifyOnLate: values.notifyOnLate,
        notifyDailySummary: values.notifyDailySummary,
        dailySummaryTime: values.dailySummaryTime?.format('HH:mm'),
      });
      message.success('บันทึกตั้งค่าสำเร็จ');
    } catch (error) {
      message.error('ไม่สามารถบันทึกตั้งค่าได้');
    } finally {
      setSaving(false);
    }
  };

  const handleTestLine = async () => {
    setTesting(true);
    try {
      await checkinApi.testLineNotify();
      message.success('ส่งข้อความทดสอบสำเร็จ');
    } catch (error) {
      message.error('ไม่สามารถส่งข้อความได้ กรุณาตรวจสอบ Token');
    } finally {
      setTesting(false);
    }
  };

  const handleSendDailySummary = async () => {
    setSendingSummary(true);
    try {
      await checkinApi.sendDailySummary();
      message.success('ส่งสรุปประจำวันสำเร็จ');
    } catch (error) {
      message.error('ไม่สามารถส่งสรุปได้');
    } finally {
      setSendingSummary(false);
    }
  };

  // Load records by date
  const loadRecordsByDate = async (date: dayjs.Dayjs) => {
    setLoadingRecords(true);
    try {
      const res = await checkinApi.getRecordsByDate(date.format('YYYY-MM-DD'));
      setCheckinRecords(res.data.checkinRecords || []);
      setLeaveRecords(res.data.leaveRecords || []);
    } catch (error) {
      console.error('Load records error:', error);
      setCheckinRecords([]);
      setLeaveRecords([]);
    } finally {
      setLoadingRecords(false);
    }
  };

  const handleDeleteCheckin = async (id: number) => {
    try {
      await checkinApi.deleteCheckinRecord(id);
      message.success('ลบรายการเช็คอินสำเร็จ');
      loadRecordsByDate(selectedDate);
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const handleDeleteLeave = async (id: number) => {
    try {
      await checkinApi.deleteLeaveRecordAdmin(id);
      message.success('ลบรายการลาสำเร็จ');
      loadRecordsByDate(selectedDate);
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const formatTime = (time: string) => {
    if (!time) return '-';
    return dayjs(time).format('HH:mm');
  };

  const leaveTypeLabels: Record<string, string> = {
    VACATION: '🏖️ พักร้อน',
    PERSONAL: '👤 กิจส่วนตัว',
    SICK: '🏥 ป่วย',
    MATERNITY: '👶 คลอด',
    ORDINATION: '🙏 อุปสมบท',
  };

  const checkinColumns = [
    { title: 'ชื่อ', dataIndex: 'userName', key: 'userName', 
      render: (text: string, record: CheckinRecord) => (
        <span>{text} {record.nickname && `(${record.nickname})`}</span>
      )
    },
    { title: 'เข้างาน', dataIndex: 'clockInTime', key: 'clockInTime',
      render: (time: string) => <Tag color="green">{formatTime(time)}</Tag>
    },
    { title: 'ออกงาน', dataIndex: 'clockOutTime', key: 'clockOutTime',
      render: (time: string) => time ? <Tag color="blue">{formatTime(time)}</Tag> : '-'
    },
    { title: 'สถานะ', key: 'status',
      render: (_: any, record: CheckinRecord) => (
        record.clockInStatus === 'LATE' 
          ? <Tag color="red">สาย {record.clockInLateMinutes} นาที</Tag>
          : <Tag color="green">ปกติ</Tag>
      )
    },
    { title: 'OT', dataIndex: 'otHours', key: 'otHours',
      render: (hours: number) => hours > 0 ? <Tag color="purple">{hours} ชม.</Tag> : '-'
    },
    { title: 'จัดการ', key: 'action',
      render: (_: any, record: CheckinRecord) => (
        <Popconfirm
          title="ยืนยันการลบ?"
          description="ต้องการลบรายการเช็คอินนี้หรือไม่?"
          onConfirm={() => handleDeleteCheckin(record.id)}
          okText="ลบ"
          cancelText="ยกเลิก"
        >
          <Button type="text" danger icon={<DeleteOutlined />} size="small">
            ลบ
          </Button>
        </Popconfirm>
      )
    },
  ];

  const leaveColumns = [
    { title: 'ชื่อ', dataIndex: 'userName', key: 'userName',
      render: (text: string, record: LeaveRecord) => (
        <span>{text} {record.nickname && `(${record.nickname})`}</span>
      )
    },
    { title: 'ประเภท', dataIndex: 'leaveType', key: 'leaveType',
      render: (type: string) => leaveTypeLabels[type] || type
    },
    { title: 'ระยะเวลา', dataIndex: 'leaveDuration', key: 'leaveDuration',
      render: (duration: string) => {
        if (duration === 'HALF_AM') return <Tag>ครึ่งวันเช้า</Tag>;
        if (duration === 'HALF_PM') return <Tag>ครึ่งวันบ่าย</Tag>;
        return <Tag color="blue">เต็มวัน</Tag>;
      }
    },
    { title: 'เหตุผล', dataIndex: 'reason', key: 'reason',
      render: (reason: string) => reason || '-'
    },
    { title: 'จัดการ', key: 'action',
      render: (_: any, record: LeaveRecord) => (
        <Popconfirm
          title="ยืนยันการลบ?"
          description="ต้องการลบรายการลานี้หรือไม่?"
          onConfirm={() => handleDeleteLeave(record.id)}
          okText="ลบ"
          cancelText="ยกเลิก"
        >
          <Button type="text" danger icon={<DeleteOutlined />} size="small">
            ลบ
          </Button>
        </Popconfirm>
      )
    },
  ];

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
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/checkin')}
          style={{ color: '#fff' }}
        >
          กลับ
        </Button>
        <Title level={4} style={{ margin: 0, color: '#fff' }}>
          <SettingOutlined /> จัดการระบบ Check-in
        </Title>
        <Button 
          type="text" 
          icon={<HomeOutlined />} 
          onClick={() => navigate('/intro')}
          style={{ color: '#fff' }}
        >
          หน้าหลัก
        </Button>
      </div>

      <div style={{ padding: '24px', maxWidth: 1000, margin: '0 auto' }}>

      <Tabs
        defaultActiveKey="settings"
        items={[
          {
            key: 'settings',
            label: <><SettingOutlined /> ตั้งค่า</>,
            children: (
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSave}
              >
                {/* Working Hours Settings */}
                <Card 
                  title={<><ClockCircleOutlined /> ตั้งค่าเวลาทำงาน</>}
                  style={{ marginBottom: 24 }}
                  className="card-holo"
                  loading={loading}
                >
                  <Row gutter={24}>
                    <Col span={8}>
                      <Form.Item
                label="เวลาเข้างาน"
                name="clockInTime"
                rules={[{ required: true, message: 'กรุณาระบุเวลา' }]}
              >
                <TimePicker 
                  format="HH:mm" 
                  style={{ width: '100%' }}
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="เวลาออกงาน"
                name="clockOutTime"
                rules={[{ required: true, message: 'กรุณาระบุเวลา' }]}
              >
                <TimePicker 
                  format="HH:mm" 
                  style={{ width: '100%' }}
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Grace Period (นาที)"
                name="gracePeriodMinutes"
                tooltip="ระยะเวลาที่ยืดหยุ่นได้ก่อนถือว่ามาสาย"
                rules={[{ required: true, message: 'กรุณาระบุ' }]}
              >
                <InputNumber 
                  min={0} 
                  max={60} 
                  style={{ width: '100%' }}
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>
          <Text type="secondary">
            💡 ตัวอย่าง: ถ้าเวลาเข้างาน 09:00 และ Grace Period 15 นาที จะถือว่ามาสายเมื่อเช็คอินหลัง 09:15
          </Text>
        </Card>

        {/* LINE Notify Settings */}
        <Card 
          title={<><MessageOutlined /> ตั้งค่า LINE Notify</>}
          style={{ marginBottom: 24 }}
          className="card-holo"
          loading={loading}
        >
          <Form.Item
            label="LINE Notify Token"
            name="lineNotifyToken"
            tooltip="รับ Token ได้ที่ https://notify-bot.line.me"
            extra={
              <a href="https://notify-bot.line.me" target="_blank" rel="noopener noreferrer">
                สร้าง Token ที่ LINE Notify
              </a>
            }
          >
            <Input.Password 
              placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" 
              size="large"
            />
          </Form.Item>

          <Divider />

          <Title level={5}><BellOutlined /> แจ้งเตือนเมื่อ</Title>
          
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item name="notifyOnCheckin" valuePropName="checked">
                <Space>
                  <Switch />
                  <span>พนักงานเช็คอินเข้างาน</span>
                </Space>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="notifyOnCheckout" valuePropName="checked">
                <Space>
                  <Switch />
                  <span>พนักงานเช็คออก</span>
                </Space>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="notifyOnLate" valuePropName="checked">
                <Space>
                  <Switch />
                  <span>พนักงานมาสาย</span>
                </Space>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="notifyDailySummary" valuePropName="checked">
                <Space>
                  <Switch />
                  <span>ส่งสรุปประจำวัน</span>
                </Space>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="เวลาส่งสรุปประจำวัน"
            name="dailySummaryTime"
          >
            <TimePicker 
              format="HH:mm" 
              style={{ width: 150 }}
            />
          </Form.Item>

          <Divider />

          <Space>
            <Button 
              icon={<SendOutlined />}
              onClick={handleTestLine}
              loading={testing}
            >
              ทดสอบส่ง LINE
            </Button>
            <Button 
              icon={<SendOutlined />}
              onClick={handleSendDailySummary}
              loading={sendingSummary}
            >
              ส่งสรุปวันนี้
            </Button>
          </Space>
        </Card>

        {/* Save Button */}
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          icon={<SaveOutlined />}
          loading={saving}
          style={{ width: '100%', height: 50 }}
        >
          บันทึกตั้งค่า
        </Button>
              </Form>
            ),
          },
          {
            key: 'records',
            label: <><TeamOutlined /> จัดการรายการเช็คอิน</>,
            children: (
              <div>
                <Card className="card-holo" style={{ marginBottom: 24 }}>
                  <Space>
                    <Text strong>เลือกวันที่:</Text>
                    <DatePicker
                      value={selectedDate}
                      onChange={(date) => {
                        if (date) {
                          setSelectedDate(date);
                          loadRecordsByDate(date);
                        }
                      }}
                      format="DD/MM/YYYY"
                    />
                    <Button onClick={() => loadRecordsByDate(selectedDate)} loading={loadingRecords}>
                      โหลดข้อมูล
                    </Button>
                  </Space>
                </Card>

                {/* Checkin Records */}
                <Card 
                  title={<><ClockCircleOutlined /> รายการเช็คอิน ({selectedDate.format('DD/MM/YYYY')})</>}
                  className="card-holo"
                  style={{ marginBottom: 24 }}
                >
                  <Table
                    columns={checkinColumns}
                    dataSource={checkinRecords}
                    rowKey="id"
                    loading={loadingRecords}
                    pagination={false}
                    locale={{ emptyText: 'ไม่มีรายการเช็คอิน' }}
                  />
                </Card>

                {/* Leave Records */}
                <Card 
                  title={<>📋 รายการลา ({selectedDate.format('DD/MM/YYYY')})</>}
                  className="card-holo"
                >
                  <Table
                    columns={leaveColumns}
                    dataSource={leaveRecords}
                    rowKey="id"
                    loading={loadingRecords}
                    pagination={false}
                    locale={{ emptyText: 'ไม่มีรายการลา' }}
                  />
                </Card>
              </div>
            ),
          },
        ]}
      />
      </div>
    </div>
  );
};

export default CheckinAdminPage;
