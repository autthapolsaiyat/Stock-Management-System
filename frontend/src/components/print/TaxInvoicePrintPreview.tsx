import React, { useEffect, useState } from 'react';
import { Modal, Button, Spin, Radio, Space, Checkbox } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { systemSettingsApi } from '../../services/api';

interface TaxInvoicePrintPreviewProps {
  open: boolean;
  onClose: () => void;
  invoice: any;
}

// มาตรฐานสีใบกำกับภาษี (สรรพากร)
const COPY_COLORS = {
  ORIGINAL: { name: 'ต้นฉบับ', color: '#ffffff', label: 'ต้นฉบับ (ลูกค้า)', labelEN: 'ORIGINAL' },
  COPY1: { name: 'สำเนา 1', color: '#fffde7', label: 'สำเนา (บัญชี)', labelEN: 'COPY - ACCOUNTING' },
  COPY2: { name: 'สำเนา 2', color: '#fce4ec', label: 'สำเนา (คลัง)', labelEN: 'COPY - WAREHOUSE' },
  COPY3: { name: 'สำเนา 3', color: '#e3f2fd', label: 'สำเนา (เก็บเข้าเล่ม)', labelEN: 'COPY - FILE' },
};

const TaxInvoicePrintPreview: React.FC<TaxInvoicePrintPreviewProps> = ({
  open,
  onClose,
  invoice,
}) => {
  const [companySettings, setCompanySettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [selectedCopies, setSelectedCopies] = useState<string[]>(['ORIGINAL']);
  const [previewCopy, setPreviewCopy] = useState<string>('ORIGINAL');

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
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      let allPages = '';
      
      selectedCopies.forEach((copyType, index) => {
        const copyConfig = COPY_COLORS[copyType as keyof typeof COPY_COLORS];
        const pageBreak = index > 0 ? 'page-break-before: always;' : '';
        allPages += generateInvoiceHTML(copyConfig, pageBreak);
      });

      printWindow.document.write(`
        <html>
          <head>
            <title>ใบกำกับภาษี ${invoice?.docFullNo || ''}</title>
            <style>
              @page { size: A4; margin: 10mm; }
              @media print {
                body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
              }
              body { font-family: 'Sarabun', 'TH Sarabun New', sans-serif; font-size: 14px; margin: 0; padding: 0; color: #000; }
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 1px solid #000; padding: 6px 8px; color: #000; }
              th { background: #f5f5f5 !important; }
              .copy-label { position: absolute; top: 10px; right: 20px; font-size: 12px; font-weight: bold; padding: 4px 12px; border: 2px solid #000; }
              .header-title { font-size: 22px; font-weight: bold; text-align: center; margin: 10px 0; }
              .company-info { text-align: center; margin-bottom: 15px; }
              .invoice-page { position: relative; padding: 20px; min-height: 100vh; box-sizing: border-box; }
            </style>
          </head>
          <body>${allPages}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const generateInvoiceHTML = (copyConfig: typeof COPY_COLORS.ORIGINAL, pageBreak: string) => {
    const items = invoice?.items || [];
    
    return `
      <div class="invoice-page" style="background-color: ${copyConfig.color}; ${pageBreak}">
        <div class="copy-label" style="background-color: ${copyConfig.color};">
          ${copyConfig.labelEN}<br/>${copyConfig.label}
        </div>
        
        <div class="company-info">
          <div style="font-size: 20px; font-weight: bold;">${companySettings.COMPANY_NAME_TH || 'บริษัท แสงวิทย์ ไซเอนซ์ จำกัด'}</div>
          <div style="font-size: 14px;">${companySettings.COMPANY_NAME_EN || 'SAENGVITH SCIENCE CO., LTD.'}</div>
          <div style="font-size: 12px; margin-top: 5px;">
            ${companySettings.COMPANY_ADDRESS_TH || '123/4-5 ซอยสมเด็จพระปิ่นเกล้า 9 ถนนสมเด็จพระปิ่นเกล้า แขวงอรุณอมรินทร์ เขตบางกอกน้อย กรุงเทพฯ 10700'}
          </div>
          <div style="font-size: 12px;">
            โทร: ${companySettings.COMPANY_PHONE || '02-XXX-XXXX'} | 
            เลขประจำตัวผู้เสียภาษี: ${companySettings.COMPANY_TAX_ID || '0-1055-XXXXX-XX-X'}
          </div>
        </div>

        <div class="header-title">
          ใบกำกับภาษี / TAX INVOICE
        </div>

        <table style="margin-bottom: 15px; border: none;">
          <tr>
            <td style="border: none; width: 60%; vertical-align: top; padding: 0;">
              <table style="width: 100%;">
                <tr>
                  <td style="border: 1px solid #000; width: 80px; background: #f5f5f5;">ลูกค้า</td>
                  <td style="border: 1px solid #000;">${invoice?.customer?.name || invoice?.customerName || '-'}</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000; background: #f5f5f5;">ที่อยู่</td>
                  <td style="border: 1px solid #000;">${invoice?.customer?.address || invoice?.customerAddress || '-'}</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000; background: #f5f5f5;">เลขผู้เสียภาษี</td>
                  <td style="border: 1px solid #000;">${invoice?.customer?.taxId || invoice?.customerTaxId || '-'}</td>
                </tr>
              </table>
            </td>
            <td style="border: none; width: 40%; vertical-align: top; padding: 0 0 0 10px;">
              <table style="width: 100%;">
                <tr>
                  <td style="border: 1px solid #000; width: 100px; background: #f5f5f5;">เลขที่</td>
                  <td style="border: 1px solid #000; font-weight: bold;">${invoice?.docFullNo || '-'}</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000; background: #f5f5f5;">วันที่</td>
                  <td style="border: 1px solid #000;">${formatDate(invoice?.docDate)}</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000; background: #f5f5f5;">อ้างอิง</td>
                  <td style="border: 1px solid #000;">${invoice?.quotationNo || invoice?.referenceNo || '-'}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <table>
          <thead>
            <tr>
              <th style="width: 40px; text-align: center;">ลำดับ</th>
              <th style="width: 100px;">รหัสสินค้า</th>
              <th>รายการ</th>
              <th style="width: 60px; text-align: center;">จำนวน</th>
              <th style="width: 50px; text-align: center;">หน่วย</th>
              <th style="width: 90px; text-align: right;">ราคา/หน่วย</th>
              <th style="width: 100px; text-align: right;">จำนวนเงิน</th>
            </tr>
          </thead>
          <tbody>
            ${items.map((item: any, idx: number) => `
              <tr>
                <td style="text-align: center;">${idx + 1}</td>
                <td>${item.productCode || item.product?.code || '-'}</td>
                <td>${item.productName || item.product?.name || item.description || '-'}</td>
                <td style="text-align: center;">${formatNumber(item.quantity, 0)}</td>
                <td style="text-align: center;">${item.unitName || item.unit?.name || '-'}</td>
                <td style="text-align: right;">${formatNumber(item.unitPrice)}</td>
                <td style="text-align: right;">${formatNumber(item.amount || (item.quantity * item.unitPrice))}</td>
              </tr>
            `).join('')}
            ${Array(Math.max(0, 8 - items.length)).fill(0).map(() => `
              <tr>
                <td>&nbsp;</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <table style="margin-top: 15px;">
          <tr>
            <td style="border: 1px solid #000; width: 60%; vertical-align: top;">
              <div style="font-weight: bold; margin-bottom: 5px;">หมายเหตุ:</div>
              <div>${invoice?.remarks || invoice?.notes || '-'}</div>
              <div style="margin-top: 10px; font-size: 13px;">
                <strong>จำนวนเงิน (ตัวอักษร):</strong> ${numberToThaiText(invoice?.totalAmount || invoice?.grandTotal || 0)}
              </div>
            </td>
            <td style="border: 1px solid #000; width: 40%; padding: 0;">
              <table style="width: 100%; border: none;">
                <tr>
                  <td style="border: none; border-bottom: 1px solid #000; text-align: right; padding: 6px;">รวมเงิน</td>
                  <td style="border: none; border-bottom: 1px solid #000; text-align: right; width: 120px; padding: 6px;">${formatNumber(invoice?.subtotal || invoice?.subTotal || 0)}</td>
                </tr>
                <tr>
                  <td style="border: none; border-bottom: 1px solid #000; text-align: right; padding: 6px;">ส่วนลด</td>
                  <td style="border: none; border-bottom: 1px solid #000; text-align: right; padding: 6px;">${formatNumber(invoice?.discountAmount || invoice?.discount || 0)}</td>
                </tr>
                <tr>
                  <td style="border: none; border-bottom: 1px solid #000; text-align: right; padding: 6px;">ราคาหลังหักส่วนลด</td>
                  <td style="border: none; border-bottom: 1px solid #000; text-align: right; padding: 6px;">${formatNumber((invoice?.subtotal || invoice?.subTotal || 0) - (invoice?.discountAmount || invoice?.discount || 0))}</td>
                </tr>
                <tr>
                  <td style="border: none; border-bottom: 1px solid #000; text-align: right; padding: 6px;">ภาษีมูลค่าเพิ่ม ${invoice?.vatRate || 7}%</td>
                  <td style="border: none; border-bottom: 1px solid #000; text-align: right; padding: 6px;">${formatNumber(invoice?.vatAmount || invoice?.vat || 0)}</td>
                </tr>
                <tr>
                  <td style="border: none; text-align: right; padding: 6px; font-weight: bold; font-size: 16px;">ยอดรวมทั้งสิ้น</td>
                  <td style="border: none; text-align: right; padding: 6px; font-weight: bold; font-size: 16px;">${formatNumber(invoice?.totalAmount || invoice?.grandTotal || 0)}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <table style="margin-top: 30px; border: none;">
          <tr>
            <td style="border: none; text-align: center; width: 33%;">
              <div style="border-top: 1px solid #000; width: 150px; margin: 60px auto 5px; padding-top: 5px;">ผู้รับสินค้า</div>
              <div>วันที่ ____/____/____</div>
            </td>
            <td style="border: none; text-align: center; width: 34%;">
              <div style="border-top: 1px solid #000; width: 150px; margin: 60px auto 5px; padding-top: 5px;">ผู้ตรวจสอบ</div>
              <div>วันที่ ____/____/____</div>
            </td>
            <td style="border: none; text-align: center; width: 33%;">
              <div style="border-top: 1px solid #000; width: 150px; margin: 60px auto 5px; padding-top: 5px;">ผู้มีอำนาจลงนาม</div>
              <div>วันที่ ____/____/____</div>
            </td>
          </tr>
        </table>
      </div>
    `;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    const thaiMonths = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 
                        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
    const thaiYear = date.getFullYear() + 543;
    return `${date.getDate()} ${thaiMonths[date.getMonth()]} ${thaiYear}`;
  };

  const formatNumber = (num: number, decimals: number = 2) => {
    return Number(num || 0).toLocaleString('th-TH', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  };

  const numberToThaiText = (num: number): string => {
    const units = ['', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
    const positions = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];
    
    if (num === 0) return 'ศูนย์บาทถ้วน';
    
    const baht = Math.floor(num);
    const satang = Math.round((num - baht) * 100);
    
    const convertSection = (n: number): string => {
      if (n === 0) return '';
      let result = '';
      let remaining = n;
      let pos = 0;
      
      while (remaining > 0) {
        const digit = remaining % 10;
        if (digit !== 0) {
          if (pos === 0) {
            result = units[digit] + result;
          } else if (pos === 1) {
            if (digit === 1) {
              result = 'สิบ' + result;
            } else if (digit === 2) {
              result = 'ยี่สิบ' + result;
            } else {
              result = units[digit] + 'สิบ' + result;
            }
          } else {
            result = units[digit] + positions[pos] + result;
          }
        }
        remaining = Math.floor(remaining / 10);
        pos++;
      }
      return result.replace('หนึ่งสิบ', 'สิบ').replace('สิบหนึ่ง', 'สิบเอ็ด');
    };
    
    let result = '';
    if (baht >= 1000000) {
      result += convertSection(Math.floor(baht / 1000000)) + 'ล้าน';
      result += convertSection(baht % 1000000);
    } else {
      result = convertSection(baht);
    }
    
    result += 'บาท';
    
    if (satang === 0) {
      result += 'ถ้วน';
    } else {
      result += convertSection(satang) + 'สตางค์';
    }
    
    return result;
  };

  const currentCopyConfig = COPY_COLORS[previewCopy as keyof typeof COPY_COLORS];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={900}
      title="พิมพ์ใบกำกับภาษี / ใบแจ้งหนี้"
      footer={[
        <Button key="cancel" onClick={onClose}>ปิด</Button>,
        <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>
          พิมพ์ ({selectedCopies.length} ใบ)
        </Button>,
      ]}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>
      ) : (
        <>
          {/* Copy Selection */}
          <div style={{ marginBottom: 16, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
            <div style={{ marginBottom: 8, fontWeight: 'bold' }}>เลือกสำเนาที่ต้องการพิมพ์:</div>
            <Checkbox.Group 
              value={selectedCopies} 
              onChange={(values) => setSelectedCopies(values as string[])}
            >
              <Space direction="horizontal" wrap>
                {Object.entries(COPY_COLORS).map(([key, config]) => (
                  <Checkbox key={key} value={key}>
                    <span style={{ 
                      display: 'inline-block', 
                      width: 16, 
                      height: 16, 
                      backgroundColor: config.color, 
                      border: '1px solid #ccc',
                      marginRight: 4,
                      verticalAlign: 'middle'
                    }} />
                    {config.label}
                  </Checkbox>
                ))}
              </Space>
            </Checkbox.Group>
            
            <div style={{ marginTop: 12 }}>
              <span style={{ marginRight: 8 }}>ดูตัวอย่าง:</span>
              <Radio.Group value={previewCopy} onChange={(e) => setPreviewCopy(e.target.value)} size="small">
                {Object.entries(COPY_COLORS).map(([key, config]) => (
                  <Radio.Button key={key} value={key}>{config.name}</Radio.Button>
                ))}
              </Radio.Group>
            </div>
          </div>

          {/* Preview */}
          <div 
            id="inv-print-content"
            style={{ 
              backgroundColor: currentCopyConfig.color, 
              padding: 20, 
              border: '1px solid #ddd',
              position: 'relative',
              minHeight: 600
            }}
          >
            {/* Copy Label */}
            <div style={{ 
              position: 'absolute', 
              top: 10, 
              right: 20, 
              fontSize: 11, 
              fontWeight: 'bold', 
              padding: '4px 12px', 
              border: '2px solid #000',
              backgroundColor: currentCopyConfig.color
            }}>
              {currentCopyConfig.labelEN}<br/>{currentCopyConfig.label}
            </div>

            {/* Company Header */}
            <div style={{ textAlign: 'center', marginBottom: 15 }}>
              <div style={{ fontSize: 20, fontWeight: 'bold' }}>
                {companySettings.COMPANY_NAME_TH || 'บริษัท แสงวิทย์ ไซเอนซ์ จำกัด'}
              </div>
              <div style={{ fontSize: 14 }}>
                {companySettings.COMPANY_NAME_EN || 'SAENGVITH SCIENCE CO., LTD.'}
              </div>
              <div style={{ fontSize: 12, marginTop: 5 }}>
                {companySettings.COMPANY_ADDRESS_TH || '123/4-5 ซอยสมเด็จพระปิ่นเกล้า 9 ถนนสมเด็จพระปิ่นเกล้า แขวงอรุณอมรินทร์ เขตบางกอกน้อย กรุงเทพฯ 10700'}
              </div>
              <div style={{ fontSize: 12 }}>
                โทร: {companySettings.COMPANY_PHONE || '02-XXX-XXXX'} | 
                เลขประจำตัวผู้เสียภาษี: {companySettings.COMPANY_TAX_ID || '0-1055-XXXXX-XX-X'}
              </div>
            </div>

            {/* Title */}
            <div style={{ fontSize: 22, fontWeight: 'bold', textAlign: 'center', margin: '10px 0' }}>
              ใบกำกับภาษี / TAX INVOICE
            </div>

            {/* Customer & Invoice Info */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
              <table style={{ width: '60%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ border: '1px solid #000', padding: '6px 8px', width: 80, background: '#f5f5f5' }}>ลูกค้า</td>
                    <td style={{ border: '1px solid #000', padding: '6px 8px' }}>{invoice?.customer?.name || invoice?.customerName || '-'}</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #000', padding: '6px 8px', background: '#f5f5f5' }}>ที่อยู่</td>
                    <td style={{ border: '1px solid #000', padding: '6px 8px' }}>{invoice?.customer?.address || invoice?.customerAddress || '-'}</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #000', padding: '6px 8px', background: '#f5f5f5' }}>เลขผู้เสียภาษี</td>
                    <td style={{ border: '1px solid #000', padding: '6px 8px' }}>{invoice?.customer?.taxId || invoice?.customerTaxId || '-'}</td>
                  </tr>
                </tbody>
              </table>
              <table style={{ width: '40%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ border: '1px solid #000', padding: '6px 8px', width: 80, background: '#f5f5f5' }}>เลขที่</td>
                    <td style={{ border: '1px solid #000', padding: '6px 8px', fontWeight: 'bold' }}>{invoice?.docFullNo || '-'}</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #000', padding: '6px 8px', background: '#f5f5f5' }}>วันที่</td>
                    <td style={{ border: '1px solid #000', padding: '6px 8px' }}>{formatDate(invoice?.docDate)}</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #000', padding: '6px 8px', background: '#f5f5f5' }}>อ้างอิง</td>
                    <td style={{ border: '1px solid #000', padding: '6px 8px' }}>{invoice?.quotationNo || invoice?.referenceNo || '-'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Items Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #000', padding: '6px 8px', background: '#f5f5f5', width: 40 }}>ลำดับ</th>
                  <th style={{ border: '1px solid #000', padding: '6px 8px', background: '#f5f5f5', width: 100 }}>รหัสสินค้า</th>
                  <th style={{ border: '1px solid #000', padding: '6px 8px', background: '#f5f5f5' }}>รายการ</th>
                  <th style={{ border: '1px solid #000', padding: '6px 8px', background: '#f5f5f5', width: 60 }}>จำนวน</th>
                  <th style={{ border: '1px solid #000', padding: '6px 8px', background: '#f5f5f5', width: 50 }}>หน่วย</th>
                  <th style={{ border: '1px solid #000', padding: '6px 8px', background: '#f5f5f5', width: 90 }}>ราคา/หน่วย</th>
                  <th style={{ border: '1px solid #000', padding: '6px 8px', background: '#f5f5f5', width: 100 }}>จำนวนเงิน</th>
                </tr>
              </thead>
              <tbody>
                {(invoice?.items || []).slice(0, 8).map((item: any, idx: number) => (
                  <tr key={idx}>
                    <td style={{ border: '1px solid #000', padding: '6px 8px', textAlign: 'center' }}>{idx + 1}</td>
                    <td style={{ border: '1px solid #000', padding: '6px 8px' }}>{item.productCode || item.product?.code || '-'}</td>
                    <td style={{ border: '1px solid #000', padding: '6px 8px' }}>{item.productName || item.product?.name || item.description || '-'}</td>
                    <td style={{ border: '1px solid #000', padding: '6px 8px', textAlign: 'center' }}>{formatNumber(item.quantity, 0)}</td>
                    <td style={{ border: '1px solid #000', padding: '6px 8px', textAlign: 'center' }}>{item.unitName || item.unit?.name || '-'}</td>
                    <td style={{ border: '1px solid #000', padding: '6px 8px', textAlign: 'right' }}>{formatNumber(item.unitPrice)}</td>
                    <td style={{ border: '1px solid #000', padding: '6px 8px', textAlign: 'right' }}>{formatNumber(item.amount || (item.quantity * item.unitPrice))}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Summary */}
            <div style={{ display: 'flex', marginTop: 15 }}>
              <div style={{ flex: 1, border: '1px solid #000', padding: 10 }}>
                <div style={{ fontWeight: 'bold' }}>หมายเหตุ:</div>
                <div>{invoice?.remarks || invoice?.notes || '-'}</div>
                <div style={{ marginTop: 10, fontSize: 13 }}>
                  <strong>จำนวนเงิน (ตัวอักษร):</strong> {numberToThaiText(invoice?.totalAmount || invoice?.grandTotal || 0)}
                </div>
              </div>
              <div style={{ width: 250, border: '1px solid #000', borderLeft: 'none' }}>
                <div style={{ display: 'flex', borderBottom: '1px solid #000', padding: '6px 8px' }}>
                  <span style={{ flex: 1, textAlign: 'right' }}>รวมเงิน</span>
                  <span style={{ width: 100, textAlign: 'right' }}>{formatNumber(invoice?.subtotal || invoice?.subTotal || 0)}</span>
                </div>
                <div style={{ display: 'flex', borderBottom: '1px solid #000', padding: '6px 8px' }}>
                  <span style={{ flex: 1, textAlign: 'right' }}>ส่วนลด</span>
                  <span style={{ width: 100, textAlign: 'right' }}>{formatNumber(invoice?.discountAmount || invoice?.discount || 0)}</span>
                </div>
                <div style={{ display: 'flex', borderBottom: '1px solid #000', padding: '6px 8px' }}>
                  <span style={{ flex: 1, textAlign: 'right' }}>ภาษีมูลค่าเพิ่ม {invoice?.vatRate || 7}%</span>
                  <span style={{ width: 100, textAlign: 'right' }}>{formatNumber(invoice?.vatAmount || invoice?.vat || 0)}</span>
                </div>
                <div style={{ display: 'flex', padding: '6px 8px', fontWeight: 'bold', fontSize: 16 }}>
                  <span style={{ flex: 1, textAlign: 'right' }}>ยอดรวมทั้งสิ้น</span>
                  <span style={{ width: 100, textAlign: 'right' }}>{formatNumber(invoice?.totalAmount || invoice?.grandTotal || 0)}</span>
                </div>
              </div>
            </div>

            {/* Signatures */}
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 40, textAlign: 'center' }}>
              <div>
                <div style={{ borderTop: '1px solid #000', width: 150, margin: '60px auto 5px', paddingTop: 5 }}>ผู้รับสินค้า</div>
                <div>วันที่ ____/____/____</div>
              </div>
              <div>
                <div style={{ borderTop: '1px solid #000', width: 150, margin: '60px auto 5px', paddingTop: 5 }}>ผู้ตรวจสอบ</div>
                <div>วันที่ ____/____/____</div>
              </div>
              <div>
                <div style={{ borderTop: '1px solid #000', width: 150, margin: '60px auto 5px', paddingTop: 5 }}>ผู้มีอำนาจลงนาม</div>
                <div>วันที่ ____/____/____</div>
              </div>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};

export default TaxInvoicePrintPreview;
