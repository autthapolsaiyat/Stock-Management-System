import React, { useEffect, useState } from 'react';
import { Modal, Button, Spin } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { systemSettingsApi } from '../../services/api';

interface TaxInvoicePrintPreviewProps {
  open: boolean;
  onClose: () => void;
  invoice: any;
}

const TaxInvoicePrintPreview: React.FC<TaxInvoicePrintPreviewProps> = ({
  open,
  onClose,
  invoice,
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
    const printContent = document.getElementById('inv-print-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>ใบกำกับภาษี ${invoice?.docFullNo || ''}</title>
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

  const numberToThaiText = (num: number): string => {
    const units = ['', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
    const positions = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];
    
    if (num === 0) return 'ศูนย์บาทถ้วน';
    
    const baht = Math.floor(num);
    const satang = Math.round((num - baht) * 100);
    
    let result = '';
    let remaining = baht;
    let position = 0;
    
    while (remaining > 0) {
      const digit = remaining % 10;
      if (digit !== 0) {
        if (position === 1 && digit === 1) result = 'สิบ' + result;
        else if (position === 1 && digit === 2) result = 'ยี่สิบ' + result;
        else if (position === 0 && digit === 1 && baht > 10) result = 'เอ็ด' + result;
        else result = units[digit] + positions[position] + result;
      }
      remaining = Math.floor(remaining / 10);
      position++;
      if (position === 7) position = 1;
    }
    
    result += 'บาท';
    if (satang === 0) {
      result += 'ถ้วน';
    } else {
      const satangStr = satang.toString().padStart(2, '0');
      const tens = parseInt(satangStr[0]);
      const ones = parseInt(satangStr[1]);
      if (tens > 0) {
        if (tens === 1) result += 'สิบ';
        else if (tens === 2) result += 'ยี่สิบ';
        else result += units[tens] + 'สิบ';
      }
      if (ones > 0) {
        if (ones === 1 && tens > 0) result += 'เอ็ด';
        else result += units[ones];
      }
      result += 'สตางค์';
    }
    return result;
  };

  const items = invoice?.items || [];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={900}
      title="พิมพ์ใบกำกับภาษี / ใบแจ้งหนี้"
      footer={[
        <Button key="close" onClick={onClose}>ปิด</Button>,
        <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>พิมพ์</Button>,
      ]}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>
      ) : (
        <div id="inv-print-content" style={{ padding: 20, background: '#fff', fontSize: 14 }}>
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
                  <div style={{ fontSize: 12 }}>Tel. {companySettings.COMPANY_PHONE_EN || '(662) 886-9200-7'} Fax. {companySettings.COMPANY_FAX_EN || '(662) 433-9168'}</div>
                  <div style={{ fontSize: 14, fontWeight: 'bold', marginTop: 5 }}>
                    เลขประจำตัวผู้เสียภาษี: {companySettings.COMPANY_TAX_ID || '0105545053424'}
                  </div>
                </td>
                <td style={{ width: 180, verticalAlign: 'top', border: 'none', textAlign: 'right' }}>
                  <div style={{ border: '2px solid #000', padding: 8, textAlign: 'center', fontWeight: 'bold' }}>
                    {invoice?.status === 'PAID' ? 'สำเนา' : 'ต้นฉบับ'}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Title */}
          <div style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', margin: '15px 0', borderTop: '2px solid #000', borderBottom: '2px solid #000', padding: '8px 0' }}>
            ใบกำกับภาษี / ใบแจ้งหนี้
            <div style={{ fontSize: 14 }}>TAX INVOICE / INVOICE</div>
          </div>

          {/* Customer & Doc Info */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 10 }}>
            <tbody>
              <tr>
                <td style={{ width: '60%', verticalAlign: 'top', border: '1px solid #000', padding: 8 }}>
                  <div><strong>ลูกค้า / Customer:</strong></div>
                  <div style={{ fontSize: 16, fontWeight: 'bold', marginTop: 5 }}>{invoice?.customerName || '-'}</div>
                  <div style={{ marginTop: 5 }}>{invoice?.customerAddress || '-'}</div>
                  <div style={{ marginTop: 10, fontWeight: 'bold' }}>
                    เลขประจำตัวผู้เสียภาษี: {invoice?.customerTaxId || '-'}
                  </div>
                </td>
                <td style={{ width: '40%', verticalAlign: 'top', border: '1px solid #000', padding: 8 }}>
                  <div><strong>เลขที่/No.:</strong> {invoice?.docFullNo || '-'}</div>
                  <div><strong>วันที่/Date:</strong> {formatDate(invoice?.docDate)}</div>
                  <div><strong>อ้างอิง QT:</strong> {invoice?.quotationDocNo || '-'}</div>
                  <div><strong>เงื่อนไขชำระ:</strong> {invoice?.paymentTermDays || 30} วัน</div>
                  <div><strong>กำหนดชำระ:</strong> {formatDate(invoice?.dueDate)}</div>
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
                <th style={{ border: '1px solid #000', padding: 6, width: 60 }}>จำนวน</th>
                <th style={{ border: '1px solid #000', padding: 6, width: 60 }}>หน่วย</th>
                <th style={{ border: '1px solid #000', padding: 6, width: 100 }}>ราคา/หน่วย</th>
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
                    {item.itemDescription && <div style={{ fontSize: 11, color: '#666' }}>{item.itemDescription}</div>}
                  </td>
                  <td style={{ border: '1px solid #000', padding: 6, textAlign: 'center' }}>{Number(item.qty || 0).toLocaleString()}</td>
                  <td style={{ border: '1px solid #000', padding: 6, textAlign: 'center' }}>{item.unit || 'ea'}</td>
                  <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right' }}>{formatNumber(item.unitPrice)}</td>
                  <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right' }}>{formatNumber(item.lineTotal)}</td>
                </tr>
              ))}
              {items.length < 6 && [...Array(6 - items.length)].map((_, idx) => (
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
                <td style={{ border: '1px solid #000', width: '60%', padding: 8, verticalAlign: 'top' }} rowSpan={4}>
                  <div style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>
                    ({numberToThaiText(Number(invoice?.grandTotal || 0))})
                  </div>
                  <div><strong>หมายเหตุ:</strong> {invoice?.remark || '-'}</div>
                </td>
                <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right' }}>รวมเป็นเงิน / Subtotal</td>
                <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', width: 120 }}>{formatNumber(invoice?.subtotal || 0)}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right' }}>ส่วนลด / Discount</td>
                <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right' }}>{formatNumber(invoice?.discountTotal || 0)}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right' }}>ภาษีมูลค่าเพิ่ม 7% / VAT 7%</td>
                <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right' }}>{formatNumber(invoice?.taxAmount || 0)}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', fontWeight: 'bold', fontSize: 16 }}>รวมทั้งสิ้น / Grand Total</td>
                <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', fontWeight: 'bold', fontSize: 16 }}>{formatNumber(invoice?.grandTotal || 0)}</td>
              </tr>
            </tbody>
          </table>

          {/* Signatures */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ width: '50%', border: '1px solid #000', padding: 15, textAlign: 'center', height: 100 }}>
                  <div style={{ marginBottom: 40 }}>ผู้รับสินค้า / Received By</div>
                  <div>(..........................................)</div>
                  <div>วันที่/Date ......./......./.......</div>
                </td>
                <td style={{ width: '50%', border: '1px solid #000', padding: 15, textAlign: 'center' }}>
                  <div style={{ marginBottom: 5 }}>ในนามของ / On behalf of</div>
                  <div style={{ fontWeight: 'bold' }}>{companySettings.COMPANY_NAME_TH || 'บริษัท แสงวิทย์ ซายน์ จำกัด'}</div>
                  {companySettings.COMPANY_SIGNATURE_URL && (
                    <img src={companySettings.COMPANY_SIGNATURE_URL} alt="Signature" style={{ maxHeight: 40, margin: '5px 0' }} />
                  )}
                  <div>(..........................................)</div>
                  <div>ผู้มีอำนาจลงนาม / Authorized Signature</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </Modal>
  );
};

export default TaxInvoicePrintPreview;
