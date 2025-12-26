import React, { useEffect, useState } from 'react';
import { Modal, Button, Spin } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { systemSettingsApi } from '../../services/api';

interface PaymentReceiptPrintPreviewProps {
  open: boolean;
  onClose: () => void;
  receipt: any;
}

const PaymentReceiptPrintPreview: React.FC<PaymentReceiptPrintPreviewProps> = ({
  open,
  onClose,
  receipt,
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
    const printContent = document.getElementById('rv-print-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>ใบสำคัญรับ ${receipt?.docNo || ''}</title>
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

  const getPaymentMethodName = (method: string) => {
    const methods: Record<string, string> = {
      'CASH': 'เงินสด',
      'TRANSFER': 'โอนเงิน',
      'CHEQUE': 'เช็ค',
      'CREDIT_CARD': 'บัตรเครดิต',
    };
    return methods[method] || method;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'POSTED': return '#52c41a';
      case 'CANCELLED': return '#ff4d4f';
      default: return '#faad14';
    }
  };

  const getStatusName = (status: string) => {
    const statuses: Record<string, string> = {
      'DRAFT': 'ร่าง',
      'POSTED': 'บันทึกแล้ว',
      'CANCELLED': 'ยกเลิก',
    };
    return statuses[status] || status;
  };

  const items = receipt?.items || [];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={900}
      title="พิมพ์ใบสำคัญรับ (Receipt Voucher)"
      footer={[
        <Button key="close" onClick={onClose}>ปิด</Button>,
        <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>พิมพ์</Button>,
      ]}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>
      ) : (
        <div id="rv-print-content" style={{ padding: 20, background: '#fff', color: '#000', fontFamily: 'Sarabun, sans-serif' }}>
          {/* Header */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 10 }}>
            <tbody>
              <tr>
                <td style={{ width: '40%', verticalAlign: 'top', border: 'none', paddingRight: 10 }}>
                  <div style={{ fontWeight: 'bold', fontSize: 16, color: '#000' }}>
                    {companySettings.COMPANY_NAME_TH || 'บริษัท แสงวิทย์ ซายน์ จำกัด'}
                  </div>
                  <div style={{ fontSize: 12, color: '#000' }}>{companySettings.COMPANY_ADDRESS1_TH || '123/4-5 ซอยสมเด็จพระปิ่นเกล้า 9 ถ.สมเด็จพระปิ่นเกล้า'}</div>
                  <div style={{ fontSize: 12, color: '#000' }}>{companySettings.COMPANY_ADDRESS2_TH || 'แขวงอรุณอมรินทร์ เขตบางกอกน้อย'} {companySettings.COMPANY_ADDRESS3_TH || 'กรุงเทพฯ 10700'}</div>
                  <div style={{ fontSize: 12, color: '#000' }}>โทร. {companySettings.COMPANY_PHONE_TH || '(662) 886-9200-7'}</div>
                  <div style={{ fontSize: 12, fontWeight: 'bold', color: '#000' }}>เลขประจำตัวผู้เสียภาษีอากร {companySettings.COMPANY_TAX_ID || '0105545053424'}</div>
                </td>
                <td style={{ width: '20%', verticalAlign: 'middle', border: 'none', textAlign: 'center' }}>
                  {companySettings.COMPANY_LOGO_URL && (
                    <img src={companySettings.COMPANY_LOGO_URL} alt="Company Logo" style={{ maxHeight: 80, maxWidth: 120 }} />
                  )}
                </td>
                <td style={{ width: '40%', verticalAlign: 'top', border: 'none', textAlign: 'right', paddingLeft: 10 }}>
                  <div style={{ fontWeight: 'bold', fontSize: 14, color: '#000' }}>
                    {companySettings.COMPANY_NAME_EN || 'Saengvith Science Co.,Ltd.'}
                  </div>
                  <div style={{ fontSize: 12, color: '#000' }}>{companySettings.COMPANY_ADDRESS1_EN || '123/4-5 Soi Somdetphrapinklao 9, Somdetphrapinklao Road'}</div>
                  <div style={{ fontSize: 12, color: '#000' }}>{companySettings.COMPANY_ADDRESS2_EN || 'Arun Amarin, Bangkoknoi, Bangkok 10700 Thailand'}</div>
                  <div style={{ fontSize: 12, color: '#000' }}>Tel. {companySettings.COMPANY_PHONE_EN || '(662) 886-9200-7'}</div>
                  <div style={{ fontSize: 12, fontWeight: 'bold', color: '#000' }}>Tax ID {companySettings.COMPANY_TAX_ID || '0105545053424'}</div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Title */}
          <div style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', margin: '15px 0', borderTop: '2px solid #000', borderBottom: '2px solid #000', padding: '8px 0', color: '#000' }}>
            ใบสำคัญรับ
            <div style={{ fontSize: 14, color: '#000' }}>RECEIPT VOUCHER</div>
          </div>

          {/* Document Info */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 15 }}>
            <tbody>
              <tr>
                <td style={{ width: '60%', border: '1px solid #000', padding: 8 }}>
                  <div style={{ color: '#000' }}><strong>ได้รับเงินจาก / Received From:</strong></div>
                  <div style={{ fontSize: 16, fontWeight: 'bold', marginTop: 5, color: '#000' }}>{receipt?.customerName || '-'}</div>
                  <div style={{ marginTop: 5, color: '#000' }}>รหัสลูกค้า: {receipt?.customerCode || '-'}</div>
                </td>
                <td style={{ width: '40%', border: '1px solid #000', padding: 8 }}>
                  <div style={{ color: '#000' }}><strong>เลขที่ / No.:</strong> {receipt?.docNo || '-'}</div>
                  <div style={{ color: '#000' }}><strong>วันที่ / Date:</strong> {formatDate(receipt?.docDate)}</div>
                  <div style={{ color: '#000' }}><strong>สถานะ:</strong> <span style={{ color: getStatusColor(receipt?.status) }}>{getStatusName(receipt?.status)}</span></div>
                  <div style={{ color: '#000' }}><strong>วิธีชำระ:</strong> {getPaymentMethodName(receipt?.paymentMethod)}</div>
                  {receipt?.paymentMethod === 'CHEQUE' && (
                    <>
                      <div style={{ color: '#000' }}><strong>เช็คเลขที่:</strong> {receipt?.chequeNo || '-'}</div>
                      <div style={{ color: '#000' }}><strong>ธนาคาร:</strong> {receipt?.chequeBank || '-'}</div>
                    </>
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Payment Items Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 15 }}>
            <thead>
              <tr style={{ background: '#f0f0f0' }}>
                <th style={{ border: '1px solid #000', padding: 6, width: 40, color: '#000' }}>ลำดับ</th>
                <th style={{ border: '1px solid #000', padding: 6, width: 120, color: '#000' }}>เลขที่ใบแจ้งหนี้</th>
                <th style={{ border: '1px solid #000', padding: 6, color: '#000' }}>รายละเอียด</th>
                <th style={{ border: '1px solid #000', padding: 6, width: 100, color: '#000' }}>ยอดเต็ม</th>
                <th style={{ border: '1px solid #000', padding: 6, width: 100, color: '#000' }}>ส่วนลด</th>
                <th style={{ border: '1px solid #000', padding: 6, width: 100, color: '#000' }}>หัก ณ ที่จ่าย</th>
                <th style={{ border: '1px solid #000', padding: 6, width: 100, color: '#000' }}>รับชำระ</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: any, idx: number) => (
                <tr key={idx}>
                  <td style={{ border: '1px solid #000', padding: 6, textAlign: 'center', color: '#000' }}>{idx + 1}</td>
                  <td style={{ border: '1px solid #000', padding: 6, color: '#000' }}>{item.invoiceDocNo || '-'}</td>
                  <td style={{ border: '1px solid #000', padding: 6, color: '#000' }}>
                    ชำระค่าสินค้า/บริการ
                  </td>
                  <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', color: '#000' }}>
                    {formatNumber(item.invoiceAmount)}
                  </td>
                  <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', color: '#000' }}>
                    {formatNumber(item.discountAmount || 0)}
                  </td>
                  <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', color: '#000' }}>
                    {formatNumber(item.withholdingTax || 0)}
                  </td>
                  <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', color: '#000' }}>
                    {formatNumber(item.paymentAmount)}
                  </td>
                </tr>
              ))}
              {/* Empty rows */}
              {items.length < 5 && [...Array(5 - items.length)].map((_, idx) => (
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
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 15 }}>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #000', width: '55%', padding: 10, verticalAlign: 'top' }} rowSpan={4}>
                  <div style={{ fontWeight: 'bold', fontSize: 14, marginBottom: 10, color: '#000' }}>
                    จำนวนเงิน (ตัวอักษร):
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 'bold', color: '#000' }}>
                    ({numberToThaiText(Number(receipt?.netAmount || 0))})
                  </div>
                  <div style={{ marginTop: 15, color: '#000' }}><strong>หมายเหตุ:</strong> {receipt?.remark || '-'}</div>
                  {receipt?.bankAccountName && (
                    <div style={{ marginTop: 10, color: '#000' }}><strong>เข้าบัญชี:</strong> {receipt?.bankAccountName}</div>
                  )}
                </td>
                <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', color: '#000' }}>รวมยอดเต็ม</td>
                <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', width: 120, color: '#000' }}>{formatNumber(receipt?.totalAmount || 0)}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', color: '#000' }}>ส่วนลดรวม</td>
                <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', color: '#000' }}>{formatNumber(receipt?.discountAmount || 0)}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', color: '#000' }}>หัก ณ ที่จ่ายรวม</td>
                <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', color: '#000' }}>{formatNumber(receipt?.withholdingTax || 0)}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', fontWeight: 'bold', fontSize: 16, color: '#000' }}>รับชำระสุทธิ</td>
                <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', fontWeight: 'bold', fontSize: 16, color: '#000' }}>{formatNumber(receipt?.netAmount || 0)}</td>
              </tr>
            </tbody>
          </table>

          {/* Signatures */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
            <tbody>
              <tr>
                <td style={{ width: '50%', border: '1px solid #000', padding: 15, textAlign: 'center', height: 100, color: '#000' }}>
                  <div style={{ marginBottom: 40 }}>ผู้ชำระเงิน / Payer</div>
                  <div>(..........................................)</div>
                  <div>วันที่/Date ......./......./.......</div>
                </td>
                <td style={{ width: '50%', border: '1px solid #000', padding: 15, textAlign: 'center', color: '#000' }}>
                  <div style={{ marginBottom: 5 }}>ผู้รับเงิน / Received By</div>
                  <div style={{ fontWeight: 'bold' }}>{companySettings.COMPANY_NAME_TH || 'บริษัท แสงวิทย์ ซายน์ จำกัด'}</div>
                  <div style={{ marginTop: 30 }}>(..........................................)</div>
                  <div>ผู้มีอำนาจลงนาม / Authorized Signature</div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Footer Note */}
          <div style={{ marginTop: 15, fontSize: 11, color: '#666', textAlign: 'center' }}>
            เอกสารนี้พิมพ์จากระบบ SVS Business Suite | พิมพ์เมื่อ: {new Date().toLocaleString('th-TH')}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default PaymentReceiptPrintPreview;
