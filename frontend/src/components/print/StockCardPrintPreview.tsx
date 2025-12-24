import React, { useEffect, useState } from 'react';
import { Modal, Button, Spin } from 'antd';
import { PrinterOutlined, FileExcelOutlined } from '@ant-design/icons';
import { systemSettingsApi } from '../../services/api';
import dayjs from 'dayjs';

interface StockCardPrintPreviewProps {
  open: boolean;
  onClose: () => void;
  data: any;
  product?: { code: string; name: string };
  warehouseName?: string;
  dateRange?: [string, string];
}

const StockCardPrintPreview: React.FC<StockCardPrintPreviewProps> = ({
  open,
  onClose,
  data,
  product,
  warehouseName,
  dateRange,
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
    const printContent = document.getElementById('stockcard-print-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Stock Card - ${product?.code || ''}</title>
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
                .text-green { color: #52c41a; }
                .text-red { color: #ff4d4f; }
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
    if (!data || !data.transactions?.length) return;

    const headers = ['วันที่', 'ประเภท', 'รายการอ้างอิง', 'รับเข้า', 'จ่ายออก', 'ต้นทุน/หน่วย', 'มูลค่า', 'คงเหลือ', 'มูลค่าคงเหลือ'];
    const rows = data.transactions.map((tx: any) => [
      dayjs(tx.date).format('DD/MM/YYYY HH:mm'),
      tx.type === 'IN' ? 'รับเข้า' : 'จ่ายออก',
      `${getReferenceLabel(tx.referenceType)}${tx.referenceId ? ' #' + tx.referenceId : ''}`,
      tx.qtyIn || '',
      tx.qtyOut || '',
      tx.unitCost?.toFixed(2),
      tx.totalCost?.toFixed(2),
      tx.balanceQty?.toFixed(2),
      tx.balanceValue?.toFixed(2),
    ]);

    const csvContent = [
      `Stock Card - ${product?.code} ${product?.name}`,
      `บริษัท: ${companySettings.COMPANY_NAME_TH || 'บริษัท แสงวิทย์ ไซเอนซ์ จำกัด'}`,
      `คลัง: ${warehouseName || 'ทุกคลัง'}`,
      `ช่วงวันที่: ${dateRange ? dayjs(dateRange[0]).format('DD/MM/YYYY') + ' - ' + dayjs(dateRange[1]).format('DD/MM/YYYY') : 'ทั้งหมด'}`,
      '',
      headers.join('\t'),
      ...rows.map((row: any) => row.join('\t')),
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `StockCard_${product?.code}_${dayjs().format('YYYYMMDD')}.xls`;
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

  const getReferenceLabel = (type: string) => {
    const labels: Record<string, string> = {
      'GR': 'รับสินค้า',
      'GOODS_RECEIPT': 'รับสินค้า',
      'ISSUE': 'เบิกสินค้า',
      'STOCK_ISSUE': 'เบิกสินค้า',
      'TRANSFER_IN': 'รับโอน',
      'TRANSFER_OUT': 'โอนออก',
      'STOCK_TRANSFER': 'โอนสินค้า',
      'ADJ_IN': 'ปรับเพิ่ม',
      'ADJ_OUT': 'ปรับลด',
      'STOCK_ADJUSTMENT': 'ปรับปรุง',
      'COUNT': 'นับสต็อก',
      'STOCK_COUNT': 'นับสต็อก',
      'SALES': 'ขาย',
      'SALES_INVOICE': 'ใบขาย',
    };
    return labels[type] || type;
  };

  const transactions = data?.transactions || [];
  const totalIn = transactions.reduce((sum: number, tx: any) => sum + (tx.qtyIn || 0), 0);
  const totalOut = transactions.reduce((sum: number, tx: any) => sum + (tx.qtyOut || 0), 0);
  const totalInValue = transactions.reduce((sum: number, tx: any) => sum + (tx.type === 'IN' ? tx.totalCost : 0), 0);
  const totalOutValue = transactions.reduce((sum: number, tx: any) => sum + (tx.type === 'OUT' ? tx.totalCost : 0), 0);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={1200}
      title={`พิมพ์ Stock Card - ${product?.code || ''} ${product?.name || ''}`}
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
        <div id="stockcard-print-content" style={{ padding: 15, background: '#fff', color: '#000', fontFamily: 'Sarabun, sans-serif' }}>
          {/* Header */}
          <table className="header-table" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 15 }}>
            <tbody>
              <tr>
                <td style={{ width: '60%', verticalAlign: 'top', border: 'none' }}>
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
                <td style={{ width: '40%', verticalAlign: 'top', border: 'none', textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold', fontSize: 18, color: '#1890ff', marginBottom: 5 }}>
                    Stock Card
                  </div>
                  <div style={{ fontSize: 13, color: '#000' }}>บัตรสินค้า / ประวัติเคลื่อนไหว</div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Product Info Box */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 15 }}>
            <tbody>
              <tr>
                <td style={{ width: '15%', padding: 8, background: '#f5f5f5', border: '1px solid #ddd', fontWeight: 'bold' }}>รหัสสินค้า</td>
                <td style={{ width: '35%', padding: 8, border: '1px solid #ddd' }}>{product?.code || '-'}</td>
                <td style={{ width: '15%', padding: 8, background: '#f5f5f5', border: '1px solid #ddd', fontWeight: 'bold' }}>ชื่อสินค้า</td>
                <td style={{ width: '35%', padding: 8, border: '1px solid #ddd' }}>{product?.name || '-'}</td>
              </tr>
              <tr>
                <td style={{ padding: 8, background: '#f5f5f5', border: '1px solid #ddd', fontWeight: 'bold' }}>คลังสินค้า</td>
                <td style={{ padding: 8, border: '1px solid #ddd' }}>{warehouseName || 'ทุกคลัง'}</td>
                <td style={{ padding: 8, background: '#f5f5f5', border: '1px solid #ddd', fontWeight: 'bold' }}>ช่วงวันที่</td>
                <td style={{ padding: 8, border: '1px solid #ddd' }}>
                  {dateRange ? `${dayjs(dateRange[0]).format('DD/MM/YYYY')} - ${dayjs(dateRange[1]).format('DD/MM/YYYY')}` : 'ทั้งหมด'}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Summary Box */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 15 }}>
            <tbody>
              <tr>
                <td style={{ width: '25%', padding: 10, background: '#f6ffed', border: '1px solid #b7eb8f', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#666' }}>ยอดยกมา</div>
                  <div style={{ fontSize: 14, fontWeight: 'bold', color: '#52c41a' }}>{formatQty(data?.openingBalance?.qty || 0)} หน่วย</div>
                  <div style={{ fontSize: 10, color: '#888' }}>฿{formatNumber(data?.openingBalance?.value || 0)}</div>
                </td>
                <td style={{ width: '25%', padding: 10, background: '#e6f7ff', border: '1px solid #91d5ff', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#666' }}>รับเข้ารวม</div>
                  <div style={{ fontSize: 14, fontWeight: 'bold', color: '#1890ff' }}>+{formatQty(totalIn)} หน่วย</div>
                  <div style={{ fontSize: 10, color: '#888' }}>฿{formatNumber(totalInValue)}</div>
                </td>
                <td style={{ width: '25%', padding: 10, background: '#fff2e8', border: '1px solid #ffbb96', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#666' }}>จ่ายออกรวม</div>
                  <div style={{ fontSize: 14, fontWeight: 'bold', color: '#fa8c16' }}>-{formatQty(totalOut)} หน่วย</div>
                  <div style={{ fontSize: 10, color: '#888' }}>฿{formatNumber(totalOutValue)}</div>
                </td>
                <td style={{ width: '25%', padding: 10, background: '#f9f0ff', border: '1px solid #d3adf7', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#666' }}>ยอดคงเหลือ</div>
                  <div style={{ fontSize: 14, fontWeight: 'bold', color: '#722ed1' }}>{formatQty(data?.closingBalance?.qty || 0)} หน่วย</div>
                  <div style={{ fontSize: 10, color: '#888' }}>฿{formatNumber(data?.closingBalance?.value || 0)}</div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Transactions Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10 }}>
            <thead>
              <tr style={{ background: '#e0e0e0' }}>
                <th style={{ border: '1px solid #333', padding: '5px 4px', width: 100 }}>วันที่</th>
                <th style={{ border: '1px solid #333', padding: '5px 4px', width: 70 }}>ประเภท</th>
                <th style={{ border: '1px solid #333', padding: '5px 4px' }}>รายการอ้างอิง</th>
                <th style={{ border: '1px solid #333', padding: '5px 4px', width: 70, textAlign: 'right' }}>รับเข้า</th>
                <th style={{ border: '1px solid #333', padding: '5px 4px', width: 70, textAlign: 'right' }}>จ่ายออก</th>
                <th style={{ border: '1px solid #333', padding: '5px 4px', width: 80, textAlign: 'right' }}>ต้นทุน/หน่วย</th>
                <th style={{ border: '1px solid #333', padding: '5px 4px', width: 90, textAlign: 'right' }}>มูลค่า</th>
                <th style={{ border: '1px solid #333', padding: '5px 4px', width: 70, textAlign: 'right' }}>คงเหลือ</th>
                <th style={{ border: '1px solid #333', padding: '5px 4px', width: 100, textAlign: 'right' }}>มูลค่าคงเหลือ</th>
              </tr>
            </thead>
            <tbody>
              {/* Opening Balance Row */}
              <tr style={{ background: '#fafafa', fontStyle: 'italic' }}>
                <td colSpan={3} style={{ border: '1px solid #333', padding: '3px 6px' }}>ยอดยกมา</td>
                <td style={{ border: '1px solid #333', padding: '3px 4px', textAlign: 'right' }}>-</td>
                <td style={{ border: '1px solid #333', padding: '3px 4px', textAlign: 'right' }}>-</td>
                <td style={{ border: '1px solid #333', padding: '3px 4px', textAlign: 'right' }}>-</td>
                <td style={{ border: '1px solid #333', padding: '3px 4px', textAlign: 'right' }}>-</td>
                <td style={{ border: '1px solid #333', padding: '3px 4px', textAlign: 'right', fontWeight: 'bold' }}>{formatQty(data?.openingBalance?.qty || 0)}</td>
                <td style={{ border: '1px solid #333', padding: '3px 4px', textAlign: 'right', fontWeight: 'bold' }}>{formatNumber(data?.openingBalance?.value || 0)}</td>
              </tr>
              {transactions.map((tx: any, idx: number) => (
                <tr key={tx.id || idx}>
                  <td style={{ border: '1px solid #333', padding: '3px 4px' }}>{dayjs(tx.date).format('DD/MM/YY HH:mm')}</td>
                  <td style={{ border: '1px solid #333', padding: '3px 4px', textAlign: 'center', color: tx.type === 'IN' ? '#52c41a' : '#ff4d4f' }}>
                    {tx.type === 'IN' ? '▼ รับ' : '▲ จ่าย'}
                  </td>
                  <td style={{ border: '1px solid #333', padding: '3px 4px' }}>
                    {getReferenceLabel(tx.referenceType)}{tx.referenceId ? ` #${tx.referenceId}` : ''}
                  </td>
                  <td style={{ border: '1px solid #333', padding: '3px 4px', textAlign: 'right', color: '#52c41a' }}>
                    {tx.qtyIn > 0 ? `+${formatQty(tx.qtyIn)}` : '-'}
                  </td>
                  <td style={{ border: '1px solid #333', padding: '3px 4px', textAlign: 'right', color: '#ff4d4f' }}>
                    {tx.qtyOut > 0 ? `-${formatQty(tx.qtyOut)}` : '-'}
                  </td>
                  <td style={{ border: '1px solid #333', padding: '3px 4px', textAlign: 'right' }}>{formatNumber(tx.unitCost)}</td>
                  <td style={{ border: '1px solid #333', padding: '3px 4px', textAlign: 'right' }}>{formatNumber(tx.totalCost)}</td>
                  <td style={{ border: '1px solid #333', padding: '3px 4px', textAlign: 'right', fontWeight: 'bold' }}>{formatQty(tx.balanceQty)}</td>
                  <td style={{ border: '1px solid #333', padding: '3px 4px', textAlign: 'right', fontWeight: 'bold' }}>{formatNumber(tx.balanceValue)}</td>
                </tr>
              ))}
              {/* Summary Row */}
              <tr className="summary-row" style={{ background: '#f5f5f5', fontWeight: 'bold' }}>
                <td colSpan={3} style={{ border: '1px solid #333', padding: '5px 6px', textAlign: 'center' }}>รวม</td>
                <td style={{ border: '1px solid #333', padding: '5px 4px', textAlign: 'right', color: '#52c41a' }}>+{formatQty(totalIn)}</td>
                <td style={{ border: '1px solid #333', padding: '5px 4px', textAlign: 'right', color: '#ff4d4f' }}>-{formatQty(totalOut)}</td>
                <td style={{ border: '1px solid #333', padding: '5px 4px' }}></td>
                <td style={{ border: '1px solid #333', padding: '5px 4px' }}></td>
                <td style={{ border: '1px solid #333', padding: '5px 4px', textAlign: 'right', fontSize: 11 }}>{formatQty(data?.closingBalance?.qty || 0)}</td>
                <td style={{ border: '1px solid #333', padding: '5px 4px', textAlign: 'right', fontSize: 11, color: '#1890ff' }}>
                  ฿{formatNumber(data?.closingBalance?.value || 0)}
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

export default StockCardPrintPreview;
