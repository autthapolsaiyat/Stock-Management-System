import React, { useEffect, useState } from 'react';
import { Modal, Button, Spin } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { systemSettingsApi } from '../../services/api';

interface StockCountPrintPreviewProps {
  open: boolean;
  onClose: () => void;
  stockCount: any;
  printType?: 'count_sheet' | 'variance_report';
}

const StockCountPrintPreview: React.FC<StockCountPrintPreviewProps> = ({
  open,
  onClose,
  stockCount,
  printType = 'count_sheet',
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
    const printContent = document.getElementById('count-print-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        const title = printType === 'count_sheet' 
          ? `ใบนับสต็อก ${stockCount?.doc_full_no || ''}`
          : `รายงานผลต่างการนับ ${stockCount?.doc_full_no || ''}`;
        printWindow.document.write(`
          <html>
            <head>
              <title>${title}</title>
              <style>
                @page { size: A4; margin: 8mm; }
                body { font-family: 'Sarabun', 'TH Sarabun New', sans-serif; font-size: 12px; margin: 0; padding: 8px; color: #000; }
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #000; padding: 3px 5px; color: #000; }
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
    const thaiYear = date.getFullYear() + 543;
    return `${date.getDate()} ${thaiMonths[date.getMonth()]} ${thaiYear}`;
  };

  const formatNumber = (num: number) => {
    return Number(num || 0).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatQty = (num: number) => {
    return Number(num || 0).toLocaleString('th-TH', { minimumFractionDigits: 0, maximumFractionDigits: 4 });
  };

  const getCountTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'FULL': 'นับทั้งคลัง (Full Count)',
      'PARTIAL': 'นับบางหมวด (Partial Count)',
      'CYCLE': 'นับวนรอบ (Cycle Count)',
    };
    return labels[type] || type;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'DRAFT': 'ร่าง',
      'IN_PROGRESS': 'กำลังนับ',
      'COMPLETED': 'นับเสร็จ',
      'APPROVED': 'อนุมัติแล้ว',
      'ADJUSTED': 'ปรับสต็อกแล้ว',
      'CANCELLED': 'ยกเลิก',
    };
    return labels[status] || status;
  };

  const items = stockCount?.items || [];
  const varianceItems = items.filter((i: any) => Number(i.qty_variance) !== 0);

  // Render Count Sheet (for counting)
  const renderCountSheet = () => (
    <div id="count-print-content" style={{ padding: 15, background: '#fff', color: '#000', fontFamily: 'Sarabun, sans-serif' }}>
      {/* Header */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 8 }}>
        <tbody>
          <tr>
            <td style={{ width: '50%', verticalAlign: 'top', border: 'none' }}>
              <div style={{ fontWeight: 'bold', fontSize: 13, color: '#000' }}>
                {companySettings.COMPANY_NAME_TH || 'บริษัท แสงวิทย์ ไซเอนซ์ จำกัด'}
              </div>
              <div style={{ fontSize: 11, color: '#000' }}>{companySettings.COMPANY_ADDRESS1_TH || ''}</div>
            </td>
            <td style={{ width: '50%', verticalAlign: 'top', border: 'none', textAlign: 'right' }}>
              {companySettings.COMPANY_LOGO_URL && (
                <img src={companySettings.COMPANY_LOGO_URL} alt="Logo" style={{ maxHeight: 50, maxWidth: 100 }} />
              )}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Title */}
      <div style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold', margin: '10px 0', borderTop: '2px solid #000', borderBottom: '2px solid #000', padding: '6px 0', color: '#000' }}>
        ใบนับสต็อก / Stock Count Sheet
      </div>

      {/* Document Info */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 8 }}>
        <tbody>
          <tr>
            <td style={{ width: '50%', border: '1px solid #000', padding: 6, fontSize: 12 }}>
              <div><strong>เลขที่:</strong> {stockCount?.doc_full_no || '-'}</div>
              <div><strong>คลัง:</strong> {stockCount?.warehouse_name || '-'}</div>
            </td>
            <td style={{ width: '50%', border: '1px solid #000', padding: 6, fontSize: 12 }}>
              <div><strong>วันที่นับ:</strong> {formatDate(stockCount?.count_date)}</div>
              <div><strong>ประเภท:</strong> {getCountTypeLabel(stockCount?.count_type)}</div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Items Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 8 }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th style={{ border: '1px solid #000', padding: 4, width: 30, fontSize: 11 }}>ลำดับ</th>
            <th style={{ border: '1px solid #000', padding: 4, width: 80, fontSize: 11 }}>รหัสสินค้า</th>
            <th style={{ border: '1px solid #000', padding: 4, fontSize: 11 }}>ชื่อสินค้า</th>
            <th style={{ border: '1px solid #000', padding: 4, width: 45, fontSize: 11 }}>หน่วย</th>
            <th style={{ border: '1px solid #000', padding: 4, width: 55, fontSize: 11 }}>ในระบบ</th>
            <th style={{ border: '1px solid #000', padding: 4, width: 65, fontSize: 11 }}>นับครั้งที่ 1</th>
            <th style={{ border: '1px solid #000', padding: 4, width: 65, fontSize: 11 }}>นับครั้งที่ 2</th>
            <th style={{ border: '1px solid #000', padding: 4, width: 80, fontSize: 11 }}>หมายเหตุ</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item: any, idx: number) => (
            <tr key={idx}>
              <td style={{ border: '1px solid #000', padding: 3, textAlign: 'center', fontSize: 11 }}>{idx + 1}</td>
              <td style={{ border: '1px solid #000', padding: 3, fontSize: 10 }}>{item.product_code || item.item_code || '-'}</td>
              <td style={{ border: '1px solid #000', padding: 3, fontSize: 11 }}>{item.product_name || item.item_name}</td>
              <td style={{ border: '1px solid #000', padding: 3, textAlign: 'center', fontSize: 11 }}>{item.unit || 'EA'}</td>
              <td style={{ border: '1px solid #000', padding: 3, textAlign: 'right', fontSize: 11 }}>{formatQty(item.qty_system)}</td>
              <td style={{ border: '1px solid #000', padding: 3, textAlign: 'center', fontSize: 11, background: '#fffde7' }}>
                {item.qty_count1 !== null ? formatQty(item.qty_count1) : ''}
              </td>
              <td style={{ border: '1px solid #000', padding: 3, textAlign: 'center', fontSize: 11, background: '#fffde7' }}>
                {item.qty_count2 !== null ? formatQty(item.qty_count2) : ''}
              </td>
              <td style={{ border: '1px solid #000', padding: 3, fontSize: 10 }}>{item.remark || ''}</td>
            </tr>
          ))}
          {/* Add empty rows if items < 20 for writing space */}
          {items.length < 20 && [...Array(Math.min(20 - items.length, 10))].map((_, idx) => (
            <tr key={`empty-${idx}`}>
              <td style={{ border: '1px solid #000', padding: 3, height: 20, fontSize: 11 }}>{items.length + idx + 1}</td>
              <td style={{ border: '1px solid #000', padding: 3 }}>&nbsp;</td>
              <td style={{ border: '1px solid #000', padding: 3 }}>&nbsp;</td>
              <td style={{ border: '1px solid #000', padding: 3 }}>&nbsp;</td>
              <td style={{ border: '1px solid #000', padding: 3 }}>&nbsp;</td>
              <td style={{ border: '1px solid #000', padding: 3, background: '#fffde7' }}>&nbsp;</td>
              <td style={{ border: '1px solid #000', padding: 3, background: '#fffde7' }}>&nbsp;</td>
              <td style={{ border: '1px solid #000', padding: 3 }}>&nbsp;</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 10 }}>
        <tbody>
          <tr>
            <td style={{ border: '1px solid #000', padding: 6, fontSize: 12 }}>
              <strong>รวมรายการทั้งหมด:</strong> {items.length} รายการ
            </td>
            <td style={{ border: '1px solid #000', padding: 6, fontSize: 12 }}>
              <strong>คำอธิบาย:</strong> {stockCount?.description || '-'}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Signatures */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td style={{ width: '33%', border: '1px solid #000', padding: 10, textAlign: 'center', height: 70, fontSize: 11 }}>
              <div style={{ marginBottom: 30 }}>ผู้นับ / Counter</div>
              <div>(..........................................)</div>
              <div>วันที่ ......./......./.......</div>
            </td>
            <td style={{ width: '33%', border: '1px solid #000', padding: 10, textAlign: 'center', fontSize: 11 }}>
              <div style={{ marginBottom: 30 }}>ผู้ตรวจสอบ / Checker</div>
              <div>(..........................................)</div>
              <div>วันที่ ......./......./.......</div>
            </td>
            <td style={{ width: '33%', border: '1px solid #000', padding: 10, textAlign: 'center', fontSize: 11 }}>
              <div style={{ marginBottom: 30 }}>ผู้อนุมัติ / Approved</div>
              <div>(..........................................)</div>
              <div>วันที่ ......./......./.......</div>
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginTop: 8, fontSize: 10, color: '#666', textAlign: 'center' }}>
        หน้า 1 / {Math.ceil(items.length / 20)} | พิมพ์เมื่อ: {new Date().toLocaleString('th-TH')}
      </div>
    </div>
  );

  // Render Variance Report (after counting)
  const renderVarianceReport = () => (
    <div id="count-print-content" style={{ padding: 15, background: '#fff', color: '#000', fontFamily: 'Sarabun, sans-serif' }}>
      {/* Header */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 8 }}>
        <tbody>
          <tr>
            <td style={{ width: '50%', verticalAlign: 'top', border: 'none' }}>
              <div style={{ fontWeight: 'bold', fontSize: 13, color: '#000' }}>
                {companySettings.COMPANY_NAME_TH || 'บริษัท แสงวิทย์ ไซเอนซ์ จำกัด'}
              </div>
              <div style={{ fontSize: 11, color: '#000' }}>{companySettings.COMPANY_ADDRESS1_TH || ''}</div>
            </td>
            <td style={{ width: '50%', verticalAlign: 'top', border: 'none', textAlign: 'right' }}>
              {companySettings.COMPANY_LOGO_URL && (
                <img src={companySettings.COMPANY_LOGO_URL} alt="Logo" style={{ maxHeight: 50, maxWidth: 100 }} />
              )}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Title */}
      <div style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold', margin: '10px 0', borderTop: '2px solid #000', borderBottom: '2px solid #000', padding: '6px 0', color: '#000' }}>
        รายงานผลต่างการนับสต็อก / Stock Count Variance Report
      </div>

      {/* Document Info */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 8 }}>
        <tbody>
          <tr>
            <td style={{ width: '50%', border: '1px solid #000', padding: 6, fontSize: 12 }}>
              <div><strong>เลขที่:</strong> {stockCount?.doc_full_no || '-'}</div>
              <div><strong>คลัง:</strong> {stockCount?.warehouse_name || '-'}</div>
              <div><strong>สถานะ:</strong> {getStatusLabel(stockCount?.status)}</div>
            </td>
            <td style={{ width: '50%', border: '1px solid #000', padding: 6, fontSize: 12 }}>
              <div><strong>วันที่นับ:</strong> {formatDate(stockCount?.count_date)}</div>
              <div><strong>ประเภท:</strong> {getCountTypeLabel(stockCount?.count_type)}</div>
              <div><strong>รายการนับแล้ว:</strong> {stockCount?.counted_items || 0} / {stockCount?.total_items || 0}</div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Variance Items Table */}
      <div style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 5, color: '#000' }}>
        รายการที่มีผลต่าง ({varianceItems.length} รายการ)
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 10 }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th style={{ border: '1px solid #000', padding: 4, width: 30, fontSize: 11 }}>ลำดับ</th>
            <th style={{ border: '1px solid #000', padding: 4, width: 80, fontSize: 11 }}>รหัสสินค้า</th>
            <th style={{ border: '1px solid #000', padding: 4, fontSize: 11 }}>ชื่อสินค้า</th>
            <th style={{ border: '1px solid #000', padding: 4, width: 45, fontSize: 11 }}>หน่วย</th>
            <th style={{ border: '1px solid #000', padding: 4, width: 55, fontSize: 11 }}>ในระบบ</th>
            <th style={{ border: '1px solid #000', padding: 4, width: 55, fontSize: 11 }}>นับได้</th>
            <th style={{ border: '1px solid #000', padding: 4, width: 55, fontSize: 11 }}>ผลต่าง</th>
            <th style={{ border: '1px solid #000', padding: 4, width: 70, fontSize: 11 }}>ต้นทุน</th>
            <th style={{ border: '1px solid #000', padding: 4, width: 80, fontSize: 11 }}>มูลค่าผลต่าง</th>
          </tr>
        </thead>
        <tbody>
          {varianceItems.length > 0 ? varianceItems.map((item: any, idx: number) => (
            <tr key={idx}>
              <td style={{ border: '1px solid #000', padding: 3, textAlign: 'center', fontSize: 11 }}>{idx + 1}</td>
              <td style={{ border: '1px solid #000', padding: 3, fontSize: 10 }}>{item.product_code || item.item_code || '-'}</td>
              <td style={{ border: '1px solid #000', padding: 3, fontSize: 11 }}>{item.product_name || item.item_name}</td>
              <td style={{ border: '1px solid #000', padding: 3, textAlign: 'center', fontSize: 11 }}>{item.unit || 'EA'}</td>
              <td style={{ border: '1px solid #000', padding: 3, textAlign: 'right', fontSize: 11 }}>{formatQty(item.qty_system)}</td>
              <td style={{ border: '1px solid #000', padding: 3, textAlign: 'right', fontSize: 11 }}>{formatQty(item.qty_final)}</td>
              <td style={{ border: '1px solid #000', padding: 3, textAlign: 'right', fontSize: 11, color: Number(item.qty_variance) < 0 ? '#c00' : '#080' }}>
                {Number(item.qty_variance) > 0 ? '+' : ''}{formatQty(item.qty_variance)}
              </td>
              <td style={{ border: '1px solid #000', padding: 3, textAlign: 'right', fontSize: 11 }}>{formatNumber(item.unit_cost)}</td>
              <td style={{ border: '1px solid #000', padding: 3, textAlign: 'right', fontSize: 11, color: Number(item.value_variance) < 0 ? '#c00' : '#080' }}>
                {formatNumber(item.value_variance)}
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={9} style={{ border: '1px solid #000', padding: 20, textAlign: 'center', fontSize: 12, color: '#666' }}>
                ไม่พบรายการที่มีผลต่าง
              </td>
            </tr>
          )}
        </tbody>
        {varianceItems.length > 0 && (
          <tfoot>
            <tr style={{ background: '#f9f9f9' }}>
              <td colSpan={6} style={{ border: '1px solid #000', padding: 6, textAlign: 'right', fontWeight: 'bold', fontSize: 12 }}>
                รวมมูลค่าผลต่างทั้งสิ้น
              </td>
              <td style={{ border: '1px solid #000', padding: 3, textAlign: 'right', fontWeight: 'bold', fontSize: 11 }}>
                {formatQty(varianceItems.reduce((sum: number, i: any) => sum + Number(i.qty_variance || 0), 0))}
              </td>
              <td style={{ border: '1px solid #000', padding: 3, fontSize: 11 }}>-</td>
              <td style={{ border: '1px solid #000', padding: 3, textAlign: 'right', fontWeight: 'bold', fontSize: 11, color: Number(stockCount?.total_variance_value) < 0 ? '#c00' : '#080' }}>
                {formatNumber(stockCount?.total_variance_value || varianceItems.reduce((sum: number, i: any) => sum + Number(i.value_variance || 0), 0))}
              </td>
            </tr>
          </tfoot>
        )}
      </table>

      {/* Summary Statistics */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 10 }}>
        <tbody>
          <tr>
            <td style={{ border: '1px solid #000', padding: 8, width: '25%', textAlign: 'center', fontSize: 12 }}>
              <div style={{ fontWeight: 'bold' }}>รายการทั้งหมด</div>
              <div style={{ fontSize: 18, color: '#1890ff' }}>{stockCount?.total_items || 0}</div>
            </td>
            <td style={{ border: '1px solid #000', padding: 8, width: '25%', textAlign: 'center', fontSize: 12 }}>
              <div style={{ fontWeight: 'bold' }}>นับแล้ว</div>
              <div style={{ fontSize: 18, color: '#52c41a' }}>{stockCount?.counted_items || 0}</div>
            </td>
            <td style={{ border: '1px solid #000', padding: 8, width: '25%', textAlign: 'center', fontSize: 12 }}>
              <div style={{ fontWeight: 'bold' }}>มีผลต่าง</div>
              <div style={{ fontSize: 18, color: '#fa8c16' }}>{stockCount?.variance_items || varianceItems.length}</div>
            </td>
            <td style={{ border: '1px solid #000', padding: 8, width: '25%', textAlign: 'center', fontSize: 12 }}>
              <div style={{ fontWeight: 'bold' }}>มูลค่าผลต่าง</div>
              <div style={{ fontSize: 16, color: Number(stockCount?.total_variance_value) < 0 ? '#f5222d' : '#52c41a' }}>
                {formatNumber(stockCount?.total_variance_value || 0)}
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Signatures */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td style={{ width: '33%', border: '1px solid #000', padding: 10, textAlign: 'center', height: 70, fontSize: 11 }}>
              <div style={{ marginBottom: 30 }}>ผู้จัดทำรายงาน / Prepared By</div>
              <div>(..........................................)</div>
              <div>วันที่ ......./......./.......</div>
            </td>
            <td style={{ width: '33%', border: '1px solid #000', padding: 10, textAlign: 'center', fontSize: 11 }}>
              <div style={{ marginBottom: 30 }}>ผู้ตรวจสอบ / Checked By</div>
              <div>(..........................................)</div>
              <div>วันที่ ......./......./.......</div>
            </td>
            <td style={{ width: '33%', border: '1px solid #000', padding: 10, textAlign: 'center', fontSize: 11 }}>
              <div style={{ marginBottom: 30 }}>ผู้อนุมัติ / Approved By</div>
              <div>(..........................................)</div>
              <div>วันที่ ......./......./.......</div>
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginTop: 8, fontSize: 10, color: '#666', textAlign: 'center' }}>
        เอกสารฉบับนี้ออกโดยระบบคอมพิวเตอร์ | พิมพ์เมื่อ: {new Date().toLocaleString('th-TH')}
      </div>
    </div>
  );

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={950}
      title={printType === 'count_sheet' ? 'พิมพ์ใบนับสต็อก' : 'พิมพ์รายงานผลต่างการนับ'}
      footer={[
        <Button key="close" onClick={onClose}>ปิด</Button>,
        <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>พิมพ์</Button>,
      ]}
      styles={{ body: { maxHeight: '80vh', overflowY: 'auto' } }}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>
      ) : (
        printType === 'count_sheet' ? renderCountSheet() : renderVarianceReport()
      )}
    </Modal>
  );
};

export default StockCountPrintPreview;
