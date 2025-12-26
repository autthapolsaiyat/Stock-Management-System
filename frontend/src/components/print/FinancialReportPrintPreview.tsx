import React, { useEffect, useState } from 'react';
import { Modal, Button, Spin } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { systemSettingsApi } from '../../services/api';

interface FinancialReportPrintPreviewProps {
  open: boolean;
  onClose: () => void;
  reportType: 'TRIAL_BALANCE' | 'PROFIT_LOSS' | 'BALANCE_SHEET';
  reportData: any;
  dateRange?: { startDate: string; endDate: string };
  asOfDate?: string;
}

const FinancialReportPrintPreview: React.FC<FinancialReportPrintPreviewProps> = ({
  open,
  onClose,
  reportType,
  reportData,
  dateRange,
  asOfDate,
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
    const printContent = document.getElementById('financial-print-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${getReportTitle()}</title>
              <style>
                @page { size: A4; margin: 10mm; }
                body { font-family: 'Sarabun', 'TH Sarabun New', sans-serif; font-size: 12px; margin: 0; padding: 10px; color: #000; }
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

  const getReportTitle = () => {
    switch (reportType) {
      case 'TRIAL_BALANCE': return 'งบทดลอง (Trial Balance)';
      case 'PROFIT_LOSS': return 'งบกำไรขาดทุน (Profit & Loss Statement)';
      case 'BALANCE_SHEET': return 'งบแสดงฐานะการเงิน (Balance Sheet)';
      default: return 'รายงานการเงิน';
    }
  };

  const renderTrialBalance = () => {
    const accounts = reportData?.accounts || [];
    const totals = reportData?.totals || {};

    return (
      <>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 15 }}>
          <thead>
            <tr style={{ background: '#f0f0f0' }}>
              <th style={{ border: '1px solid #000', padding: 6, width: 80, color: '#000' }}>รหัสบัญชี</th>
              <th style={{ border: '1px solid #000', padding: 6, color: '#000' }}>ชื่อบัญชี</th>
              <th style={{ border: '1px solid #000', padding: 6, width: 100, color: '#000' }}>ยอดยกมา<br/>(เดบิต)</th>
              <th style={{ border: '1px solid #000', padding: 6, width: 100, color: '#000' }}>ยอดยกมา<br/>(เครดิต)</th>
              <th style={{ border: '1px solid #000', padding: 6, width: 100, color: '#000' }}>เคลื่อนไหว<br/>(เดบิต)</th>
              <th style={{ border: '1px solid #000', padding: 6, width: 100, color: '#000' }}>เคลื่อนไหว<br/>(เครดิต)</th>
              <th style={{ border: '1px solid #000', padding: 6, width: 100, color: '#000' }}>ยอดคงเหลือ<br/>(เดบิต)</th>
              <th style={{ border: '1px solid #000', padding: 6, width: 100, color: '#000' }}>ยอดคงเหลือ<br/>(เครดิต)</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((acc: any, idx: number) => (
              <tr key={idx}>
                <td style={{ border: '1px solid #000', padding: 4, color: '#000' }}>{acc.code}</td>
                <td style={{ border: '1px solid #000', padding: 4, color: '#000', paddingLeft: acc.level > 1 ? (acc.level - 1) * 15 : 4 }}>
                  {acc.name}
                </td>
                <td style={{ border: '1px solid #000', padding: 4, textAlign: 'right', color: '#000' }}>
                  {Number(acc.openingDebit) > 0 ? formatNumber(acc.openingDebit) : '-'}
                </td>
                <td style={{ border: '1px solid #000', padding: 4, textAlign: 'right', color: '#000' }}>
                  {Number(acc.openingCredit) > 0 ? formatNumber(acc.openingCredit) : '-'}
                </td>
                <td style={{ border: '1px solid #000', padding: 4, textAlign: 'right', color: '#000' }}>
                  {Number(acc.movementDebit) > 0 ? formatNumber(acc.movementDebit) : '-'}
                </td>
                <td style={{ border: '1px solid #000', padding: 4, textAlign: 'right', color: '#000' }}>
                  {Number(acc.movementCredit) > 0 ? formatNumber(acc.movementCredit) : '-'}
                </td>
                <td style={{ border: '1px solid #000', padding: 4, textAlign: 'right', color: '#000' }}>
                  {Number(acc.closingDebit) > 0 ? formatNumber(acc.closingDebit) : '-'}
                </td>
                <td style={{ border: '1px solid #000', padding: 4, textAlign: 'right', color: '#000' }}>
                  {Number(acc.closingCredit) > 0 ? formatNumber(acc.closingCredit) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ background: '#f9f9f9', fontWeight: 'bold' }}>
              <td colSpan={2} style={{ border: '1px solid #000', padding: 6, textAlign: 'center', color: '#000' }}>รวมทั้งสิ้น</td>
              <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', color: '#000' }}>{formatNumber(totals.openingDebit || 0)}</td>
              <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', color: '#000' }}>{formatNumber(totals.openingCredit || 0)}</td>
              <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', color: '#000' }}>{formatNumber(totals.movementDebit || 0)}</td>
              <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', color: '#000' }}>{formatNumber(totals.movementCredit || 0)}</td>
              <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', color: '#000' }}>{formatNumber(totals.totalDebit || 0)}</td>
              <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', color: '#000' }}>{formatNumber(totals.totalCredit || 0)}</td>
            </tr>
          </tfoot>
        </table>
        
        <div style={{ textAlign: 'center', padding: 10, border: '2px solid #000', marginTop: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 'bold', color: totals.totalDebit === totals.totalCredit ? '#52c41a' : '#ff4d4f' }}>
            {totals.totalDebit === totals.totalCredit ? '✓ งบทดลองสมดุล (Balanced)' : '✗ งบทดลองไม่สมดุล (Unbalanced)'}
          </span>
        </div>
      </>
    );
  };

  const renderProfitLoss = () => {
    const revenues = reportData?.revenues || [];
    const expenses = reportData?.expenses || [];
    const totalRevenue = Number(reportData?.totalRevenue || 0);
    const totalExpense = Number(reportData?.totalExpense || 0);
    const netProfit = Number(reportData?.netProfit || 0);

    return (
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 15 }}>
        <tbody>
          <tr style={{ background: '#e6f7ff' }}>
            <td colSpan={2} style={{ border: '1px solid #000', padding: 8, fontWeight: 'bold', fontSize: 14, color: '#000' }}>
              รายได้ (Revenue)
            </td>
          </tr>
          {revenues.map((item: any, idx: number) => (
            <tr key={`rev-${idx}`}>
              <td style={{ border: '1px solid #000', padding: 6, paddingLeft: 20, color: '#000' }}>
                {item.code} - {item.name}
              </td>
              <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', width: 150, color: '#000' }}>
                {formatNumber(item.amount)}
              </td>
            </tr>
          ))}
          <tr style={{ background: '#f0f0f0', fontWeight: 'bold' }}>
            <td style={{ border: '1px solid #000', padding: 8, textAlign: 'right', color: '#000' }}>รวมรายได้</td>
            <td style={{ border: '1px solid #000', padding: 8, textAlign: 'right', color: '#000' }}>{formatNumber(totalRevenue)}</td>
          </tr>

          <tr><td colSpan={2} style={{ border: 'none', height: 10 }}></td></tr>

          <tr style={{ background: '#fff1f0' }}>
            <td colSpan={2} style={{ border: '1px solid #000', padding: 8, fontWeight: 'bold', fontSize: 14, color: '#000' }}>
              ค่าใช้จ่าย (Expenses)
            </td>
          </tr>
          {expenses.map((item: any, idx: number) => (
            <tr key={`exp-${idx}`}>
              <td style={{ border: '1px solid #000', padding: 6, paddingLeft: 20, color: '#000' }}>
                {item.code} - {item.name}
              </td>
              <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', color: '#000' }}>
                {formatNumber(item.amount)}
              </td>
            </tr>
          ))}
          <tr style={{ background: '#f0f0f0', fontWeight: 'bold' }}>
            <td style={{ border: '1px solid #000', padding: 8, textAlign: 'right', color: '#000' }}>รวมค่าใช้จ่าย</td>
            <td style={{ border: '1px solid #000', padding: 8, textAlign: 'right', color: '#000' }}>({formatNumber(totalExpense)})</td>
          </tr>

          <tr><td colSpan={2} style={{ border: 'none', height: 10 }}></td></tr>
          <tr style={{ background: netProfit >= 0 ? '#f6ffed' : '#fff1f0', fontWeight: 'bold', fontSize: 16 }}>
            <td style={{ border: '2px solid #000', padding: 10, textAlign: 'right', color: '#000' }}>
              {netProfit >= 0 ? 'กำไรสุทธิ (Net Profit)' : 'ขาดทุนสุทธิ (Net Loss)'}
            </td>
            <td style={{ border: '2px solid #000', padding: 10, textAlign: 'right', color: netProfit >= 0 ? '#52c41a' : '#ff4d4f' }}>
              {formatNumber(Math.abs(netProfit))}
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  const renderBalanceSheet = () => {
    const assets = reportData?.assets || [];
    const liabilities = reportData?.liabilities || [];
    const equity = reportData?.equity || [];
    const totalAssets = Number(reportData?.totalAssets || 0);
    const totalLiabilities = Number(reportData?.totalLiabilities || 0);
    const totalEquity = Number(reportData?.totalEquity || 0);

    return (
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 15 }}>
        <tbody>
          <tr style={{ background: '#e6f7ff' }}>
            <td colSpan={2} style={{ border: '1px solid #000', padding: 8, fontWeight: 'bold', fontSize: 14, color: '#000' }}>
              สินทรัพย์ (Assets)
            </td>
          </tr>
          {assets.map((item: any, idx: number) => (
            <tr key={`asset-${idx}`}>
              <td style={{ border: '1px solid #000', padding: 6, paddingLeft: item.level > 1 ? item.level * 15 : 20, color: '#000' }}>
                {item.code} - {item.name}
              </td>
              <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', width: 150, color: '#000' }}>
                {formatNumber(item.balance)}
              </td>
            </tr>
          ))}
          <tr style={{ background: '#f0f0f0', fontWeight: 'bold' }}>
            <td style={{ border: '1px solid #000', padding: 8, textAlign: 'right', color: '#000' }}>รวมสินทรัพย์</td>
            <td style={{ border: '1px solid #000', padding: 8, textAlign: 'right', color: '#000' }}>{formatNumber(totalAssets)}</td>
          </tr>

          <tr><td colSpan={2} style={{ border: 'none', height: 15 }}></td></tr>

          <tr style={{ background: '#fff1f0' }}>
            <td colSpan={2} style={{ border: '1px solid #000', padding: 8, fontWeight: 'bold', fontSize: 14, color: '#000' }}>
              หนี้สิน (Liabilities)
            </td>
          </tr>
          {liabilities.map((item: any, idx: number) => (
            <tr key={`liab-${idx}`}>
              <td style={{ border: '1px solid #000', padding: 6, paddingLeft: item.level > 1 ? item.level * 15 : 20, color: '#000' }}>
                {item.code} - {item.name}
              </td>
              <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', color: '#000' }}>
                {formatNumber(item.balance)}
              </td>
            </tr>
          ))}
          <tr style={{ background: '#f0f0f0', fontWeight: 'bold' }}>
            <td style={{ border: '1px solid #000', padding: 8, textAlign: 'right', color: '#000' }}>รวมหนี้สิน</td>
            <td style={{ border: '1px solid #000', padding: 8, textAlign: 'right', color: '#000' }}>{formatNumber(totalLiabilities)}</td>
          </tr>

          <tr><td colSpan={2} style={{ border: 'none', height: 15 }}></td></tr>

          <tr style={{ background: '#f6ffed' }}>
            <td colSpan={2} style={{ border: '1px solid #000', padding: 8, fontWeight: 'bold', fontSize: 14, color: '#000' }}>
              ส่วนของผู้ถือหุ้น (Equity)
            </td>
          </tr>
          {equity.map((item: any, idx: number) => (
            <tr key={`eq-${idx}`}>
              <td style={{ border: '1px solid #000', padding: 6, paddingLeft: item.level > 1 ? item.level * 15 : 20, color: '#000' }}>
                {item.code} - {item.name}
              </td>
              <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', color: '#000' }}>
                {formatNumber(item.balance)}
              </td>
            </tr>
          ))}
          <tr style={{ background: '#f0f0f0', fontWeight: 'bold' }}>
            <td style={{ border: '1px solid #000', padding: 8, textAlign: 'right', color: '#000' }}>รวมส่วนของผู้ถือหุ้น</td>
            <td style={{ border: '1px solid #000', padding: 8, textAlign: 'right', color: '#000' }}>{formatNumber(totalEquity)}</td>
          </tr>

          <tr><td colSpan={2} style={{ border: 'none', height: 10 }}></td></tr>
          <tr style={{ fontWeight: 'bold', fontSize: 14 }}>
            <td style={{ border: '2px solid #000', padding: 10, textAlign: 'right', color: '#000' }}>
              รวมหนี้สินและส่วนของผู้ถือหุ้น
            </td>
            <td style={{ border: '2px solid #000', padding: 10, textAlign: 'right', color: '#000' }}>
              {formatNumber(totalLiabilities + totalEquity)}
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={reportType === 'TRIAL_BALANCE' ? 1100 : 800}
      title={`พิมพ์${getReportTitle()}`}
      footer={[
        <Button key="close" onClick={onClose}>ปิด</Button>,
        <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>พิมพ์</Button>,
      ]}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>
      ) : (
        <div id="financial-print-content" style={{ padding: 20, background: '#fff', color: '#000', fontFamily: 'Sarabun, sans-serif' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontWeight: 'bold', fontSize: 18, color: '#000' }}>
              {companySettings.COMPANY_NAME_TH || 'บริษัท แสงวิทย์ ซายน์ จำกัด'}
            </div>
            <div style={{ fontSize: 14, color: '#000' }}>
              {companySettings.COMPANY_NAME_EN || 'Saengvith Science Co.,Ltd.'}
            </div>
            <div style={{ fontSize: 12, color: '#000' }}>
              เลขประจำตัวผู้เสียภาษี: {companySettings.COMPANY_TAX_ID || '0105545053424'}
            </div>
          </div>

          {/* Title */}
          <div style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold', margin: '15px 0', borderTop: '2px solid #000', borderBottom: '2px solid #000', padding: '8px 0', color: '#000' }}>
            {getReportTitle()}
          </div>

          {/* Date Range */}
          <div style={{ textAlign: 'center', marginBottom: 15, color: '#000' }}>
            {reportType === 'BALANCE_SHEET' ? (
              <span>ณ วันที่ {formatDate(asOfDate)}</span>
            ) : (
              <span>สำหรับงวด {formatDate(dateRange?.startDate)} ถึง {formatDate(dateRange?.endDate)}</span>
            )}
          </div>

          {/* Report Content */}
          {reportType === 'TRIAL_BALANCE' && renderTrialBalance()}
          {reportType === 'PROFIT_LOSS' && renderProfitLoss()}
          {reportType === 'BALANCE_SHEET' && renderBalanceSheet()}

          {/* Footer */}
          <div style={{ marginTop: 30, display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ textAlign: 'center', width: '30%' }}>
              <div style={{ borderTop: '1px solid #000', paddingTop: 5, marginTop: 50 }}>
                ผู้จัดทำ / Prepared By
              </div>
              <div style={{ fontSize: 11, color: '#666' }}>วันที่ ......./......./.......</div>
            </div>
            <div style={{ textAlign: 'center', width: '30%' }}>
              <div style={{ borderTop: '1px solid #000', paddingTop: 5, marginTop: 50 }}>
                ผู้ตรวจสอบ / Reviewed By
              </div>
              <div style={{ fontSize: 11, color: '#666' }}>วันที่ ......./......./.......</div>
            </div>
            <div style={{ textAlign: 'center', width: '30%' }}>
              <div style={{ borderTop: '1px solid #000', paddingTop: 5, marginTop: 50 }}>
                ผู้อนุมัติ / Approved By
              </div>
              <div style={{ fontSize: 11, color: '#666' }}>วันที่ ......./......./.......</div>
            </div>
          </div>

          {/* Footer Note */}
          <div style={{ marginTop: 20, fontSize: 11, color: '#666', textAlign: 'center' }}>
            เอกสารนี้พิมพ์จากระบบ SVS Business Suite | พิมพ์เมื่อ: {new Date().toLocaleString('th-TH')}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default FinancialReportPrintPreview;
