import React, { useEffect, useState } from 'react';
import { Modal, Button, Spin, Radio, Space, Checkbox, Divider } from 'antd';
import { PrinterOutlined, SettingOutlined } from '@ant-design/icons';
import { systemSettingsApi } from '../../services/api';

// CSS สำหรับแก้สีตัวหนังสือใน Modal (Dark Mode fix)
const modalDarkStyles = `
  .tax-invoice-print-modal .ant-modal-content,
  .tax-invoice-print-modal .ant-modal-header,
  .tax-invoice-print-modal .ant-modal-title,
  .tax-invoice-print-modal .ant-modal-body,
  .tax-invoice-print-modal .ant-checkbox-wrapper,
  .tax-invoice-print-modal .ant-checkbox + span,
  .tax-invoice-print-modal .ant-radio-wrapper,
  .tax-invoice-print-modal .ant-radio + span,
  .tax-invoice-print-modal .ant-divider-inner-text,
  .tax-invoice-print-modal span,
  .tax-invoice-print-modal div,
  .tax-invoice-print-modal label {
    color: #000 !important;
  }
  .tax-invoice-print-modal .ant-modal-content {
    background: #fff !important;
  }
  .tax-invoice-print-modal .ant-btn-default {
    color: #000 !important;
    border-color: #d9d9d9 !important;
  }
`;

interface TaxInvoicePrintPreviewProps {
  open: boolean;
  onClose: () => void;
  invoice: any;
}

// มาตรฐานสีใบกำกับภาษี (สรรพากร) - ประหยัดหมึก
const COPY_COLORS = {
  ORIGINAL: { name: 'ต้นฉบับ', color: '#1890ff', label: 'ต้นฉบับ', labelEN: 'ORIGINAL', textColor: '#fff' },
  COPY1: { name: 'สำเนา 1', color: '#faad14', label: 'สำเนา (บัญชี)', labelEN: 'COPY - ACCOUNTING', textColor: '#000' },
  COPY2: { name: 'สำเนา 2', color: '#eb2f96', label: 'สำเนา (คลัง)', labelEN: 'COPY - WAREHOUSE', textColor: '#fff' },
  COPY3: { name: 'สำเนา 3', color: '#13c2c2', label: 'สำเนา (เก็บเล่ม)', labelEN: 'COPY - FILE', textColor: '#fff' },
};

type BadgeStyle = 'TOP_BANNER' | 'CORNER_BADGE';

