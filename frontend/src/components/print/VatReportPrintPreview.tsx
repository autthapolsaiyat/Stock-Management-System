import React, { useEffect, useState } from 'react';
import { Modal, Button, Spin } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { systemSettingsApi } from '../../services/api';

interface VatReportPrintPreviewProps {
  open: boolean;
  onClose: () => void;
  reportType: 'OUTPUT' | 'INPUT';
  data: any[];
  summary: any;
  period: { year: number; month: number };
}

const THAI_MONTHS = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 
                     'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

const VatReportPrintPreview: React.FC<VatReportPrintPreviewProps> = ({
  open,
  onClose,
  reportType,
  data,
  summary,
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
    const printContent = document.getElementById('vat-print-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>รายงานภาษี${reportType === 'OUTPUT' ? 'ขาย' : 'ซื้อ'} ${THAI_MONTHS[period.month - 1]} ${period.year + 543}</title>
              <style>
                @page { size: A4 landscape; margin: 10mm; }
                body { font-family: 'Sarabun', 'TH Sarabun New', sans-serif; font-size: 12px; margin: 0; padding: 20px; color: #000; }
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #000; padding: 4px 6px; }
                th { background: #f0f0f0; font-weight: bold; }
                .text-center { text-align: center; }
                .text-right { text-align: right; }
                .header { text-align: center; margin-bottom: 20px; }
                .summary-table { width: auto; margin-top: 20px; }
                .summary-table td { border: none; padding: 4px 10px; }
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

  const totalBase = data.reduce((sum, item) => sum + (item.baseAmount || 0), 0);
  const totalVat = data.reduce((sum, item) => sum + (item.vatAmount || 0), 0);
  const totalAmount = data.reduce((sum, item) => sum + (item.totalAmount || 0), 0);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={1100}
      title={`พิมพ์รายงานภาษี${reportType === 'OUTPUT' ? 'ขาย' : 'ซื้อ'}`}
      footer={[
        <Button key="cancel" onClick={onClose}>ปิด</Button>,
        <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>
          พิมพ์
        </Button>,
      ]}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>
      ) : (
        <div id="vat-print-content" style={{ padding: 20, background: '#fff', border: '1px solid #ddd' }}>
          {/* Header */}
          <div className="header">
            <div style={{ fontSize: 16, fontWeight: 'bold' }}>
              {companySettings.COMPANY_NAME_TH || 'บริษัท แสงวิทย์ ไซเอนซ์ จำกัด'}
            </div>
            <div style={{ fontSize: 12 }}>
              เลขประจำตัวผู้เสียภาษี: {companySettings.COMPANY_TAX_ID || '-'}
            </div>
            <div style={{ fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>
              รายงานภาษี{reportType === 'OUTPUT' ? 'ขาย' : 'ซื้อ'}
            </div>
            <div style={{ fontSize: 14 }}>
              ประจำเดือน {THAI_MONTHS[period.month - 1]} พ.ศ. {period.year + 543}
            </div>
          </div>

          {/* Data Table */}
          <table>
            <thead>
              <tr>
                <th style={{ width: 40 }}>ลำดับ</th>
                <th style={{ width: 80 }}>วันที่</th>
                <th style={{ width: 100 }}>เลขที่เอกสาร</th>
                <th style={{ width: 200 }}>{reportType === 'OUTPUT' ? 'ชื่อลูกค้า' : 'ชื่อผู้ขาย'}</th>
                <th style={{ width: 120 }}>เลขผู้เสียภาษี</th>
                <th style={{ width: 200 }}>รายการ</th>
                <th style={{ width: 100 }} className="text-right">มูลค่าสินค้า/บริการ</th>
                <th style={{ width: 80 }} className="text-right">ภาษีมูลค่าเพิ่ม</th>
                <th style={{ width: 100 }} className="text-right">รวมทั้งสิ้น</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? data.map((item, idx) => (
                <tr key={idx}>
                  <td className="text-center">{idx + 1}</td>
                  <td className="text-center">{formatDate(item.docDate)}</td>
                  <td>{item.docNo}</td>
                  <td>{item.partnerName}</td>
                  <td>{item.partnerTaxId || '-'}</td>
                  <td>{item.description || '-'}</td>
                  <td className="text-right">{formatNumber(item.baseAmount)}</td>
                  <td className="text-right">{formatNumber(item.vatAmount)}</td>
                  <td className="text-right">{formatNumber(item.totalAmount)}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={9} className="text-center" style={{ padding: 20, color: '#999' }}>
                    ไม่มีข้อมูล
                  </td>
                </tr>
              )}
              {/* Total Row */}
              <tr style={{ fontWeight: 'bold', background: '#f5f5f5' }}>
                <td colSpan={6} className="text-center">รวมทั้งสิ้น ({data.length} รายการ)</td>
                <td className="text-right">{formatNumber(totalBase)}</td>
                <td className="text-right">{formatNumber(totalVat)}</td>
                <td className="text-right">{formatNumber(totalAmount)}</td>
              </tr>
            </tbody>
          </table>

          {/* Summary Section */}
          {summary && (
            <div style={{ marginTop: 30 }}>
              <div style={{ fontWeight: 'bold', marginBottom: 10 }}>สรุปภาษีมูลค่าเพิ่ม (ภ.พ.30)</div>
              <table className="summary-table">
                <tbody>
                  <tr>
                    <td>ภาษีขาย:</td>
                    <td style={{ textAlign: 'right', width: 150 }}>{formatNumber(summary.outputVat)} บาท</td>
                    <td style={{ width: 100 }}>({summary.outputVatCount} รายการ)</td>
                  </tr>
                  <tr>
                    <td>ภาษีซื้อ:</td>
                    <td style={{ textAlign: 'right' }}>{formatNumber(summary.inputVat)} บาท</td>
                    <td>({summary.inputVatCount} รายการ)</td>
                  </tr>
                  <tr style={{ fontWeight: 'bold', borderTop: '2px solid #000' }}>
                    <td>{summary.isPayable ? 'ภาษีที่ต้องชำระ:' : 'ภาษีที่ขอคืน:'}</td>
                    <td style={{ textAlign: 'right', color: summary.isPayable ? '#c00' : '#080' }}>
                      {formatNumber(Math.abs(summary.netVat))} บาท
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Signatures */}
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 50 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ borderTop: '1px solid #000', width: 150, margin: '60px auto 5px', paddingTop: 5 }}>
                ผู้จัดทำ
              </div>
              <div>วันที่ ____/____/____</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ borderTop: '1px solid #000', width: 150, margin: '60px auto 5px', paddingTop: 5 }}>
                ผู้ตรวจสอบ
              </div>
              <div>วันที่ ____/____/____</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ borderTop: '1px solid #000', width: 150, margin: '60px auto 5px', paddingTop: 5 }}>
                ผู้อนุมัติ
              </div>
              <div>วันที่ ____/____/____</div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default VatReportPrintPreview;
