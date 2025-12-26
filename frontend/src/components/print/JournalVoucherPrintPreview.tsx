import React, { useEffect, useState } from 'react';
import { Modal, Button, Spin } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { systemSettingsApi } from '../../services/api';

interface JournalVoucherPrintPreviewProps {
  open: boolean;
  onClose: () => void;
  journalEntry: any;
}

const JournalVoucherPrintPreview: React.FC<JournalVoucherPrintPreviewProps> = ({
  open,
  onClose,
  journalEntry,
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
    const printContent = document.getElementById('jv-print-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>ใบสำคัญทั่วไป ${journalEntry?.docNo || ''}</title>
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

  const getJournalTypeName = (type: string) => {
    const types: Record<string, string> = {
      'GENERAL': 'ทั่วไป',
      'SALES': 'ขาย',
      'PURCHASE': 'ซื้อ',
      'CASH_RECEIPT': 'รับเงิน',
      'CASH_PAYMENT': 'จ่ายเงิน',
      'ADJUSTMENT': 'ปรับปรุง',
    };
    return types[type] || type;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'POSTED': return '#52c41a';
      case 'CANCELLED': return '#ff4d4f';
      case 'REVERSED': return '#722ed1';
      default: return '#faad14';
    }
  };

  const getStatusName = (status: string) => {
    const statuses: Record<string, string> = {
      'DRAFT': 'ร่าง',
      'POSTED': 'บันทึกแล้ว',
      'CANCELLED': 'ยกเลิก',
      'REVERSED': 'กลับรายการ',
    };
    return statuses[status] || status;
  };

  const lines = journalEntry?.lines || [];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={900}
      title="พิมพ์ใบสำคัญทั่วไป (Journal Voucher)"
      footer={[
        <Button key="close" onClick={onClose}>ปิด</Button>,
        <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>พิมพ์</Button>,
      ]}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>
      ) : (
        <div id="jv-print-content" style={{ padding: 20, background: '#fff', color: '#000', fontFamily: 'Sarabun, sans-serif' }}>
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
            ใบสำคัญทั่วไป
            <div style={{ fontSize: 14, color: '#000' }}>JOURNAL VOUCHER</div>
          </div>

          {/* Document Info */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 15 }}>
            <tbody>
              <tr>
                <td style={{ width: '50%', border: '1px solid #000', padding: 8 }}>
                  <div style={{ color: '#000' }}><strong>เลขที่เอกสาร / Doc No.:</strong> {journalEntry?.docNo || '-'}</div>
                  <div style={{ color: '#000' }}><strong>วันที่ / Date:</strong> {formatDate(journalEntry?.docDate)}</div>
                  <div style={{ color: '#000' }}><strong>ประเภท / Type:</strong> {getJournalTypeName(journalEntry?.journalType)}</div>
                </td>
                <td style={{ width: '50%', border: '1px solid #000', padding: 8 }}>
                  <div style={{ color: '#000' }}><strong>งวด / Period:</strong> {journalEntry?.periodMonth}/{journalEntry?.periodYear}</div>
                  <div style={{ color: '#000' }}><strong>สถานะ / Status:</strong> <span style={{ color: getStatusColor(journalEntry?.status) }}>{getStatusName(journalEntry?.status)}</span></div>
                  <div style={{ color: '#000' }}><strong>อ้างอิง / Reference:</strong> {journalEntry?.referenceDocNo || '-'}</div>
                </td>
              </tr>
              <tr>
                <td colSpan={2} style={{ border: '1px solid #000', padding: 8 }}>
                  <div style={{ color: '#000' }}><strong>คำอธิบาย / Description:</strong> {journalEntry?.description || '-'}</div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Journal Lines Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 15 }}>
            <thead>
              <tr style={{ background: '#f0f0f0' }}>
                <th style={{ border: '1px solid #000', padding: 6, width: 40, color: '#000' }}>ลำดับ</th>
                <th style={{ border: '1px solid #000', padding: 6, width: 80, color: '#000' }}>รหัสบัญชี</th>
                <th style={{ border: '1px solid #000', padding: 6, color: '#000' }}>ชื่อบัญชี / คำอธิบาย</th>
                <th style={{ border: '1px solid #000', padding: 6, width: 120, color: '#000' }}>เดบิต (Debit)</th>
                <th style={{ border: '1px solid #000', padding: 6, width: 120, color: '#000' }}>เครดิต (Credit)</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line: any, idx: number) => (
                <tr key={idx}>
                  <td style={{ border: '1px solid #000', padding: 6, textAlign: 'center', color: '#000' }}>{line.lineNo || idx + 1}</td>
                  <td style={{ border: '1px solid #000', padding: 6, color: '#000' }}>{line.accountCode || '-'}</td>
                  <td style={{ border: '1px solid #000', padding: 6, color: '#000' }}>
                    <div style={{ fontWeight: 500 }}>{line.accountName}</div>
                    {line.description && <div style={{ fontSize: 12, color: '#333' }}>{line.description}</div>}
                    {line.partnerName && <div style={{ fontSize: 12, color: '#666' }}>คู่ค้า: {line.partnerName}</div>}
                  </td>
                  <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', color: '#000' }}>
                    {Number(line.debitAmount) > 0 ? formatNumber(line.debitAmount) : '-'}
                  </td>
                  <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', color: '#000' }}>
                    {Number(line.creditAmount) > 0 ? formatNumber(line.creditAmount) : '-'}
                  </td>
                </tr>
              ))}
              {/* Empty rows for minimum 8 lines */}
              {lines.length < 8 && [...Array(8 - lines.length)].map((_, idx) => (
                <tr key={`empty-${idx}`}>
                  <td style={{ border: '1px solid #000', padding: 6, height: 25 }}>&nbsp;</td>
                  <td style={{ border: '1px solid #000', padding: 6 }}>&nbsp;</td>
                  <td style={{ border: '1px solid #000', padding: 6 }}>&nbsp;</td>
                  <td style={{ border: '1px solid #000', padding: 6 }}>&nbsp;</td>
                  <td style={{ border: '1px solid #000', padding: 6 }}>&nbsp;</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: '#f9f9f9' }}>
                <td colSpan={3} style={{ border: '1px solid #000', padding: 8, textAlign: 'right', fontWeight: 'bold', color: '#000' }}>
                  รวม / Total
                </td>
                <td style={{ border: '1px solid #000', padding: 8, textAlign: 'right', fontWeight: 'bold', color: '#000' }}>
                  {formatNumber(journalEntry?.totalDebit || 0)}
                </td>
                <td style={{ border: '1px solid #000', padding: 8, textAlign: 'right', fontWeight: 'bold', color: '#000' }}>
                  {formatNumber(journalEntry?.totalCredit || 0)}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Signatures */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
            <tbody>
              <tr>
                <td style={{ width: '33%', border: '1px solid #000', padding: 15, textAlign: 'center', height: 100, color: '#000' }}>
                  <div style={{ marginBottom: 40 }}>ผู้จัดทำ / Prepared By</div>
                  <div>(..........................................)</div>
                  <div>วันที่/Date ......./......./.......</div>
                </td>
                <td style={{ width: '33%', border: '1px solid #000', padding: 15, textAlign: 'center', color: '#000' }}>
                  <div style={{ marginBottom: 40 }}>ผู้ตรวจสอบ / Checked By</div>
                  <div>(..........................................)</div>
                  <div>วันที่/Date ......./......./.......</div>
                </td>
                <td style={{ width: '34%', border: '1px solid #000', padding: 15, textAlign: 'center', color: '#000' }}>
                  <div style={{ marginBottom: 40 }}>ผู้อนุมัติ / Approved By</div>
                  <div>(..........................................)</div>
                  <div>วันที่/Date ......./......./.......</div>
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

export default JournalVoucherPrintPreview;
