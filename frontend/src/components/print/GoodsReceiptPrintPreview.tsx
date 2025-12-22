import React, { useEffect, useState } from 'react';
import { Modal, Button, Spin } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { systemSettingsApi } from '../../services/api';

interface GoodsReceiptPrintPreviewProps {
  open: boolean;
  onClose: () => void;
  goodsReceipt: any;
}

const GoodsReceiptPrintPreview: React.FC<GoodsReceiptPrintPreviewProps> = ({
  open,
  onClose,
  goodsReceipt,
}) => {
  const [companySettings, setCompanySettings] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      loadSettings();
    }
  }, [open]);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const [companyThRes, companyEnRes, companyRes] = await Promise.all([
        systemSettingsApi.getByCategory('COMPANY_TH'),
        systemSettingsApi.getByCategory('COMPANY_EN'),
        systemSettingsApi.getByCategory('COMPANY'),
      ]);
      
      const companyMap: any = {};
      [...(companyThRes.data || []), ...(companyEnRes.data || []), ...(companyRes.data || [])].forEach((s: any) => {
        companyMap[s.settingKey] = s.settingValue;
      });
      setCompanySettings(companyMap);
    } catch (error) {
      console.error('Load settings error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById('gr-print-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>ใบรับสินค้า ${goodsReceipt?.docFullNo || ''}</title>
              <style>
                @page { size: A4; margin: 10mm; }
                body { font-family: 'Sarabun', 'TH Sarabun New', sans-serif; font-size: 14px; margin: 0; padding: 10px; }
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #000; padding: 4px 8px; }
                th { background: #f0f0f0; }
                .text-right { text-align: right; }
                .text-center { text-align: center; }
              </style>
            </head>
            <body>${printContent.innerHTML}</body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    const thaiMonths = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 
                        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
    const thaiYear = date.getFullYear() + 543;
    return `${date.getDate()} ${thaiMonths[date.getMonth()]} ${thaiYear}`;
  };

  const formatNumber = (num: number) => {
    return Number(num || 0).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const items = goodsReceipt?.items || [];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={900}
      title="พิมพ์ใบรับสินค้า"
      footer={[
        <Button key="close" onClick={onClose}>ปิด</Button>,
        <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>พิมพ์</Button>,
      ]}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>
      ) : (
        <div id="gr-print-content" style={{ padding: 20, background: '#fff', fontSize: 14 }}>
          {/* Header */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 10 }}>
            <tbody>
              <tr>
                <td style={{ width: 120, verticalAlign: 'top', border: 'none', padding: 0 }}>
                  <img src="/svs-logo.png" alt="Logo" style={{ width: 100 }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                </td>
                <td style={{ verticalAlign: 'top', border: 'none', padding: '0 10px' }}>
                  <div style={{ fontWeight: 'bold', fontSize: 18 }}>
                    {companySettings.COMPANY_NAME_TH || 'บริษัท แสงวิทย์ ซายน์ จำกัด'}
                  </div>
                  <div style={{ fontSize: 12 }}>{companySettings.COMPANY_ADDRESS1_TH || '123/4-5 ซอยสมเด็จพระปิ่นเกล้า 9 ถนนสมเด็จพระปิ่นเกล้า'}</div>
                  <div style={{ fontSize: 12 }}>{companySettings.COMPANY_ADDRESS2_TH || 'แขวงอรุณอัมรินทร์ เขตบางกอกน้อย กรุงเทพฯ 10700'}</div>
                  <div style={{ fontSize: 12, marginTop: 5 }}>
                    <strong>{companySettings.COMPANY_NAME_EN || 'Saengvith Science Co.,Ltd.'}</strong>
                  </div>
                  <div style={{ fontSize: 12 }}>Tax ID {companySettings.COMPANY_TAX_ID || '0105545053424'}</div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Title */}
          <div style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', margin: '15px 0', borderTop: '2px solid #000', borderBottom: '2px solid #000', padding: '8px 0' }}>
            ใบรับสินค้า / Goods Receipt
          </div>

          {/* Info */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 10 }}>
            <tbody>
              <tr>
                <td style={{ width: '50%', verticalAlign: 'top', border: '1px solid #000', padding: 8 }}>
                  <div><strong>เลขที่/No.:</strong> {goodsReceipt?.docFullNo || '-'}</div>
                  <div><strong>วันที่รับ/Receive Date:</strong> {formatDate(goodsReceipt?.receiveDate)}</div>
                  <div><strong>อ้างอิง PO:</strong> {goodsReceipt?.purchaseOrderDocNo || '-'}</div>
                  <div><strong>อ้างอิง QT:</strong> {goodsReceipt?.quotationDocNo || '-'}</div>
                </td>
                <td style={{ width: '50%', verticalAlign: 'top', border: '1px solid #000', padding: 8 }}>
                  <div><strong>ผู้จำหน่าย/Supplier:</strong> {goodsReceipt?.supplierName || '-'}</div>
                  <div><strong>คลังสินค้า/Warehouse:</strong> {goodsReceipt?.warehouseName || '-'}</div>
                  <div><strong>เลขที่ใบส่งของ:</strong> {goodsReceipt?.supplierInvoiceNo || '-'}</div>
                  <div><strong>วันที่ใบส่งของ:</strong> {formatDate(goodsReceipt?.supplierInvoiceDate)}</div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Items Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 10 }}>
            <thead>
              <tr style={{ background: '#f0f0f0' }}>
                <th style={{ border: '1px solid #000', padding: 6, width: 40 }}>ลำดับ</th>
                <th style={{ border: '1px solid #000', padding: 6, width: 80 }}>รหัสสินค้า</th>
                <th style={{ border: '1px solid #000', padding: 6 }}>รายการ / Description</th>
                <th style={{ border: '1px solid #000', padding: 6, width: 60 }}>จำนวนรับ</th>
                <th style={{ border: '1px solid #000', padding: 6, width: 60 }}>หน่วย</th>
                <th style={{ border: '1px solid #000', padding: 6, width: 100 }}>ต้นทุน/หน่วย</th>
                <th style={{ border: '1px solid #000', padding: 6, width: 100 }}>จำนวนเงิน</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: any, idx: number) => (
                <tr key={idx}>
                  <td style={{ border: '1px solid #000', padding: 6, textAlign: 'center' }}>{idx + 1}</td>
                  <td style={{ border: '1px solid #000', padding: 6, fontSize: 11 }}>{item.itemCode || '-'}</td>
                  <td style={{ border: '1px solid #000', padding: 6 }}>
                    <div style={{ fontWeight: 500 }}>{item.itemName}</div>
                    {item.lotNo && <div style={{ fontSize: 11, color: '#666' }}>Lot: {item.lotNo}</div>}
                  </td>
                  <td style={{ border: '1px solid #000', padding: 6, textAlign: 'center' }}>{Number(item.qty || 0).toLocaleString()}</td>
                  <td style={{ border: '1px solid #000', padding: 6, textAlign: 'center' }}>{item.unit || 'ea'}</td>
                  <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right' }}>{formatNumber(item.unitCost)}</td>
                  <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right' }}>{formatNumber(item.lineTotal)}</td>
                </tr>
              ))}
              {items.length < 8 && [...Array(8 - items.length)].map((_, idx) => (
                <tr key={`empty-${idx}`}>
                  <td style={{ border: '1px solid #000', padding: 6, height: 25 }}>&nbsp;</td>
                  <td style={{ border: '1px solid #000', padding: 6 }}>&nbsp;</td>
                  <td style={{ border: '1px solid #000', padding: 6 }}>&nbsp;</td>
                  <td style={{ border: '1px solid #000', padding: 6 }}>&nbsp;</td>
                  <td style={{ border: '1px solid #000', padding: 6 }}>&nbsp;</td>
                  <td style={{ border: '1px solid #000', padding: 6 }}>&nbsp;</td>
                  <td style={{ border: '1px solid #000', padding: 6 }}>&nbsp;</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Summary */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 10 }}>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #000', width: '70%', padding: 8 }} rowSpan={2}>
                  <div><strong>หมายเหตุ / Remark:</strong></div>
                  <div style={{ marginTop: 5 }}>{goodsReceipt?.remark || '-'}</div>
                </td>
                <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right' }}>รวมจำนวนรายการ</td>
                <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', width: 100 }}>{items.length} รายการ</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', fontWeight: 'bold' }}>รวมมูลค่า</td>
                <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', fontWeight: 'bold' }}>{formatNumber(goodsReceipt?.grandTotal || 0)}</td>
              </tr>
            </tbody>
          </table>

          {/* Signatures */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ width: '33%', border: '1px solid #000', padding: 15, textAlign: 'center', height: 100 }}>
                  <div style={{ marginBottom: 40 }}>ผู้ส่งของ / Delivered By</div>
                  <div>(..........................................)</div>
                  <div>วันที่ ......./......./.......</div>
                </td>
                <td style={{ width: '33%', border: '1px solid #000', padding: 15, textAlign: 'center' }}>
                  <div style={{ marginBottom: 40 }}>ผู้รับของ / Received By</div>
                  <div>(..........................................)</div>
                  <div>วันที่ ......./......./.......</div>
                </td>
                <td style={{ width: '33%', border: '1px solid #000', padding: 15, textAlign: 'center' }}>
                  <div style={{ marginBottom: 40 }}>ผู้ตรวจสอบ / Checked By</div>
                  <div>(..........................................)</div>
                  <div>วันที่ ......./......./.......</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </Modal>
  );
};

export default GoodsReceiptPrintPreview;