const TaxInvoicePrintPreview: React.FC<TaxInvoicePrintPreviewProps> = ({
  open,
  onClose,
  invoice,
}) => {
  const [companySettings, setCompanySettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [selectedCopies, setSelectedCopies] = useState<string[]>(['ORIGINAL']);
  const [previewCopy, setPreviewCopy] = useState<string>('ORIGINAL');
  const [badgeStyle, setBadgeStyle] = useState<BadgeStyle>('TOP_BANNER');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (open) {
      loadSettings();
      // Load saved preference
      const savedStyle = localStorage.getItem('taxInvoiceBadgeStyle') as BadgeStyle;
      if (savedStyle) setBadgeStyle(savedStyle);
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

  const handleStyleChange = (style: BadgeStyle) => {
    setBadgeStyle(style);
    localStorage.setItem('taxInvoiceBadgeStyle', style);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      let allPages = '';
      
      selectedCopies.forEach((copyType, index) => {
        const copyConfig = COPY_COLORS[copyType as keyof typeof COPY_COLORS];
        const pageBreak = index > 0 ? 'page-break-before: always;' : '';
        allPages += generateInvoiceHTML(copyConfig, pageBreak, copyType === 'ORIGINAL');
      });

      printWindow.document.write(`
        <html>
          <head>
            <title>ใบกำกับภาษี ${invoice?.docFullNo || invoice?.docNo || ''}</title>
            <style>
              @page { size: A4; margin: 10mm; }
              @media print {
                body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
              }
              body { font-family: 'Sarabun', 'TH Sarabun New', sans-serif; font-size: 14px; margin: 0; padding: 0; color: #000; }
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 1px solid #000; padding: 6px 8px; color: #000; }
              th { background: #f5f5f5 !important; }
              .invoice-page { position: relative; padding: 20px; min-height: 100vh; box-sizing: border-box; background: #fff; }
              .top-banner { padding: 8px 20px; text-align: center; font-weight: bold; font-size: 14px; margin-bottom: 15px; }
              .corner-badge { position: absolute; top: 15px; right: 15px; padding: 8px 15px; font-weight: bold; font-size: 12px; border-radius: 4px; text-align: center; line-height: 1.4; }
              .header-title { font-size: 20px; font-weight: bold; text-align: center; margin: 10px 0; border: 2px solid #000; padding: 8px; }
              .company-info { text-align: center; margin-bottom: 15px; }
            </style>
          </head>
          <body>${allPages}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const generateInvoiceHTML = (copyConfig: typeof COPY_COLORS.ORIGINAL, pageBreak: string, isOriginal: boolean) => {
    const items = invoice?.items || invoice?.lines || [];
    
    // Badge HTML based on style
    const badgeHTML = badgeStyle === 'TOP_BANNER' 
      ? `<div class="top-banner" style="background-color: ${copyConfig.color}; color: ${copyConfig.textColor};">
           ${copyConfig.labelEN} - ${copyConfig.label}
         </div>`
      : `<div class="corner-badge" style="background-color: ${copyConfig.color}; color: ${copyConfig.textColor};">
           ${copyConfig.labelEN}<br/>${copyConfig.label}
         </div>`;
    
    return `
      <div class="invoice-page" style="${pageBreak}">
        ${badgeHTML}
        
        <div class="company-info">
          <div style="font-size: 18px; font-weight: bold;">${companySettings.COMPANY_NAME_TH || 'บริษัท แสงวิทย์ ไซเอนซ์ จำกัด'}</div>
          <div style="font-size: 13px;">${companySettings.COMPANY_NAME_EN || 'SAENGVITH SCIENCE CO., LTD.'}</div>
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
                  <td style="border: 1px solid #000; width: 100px; background: #f5f5f5;">ลูกค้า</td>
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
                  <td style="border: 1px solid #000; width: 80px; background: #f5f5f5;">เลขที่</td>
                  <td style="border: 1px solid #000; font-weight: bold;">${invoice?.docFullNo || invoice?.docNo || '-'}</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000; background: #f5f5f5;">วันที่</td>
                  <td style="border: 1px solid #000;">${formatDate(invoice?.docDate)}</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000; background: #f5f5f5;">อ้างอิง</td>
                  <td style="border: 1px solid #000;">${invoice?.quotationNo || invoice?.referenceNo || invoice?.referenceDocNo || '-'}</td>
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
                <td style="text-align: center;">${item.unitName || item.unit?.name || 'ชิ้น'}</td>
                <td style="text-align: right;">${formatNumber(item.unitPrice)}</td>
                <td style="text-align: right;">${formatNumber(item.amount || (item.quantity * item.unitPrice))}</td>
              </tr>
            `).join('')}
            ${Array(Math.max(0, 6 - items.length)).fill(0).map(() => `
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
                <strong>จำนวนเงิน (ตัวอักษร):</strong> ${numberToThaiText(Number(invoice?.totalAmount) || Number(invoice?.grandTotal) || 0)}
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
              <div style="border-top: 1px solid #000; width: 150px; margin: 50px auto 5px; padding-top: 5px;">ผู้รับสินค้า</div>
              <div>วันที่ ____/____/____</div>
            </td>
            <td style="border: none; text-align: center; width: 34%;">
              <div style="border-top: 1px solid #000; width: 150px; margin: 50px auto 5px; padding-top: 5px;">ผู้ตรวจสอบ</div>
              <div>วันที่ ____/____/____</div>
            </td>
            <td style="border: none; text-align: center; width: 33%;">
              <div style="border-top: 1px solid #000; width: 150px; margin: 50px auto 5px; padding-top: 5px;">ผู้มีอำนาจลงนาม</div>
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

  const formatNumber = (num: number | string, decimals: number = 2) => {
    return Number(num || 0).toLocaleString('th-TH', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  };

  const numberToThaiText = (num: number): string => {
    if (num === 0) return 'ศูนย์บาทถ้วน';
    
    const baht = Math.floor(num);
    const satang = Math.round((num - baht) * 100);
    
    const convertSection = (n: number): string => {
      if (n === 0) return '';
      const units = ['', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
      const positions = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];
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
    <>
      <style>{modalDarkStyles}</style>
      <Modal
        open={open}
        onCancel={onClose}
        width={900}
        className="tax-invoice-print-modal"
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: 30 }}>
            <span>พิมพ์ใบกำกับภาษี / ใบแจ้งหนี้</span>
            <Button 
              type="text" 
              icon={<SettingOutlined />} 
              onClick={() => setShowSettings(!showSettings)}
            >
              ตั้งค่า
            </Button>
          </div>
        }
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
          {/* Settings Panel */}
          {showSettings && (
            <div style={{ marginBottom: 16, padding: 16, background: '#fafafa', borderRadius: 8, border: '1px solid #d9d9d9' }}>
              <div style={{ marginBottom: 12, fontWeight: 'bold' }}>
                <SettingOutlined /> รูปแบบการแสดงสำเนา
              </div>
              <Radio.Group value={badgeStyle} onChange={(e) => handleStyleChange(e.target.value)}>
                <Space direction="vertical">
                  <Radio value="TOP_BANNER">
                    <span style={{ fontWeight: 500 }}>แถบด้านบน</span>
                    <span style={{ color: '#888', marginLeft: 8 }}>- แถบสีเต็มความกว้างด้านบน</span>
                  </Radio>
                  <Radio value="CORNER_BADGE">
                    <span style={{ fontWeight: 500 }}>มุมขวาบน</span>
                    <span style={{ color: '#888', marginLeft: 8 }}>- ป้ายสีเล็กที่มุมขวาบน (ประหยัดหมึกกว่า)</span>
                  </Radio>
                </Space>
              </Radio.Group>
              <div style={{ marginTop: 8, fontSize: 12, color: '#888' }}>
                * การตั้งค่านี้จะถูกบันทึกสำหรับการใช้งานครั้งต่อไป
              </div>
            </div>
          )}

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
                      marginRight: 4,
                      verticalAlign: 'middle',
                      borderRadius: 2
                    }} />
                    {config.label}
                  </Checkbox>
                ))}
              </Space>
            </Checkbox.Group>
            
            <Divider style={{ margin: '12px 0' }} />
            
            <div>
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
            style={{ 
              padding: 20, 
              border: '1px solid #ddd',
              position: 'relative',
              background: '#fff',
              minHeight: 500
            }}
          >
            {/* Badge Preview */}
            {badgeStyle === 'TOP_BANNER' ? (
              <div style={{ 
                backgroundColor: currentCopyConfig.color, 
                color: currentCopyConfig.textColor,
                padding: '8px 20px',
                textAlign: 'center',
                fontWeight: 'bold',
                marginBottom: 15
              }}>
                {currentCopyConfig.labelEN} - {currentCopyConfig.label}
              </div>
            ) : (
              <div style={{ 
                position: 'absolute', 
                top: 15, 
                right: 15, 
                backgroundColor: currentCopyConfig.color,
                color: currentCopyConfig.textColor,
                padding: '8px 15px',
                fontWeight: 'bold',
                fontSize: 12,
                borderRadius: 4,
                textAlign: 'center',
                lineHeight: 1.4
              }}>
                {currentCopyConfig.labelEN}<br/>{currentCopyConfig.label}
              </div>
            )}

            {/* Company Header */}
            <div style={{ textAlign: 'center', marginBottom: 15 }}>
              <div style={{ fontSize: 18, fontWeight: 'bold' }}>
                {companySettings.COMPANY_NAME_TH || 'บริษัท แสงวิทย์ ไซเอนซ์ จำกัด'}
              </div>
              <div style={{ fontSize: 13 }}>
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
            <div style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', margin: '10px 0', border: '2px solid #000', padding: 8 }}>
              ใบกำกับภาษี / TAX INVOICE
            </div>

            {/* Customer & Invoice Info */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
              <table style={{ width: '60%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ border: '1px solid #000', padding: '6px 8px', width: 100, background: '#f5f5f5' }}>ลูกค้า</td>
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
                    <td style={{ border: '1px solid #000', padding: '6px 8px', fontWeight: 'bold' }}>{invoice?.docFullNo || invoice?.docNo || '-'}</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #000', padding: '6px 8px', background: '#f5f5f5' }}>วันที่</td>
                    <td style={{ border: '1px solid #000', padding: '6px 8px' }}>{formatDate(invoice?.docDate)}</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #000', padding: '6px 8px', background: '#f5f5f5' }}>อ้างอิง</td>
                    <td style={{ border: '1px solid #000', padding: '6px 8px' }}>{invoice?.quotationNo || invoice?.referenceNo || invoice?.referenceDocNo || '-'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Items Table Preview */}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #000', padding: '6px 8px', background: '#f5f5f5', width: 40 }}>ลำดับ</th>
                  <th style={{ border: '1px solid #000', padding: '6px 8px', background: '#f5f5f5', width: 80 }}>รหัส</th>
                  <th style={{ border: '1px solid #000', padding: '6px 8px', background: '#f5f5f5' }}>รายการ</th>
                  <th style={{ border: '1px solid #000', padding: '6px 8px', background: '#f5f5f5', width: 50 }}>จำนวน</th>
                  <th style={{ border: '1px solid #000', padding: '6px 8px', background: '#f5f5f5', width: 80 }}>ราคา/หน่วย</th>
                  <th style={{ border: '1px solid #000', padding: '6px 8px', background: '#f5f5f5', width: 90 }}>จำนวนเงิน</th>
                </tr>
              </thead>
              <tbody>
                {(invoice?.items || invoice?.lines || []).slice(0, 4).map((item: any, idx: number) => (
                  <tr key={idx}>
                    <td style={{ border: '1px solid #000', padding: '6px 8px', textAlign: 'center' }}>{idx + 1}</td>
                    <td style={{ border: '1px solid #000', padding: '6px 8px' }}>{item.productCode || '-'}</td>
                    <td style={{ border: '1px solid #000', padding: '6px 8px' }}>{item.productName || item.description || '-'}</td>
                    <td style={{ border: '1px solid #000', padding: '6px 8px', textAlign: 'center' }}>{formatNumber(item.quantity, 0)}</td>
                    <td style={{ border: '1px solid #000', padding: '6px 8px', textAlign: 'right' }}>{formatNumber(item.unitPrice)}</td>
                    <td style={{ border: '1px solid #000', padding: '6px 8px', textAlign: 'right' }}>{formatNumber(item.amount || (item.quantity * item.unitPrice))}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Summary */}
            <div style={{ marginTop: 15, textAlign: 'right' }}>
              <div>รวมเงิน: <strong>{formatNumber(invoice?.subtotal || invoice?.subTotal || 0)}</strong></div>
              <div>VAT {invoice?.vatRate || 7}%: <strong>{formatNumber(invoice?.vatAmount || invoice?.vat || 0)}</strong></div>
              <div style={{ fontSize: 18, marginTop: 5 }}>ยอดรวมทั้งสิ้น: <strong>{formatNumber(invoice?.totalAmount || invoice?.grandTotal || 0)} บาท</strong></div>
            </div>
          </div>
        </>
      )}
    </Modal>
    </>
  );
};

export default TaxInvoicePrintPreview;
