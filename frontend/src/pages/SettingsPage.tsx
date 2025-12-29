import React, { useEffect, useState } from 'react';
import { Tabs, Table, Button, Card, Space, message, Modal, Form, Input, Popconfirm, InputNumber, Tag, Switch, Row, Col, Divider } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SettingOutlined, AppstoreOutlined, ScissorOutlined, FileTextOutlined, ToolOutlined, BellOutlined, FileProtectOutlined, GlobalOutlined } from '@ant-design/icons';
import { productsApi, unitsApi, systemSettingsApi } from '../services/api';
import { ProductCategory } from '../types';
import { useBranding } from '../contexts/BrandingContext';

interface Unit {
  id: number;
  name: string;
  description?: string;
}

interface SystemSetting {
  id: number;
  settingKey: string;
  settingValue: string;
  settingGroup: string;
  description?: string;
}

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('categories');
  const { refreshBranding } = useBranding();
  
  // Categories state
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [categoryForm] = Form.useForm();

  // Units state
  const [units, setUnits] = useState<Unit[]>([]);
  const [loadingUnits, setLoadingUnits] = useState(false);
  const [unitModalVisible, setUnitModalVisible] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [unitForm] = Form.useForm();

  // Quotation Settings state
  const [loadingQtSettings, setLoadingQtSettings] = useState(false);
  const [qtSettingsForm] = Form.useForm();

  // System Settings state
  const [loadingSystemSettings, setLoadingSystemSettings] = useState(false);
  const [systemSettingsForm] = Form.useForm();

  useEffect(() => {
    loadCategories();
    loadUnits();
    loadQuotationSettings();
    loadSystemSettings();
  }, []);

  // ============ Categories Functions ============
  const loadCategories = async () => {
    setLoadingCategories(true);
    try {
      const res = await productsApi.getCategories();
      setCategories(res.data || []);
    } catch (error) {
      message.error('ไม่สามารถโหลดข้อมูลหมวดหมู่ได้');
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleCreateCategory = () => {
    setEditingCategory(null);
    categoryForm.resetFields();
    setCategoryModalVisible(true);
  };

  const handleEditCategory = (category: ProductCategory) => {
    setEditingCategory(category);
    categoryForm.setFieldsValue(category);
    setCategoryModalVisible(true);
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await productsApi.deleteCategory(id);
      message.success('ลบหมวดหมู่สำเร็จ');
      loadCategories();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'ไม่สามารถลบหมวดหมู่ได้');
    }
  };

  const handleSubmitCategory = async (values: any) => {
    try {
      if (editingCategory) {
        await productsApi.updateCategory(editingCategory.id, values);
        message.success('แก้ไขหมวดหมู่สำเร็จ');
      } else {
        await productsApi.createCategory(values);
        message.success('เพิ่มหมวดหมู่สำเร็จ');
      }
      setCategoryModalVisible(false);
      loadCategories();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  // ============ Units Functions ============
  const loadUnits = async () => {
    setLoadingUnits(true);
    try {
      const res = await unitsApi.getAll();
      setUnits(res.data || []);
    } catch (error) {
      message.error('ไม่สามารถโหลดข้อมูลหน่วยได้');
    } finally {
      setLoadingUnits(false);
    }
  };

  const handleCreateUnit = () => {
    setEditingUnit(null);
    unitForm.resetFields();
    setUnitModalVisible(true);
  };

  const handleEditUnit = (unit: Unit) => {
    setEditingUnit(unit);
    unitForm.setFieldsValue(unit);
    setUnitModalVisible(true);
  };

  const handleDeleteUnit = async (id: number) => {
    try {
      await unitsApi.delete(id);
      message.success('ลบหน่วยสำเร็จ');
      loadUnits();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'ไม่สามารถลบหน่วยได้ (อาจมีสินค้าใช้งานอยู่)');
    }
  };

  const handleSubmitUnit = async (values: any) => {
    try {
      if (editingUnit) {
        await unitsApi.update(editingUnit.id, values);
        message.success('แก้ไขหน่วยสำเร็จ');
      } else {
        await unitsApi.create(values);
        message.success('เพิ่มหน่วยสำเร็จ');
      }
      setUnitModalVisible(false);
      loadUnits();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  // ============ Quotation Settings Functions ============
  const loadQuotationSettings = async () => {
    setLoadingQtSettings(true);
    try {
      const res = await systemSettingsApi.getAll('QUOTATION');
      const settingsMap: Record<string, string> = {};
      (res.data || []).forEach((s: SystemSetting) => {
        settingsMap[s.settingKey] = s.settingValue;
      });
      qtSettingsForm.setFieldsValue({
        QT_VALID_DAYS: parseInt(settingsMap.QT_VALID_DAYS) || 30,
        QT_DELIVERY_DAYS: parseInt(settingsMap.QT_DELIVERY_DAYS) || 120,
        QT_CREDIT_TERM_DAYS: parseInt(settingsMap.QT_CREDIT_TERM_DAYS) || 30,
        QT_MIN_MARGIN_PERCENT: parseFloat(settingsMap.QT_MIN_MARGIN_PERCENT) || 10,
        QT_DEFAULT_TAX_RATE: parseFloat(settingsMap.QT_DEFAULT_TAX_RATE) || 7,
      });
    } catch (error) {
      message.error('ไม่สามารถโหลดค่าตั้งต้นใบเสนอราคาได้');
    } finally {
      setLoadingQtSettings(false);
    }
  };

  const handleSaveQuotationSettings = async (values: any) => {
    try {
      const settings = [
        { key: 'QT_VALID_DAYS', value: String(values.QT_VALID_DAYS) },
        { key: 'QT_DELIVERY_DAYS', value: String(values.QT_DELIVERY_DAYS) },
        { key: 'QT_CREDIT_TERM_DAYS', value: String(values.QT_CREDIT_TERM_DAYS) },
        { key: 'QT_MIN_MARGIN_PERCENT', value: String(values.QT_MIN_MARGIN_PERCENT) },
        { key: 'QT_DEFAULT_TAX_RATE', value: String(values.QT_DEFAULT_TAX_RATE) },
      ];
      
      await systemSettingsApi.updateBulk(settings);
      
      message.success('บันทึกค่าตั้งต้นสำเร็จ');
      loadQuotationSettings();
    } catch (error) {
      message.error('ไม่สามารถบันทึกค่าตั้งต้นได้');
    }
  };

  // ============ System Settings Functions ============
  const loadSystemSettings = async () => {
    setLoadingSystemSettings(true);
    try {
      const res = await systemSettingsApi.getAll('SYSTEM');
      const settingsMap: Record<string, string> = {};
      (res.data || []).forEach((s: SystemSetting) => {
        settingsMap[s.settingKey] = s.settingValue;
      });
      systemSettingsForm.setFieldsValue({
        // System Branding
        SYSTEM_NAME: settingsMap.SYSTEM_NAME || 'SVS Business Suite',
        // Document Prefixes
        DOC_PREFIX_QT: settingsMap.DOC_PREFIX_QT || 'QT',
        DOC_PREFIX_PO: settingsMap.DOC_PREFIX_PO || 'PO',
        DOC_PREFIX_GR: settingsMap.DOC_PREFIX_GR || 'GR',
        DOC_PREFIX_INV: settingsMap.DOC_PREFIX_INV || 'INV',
        DOC_PREFIX_SI: settingsMap.DOC_PREFIX_SI || 'SI',
        // Alert Settings
        ALERT_EXPIRY_DAYS: parseInt(settingsMap.ALERT_EXPIRY_DAYS) || 30,
        ALERT_REORDER_ENABLED: settingsMap.ALERT_REORDER_ENABLED !== 'false',
        ALERT_EXPIRY_ENABLED: settingsMap.ALERT_EXPIRY_ENABLED !== 'false',
      });
    } catch (error) {
      // Use defaults
      systemSettingsForm.setFieldsValue({
        SYSTEM_NAME: 'SVS Business Suite',
        DOC_PREFIX_QT: 'QT',
        DOC_PREFIX_PO: 'PO',
        DOC_PREFIX_GR: 'GR',
        DOC_PREFIX_INV: 'INV',
        DOC_PREFIX_SI: 'SI',
        ALERT_EXPIRY_DAYS: 30,
        ALERT_REORDER_ENABLED: true,
        ALERT_EXPIRY_ENABLED: true,
      });
    } finally {
      setLoadingSystemSettings(false);
    }
  };

  const handleSaveSystemSettings = async (values: any) => {
    setLoadingSystemSettings(true);
    try {
      const settings = [
        { key: 'SYSTEM_NAME', value: values.SYSTEM_NAME || 'SVS Business Suite' },
        { key: 'DOC_PREFIX_QT', value: values.DOC_PREFIX_QT || 'QT' },
        { key: 'DOC_PREFIX_PO', value: values.DOC_PREFIX_PO || 'PO' },
        { key: 'DOC_PREFIX_GR', value: values.DOC_PREFIX_GR || 'GR' },
        { key: 'DOC_PREFIX_INV', value: values.DOC_PREFIX_INV || 'INV' },
        { key: 'DOC_PREFIX_SI', value: values.DOC_PREFIX_SI || 'SI' },
        { key: 'ALERT_EXPIRY_DAYS', value: String(values.ALERT_EXPIRY_DAYS || 30) },
        { key: 'ALERT_REORDER_ENABLED', value: String(values.ALERT_REORDER_ENABLED) },
        { key: 'ALERT_EXPIRY_ENABLED', value: String(values.ALERT_EXPIRY_ENABLED) },
      ];
      
      await systemSettingsApi.updateBulk(settings);
      message.success('บันทึกตั้งค่าระบบสำเร็จ');
      // Refresh branding context
      await refreshBranding();
    } catch (error) {
      message.error('ไม่สามารถบันทึกตั้งค่าระบบได้');
    } finally {
      setLoadingSystemSettings(false);
    }
  };

  // ============ Columns ============
  const categoryColumns = [
    { title: 'รหัส', dataIndex: 'code', width: 120 },
    { title: 'ชื่อหมวดหมู่', dataIndex: 'name' },
    { title: 'คำอธิบาย', dataIndex: 'description', render: (text: string) => text || '-' },
    {
      title: 'จัดการ',
      width: 120,
      render: (_: any, record: ProductCategory) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEditCategory(record)} style={{ color: '#22d3ee' }} />
          <Popconfirm title="ยืนยันการลบ" description="คุณต้องการลบหมวดหมู่นี้?" onConfirm={() => handleDeleteCategory(record.id)} okText="ลบ" cancelText="ยกเลิก">
            <Button type="text" icon={<DeleteOutlined />} style={{ color: '#f97373' }} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const unitColumns = [
    { title: 'ชื่อหน่วย', dataIndex: 'name', render: (text: string) => <Tag color="blue">{text}</Tag> },
    { title: 'คำอธิบาย', dataIndex: 'description', render: (text: string) => text || '-' },
    {
      title: 'จัดการ',
      width: 120,
      render: (_: any, record: Unit) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEditUnit(record)} style={{ color: '#22d3ee' }} />
          <Popconfirm title="ยืนยันการลบ" description="คุณต้องการลบหน่วยนี้?" onConfirm={() => handleDeleteUnit(record.id)} okText="ลบ" cancelText="ยกเลิก">
            <Button type="text" icon={<DeleteOutlined />} style={{ color: '#f97373' }} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // ============ Tab Items ============
  const tabItems = [
    {
      key: 'categories',
      label: (
        <span>
          <AppstoreOutlined /> หมวดหมู่สินค้า
        </span>
      ),
      children: (
        <Card className="card-holo">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ margin: 0 }}>🏷️ หมวดหมู่สินค้า</h3>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>จัดการหมวดหมู่สำหรับจัดกลุ่มสินค้า</p>
            </div>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateCategory} className="btn-holo">
              เพิ่มหมวดหมู่
            </Button>
          </div>
          <Table columns={categoryColumns} dataSource={categories} rowKey="id" loading={loadingCategories} pagination={{ pageSize: 10 }} />
        </Card>
      ),
    },
    {
      key: 'units',
      label: (
        <span>
          <ScissorOutlined /> หน่วยสินค้า
        </span>
      ),
      children: (
        <Card className="card-holo">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ margin: 0 }}>📏 หน่วยสินค้า</h3>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>จัดการหน่วยนับสินค้า เช่น ชิ้น, กล่อง, แพ็ค</p>
            </div>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateUnit} className="btn-holo">
              เพิ่มหน่วย
            </Button>
          </div>
          <Table columns={unitColumns} dataSource={units} rowKey="id" loading={loadingUnits} pagination={{ pageSize: 10 }} />
        </Card>
      ),
    },
    {
      key: 'quotation',
      label: (
        <span>
          <FileTextOutlined /> ค่าตั้งต้นใบเสนอราคา
        </span>
      ),
      children: (
        <Card className="card-holo">
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ margin: 0 }}>💰 ค่าตั้งต้นใบเสนอราคา</h3>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>กำหนดค่าเริ่มต้นสำหรับสร้างใบเสนอราคาใหม่</p>
          </div>
          <Form form={qtSettingsForm} layout="vertical" onFinish={handleSaveQuotationSettings} style={{ maxWidth: 600 }}>
            <Form.Item label="อายุใบเสนอราคา (วัน)" name="QT_VALID_DAYS">
              <InputNumber min={1} max={365} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="กำหนดส่งสินค้า (วัน)" name="QT_DELIVERY_DAYS">
              <InputNumber min={1} max={365} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="เครดิต (วัน)" name="QT_CREDIT_TERM_DAYS">
              <InputNumber min={0} max={365} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="Margin ขั้นต่ำ (%)" name="QT_MIN_MARGIN_PERCENT" tooltip="ถ้า Margin ต่ำกว่านี้จะแสดงเตือน">
              <InputNumber min={0} max={100} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="ภาษีมูลค่าเพิ่ม (%)" name="QT_DEFAULT_TAX_RATE">
              <InputNumber min={0} max={100} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="btn-holo" loading={loadingQtSettings}>
                บันทึกค่าตั้งต้น
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
    {
      key: 'system',
      label: (
        <span>
          <ToolOutlined /> ตั้งค่าระบบ
        </span>
      ),
      children: (
        <Card className="card-holo">
          <Form form={systemSettingsForm} layout="vertical" onFinish={handleSaveSystemSettings}>
            {/* System Branding Section */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <GlobalOutlined /> ข้อมูลระบบ
              </h3>
              <p style={{ margin: '4px 0 16px', color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
                ตั้งค่าชื่อระบบที่จะแสดงในหน้า Login และ Menu
              </p>
            </div>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item 
                  label="ชื่อระบบ" 
                  name="SYSTEM_NAME"
                  tooltip="ชื่อที่จะแสดงในหน้า Login และ Sidebar"
                >
                  <Input placeholder="SVS Business Suite" />
                </Form.Item>
              </Col>
            </Row>

            <Divider />

            {/* Document Prefix Section */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileProtectOutlined /> รูปแบบเลขที่เอกสาร
              </h3>
              <p style={{ margin: '4px 0 16px', color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
                กำหนด Prefix สำหรับเลขที่เอกสารแต่ละประเภท
              </p>
            </div>
            
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="ใบเสนอราคา (Quotation)" name="DOC_PREFIX_QT">
                  <Input placeholder="QT" addonAfter="-YYMMDD-XXX" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="ใบสั่งซื้อ (PO)" name="DOC_PREFIX_PO">
                  <Input placeholder="PO" addonAfter="-YYMMDD-XXX" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="ใบรับสินค้า (GR)" name="DOC_PREFIX_GR">
                  <Input placeholder="GR" addonAfter="-YYMMDD-XXX" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="ใบแจ้งหนี้ (Invoice)" name="DOC_PREFIX_INV">
                  <Input placeholder="INV" addonAfter="-YYMMDD-XXX" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="ใบขายสินค้า (Sales)" name="DOC_PREFIX_SI">
                  <Input placeholder="SI" addonAfter="-YYMMDD-XXX" />
                </Form.Item>
              </Col>
            </Row>

            <Divider />

            {/* Alert Settings Section */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <BellOutlined /> ตั้งค่าการแจ้งเตือน
              </h3>
              <p style={{ margin: '4px 0 16px', color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
                กำหนดการแจ้งเตือนสินค้าใกล้หมด และหมดอายุ
              </p>
            </div>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="แจ้งเตือนก่อนหมดอายุ (วัน)" name="ALERT_EXPIRY_DAYS" tooltip="จำนวนวันก่อนหมดอายุที่จะแสดงเตือน">
                  <InputNumber min={1} max={365} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="เปิดแจ้งเตือนสินค้าใกล้หมด" name="ALERT_REORDER_ENABLED" valuePropName="checked">
                  <Switch checkedChildren="เปิด" unCheckedChildren="ปิด" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="เปิดแจ้งเตือนหมดอายุ" name="ALERT_EXPIRY_ENABLED" valuePropName="checked">
                  <Switch checkedChildren="เปิด" unCheckedChildren="ปิด" />
                </Form.Item>
              </Col>
            </Row>

            <Divider />

            <Form.Item>
              <Button type="primary" htmlType="submit" className="btn-holo" loading={loadingSystemSettings}>
                บันทึกตั้งค่าระบบ
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="text-gradient">
          <SettingOutlined style={{ marginRight: 12 }} />
          ตั้งค่าระบบ
        </h1>
        <p>จัดการหมวดหมู่ หน่วยสินค้า และค่าตั้งต้นต่างๆ</p>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />

      {/* Category Modal */}
      <Modal
        title={editingCategory ? '✏️ แก้ไขหมวดหมู่' : '➕ เพิ่มหมวดหมู่'}
        open={categoryModalVisible}
        onCancel={() => setCategoryModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form form={categoryForm} layout="vertical" onFinish={handleSubmitCategory}>
          <Form.Item name="code" label="รหัสหมวดหมู่" rules={[{ required: true, message: 'กรุณากรอกรหัส' }]}>
            <Input placeholder="เช่น CAT001" disabled={!!editingCategory} />
          </Form.Item>
          <Form.Item name="name" label="ชื่อหมวดหมู่" rules={[{ required: true, message: 'กรุณากรอกชื่อ' }]}>
            <Input placeholder="เช่น อุปกรณ์อิเล็กทรอนิกส์" />
          </Form.Item>
          <Form.Item name="description" label="คำอธิบาย">
            <Input.TextArea rows={3} placeholder="รายละเอียดเพิ่มเติม" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setCategoryModalVisible(false)}>ยกเลิก</Button>
              <Button type="primary" htmlType="submit" className="btn-holo">
                {editingCategory ? 'บันทึก' : 'เพิ่ม'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Unit Modal */}
      <Modal
        title={editingUnit ? '✏️ แก้ไขหน่วย' : '➕ เพิ่มหน่วย'}
        open={unitModalVisible}
        onCancel={() => setUnitModalVisible(false)}
        footer={null}
        width={400}
      >
        <Form form={unitForm} layout="vertical" onFinish={handleSubmitUnit}>
          <Form.Item name="name" label="ชื่อหน่วย" rules={[{ required: true, message: 'กรุณากรอกชื่อหน่วย' }]}>
            <Input placeholder="เช่น ea, set, box, งาน" />
          </Form.Item>
          <Form.Item name="description" label="คำอธิบาย">
            <Input placeholder="เช่น ชิ้น, ชุด, กล่อง" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setUnitModalVisible(false)}>ยกเลิก</Button>
              <Button type="primary" htmlType="submit" className="btn-holo">
                {editingUnit ? 'บันทึก' : 'เพิ่ม'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SettingsPage;
