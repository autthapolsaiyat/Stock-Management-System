import React, { useEffect, useState } from 'react';
import { Modal, Button, Spin } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { systemSettingsApi } from '../../services/api';

interface FixedAssetPrintPreviewProps {
  open: boolean;
  onClose: () => void;
  assets: any[];
  asOfDate?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  BUILDING: 'อาคารและสิ่งปลูกสร้าง',
  VEHICLE: 'ยานพาหนะ',
  MACHINERY: 'เครื่องจักรและอุปกรณ์',
  FURNITURE: 'เครื่องตกแต่งและติดตั้ง',
  COMPUTER: 'คอมพิวเตอร์และอุปกรณ์',
  OTHER: 'สินทรัพย์อื่น',
};

const STATUS_LABELS: Record<string, { text: string; color: string }> = {
  ACTIVE: { text: 'ใช้งาน', color: '#52c41a' },
  DISPOSED: { text: 'จำหน่ายแล้ว', color: '#ff4d4f' },
  FULLY_DEPRECIATED: { text: 'หมดค่าเสื่อม', color: '#faad14' },
};

const FixedAssetPrintPreview: React.FC<FixedAssetPrintPreviewProps> = ({
  open,
  onClose,
  assets,
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
    const printContent = document.getElementById('asset-print-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>ทะเบียนสินทรัพย์ถาวร</title>
              <style>
                @page { size: A4 landscape; margin: 10mm; }
                body { font-family: 'Sarabun', 'TH Sarabun New', sans-serif; font-size: 11px; margin: 0; padding: 15px; color: #000; }
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #000; padding: 4px 6px; }
                th { background: #f0f0f0; font-weight: bold; }
                .text-center { text-align: center; }
                .text-right { text-align: right; }
                .header { text-align: center; margin-bottom: 15px; }
                .category-header { background: #e6f7ff; font-weight: bold; }
                .subtotal-row { background: #fafafa; font-weight: bold; }
                .grand-total { background: #fffbe6; font-weight: bold; font-size: 12px; }
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

  // Group assets by category
  const groupedAssets = assets.reduce((acc: Record<string, any[]>, asset) => {
    const category = asset.category || 'OTHER';
    if (!acc[category]) acc[category] = [];
    acc[category].push(asset);
    return acc;
  }, {});

  // Calculate totals
  const totals = {
    acquisitionCost: assets.reduce((sum, a) => sum + Number(a.acquisitionCost || 0), 0),
    accumulatedDepreciation: assets.reduce((sum, a) => sum + Number(a.accumulatedDepreciation || 0), 0),
    netBookValue: assets.reduce((sum, a) => sum + Number(a.netBookValue || 0), 0),
  };

  const today = new Date();
  const reportDate = asOfDate ? new Date(asOfDate) : today;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={1200}
      title="พิมพ์ทะเบียนสินทรัพย์ถาวร"
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
        <div id="asset-print-content" style={{ padding: 15, background: '#fff', border: '1px solid #ddd', fontSize: 11 }}>
          {/* Header */}
          <div className="header">
            <div style={{ fontSize: 16, fontWeight: 'bold' }}>
              {companySettings.COMPANY_NAME_TH || 'บริษัท แสงวิทย์ ไซเอนซ์ จำกัด'}
            </div>
            <div style={{ fontSize: 18, fontWeight: 'bold', marginTop: 5 }}>
              ทะเบียนสินทรัพย์ถาวร
            </div>
            <div style={{ fontSize: 12 }}>
              ณ วันที่ {formatDate(reportDate.toISOString())}
            </div>
          </div>

          {/* Data Table */}
          <table>
            <thead>
              <tr>
                <th style={{ width: 40 }}>ลำดับ</th>
                <th style={{ width: 80 }}>รหัส</th>
                <th style={{ width: 180 }}>ชื่อสินทรัพย์</th>
                <th style={{ width: 100 }}>สถานที่</th>
                <th style={{ width: 80 }}>วันที่ได้มา</th>
                <th style={{ width: 100 }} className="text-right">ราคาทุน</th>
                <th style={{ width: 50 }} className="text-center">อายุ(ปี)</th>
                <th style={{ width: 80 }}>วิธีคิดค่าเสื่อม</th>
                <th style={{ width: 100 }} className="text-right">ค่าเสื่อมสะสม</th>
                <th style={{ width: 100 }} className="text-right">มูลค่าสุทธิ</th>
                <th style={{ width: 70 }} className="text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(groupedAssets).map(([category, categoryAssets]) => {
                const categoryTotals = {
                  acquisitionCost: categoryAssets.reduce((sum, a) => sum + Number(a.acquisitionCost || 0), 0),
                  accumulatedDepreciation: categoryAssets.reduce((sum, a) => sum + Number(a.accumulatedDepreciation || 0), 0),
                  netBookValue: categoryAssets.reduce((sum, a) => sum + Number(a.netBookValue || 0), 0),
                };

                return (
                  <React.Fragment key={category}>
                    {/* Category Header */}
                    <tr className="category-header">
                      <td colSpan={11}>{CATEGORY_LABELS[category] || category}</td>
                    </tr>
                    
                    {/* Assets in category */}
                    {categoryAssets.map((asset, idx) => (
                      <tr key={asset.id}>
                        <td className="text-center">{idx + 1}</td>
                        <td>{asset.assetCode}</td>
                        <td>{asset.name}</td>
                        <td>{asset.location || '-'}</td>
                        <td className="text-center">{formatDate(asset.acquisitionDate)}</td>
                        <td className="text-right">{formatNumber(asset.acquisitionCost)}</td>
                        <td className="text-center">{asset.usefulLife}</td>
                        <td className="text-center">
                          {asset.depreciationMethod === 'STRAIGHT_LINE' ? 'เส้นตรง' : 'ลดลง'}
                        </td>
                        <td className="text-right">{formatNumber(asset.accumulatedDepreciation)}</td>
                        <td className="text-right">{formatNumber(asset.netBookValue)}</td>
                        <td className="text-center" style={{ color: STATUS_LABELS[asset.status]?.color }}>
                          {STATUS_LABELS[asset.status]?.text || asset.status}
                        </td>
                      </tr>
                    ))}

                    {/* Category Subtotal */}
                    <tr className="subtotal-row">
                      <td colSpan={5} className="text-right">รวม {CATEGORY_LABELS[category]}</td>
                      <td className="text-right">{formatNumber(categoryTotals.acquisitionCost)}</td>
                      <td colSpan={2}></td>
                      <td className="text-right">{formatNumber(categoryTotals.accumulatedDepreciation)}</td>
                      <td className="text-right">{formatNumber(categoryTotals.netBookValue)}</td>
                      <td></td>
                    </tr>
                  </React.Fragment>
                );
              })}

              {/* Grand Total */}
              <tr className="grand-total">
                <td colSpan={5} className="text-right">รวมสินทรัพย์ถาวรทั้งหมด ({assets.length} รายการ)</td>
                <td className="text-right">{formatNumber(totals.acquisitionCost)}</td>
                <td colSpan={2}></td>
                <td className="text-right">{formatNumber(totals.accumulatedDepreciation)}</td>
                <td className="text-right">{formatNumber(totals.netBookValue)}</td>
                <td></td>
              </tr>
            </tbody>
          </table>

          {/* Summary by Status */}
          <div style={{ marginTop: 20, display: 'flex', gap: 30 }}>
            <div>
              <strong>สรุปตามสถานะ:</strong>
              <ul style={{ margin: '5px 0', paddingLeft: 20 }}>
                <li>ใช้งาน: {assets.filter(a => a.status === 'ACTIVE').length} รายการ</li>
                <li>หมดค่าเสื่อม: {assets.filter(a => a.status === 'FULLY_DEPRECIATED').length} รายการ</li>
                <li>จำหน่ายแล้ว: {assets.filter(a => a.status === 'DISPOSED').length} รายการ</li>
              </ul>
            </div>
            <div>
              <strong>สรุปมูลค่า:</strong>
              <ul style={{ margin: '5px 0', paddingLeft: 20 }}>
                <li>ราคาทุนรวม: {formatNumber(totals.acquisitionCost)} บาท</li>
                <li>ค่าเสื่อมสะสม: {formatNumber(totals.accumulatedDepreciation)} บาท</li>
                <li>มูลค่าสุทธิ: {formatNumber(totals.netBookValue)} บาท</li>
              </ul>
            </div>
          </div>

          {/* Signatures */}
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 40 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ borderTop: '1px solid #000', width: 150, margin: '50px auto 5px', paddingTop: 5 }}>
                ผู้จัดทำ
              </div>
              <div>วันที่ ____/____/____</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ borderTop: '1px solid #000', width: 150, margin: '50px auto 5px', paddingTop: 5 }}>
                ผู้ตรวจสอบ
              </div>
              <div>วันที่ ____/____/____</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ borderTop: '1px solid #000', width: 150, margin: '50px auto 5px', paddingTop: 5 }}>
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

export default FixedAssetPrintPreview;
