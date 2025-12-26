import React, { useEffect, useState } from 'react';
import { Modal, Button, Spin } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { systemSettingsApi } from '../../services/api';

interface WithholdingTaxPrintPreviewProps {
  open: boolean;
  onClose: () => void;
  data: any;
}

// ประเภทเงินได้ตามแบบ ภ.ง.ด.
const INCOME_TYPES: Record<string, string> = {
  '1': '1. เงินเดือน ค่าจ้าง เบี้ยเลี้ยง โบนัส ฯลฯ ตามมาตรา 40(1)',
  '2': '2. ค่าธรรมเนียม ค่านายหน้า ฯลฯ ตามมาตรา 40(2)',
  '3': '3. ค่าแห่งลิขสิทธิ์ ฯลฯ ตามมาตรา 40(3)',
  '4a': '4. (ก) ค่าดอกเบี้ย ฯลฯ ตามมาตรา 40(4)(ก)',
  '4b': '4. (ข) เงินปันผล เงินส่วนแบ่งกำไร ฯลฯ ตามมาตรา 40(4)(ข)',
  '5': '5. ค่าเช่าทรัพย์สิน ฯลฯ ตามมาตรา 40(5)',
  '6': '6. ค่าวิชาชีพอิสระ ตามมาตรา 40(6)',
  '7': '7. ค่าจ้างทำของ ค่าบริการ ฯลฯ ตามมาตรา 40(7)(8)',
  '8': '8. รางวัล ส่วนลด หรือประโยชน์อื่นใดเนื่องจากการส่งเสริมการขาย',
};

