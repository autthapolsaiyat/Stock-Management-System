import React, { useState, useEffect } from 'react';
import {
  Card, Table, Button, Space, Tag, Modal, Form, Input, Select,
  message, Popconfirm, Typography, Row, Col, TreeSelect
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined,
  BankOutlined
} from '@ant-design/icons';
import { chartOfAccountsApi } from '../../services/api';

const { Title } = Typography;
const { Option } = Select;

interface ChartOfAccount {
  id: number;
  code: string;
  name: string;
  nameEn?: string;
  accountType: string;
  accountGroup: string;
  balanceType: string;
  level: number;
  parentId?: number;
  isActive: boolean;
  isSystem: boolean;
  isControl: boolean;
  controlType?: string;
  children?: ChartOfAccount[];
}

const ACCOUNT_TYPES = [
  { value: 'ASSET', label: 'สินทรัพย์', color: 'green' },
  { value: 'LIABILITY', label: 'หนี้สิน', color: 'red' },
  { value: 'EQUITY', label: 'ส่วนของผู้ถือหุ้น', color: 'purple' },
  { value: 'REVENUE', label: 'รายได้', color: 'blue' },
  { value: 'EXPENSE', label: 'ค่าใช้จ่าย', color: 'orange' },
];

const ACCOUNT_GROUPS: Record<string, { value: string; label: string }[]> = {
  ASSET: [
    { value: 'CURRENT_ASSET', label: 'สินทรัพย์หมุนเวียน' },
    { value: 'FIXED_ASSET', label: 'สินทรัพย์ถาวร' },
    { value: 'OTHER_ASSET', label: 'สินทรัพย์อื่น' },
  ],
  LIABILITY: [
    { value: 'CURRENT_LIABILITY', label: 'หนี้สินหมุนเวียน' },
    { value: 'LONG_TERM_LIABILITY', label: 'หนี้สินระยะยาว' },
  ],
  EQUITY: [
    { value: 'SHARE_CAPITAL', label: 'ทุนเรือนหุ้น' },
    { value: 'RETAINED_EARNINGS', label: 'กำไรสะสม' },
  ],
  REVENUE: [
    { value: 'SALES_REVENUE', label: 'รายได้จากการขาย' },
    { value: 'OTHER_REVENUE', label: 'รายได้อื่น' },
  ],
  EXPENSE: [
    { value: 'COST_OF_GOODS', label: 'ต้นทุนขาย' },
    { value: 'OPERATING_EXPENSE', label: 'ค่าใช้จ่ายดำเนินงาน' },
    { value: 'OTHER_EXPENSE', label: 'ค่าใช้จ่ายอื่น' },
  ],
};

