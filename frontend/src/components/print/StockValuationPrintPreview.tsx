import React, { useEffect, useState } from 'react';
import { Modal, Button, Spin } from 'antd';
import { PrinterOutlined, FileExcelOutlined } from '@ant-design/icons';
import { systemSettingsApi } from '../../services/api';
import dayjs from 'dayjs';

interface StockValuationPrintPreviewProps {
  open: boolean;
  onClose: () => void;
  data: any;
  asOfDate?: string;
  warehouseName?: string;
  categoryName?: string;
}

const StockValuationPrintPreview: React.FC<StockValuationPrintPreviewProps> = ({
  open,
  onClose,
  data,
  asOfDate,
  warehouseName,
  categoryName,
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
    const printContent = document.getElementById('valuation-print-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>รายงานมูลค่าสต็อก</title>
              <style>
                @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;600;700&display=swap');
                @page { size: A4 landscape; margin: 10mm; }
                body { font-family: 'Sarabun', sans-serif; font-size: 11px; margin: 0; padding: 10px; color: #000; }
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #333; padding: 4px 6px; color: #000; }
                th { background: #e0e0e0; font-weight: 600; }
                .header-table td { border: none; }
                .text-right { text-align: right; }
                .text-center { text-align: center; }
                .font-bold { font-weight: 600; }
                .summary-row { background: #f5f5f5; font-weight: 600; }
              </style>
            </head>
            <body>${printContent.innerHTML}</body>
          </html>
        `);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 250);
      }
    }
  };

  const handleExportExcel = () => {
    if (!data || !data.items?.length) return;

    const headers = ['ลำดับ', 'รหัสสินค้า', 'ชื่อสินค้า', 'หมวดหมู่', 'คลังสินค้า', 'จำนวน', 'หน่วย', 'ต้นทุนเฉลี่ย', 'มูลค่า'];
    const rows = data.items.map((item: any, idx: number) => [
      idx + 1,
      item.productCode,
      item.productName,
      item.categoryName,
      item.warehouseName,
      item.qty,
      item.unit || '-',
      item.avgCost?.toFixed(2),
      item.value?.toFixed(2),
    ]);

    const csvContent = [
      `รายงานมูลค่าสต็อก ณ วันที่ ${dayjs(asOfDate).format('DD/MM/YYYY')}`,
      `บริษัท: ${companySettings.COMPANY_NAME_TH || 'บริษัท แสงวิทย์ ไซเอนซ์ จำกัด'}`,
      `มูลค่ารวม: ${data.summary?.totalValue?.toLocaleString()} บาท`,
      '',
      headers.join('\t'),
      ...rows.map((row: any) => row.join('\t')),
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `StockValuation_${dayjs(asOfDate).format('YYYYMMDD')}.xls`;
    link.click();
  };

  const formatNumber = (num: number) => {
    return Number(num || 0).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatQty = (num: number) => {
    return Number(num || 0).toLocaleString('th-TH', { minimumFractionDigits: 0, maximumFractionDigits: 4 });
  };

  const formatThaiDate = (date: string) => {
    const d = dayjs(date);
    const thaiMonths = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 
                        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
    const thaiYear = d.year() + 543;
    return `${d.date()} ${thaiMonths[d.month()]} ${thaiYear}`;
  };

  const items = data?.items || [];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={1200}
      title="พิมพ์รายงานมูลค่าสต็อก"
      footer={[
        <Button key="close" onClick={onClose}>ปิด</Button>,
        <Button key="excel" icon={<FileExcelOutlined />} onClick={handleExportExcel} style={{ background: '#52c41a', borderColor: '#52c41a', color: '#fff' }}>
          Export Excel
        </Button>,
        <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>พิมพ์</Button>,
      ]}
      styles={{ body: { maxHeight: '80vh', overflowY: 'auto' } }}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>
      ) : (
        <div id="valuation-print-content" style={{ padding: 15, background: '#fff', color: '#000', fontFamily: 'Sarabun, sans-serif' }}>
          {/* Header */}
          <table className="header-table" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 15 }}>
            <tbody>
              <tr>
                <td style={{ width: '70%', verticalAlign: 'top', border: 'none' }}>
                  {companySettings.COMPANY_LOGO_URL && (
                    <img src={companySettings.COMPANY_LOGO_URL} alt="Logo" style={{ height: 50, marginBottom: 5 }} />
                  )}
                  <div style={{ fontWeight: 'bold', fontSize: 16, color: '#000' }}>
                    {companySettings.COMPANY_NAME_TH || 'บริษัท แสงวิทย์ ไซเอนซ์ จำกัด'}
                  </div>
                  <div style={{ fontSize: 12, color: '#000' }}>
                    {companySettings.COMPANY_NAME_EN || 'Saengvith Science Co., Ltd.'}
                  </div>
                  <div style={{ fontSize: 11, color: '#333', marginTop: 3 }}>
                    {companySettings.COMPANY_ADDRESS1_TH || ''}
                  </div>
                  <div style={{ fontSize: 11, color: '#333' }}>
                    โทร: {companySettings.COMPANY_PHONE || ''} | แฟกซ์: {companySettings.COMPANY_FAX || ''} | Email: {companySettings.COMPANY_EMAIL || ''}
                  </div>
                </td>
                <td style={{ width: '30%', verticalAlign: 'top', border: 'none', textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold', fontSize: 18, color: '#1890ff', marginBottom: 5 }}>
                    รายงานมูลค่าสต็อก
                  </div>
                  <div style={{ fontSize: 13, color: '#000' }}>Stock Valuation Report</div>
                  <div style={{ fontSize: 12, marginTop: 10, color: '#333' }}>
                    ณ วันที่: <strong>{formatThaiDate(asOfDate || new Date().toISOString())}</strong>
                  </div>
                  {warehouseName && (
                    <div style={{ fontSize: 11, color: '#333' }}>คลัง: {warehouseName}</div>
                  )}
                  {categoryName && (
                    <div style={{ fontSize: 11, color: '#333' }}>หมวด: {categoryName}</div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Summary Box */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 15 }}>
            <tbody>
              <tr>
                <td style={{ width: '25%', padding: 10, background: '#e6f7ff', border: '1px solid #91d5ff', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#666' }}>มูลค่าสต็อกรวม</div>
                  <div style={{ fontSize: 16, fontWeight: 'bold', color: '#1890ff' }}>฿{formatNumber(data?.summary?.totalValue || 0)}</div>
                </td>
                <td style={{ width: '25%', padding: 10, background: '#f6ffed', border: '1px solid #b7eb8f', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#666' }}>จำนวนรายการ</div>
                  <div style={{ fontSize: 16, fontWeight: 'bold', color: '#52c41a' }}>{data?.summary?.totalItems || 0} รายการ</div>
                </td>
                <td style={{ width: '25%', padding: 10, background: '#fff7e6', border: '1px solid #ffd591', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#666' }}>จำนวนคงเหลือ</div>
                  <div style={{ fontSize: 16, fontWeight: 'bold', color: '#fa8c16' }}>{formatQty(data?.summary?.totalQty || 0)} หน่วย</div>
                </td>
                <td style={{ width: '25%', padding: 10, background: '#f9f0ff', border: '1px solid #d3adf7', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#666' }}>ต้นทุนเฉลี่ย</div>
                  <div style={{ fontSize: 16, fontWeight: 'bold', color: '#722ed1' }}>฿{formatNumber(data?.summary?.avgCost || 0)}</div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Data Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10 }}>
            <thead>
              <tr style={{ background: '#e0e0e0' }}>
                <th style={{ border: '1px solid #333', padding: '5px 4px', width: 35 }}>ลำดับ</th>
                <th style={{ border: '1px solid #333', padding: '5px 4px', width: 80 }}>รหัสสินค้า</th>
                <th style={{ border: '1px solid #333', padding: '5px 4px' }}>ชื่อสินค้า</th>
                <th style={{ border: '1px solid #333', padding: '5px 4px', width: 100 }}>หมวดหมู่</th>
                <th style={{ border: '1px solid #333', padding: '5px 4px', width: 90 }}>คลังสินค้า</th>
                <th style={{ border: '1px solid #333', padding: '5px 4px', width: 60, textAlign: 'right' }}>จำนวน</th>
                <th style={{ border: '1px solid #333', padding: '5px 4px', width: 40 }}>หน่วย</th>
                <th style={{ border: '1px solid #333', padding: '5px 4px', width: 80, textAlign: 'right' }}>ต้นทุนเฉลี่ย</th>
                <th style={{ border: '1px solid #333', padding: '5px 4px', width: 100, textAlign: 'right' }}>มูลค่า</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: any, idx: number) => (
                <tr key={`${item.productId}-${item.warehouseId}`}>
                  <td style={{ border: '1px solid #333', padding: '3px 4px', textAlign: 'center' }}>{idx + 1}</td>
                  <td style={{ border: '1px solid #333', padding: '3px 4px' }}>{item.productCode}</td>
                  <td style={{ border: '1px solid #333', padding: '3px 4px' }}>{item.productName}</td>
                  <td style={{ border: '1px solid #333', padding: '3px 4px' }}>{item.categoryName}</td>
                  <td style={{ border: '1px solid #333', padding: '3px 4px' }}>{item.warehouseName}</td>
                  <td style={{ border: '1px solid #333', padding: '3px 4px', textAlign: 'right' }}>{formatQty(item.qty)}</td>
                  <td style={{ border: '1px solid #333', padding: '3px 4px', textAlign: 'center' }}>{item.unit || '-'}</td>
                  <td style={{ border: '1px solid #333', padding: '3px 4px', textAlign: 'right' }}>{formatNumber(item.avgCost)}</td>
                  <td style={{ border: '1px solid #333', padding: '3px 4px', textAlign: 'right', fontWeight: 'bold' }}>{formatNumber(item.value)}</td>
                </tr>
              ))}
              {/* Summary Row */}
              <tr className="summary-row" style={{ background: '#f5f5f5', fontWeight: 'bold' }}>
                <td colSpan={5} style={{ border: '1px solid #333', padding: '5px 6px', textAlign: 'center' }}>รวมทั้งหมด</td>
                <td style={{ border: '1px solid #333', padding: '5px 6px', textAlign: 'right' }}>{formatQty(data?.summary?.totalQty || 0)}</td>
                <td style={{ border: '1px solid #333', padding: '5px 6px' }}></td>
                <td style={{ border: '1px solid #333', padding: '5px 6px' }}></td>
                <td style={{ border: '1px solid #333', padding: '5px 6px', textAlign: 'right', fontSize: 12, color: '#1890ff' }}>
                  ฿{formatNumber(data?.summary?.totalValue || 0)}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Footer */}
          <div style={{ marginTop: 20, fontSize: 10, color: '#666', display: 'flex', justifyContent: 'space-between' }}>
            <div>พิมพ์โดย: {localStorage.getItem('userName') || '-'}</div>
            <div>วันที่พิมพ์: {dayjs().format('DD/MM/YYYY HH:mm')}</div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default StockValuationPrintPreview;
