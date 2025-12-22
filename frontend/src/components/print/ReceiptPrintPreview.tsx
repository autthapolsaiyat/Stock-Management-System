import React, { useEffect, useState } from 'react';
import { Modal, Button, Spin } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { systemSettingsApi } from '../../services/api';

interface ReceiptPrintPreviewProps {
  open: boolean;
  onClose: () => void;
  invoice: any;
}

const ReceiptPrintPreview: React.FC<ReceiptPrintPreviewProps> = ({
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
    const printContent = document.getElementById('receipt-print-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>ใบเสร็จรับเงิน ${invoice?.docFullNo || ''}</title>
              <style>
                @page { size: A4; margin: 10mm; }
                body { font-family: 'Sarabun', 'TH Sarabun New', sans-serif; font-size: 14px; margin: 0; padding: 10px; color: #000; }
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #000; padding: 4px 8px; color: #000; }
                th { background: #f0f0f0; }
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

  const paymentMethodText: Record<string, string> = {
    CASH: 'เงินสด',
    TRANSFER: 'โอนเงิน',
    CHEQUE: 'เช็ค',
    CREDIT_CARD: 'บัตรเครดิต',
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={900}
      title="พิมพ์ใบเสร็จรับเงิน"
      footer={[
        <Button key="close" onClick={onClose}>ปิด</Button>,
        <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>พิมพ์</Button>,
      ]}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>
      ) : (
        <div id="receipt-print-content" style={{ padding: 20, background: '#fff', color: '#000', fontFamily: 'Sarabun, sans-serif' }}>
          {/* Header - Same as Quotation */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 10 }}>
            <tbody>
              <tr>
                <td style={{ width: '40%', verticalAlign: 'top', border: 'none', paddingRight: 10 }}>
                  <div style={{ fontWeight: 'bold', fontSize: 14, color: '#000' }}>
                    {companySettings.COMPANY_NAME_TH || 'บริษัท แสงวิทย์ ซายน์ จำกัด'}
                  </div>
                  <div style={{ fontSize: 12, color: '#000' }}>{companySettings.COMPANY_ADDRESS1_TH || '123/4-5 ซอยสมเด็จพระปิ่นเกล้า 9 ถ.สมเด็จพระปิ่นเกล้า'}</div>
                  <div style={{ fontSize: 12, color: '#000' }}>{companySettings.COMPANY_ADDRESS2_TH || 'แขวงอรุณอมรินทร์ เขตบางกอกน้อย'} {companySettings.COMPANY_ADDRESS3_TH || 'กรุงเทพฯ 10700'}</div>
                  <div style={{ fontSize: 12, color: '#000' }}>โทร. {companySettings.COMPANY_PHONE_TH || '(662) 886-9200-7'} แฟกซ์. {companySettings.COMPANY_FAX_TH || '(662) 433-9168'}</div>
                  <div style={{ fontSize: 12, color: '#000' }}>E-mail : {companySettings.COMPANY_EMAIL || 'info@saengvithscience.co.th'}</div>
                  <div style={{ fontSize: 12, fontWeight: 'bold', color: '#000' }}>เลขประจำตัวผู้เสียภาษีอากร {companySettings.COMPANY_TAX_ID || '0105545053424'}</div>
                </td>
                <td style={{ width: '20%', verticalAlign: 'middle', border: 'none', textAlign: 'center' }}>
                  {companySettings.COMPANY_LOGO_URL && (
                    <img src={companySettings.COMPANY_LOGO_URL} alt="Company Logo" style={{ maxHeight: 90, maxWidth: 130 }} />
                  )}
                </td>
                <td style={{ width: '40%', verticalAlign: 'top', border: 'none', textAlign: 'right', paddingLeft: 10 }}>
                  <div style={{ fontWeight: 'bold', fontSize: 14, color: '#000' }}>
                    {companySettings.COMPANY_NAME_EN || 'Saengvith Science Co.,Ltd.'}
                  </div>
                  <div style={{ fontSize: 12, color: '#000' }}>{companySettings.COMPANY_ADDRESS1_EN || '123/4-5 Soi Somdetphrapinklao 9, Somdetphrapinklao Road'}</div>
                  <div style={{ fontSize: 12, color: '#000' }}>{companySettings.COMPANY_ADDRESS2_EN || 'Arun Amarin, Bangkoknoi, Bangkok 10700 Thailand'}</div>
                  <div style={{ fontSize: 12, color: '#000' }}>Tel. {companySettings.COMPANY_PHONE_EN || '(662) 886-9200-7'} Fax. {companySettings.COMPANY_FAX_EN || '(662) 433-9168'}</div>
                  <div style={{ fontSize: 12, color: '#000' }}>E-mail : {companySettings.COMPANY_EMAIL || 'info@saengvithscience.co.th'}</div>
                  <div style={{ fontSize: 12, fontWeight: 'bold', color: '#000' }}>Tax ID {companySettings.COMPANY_TAX_ID || '0105545053424'}</div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Title */}
          <div style={{ textAlign: 'center', fontSize: 22, fontWeight: 'bold', margin: '15px 0', borderTop: '2px solid #000', borderBottom: '2px solid #000', padding: '10px 0', background: '#f0f0f0', color: '#000' }}>
            ใบเสร็จรับเงิน / RECEIPT
          </div>

          {/* Customer & Doc Info */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 15 }}>
            <tbody>
              <tr>
                <td style={{ width: '60%', verticalAlign: 'top', border: '1px solid #000', padding: 10 }}>
                  <div style={{ color: '#000' }}><strong>ได้รับเงินจาก / Received from:</strong></div>
                  <div style={{ fontSize: 16, fontWeight: 'bold', marginTop: 5, color: '#000' }}>{invoice?.customerName || '-'}</div>
                  <div style={{ marginTop: 5, color: '#000' }}>{invoice?.customerAddress || '-'}</div>
                  <div style={{ marginTop: 10, color: '#000' }}>
                    <strong>เลขประจำตัวผู้เสียภาษี:</strong> {invoice?.customerTaxId || '-'}
                  </div>
                </td>
                <td style={{ width: '40%', verticalAlign: 'top', border: '1px solid #000', padding: 10 }}>
                  <div style={{ color: '#000' }}><strong>เลขที่ใบเสร็จ:</strong> RCP-{invoice?.docFullNo?.replace('INV', '') || '-'}</div>
                  <div style={{ color: '#000' }}><strong>วันที่รับเงิน:</strong> {formatDate(invoice?.paidAt)}</div>
                  <div style={{ color: '#000' }}><strong>อ้างอิงใบแจ้งหนี้:</strong> {invoice?.docFullNo || '-'}</div>
                  <div style={{ color: '#000' }}><strong>อ้างอิง QT:</strong> {invoice?.quotationDocNo || '-'}</div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Payment Details */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 15 }}>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #000', padding: 15 }}>
                  <div style={{ fontSize: 16, marginBottom: 15, color: '#000' }}>
                    <strong>รายการชำระเงิน:</strong> ค่าสินค้า/บริการตามใบแจ้งหนี้ {invoice?.docFullNo || '-'}
                  </div>
                  
                  <table style={{ width: '60%', margin: '0 auto', borderCollapse: 'collapse' }}>
                    <tbody>
                      <tr>
                        <td style={{ border: '1px solid #000', padding: 8, width: '50%', color: '#000' }}>มูลค่าสินค้า/บริการ</td>
                        <td style={{ border: '1px solid #000', padding: 8, textAlign: 'right', color: '#000' }}>{formatNumber(invoice?.subtotal || 0)}</td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid #000', padding: 8, color: '#000' }}>ภาษีมูลค่าเพิ่ม 7%</td>
                        <td style={{ border: '1px solid #000', padding: 8, textAlign: 'right', color: '#000' }}>{formatNumber(invoice?.taxAmount || 0)}</td>
                      </tr>
                      <tr style={{ background: '#f0f0f0' }}>
                        <td style={{ border: '1px solid #000', padding: 10, fontWeight: 'bold', fontSize: 16, color: '#000' }}>จำนวนเงินรวมทั้งสิ้น</td>
                        <td style={{ border: '1px solid #000', padding: 10, textAlign: 'right', fontWeight: 'bold', fontSize: 16, color: '#000' }}>{formatNumber(invoice?.grandTotal || 0)}</td>
                      </tr>
                    </tbody>
                  </table>

                  <div style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold', marginTop: 15, padding: 10, border: '2px solid #000', background: '#fff', color: '#000' }}>
                    ({numberToThaiText(Number(invoice?.grandTotal || 0))})
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Payment Method */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 15 }}>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #000', padding: 10, width: '50%', color: '#000' }}>
                  <strong>ชำระโดย / Payment Method:</strong> {paymentMethodText[invoice?.paymentMethod] || invoice?.paymentMethod || 'เงินสด'}
                </td>
                <td style={{ border: '1px solid #000', padding: 10, color: '#000' }}>
                  <strong>เลขที่อ้างอิง / Reference:</strong> {invoice?.paymentReference || '-'}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Signatures */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ width: '50%', border: '1px solid #000', padding: 20, textAlign: 'center', height: 120, color: '#000' }}>
                  <div style={{ marginBottom: 50 }}>ผู้ชำระเงิน / Payer</div>
                  <div>(..........................................)</div>
                  <div>วันที่ ......./......./.......</div>
                </td>
                <td style={{ width: '50%', border: '1px solid #000', padding: 20, textAlign: 'center', color: '#000' }}>
                  <div style={{ marginBottom: 5 }}>ผู้รับเงิน / Received By</div>
                  <div style={{ fontWeight: 'bold' }}>{companySettings.COMPANY_NAME_TH || 'บริษัท แสงวิทย์ ซายน์ จำกัด'}</div>
                  {companySettings.COMPANY_SIGNATURE_URL && (
                    <img src={companySettings.COMPANY_SIGNATURE_URL} alt="Signature" style={{ maxHeight: 40, margin: '5px 0' }} />
                  )}
                  <div>(..........................................)</div>
                  <div>ผู้มีอำนาจลงนาม</div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Footer Note */}
          <div style={{ marginTop: 15, fontSize: 12, textAlign: 'center', color: '#666' }}>
            * ใบเสร็จรับเงินฉบับนี้สมบูรณ์เมื่อได้รับการชำระเงินเรียบร้อยแล้ว *
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ReceiptPrintPreview;