const ChartOfAccountsPage: React.FC = () => {
  const [accounts, setAccounts] = useState<ChartOfAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAccount, setEditingAccount] = useState<ChartOfAccount | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const treeRes = await chartOfAccountsApi.getTree();
      setAccounts(treeRes.data);
    } catch (error) {
      message.error('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (account?: ChartOfAccount) => {
    if (account) {
      setEditingAccount(account);
      form.setFieldsValue({
        code: account.code,
        name: account.name,
        nameEn: account.nameEn,
        accountType: account.accountType,
        accountGroup: account.accountGroup,
        balanceType: account.balanceType,
        parentId: account.parentId,
      });
    } else {
      setEditingAccount(null);
      form.resetFields();
      form.setFieldsValue({
        accountType: 'ASSET',
        accountGroup: 'CURRENT_ASSET',
        balanceType: 'DEBIT',
      });
    }
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingAccount) {
        await chartOfAccountsApi.update(editingAccount.id, values);
        message.success('อัพเดทบัญชีสำเร็จ');
      } else {
        await chartOfAccountsApi.create(values);
        message.success('สร้างบัญชีสำเร็จ');
      }
      setModalVisible(false);
      loadAccounts();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await chartOfAccountsApi.delete(id);
      message.success('ลบบัญชีสำเร็จ');
      loadAccounts();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'ไม่สามารถลบได้');
    }
  };

  const handleInitialize = async () => {
    try {
      await chartOfAccountsApi.initialize();
      message.success('สร้างผังบัญชีมาตรฐานสำเร็จ');
      loadAccounts();
    } catch (error) {
      message.error('เกิดข้อผิดพลาด');
    }
  };

  const columns = [
    {
      title: 'รหัสบัญชี',
      dataIndex: 'code',
      key: 'code',
      width: 150,
    },
    {
      title: 'ชื่อบัญชี',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: ChartOfAccount) => (
        <div>
          <div>{text}</div>
          {record.nameEn && (
            <div style={{ fontSize: 12, color: '#888' }}>{record.nameEn}</div>
          )}
        </div>
      ),
    },
    {
      title: 'ประเภท',
      dataIndex: 'accountType',
      key: 'accountType',
      width: 130,
      render: (type: string) => {
        const typeInfo = ACCOUNT_TYPES.find(t => t.value === type);
        return <Tag color={typeInfo?.color}>{typeInfo?.label}</Tag>;
      },
    },
    {
      title: 'ยอดคงเหลือ',
      dataIndex: 'balanceType',
      key: 'balanceType',
      width: 100,
      render: (type: string) => (
        <Tag>{type === 'DEBIT' ? 'เดบิต' : 'เครดิต'}</Tag>
      ),
    },
    {
      title: 'บัญชีคุม',
      dataIndex: 'controlType',
      key: 'controlType',
      width: 100,
      render: (type: string) => type ? <Tag color="blue">{type}</Tag> : '-',
    },
    {
      title: 'สถานะ',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (active: boolean) => (
        <Tag color={active ? 'success' : 'default'}>
          {active ? 'ใช้งาน' : 'ปิดใช้งาน'}
        </Tag>
      ),
    },
    {
      title: 'จัดการ',
      key: 'action',
      width: 120,
      render: (_: unknown, record: ChartOfAccount) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleOpenModal(record)}
            disabled={record.isSystem}
          />
          <Popconfirm
            title="ต้องการลบบัญชีนี้?"
            onConfirm={() => handleDelete(record.id)}
            disabled={record.isSystem}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              disabled={record.isSystem}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const accountTypeValue = Form.useWatch('accountType', form);

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <Space>
              <BankOutlined style={{ fontSize: 24 }} />
              <Title level={4} style={{ margin: 0 }}>ผังบัญชี (Chart of Accounts)</Title>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button icon={<ReloadOutlined />} onClick={loadAccounts}>
                รีเฟรช
              </Button>
              <Popconfirm
                title="สร้างผังบัญชีมาตรฐาน?"
                description="จะไม่ทับบัญชีที่มีอยู่แล้ว"
                onConfirm={handleInitialize}
              >
                <Button>สร้างผังมาตรฐาน</Button>
              </Popconfirm>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
                เพิ่มบัญชี
              </Button>
            </Space>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={accounts}
          rowKey="id"
          loading={loading}
          pagination={false}
          expandable={{ defaultExpandAllRows: true }}
          size="small"
        />
      </Card>

      {/* Modal */}
      <Modal
        title={editingAccount ? 'แก้ไขบัญชี' : 'เพิ่มบัญชีใหม่'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        okText={editingAccount ? 'บันทึก' : 'สร้าง'}
        cancelText="ยกเลิก"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="code"
            label="รหัสบัญชี"
            rules={[{ required: true, message: 'กรุณาระบุรหัสบัญชี' }]}
          >
            <Input disabled={!!editingAccount} />
          </Form.Item>
          <Form.Item
            name="name"
            label="ชื่อบัญชี (ไทย)"
            rules={[{ required: true, message: 'กรุณาระบุชื่อบัญชี' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="nameEn" label="ชื่อบัญชี (อังกฤษ)">
            <Input />
          </Form.Item>
          <Form.Item
            name="accountType"
            label="ประเภทบัญชี"
            rules={[{ required: true }]}
          >
            <Select
              onChange={(value: string) => {
                const groups = ACCOUNT_GROUPS[value] || [];
                form.setFieldsValue({
                  accountGroup: groups[0]?.value,
                  balanceType: ['ASSET', 'EXPENSE'].includes(value) ? 'DEBIT' : 'CREDIT',
                });
              }}
            >
              {ACCOUNT_TYPES.map(t => (
                <Option key={t.value} value={t.value}>{t.label}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="accountGroup"
            label="กลุ่มบัญชี"
            rules={[{ required: true }]}
          >
            <Select>
              {(ACCOUNT_GROUPS[accountTypeValue] || []).map(g => (
                <Option key={g.value} value={g.value}>{g.label}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="balanceType"
            label="ยอดคงเหลือปกติ"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="DEBIT">เดบิต</Option>
              <Option value="CREDIT">เครดิต</Option>
            </Select>
          </Form.Item>
          <Form.Item name="parentId" label="บัญชีแม่">
            <TreeSelect
              allowClear
              placeholder="เลือกบัญชีแม่ (ถ้ามี)"
              treeData={accounts.map(a => ({
                title: `${a.code} - ${a.name}`,
                value: a.id,
                children: a.children?.map(c => ({
                  title: `${c.code} - ${c.name}`,
                  value: c.id,
                })),
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ChartOfAccountsPage;
