import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card, Form, Input, Select, DatePicker, InputNumber, Button, Space, Row, Col,
  Table, Tag, message, Modal, Divider, Radio, Popconfirm
} from 'antd';
import {
  SaveOutlined, SendOutlined, PlusOutlined, DeleteOutlined,
  SettingOutlined, CalculatorOutlined, EyeOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { quotationsApi, customersApi, productsApi, systemSettingsApi } from '../../services/api';
import type { QuotationItem, QuotationImage, SourceType } from '../../types/quotation';
import { useAuth } from '../../contexts/AuthContext';
import SettingsModal from '../../components/quotation/SettingsModal';
import TempProductModal from '../../components/quotation/TempProductModal';
import QuickCalculator from '../../components/quotation/QuickCalculator';
import ImageGallery from '../../components/quotation/ImageGallery';
import QuotationPrintPreview from '../../components/quotation/QuotationPrintPreview';

const { Option } = Select;
const { TextArea } = Input;

const QuotationForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const [form] = Form.useForm();
  const { getQuotationType, isSalesOnly } = useAuth();

  const userQuotationType = getQuotationType();
  const salesOnly = isSalesOnly();

  // States
  const [, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<QuotationItem[]>([]);
  const [images, setImages] = useState<QuotationImage[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  // Modals
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [tempProductModalOpen, setTempProductModalOpen] = useState(false);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Calculated values
  const [summary, setSummary] = useState({
    subtotal: 0,
    discountAmount: 0,
    afterDiscount: 0,
    taxAmount: 0,
    grandTotal: 0,
    totalCost: 0,
    marginAmount: 0,
    marginPercent: 0,
    requiresApproval: false,
  });

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (isEdit && id) {
      loadQuotation(parseInt(id));
    }
  }, [id, isEdit]);

  useEffect(() => {
    calculateSummary();
  }, [items]);

  // Handle paste from clipboard for images
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = (event) => {
              const base64 = event.target?.result as string;
              if (base64) {
                addImageFromClipboard(base64);
              }
            };
            reader.readAsDataURL(blob);
          }
        }
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [images]);

  const addImageFromClipboard = (base64: string) => {
    const newImage: QuotationImage = {
      imageUrl: base64,
      sortOrder: images.length + 1,
      caption: `รูปจาก Clipboard ${images.length + 1}`,
    };
    setImages([...images, newImage]);
    message.success('วางรูปจาก Clipboard สำเร็จ');
  };

  const loadInitialData = async () => {
    try {
      const [customersRes, productsRes] = await Promise.all([
        customersApi.getAll(),
        userQuotationType 
          ? productsApi.getAll(undefined, userQuotationType)
          : productsApi.getAll(),
      ]);
      setCustomers(customersRes.data || []);
      setProducts(productsRes.data || []);
      
      try {
        const settingsRes = await systemSettingsApi.getAll('QUOTATION');
        const settingsMap: any = {};
        (settingsRes.data || []).forEach((s: any) => {
          settingsMap[s.settingKey] = s.settingValue;
        });
        setSettings(settingsMap);
      } catch (e) {
        setSettings({});
      }

      if (!isEdit) {
        form.setFieldsValue({
          quotationType: userQuotationType || 'STANDARD',
          docDate: dayjs(),
          validDays: 30,
          deliveryDays: 120,
          creditTermDays: 30,
          taxRate: 7,
          discountDisplayMode: 'SHOW',
        });
      }
    } catch (error) {
      message.error('ไม่สามารถโหลดข้อมูลได้');
    }
  };

  const loadQuotation = async (quotationId: number) => {
    setLoading(true);
    try {
      const response = await quotationsApi.getById(quotationId);
      const data = response.data;
      
      form.setFieldsValue({
        ...data,
        docDate: dayjs(data.docDate),
        validUntil: data.validUntil ? dayjs(data.validUntil) : null,
      });
      setItems(data.items || []);
      setImages(data.images || []);
    } catch (error) {
      message.error('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = () => {
    const subtotal = items.reduce((sum, item) => sum + Number(item.lineTotal || 0), 0);
    const totalCost = items.reduce((sum, item) => sum + (Number(item.estimatedCost || 0) * Number(item.qty || 0)), 0);
    
    const discountPercent = form.getFieldValue('discountPercent') || 0;
    const discountAmountInput = form.getFieldValue('discountAmount') || 0;
    const discountAmount = discountAmountInput || (subtotal * discountPercent / 100);
    
    const afterDiscount = subtotal - discountAmount;
    const taxRate = form.getFieldValue('taxRate') || 7;
    const taxAmount = afterDiscount * taxRate / 100;
    const grandTotal = afterDiscount + taxAmount;
    
    const marginAmount = afterDiscount - totalCost;
    const marginPercent = afterDiscount > 0 ? (marginAmount / afterDiscount) * 100 : 0;
    const minMargin = parseFloat(settings?.QT_MIN_MARGIN_PERCENT || '10');
    const requiresApproval = items.length > 0 && marginPercent < minMargin;

    setSummary({
      subtotal,
      discountAmount,
      afterDiscount,
      taxAmount,
      grandTotal,
      totalCost,
      marginAmount,
      marginPercent,
      requiresApproval,
    });
  };

  const handleCustomerChange = (customerId: number) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      setSelectedCustomer(customer);
      form.setFieldsValue({
        customerName: customer.name,
        customerAddress: customer.address,
        contactPerson: customer.contactPerson || '',
        contactPhone: customer.contactPhone || customer.phone || '',
        contactEmail: customer.contactEmail || customer.email || '',
        creditTermDays: customer.creditTermDays || 30,
      });
    }
  };

  const handleAddProduct = (product: any) => {
    const existingIndex = items.findIndex(item => 
      item.sourceType === 'MASTER' && item.productId === product.id
    );

    if (existingIndex >= 0) {
      const newItems = [...items];
      newItems[existingIndex].qty += 1;
      newItems[existingIndex].lineTotal = newItems[existingIndex].qty * newItems[existingIndex].unitPrice;
      setItems(newItems);
    } else {
      const newItem: QuotationItem = {
        lineNo: items.length + 1,
        sourceType: 'MASTER',
        productId: product.id,
        itemCode: product.code,
        itemName: product.name,
        itemDescription: product.description,
        brand: product.brand,
        qty: 1,
        unit: product.unit?.name || product.unit || 'ea',
        unitPrice: product.sellingPrice || 0,
        estimatedCost: product.cost || product.standardCost || 0,
        expectedMarginPercent: product.sellingPrice > 0 
          ? ((product.sellingPrice - (product.cost || product.standardCost || 0)) / product.sellingPrice) * 100 
          : 0,
        lineTotal: product.sellingPrice || 0,
        itemStatus: 'PENDING',
      };
      setItems([...items, newItem]);
    }
    setProductModalOpen(false);
  };

  const handleAddTempProduct = (tempProduct: any) => {
    const newItem: QuotationItem = {
      lineNo: items.length + 1,
      sourceType: 'TEMP',
      tempProductId: tempProduct.id,
      itemCode: tempProduct.tempCode || `TEMP-${Date.now()}`,
      itemName: tempProduct.name,
      itemDescription: tempProduct.description,
      brand: tempProduct.brand,
      qty: 1,
      unit: tempProduct.unit || 'ea',
      unitPrice: tempProduct.suggestedPrice || 0,
      estimatedCost: tempProduct.estimatedCost || 0,
      expectedMarginPercent: tempProduct.suggestedPrice > 0
        ? ((tempProduct.suggestedPrice - (tempProduct.estimatedCost || 0)) / tempProduct.suggestedPrice) * 100
        : 0,
      lineTotal: tempProduct.suggestedPrice || 0,
      itemStatus: 'PENDING',
    };
    setItems([...items, newItem]);
    setTempProductModalOpen(false);
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;

    if (['qty', 'unitPrice', 'discountAmount'].includes(field)) {
      const item = newItems[index];
      const netPrice = item.unitPrice - (item.discountAmount || 0);
      item.lineTotal = item.qty * netPrice;
      item.expectedMarginPercent = netPrice > 0 
        ? ((netPrice - item.estimatedCost) / netPrice) * 100 
        : 0;
    }

    setItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    newItems.forEach((item, i) => item.lineNo = i + 1);
    setItems(newItems);
  };

  const handleSave = async (submit: boolean = false) => {
    try {
      await form.validateFields();
      setSaving(true);

      const values = form.getFieldsValue();
      const payload = {
        ...values,
        docDate: values.docDate?.format('YYYY-MM-DD'),
        validUntil: values.validUntil?.format('YYYY-MM-DD'),
        items: items.map((item, index) => ({
          ...item,
          lineNo: index + 1,
        })),
        images: images,
        ...summary,
      };

      let response;
      if (isEdit) {
        response = await quotationsApi.update(parseInt(id!), payload);
        message.success('บันทึกสำเร็จ');
      } else {
        response = await quotationsApi.create(payload);
        message.success('สร้างใบเสนอราคาสำเร็จ');
      }

      if (submit) {
        await quotationsApi.submitForApproval(response.data.id);
        message.success('ส่งขออนุมัติสำเร็จ');
      }

      navigate(`/quotations/${response.data.id}`);
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    } finally {
      setSaving(false);
    }
  };

  const getMarginColor = (percent: number) => {
    const minMargin = parseFloat(settings?.QT_MIN_MARGIN_PERCENT || '10');
    if (percent < minMargin) return 'warning';
    if (percent >= 20) return 'green';
    return 'blue';
  };

  const getTypeLabel = () => {
    const type = userQuotationType || 'STANDARD';
    const labels: Record<string, string> = {
      STANDARD: '📦 ทั่วไป (AccuStandard/PT)',
      FORENSIC: '🔬 นิติวิทยาศาสตร์',
      MAINTENANCE: '🔧 บำรุงรักษา',
    };
    return labels[type] || type;
  };

  const itemColumns = [
    {
      title: '#',
      dataIndex: 'lineNo',
      width: 50,
      align: 'center' as const,
    },
    {
      title: 'สินค้า',
      dataIndex: 'itemName',
      render: (text: string, record: QuotationItem) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            {record.sourceType === 'TEMP' && <Tag color="orange">🔶 ชั่วคราว</Tag>}
            {text}
          </div>
          <div style={{ fontSize: 12, color: '#888' }}>{record.itemCode}</div>
        </div>
      ),
    },
    {
      title: 'จำนวน',
      dataIndex: 'qty',
      width: 100,
      render: (val: number, _: any, index: number) => (
        <InputNumber
          min={1}
          value={val}
          onChange={(v) => handleItemChange(index, 'qty', v || 1)}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'ราคา/หน่วย',
      dataIndex: 'unitPrice',
      width: 130,
      render: (val: number, _: any, index: number) => (
        <InputNumber
          min={0}
          value={val}
          onChange={(v) => handleItemChange(index, 'unitPrice', v || 0)}
          formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(v) => v!.replace(/,/g, '') as any}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'ต้นทุน',
      dataIndex: 'estimatedCost',
      width: 100,
      align: 'right' as const,
      render: (val: number) => `฿${Number(val || 0).toLocaleString()}`,
    },
    {
      title: 'Margin',
      dataIndex: 'expectedMarginPercent',
      width: 90,
      align: 'center' as const,
      render: (val: number) => {
        const percent = Number(val || 0);
        const minMargin = parseFloat(settings?.QT_MIN_MARGIN_PERCENT || '10');
        return (
          <Tag color={getMarginColor(percent)}>
            {percent.toFixed(1)}%
            {percent < minMargin && ' ⚠️'}
          </Tag>
        );
      },
    },
    {
      title: 'รวม',
      dataIndex: 'lineTotal',
      width: 120,
      align: 'right' as const,
      render: (val: number) => `฿${Number(val || 0).toLocaleString()}`,
    },
    {
      title: '',
      width: 50,
      render: (_: any, __: any, index: number) => (
        <Popconfirm title="ลบรายการนี้?" onConfirm={() => handleRemoveItem(index)}>
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24 }}>
            📝 {isEdit ? 'แก้ไขใบเสนอราคา' : 'สร้างใบเสนอราคา'}
          </h1>
          {salesOnly && (
            <Tag color="blue" style={{ marginTop: 8 }}>{getTypeLabel()}</Tag>
          )}
        </div>
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => setPreviewOpen(true)}>
            ดูตัวอย่าง
          </Button>
          {!salesOnly && (
            <Button icon={<SettingOutlined />} onClick={() => setSettingsModalOpen(true)}>
              ตั้งค่า
            </Button>
          )}
          <Button onClick={() => handleSave(false)} loading={saving}>
            <SaveOutlined /> บันทึกร่าง
          </Button>
          <Button type="primary" onClick={() => handleSave(true)} loading={saving}>
            <SendOutlined /> ส่งอนุมัติ
          </Button>
        </Space>
      </div>

      <Row gutter={24}>
        {/* Left Panel - 70% */}
        <Col xs={24} lg={17}>
          {/* General Info */}
          <Card title="ข้อมูลทั่วไป" style={{ marginBottom: 16 }}>
            <Form form={form} layout="vertical">
              <Row gutter={16}>
                {!salesOnly && (
                  <Col span={24}>
                    <Form.Item label="ประเภท" name="quotationType">
                      <Radio.Group>
                        <Radio.Button value="STANDARD">📦 ทั่วไป</Radio.Button>
                        <Radio.Button value="FORENSIC">🔬 นิติวิทยาศาสตร์</Radio.Button>
                        <Radio.Button value="MAINTENANCE">🔧 บำรุงรักษา</Radio.Button>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                )}
                {salesOnly && (
                  <Form.Item name="quotationType" hidden>
                    <Input />
                  </Form.Item>
                )}
                <Col xs={24} md={12}>
                  <Form.Item label="ลูกค้า" name="customerId" rules={[{ required: true, message: 'กรุณาเลือกลูกค้า' }]}>
                    <Select
                      showSearch
                      placeholder="เลือกลูกค้า"
                      optionFilterProp="children"
                      onChange={handleCustomerChange}
                      filterOption={(input, option) =>
                        (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                      }
                    >
                      {customers.map(c => (
                        <Option key={c.id} value={c.id}>{c.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="ผู้ติดต่อ" name="contactPerson">
                    <Input placeholder="ชื่อผู้ติดต่อ" />
                  </Form.Item>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Item label="เบอร์โทร" name="contactPhone">
                    <Input placeholder="เบอร์โทรผู้ติดต่อ" />
                  </Form.Item>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Item label="อีเมล" name="contactEmail">
                    <Input placeholder="อีเมลผู้ติดต่อ" />
                  </Form.Item>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Item label="วันที่" name="docDate" rules={[{ required: true }]}>
                    <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                  </Form.Item>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Item label="ยืนราคา (วัน)" name="validDays">
                    <InputNumber min={1} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Item label="กำหนดส่ง (วัน)" name="deliveryDays">
                    <InputNumber min={1} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Item label="เครดิต (วัน)" name="creditTermDays">
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>

          {/* Items */}
          <Card 
            title={`รายการสินค้า ${userQuotationType ? `(กลุ่ม${getTypeLabel().replace(/[📦🔬🔧]/g, '').trim()})` : ''}`}
            style={{ marginBottom: 16 }}
            extra={
              <Space>
                <Button icon={<PlusOutlined />} onClick={() => setProductModalOpen(true)}>
                  เพิ่มสินค้า
                </Button>
                <Button icon={<PlusOutlined />} onClick={() => setTempProductModalOpen(true)}>
                  สินค้าชั่วคราว
                </Button>
              </Space>
            }
          >
            <Table
              columns={itemColumns}
              dataSource={items}
              rowKey="lineNo"
              pagination={false}
              size="small"
              locale={{ emptyText: 'ยังไม่มีรายการสินค้า' }}
            />
            
            {items.length > 0 && summary.requiresApproval && (
              <div style={{ marginTop: 16, padding: 12, background: '#fff7e6', borderRadius: 8, border: '1px solid #ffe58f' }}>
                ⚠️ มีรายการที่ Margin ต่ำกว่า {settings?.QT_MIN_MARGIN_PERCENT || 10}% ต้องขออนุมัติพิเศษ
              </div>
            )}
          </Card>

          {/* Summary */}
          <Card title="สรุปยอด" style={{ marginBottom: 16 }}>
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form form={form}>
                  <div style={{ 
                    padding: 16, 
                    background: 'rgba(255,255,255,0.1)', 
                    borderRadius: 8, 
                    marginBottom: 16,
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}>
                    <div style={{ fontWeight: 500, marginBottom: 12 }}>💰 ส่วนลด</div>
                    <Row gutter={12}>
                      <Col span={12}>
                        <Form.Item label="จำนวน (บาท)" name="discountAmount" style={{ marginBottom: 8 }}>
                          <InputNumber 
                            min={0} 
                            style={{ width: '100%' }}
                            formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            onChange={() => {
                              form.setFieldValue('discountPercent', 0);
                              calculateSummary();
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="หรือ %" name="discountPercent" style={{ marginBottom: 8 }}>
                          <InputNumber 
                            min={0} 
                            max={100} 
                            style={{ width: '100%' }}
                            onChange={() => {
                              form.setFieldValue('discountAmount', 0);
                              calculateSummary();
                            }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item label="แสดงในเอกสาร" name="discountDisplayMode" style={{ marginBottom: 0 }}>
                      <Radio.Group>
                        <Radio value="SHOW">แสดงแยกบรรทัด</Radio>
                        <Radio value="HIDE">รวมในราคา (ซ่อน)</Radio>
                        <Radio value="NONE">ไม่มีส่วนลด</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </div>
                </Form>
              </Col>
              <Col xs={24} md={12}>
                <div style={{ fontSize: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span>รวมสินค้า:</span>
                    <span>฿{summary.subtotal.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
                  </div>
                  {summary.discountAmount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#f5222d' }}>
                      <span>ส่วนลด:</span>
                      <span>-฿{summary.discountAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span>หลังส่วนลด:</span>
                    <span>฿{summary.afterDiscount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span>VAT 7%:</span>
                    <span>฿{summary.taxAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <Divider style={{ margin: '12px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: 18 }}>
                    <span>ยอดสุทธิ:</span>
                    <span>฿{summary.grandTotal.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <Divider style={{ margin: '12px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#888' }}>
                    <span>ต้นทุนรวม:</span>
                    <span>฿{summary.totalCost.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Margin:</span>
                    <Tag color={items.length > 0 ? getMarginColor(summary.marginPercent) : 'default'}>
                      {summary.marginPercent.toFixed(1)}% (฿{summary.marginAmount.toLocaleString()})
                      {items.length > 0 && summary.requiresApproval && ' ⚠️'}
                    </Tag>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Notes */}
          <Card title="หมายเหตุ">
            <Form form={form}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="หมายเหตุสาธารณะ (แสดงในเอกสาร)" name="publicNote">
                    <TextArea rows={3} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="หมายเหตุภายใน" name="internalNote">
                    <TextArea rows={3} />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>

        {/* Right Panel - 30% */}
        <Col xs={24} lg={7}>
          {/* Image Gallery */}
          <ImageGallery 
            images={images} 
            onChange={setImages}
            onPasteHint={true}
          />

          {/* Quick Calculator */}
          <Card 
            title="🧮 เครื่องคิดเลขด่วน" 
            style={{ marginTop: 16 }}
            extra={
              <Button 
                type="link" 
                icon={<CalculatorOutlined />}
                onClick={() => setCalculatorOpen(true)}
              >
                ขยาย
              </Button>
            }
          >
            <div style={{ color: '#888', textAlign: 'center', padding: 20 }}>
              คลิก "ขยาย" เพื่อใช้งาน<br/>
              วางรายการเพื่อคำนวณต้นทุนเบื้องต้น
            </div>
          </Card>
        </Col>
      </Row>

      {/* Product Selection Modal */}
      <Modal
        title={`เลือกสินค้า ${userQuotationType ? `(กลุ่ม${getTypeLabel().replace(/[📦🔬🔧]/g, '').trim()})` : ''}`}
        open={productModalOpen}
        onCancel={() => setProductModalOpen(false)}
        footer={null}
        width={800}
      >
        <Input.Search
          placeholder="ค้นหาสินค้า..."
          style={{ marginBottom: 16 }}
        />
        <Table
          dataSource={products}
          rowKey="id"
          size="small"
          pagination={{ pageSize: 10 }}
          onRow={(record) => ({
            onClick: () => handleAddProduct(record),
            style: { cursor: 'pointer' },
          })}
          columns={[
            { title: 'รหัส', dataIndex: 'code', width: 100 },
            { title: 'ชื่อสินค้า', dataIndex: 'name' },
            { title: 'ราคา', dataIndex: 'sellingPrice', width: 120, 
              render: (v: number) => `฿${Number(v || 0).toLocaleString()}` },
          ]}
          locale={{ emptyText: 'ยังไม่มีสินค้าในกลุ่มนี้' }}
        />
      </Modal>

      {/* Temp Product Modal */}
      <TempProductModal
        open={tempProductModalOpen}
        onClose={() => setTempProductModalOpen(false)}
        onAdd={handleAddTempProduct}
      />

      {/* Settings Modal */}
      <SettingsModal
        open={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        onSave={() => {
          loadInitialData();
          setSettingsModalOpen(false);
        }}
      />

      {/* Quick Calculator Modal */}
      <QuickCalculator
        open={calculatorOpen}
        onClose={() => setCalculatorOpen(false)}
        onAddItems={(calcItems) => {
          const newItems = calcItems.map((item, index) => ({
            lineNo: items.length + index + 1,
            sourceType: 'TEMP' as SourceType,
            itemCode: `CALC-${Date.now()}-${index}`,
            itemName: item.name,
            qty: item.qty,
            unit: 'ea',
            unitPrice: item.price,
            estimatedCost: 0,
            expectedMarginPercent: 100,
            lineTotal: item.total,
            itemStatus: 'PENDING' as const,
          }));
          setItems([...items, ...newItems]);
          setCalculatorOpen(false);
        }}
      />

      {/* Preview Modal */}
      <QuotationPrintPreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        quotation={{
          docFullNo: form.getFieldValue('docFullNo'),
          docDate: form.getFieldValue('docDate')?.format('YYYY-MM-DD'),
          validDays: form.getFieldValue('validDays'),
          deliveryDays: form.getFieldValue('deliveryDays'),
          creditTermDays: form.getFieldValue('creditTermDays'),
          customerName: selectedCustomer?.name,
          customerAddress: selectedCustomer?.address,
          contactPerson: form.getFieldValue('contactPerson'),
          contactPhone: form.getFieldValue('contactPhone'),
          contactEmail: form.getFieldValue('contactEmail'),
          publicNote: form.getFieldValue('publicNote'),
          ...summary,
        }}
        items={items}
        customer={selectedCustomer}
      />
    </div>
  );
};

export default QuotationForm;
