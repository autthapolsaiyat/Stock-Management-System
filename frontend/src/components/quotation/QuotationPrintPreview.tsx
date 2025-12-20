import React, { useEffect, useState } from 'react';
import { Modal, Button, Spin } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { systemSettingsApi, userSettingsApi } from '../../services/api';
import type { QuotationItem } from '../../types/quotation';

interface QuotationPrintPreviewProps {
  open: boolean;
  onClose: () => void;
  quotation: {
    docFullNo?: string;
    docDate?: string;
    validDays?: number;
    deliveryDays?: number;
    creditTermDays?: number;
    customerName?: string;
    customerAddress?: string;
    contactPerson?: string;
    contactPhone?: string;
    contactEmail?: string;
    publicNote?: string;
    subtotal: number;
    discountAmount: number;
    afterDiscount: number;
    taxAmount: number;
    grandTotal: number;
    discountDisplayMode?: string;
  };
  items: QuotationItem[];
  customer: any;
}

const QuotationPrintPreview: React.FC<QuotationPrintPreviewProps> = ({
  open,
  onClose,
  quotation,
  items,
  customer,
}) => {
  const [companySettings, setCompanySettings] = useState<any>({});
  const [sellerSettings, setSellerSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      loadSettings();
    }
  }, [open]);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const [companyThRes, companyEnRes, companyRes, sellerRes] = await Promise.all([
        systemSettingsApi.getByCategory('COMPANY_TH'),
        systemSettingsApi.getByCategory('COMPANY_EN'),
        systemSettingsApi.getByCategory('COMPANY'),
        userSettingsApi.getSeller(),
      ]);
      
      const companyMap: any = {};
      [...(companyThRes.data || []), ...(companyEnRes.data || []), ...(companyRes.data || [])].forEach((s: any) => {
        companyMap[s.settingKey] = s.settingValue;
      });
      setCompanySettings(companyMap);
      setSellerSettings(sellerRes.data || {});
    } catch (error) {
      console.error('Load settings error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById('quotation-print-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>ใบเสนอราคา ${quotation.docFullNo || ''}</title>
              <style>
                @page { size: A4; margin: 10mm; }
                body { font-family: 'Sarabun', 'TH Sarabun New', sans-serif; font-size: 14px; margin: 0; padding: 10px; }
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #000; padding: 4px 8px; }
                th { background: #f0f0f0; }
                .no-border { border: none !important; }
                .text-right { text-align: right; }
                .text-center { text-align: center; }
                .bold { font-weight: bold; }
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
        if (position === 1 && digit === 1) {
          result = 'สิบ' + result;
        } else if (position === 1 && digit === 2) {
          result = 'ยี่สิบ' + result;
        } else if (position === 0 && digit === 1 && baht > 10) {
          result = 'เอ็ด' + result;
        } else {
          result = units[digit] + positions[position] + result;
        }
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

  const formatNumber = (num: number) => {
    return num.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getSellerName = () => {
    const parts = [];
    if (sellerSettings.name) parts.push(sellerSettings.name);
    if (sellerSettings.surname) parts.push(sellerSettings.surname);
    if (sellerSettings.nickname) parts.push(`(${sellerSettings.nickname})`);
    return parts.length > 0 ? parts.join(' ') : '-';
  };

  // Check if discount should be hidden
  const hideDiscount = quotation.discountDisplayMode === 'HIDE';

  return (
    <Modal
      title="ตัวอย่างใบเสนอราคา"
      open={open}
      onCancel={onClose}
      width={900}
      footer={[
        <Button key="close" onClick={onClose}>ปิด</Button>,
        <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>
          พิมพ์
        </Button>,
      ]}
      styles={{ body: { maxHeight: '80vh', overflow: 'auto', background: '#fff' } }}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>
      ) : (
        <div id="quotation-print-content" style={{ padding: 20, background: '#fff', color: '#000', fontFamily: 'Sarabun, sans-serif' }}>
          
          {/* Header - Company Info with Logo in center */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 10 }}>
            <tbody>
              <tr>
                <td style={{ width: '40%', verticalAlign: 'top', border: 'none', paddingRight: 10 }}>
                  <div style={{ fontWeight: 'bold', fontSize: 14 }}>
                    {companySettings.COMPANY_NAME_TH || 'บริษัท แสงวิทย์ ซายน์ จำกัด'}
                  </div>
                  <div style={{ fontSize: 12 }}>{companySettings.COMPANY_ADDRESS1_TH || '123/4-5 ซอยสมเด็จพระปิ่นเกล้า 9 ถ.สมเด็จพระปิ่นเกล้า'}</div>
                  <div style={{ fontSize: 12 }}>{companySettings.COMPANY_ADDRESS2_TH || 'แขวงอรุณอมรินทร์ เขตบางกอกน้อย'} {companySettings.COMPANY_ADDRESS3_TH || 'กรุงเทพฯ 10700'}</div>
                  <div style={{ fontSize: 12 }}>โทร. {companySettings.COMPANY_PHONE_TH || '(662) 886-9200-7'} แฟกซ์. {companySettings.COMPANY_FAX_TH || '(662) 433-9168'}</div>
                  <div style={{ fontSize: 12 }}>E-mail : {companySettings.COMPANY_EMAIL || 'info@saengvithscience.co.th'}</div>
                  <div style={{ fontSize: 12 }}>เลขประจำตัวผู้เสียภาษีอากร {companySettings.COMPANY_TAX_ID || '0105545053424'}</div>
                </td>
                <td style={{ width: '20%', verticalAlign: 'middle', border: 'none', textAlign: 'center' }}>
                  {companySettings.COMPANY_LOGO_URL && (
                    <img src={companySettings.COMPANY_LOGO_URL} alt="Company Logo" style={{ maxHeight: 90, maxWidth: 130 }} />
                  )}
                </td>
                <td style={{ width: '40%', verticalAlign: 'top', border: 'none', textAlign: 'right', paddingLeft: 10 }}>
                  <div style={{ fontWeight: 'bold', fontSize: 14 }}>
                    {companySettings.COMPANY_NAME_EN || 'Saengvith Science Co.,Ltd.'}
                  </div>
                  <div style={{ fontSize: 12 }}>{companySettings.COMPANY_ADDRESS1_EN || '123/4-5 Soi Somdetphrapinklao 9, Somdetphrapinklao Road'}</div>
                  <div style={{ fontSize: 12 }}>{companySettings.COMPANY_ADDRESS2_EN || 'Arun Amarin, Bangkoknoi, Bangkok 10700 Thailand'}</div>
                  <div style={{ fontSize: 12 }}>Tel. {companySettings.COMPANY_PHONE_EN || '(662) 886-9200-7'} Fax. {companySettings.COMPANY_FAX_EN || '(662) 433-9168'}</div>
                  <div style={{ fontSize: 12 }}>E-mail : {companySettings.COMPANY_EMAIL || 'info@saengvithscience.co.th'}</div>
                  <div style={{ fontSize: 12 }}>Tax ID {companySettings.COMPANY_TAX_ID || '0105545053424'}</div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Title */}
          <div style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', margin: '15px 0', borderTop: '2px solid #000', borderBottom: '2px solid #000', padding: '8px 0' }}>
            ใบเสนอราคา / Quotation
          </div>

          {/* Customer & Doc Info */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 10 }}>
            <tbody>
              <tr>
                <td style={{ width: '60%', verticalAlign: 'top', border: '1px solid #000', padding: 8 }}>
                  <div><strong>เรื่อง</strong> เสนอราคา</div>
                  <div><strong>เรียน</strong> {customer?.contactPerson || quotation.contactPerson || customer?.name || '-'}</div>
                  <div><strong>ที่อยู่</strong> {customer?.name || quotation.customerName || '-'}</div>
                  <div style={{ paddingLeft: 30 }}>{customer?.address || quotation.customerAddress || '-'}</div>
                  <div style={{ marginTop: 5 }}>
                    <strong>E-mail :</strong> {customer?.contactEmail || quotation.contactEmail || '-'}
                  </div>
                  <div>
                    <strong>โทร/Tel :</strong> {customer?.contactPhone || quotation.contactPhone || '-'}
                    &nbsp;&nbsp;&nbsp;
                    <strong>แฟกซ์/Fax :</strong> -
                  </div>
                </td>
                <td style={{ width: '40%', verticalAlign: 'top', border: '1px solid #000', padding: 8 }}>
                  <div><strong>เลขที่/No. :</strong> {quotation.docFullNo || 'QT-XXXXXXXX'}</div>
                  <div><strong>วันที่/Date :</strong> {formatDate(quotation.docDate)}</div>
                  <div><strong>กำหนดยืนราคา/Validity :</strong> {quotation.validDays || 30} วัน</div>
                  <div><strong>กำหนดส่งของ/Delivery :</strong> {quotation.deliveryDays || 60} วัน</div>
                  <div><strong>กำหนดชำระ/Payment Term :</strong> {quotation.creditTermDays || 30} วัน</div>
                  <div style={{ marginTop: 5 }}>
                    <strong>พนักงานขาย/Sales :</strong> {getSellerName()}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Items Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 10 }}>
            <thead>
              <tr style={{ background: '#f0f0f0' }}>
                <th style={{ border: '1px solid #000', padding: 6, width: 40 }}>ลำดับ<br/>Item</th>
                <th style={{ border: '1px solid #000', padding: 6, width: 60 }}>จำนวน<br/>Qty</th>
                <th style={{ border: '1px solid #000', padding: 6, width: 100 }}>รหัสสินค้า<br/>Part No.</th>
                <th style={{ border: '1px solid #000', padding: 6 }}>รายการ / Description</th>
                <th style={{ border: '1px solid #000', padding: 6, width: 100 }}>ราคา/หน่วย<br/>Unit Price</th>
                <th style={{ border: '1px solid #000', padding: 6, width: 100 }}>จำนวนเงิน<br/>Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ border: '1px solid #000', padding: 6, textAlign: 'center' }}>{idx + 1}</td>
                  <td style={{ border: '1px solid #000', padding: 6, textAlign: 'center', verticalAlign: 'top' }}>{item.qty} {item.unit}</td>
                  <td style={{ border: '1px solid #000', padding: 6, fontSize: 11, verticalAlign: 'top' }}>{item.itemCode}</td>
                  <td style={{ border: '1px solid #000', padding: 6, verticalAlign: 'top' }}>
                    <div style={{ fontWeight: 500 }}>{item.itemName}</div>
                    {item.itemDescription && (
                      <div style={{ fontSize: 9, color: '#333', marginTop: 6, whiteSpace: 'pre-line', lineHeight: 1.4 }}>
                        {item.itemDescription}
                      </div>
                    )}
                  </td>
                  <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', verticalAlign: 'top' }}>{formatNumber(item.unitPrice)}</td>
                  <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', verticalAlign: 'top' }}>{formatNumber(item.lineTotal)}</td>
                </tr>
              ))}
              {/* Empty rows for spacing */}
              {items.length < 8 && [...Array(8 - items.length)].map((_, idx) => (
                <tr key={`empty-${idx}`}>
                  <td style={{ border: '1px solid #000', padding: 6, height: 25 }}>&nbsp;</td>
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
                <td style={{ border: '1px solid #000', width: '70%', padding: 6 }} rowSpan={hideDiscount ? 3 : 5}>
                  <div style={{ fontWeight: 'bold', textAlign: 'center', fontSize: 16 }}>
                    ({numberToThaiText(quotation.grandTotal)})
                  </div>
                </td>
                <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right' }}>ราคาสินค้ารวม</td>
                <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', width: 100 }}>
                  {formatNumber(hideDiscount ? quotation.afterDiscount : quotation.subtotal)}
                </td>
              </tr>
              {!hideDiscount && (
                <tr>
                  <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right' }}>ส่วนลด</td>
                  <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right' }}>{formatNumber(quotation.discountAmount)}</td>
                </tr>
              )}
              {!hideDiscount && (
                <tr>
                  <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right' }}>ราคาหลังหักส่วนลด</td>
                  <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right' }}>{formatNumber(quotation.afterDiscount)}</td>
                </tr>
              )}
              <tr>
                <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right' }}>ภาษีมูลค่าเพิ่ม 7%</td>
                <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right' }}>{formatNumber(quotation.taxAmount)}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', fontWeight: 'bold' }}>รวมทั้งสิ้น / Grand Total</td>
                <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', fontWeight: 'bold' }}>{formatNumber(quotation.grandTotal)}</td>
              </tr>
            </tbody>
          </table>

          {/* Remark - แสดงเฉพาะเมื่อมีข้อมูล */}
          {quotation.publicNote && (
            <div style={{ border: '1px solid #000', padding: 8, marginBottom: 10, minHeight: 40 }}>
              <strong>หมายเหตุ/Remark :</strong> {quotation.publicNote}
            </div>
          )}

          {/* Signatures */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ width: '50%', border: '1px solid #000', padding: 15, textAlign: 'center', verticalAlign: 'bottom', height: 120 }}>
                  <div style={{ marginBottom: 40 }}>อนุมัติการสั่งซื้อ / Purchase Approved</div>
                  <div>(..........................................)</div>
                  <div>วันที่/Date ......./......./.......</div>
                </td>
                <td style={{ width: '50%', border: '1px solid #000', padding: 15, textAlign: 'center', verticalAlign: 'top' }}>
                  <div style={{ marginBottom: 5 }}>ขอแสดงความนับถืออย่างสูง / Yours Sincerely</div>
                  <div style={{ marginBottom: 5 }}>
                    {companySettings.COMPANY_NAME_TH || 'บริษัท แสงวิทย์ ซายน์ จำกัด'}
                  </div>
                  {/* ลายเซ็นกรรมการ */}
                  <div style={{ minHeight: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {companySettings.COMPANY_SIGNATURE_URL ? (
                      <img src={companySettings.COMPANY_SIGNATURE_URL} alt="MD Signature" style={{ maxHeight: 50 }} />
                    ) : (
                      <div style={{ color: '#ccc', fontSize: 12 }}>(ลายเซ็น)</div>
                    )}
                  </div>
                  <div>({companySettings.COMPANY_MD_NAME || 'นายวิทยา แซ่ตั้ง'})</div>
                  <div>{companySettings.COMPANY_MD_TITLE || 'กรรมการผู้จัดการ / Managing Director'}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </Modal>
  );
};

export default QuotationPrintPreview;
