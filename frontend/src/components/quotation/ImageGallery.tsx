import React, { useState } from 'react';
import { Card, Upload, Button, Image, Space, Input, Popconfirm } from 'antd';
import { DeleteOutlined, PictureOutlined } from '@ant-design/icons';
import type { QuotationImage } from '../../types/quotation';

interface ImageGalleryProps {
  images: QuotationImage[];
  onChange: (images: QuotationImage[]) => void;
  onPasteHint?: boolean;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, onChange, onPasteHint }) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      const newImage: QuotationImage = {
        imageUrl: base64,
        sortOrder: images.length + 1,
        caption: file.name,
      };
      onChange([...images, newImage]);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    newImages.forEach((img, i) => img.sortOrder = i + 1);
    onChange(newImages);
  };

  const handleCaptionChange = (index: number, caption: string) => {
    const newImages = [...images];
    newImages[index].caption = caption;
    onChange(newImages);
  };

  const handlePreview = (url: string) => {
    setPreviewImage(url);
    setPreviewVisible(true);
  };

  return (
    <Card 
      title={`🖼️ รูปภาพ (${images.length})`}
      extra={
        <Upload
          accept="image/*"
          showUploadList={false}
          beforeUpload={handleUpload}
        >
          <Button icon={<PictureOutlined />} size="small">อัพโหลด</Button>
        </Upload>
      }
    >
      {images.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '30px 20px',
          border: '2px dashed rgba(255,255,255,0.2)',
          borderRadius: 8,
          background: 'rgba(255,255,255,0.02)'
        }}>
          <PictureOutlined style={{ fontSize: 32, color: 'rgba(255,255,255,0.3)', marginBottom: 12 }} />
          <div style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>
            ลากรูปมาวางที่นี่
          </div>
          <div style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>
            หรือคลิกเพื่อเลือกไฟล์
          </div>
          {onPasteHint && (
            <div style={{ 
              marginTop: 12, 
              padding: '8px 12px', 
              background: 'rgba(124, 58, 237, 0.2)', 
              borderRadius: 6,
              border: '1px solid rgba(124, 58, 237, 0.3)'
            }}>
              <span style={{ color: '#a78bfa', fontSize: 13 }}>
                💡 Tip: กด <kbd style={{ 
                  background: 'rgba(255,255,255,0.1)', 
                  padding: '2px 6px', 
                  borderRadius: 4,
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>Ctrl+V</kbd> หรือ <kbd style={{ 
                  background: 'rgba(255,255,255,0.1)', 
                  padding: '2px 6px', 
                  borderRadius: 4,
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>⌘+V</kbd> เพื่อวางรูปจาก Clipboard
              </span>
            </div>
          )}
        </div>
      ) : (
        <Space direction="vertical" style={{ width: '100%' }}>
          {images.map((img, index) => (
            <div 
              key={index} 
              style={{ 
                display: 'flex', 
                gap: 12, 
                padding: 8,
                background: 'rgba(255,255,255,0.05)',
                borderRadius: 8,
                alignItems: 'center'
              }}
            >
              <Image
                src={img.imageUrl}
                width={60}
                height={60}
                style={{ objectFit: 'cover', borderRadius: 4, cursor: 'pointer' }}
                preview={false}
                onClick={() => handlePreview(img.imageUrl)}
              />
              <div style={{ flex: 1 }}>
                <Input
                  size="small"
                  value={img.caption}
                  onChange={(e) => handleCaptionChange(index, e.target.value)}
                  placeholder="คำอธิบายรูป"
                />
              </div>
              <Popconfirm title="ลบรูปนี้?" onConfirm={() => handleRemove(index)}>
                <Button type="text" danger icon={<DeleteOutlined />} size="small" />
              </Popconfirm>
            </div>
          ))}
          
          {onPasteHint && (
            <div style={{ 
              textAlign: 'center',
              padding: '8px',
              color: 'rgba(255,255,255,0.4)',
              fontSize: 12
            }}>
              💡 กด Ctrl+V / ⌘+V เพื่อวางรูปเพิ่ม
            </div>
          )}
        </Space>
      )}

      <Image
        style={{ display: 'none' }}
        preview={{
          visible: previewVisible,
          src: previewImage,
          onVisibleChange: (visible) => setPreviewVisible(visible),
        }}
      />
    </Card>
  );
};

export default ImageGallery;
