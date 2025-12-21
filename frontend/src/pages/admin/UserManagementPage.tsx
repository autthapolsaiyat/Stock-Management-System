import { useState, useEffect } from 'react';
import { 
  Card, Table, Button, Input, Space, Tag, Modal, Form, 
  Select, Switch, message, Popconfirm, Avatar, Badge,
  Tooltip
} from 'antd';
import { 
  UserOutlined, PlusOutlined, EditOutlined, DeleteOutlined, 
  KeyOutlined, SearchOutlined, SafetyOutlined,
  LockOutlined, UnlockOutlined, ReloadOutlined
} from '@ant-design/icons';
import api from '../../services/api';

interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  isActive: boolean;
  roles: string[];
  createdAt: string;
  lastLoginAt?: string;
}

interface Role {
  id: number;
  code: string;
  name: string;
  description: string;
}

const UserManagementPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [form] = Form.useForm();
  const [roleForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      message.error('ไม่สามารถโหลดข้อมูลผู้ใช้ได้');
    }
    setLoading(false);
  };

  const fetchRoles = async () => {
    try {
      const response = await api.get('/roles');
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handleCreate = () => {
    setSelectedUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    form.setFieldsValue({
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      isActive: user.isActive,
    });
    setModalVisible(true);
  };

  const handleEditRoles = (user: User) => {
    setSelectedUser(user);
    roleForm.setFieldsValue({
      roles: user.roles,
    });
    setRoleModalVisible(true);
  };

  const handleResetPassword = (user: User) => {
    setSelectedUser(user);
    passwordForm.resetFields();
    setPasswordModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (selectedUser) {
        await api.patch(`/users/${selectedUser.id}`, values);
        message.success('อัปเดตข้อมูลผู้ใช้สำเร็จ');
      } else {
        await api.post('/users', { ...values, password: '123456' });
        message.success('สร้างผู้ใช้สำเร็จ (รหัสผ่านเริ่มต้น: 123456)');
      }
      setModalVisible(false);
      fetchUsers();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const handleUpdateRoles = async (values: any) => {
    if (!selectedUser) return;
    try {
      await api.patch(`/users/${selectedUser.id}/roles`, { roles: values.roles });
      message.success('อัปเดตสิทธิ์สำเร็จ');
      setRoleModalVisible(false);
      fetchUsers();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const handlePasswordReset = async (values: any) => {
    if (!selectedUser) return;
    try {
      await api.patch(`/users/${selectedUser.id}/password`, { password: values.newPassword });
      message.success('รีเซ็ตรหัสผ่านสำเร็จ');
      setPasswordModalVisible(false);
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const handleToggleActive = async (user: User) => {
    try {
      await api.patch(`/users/${user.id}`, { isActive: !user.isActive });
      message.success(user.isActive ? 'ระงับผู้ใช้สำเร็จ' : 'เปิดใช้งานผู้ใช้สำเร็จ');
      fetchUsers();
    } catch (error) {
      message.error('เกิดข้อผิดพลาด');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/users/${id}`);
      message.success('ลบผู้ใช้สำเร็จ');
      fetchUsers();
    } catch (error) {
      message.error('ไม่สามารถลบผู้ใช้ได้');
    }
  };

  const roleColors: Record<string, string> = {
    ADMIN: 'red',
    MANAGER: 'purple',
    SALES: 'blue',
    SALES_STANDARD: 'cyan',
    SALES_FORENSIC: 'geekblue',
    SALES_TOOLLAB: 'lime',
    SALES_MAINTENANCE: 'orange',
    WAREHOUSE: 'green',
    PURCHASING: 'gold',
    ACCOUNTING: 'magenta',
    VIEWER: 'default',
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchText.toLowerCase()) ||
      user.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: 'ผู้ใช้',
      key: 'user',
      render: (_: any, record: User) => (
        <Space>
          <Avatar 
            style={{ 
              background: record.isActive 
                ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' 
                : '#9ca3af' 
            }}
            icon={<UserOutlined />} 
          />
          <div>
            <div style={{ fontWeight: 500 }}>{record.fullName}</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>@{record.username}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'อีเมล',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => email || '-',
    },
    {
      title: 'สิทธิ์',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles: string[]) => (
        <Space wrap>
          {roles?.map((role) => (
            <Tag key={role} color={roleColors[role] || 'default'}>
              {role}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'สถานะ',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (isActive: boolean) => (
        <Badge 
          status={isActive ? 'success' : 'error'} 
          text={isActive ? 'ใช้งาน' : 'ระงับ'} 
        />
      ),
    },
    {
      title: 'จัดการ',
      key: 'actions',
      width: 200,
      render: (_: any, record: User) => (
        <Space>
          <Tooltip title="แก้ไขข้อมูล">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="จัดการสิทธิ์">
            <Button 
              type="text" 
              icon={<SafetyOutlined />} 
              onClick={() => handleEditRoles(record)}
              style={{ color: '#8b5cf6' }}
            />
          </Tooltip>
          <Tooltip title="รีเซ็ตรหัสผ่าน">
            <Button 
              type="text" 
              icon={<KeyOutlined />} 
              onClick={() => handleResetPassword(record)}
              style={{ color: '#f59e0b' }}
            />
          </Tooltip>
          <Tooltip title={record.isActive ? 'ระงับผู้ใช้' : 'เปิดใช้งาน'}>
            <Button 
              type="text" 
              icon={record.isActive ? <LockOutlined /> : <UnlockOutlined />} 
              onClick={() => handleToggleActive(record)}
              style={{ color: record.isActive ? '#ef4444' : '#22c55e' }}
            />
          </Tooltip>
          <Popconfirm
            title="ยืนยันการลบผู้ใช้?"
            description="การลบจะไม่สามารถกู้คืนได้"
            onConfirm={() => handleDelete(record.id)}
            okText="ลบ"
            cancelText="ยกเลิก"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="ลบ">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card
        title={
          <Space>
            <UserOutlined />
            <span>จัดการผู้ใช้งาน</span>
            <Tag color="blue">{users.length} คน</Tag>
          </Space>
        }
        extra={
          <Space>
            <Input
              placeholder="ค้นหาผู้ใช้..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
              allowClear
            />
            <Button icon={<ReloadOutlined />} onClick={fetchUsers}>
              รีเฟรช
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              เพิ่มผู้ใช้
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 15, showSizeChanger: true }}
        />
      </Card>

      {/* Create/Edit User Modal */}
      <Modal
        title={selectedUser ? 'แก้ไขข้อมูลผู้ใช้' : 'เพิ่มผู้ใช้ใหม่'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="username"
            label="ชื่อผู้ใช้"
            rules={[{ required: true, message: 'กรุณาระบุชื่อผู้ใช้' }]}
          >
            <Input prefix={<UserOutlined />} disabled={!!selectedUser} />
          </Form.Item>
          <Form.Item
            name="fullName"
            label="ชื่อ-นามสกุล"
            rules={[{ required: true, message: 'กรุณาระบุชื่อ-นามสกุล' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="email" label="อีเมล">
            <Input type="email" />
          </Form.Item>
          {selectedUser && (
            <Form.Item name="isActive" label="สถานะ" valuePropName="checked">
              <Switch checkedChildren="ใช้งาน" unCheckedChildren="ระงับ" />
            </Form.Item>
          )}
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>ยกเลิก</Button>
              <Button type="primary" htmlType="submit">
                {selectedUser ? 'บันทึก' : 'สร้างผู้ใช้'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Roles Modal */}
      <Modal
        title={<Space><SafetyOutlined /><span>จัดการสิทธิ์: {selectedUser?.fullName}</span></Space>}
        open={roleModalVisible}
        onCancel={() => setRoleModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form form={roleForm} layout="vertical" onFinish={handleUpdateRoles}>
          <Form.Item
            name="roles"
            label="สิทธิ์การใช้งาน"
            rules={[{ required: true, message: 'กรุณาเลือกสิทธิ์อย่างน้อย 1 รายการ' }]}
          >
            <Select
              mode="multiple"
              placeholder="เลือกสิทธิ์"
              style={{ width: '100%' }}
              options={roles.map((role) => ({
                value: role.code,
                label: <Space><Tag color={roleColors[role.code] || 'default'}>{role.code}</Tag>{role.name}</Space>,
              }))}
            />
          </Form.Item>
          <div style={{ background: '#f0f9ff', padding: 16, borderRadius: 8, marginBottom: 16 }}>
            <div style={{ fontWeight: 500, marginBottom: 8 }}>📋 รายละเอียดสิทธิ์:</div>
            {roles.map((role) => (
              <div key={role.code} style={{ fontSize: 12, marginBottom: 4 }}>
                <Tag color={roleColors[role.code]} style={{ width: 130 }}>{role.code}</Tag>
                {role.description}
              </div>
            ))}
          </div>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setRoleModalVisible(false)}>ยกเลิก</Button>
              <Button type="primary" htmlType="submit">บันทึกสิทธิ์</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Reset Password Modal */}
      <Modal
        title={<Space><KeyOutlined /><span>รีเซ็ตรหัสผ่าน: {selectedUser?.fullName}</span></Space>}
        open={passwordModalVisible}
        onCancel={() => setPasswordModalVisible(false)}
        footer={null}
        width={400}
      >
        <Form form={passwordForm} layout="vertical" onFinish={handlePasswordReset}>
          <Form.Item
            name="newPassword"
            label="รหัสผ่านใหม่"
            rules={[
              { required: true, message: 'กรุณาระบุรหัสผ่านใหม่' },
              { min: 6, message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="ยืนยันรหัสผ่าน"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'กรุณายืนยันรหัสผ่าน' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('รหัสผ่านไม่ตรงกัน'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setPasswordModalVisible(false)}>ยกเลิก</Button>
              <Button type="primary" htmlType="submit">รีเซ็ตรหัสผ่าน</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagementPage;
