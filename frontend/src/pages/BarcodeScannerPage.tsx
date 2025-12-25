import React, { useState, useRef, useEffect } from 'react';
import { Card, Input, Button, Space, message, Descriptions, Tag, Spin, Row, Col,  Table, Empty } from 'antd';
import { 
  BarcodeOutlined, 
  SearchOutlined,
  CameraOutlined,
  StopOutlined,
  SoundOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../services/api';

interface Product {
  id: number;
  code: string;
  name: string;
  barcode: string;
  categoryName: string;
  unit: string;
  sellingPrice: number;
  standardCost: number;
  minStock: number;
  reorderPoint: number;
}

interface SerialInfo {
  found: boolean;
  id?: number;
  serialNo?: string;
  productId?: number;
  productCode?: string;
  productName?: string;
  status?: string;
  warehouseId?: number;
  grDocNo?: string;
  receivedDate?: string;
  invoiceDocNo?: string;
  soldDate?: string;
  lotNo?: string;
  expiryDate?: string;
}

interface StockBalance {
  productId: number;
  warehouseId: number;
  warehouseName: string;
  qtyOnHand: number;
  avgCost: number;
}

const BarcodeScannerPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [scanResult, setScanResult] = useState<{
    type: 'product' | 'serial' | 'not_found' | null;
    product?: Product;
    serial?: SerialInfo;
    stockBalances?: StockBalance[];
  }>({ type: null });
  const [cameraActive, setCameraActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const inputRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Focus input on load
    inputRef.current?.focus();
    
    return () => {
      // Cleanup camera on unmount
      stopCamera();
    };
  }, []);

  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 1000;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.3;
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
      console.log('Audio not supported');
    }
  };

  const searchBarcode = async (code: string) => {
    if (!code.trim()) {
      message.warning('กรุณากรอก Barcode หรือ Serial Number');
      return;
    }
    
    setLoading(true);
    setScanResult({ type: null });
    
    try {
      // 1. Try Serial Number first
      const serialRes = await api.get(`/api/stock/serial-numbers/lookup/${encodeURIComponent(code.trim())}`);
      if (serialRes.data?.found) {
        playBeep();
        setScanResult({
          type: 'serial',
          serial: serialRes.data,
        });
        message.success('พบ Serial Number!');
        return;
      }
      
      // 2. Try Product by barcode
      const productsRes = await api.get('/api/products');
      const products = productsRes.data || [];
      const product = products.find((p: Product) => 
        p.barcode === code.trim() || p.code === code.trim()
      );
      
      if (product) {
        playBeep();
        // Get stock balance
        const balanceRes = await api.get('/api/stock/balance', { params: { productId: product.id } });
        setScanResult({
          type: 'product',
          product,
          stockBalances: balanceRes.data || [],
        });
        message.success('พบสินค้า!');
        return;
      }
      
      // Not found
      setScanResult({ type: 'not_found' });
      message.warning('ไม่พบข้อมูล');
      
    } catch (error) {
      console.error('Search error:', error);
      message.error('เกิดข้อผิดพลาดในการค้นหา');
    } finally {
      setLoading(false);
    }
  };

  const handleInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchBarcode(barcodeInput);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
      message.info('กล้องเปิดแล้ว - สแกน barcode หน้ากล้อง (ฟีเจอร์ทดลอง)');
    } catch (error) {
      console.error('Camera error:', error);
      message.error('ไม่สามารถเปิดกล้องได้');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const clearResult = () => {
    setScanResult({ type: null });
    setBarcodeInput('');
    inputRef.current?.focus();
  };

  const getStatusTag = (status: string) => {
    const config: Record<string, { color: string; label: string }> = {
      'IN_STOCK': { color: 'green', label: 'ในสต็อก' },
      'SOLD': { color: 'blue', label: 'ขายแล้ว' },
      'RESERVED': { color: 'orange', label: 'จองแล้ว' },
      'DEFECTIVE': { color: 'red', label: 'ชำรุด' },
      'RETURNED': { color: 'purple', label: 'คืนสินค้า' },
    };
    const { color, label } = config[status] || { color: 'default', label: status };
    return <Tag color={color}>{label}</Tag>;
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Scanner Input */}
      <Card 
        title={<><BarcodeOutlined /> Barcode Scanner</>}
        style={{ marginBottom: 16 }}
        extra={
          <Space>
            <Button 
              icon={<SoundOutlined />} 
              type={soundEnabled ? 'primary' : 'default'}
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? 'เสียงเปิด' : 'เสียงปิด'}
            </Button>
            {!cameraActive ? (
              <Button icon={<CameraOutlined />} onClick={startCamera}>
                เปิดกล้อง
              </Button>
            ) : (
              <Button icon={<StopOutlined />} danger onClick={stopCamera}>
                ปิดกล้อง
              </Button>
            )}
          </Space>
        }
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={16}>
            <Input
              ref={inputRef}
              size="large"
              placeholder="สแกนหรือพิมพ์ Barcode / Serial Number แล้วกด Enter"
              prefix={<BarcodeOutlined />}
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              onKeyPress={handleInputKeyPress}
              autoFocus
              style={{ fontSize: 18 }}
            />
          </Col>
          <Col xs={24} md={8}>
            <Space style={{ width: '100%' }}>
              <Button 
                type="primary" 
                size="large" 
                icon={<SearchOutlined />} 
                onClick={() => searchBarcode(barcodeInput)}
                loading={loading}
                style={{ minWidth: 120 }}
              >
                ค้นหา
              </Button>
              <Button size="large" onClick={clearResult}>
                ล้าง
              </Button>
            </Space>
          </Col>
        </Row>
        
        {/* Camera Preview */}
        {cameraActive && (
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline
              style={{ 
                width: '100%', 
                maxWidth: 400, 
                borderRadius: 8,
                border: '2px solid #1890ff'
              }} 
            />
            <p style={{ color: '#888', marginTop: 8, fontSize: 12 }}>
              * ฟีเจอร์กล้องเป็น preview - สำหรับการใช้งานจริงแนะนำใช้ barcode scanner แบบ USB
            </p>
          </div>
        )}
      </Card>

      {/* Result */}
      <Spin spinning={loading}>
        {scanResult.type === 'serial' && scanResult.serial && (
          <Card title="📱 ผลการค้นหา: Serial Number" style={{ marginBottom: 16 }}>
            <Descriptions bordered column={{ xs: 1, sm: 2 }}>
              <Descriptions.Item label="Serial No" span={2}>
                <span style={{ fontSize: 18, fontWeight: 'bold' }}>{scanResult.serial.serialNo}</span>
              </Descriptions.Item>
              <Descriptions.Item label="สินค้า">
                {scanResult.serial.productCode} - {scanResult.serial.productName}
              </Descriptions.Item>
              <Descriptions.Item label="สถานะ">
                {getStatusTag(scanResult.serial.status || '')}
              </Descriptions.Item>
              <Descriptions.Item label="Lot No">
                {scanResult.serial.lotNo || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="วันหมดอายุ">
                {scanResult.serial.expiryDate ? dayjs(scanResult.serial.expiryDate).format('DD/MM/YYYY') : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="GR เลขที่">
                {scanResult.serial.grDocNo || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="วันที่รับ">
                {scanResult.serial.receivedDate ? dayjs(scanResult.serial.receivedDate).format('DD/MM/YYYY') : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Invoice เลขที่">
                {scanResult.serial.invoiceDocNo || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="วันที่ขาย">
                {scanResult.serial.soldDate ? dayjs(scanResult.serial.soldDate).format('DD/MM/YYYY') : '-'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )}

        {scanResult.type === 'product' && scanResult.product && (
          <>
            <Card title="📦 ผลการค้นหา: สินค้า" style={{ marginBottom: 16 }}>
              <Descriptions bordered column={{ xs: 1, sm: 2 }}>
                <Descriptions.Item label="รหัสสินค้า">
                  <span style={{ fontSize: 18, fontWeight: 'bold' }}>{scanResult.product.code}</span>
                </Descriptions.Item>
                <Descriptions.Item label="Barcode">
                  {scanResult.product.barcode || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="ชื่อสินค้า" span={2}>
                  {scanResult.product.name}
                </Descriptions.Item>
                <Descriptions.Item label="หมวดหมู่">
                  {scanResult.product.categoryName || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="หน่วย">
                  {scanResult.product.unit || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="ราคาขาย">
                  <span style={{ color: '#52c41a', fontWeight: 'bold' }}>
                    ฿{(scanResult.product.sellingPrice || 0).toLocaleString()}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="ต้นทุนมาตรฐาน">
                  ฿{(scanResult.product.standardCost || 0).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Min Stock">
                  {scanResult.product.minStock || 0}
                </Descriptions.Item>
                <Descriptions.Item label="Reorder Point">
                  {scanResult.product.reorderPoint || 0}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card title="📊 ยอดคงเหลือตามคลัง">
              {scanResult.stockBalances && scanResult.stockBalances.length > 0 ? (
                <Table
                  dataSource={scanResult.stockBalances}
                  columns={[
                    { title: 'คลังสินค้า', dataIndex: 'warehouseName', key: 'warehouseName' },
                    { 
                      title: 'คงเหลือ', 
                      dataIndex: 'qtyOnHand', 
                      key: 'qtyOnHand', 
                      align: 'right' as const,
                      render: (v: number) => (
                        <span style={{ 
                          fontWeight: 'bold', 
                          color: v > 0 ? '#52c41a' : '#ff4d4f' 
                        }}>
                          {v?.toLocaleString() || 0}
                        </span>
                      ),
                    },
                    { 
                      title: 'ต้นทุนเฉลี่ย', 
                      dataIndex: 'avgCost', 
                      key: 'avgCost', 
                      align: 'right' as const,
                      render: (v: number) => `฿${(v || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                    },
                    { 
                      title: 'มูลค่า', 
                      key: 'value', 
                      align: 'right' as const,
                      render: (_: any, r: StockBalance) => 
                        `฿${((r.qtyOnHand || 0) * (r.avgCost || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                    },
                  ]}
                  rowKey="warehouseId"
                  pagination={false}
                  size="small"
                  summary={(data) => {
                    const totalQty = data.reduce((sum, r) => sum + (r.qtyOnHand || 0), 0);
                    const totalValue = data.reduce((sum, r) => sum + ((r.qtyOnHand || 0) * (r.avgCost || 0)), 0);
                    return (
                      <Table.Summary.Row style={{ fontWeight: 'bold', background: 'rgba(255,255,255,0.05)' }}>
                        <Table.Summary.Cell index={0}>รวมทั้งหมด</Table.Summary.Cell>
                        <Table.Summary.Cell index={1} align="right">
                          <span style={{ color: '#52c41a' }}>{totalQty.toLocaleString()}</span>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={2}></Table.Summary.Cell>
                        <Table.Summary.Cell index={3} align="right">
                          <span style={{ color: '#1890ff' }}>฿{totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    );
                  }}
                />
              ) : (
                <Empty description="ไม่พบข้อมูลสต็อก" />
              )}
            </Card>
          </>
        )}

        {scanResult.type === 'not_found' && (
          <Card>
            <Empty 
              description={
                <span style={{ fontSize: 16 }}>
                  ไม่พบข้อมูลสำหรับ "<strong>{barcodeInput}</strong>"
                </span>
              }
            >
              <p style={{ color: '#888' }}>
                ลองตรวจสอบว่า Barcode หรือ Serial Number ถูกต้อง
              </p>
            </Empty>
          </Card>
        )}

        {scanResult.type === null && !loading && (
          <Card>
            <div style={{ textAlign: 'center', padding: 40 }}>
              <BarcodeOutlined style={{ fontSize: 64, color: '#1890ff', marginBottom: 16 }} />
              <h2>พร้อมสแกน</h2>
              <p style={{ color: '#888' }}>
                สแกน Barcode ด้วยเครื่องอ่าน หรือพิมพ์รหัสแล้วกด Enter
              </p>
              <div style={{ marginTop: 24, color: '#666', fontSize: 13 }}>
                <p>รองรับการค้นหา:</p>
                <Space>
                  <Tag color="blue">Barcode สินค้า</Tag>
                  <Tag color="green">รหัสสินค้า</Tag>
                  <Tag color="purple">Serial Number</Tag>
                </Space>
              </div>
            </div>
          </Card>
        )}
      </Spin>
    </div>
  );
};

export default BarcodeScannerPage;
