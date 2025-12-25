import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card, Form, Input, Select, DatePicker, InputNumber, Button, Space, Row, Col, Checkbox,
  Table, Tag, message, Modal, Divider, Radio, Popconfirm, Alert, Tooltip
} from 'antd';
import {
  SaveOutlined, SendOutlined, PlusOutlined, DeleteOutlined,
  SettingOutlined, CalculatorOutlined, EyeOutlined, FilterOutlined,
  CheckCircleOutlined, HistoryOutlined, SearchOutlined, EditOutlined, WarningOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { quotationsApi, customersApi, productsApi, systemSettingsApi, unitsApi } from '../../services/api';
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
  const [categories, setCategories] = useState<any[]>([]);
  const [units, setUnits] = useState<string[]>([]);
  const [priceHistory, setPriceHistory] = useState<Record<number, any>>({});
  const [settings, setSettings] = useState<any>({});
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  // Customer Modal States
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [customerSearchText, setCustomerSearchText] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [customerEditMode, setCustomerEditMode] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [savingCustomer, setSavingCustomer] = useState(false);

  // Product Modal States
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<number | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  // Other Modals
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [tempProductModalOpen, setTempProductModalOpen] = useState(false);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editItemModalOpen, setEditItemModalOpen] = useState(false);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [editItemForm] = Form.useForm();
  const [editShowCustomUnit, setEditShowCustomUnit] = useState(false);

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

  useEffect(() => { loadInitialData(); }, []);
  useEffect(() => { if (isEdit && id) loadQuotation(parseInt(id)); }, [id, isEdit]);
  useEffect(() => { calculateSummary(); }, [items]);

  // Handle paste from clipboard for images
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const clipItems = e.clipboardData?.items;
      if (!clipItems) return;
      for (let i = 0; i < clipItems.length; i++) {
        if (clipItems[i].type.indexOf('image') !== -1) {
          const blob = clipItems[i].getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = (event) => {
              const base64 = event.target?.result as string;
              if (base64) addImageFromClipboard(base64);
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
      const [customersRes, productsRes, categoriesRes, unitsRes] = await Promise.all([
        customersApi.getAll(),
        userQuotationType ? productsApi.getAll(undefined, userQuotationType) : productsApi.getAll(),
        productsApi.getCategories(),
        unitsApi.getAll(),
      ]);
      setCustomers(customersRes.data || []);
      setProducts(productsRes.data || []);
      setCategories(categoriesRes.data || []);
      setUnits(unitsRes.data || ['ea', 'set', 'box', 'pack', 'unit']);
      
      // Load price history (non-blocking)
      try {
        const priceHistoryRes = await productsApi.getPriceHistory();
        setPriceHistory(priceHistoryRes.data || {});
      } catch (e) {
        console.log('Price history not available');
      }
      
      let settingsMap: any = {};
      try {
        const settingsRes = await systemSettingsApi.getAll('QUOTATION');
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
          validDays: parseInt(settingsMap.QT_VALID_DAYS) || 30,
          deliveryDays: parseInt(settingsMap.QT_DELIVERY_DAYS) || 120,
          creditTermDays: parseInt(settingsMap.QT_CREDIT_TERM_DAYS) || 30,
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

    setSummary({ subtotal, discountAmount, afterDiscount, taxAmount, grandTotal, totalCost, marginAmount, marginPercent, requiresApproval });
  };

  // Customer Modal Functions
  const openCustomerModal = () => {
    setCustomerSearchText('');
    setSelectedCustomerId(selectedCustomer?.id || null);
    setCustomerEditMode(false);
    setEditingCustomer(null);
    setCustomerModalOpen(true);
  };

  const handleSelectCustomer = () => {
    if (!selectedCustomerId) {
      message.warning('กรุณาเลือกลูกค้า');
      return;
    }
    const customer = customers.find(c => c.id === selectedCustomerId);
    if (customer) {
      setSelectedCustomer(customer);
      form.setFieldsValue({
        customerId: customer.id,
        customerName: customer.name,
        customerAddress: customer.address,
        contactPerson: customer.contactPerson || '',
        contactPhone: customer.contactPhone || customer.phone || '',
        contactEmail: customer.contactEmail || customer.email || '',
        creditTermDays: customer.creditTermDays || 30,
      });
      setCustomerModalOpen(false);
      setCustomerSearchText('');
    }
  };

  const openCustomerEdit = (customer: any) => {
    setEditingCustomer({
      id: customer.id,
      taxId: customer.taxId || '',
      phone: customer.phone || '',
      email: customer.email || '',
      address: customer.address || '',
      contactPerson: customer.contactPerson || '',
      contactPhone: customer.contactPhone || '',
      contactEmail: customer.contactEmail || '',
    });
    setCustomerEditMode(true);
  };

  const handleSaveCustomerEdit = async () => {
    if (!editingCustomer) return;
    
    setSavingCustomer(true);
    try {
      await customersApi.update(editingCustomer.id, {
        taxId: editingCustomer.taxId,
        phone: editingCustomer.phone,
        email: editingCustomer.email,
        address: editingCustomer.address,
        contactPerson: editingCustomer.contactPerson,
        contactPhone: editingCustomer.contactPhone,
        contactEmail: editingCustomer.contactEmail,
      });
      
      // Update local customers list
      const updatedCustomers = customers.map(c => 
        c.id === editingCustomer.id 
          ? { ...c, ...editingCustomer }
          : c
      );
      setCustomers(updatedCustomers);
      
      // Update selected customer if same
      if (selectedCustomer?.id === editingCustomer.id) {
        setSelectedCustomer({ ...selectedCustomer, ...editingCustomer });
      }
      
      message.success('บันทึกข้อมูลลูกค้าสำเร็จ');
      setCustomerEditMode(false);
      setEditingCustomer(null);
    } catch (error: any) {
      message.error(error.response?.data?.message || 'ไม่สามารถบันทึกได้');
    } finally {
      setSavingCustomer(false);
    }
  };

  const isCustomerInfoIncomplete = (customer: any) => {
    return !customer.phone && !customer.email && !customer.address;
  };

  const filteredCustomers = customers.filter(c =>
    c.name?.toLowerCase().includes(customerSearchText.toLowerCase()) ||
    c.phone?.toLowerCase().includes(customerSearchText.toLowerCase()) ||
    c.email?.toLowerCase().includes(customerSearchText.toLowerCase()) ||
    c.code?.toLowerCase().includes(customerSearchText.toLowerCase())
  );

  // Add single product
  const handleAddProduct = (product: any) => {
    const existingIndex = items.findIndex(item => item.sourceType === 'MASTER' && item.productId === product.id);

    if (existingIndex >= 0) {
      const newItems = [...items];
      newItems[existingIndex].qty += 1;
      newItems[existingIndex].lineTotal = newItems[existingIndex].qty * newItems[existingIndex].unitPrice;
      setItems(newItems);
      message.success(`เพิ่มจำนวน ${product.name}`);
    } else {
      const cost = product.standardCost || product.cost || 0;
      const price = product.sellingPrice || 0;
      const newItem: QuotationItem = {
        lineNo: items.length + 1,
        sourceType: 'MASTER',
        productId: product.id,
        itemCode: product.code,
        itemName: product.name,
        itemDescription: product.description,
        brand: product.brand,
        qty: 1,
        unit: product.unit?.name || product.unit || 'EA',
        unitPrice: price,
        estimatedCost: cost,
        expectedMarginPercent: price > 0 ? ((price - cost) / price) * 100 : 0,
        lineTotal: price,
        itemStatus: 'PENDING',
      };
      setItems([...items, newItem]);
      message.success(`เพิ่ม ${product.name}`);
    }
  };

  // Add multiple selected products
  const handleAddSelectedProducts = () => {
    const productsToAdd = products.filter(p => selectedProducts.includes(p.id));
    const newItems: QuotationItem[] = [];
    
    productsToAdd.forEach(product => {
      const existingIndex = items.findIndex(item => item.sourceType === 'MASTER' && item.productId === product.id);
      if (existingIndex < 0) {
        const cost = product.standardCost || product.cost || 0;
        const price = product.sellingPrice || 0;
        newItems.push({
          lineNo: items.length + newItems.length + 1,
          sourceType: 'MASTER',
          productId: product.id,
          itemCode: product.code,
          itemName: product.name,
          itemDescription: product.description,
          brand: product.brand,
          qty: 1,
          unit: product.unit?.name || product.unit || 'EA',
          unitPrice: price,
          estimatedCost: cost,
          expectedMarginPercent: price > 0 ? ((price - cost) / price) * 100 : 0,
          lineTotal: price,
          itemStatus: 'PENDING',
        });
      }
    });

    if (newItems.length > 0) {
      setItems([...items, ...newItems]);
      message.success(`เพิ่ม ${newItems.length} รายการ`);
    }
    setSelectedProducts([]);
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
      unit: tempProduct.unit || 'EA',
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

  const handleEditItem = (index: number) => {
    const item = items[index];
    const isCustomUnit = units.length > 0 && !units.includes(item.unit || '');
    
    editItemForm.setFieldsValue({
      itemCode: item.itemCode,
      itemName: item.itemName,
      itemDescription: item.itemDescription,
      brand: item.brand,
      qty: item.qty,
      unit: isCustomUnit ? 'other' : item.unit,
      customUnit: isCustomUnit ? item.unit : undefined,
      unitPrice: item.unitPrice,
      estimatedCost: item.estimatedCost,
    });
    setEditShowCustomUnit(isCustomUnit);
    setEditingItemIndex(index);
    setEditItemModalOpen(true);
  };

  const handleSaveEditItem = async () => {
    if (editingItemIndex === null) return;
    const values = editItemForm.getFieldsValue();
    const newItems = [...items];
    const item = newItems[editingItemIndex];
    
    let finalUnit = values.unit;
    if (values.unit === 'other' && values.customUnit) {
      finalUnit = values.customUnit;
      // Create new unit in backend
      try {
        await unitsApi.create({ name: values.customUnit });
        const unitsRes = await unitsApi.getAll();
        setUnits(unitsRes.data || []);
      } catch (e) {
        // Unit might already exist, ignore error
      }
    }
    
    item.itemCode = values.itemCode;
    item.itemName = values.itemName;
    item.itemDescription = values.itemDescription;
    item.brand = values.brand;
    item.qty = values.qty || 1;
    item.unit = finalUnit;
    item.unitPrice = values.unitPrice || 0;
    item.estimatedCost = values.estimatedCost || 0;
    
    const netPrice = item.unitPrice - (item.discountAmount || 0);
    item.lineTotal = item.qty * netPrice;
    item.expectedMarginPercent = netPrice > 0 ? ((netPrice - item.estimatedCost) / netPrice) * 100 : 0;
    
    setItems(newItems);
    setEditItemModalOpen(false);
    setEditingItemIndex(null);
    setEditShowCustomUnit(false);
    editItemForm.resetFields();
    message.success('แก้ไขรายการสำเร็จ');
  };

  const handleEditUnitChange = (value: string) => {
    setEditShowCustomUnit(value === 'other');
    if (value !== 'other') {
      editItemForm.setFieldValue('customUnit', undefined);
    }
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;

    if (['qty', 'unitPrice', 'discountAmount'].includes(field)) {
      const item = newItems[index];
      const netPrice = item.unitPrice - (item.discountAmount || 0);
      item.lineTotal = item.qty * netPrice;
      item.expectedMarginPercent = netPrice > 0 ? ((netPrice - item.estimatedCost) / netPrice) * 100 : 0;
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
        customerName: selectedCustomer?.name,
        customerAddress: selectedCustomer?.address,
        ...values,
        docDate: values.docDate?.format('YYYY-MM-DD'),
        validUntil: values.validUntil?.format('YYYY-MM-DD'),
        items: items.map((item, index) => ({ ...item, lineNo: index + 1 })),
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
      STANDARD: '🧪 Accustandard/PT',
      FORENSIC: '🔬 นิติวิทยาศาสตร์',
      MAINTENANCE: '🔧 บำรุงรักษา',
      LAB: '🏭 เครื่องมือวิทยาศาสตร์',
    };
    return labels[type] || type;
  };

  // Filter products for modal
  const filteredModalProducts = products.filter(p => {
    const matchSearch = !productSearch || 
      p.code?.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.name?.toLowerCase().includes(productSearch.toLowerCase());
    const matchCategory = productCategoryFilter === null || p.categoryId === productCategoryFilter;
    return matchSearch && matchCategory;
  });

  const itemColumns = [
    { title: '#', dataIndex: 'lineNo', width: 50, align: 'center' as const },
    {
      title: 'สินค้า',
      dataIndex: 'itemName',
      render: (text: string, record: QuotationItem) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            {record.sourceType === 'TEMP' && <Tag color="orange">ชั่วคราว</Tag>}
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
        <InputNumber min={1} value={val} onChange={(v) => handleItemChange(index, 'qty', v || 1)} style={{ width: '100%' }} />
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
      width: 110,
      align: 'right' as const,
      render: (val: number) => (
        <span style={{ color: val > 0 ? '#22c55e' : '#6b7280' }}>
          ฿{Number(val || 0).toLocaleString()}
        </span>
      ),
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
      width: 90,
      render: (_: any, __: QuotationItem, index: number) => (
        <Space size="small">
          <Tooltip title="แก้ไข">
            <Button type="text" icon={<EditOutlined />} onClick={() => handleEditItem(index)} />
          </Tooltip>
          <Popconfirm title="ลบรายการนี้?" onConfirm={() => handleRemoveItem(index)}>
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Product Modal Columns with Price History
  const productModalColumns = [
    { title: 'รหัส', dataIndex: 'code', width: 100 },
    { title: 'ชื่อสินค้า', dataIndex: 'name', ellipsis: true },
    { 
      title: 'หมวดหมู่', 
      dataIndex: 'categoryId', 
      width: 100,
      render: (categoryId: number) => {
        const cat = categories.find(c => c.id === categoryId);
        return cat ? <Tag color="blue">{cat.name}</Tag> : '-';
      }
    },
    { 
      title: 'ต้นทุน', 
      dataIndex: 'standardCost', 
      width: 90, 
      align: 'right' as const,
      render: (v: number) => (
        <span style={{ color: v > 0 ? '#22c55e' : '#6b7280' }}>
          ฿{Number(v || 0).toLocaleString()}
        </span>
      )
    },
    { 
      title: 'ราคาขาย', 
      dataIndex: 'sellingPrice', 
      width: 90, 
      align: 'right' as const,
      render: (v: number) => `฿${Number(v || 0).toLocaleString()}` 
    },
    {
      title: '📈 ประวัติ',
      dataIndex: 'id',
      width: 110,
      align: 'center' as const,
      render: (productId: number) => {
        const history = priceHistory[productId];
        if (!history || history.salesCount === 0) {
          return <span style={{ color: '#6b7280', fontSize: 12 }}>ยังไม่มี</span>;
        }
        
        const tooltipContent = (
          <div style={{ minWidth: 180 }}>
            <div style={{ fontWeight: 'bold', marginBottom: 8, borderBottom: '1px solid #444', paddingBottom: 4 }}>
              📈 ประวัติราคาขาย
            </div>
            <div style={{ marginBottom: 4 }}>
              <span style={{ color: '#888' }}>ขายแล้ว:</span> <strong>{history.salesCount} ครั้ง</strong>
            </div>
            <div style={{ marginBottom: 4 }}>
              <span style={{ color: '#888' }}>ราคาต่ำสุด:</span> ฿{history.minPrice?.toLocaleString()}
            </div>
            <div style={{ marginBottom: 4 }}>
              <span style={{ color: '#888' }}>ราคาสูงสุด:</span> ฿{history.maxPrice?.toLocaleString()}
            </div>
            <div style={{ marginBottom: 8 }}>
              <span style={{ color: '#888' }}>ราคาเฉลี่ย:</span> <span style={{ color: '#22d3ee' }}>฿{history.avgPrice?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            {history.yearlyData && history.yearlyData.length > 0 && (
              <>
                <div style={{ fontWeight: 500, marginBottom: 4, borderTop: '1px solid #444', paddingTop: 4 }}>แยกตามปี:</div>
                {history.yearlyData.slice(0, 3).map((y: any) => (
                  <div key={y.year} style={{ fontSize: 11, color: '#aaa' }}>
                    {y.year + 543}: ฿{y.minPrice?.toLocaleString()}-{y.maxPrice?.toLocaleString()} ({y.salesCount}x)
                  </div>
                ))}
              </>
            )}
          </div>
        );
        
        return (
          <Tooltip title={tooltipContent} placement="left" color="#1f2937">
            <Tag 
              color="cyan" 
              style={{ cursor: 'pointer', borderRadius: 8 }}
              icon={<HistoryOutlined />}
            >
              {history.salesCount}x
            </Tag>
          </Tooltip>
        );
      }
    },
    {
      title: '',
      width: 50,
      render: (_: any, record: any) => (
        <Button 
          type="primary" 
          size="small" 
          icon={<PlusOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            handleAddProduct(record);
          }}
        />
      ),
    },
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24 }}>📝 {isEdit ? 'แก้ไขใบเสนอราคา' : 'สร้างใบเสนอราคา'}</h1>
          {salesOnly && <Tag color="blue" style={{ marginTop: 8 }}>{getTypeLabel()}</Tag>}
        </div>
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => setPreviewOpen(true)}>ดูตัวอย่าง</Button>
          {!salesOnly && <Button icon={<SettingOutlined />} onClick={() => setSettingsModalOpen(true)}>ตั้งค่า</Button>}
          <Button onClick={() => handleSave(false)} loading={saving}><SaveOutlined /> บันทึกร่าง</Button>
          <Button type="primary" onClick={() => handleSave(true)} loading={saving}><SendOutlined /> ส่งอนุมัติ</Button>
        </Space>
      </div>

      <Row gutter={24}>
        <Col xs={24} lg={17}>
          {/* General Info */}
          <Card title="ข้อมูลทั่วไป" style={{ marginBottom: 16 }}>
            <Form form={form} layout="vertical">
              <Row gutter={16}>
                {!salesOnly && (
                  <Col span={24}>
                    <Form.Item label="ประเภท" name="quotationType">
                      <Radio.Group>
                        <Radio.Button value="STANDARD">🧪 Accustandard/PT</Radio.Button>
                        <Radio.Button value="FORENSIC">🔬 นิติวิทยาศาสตร์</Radio.Button>
                        <Radio.Button value="MAINTENANCE">🔧 บำรุงรักษา</Radio.Button>
                        <Radio.Button value="LAB">🏭 เครื่องมือวิทยาศาสตร์</Radio.Button>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                )}
                {salesOnly && <Form.Item name="quotationType" hidden><Input /></Form.Item>}
                <Col xs={24} md={12}>
                  <Form.Item label="ลูกค้า" required>
                    <Input.Group compact style={{ display: 'flex' }}>
                      <Input 
                        style={{ flex: 1 }} 
                        value={selectedCustomer?.name || ''} 
                        placeholder="คลิกเพื่อเลือกลูกค้า" 
                        readOnly 
                        onClick={openCustomerModal}
                      />
                      <Button icon={<SearchOutlined />} onClick={openCustomerModal}>เลือก</Button>
                    </Input.Group>
                    <Form.Item name="customerId" hidden rules={[{ required: true, message: 'กรุณาเลือกลูกค้า' }]}>
                      <Input />
                    </Form.Item>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}><Form.Item label="ผู้ติดต่อ" name="contactPerson"><Input placeholder="ชื่อผู้ติดต่อ" /></Form.Item></Col>
                <Col xs={12} md={6}><Form.Item label="เบอร์โทร" name="contactPhone"><Input placeholder="เบอร์โทรผู้ติดต่อ" /></Form.Item></Col>
                <Col xs={12} md={6}><Form.Item label="อีเมล" name="contactEmail"><Input placeholder="อีเมลผู้ติดต่อ" /></Form.Item></Col>
                <Col xs={12} md={6}><Form.Item label="วันที่" name="docDate" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" /></Form.Item></Col>
                <Col xs={12} md={6}><Form.Item label="ยืนราคา (วัน)" name="validDays"><InputNumber min={1} style={{ width: '100%' }} /></Form.Item></Col>
                <Col xs={12} md={6}><Form.Item label="กำหนดส่ง (วัน)" name="deliveryDays"><InputNumber min={1} style={{ width: '100%' }} /></Form.Item></Col>
                <Col xs={12} md={6}><Form.Item label="เครดิต (วัน)" name="creditTermDays"><InputNumber min={0} style={{ width: '100%' }} /></Form.Item></Col>
              </Row>
            </Form>
          </Card>

          {/* Items */}
          <Card 
            title={`รายการสินค้า ${userQuotationType ? `(กลุ่ม${getTypeLabel().replace(/[📦🔬🔧🏭]/g, '').trim()})` : ''}`}
            style={{ marginBottom: 16 }}
            extra={
              <Space>
                <Button icon={<PlusOutlined />} onClick={() => { setProductModalOpen(true); setSelectedProducts([]); }}>เพิ่มสินค้า</Button>
                <Button icon={<PlusOutlined />} onClick={() => setTempProductModalOpen(true)}>สินค้าชั่วคราว</Button>
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
              expandable={{
                expandedRowRender: (record: QuotationItem, index: number) => (
                  <div style={{ padding: '12px 0' }}>
                    <div style={{ marginBottom: 8, fontWeight: 500 }}>
                      <Checkbox checked={!!record.itemDescription} onChange={(e) => { if (!e.target.checked) handleItemChange(index, 'itemDescription', ''); }}>
                        เพิ่มรายละเอียด
                      </Checkbox>
                    </div>
                    <Input.TextArea
                      rows={6}
                      value={record.itemDescription || ''}
                      onChange={(e) => handleItemChange(index, 'itemDescription', e.target.value)}
                      placeholder="ใส่รายละเอียดเพิ่มเติม..."
                      style={{ fontFamily: 'monospace', background: 'rgba(0,0,0,0.02)' }}
                    />
                  </div>
                ),
                rowExpandable: () => true,
              }}
            />
            
            {/* Fixed Warning Style */}
            {items.length > 0 && summary.requiresApproval && (
              <Alert
                message={`⚠️ มีรายการที่ Margin ต่ำกว่า ${settings?.QT_MIN_MARGIN_PERCENT || 10}% ต้องขออนุมัติพิเศษ`}
                type="warning"
                showIcon
                style={{ marginTop: 16 }}
              />
            )}
          </Card>

          {/* Summary */}
          <Card title="สรุปยอด" style={{ marginBottom: 16 }}>
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form form={form}>
                  <div style={{ padding: 16, background: 'rgba(255,255,255,0.1)', borderRadius: 8, marginBottom: 16, border: '1px solid rgba(255,255,255,0.2)' }}>
                    <div style={{ fontWeight: 500, marginBottom: 12 }}>💰 ส่วนลด</div>
                    <Row gutter={12}>
                      <Col span={12}>
                        <Form.Item label="จำนวน (บาท)" name="discountAmount" style={{ marginBottom: 8 }}>
                          <InputNumber min={0} style={{ width: '100%' }} formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            onChange={() => { form.setFieldValue('discountPercent', 0); calculateSummary(); }} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="หรือ %" name="discountPercent" style={{ marginBottom: 8 }}>
                          <InputNumber min={0} max={100} style={{ width: '100%' }}
                            onChange={() => { form.setFieldValue('discountAmount', 0); calculateSummary(); }} />
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span>รวมสินค้า:</span><span>฿{summary.subtotal.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span></div>
                  {summary.discountAmount > 0 && (<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#f5222d' }}><span>ส่วนลด:</span><span>-฿{summary.discountAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span></div>)}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span>หลังส่วนลด:</span><span>฿{summary.afterDiscount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span>VAT 7%:</span><span>฿{summary.taxAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span></div>
                  <Divider style={{ margin: '12px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: 18 }}><span>ยอดสุทธิ:</span><span>฿{summary.grandTotal.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span></div>
                  <Divider style={{ margin: '12px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#22c55e' }}><span>ต้นทุนรวม:</span><span>฿{summary.totalCost.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Margin:</span><Tag color={items.length > 0 ? getMarginColor(summary.marginPercent) : 'default'}>{summary.marginPercent.toFixed(1)}% (฿{summary.marginAmount.toLocaleString()}){items.length > 0 && summary.requiresApproval && ' ⚠️'}</Tag></div>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Project Header */}
          <Card title="📋 หัวข้อโครงการ (แสดงในใบเสนอราคา)" style={{ marginBottom: 16 }}>
            <Form form={form}>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item name="hasProjectHeader" valuePropName="checked">
                    <Checkbox onChange={(e) => form.setFieldsValue({ hasProjectHeader: e.target.checked })}>
                      เปิดใช้หัวข้อโครงการ
                    </Checkbox>
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item noStyle shouldUpdate={(prev, cur) => prev.hasProjectHeader !== cur.hasProjectHeader}>
                {({ getFieldValue }) => getFieldValue('hasProjectHeader') && (
                  <>
                    <Row gutter={16}>
                      <Col span={24}>
                        <Form.Item label="ชื่อโครงการ" name="projectName">
                          <Input placeholder="เช่น โครงการพัฒนาระบบวิเคราะห์โปรไฟล์ยาเสพติด" />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item label="รายละเอียดเพิ่มเติม" name="projectDescription">
                          <TextArea rows={2} placeholder="เช่น ประกอบด้วย" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="รูปแบบการแสดง" name="projectDisplayMode">
                          <Select defaultValue="MODE_1">
                            <Select.Option value="MODE_1">แบบ 1: แสดงลำดับ + "โครงการ" + ยอดรวม</Select.Option>
                            <Select.Option value="MODE_2">แบบ 2: แสดงลำดับ + "โครงการ" (ไม่แสดงยอด)</Select.Option>
                            <Select.Option value="MODE_3">แบบ 3: แสดงเฉพาะชื่อโครงการ</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  </>
                )}
              </Form.Item>
            </Form>
          </Card>

          {/* Notes */}
          <Card title="หมายเหตุ">
            <Form form={form}>
              <Row gutter={16}>
                <Col span={12}><Form.Item label="หมายเหตุสาธารณะ (แสดงในเอกสาร)" name="publicNote"><TextArea rows={3} /></Form.Item></Col>
                <Col span={12}><Form.Item label="หมายเหตุภายใน" name="internalNote"><TextArea rows={3} /></Form.Item></Col>
              </Row>
            </Form>
          </Card>
        </Col>

        {/* Right Panel */}
        <Col xs={24} lg={7}>
          <ImageGallery images={images} onChange={setImages} onPasteHint={true} />
          <Card title="🧮 เครื่องคิดเลขด่วน" style={{ marginTop: 16 }} extra={<Button type="link" icon={<CalculatorOutlined />} onClick={() => setCalculatorOpen(true)}>ขยาย</Button>}>
            <div style={{ color: '#888', textAlign: 'center', padding: 20 }}>คลิก "ขยาย" เพื่อใช้งาน<br/>วางรายการเพื่อคำนวณต้นทุนเบื้องต้น</div>
          </Card>
        </Col>
      </Row>

      {/* ========== IMPROVED PRODUCT SELECTION MODAL ========== */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>📦 เลือกสินค้า</span>
            {userQuotationType && <Tag color="blue">{getTypeLabel()}</Tag>}
          </div>
        }
        open={productModalOpen}
        onCancel={() => { setProductModalOpen(false); setSelectedProducts([]); }}
        width={900}
        footer={
          selectedProducts.length > 0 ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#22c55e' }}>
                <CheckCircleOutlined /> เลือกแล้ว {selectedProducts.length} รายการ
              </span>
              <Space>
                <Button onClick={() => setSelectedProducts([])}>ล้างการเลือก</Button>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddSelectedProducts}>
                  เพิ่มทั้งหมด ({selectedProducts.length})
                </Button>
              </Space>
            </div>
          ) : null
        }
      >
        {/* Search & Filter */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <Input.Search
            placeholder="🔍 ค้นหาสินค้า..."
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            style={{ flex: 1 }}
            allowClear
          />
          <Select
            placeholder="หมวดหมู่"
            value={productCategoryFilter}
            onChange={setProductCategoryFilter}
            style={{ width: 200 }}
            allowClear
            suffixIcon={<FilterOutlined />}
          >
            <Option value={null}>📦 ทั้งหมด ({products.length})</Option>
            {categories.map(cat => (
              <Option key={cat.id} value={cat.id}>
                🏷️ {cat.name} ({products.filter(p => p.categoryId === cat.id).length})
              </Option>
            ))}
          </Select>
        </div>

        {/* Filter Status */}
        {(productSearch || productCategoryFilter !== null) && (
          <div style={{ marginBottom: 12, padding: '8px 12px', background: 'rgba(34, 211, 238, 0.1)', borderRadius: 8 }}>
            <span style={{ color: '#22d3ee' }}>
              🔍 แสดง {filteredModalProducts.length} รายการ
              {productCategoryFilter !== null && ` | หมวด: ${categories.find(c => c.id === productCategoryFilter)?.name}`}
              {productSearch && ` | ค้นหา: "${productSearch}"`}
            </span>
            <Button type="link" size="small" onClick={() => { setProductSearch(''); setProductCategoryFilter(null); }} style={{ float: 'right', color: '#f87171' }}>
              ล้างตัวกรอง
            </Button>
          </div>
        )}

        <Table
          dataSource={filteredModalProducts}
          rowKey="id"
          size="small"
          pagination={{ pageSize: 8, showTotal: (total) => `ทั้งหมด ${total} รายการ` }}
          columns={productModalColumns}
          rowSelection={{
            selectedRowKeys: selectedProducts,
            onChange: (keys) => setSelectedProducts(keys as number[]),
          }}
          onRow={(record) => ({
            onClick: () => {
              const newSelected = selectedProducts.includes(record.id)
                ? selectedProducts.filter(id => id !== record.id)
                : [...selectedProducts, record.id];
              setSelectedProducts(newSelected);
            },
            style: { cursor: 'pointer' },
          })}
          locale={{ emptyText: 'ไม่พบสินค้า' }}
        />
      </Modal>

      {/* Other Modals */}
      <TempProductModal open={tempProductModalOpen} onClose={() => setTempProductModalOpen(false)} onAdd={handleAddTempProduct} />
      <SettingsModal open={settingsModalOpen} onClose={() => setSettingsModalOpen(false)} onSave={() => { loadInitialData(); setSettingsModalOpen(false); }} />
      
      {/* Edit Item Modal */}
      <Modal
        title="✏️ แก้ไขรายการสินค้า"
        open={editItemModalOpen}
        onCancel={() => { setEditItemModalOpen(false); setEditingItemIndex(null); setEditShowCustomUnit(false); editItemForm.resetFields(); }}
        onOk={handleSaveEditItem}
        okText="บันทึก"
        cancelText="ยกเลิก"
        width={600}
      >
        <Form form={editItemForm} layout="vertical">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="รหัสสินค้า" name="itemCode">
                <Input />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item label="ชื่อสินค้า" name="itemName" rules={[{ required: true, message: 'กรุณากรอกชื่อสินค้า' }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="รายละเอียด" name="itemDescription">
            <TextArea rows={3} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="ยี่ห้อ" name="brand">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="จำนวน" name="qty" rules={[{ required: true, message: 'กรุณากรอกจำนวน' }]}>
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={editShowCustomUnit ? 4 : 8}>
              <Form.Item label="หน่วย" name="unit" rules={[{ required: true, message: 'กรุณาเลือกหน่วย' }]}>
                <Select onChange={handleEditUnitChange}>
                  {units.map(u => (
                    <Select.Option key={u} value={u}>{u}</Select.Option>
                  ))}
                  <Select.Option value="other">+ เพิ่มหน่วยใหม่...</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            {editShowCustomUnit && (
              <Col span={4}>
                <Form.Item label="ระบุหน่วย" name="customUnit" rules={[{ required: true, message: 'กรุณาระบุ' }]}>
                  <Input placeholder="เช่น งาน" />
                </Form.Item>
              </Col>
            )}
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="ราคา/หน่วย" name="unitPrice" rules={[{ required: true, message: 'กรุณากรอกราคา' }]}>
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(v) => v!.replace(/,/g, '') as any}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="ต้นทุนโดยประมาณ" name="estimatedCost">
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(v) => v!.replace(/,/g, '') as any}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

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
            unit: 'EA',
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
          discountDisplayMode: form.getFieldValue('discountDisplayMode'),
          hasProjectHeader: form.getFieldValue('hasProjectHeader'),
          projectName: form.getFieldValue('projectName'),
          projectDescription: form.getFieldValue('projectDescription'),
          projectDisplayMode: form.getFieldValue('projectDisplayMode'),
          ...summary,
        }}
        items={items}
        customer={selectedCustomer}
      />

      {/* Customer Selection Modal */}
      <Modal
        title="👤 เลือกลูกค้า"
        open={customerModalOpen}
        onCancel={() => {
          if (customerEditMode) {
            setCustomerEditMode(false);
            setEditingCustomer(null);
          } else {
            setCustomerModalOpen(false);
            setCustomerSearchText('');
          }
        }}
        onOk={customerEditMode ? handleSaveCustomerEdit : handleSelectCustomer}
        okText={customerEditMode ? "💾 บันทึก" : "✓ เลือกลูกค้า"}
        cancelText={customerEditMode ? "← กลับ" : "ยกเลิก"}
        confirmLoading={savingCustomer}
        okButtonProps={{ disabled: !customerEditMode && !selectedCustomerId }}
        width={650}
      >
        {customerEditMode && editingCustomer ? (
          // Edit Mode
          <div>
            <div style={{ marginBottom: 16, fontWeight: 500, fontSize: 16 }}>
              ✏️ แก้ไขข้อมูล: {customers.find(c => c.id === editingCustomer.id)?.name}
            </div>
            <Row gutter={[16, 12]}>
              <Col span={24}>
                <div style={{ marginBottom: 4, opacity: 0.7 }}>🏢 เลขผู้เสียภาษี</div>
                <Input 
                  value={editingCustomer.taxId} 
                  onChange={e => setEditingCustomer({...editingCustomer, taxId: e.target.value})}
                  placeholder="0105XXXXXXXXX"
                  maxLength={13}
                />
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: 4, opacity: 0.7 }}>📞 เบอร์โทร</div>
                <Input 
                  value={editingCustomer.phone} 
                  onChange={e => setEditingCustomer({...editingCustomer, phone: e.target.value})}
                  placeholder="02-xxx-xxxx"
                />
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: 4, opacity: 0.7 }}>📧 อีเมล</div>
                <Input 
                  value={editingCustomer.email} 
                  onChange={e => setEditingCustomer({...editingCustomer, email: e.target.value})}
                  placeholder="email@company.com"
                />
              </Col>
              <Col span={24}>
                <div style={{ marginBottom: 4, opacity: 0.7 }}>📍 ที่อยู่</div>
                <Input.TextArea 
                  rows={2}
                  value={editingCustomer.address} 
                  onChange={e => setEditingCustomer({...editingCustomer, address: e.target.value})}
                  placeholder="ที่อยู่บริษัท"
                />
              </Col>
              <Col span={24}>
                <Divider style={{ margin: '8px 0' }}>ผู้ติดต่อ</Divider>
              </Col>
              <Col span={8}>
                <div style={{ marginBottom: 4, opacity: 0.7 }}>👤 ชื่อผู้ติดต่อ</div>
                <Input 
                  value={editingCustomer.contactPerson} 
                  onChange={e => setEditingCustomer({...editingCustomer, contactPerson: e.target.value})}
                  placeholder="คุณ..."
                />
              </Col>
              <Col span={8}>
                <div style={{ marginBottom: 4, opacity: 0.7 }}>📞 เบอร์ผู้ติดต่อ</div>
                <Input 
                  value={editingCustomer.contactPhone} 
                  onChange={e => setEditingCustomer({...editingCustomer, contactPhone: e.target.value})}
                  placeholder="08x-xxx-xxxx"
                />
              </Col>
              <Col span={8}>
                <div style={{ marginBottom: 4, opacity: 0.7 }}>📧 อีเมลผู้ติดต่อ</div>
                <Input 
                  value={editingCustomer.contactEmail} 
                  onChange={e => setEditingCustomer({...editingCustomer, contactEmail: e.target.value})}
                  placeholder="contact@email.com"
                />
              </Col>
            </Row>
          </div>
        ) : (
          // Selection Mode
          <div>
            <div style={{ marginBottom: 12 }}>
              <p style={{ margin: 0, opacity: 0.7 }}>เลือกลูกค้าสำหรับใบเสนอราคานี้:</p>
            </div>
            
            {/* Search Box */}
            <Input
              placeholder="🔍 ค้นหาลูกค้า..."
              prefix={<SearchOutlined style={{ opacity: 0.5 }} />}
              value={customerSearchText}
              onChange={(e) => setCustomerSearchText(e.target.value)}
              allowClear
              style={{ marginBottom: 12 }}
            />
            
            {/* Customer Radio List */}
            <div style={{ 
              maxHeight: 350, 
              overflowY: 'auto', 
              border: '1px solid var(--border-color, #d9d9d9)', 
              borderRadius: 8,
              background: 'var(--bg-card, #fafafa)'
            }}>
              <Radio.Group 
                value={selectedCustomerId} 
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                style={{ width: '100%' }}
              >
                {filteredCustomers.map((customer, index, arr) => (
                  <div 
                    key={customer.id}
                    style={{ 
                      padding: '12px 16px',
                      borderBottom: index < arr.length - 1 ? '1px solid var(--border-color, #e8e8e8)' : 'none',
                      background: selectedCustomerId === customer.id ? 'rgba(124, 58, 237, 0.15)' : 'transparent',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    onClick={() => setSelectedCustomerId(customer.id)}
                  >
                    <Radio value={customer.id} style={{ width: '100%' }}>
                      <div style={{ marginLeft: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 500, fontSize: 14 }}>
                            {customer.name}
                            {selectedCustomerId === customer.id && (
                              <Tag color="purple" style={{ marginLeft: 8 }}>เลือกแล้ว</Tag>
                            )}
                            {isCustomerInfoIncomplete(customer) && (
                              <Tag color="warning" icon={<WarningOutlined />} style={{ marginLeft: 4 }}>ข้อมูลไม่ครบ</Tag>
                            )}
                          </div>
                          <div style={{ fontSize: 12, opacity: 0.65, marginTop: 4 }}>
                            {customer.phone && <span style={{ marginRight: 12 }}>📞 {customer.phone}</span>}
                            {customer.email && <span style={{ marginRight: 12 }}>📧 {customer.email}</span>}
                            {!customer.phone && !customer.email && <span style={{ color: '#faad14' }}>ยังไม่มีข้อมูลติดต่อ</span>}
                          </div>
                          {customer.address && (
                            <div style={{ fontSize: 12, opacity: 0.65, marginTop: 2 }}>
                              📍 {customer.address.length > 50 ? customer.address.substring(0, 50) + '...' : customer.address}
                            </div>
                          )}
                          {customer.creditTermDays > 0 && (
                            <div style={{ fontSize: 12, opacity: 0.65, marginTop: 2 }}>
                              💳 เครดิต {customer.creditTermDays} วัน
                            </div>
                          )}
                        </div>
                        <Button 
                          type="text" 
                          size="small" 
                          icon={<EditOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            openCustomerEdit(customer);
                          }}
                          style={{ opacity: 0.6 }}
                        >
                          แก้ไข
                        </Button>
                      </div>
                    </Radio>
                  </div>
                ))}
                {filteredCustomers.length === 0 && (
                  <div style={{ padding: 24, textAlign: 'center', opacity: 0.5 }}>
                    ไม่พบลูกค้า
                  </div>
                )}
              </Radio.Group>
            </div>

            {/* Selected Customer Contact Info */}
            {selectedCustomerId && (() => {
              const customer = customers.find(c => c.id === selectedCustomerId);
              if (!customer) return null;
              return (
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontWeight: 500, marginBottom: 8 }}>📋 ข้อมูลผู้ติดต่อ:</div>
                  <div style={{ 
                    background: 'var(--bg-card, #f5f5f5)', 
                    border: '1px solid var(--border-color, #e8e8e8)',
                    borderRadius: 8, 
                    padding: 12
                  }}>
                    <div style={{ fontSize: 13 }}>
                      <span style={{ opacity: 0.7 }}>👤 </span>
                      <strong>{customer.contactPerson || '-'}</strong>
                      {customer.contactPhone && <span style={{ marginLeft: 16, opacity: 0.7 }}>📞 {customer.contactPhone}</span>}
                      {customer.contactEmail && <span style={{ marginLeft: 16, opacity: 0.7 }}>📧 {customer.contactEmail}</span>}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default QuotationForm;
