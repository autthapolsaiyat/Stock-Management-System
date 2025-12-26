import React, { useEffect, useState } from 'react';
import { Modal, Button, Spin } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { systemSettingsApi } from '../../services/api';

interface ARAPAgingPrintPreviewProps {
  open: boolean;
  onClose: () => void;
  reportType: 'AR' | 'AP';
  data: any[];
  asOfDate: string;
}

const ARAPAgingPrintPreview: React.FC<ARAPAgingPrintPreviewProps> = ({
  open,
  onClose,
  reportType,
  data,
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
    const printContent = document.getElementById('aging-print-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>รายงานอายุ${reportType === 'AR' ? 'ลูกหนี้' : 'เจ้าหนี้'}</title>
              <style>
                @page { size: A4 landscape; margin: 10mm; }
                body { font-family: 'Sarabun', 'TH Sarabun New', sans-serif; font-size: 11px; margin: 0; padding: 15px; color: #000; }
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #000; padding: 4px 6px; }
                th { background: #f0f0f0; font-weight: bold; }
                .text-center { text-align: center; }
                .text-right { text-align: right; }
                .header { text-align: center; margin-bottom: 15px; }
                .total-row { background: #fffbe6; font-weight: bold; }
                .overdue { color: #ff4d4f; }
                .warning { color: #faad14; }
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
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear() + 543}`;
  };

  const formatNumber = (num: number) => {
    return Number(num || 0).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Calculate totals for each aging bucket
  const totals = {
    current: data.reduce((sum, item) => sum + Number(item.current || 0), 0),
    days1to30: data.reduce((sum, item) => sum + Number(item.days1to30 || 0), 0),
    days31to60: data.reduce((sum, item) => sum + Number(item.days31to60 || 0), 0),
    days61to90: data.reduce((sum, item) => sum + Number(item.days61to90 || 0), 0),
    over90: data.reduce((sum, item) => sum + Number(item.over90 || 0), 0),
    total: data.reduce((sum, item) => sum + Number(item.total || 0), 0),
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={1100}
      title={`พิมพ์รายงานอายุ${reportType === 'AR' ? 'ลูกหนี้' : 'เจ้าหนี้'}`}
      footer={[
        <Button key="cancel" onClick={onClose}>ปิด</Button>,
        <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>พิมพ์</Button>,
      ]}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>
      ) : (
        <div id="aging-print-content" style={{ padding: 15, background: '#fff', border: '1px solid #ddd', fontSize: 11 }}>
          <div className="header">
            <div style={{ fontSize: 16, fontWeight: 'bold' }}>
              {companySettings.COMPANY_NAME_TH || 'บริษัท แสงวิทย์ ไซเอนซ์ จำกัด'}
            </div>
            <div style={{ fontSize: 18, fontWeight: 'bold', marginTop: 5 }}>
              รายงานอายุ{reportType === 'AR' ? 'ลูกหนี้การค้า' : 'เจ้าหนี้การค้า'}
            </div>
            <div style={{ fontSize: 14 }}>
              {reportType === 'AR' ? 'Accounts Receivable Aging Report' : 'Accounts Payable Aging Report'}
            </div>
            <div style={{ fontSize: 12 }}>ณ วันที่ {formatDate(asOfDate)}</div>
          </div>

          <table>
            <thead>
              <tr>
                <th style={{ width: 40 }}>ลำดับ</th>
                <th style={{ width: 80 }}>รหัส</th>
                <th style={{ width: 200 }}>{reportType === 'AR' ? 'ชื่อลูกค้า' : 'ชื่อผู้ขาย'}</th>
                <th style={{ width: 100 }} className="text-right">ยังไม่ครบกำหนด</th>
                <th style={{ width: 100 }} className="text-right">1-30 วัน</th>
                <th style={{ width: 100 }} className="text-right">31-60 วัน</th>
                <th style={{ width: 100 }} className="text-right">61-90 วัน</th>
                <th style={{ width: 100 }} className="text-right">เกิน 90 วัน</th>
                <th style={{ width: 120 }} className="text-right">รวมทั้งสิ้น</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? data.map((item, idx) => (
                <tr key={idx}>
                  <td className="text-center">{idx + 1}</td>
                  <td>{item.code || '-'}</td>
                  <td>{item.name}</td>
                  <td className="text-right">{formatNumber(item.current)}</td>
                  <td className="text-right">{formatNumber(item.days1to30)}</td>
                  <td className="text-right warning">{formatNumber(item.days31to60)}</td>
                  <td className="text-right warning">{formatNumber(item.days61to90)}</td>
                  <td className="text-right overdue">{formatNumber(item.over90)}</td>
                  <td className="text-right" style={{ fontWeight: 'bold' }}>{formatNumber(item.total)}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={9} className="text-center" style={{ padding: 20, color: '#999' }}>ไม่มีข้อมูล</td>
                </tr>
              )}
              <tr className="total-row">
                <td colSpan={3} className="text-center">รวมทั้งหมด ({data.length} ราย)</td>
                <td className="text-right">{formatNumber(totals.current)}</td>
                <td className="text-right">{formatNumber(totals.days1to30)}</td>
                <td className="text-right">{formatNumber(totals.days31to60)}</td>
                <td className="text-right">{formatNumber(totals.days61to90)}</td>
                <td className="text-right">{formatNumber(totals.over90)}</td>
                <td className="text-right">{formatNumber(totals.total)}</td>
              </tr>
            </tbody>
          </table>

          <div style={{ marginTop: 20, display: 'flex', gap: 30 }}>
            <div>
              <strong>สรุปอายุหนี้:</strong>
              <ul style={{ margin: '5px 0', paddingLeft: 20 }}>
                <li>ยังไม่ครบกำหนด: {formatNumber(totals.current)} บาท ({((totals.current / totals.total) * 100 || 0).toFixed(1)}%)</li>
                <li>ค้างชำระ 1-30 วัน: {formatNumber(totals.days1to30)} บาท ({((totals.days1to30 / totals.total) * 100 || 0).toFixed(1)}%)</li>
                <li>ค้างชำระ 31-60 วัน: {formatNumber(totals.days31to60)} บาท ({((totals.days31to60 / totals.total) * 100 || 0).toFixed(1)}%)</li>
                <li>ค้างชำระ 61-90 วัน: {formatNumber(totals.days61to90)} บาท ({((totals.days61to90 / totals.total) * 100 || 0).toFixed(1)}%)</li>
                <li style={{ color: '#ff4d4f' }}>ค้างชำระเกิน 90 วัน: {formatNumber(totals.over90)} บาท ({((totals.over90 / totals.total) * 100 || 0).toFixed(1)}%)</li>
              </ul>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 40 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ borderTop: '1px solid #000', width: 150, margin: '50px auto 5px', paddingTop: 5 }}>ผู้จัดทำ</div>
              <div>วันที่ ____/____/____</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ borderTop: '1px solid #000', width: 150, margin: '50px auto 5px', paddingTop: 5 }}>ผู้ตรวจสอบ</div>
              <div>วันที่ ____/____/____</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ borderTop: '1px solid #000', width: 150, margin: '50px auto 5px', paddingTop: 5 }}>ผู้อนุมัติ</div>
              <div>วันที่ ____/____/____</div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ARAPAgingPrintPreview;
