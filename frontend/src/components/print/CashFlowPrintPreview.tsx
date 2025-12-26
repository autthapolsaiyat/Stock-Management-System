import React, { useEffect, useState } from 'react';
import { Modal, Button, Spin } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { systemSettingsApi } from '../../services/api';

interface CashFlowPrintPreviewProps {
  open: boolean;
  onClose: () => void;
  data: any;
  period: { startDate: string; endDate: string };
}

const CashFlowPrintPreview: React.FC<CashFlowPrintPreviewProps> = ({
  open,
  onClose,
  data,
  period,
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
      const [companyThRes, companyRes] = await Promise.all([
        systemSettingsApi.getByCategory('COMPANY_TH'),
        systemSettingsApi.getByCategory('COMPANY'),
      ]);
      
      const companyMap: any = {};
      [...(companyThRes.data || []), ...(companyRes.data || [])].forEach((s: any) => {
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
    const printContent = document.getElementById('cashflow-print-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>งบกระแสเงินสด</title>
              <style>
                @page { size: A4; margin: 15mm; }
                body { font-family: 'Sarabun', 'TH Sarabun New', sans-serif; font-size: 14px; margin: 0; padding: 20px; color: #000; }
                table { border-collapse: collapse; width: 100%; }
                th, td { padding: 6px 10px; }
                .text-right { text-align: right; }
                .header { text-align: center; margin-bottom: 25px; }
                .section-header { background: #f0f0f0; font-weight: bold; padding: 8px 10px; margin-top: 15px; border: 1px solid #ccc; }
                .item-row { border-bottom: 1px dotted #ccc; }
                .subtotal-row { font-weight: bold; background: #fafafa; border-top: 1px solid #000; border-bottom: 1px solid #000; }
                .grand-total { font-weight: bold; font-size: 16px; background: #e6f7ff; }
                .positive { color: #52c41a; }
                .negative { color: #ff4d4f; }
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
    const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const thaiYear = date.getFullYear() + 543;
    return `${date.getDate()} ${thaiMonths[date.getMonth()]} ${thaiYear}`;
  };

  const formatNumber = (num: number) => {
    const value = Number(num || 0);
    const formatted = Math.abs(value).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return value < 0 ? `(${formatted})` : formatted;
  };

  const getAmountClass = (num: number) => {
    if (num > 0) return 'positive';
    if (num < 0) return 'negative';
    return '';
  };

  const { operatingActivities, investingActivities, financingActivities, summary } = data || {};

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={800}
      title="พิมพ์งบกระแสเงินสด"
      footer={[
        <Button key="cancel" onClick={onClose}>ปิด</Button>,
        <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>พิมพ์</Button>,
      ]}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>
      ) : (
        <div id="cashflow-print-content" style={{ padding: 20, background: '#fff', border: '1px solid #ddd' }}>
          <div className="header">
            <div style={{ fontSize: 18, fontWeight: 'bold' }}>
              {companySettings.COMPANY_NAME_TH || 'บริษัท แสงวิทย์ ไซเอนซ์ จำกัด'}
            </div>
            <div style={{ fontSize: 20, fontWeight: 'bold', marginTop: 10 }}>งบกระแสเงินสด</div>
            <div style={{ fontSize: 14 }}>สำหรับงวด {formatDate(period.startDate)} ถึง {formatDate(period.endDate)}</div>
          </div>

          <div className="section-header">กระแสเงินสดจากกิจกรรมดำเนินงาน</div>
          <table>
            <tbody>
              {(operatingActivities?.items || []).map((item: any, idx: number) => (
                <tr key={idx} className="item-row">
                  <td style={{ paddingLeft: 30 }}>{item.description}</td>
                  <td className={`text-right ${getAmountClass(item.amount)}`} style={{ width: 150 }}>{formatNumber(item.amount)}</td>
                </tr>
              ))}
              <tr className="subtotal-row">
                <td>เงินสดสุทธิจากกิจกรรมดำเนินงาน</td>
                <td className={`text-right ${getAmountClass(summary?.netCashFromOperating)}`}>{formatNumber(summary?.netCashFromOperating || 0)}</td>
              </tr>
            </tbody>
          </table>

          <div className="section-header">กระแสเงินสดจากกิจกรรมลงทุน</div>
          <table>
            <tbody>
              {(investingActivities?.items || []).map((item: any, idx: number) => (
                <tr key={idx} className="item-row">
                  <td style={{ paddingLeft: 30 }}>{item.description}</td>
                  <td className={`text-right ${getAmountClass(item.amount)}`} style={{ width: 150 }}>{formatNumber(item.amount)}</td>
                </tr>
              ))}
              <tr className="subtotal-row">
                <td>เงินสดสุทธิจากกิจกรรมลงทุน</td>
                <td className={`text-right ${getAmountClass(summary?.netCashFromInvesting)}`}>{formatNumber(summary?.netCashFromInvesting || 0)}</td>
              </tr>
            </tbody>
          </table>

          <div className="section-header">กระแสเงินสดจากกิจกรรมจัดหาเงิน</div>
          <table>
            <tbody>
              {(financingActivities?.items || []).map((item: any, idx: number) => (
                <tr key={idx} className="item-row">
                  <td style={{ paddingLeft: 30 }}>{item.description}</td>
                  <td className={`text-right ${getAmountClass(item.amount)}`} style={{ width: 150 }}>{formatNumber(item.amount)}</td>
                </tr>
              ))}
              <tr className="subtotal-row">
                <td>เงินสดสุทธิจากกิจกรรมจัดหาเงิน</td>
                <td className={`text-right ${getAmountClass(summary?.netCashFromFinancing)}`}>{formatNumber(summary?.netCashFromFinancing || 0)}</td>
              </tr>
            </tbody>
          </table>

          <table style={{ marginTop: 20, border: '2px solid #1890ff', background: '#e6f7ff' }}>
            <tbody>
              <tr>
                <td style={{ fontWeight: 'bold', padding: 10 }}>เงินสดและรายการเทียบเท่าเงินสดเพิ่มขึ้น(ลดลง)สุทธิ</td>
                <td className={`text-right ${getAmountClass(summary?.netChangeInCash)}`} style={{ width: 150, fontWeight: 'bold', padding: 10 }}>{formatNumber(summary?.netChangeInCash || 0)}</td>
              </tr>
              <tr style={{ borderTop: '1px solid #ccc' }}>
                <td style={{ padding: 10 }}>เงินสดและรายการเทียบเท่าเงินสดต้นงวด</td>
                <td className="text-right" style={{ width: 150, padding: 10 }}>{formatNumber(summary?.beginningCash || 0)}</td>
              </tr>
              <tr style={{ borderTop: '2px solid #1890ff', fontWeight: 'bold', fontSize: 16 }}>
                <td style={{ padding: 10 }}>เงินสดและรายการเทียบเท่าเงินสดปลายงวด</td>
                <td className={`text-right ${getAmountClass(summary?.endingCash)}`} style={{ width: 150, padding: 10 }}>{formatNumber(summary?.endingCash || 0)}</td>
              </tr>
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 50 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ borderTop: '1px solid #000', width: 150, margin: '60px auto 5px', paddingTop: 5 }}>ผู้จัดทำ</div>
              <div>วันที่ ____/____/____</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ borderTop: '1px solid #000', width: 150, margin: '60px auto 5px', paddingTop: 5 }}>ผู้ตรวจสอบ</div>
              <div>วันที่ ____/____/____</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ borderTop: '1px solid #000', width: 150, margin: '60px auto 5px', paddingTop: 5 }}>กรรมการผู้จัดการ</div>
              <div>วันที่ ____/____/____</div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default CashFlowPrintPreview;