const WithholdingTaxPrintPreview: React.FC<WithholdingTaxPrintPreviewProps> = ({
  open,
  onClose,
  data,
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
    const printContent = document.getElementById('wht-print-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>หนังสือรับรองการหักภาษี ณ ที่จ่าย ${data?.docNo || ''}</title>
              <style>
                @page { size: A4; margin: 10mm; }
                @media print {
                  body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                }
                body { font-family: 'Sarabun', 'TH Sarabun New', sans-serif; font-size: 14px; margin: 0; padding: 20px; color: #000; }
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #000; padding: 6px 8px; color: #000; }
                .no-border { border: none !important; }
                .form-title { font-size: 18px; font-weight: bold; text-align: center; margin: 10px 0; }
                .form-subtitle { font-size: 14px; text-align: center; margin-bottom: 15px; }
                .checkbox { display: inline-block; width: 14px; height: 14px; border: 1px solid #000; margin-right: 5px; text-align: center; line-height: 14px; }
                .checkbox.checked::before { content: "✓"; }
                .section-box { border: 2px solid #000; padding: 10px; margin: 10px 0; }
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
    if (!dateStr) return { day: '', month: '', year: '' };
    const date = new Date(dateStr);
    const thaiMonths = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 
                        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
    const thaiYear = date.getFullYear() + 543;
    return {
      day: date.getDate().toString(),
      month: thaiMonths[date.getMonth()],
      year: thaiYear.toString()
    };
  };

  const formatNumber = (num: number) => {
    return Number(num || 0).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const paymentDate = formatDate(data?.paymentDate);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={850}
      title="พิมพ์หนังสือรับรองการหักภาษี ณ ที่จ่าย"
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
        <div id="wht-print-content" style={{ padding: 20, background: '#fff', border: '1px solid #ddd' }}>
          {/* Form Header */}
          <div style={{ textAlign: 'right', marginBottom: 10 }}>
            <span style={{ border: '1px solid #000', padding: '2px 10px', fontWeight: 'bold' }}>
              {data?.formType || 'ภ.ง.ด.3'}
            </span>
          </div>

          <div className="form-title">หนังสือรับรองการหักภาษี ณ ที่จ่าย</div>
          <div className="form-subtitle">ตามมาตรา 50 ทวิ แห่งประมวลรัษฎากร</div>

          {/* ผู้มีหน้าที่หักภาษี ณ ที่จ่าย (ผู้จ่ายเงิน) */}
          <div className="section-box">
            <div style={{ fontWeight: 'bold', marginBottom: 10 }}>ผู้มีหน้าที่หักภาษี ณ ที่จ่าย (ผู้จ่ายเงิน)</div>
            <table style={{ border: 'none' }}>
              <tbody>
                <tr>
                  <td className="no-border" style={{ width: 120 }}>ชื่อ</td>
                  <td className="no-border" style={{ borderBottom: '1px dotted #000' }}>
                    {data?.payerName || companySettings.COMPANY_NAME_TH || 'บริษัท แสงวิทย์ ไซเอนซ์ จำกัด'}
                  </td>
                </tr>
                <tr>
                  <td className="no-border">ที่อยู่</td>
                  <td className="no-border" style={{ borderBottom: '1px dotted #000' }}>
                    {data?.payerAddress || companySettings.COMPANY_ADDRESS_TH || '-'}
                  </td>
                </tr>
                <tr>
                  <td className="no-border">เลขประจำตัวผู้เสียภาษีอากร</td>
                  <td className="no-border" style={{ borderBottom: '1px dotted #000' }}>
                    {data?.payerTaxId || companySettings.COMPANY_TAX_ID || '-'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ผู้ถูกหักภาษี ณ ที่จ่าย (ผู้รับเงิน) */}
          <div className="section-box">
            <div style={{ fontWeight: 'bold', marginBottom: 10 }}>ผู้ถูกหักภาษี ณ ที่จ่าย (ผู้รับเงิน)</div>
            <table style={{ border: 'none' }}>
              <tbody>
                <tr>
                  <td className="no-border" style={{ width: 120 }}>ชื่อ</td>
                  <td className="no-border" style={{ borderBottom: '1px dotted #000' }}>
                    {data?.payeeName || '-'}
                  </td>
                </tr>
                <tr>
                  <td className="no-border">ที่อยู่</td>
                  <td className="no-border" style={{ borderBottom: '1px dotted #000' }}>
                    {data?.payeeAddress || '-'}
                  </td>
                </tr>
                <tr>
                  <td className="no-border">เลขประจำตัวผู้เสียภาษีอากร</td>
                  <td className="no-border" style={{ borderBottom: '1px dotted #000' }}>
                    {data?.payeeTaxId || '-'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* รายละเอียดการหักภาษี */}
          <div className="section-box">
            <div style={{ fontWeight: 'bold', marginBottom: 10 }}>รายละเอียดการหักภาษี ณ ที่จ่าย</div>
            <table>
              <thead>
                <tr>
                  <th style={{ width: '50%' }}>ประเภทเงินได้พึงประเมินที่จ่าย</th>
                  <th style={{ width: 120 }}>วัน เดือน ปี ที่จ่าย</th>
                  <th style={{ width: 120 }}>จำนวนเงินที่จ่าย</th>
                  <th style={{ width: 120 }}>ภาษีที่หักและนำส่งไว้</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {INCOME_TYPES[data?.incomeType] || data?.incomeDescription || '-'}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {paymentDate.day} {paymentDate.month} {paymentDate.year}
                  </td>
                  <td style={{ textAlign: 'right' }}>{formatNumber(data?.incomeAmount || 0)}</td>
                  <td style={{ textAlign: 'right' }}>{formatNumber(data?.taxAmount || 0)}</td>
                </tr>
                <tr>
                  <td colSpan={2} style={{ textAlign: 'right', fontWeight: 'bold' }}>รวมเงินที่จ่ายและภาษีที่หักนำส่ง</td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{formatNumber(data?.incomeAmount || 0)}</td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{formatNumber(data?.taxAmount || 0)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* เงื่อนไขการหัก */}
          <div style={{ margin: '15px 0' }}>
            <div style={{ marginBottom: 5 }}>เงินภาษีนี้ได้หักไว้</div>
            <div style={{ marginLeft: 20 }}>
              <div>
                <span className={`checkbox ${data?.taxType === 'DEDUCTED' ? 'checked' : ''}`}></span>
                (1) หัก ณ ที่จ่าย
              </div>
              <div>
                <span className={`checkbox ${data?.taxType === 'PAID' ? 'checked' : ''}`}></span>
                (2) ออกให้ตลอดไป
              </div>
              <div>
                <span className={`checkbox ${data?.taxType === 'PAID_ONCE' ? 'checked' : ''}`}></span>
                (3) ออกให้ครั้งเดียว
              </div>
            </div>
          </div>

          {/* ลายเซ็น */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40 }}>
            <div style={{ textAlign: 'center', width: '45%' }}>
              <div style={{ borderTop: '1px solid #000', width: 200, margin: '80px auto 5px', paddingTop: 5 }}>
                ผู้จ่ายเงิน
              </div>
              <div>วันที่ {paymentDate.day} เดือน {paymentDate.month} พ.ศ. {paymentDate.year}</div>
            </div>
            <div style={{ textAlign: 'center', width: '45%' }}>
              <div style={{ borderTop: '1px solid #000', width: 200, margin: '80px auto 5px', paddingTop: 5 }}>
                ผู้มีอำนาจลงนาม
              </div>
              <div style={{ fontSize: 12 }}>(ประทับตราบริษัท)</div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ marginTop: 30, fontSize: 12, textAlign: 'center', color: '#666' }}>
            เลขที่: {data?.docNo || '-'} | 
            วันที่ออก: {formatDate(data?.docDate).day} {formatDate(data?.docDate).month} {formatDate(data?.docDate).year}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default WithholdingTaxPrintPreview;
