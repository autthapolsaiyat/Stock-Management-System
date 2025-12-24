import React, { useEffect, useState } from 'react';
import { Modal, Button, Spin, Select, message } from 'antd';
import { PrinterOutlined, FileExcelOutlined } from '@ant-design/icons';
import { systemSettingsApi, warehousesApi, stockBalanceApi } from '../../services/api';

interface StockBalanceReportPrintProps {
  open: boolean;
  onClose: () => void;
}

const StockBalanceReportPrint: React.FC<StockBalanceReportPrintProps> = ({
  open,
  onClose,
}) => {
  const [companySettings, setCompanySettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<number | null>(null);
  const [stockData, setStockData] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (open) {
      loadSettings();
      loadWarehouses();
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

  const loadWarehouses = async () => {
    try {
      const res = await warehousesApi.getAll();
      setWarehouses(res.data || []);
    } catch (error) {
      console.error('Load warehouses error:', error);
    }
  };

  const loadStockData = async (warehouseId?: number) => {
    setLoadingData(true);
    try {
      const res = await stockBalanceApi.getAll({ warehouse_id: warehouseId });
      setStockData(res.data || []);
    } catch (error) {
      console.error('Load stock data error:', error);
      message.error('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoadingData(false);
    }
  };

  const handleWarehouseChange = (value: number | null) => {
    setSelectedWarehouse(value);
    loadStockData(value || undefined);
  };

  const handlePrint = () => {
    const printContent = document.getElementById('balance-print-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>รายงานสินค้าคงเหลือ</title>
              <style>
                @page { size: A4 landscape; margin: 8mm; }
                body { font-family: 'Sarabun', 'TH Sarabun New', sans-serif; font-size: 11px; margin: 0; padding: 8px; color: #000; }
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

  const handleExportExcel = () => {
    // Create CSV content
    const headers = ['ลำดับ', 'รหัสสินค้า', 'ชื่อสินค้า', 'คลังสินค้า', 'หน่วย', 'คงเหลือ', 'จอง', 'พร้อมใช้', 'ต้นทุนเฉลี่ย', 'มูลค่ารวม'];
    const rows = stockData.map((item, idx) => [
      idx + 1,
      item.product_code || '',
      item.product_name || '',
      item.warehouse_name || '',
      item.unit || 'EA',
      item.qty_on_hand || 0,
      item.qty_reserved || 0,
      item.qty_available || 0,
      item.avg_cost || 0,
      (item.qty_on_hand || 0) * (item.avg_cost || 0)
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `stock_balance_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    message.success('ส่งออก Excel สำเร็จ');
  };

  const formatNumber = (num: number) => {
    return Number(num || 0).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatQty = (num: number) => {
    return Number(num || 0).toLocaleString('th-TH', { minimumFractionDigits: 0, maximumFractionDigits: 4 });
  };

  const formatDate = () => {
    const date = new Date();
    const thaiMonths = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 
                        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
    const thaiYear = date.getFullYear() + 543;
    return `${date.getDate()} ${thaiMonths[date.getMonth()]} ${thaiYear}`;
  };

  const totalValue = stockData.reduce((sum, item) => sum + ((item.qty_on_hand || 0) * (item.avg_cost || 0)), 0);
  const totalQty = stockData.reduce((sum, item) => sum + (item.qty_on_hand || 0), 0);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={1100}
      title="พิมพ์รายงานสินค้าคงเหลือ"
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
        <>
          {/* Filter */}
          <div style={{ marginBottom: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
            <span>เลือกคลังสินค้า:</span>
            <Select
              style={{ width: 250 }}
              placeholder="ทุกคลัง"
              allowClear
              value={selectedWarehouse}
              onChange={handleWarehouseChange}
              options={warehouses.map(w => ({ value: w.id, label: w.name }))}
            />
            <Button onClick={() => loadStockData(selectedWarehouse || undefined)} loading={loadingData}>
              โหลดข้อมูล
            </Button>
            <span style={{ marginLeft: 'auto', color: '#666' }}>
              พบ {stockData.length} รายการ
            </span>
          </div>

          <div id="balance-print-content" style={{ padding: 15, background: '#fff', color: '#000', fontFamily: 'Sarabun, sans-serif' }}>
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
              รายงานสินค้าคงเหลือ / Stock Balance Report
            </div>

            {/* Report Info */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 8 }}>
              <tbody>
                <tr>
                  <td style={{ border: '1px solid #000', padding: 6, fontSize: 12 }}>
                    <strong>วันที่พิมพ์:</strong> {formatDate()}
                  </td>
                  <td style={{ border: '1px solid #000', padding: 6, fontSize: 12 }}>
                    <strong>คลังสินค้า:</strong> {selectedWarehouse ? warehouses.find(w => w.id === selectedWarehouse)?.name : 'ทุกคลัง'}
                  </td>
                  <td style={{ border: '1px solid #000', padding: 6, fontSize: 12 }}>
                    <strong>จำนวนรายการ:</strong> {stockData.length} รายการ
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Stock Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 10 }}>
              <thead>
                <tr style={{ background: '#f0f0f0' }}>
                  <th style={{ border: '1px solid #000', padding: 4, width: 35, fontSize: 10 }}>ลำดับ</th>
                  <th style={{ border: '1px solid #000', padding: 4, width: 80, fontSize: 10 }}>รหัสสินค้า</th>
                  <th style={{ border: '1px solid #000', padding: 4, fontSize: 10 }}>ชื่อสินค้า</th>
                  <th style={{ border: '1px solid #000', padding: 4, width: 100, fontSize: 10 }}>คลังสินค้า</th>
                  <th style={{ border: '1px solid #000', padding: 4, width: 45, fontSize: 10 }}>หน่วย</th>
                  <th style={{ border: '1px solid #000', padding: 4, width: 60, fontSize: 10 }}>คงเหลือ</th>
                  <th style={{ border: '1px solid #000', padding: 4, width: 50, fontSize: 10 }}>จอง</th>
                  <th style={{ border: '1px solid #000', padding: 4, width: 60, fontSize: 10 }}>พร้อมใช้</th>
                  <th style={{ border: '1px solid #000', padding: 4, width: 70, fontSize: 10 }}>ต้นทุนเฉลี่ย</th>
                  <th style={{ border: '1px solid #000', padding: 4, width: 80, fontSize: 10 }}>มูลค่ารวม</th>
                </tr>
              </thead>
              <tbody>
                {stockData.length > 0 ? stockData.map((item: any, idx: number) => (
                  <tr key={idx}>
                    <td style={{ border: '1px solid #000', padding: 3, textAlign: 'center', fontSize: 10 }}>{idx + 1}</td>
                    <td style={{ border: '1px solid #000', padding: 3, fontSize: 9 }}>{item.product_code || '-'}</td>
                    <td style={{ border: '1px solid #000', padding: 3, fontSize: 10 }}>{item.product_name || '-'}</td>
                    <td style={{ border: '1px solid #000', padding: 3, fontSize: 10 }}>{item.warehouse_name || '-'}</td>
                    <td style={{ border: '1px solid #000', padding: 3, textAlign: 'center', fontSize: 10 }}>{item.unit || 'EA'}</td>
                    <td style={{ border: '1px solid #000', padding: 3, textAlign: 'right', fontSize: 10, color: item.qty_on_hand < 0 ? '#c00' : '#000' }}>
                      {formatQty(item.qty_on_hand)}
                    </td>
                    <td style={{ border: '1px solid #000', padding: 3, textAlign: 'right', fontSize: 10 }}>{formatQty(item.qty_reserved)}</td>
                    <td style={{ border: '1px solid #000', padding: 3, textAlign: 'right', fontSize: 10 }}>{formatQty(item.qty_available)}</td>
                    <td style={{ border: '1px solid #000', padding: 3, textAlign: 'right', fontSize: 10 }}>{formatNumber(item.avg_cost)}</td>
                    <td style={{ border: '1px solid #000', padding: 3, textAlign: 'right', fontSize: 10 }}>
                      {formatNumber((item.qty_on_hand || 0) * (item.avg_cost || 0))}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={10} style={{ border: '1px solid #000', padding: 20, textAlign: 'center', color: '#666' }}>
                      กรุณากดปุ่ม "โหลดข้อมูล" เพื่อดึงข้อมูลสินค้าคงเหลือ
                    </td>
                  </tr>
                )}
              </tbody>
              {stockData.length > 0 && (
                <tfoot>
                  <tr style={{ background: '#e8f5e9' }}>
                    <td colSpan={5} style={{ border: '1px solid #000', padding: 6, textAlign: 'right', fontWeight: 'bold', fontSize: 11 }}>
                      รวมทั้งสิ้น
                    </td>
                    <td style={{ border: '1px solid #000', padding: 3, textAlign: 'right', fontWeight: 'bold', fontSize: 11 }}>
                      {formatQty(totalQty)}
                    </td>
                    <td colSpan={3} style={{ border: '1px solid #000', padding: 3, fontSize: 10 }}></td>
                    <td style={{ border: '1px solid #000', padding: 3, textAlign: 'right', fontWeight: 'bold', fontSize: 11, color: '#1b5e20' }}>
                      {formatNumber(totalValue)}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>

            {/* Footer */}
            <div style={{ marginTop: 10, fontSize: 10, color: '#666', textAlign: 'center' }}>
              พิมพ์เมื่อ: {new Date().toLocaleString('th-TH')} | เอกสารฉบับนี้ออกโดยระบบคอมพิวเตอร์
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};

export default StockBalanceReportPrint;
