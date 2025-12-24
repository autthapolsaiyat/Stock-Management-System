import React, { useEffect, useState } from 'react';
import { Modal, Button, Spin } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { systemSettingsApi } from '../../services/api';

interface StockAdjustmentPrintPreviewProps {
  open: boolean;
  onClose: () => void;
  adjustment: any;
}

const StockAdjustmentPrintPreview: React.FC<StockAdjustmentPrintPreviewProps> = ({
  open,
  onClose,
  adjustment,
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
    const printContent = document.getElementById('adj-print-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>ใบปรับปรุงสต็อก ${adjustment?.doc_full_no || ''}</title>
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

  const formatQty = (num: number) => {
    return Number(num || 0).toLocaleString('th-TH', { minimumFractionDigits: 0, maximumFractionDigits: 4 });
  };

  const getAdjustmentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'ADJ_IN': 'เพิ่มสต็อก (Adjustment In)',
      'ADJ_OUT': 'ลดสต็อก (Adjustment Out)',
      'ADJ_COUNT': 'ปรับจากการนับ (Count Adjustment)',
    };
    return labels[type] || type;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'DRAFT': 'ร่าง',
      'POSTED': 'ปรับแล้ว',
      'CANCELLED': 'ยกเลิก',
    };
    return labels[status] || status;
  };

  const items = adjustment?.items || [];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={900}
      title="พิมพ์ใบปรับปรุงสต็อก"
      footer={[
        <Button key="close" onClick={onClose}>ปิด</Button>,
        <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>พิมพ์</Button>,
      ]}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>
      ) : (
        <div id="adj-print-content" style={{ padding: 20, background: '#fff', color: '#000', fontFamily: 'Sarabun, sans-serif' }}>
          {/* Header */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 10 }}>
            <tbody>
              <tr>
                <td style={{ width: '40%', verticalAlign: 'top', border: 'none', paddingRight: 10 }}>
                  <div style={{ fontWeight: 'bold', fontSize: 14, color: '#000' }}>
                    {companySettings.COMPANY_NAME_TH || 'บริษัท แสงวิทย์ ไซเอนซ์ จำกัด'}
                  </div>
                  <div style={{ fontSize: 12, color: '#000' }}>{companySettings.COMPANY_ADDRESS1_TH || '123/4-5 ซอยสมเด็จพระปิ่นเกล้า 9 ถ.สมเด็จพระปิ่นเกล้า'}</div>
                  <div style={{ fontSize: 12, color: '#000' }}>{companySettings.COMPANY_ADDRESS2_TH || 'แขวงอรุณอมรินทร์ เขตบางกอกน้อย'} {companySettings.COMPANY_ADDRESS3_TH || 'กรุงเทพฯ 10700'}</div>
                  <div style={{ fontSize: 12, color: '#000' }}>โทร. {companySettings.COMPANY_PHONE_TH || '(662) 886-9200-7'}</div>
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
                  <div style={{ fontSize: 12, color: '#000' }}>{companySettings.COMPANY_ADDRESS1_EN || '123/4-5 Soi Somdetphrapinklao 9'}</div>
                  <div style={{ fontSize: 12, color: '#000' }}>{companySettings.COMPANY_ADDRESS2_EN || 'Arun Amarin, Bangkoknoi, Bangkok 10700'}</div>
                  <div style={{ fontSize: 12, color: '#000' }}>Tel. {companySettings.COMPANY_PHONE_EN || '(662) 886-9200-7'}</div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Title */}
          <div style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', margin: '15px 0', borderTop: '2px solid #000', borderBottom: '2px solid #000', padding: '8px 0', color: '#000' }}>
            ใบปรับปรุงสต็อก / Stock Adjustment
          </div>

          {/* Document Info */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 10 }}>
            <tbody>
              <tr>
                <td style={{ width: '50%', verticalAlign: 'top', border: '1px solid #000', padding: 8 }}>
                  <div style={{ color: '#000' }}><strong>เลขที่เอกสาร / Doc No.:</strong> {adjustment?.doc_full_no || '-'}</div>
                  <div style={{ color: '#000' }}><strong>วันที่ / Date:</strong> {formatDate(adjustment?.doc_date)}</div>
                  <div style={{ color: '#000' }}><strong>คลังสินค้า / Warehouse:</strong> {adjustment?.warehouse_name || '-'}</div>
                </td>
                <td style={{ width: '50%', verticalAlign: 'top', border: '1px solid #000', padding: 8 }}>
                  <div style={{ color: '#000' }}><strong>ประเภท / Type:</strong> {getAdjustmentTypeLabel(adjustment?.adjustment_type)}</div>
                  <div style={{ color: '#000' }}><strong>สถานะ / Status:</strong> {getStatusLabel(adjustment?.status)}</div>
                  <div style={{ color: '#000' }}><strong>อ้างอิงการนับ / Count Ref:</strong> {adjustment?.stock_count_id ? `CNT-${adjustment.stock_count_id}` : '-'}</div>
                </td>
              </tr>
              <tr>
                <td colSpan={2} style={{ border: '1px solid #000', padding: 8 }}>
                  <div style={{ color: '#000' }}><strong>เหตุผล / Reason:</strong> {adjustment?.reason || '-'}</div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Items Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 10 }}>
            <thead>
              <tr style={{ background: '#f0f0f0' }}>
                <th style={{ border: '1px solid #000', padding: 6, width: 40, color: '#000' }}>ลำดับ<br/>No.</th>
                <th style={{ border: '1px solid #000', padding: 6, width: 100, color: '#000' }}>รหัสสินค้า<br/>Item Code</th>
                <th style={{ border: '1px solid #000', padding: 6, color: '#000' }}>รายการสินค้า / Description</th>
                <th style={{ border: '1px solid #000', padding: 6, width: 60, color: '#000' }}>หน่วย<br/>Unit</th>
                <th style={{ border: '1px solid #000', padding: 6, width: 80, color: '#000' }}>จำนวนปรับ<br/>Qty Adj</th>
                <th style={{ border: '1px solid #000', padding: 6, width: 90, color: '#000' }}>ต้นทุน/หน่วย<br/>Unit Cost</th>
                <th style={{ border: '1px solid #000', padding: 6, width: 100, color: '#000' }}>มูลค่ารวม<br/>Total Value</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: any, idx: number) => (
                <tr key={idx}>
                  <td style={{ border: '1px solid #000', padding: 6, textAlign: 'center', color: '#000' }}>{idx + 1}</td>
                  <td style={{ border: '1px solid #000', padding: 6, fontSize: 11, color: '#000' }}>{item.item_code || item.product_code || '-'}</td>
                  <td style={{ border: '1px solid #000', padding: 6, color: '#000' }}>
                    <div style={{ fontWeight: 500 }}>{item.item_name || item.product_name}</div>
                  </td>
                  <td style={{ border: '1px solid #000', padding: 6, textAlign: 'center', color: '#000' }}>{item.unit || 'EA'}</td>
                  <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', color: adjustment?.adjustment_type === 'ADJ_OUT' ? '#c00' : '#000' }}>
                    {adjustment?.adjustment_type === 'ADJ_OUT' ? '-' : '+'}{formatQty(item.qty_adjust)}
                  </td>
                  <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', color: '#000' }}>{formatNumber(item.unit_cost)}</td>
                  <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', color: '#000' }}>{formatNumber(item.line_total || (item.qty_adjust * item.unit_cost))}</td>
                </tr>
              ))}
              {items.length < 8 && [...Array(8 - items.length)].map((_, idx) => (
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
            <tfoot>
              <tr style={{ background: '#f9f9f9' }}>
                <td colSpan={4} style={{ border: '1px solid #000', padding: 8, textAlign: 'right', fontWeight: 'bold', color: '#000' }}>
                  รวมทั้งสิ้น / Total
                </td>
                <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', fontWeight: 'bold', color: '#000' }}>
                  {formatQty(adjustment?.total_qty_adjust || items.reduce((sum: number, i: any) => sum + Number(i.qty_adjust || 0), 0))}
                </td>
                <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', color: '#000' }}>-</td>
                <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', fontWeight: 'bold', color: '#000' }}>
                  {formatNumber(adjustment?.total_value_adjust || items.reduce((sum: number, i: any) => sum + (Number(i.qty_adjust || 0) * Number(i.unit_cost || 0)), 0))}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Remark */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 15 }}>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #000', padding: 8 }}>
                  <div style={{ color: '#000' }}><strong>หมายเหตุ / Remark:</strong></div>
                  <div style={{ marginTop: 5, minHeight: 30, color: '#000' }}>{adjustment?.remark || '-'}</div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Signatures */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
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
                <td style={{ width: '33%', border: '1px solid #000', padding: 15, textAlign: 'center', color: '#000' }}>
                  <div style={{ marginBottom: 40 }}>ผู้อนุมัติ / Approved By</div>
                  <div>(..........................................)</div>
                  <div>วันที่/Date ......./......./.......</div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Footer Note */}
          <div style={{ marginTop: 10, fontSize: 11, color: '#666', textAlign: 'center' }}>
            เอกสารฉบับนี้ออกโดยระบบคอมพิวเตอร์ / This document is computer generated
          </div>
        </div>
      )}
    </Modal>
  );
};

export default StockAdjustmentPrintPreview;
