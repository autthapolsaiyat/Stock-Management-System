import React, { useEffect, useState } from 'react';
import { Modal, Button, Spin } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { systemSettingsApi } from '../../services/api';

interface StockIssuePrintPreviewProps {
  open: boolean;
  onClose: () => void;
  issue: any;
}

const StockIssuePrintPreview: React.FC<StockIssuePrintPreviewProps> = ({
  open,
  onClose,
  issue,
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
    const printContent = document.getElementById('issue-print-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>ใบเบิกสินค้า ${issue?.doc_no || ''}</title>
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

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'DRAFT': 'ร่าง',
      'APPROVED': 'อนุมัติแล้ว',
      'ISSUED': 'เบิกแล้ว',
      'CANCELLED': 'ยกเลิก',
    };
    return labels[status] || status;
  };

  const getIssueTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'INTERNAL': 'เบิกใช้ภายใน',
      'PRODUCTION': 'เบิกเพื่อผลิต',
      'SAMPLE': 'เบิกตัวอย่าง',
      'DAMAGE': 'เบิกชำรุด/เสียหาย',
      'OTHER': 'อื่นๆ',
    };
    return labels[type] || type || 'เบิกใช้ภายใน';
  };

  const items = issue?.items || [];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={900}
      title="พิมพ์ใบเบิกสินค้า"
      footer={[
        <Button key="close" onClick={onClose}>ปิด</Button>,
        <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>พิมพ์</Button>,
      ]}
      styles={{ body: { maxHeight: '80vh', overflowY: 'auto' } }}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>
      ) : (
        <div id="issue-print-content" style={{ padding: 20, background: '#fff', color: '#000', fontFamily: 'Sarabun, sans-serif' }}>
          {/* Header */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 10 }}>
            <tbody>
              <tr>
                <td style={{ width: '40%', verticalAlign: 'top', border: 'none', paddingRight: 10 }}>
                  <div style={{ fontWeight: 'bold', fontSize: 14, color: '#000' }}>
                    {companySettings.COMPANY_NAME_TH || 'บริษัท แสงวิทย์ ไซเอนซ์ จำกัด'}
                  </div>
                  <div style={{ fontSize: 12, color: '#000' }}>{companySettings.COMPANY_ADDRESS1_TH || ''}</div>
                  <div style={{ fontSize: 12, color: '#000' }}>{companySettings.COMPANY_ADDRESS2_TH || ''}</div>
                  <div style={{ fontSize: 12, color: '#000' }}>โทร. {companySettings.COMPANY_PHONE_TH || ''}</div>
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
                  <div style={{ fontSize: 12, color: '#000' }}>{companySettings.COMPANY_ADDRESS1_EN || ''}</div>
                  <div style={{ fontSize: 12, color: '#000' }}>{companySettings.COMPANY_ADDRESS2_EN || ''}</div>
                  <div style={{ fontSize: 12, color: '#000' }}>Tel. {companySettings.COMPANY_PHONE_EN || ''}</div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Title */}
          <div style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', margin: '15px 0', borderTop: '2px solid #000', borderBottom: '2px solid #000', padding: '8px 0', color: '#000' }}>
            ใบเบิกสินค้า / Stock Issue
          </div>

          {/* Document Info */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 10 }}>
            <tbody>
              <tr>
                <td style={{ width: '50%', verticalAlign: 'top', border: '1px solid #000', padding: 8 }}>
                  <div style={{ color: '#000' }}><strong>เลขที่เอกสาร / Doc No.:</strong> {issue?.doc_no || '-'}</div>
                  <div style={{ color: '#000' }}><strong>วันที่ / Date:</strong> {formatDate(issue?.issue_date || issue?.created_at)}</div>
                  <div style={{ color: '#000' }}><strong>คลังสินค้า / Warehouse:</strong> {issue?.warehouse_name || '-'}</div>
                </td>
                <td style={{ width: '50%', verticalAlign: 'top', border: '1px solid #000', padding: 8 }}>
                  <div style={{ color: '#000' }}><strong>ประเภทการเบิก / Type:</strong> {getIssueTypeLabel(issue?.issue_type)}</div>
                  <div style={{ color: '#000' }}><strong>สถานะ / Status:</strong> {getStatusLabel(issue?.status)}</div>
                  <div style={{ color: '#000' }}><strong>แผนก/ผู้ขอเบิก / Requester:</strong> {issue?.requester || issue?.department || '-'}</div>
                </td>
              </tr>
              <tr>
                <td colSpan={2} style={{ border: '1px solid #000', padding: 8 }}>
                  <div style={{ color: '#000' }}><strong>วัตถุประสงค์ / Purpose:</strong> {issue?.purpose || issue?.remark || '-'}</div>
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
                <th style={{ border: '1px solid #000', padding: 6, width: 80, color: '#000' }}>จำนวนเบิก<br/>Qty Issue</th>
                <th style={{ border: '1px solid #000', padding: 6, width: 90, color: '#000' }}>ต้นทุน/หน่วย<br/>Unit Cost</th>
                <th style={{ border: '1px solid #000', padding: 6, width: 100, color: '#000' }}>มูลค่ารวม<br/>Total Value</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: any, idx: number) => (
                <tr key={idx}>
                  <td style={{ border: '1px solid #000', padding: 6, textAlign: 'center', color: '#000' }}>{idx + 1}</td>
                  <td style={{ border: '1px solid #000', padding: 6, fontSize: 11, color: '#000' }}>{item.product_code || item.item_code || '-'}</td>
                  <td style={{ border: '1px solid #000', padding: 6, color: '#000' }}>
                    <div style={{ fontWeight: 500 }}>{item.product_name || item.item_name}</div>
                  </td>
                  <td style={{ border: '1px solid #000', padding: 6, textAlign: 'center', color: '#000' }}>{item.unit || 'EA'}</td>
                  <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', color: '#000' }}>{formatQty(item.qty || item.quantity)}</td>
                  <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', color: '#000' }}>{formatNumber(item.unit_cost || 0)}</td>
                  <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', color: '#000' }}>{formatNumber(item.total_cost || (item.qty * item.unit_cost) || 0)}</td>
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
                  {formatQty(issue?.total_qty || items.reduce((sum: number, i: any) => sum + Number(i.qty || i.quantity || 0), 0))}
                </td>
                <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', color: '#000' }}>-</td>
                <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', fontWeight: 'bold', color: '#000' }}>
                  {formatNumber(issue?.total_cost || items.reduce((sum: number, i: any) => sum + Number(i.total_cost || (i.qty * i.unit_cost) || 0), 0))}
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
                  <div style={{ marginTop: 5, minHeight: 30, color: '#000' }}>{issue?.remark || '-'}</div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Signatures */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ width: '25%', border: '1px solid #000', padding: 15, textAlign: 'center', height: 90, color: '#000' }}>
                  <div style={{ marginBottom: 35 }}>ผู้ขอเบิก / Requester</div>
                  <div>(..........................................)</div>
                  <div>วันที่ ......./......./.......</div>
                </td>
                <td style={{ width: '25%', border: '1px solid #000', padding: 15, textAlign: 'center', color: '#000' }}>
                  <div style={{ marginBottom: 35 }}>ผู้อนุมัติ / Approved By</div>
                  <div>(..........................................)</div>
                  <div>วันที่ ......./......./.......</div>
                </td>
                <td style={{ width: '25%', border: '1px solid #000', padding: 15, textAlign: 'center', color: '#000' }}>
                  <div style={{ marginBottom: 35 }}>ผู้จ่ายสินค้า / Issued By</div>
                  <div>(..........................................)</div>
                  <div>วันที่ ......./......./.......</div>
                </td>
                <td style={{ width: '25%', border: '1px solid #000', padding: 15, textAlign: 'center', color: '#000' }}>
                  <div style={{ marginBottom: 35 }}>ผู้รับสินค้า / Received By</div>
                  <div>(..........................................)</div>
                  <div>วันที่ ......./......./.......</div>
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

export default StockIssuePrintPreview;
