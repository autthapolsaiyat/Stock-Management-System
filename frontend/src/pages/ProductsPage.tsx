import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Card,
  Space,
  Input,
  Modal,
  Form,
  InputNumber,
  Select,
  Tag,
  message,
  Popconfirm,
  Upload,
  Image,
} from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PictureOutlined,
  LoadingOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import { productsApi, uploadApi } from '../services/api';
import { Product, ProductCategory, Unit } from '../types';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes, unitsRes] = await Promise.all([
        productsApi.getAll(),
        productsApi.getCategories(),
        productsApi.getUnits(),
      ]);
      setProducts(productsRes.data || []);
      setCategories(categoriesRes.data || []);
      setUnits(unitsRes.data || []);
    } catch (error) {
      message.error('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingProduct(null);
    form.resetFields();
    setFileList([]);
    setModalVisible(true);
  };

  const handleEdit = (record: Product) => {
    setEditingProduct(record);
    form.setFieldsValue(record);
    if (record.imageUrl) {
      setFileList([
        {
          uid: '-1',
          name: 'product-image',
          status: 'done',
          url: record.imageUrl,
        },
      ]);
    } else {
      setFileList([]);
    }
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await productsApi.delete(id);
      message.success('ลบสินค้าสำเร็จ');
      loadData();
    } catch (error) {
      message.error('ไม่สามารถลบสินค้าได้');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setUploading(true);
      let imageUrl = null;

      if (fileList.length > 0) {
        const file = fileList[0];
        if (file.url && !file.originFileObj) {
          imageUrl = file.url;
        } else if (file.originFileObj) {
          try {
            const base64 = await getBase64(file.originFileObj as File);
            const uploadRes = await uploadApi.uploadBase64(base64, 'products');
            imageUrl = uploadRes.data.url;
            message.success('อัพโหลดรูปสำเร็จ');
          } catch (uploadError: any) {
            console.error('Upload error:', uploadError);
            message.warning('ไม่สามารถอัพโหลดรูปได้ แต่จะบันทึกข้อมูลสินค้าต่อไป');
          }
        }
      }
      
      const payload = {
        ...values,
        sellingPrice: Number(values.sellingPrice) || 0,
        standardCost: Number(values.standardCost) || 0,
        minStock: Number(values.minStock) || 0,
        maxStock: Number(values.maxStock) || 0,
        imageUrl,
      };

      if (editingProduct) {
        await productsApi.update(editingProduct.id, payload);
        message.success('แก้ไขสินค้าสำเร็จ');
      } else {
        await productsApi.create(payload);
        message.success('เพิ่มสินค้าสำเร็จ');
      }
      setModalVisible(false);
      loadData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    } finally {
      setUploading(false);
    }
  };

  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const uploadButton = (
    <div>
      {uploading ? <LoadingOutlined /> : <PictureOutlined />}
      <div style={{ marginTop: 8 }}>อัพโหลดรูป</div>
    </div>
  );

  const columns = [
    {
      title: 'รูป',
      dataIndex: 'imageUrl',
      key: 'image',
      width: 80,
      render: (url: string) => (
        url ? (
          <Image src={url} width={50} height={50} style={{ objectFit: 'cover', borderRadius: 4 }} />
        ) : (
          <div style={{ width: 50, height: 50, background: '#1f2937', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PictureOutlined style={{ color: '#6b7280' }} />
          </div>
        )
      ),
    },
    {
      title: 'รหัส',
      dataIndex: 'code',
      key: 'code',
      width: 120,
    },
    {
      title: 'ชื่อสินค้า',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'หมวดหมู่',
      dataIndex: 'categoryId',
      key: 'category',
      render: (categoryId: number) => {
        const cat = categories.find((c) => c.id === categoryId);
        return cat ? (
          <Tag color="blue" style={{ borderRadius: 8 }}>
            {cat.name}
          </Tag>
        ) : (
          <Tag color="default">-</Tag>
        );
      },
    },
    {
      title: 'หน่วย',
      dataIndex: 'unitId',
      key: 'unit',
      render: (unitId: number) => {
        const unit = units.find((u) => u.id === unitId);
        return unit?.name || '-';
      },
    },
    {
      title: 'ราคาขาย',
      dataIndex: 'sellingPrice',
      key: 'sellingPrice',
      align: 'right' as const,
      render: (price: number) => `฿${(price || 0).toLocaleString()}`,
    },
    {
      title: 'ต้นทุน',
      dataIndex: 'standardCost',
      key: 'standardCost',
      align: 'right' as const,
      render: (cost: number) => `฿${(cost || 0).toLocaleString()}`,
    },
    {
      title: 'Min/Max',
      dataIndex: 'minStock',
      key: 'minMax',
      align: 'center' as const,
      render: (_: any, record: Product) => `${record.minStock || 0}/${record.maxStock || 0}`,
    },
    {
      title: 'สถานะ',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'success' : 'default'}>
          {isActive ? 'ใช้งาน' : 'ไม่ใช้งาน'}
        </Tag>
      ),
    },
    {
      title: 'จัดการ',
      key: 'actions',
      width: 120,
      render: (_: any, record: Product) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ color: '#22d3ee' }}
          />
          <Popconfirm
            title="ยืนยันการลบ"
            description="ต้องการลบสินค้านี้หรือไม่?"
            onConfirm={() => handleDelete(record.id)}
            okText="ลบ"
            cancelText="ยกเลิก"
          >
            <Button type="text" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Filter products by search text AND category
  const filteredProducts = products.filter((p) => {
    const matchSearch = 
      p.code?.toLowerCase().includes(searchText.toLowerCase()) ||
      p.name?.toLowerCase().includes(searchText.toLowerCase());
    
    const matchCategory = selectedCategory === null || p.categoryId === selectedCategory;
    
    return matchSearch && matchCategory;
  });

  // Count products per category
  const getCategoryCount = (categoryId: number | null) => {
    if (categoryId === null) return products.length;
    return products.filter(p => p.categoryId === categoryId).length;
  };

  // Get selected category name
  const getSelectedCategoryName = () => {
    if (selectedCategory === null) return 'ทั้งหมด';
    const cat = categories.find(c => c.id === selectedCategory);
    return cat?.name || 'ไม่ระบุ';
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="text-gradient">สินค้า</h1>
        <p>จัดการข้อมูลสินค้าในระบบ</p>
      </div>

      <Card className="card-holo">
        {/* Search & Filter Bar */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 16 
        }}>
          <Space wrap size={12}>
            <Input
              placeholder="ค้นหาสินค้า..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
              allowClear
            />
            
            {/* Category Filter Dropdown */}
            <Select
              placeholder="เลือกหมวดหมู่"
              value={selectedCategory}
              onChange={(value) => setSelectedCategory(value)}
              style={{ width: 200 }}
              allowClear
              suffixIcon={<FilterOutlined />}
            >
              <Select.Option value={null}>
                <Space>
                  <span>📦</span>
                  <span>ทั้งหมด</span>
                  <Tag color="blue" style={{ marginLeft: 8 }}>{getCategoryCount(null)}</Tag>
                </Space>
              </Select.Option>
              {categories.map((cat) => (
                <Select.Option key={cat.id} value={cat.id}>
                  <Space>
                    <span>🏷️</span>
                    <span>{cat.name}</span>
                    <Tag color="blue" style={{ marginLeft: 8 }}>{getCategoryCount(cat.id)}</Tag>
                  </Space>
                </Select.Option>
              ))}
            </Select>
          </Space>

          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate} className="btn-holo">
            + เพิ่มสินค้า
          </Button>
        </div>

        {/* Filter Status Bar */}
        {(searchText || selectedCategory !== null) && (
          <div style={{ 
            marginBottom: 16, 
            padding: '8px 16px', 
            background: 'rgba(34, 211, 238, 0.1)', 
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Space>
              <span style={{ color: '#22d3ee' }}>
                🔍 แสดง {filteredProducts.length.toLocaleString()} รายการ
              </span>
              {selectedCategory !== null && (
                <Tag color="cyan" style={{ borderRadius: 8 }}>
                  หมวด: {getSelectedCategoryName()}
                </Tag>
              )}
              {searchText && (
                <Tag color="purple" style={{ borderRadius: 8 }}>
                  ค้นหา: "{searchText}"
                </Tag>
              )}
            </Space>
            <Button 
              type="link" 
              size="small"
              onClick={() => {
                setSearchText('');
                setSelectedCategory(null);
              }}
              style={{ color: '#f87171' }}
            >
              ล้างตัวกรอง
            </Button>
          </div>
        )}

        <Table
          columns={columns}
          dataSource={filteredProducts}
          rowKey="id"
          loading={loading}
          pagination={{ 
            pageSize: 10,
            showTotal: (total, range) => `${range[0]}-${range[1]} จาก ${total} รายการ`,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingProduct ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="รูปสินค้า">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
              beforeUpload={() => false}
              maxCount={1}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
          </Form.Item>

          <Form.Item
            name="code"
            label="รหัสสินค้า"
            rules={[{ required: true, message: 'กรุณากรอกรหัสสินค้า' }]}
          >
            <Input placeholder="เช่น PRD-001" disabled={!!editingProduct} />
          </Form.Item>

          <Form.Item
            name="name"
            label="ชื่อสินค้า"
            rules={[{ required: true, message: 'กรุณากรอกชื่อสินค้า' }]}
          >
            <Input placeholder="ชื่อสินค้า" />
          </Form.Item>

          <Form.Item name="description" label="รายละเอียด">
            <Input.TextArea rows={2} placeholder="รายละเอียดสินค้า" />
          </Form.Item>

          <Space style={{ width: '100%' }} size={16}>
            <Form.Item name="categoryId" label="หมวดหมู่" style={{ flex: 1 }}>
              <Select
                placeholder="เลือกหมวดหมู่"
                options={categories.map((c) => ({ value: c.id, label: c.name }))}
                showSearch
                optionFilterProp="label"
              />
            </Form.Item>

            <Form.Item name="unitId" label="หน่วย" style={{ flex: 1 }}>
              <Select
                placeholder="เลือกหน่วย"
                options={units.map((u) => ({ value: u.id, label: u.name }))}
              />
            </Form.Item>
          </Space>

          <Space style={{ width: '100%' }} size={16}>
            <Form.Item name="sellingPrice" label="ราคาขาย" style={{ flex: 1 }}>
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                prefix="฿"
                placeholder="0"
              />
            </Form.Item>

            <Form.Item name="standardCost" label="ต้นทุน" style={{ flex: 1 }}>
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                prefix="฿"
                placeholder="0"
              />
            </Form.Item>
          </Space>

          <Space style={{ width: '100%' }} size={16}>
            <Form.Item name="minStock" label="สต็อกขั้นต่ำ" style={{ flex: 1 }}>
              <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
            </Form.Item>

            <Form.Item name="maxStock" label="สต็อกสูงสุด" style={{ flex: 1 }}>
              <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
            </Form.Item>
          </Space>

          <Form.Item name="barcode" label="บาร์โค้ด">
            <Input placeholder="บาร์โค้ด (ถ้ามี)" />
          </Form.Item>

          <Form.Item name="isActive" label="สถานะ" initialValue={true}>
            <Select
              options={[
                { value: true, label: 'ใช้งาน' },
                { value: false, label: 'ไม่ใช้งาน' },
              ]}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setModalVisible(false)}>ยกเลิก</Button>
              <Button type="primary" htmlType="submit" loading={uploading} className="btn-holo">
                {editingProduct ? 'บันทึก' : 'เพิ่มสินค้า'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Image Preview Modal */}
      <Modal
        open={previewOpen}
        title="ตัวอย่างรูปภาพ"
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default ProductsPage;
