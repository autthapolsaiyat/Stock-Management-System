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
    // Set existing image if available
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

      // Check if there's a new image to upload
      if (fileList.length > 0) {
        const file = fileList[0];
        // If it's an existing URL (from edit), keep it
        if (file.url && !file.originFileObj) {
          imageUrl = file.url;
        } 
        // If it's a new file, upload to Azure Blob
        else if (file.thumbUrl && file.thumbUrl.startsWith('data:')) {
          try {
            const uploadRes = await uploadApi.uploadBase64(file.thumbUrl, 'products');
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

  // Convert file to base64 for preview (temporary until Azure Blob is ready)
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

  const handleUploadChange: UploadProps['onChange'] = async ({ fileList: newFileList }) => {
    // Process file to get base64 preview
    const processedList = await Promise.all(
      newFileList.map(async (file) => {
        if (file.originFileObj && !file.url && !file.thumbUrl) {
          const base64 = await getBase64(file.originFileObj as File);
          return { ...file, thumbUrl: base64, status: 'done' as const };
        }
        return file;
      })
    );
    setFileList(processedList);
  };

  const uploadButton = (
    <div>
      {uploading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>{uploading ? 'กำลังอัพโหลด...' : 'อัพโหลดรูป'}</div>
    </div>
  );

  const columns = [
    {
      title: 'รูป',
      dataIndex: 'imageUrl',
      key: 'image',
      width: 80,
      render: (imageUrl: string) => (
        imageUrl ? (
          <Image
            src={imageUrl}
            width={50}
            height={50}
            style={{ objectFit: 'cover', borderRadius: 8 }}
            placeholder={
              <div style={{ 
                width: 50, 
                height: 50, 
                background: 'rgba(124,58,237,0.1)', 
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <PictureOutlined style={{ color: '#7c3aed' }} />
              </div>
            }
          />
        ) : (
          <div style={{ 
            width: 50, 
            height: 50, 
            background: 'rgba(124,58,237,0.1)', 
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <PictureOutlined style={{ color: '#7c3aed', fontSize: 20 }} />
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
        return cat?.name || '-';
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
            description="คุณต้องการลบสินค้านี้ใช่หรือไม่?"
            onConfirm={() => handleDelete(record.id)}
            okText="ลบ"
            cancelText="ยกเลิก"
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              style={{ color: '#f97373' }}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredProducts = products.filter(
    (p) =>
      p.code?.toLowerCase().includes(searchText.toLowerCase()) ||
      p.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="text-gradient">สินค้า</h1>
        <p>จัดการข้อมูลสินค้าในระบบ</p>
      </div>

      <Card className="card-holo">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 16,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <Input
            placeholder="ค้นหาสินค้า..."
            prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
            className="btn-holo"
          >
            เพิ่มสินค้า
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredProducts}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `ทั้งหมด ${total} รายการ`,
          }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingProduct ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={650}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ isActive: true }}
        >
          {/* Image Upload */}
          <Form.Item label="รูปสินค้า">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleUploadChange}
              beforeUpload={() => false} // Prevent auto upload
              maxCount={1}
              accept="image/*"
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
            <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
              รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 5MB
            </span>
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
              <Select placeholder="เลือกหมวดหมู่" allowClear>
                {categories.map((cat) => (
                  <Select.Option key={cat.id} value={cat.id}>
                    {cat.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="unitId" label="หน่วย" style={{ flex: 1 }}>
              <Select placeholder="เลือกหน่วย" allowClear>
                {units.map((unit) => (
                  <Select.Option key={unit.id} value={unit.id}>
                    {unit.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Space>

          <Space style={{ width: '100%' }} size={16}>
            <Form.Item name="sellingPrice" label="ราคาขาย" style={{ flex: 1 }}>
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                precision={2}
                formatter={(value) => `฿ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value!.replace(/฿\s?|(,*)/g, '') as any}
              />
            </Form.Item>

            <Form.Item name="standardCost" label="ต้นทุน" style={{ flex: 1 }}>
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                precision={2}
                formatter={(value) => `฿ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value!.replace(/฿\s?|(,*)/g, '') as any}
              />
            </Form.Item>
          </Space>

          <Space style={{ width: '100%' }} size={16}>
            <Form.Item name="minStock" label="สต็อกขั้นต่ำ" style={{ flex: 1 }}>
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>

            <Form.Item name="maxStock" label="สต็อกสูงสุด" style={{ flex: 1 }}>
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
          </Space>

          <Form.Item name="barcode" label="บาร์โค้ด">
            <Input placeholder="บาร์โค้ด (ถ้ามี)" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setModalVisible(false)} disabled={uploading}>ยกเลิก</Button>
              <Button type="primary" htmlType="submit" className="btn-holo" loading={uploading}>
                {uploading ? 'กำลังบันทึก...' : editingProduct ? 'บันทึก' : 'เพิ่มสินค้า'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Image Preview Modal */}
      <Modal
        open={previewOpen}
        title="รูปสินค้า"
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default ProductsPage;
