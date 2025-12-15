import React, { useState } from 'react';
import { Card, Upload, Button, Image, Space, Popconfirm, message } from 'antd';
import {
  DeleteOutlined, LeftOutlined, RightOutlined,
  EyeOutlined, InboxOutlined
} from '@ant-design/icons';

import type { QuotationImage } from '../../types/quotation';
import { uploadApi } from '../../services/api';

const { Dragger } = Upload;

interface ImageGalleryProps {
  images: QuotationImage[];
  onChange: (images: QuotationImage[]) => void;
}

const IMAGES_PER_PAGE = 4;

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, onChange }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [uploading, setUploading] = useState(false);

  const totalPages = Math.ceil(images.length / IMAGES_PER_PAGE);
  const startIndex = (currentPage - 1) * IMAGES_PER_PAGE;
  const visibleImages = images.slice(startIndex, startIndex + IMAGES_PER_PAGE);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = reader.result as string;
          const response = await uploadApi.uploadBase64(base64, 'quotations');
          
          const newImage: QuotationImage = {
            imageUrl: response.data.url,
            fileName: file.name,
            sortOrder: images.length + 1,
          };
          
          onChange([...images, newImage]);
          message.success('อัพโหลดสำเร็จ');
        } catch (error) {
          message.error('อัพโหลดไม่สำเร็จ');
        } finally {
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      message.error('อัพโหลดไม่สำเร็จ');
      setUploading(false);
    }
    return false; // Prevent default upload
  };

  const handleDelete = (index: number) => {
    const globalIndex = startIndex + index;
    const newImages = images.filter((_, i) => i !== globalIndex);
    // Reorder
    newImages.forEach((img, i) => img.sortOrder = i + 1);
    onChange(newImages);
    
    // Adjust page if needed
    if (newImages.length > 0 && startIndex >= newImages.length) {
      setCurrentPage(Math.ceil(newImages.length / IMAGES_PER_PAGE));
    }
  };

  const handlePreview = (index: number) => {
    setPreviewIndex(startIndex + index);
    setPreviewOpen(true);
  };

  const handlePreviewNav = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && previewIndex > 0) {
      setPreviewIndex(previewIndex - 1);
    } else if (direction === 'next' && previewIndex < images.length - 1) {
      setPreviewIndex(previewIndex + 1);
    }
  };

  return (
    <Card title="🖼️ รูปภาพประกอบ">
      {/* Upload Area */}
      <Dragger
        accept="image/*"
        multiple
        showUploadList={false}
        beforeUpload={handleUpload}
        disabled={uploading}
        style={{ marginBottom: 16 }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          {uploading ? 'กำลังอัพโหลด...' : 'ลากรูปมาวางที่นี่'}
        </p>
        <p className="ant-upload-hint">หรือคลิกเพื่อเลือกไฟล์</p>
      </Dragger>

      {/* Image Grid - 2x2 */}
      {images.length > 0 && (
        <>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: 8,
            marginBottom: 16 
          }}>
            {visibleImages.map((img, index) => (
              <div 
                key={index} 
                style={{ 
                  position: 'relative',
                  aspectRatio: '1',
                  borderRadius: 8,
                  overflow: 'hidden',
                  border: '1px solid #d9d9d9',
                }}
              >
                <img
                  src={img.imageUrl}
                  alt={img.fileName}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                {/* Overlay */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0,0,0,0.3)',
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
                className="image-overlay"
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                >
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<EyeOutlined />}
                    onClick={() => handlePreview(index)}
                  />
                  <Popconfirm
                    title="ลบรูปนี้?"
                    onConfirm={() => handleDelete(index)}
                  >
                    <Button
                      type="primary"
                      danger
                      shape="circle"
                      icon={<DeleteOutlined />}
                    />
                  </Popconfirm>
                </div>
                {/* Number badge */}
                <div style={{
                  position: 'absolute',
                  top: 4,
                  left: 4,
                  background: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  padding: '2px 8px',
                  borderRadius: 4,
                  fontSize: 12,
                }}>
                  {startIndex + index + 1}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12 }}>
              <Button
                icon={<LeftOutlined />}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              />
              <span>{currentPage} / {totalPages}</span>
              <Button
                icon={<RightOutlined />}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              />
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 8, color: '#888', fontSize: 12 }}>
            รูปทั้งหมด: {images.length} รูป
          </div>
        </>
      )}

      {/* Preview Modal */}
      <Image.PreviewGroup
        preview={{
          visible: previewOpen,
          onVisibleChange: setPreviewOpen,
          current: previewIndex,
          onChange: setPreviewIndex,
          toolbarRender: () => (
            <Space size={12}>
              <Button onClick={() => handlePreviewNav('prev')} disabled={previewIndex === 0}>
                <LeftOutlined /> ก่อนหน้า
              </Button>
              <span style={{ color: '#fff' }}>
                {previewIndex + 1} / {images.length}
              </span>
              <Button onClick={() => handlePreviewNav('next')} disabled={previewIndex === images.length - 1}>
                ถัดไป <RightOutlined />
              </Button>
            </Space>
          ),
        }}
      >
        {images.map((img, index) => (
          <Image key={index} src={img.imageUrl} style={{ display: 'none' }} />
        ))}
      </Image.PreviewGroup>
    </Card>
  );
};

export default ImageGallery;
