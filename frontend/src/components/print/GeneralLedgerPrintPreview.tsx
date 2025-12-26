import React, { useEffect, useState } from 'react';
import { Modal, Button, Spin } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { systemSettingsApi } from '../../services/api';

interface GeneralLedgerPrintPreviewProps {
  open: boolean;
  onClose: () => void;
  account: any;
  transactions: any[];
  dateRange: { startDate: string; endDate: string };
  openingBalance?: number;
}

const GeneralLedgerPrintPreview: React.FC<GeneralLedgerPrintPreviewProps> = ({
  open,
  onClose,
  account,
  transactions,
  dateRange,
  openingBalance = 0,
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
    const printContent = document.getElementById('gl-print-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>บัญชีแยกประเภท ${account?.code || ''}</title>
              <style>
                @page { size: A4 landscape; margin: 10mm; }
                body { font-family: 'Sarabun', 'TH Sarabun New', sans-serif; font-size: 11px; margin: 0; padding: 10px; color: #000; }
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #000; padding: 3px 6px; color: #000; }
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
    const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 
                        'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const thaiYear = (date.getFullYear() + 543).toString().slice(-2);
    return `${date.getDate()} ${thaiMonths[date.getMonth()]} ${thaiYear}`;
  };

  const formatDateFull = (dateStr?: string) => {
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

  // Calculate running balance
  let runningBalance = openingBalance;
  const transactionsWithBalance = transactions.map(t => {
    const debit = Number(t.debitAmount || 0);
    const credit = Number(t.creditAmount || 0);
    
    // For debit accounts (Assets, Expenses): Debit increases, Credit decreases
    // For credit accounts (Liabilities, Equity, Revenue): Credit increases, Debit decreases
    const isDebitAccount = ['ASSET', 'EXPENSE'].includes(account?.accountType);
    if (isDebitAccount) {
      runningBalance = runningBalance + debit - credit;
    } else {
      runningBalance = runningBalance - debit + credit;
    }
    
    return { ...t, balance: runningBalance };
  });

  const totalDebit = transactions.reduce((sum, t) => sum + Number(t.debitAmount || 0), 0);
  const totalCredit = transactions.reduce((sum, t) => sum + Number(t.creditAmount || 0), 0);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={1200}
      title="พิมพ์บัญชีแยกประเภท (General Ledger)"
      footer={[
        <Button key="close" onClick={onClose}>ปิด</Button>,
        <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>พิมพ์</Button>,
      ]}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>
      ) : (
        <div id="gl-print-content" style={{ padding: 15, background: '#fff', color: '#000', fontFamily: 'Sarabun, sans-serif' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 15 }}>
            <div style={{ fontWeight: 'bold', fontSize: 16, color: '#000' }}>
              {companySettings.COMPANY_NAME_TH || 'บริษัท แสงวิทย์ ซายน์ จำกัด'}
            </div>
            <div style={{ fontSize: 12, color: '#000' }}>
              เลขประจำตัวผู้เสียภาษี: {companySettings.COMPANY_TAX_ID || '0105545053424'}
            </div>
          </div>

          {/* Title */}
          <div style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold', margin: '10px 0', borderTop: '2px solid #000', borderBottom: '2px solid #000', padding: '6px 0', color: '#000' }}>
            บัญชีแยกประเภท (GENERAL LEDGER)
          </div>

          {/* Account Info */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 10 }}>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #000', padding: 6, width: '50%', color: '#000' }}>
                  <strong>รหัสบัญชี:</strong> {account?.code || '-'}<br/>
                  <strong>ชื่อบัญชี:</strong> {account?.name || '-'}
                </td>
                <td style={{ border: '1px solid #000', padding: 6, width: '25%', color: '#000' }}>
                  <strong>ประเภท:</strong> {account?.accountType || '-'}<br/>
                  <strong>กลุ่ม:</strong> {account?.accountGroup || '-'}
                </td>
                <td style={{ border: '1px solid #000', padding: 6, width: '25%', color: '#000' }}>
                  <strong>งวด:</strong> {formatDateFull(dateRange.startDate)}<br/>
                  <strong>ถึง:</strong> {formatDateFull(dateRange.endDate)}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Transactions Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 10 }}>
            <thead>
              <tr style={{ background: '#f0f0f0' }}>
                <th style={{ border: '1px solid #000', padding: 4, width: 70, color: '#000' }}>วันที่</th>
                <th style={{ border: '1px solid #000', padding: 4, width: 100, color: '#000' }}>เลขที่เอกสาร</th>
                <th style={{ border: '1px solid #000', padding: 4, color: '#000' }}>รายการ / คำอธิบาย</th>
                <th style={{ border: '1px solid #000', padding: 4, width: 100, color: '#000' }}>เลขที่อ้างอิง</th>
                <th style={{ border: '1px solid #000', padding: 4, width: 100, color: '#000' }}>เดบิต</th>
                <th style={{ border: '1px solid #000', padding: 4, width: 100, color: '#000' }}>เครดิต</th>
                <th style={{ border: '1px solid #000', padding: 4, width: 100, color: '#000' }}>ยอดคงเหลือ</th>
              </tr>
            </thead>
            <tbody>
              {/* Opening Balance */}
              <tr style={{ background: '#fafafa' }}>
                <td style={{ border: '1px solid #000', padding: 4, textAlign: 'center', color: '#000' }}>
                  {formatDate(dateRange.startDate)}
                </td>
                <td style={{ border: '1px solid #000', padding: 4, color: '#000' }}>-</td>
                <td style={{ border: '1px solid #000', padding: 4, fontWeight: 'bold', color: '#000' }}>
                  ยอดยกมา (Opening Balance)
                </td>
                <td style={{ border: '1px solid #000', padding: 4, color: '#000' }}>-</td>
                <td style={{ border: '1px solid #000', padding: 4, textAlign: 'right', color: '#000' }}>-</td>
                <td style={{ border: '1px solid #000', padding: 4, textAlign: 'right', color: '#000' }}>-</td>
                <td style={{ border: '1px solid #000', padding: 4, textAlign: 'right', fontWeight: 'bold', color: '#000' }}>
                  {formatNumber(openingBalance)}
                </td>
              </tr>

              {/* Transactions */}
              {transactionsWithBalance.map((t: any, idx: number) => (
                <tr key={idx}>
                  <td style={{ border: '1px solid #000', padding: 4, textAlign: 'center', color: '#000' }}>
                    {formatDate(t.docDate)}
                  </td>
                  <td style={{ border: '1px solid #000', padding: 4, color: '#000' }}>{t.docNo || '-'}</td>
                  <td style={{ border: '1px solid #000', padding: 4, color: '#000' }}>
                    {t.description || '-'}
                    {t.partnerName && <span style={{ fontSize: 10, color: '#666' }}> ({t.partnerName})</span>}
                  </td>
                  <td style={{ border: '1px solid #000', padding: 4, color: '#000' }}>{t.referenceDocNo || '-'}</td>
                  <td style={{ border: '1px solid #000', padding: 4, textAlign: 'right', color: '#000' }}>
                    {Number(t.debitAmount) > 0 ? formatNumber(t.debitAmount) : '-'}
                  </td>
                  <td style={{ border: '1px solid #000', padding: 4, textAlign: 'right', color: '#000' }}>
                    {Number(t.creditAmount) > 0 ? formatNumber(t.creditAmount) : '-'}
                  </td>
                  <td style={{ border: '1px solid #000', padding: 4, textAlign: 'right', fontWeight: 'bold', color: '#000' }}>
                    {formatNumber(t.balance)}
                  </td>
                </tr>
              ))}

              {/* Empty rows if few transactions */}
              {transactionsWithBalance.length < 10 && [...Array(10 - transactionsWithBalance.length)].map((_, idx) => (
                <tr key={`empty-${idx}`}>
                  <td style={{ border: '1px solid #000', padding: 4, height: 20 }}>&nbsp;</td>
                  <td style={{ border: '1px solid #000', padding: 4 }}>&nbsp;</td>
                  <td style={{ border: '1px solid #000', padding: 4 }}>&nbsp;</td>
                  <td style={{ border: '1px solid #000', padding: 4 }}>&nbsp;</td>
                  <td style={{ border: '1px solid #000', padding: 4 }}>&nbsp;</td>
                  <td style={{ border: '1px solid #000', padding: 4 }}>&nbsp;</td>
                  <td style={{ border: '1px solid #000', padding: 4 }}>&nbsp;</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: '#f9f9f9', fontWeight: 'bold' }}>
                <td colSpan={4} style={{ border: '1px solid #000', padding: 6, textAlign: 'right', color: '#000' }}>
                  รวมเคลื่อนไหว (Total Movement)
                </td>
                <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', color: '#000' }}>
                  {formatNumber(totalDebit)}
                </td>
                <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', color: '#000' }}>
                  {formatNumber(totalCredit)}
                </td>
                <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', color: '#000' }}>
                  {formatNumber(runningBalance)}
                </td>
              </tr>
              <tr style={{ background: '#e6f7ff', fontWeight: 'bold', fontSize: 13 }}>
                <td colSpan={4} style={{ border: '1px solid #000', padding: 8, textAlign: 'right', color: '#000' }}>
                  ยอดคงเหลือ ณ วันสิ้นงวด (Closing Balance)
                </td>
                <td colSpan={2} style={{ border: '1px solid #000', padding: 8, textAlign: 'center', color: '#000' }}>
                  {formatDateFull(dateRange.endDate)}
                </td>
                <td style={{ border: '2px solid #000', padding: 8, textAlign: 'right', fontSize: 14, color: '#000' }}>
                  {formatNumber(runningBalance)}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Footer */}
          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ textAlign: 'center', width: '30%' }}>
              <div style={{ borderTop: '1px solid #000', paddingTop: 5, marginTop: 40 }}>
                ผู้จัดทำ
              </div>
            </div>
            <div style={{ textAlign: 'center', width: '30%' }}>
              <div style={{ borderTop: '1px solid #000', paddingTop: 5, marginTop: 40 }}>
                ผู้ตรวจสอบ
              </div>
            </div>
            <div style={{ textAlign: 'center', width: '30%' }}>
              <div style={{ borderTop: '1px solid #000', paddingTop: 5, marginTop: 40 }}>
                ผู้อนุมัติ
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div style={{ marginTop: 15, fontSize: 10, color: '#666', textAlign: 'center' }}>
            เอกสารนี้พิมพ์จากระบบ SVS Business Suite | พิมพ์เมื่อ: {new Date().toLocaleString('th-TH')}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default GeneralLedgerPrintPreview;
