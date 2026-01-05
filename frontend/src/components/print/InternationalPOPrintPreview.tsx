import React, { useEffect, useState } from 'react';
import { Modal, Button, Spin } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { systemSettingsApi } from '../../services/api';

interface InternationalPOPrintPreviewProps {
  open: boolean;
  onClose: () => void;
  purchaseOrder: any;
}

const InternationalPOPrintPreview: React.FC<InternationalPOPrintPreviewProps> = ({
  open,
  onClose,
  purchaseOrder,
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
    const printContent = document.getElementById('intl-po-print-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Purchase Order ${purchaseOrder?.docFullNo || ''}</title>
              <style>
                @page { size: A4; margin: 10mm; }
                body { font-family: 'Sarabun', 'TH Sarabun New', Arial, sans-serif; font-size: 14px; margin: 0; padding: 10px; color: #000; }
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #000; padding: 4px 8px; color: #000; }
                th { background: #f0f0f0; }
                .no-border { border: none !important; }
                .header-table td { border: none; }
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

  const formatDateEN = (dateStr?: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const formatNumber = (num: number) => {
    return Number(num || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const items = purchaseOrder?.items || [];
  const currency = purchaseOrder?.currency || 'USD';

  // Company info from settings
  const companyNameTH = companySettings.COMPANY_NAME_TH || 'บริษัท แสงวิทย์ ซายน์ จำกัด';
  const companyNameEN = companySettings.COMPANY_NAME_EN || 'Saengvith Science Co., Ltd.';
  const companyAddress = companySettings.COMPANY_ADDRESS_EN || '123/4-5 Soi Somdetphrapinklao 9, Somdetphrapinklao Road, Arun Amarin, Bangkoknoi, Bangkok 10700, Thailand';
  const companyPhone = companySettings.COMPANY_PHONE_EN || '66 0 2886 9200 to 7';
  const companyFax = companySettings.COMPANY_FAX_EN || '66 0 2433 9168';
  const companyEmail = companySettings.COMPANY_EMAIL || 'saengvith.sc@anet.net.th';
  const companyWebsite = companySettings.COMPANY_WEBSITE || 'http://www.saengvithscience.co.th';
  const companyLogo = companySettings.COMPANY_LOGO_URL;
  const shipToAddress = companySettings.COMPANY_SHIP_TO_ADDRESS || '123/4-5 Soi Somdetphrapinklao 9, Somdetphrapinklao Road, Arun Amarin, Bangkoknoi, Bangkok 10700 Thailand';
  const approverName = companySettings.COMPANY_APPROVER_NAME || 'Mr. Vitaya Saetang';
  const approverTitle = companySettings.COMPANY_APPROVER_TITLE || 'Managing Director';

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={900}
      title="Print International Purchase Order"
      footer={[
        <Button key="close" onClick={onClose}>Close</Button>,
        <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>Print</Button>,
      ]}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>
      ) : (
        <div id="intl-po-print-content" style={{ padding: 20, background: '#fff', color: '#000', fontFamily: 'Sarabun, Arial, sans-serif' }}>
          {/* Header */}
          <table className="header-table" style={{ width: '100%', marginBottom: 10, borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ width: '15%', verticalAlign: 'middle', border: 'none', padding: 5 }}>
                  {companyLogo && (
                    <img src={companyLogo} alt="Company Logo" style={{ maxHeight: 70, maxWidth: 100 }} />
                  )}
                </td>
                <td style={{ width: '55%', verticalAlign: 'top', border: 'none', padding: 5 }}>
                  <div style={{ fontWeight: 'bold', fontSize: 16, color: '#000' }}>{companyNameTH}</div>
                  <div style={{ fontWeight: 'bold', fontSize: 14, color: '#000' }}>{companyNameEN}</div>
                  <div style={{ height: 5 }}></div>
                  <div style={{ fontSize: 11, color: '#000' }}>{companyAddress}</div>
                  <div style={{ fontSize: 11, color: '#000' }}>Tel : {companyPhone} Fax : {companyFax}</div>
                  <div style={{ fontSize: 11, color: '#000' }}>E-mail : {companyEmail} {companyWebsite}</div>
                </td>
                <td style={{ width: '30%', verticalAlign: 'top', border: 'none', textAlign: 'right', padding: 5 }}>
                  <div style={{ fontWeight: 'bold', fontSize: 22, color: '#000' }}>Purchase Order</div>
                </td>
              </tr>
            </tbody>
          </table>

          <hr style={{ border: 'none', borderTop: '2px solid #000', margin: '10px 0' }} />

          {/* Vendor & PO Info */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 10 }}>
            <tbody>
              <tr>
                <td style={{ width: '15%', border: '1px solid #000', padding: 6, fontWeight: 'bold', color: '#000' }}>Vendor :</td>
                <td style={{ width: '45%', border: '1px solid #000', padding: 6, color: '#000' }}>{purchaseOrder?.supplierName || '-'}</td>
                <td style={{ width: '20%', border: '1px solid #000', padding: 6, fontWeight: 'bold', color: '#000' }}>PO. Number:</td>
                <td style={{ width: '20%', border: '1px solid #000', padding: 6, color: '#000' }}>{purchaseOrder?.docFullNo || '-'}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #000', padding: 6, fontWeight: 'bold', color: '#000' }}>Address :</td>
                <td style={{ border: '1px solid #000', padding: 6, color: '#000' }}>{purchaseOrder?.supplierAddress || '-'}</td>
                <td style={{ border: '1px solid #000', padding: 6, fontWeight: 'bold', color: '#000' }}>Date :</td>
                <td style={{ border: '1px solid #000', padding: 6, color: '#000' }}>{formatDateEN(purchaseOrder?.docDate)}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #000', padding: 6, fontWeight: 'bold', color: '#000' }}>Attention :</td>
                <td style={{ border: '1px solid #000', padding: 6, color: '#000' }}>
                  {purchaseOrder?.vendorAttention || purchaseOrder?.contactPerson || '-'}
                  {purchaseOrder?.supplierEmail && <span style={{ marginLeft: 20 }}>{purchaseOrder.supplierEmail}</span>}
                </td>
                <td style={{ border: '1px solid #000', padding: 6, fontWeight: 'bold', color: '#000' }}>Delivery time :</td>
                <td style={{ border: '1px solid #000', padding: 6, color: '#000' }}>{purchaseOrder?.deliveryTime || 'As soon as possible'}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #000', padding: 6, fontWeight: 'bold', color: '#000' }}>Phone :</td>
                <td style={{ border: '1px solid #000', padding: 6, color: '#000' }}>{purchaseOrder?.supplierPhone || '-'}</td>
                <td style={{ border: '1px solid #000', padding: 6, fontWeight: 'bold', color: '#000' }}>Payment method :</td>
                <td style={{ border: '1px solid #000', padding: 6, color: '#000' }}>{purchaseOrder?.paymentMethod || 'T/T'}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #000', padding: 6, fontWeight: 'bold', color: '#000' }}>Facsimile :</td>
                <td style={{ border: '1px solid #000', padding: 6, color: '#000' }}>{purchaseOrder?.vendorFax || '-'}</td>
                <td style={{ border: '1px solid #000', padding: 6, fontWeight: 'bold', color: '#000' }}>Shipping Instruction :</td>
                <td style={{ border: '1px solid #000', padding: 6, color: '#000' }}>{purchaseOrder?.shippingInstruction || 'Air freight'}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #000', padding: 6, fontWeight: 'bold', color: '#000' }}>End User:</td>
                <td colSpan={3} style={{ border: '1px solid #000', padding: 6, color: '#000' }}>{purchaseOrder?.endUser || '-'}</td>
              </tr>
            </tbody>
          </table>

          {/* Items Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 10 }}>
            <thead>
              <tr style={{ background: '#f0f0f0' }}>
                <th style={{ border: '1px solid #000', padding: 6, width: 40, color: '#000' }}>Item</th>
                <th style={{ border: '1px solid #000', padding: 6, width: 50, color: '#000' }}>Qty</th>
                <th style={{ border: '1px solid #000', padding: 6, width: 50, color: '#000' }}>Unit</th>
                <th style={{ border: '1px solid #000', padding: 6, width: 100, color: '#000' }}>Part. No.</th>
                <th style={{ border: '1px solid #000', padding: 6, color: '#000' }}>Description</th>
                <th style={{ border: '1px solid #000', padding: 6, width: 90, color: '#000' }}>Unit Price<br/>({currency})</th>
                <th style={{ border: '1px solid #000', padding: 6, width: 90, color: '#000' }}>Amount<br/>({currency})</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: any, idx: number) => (
                <tr key={idx}>
                  <td style={{ border: '1px solid #000', padding: 6, textAlign: 'center', color: '#000' }}>{idx + 1}</td>
                  <td style={{ border: '1px solid #000', padding: 6, textAlign: 'center', color: '#000' }}>{Number(item.qty || 0)}</td>
                  <td style={{ border: '1px solid #000', padding: 6, textAlign: 'center', color: '#000' }}>{item.unit || 'EA'}</td>
                  <td style={{ border: '1px solid #000', padding: 6, color: '#000' }}>{item.itemCode || '-'}</td>
                  <td style={{ border: '1px solid #000', padding: 6, color: '#000' }}>
                    <div>{item.itemName}</div>
                    {item.itemDescription && <div style={{ fontSize: 11, color: '#333' }}>({item.itemDescription})</div>}
                  </td>
                  <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', color: '#000' }}>{formatNumber(item.unitPrice)}</td>
                  <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', color: '#000' }}>{formatNumber(item.lineTotal)}</td>
                </tr>
              ))}
              {/* Empty rows to fill space */}
              {items.length < 8 && [...Array(Math.max(0, 8 - items.length))].map((_, idx) => (
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
              {/* Total Row */}
              <tr>
                <td colSpan={5} style={{ border: '1px solid #000', padding: 6 }}>&nbsp;</td>
                <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', fontWeight: 'bold', color: '#000' }}>Total Price</td>
                <td style={{ border: '1px solid #000', padding: 6, textAlign: 'right', fontWeight: 'bold', color: '#000' }}>{formatNumber(purchaseOrder?.grandTotal || purchaseOrder?.subtotal || 0)}</td>
              </tr>
            </tbody>
          </table>

          {/* Ship To Notice */}
          <div style={{ border: '1px solid #000', padding: 10, marginBottom: 15, textAlign: 'center' }}>
            <div style={{ fontWeight: 'bold', color: '#000' }}>
              Please bill and ship the product to " <span style={{ textTransform: 'uppercase' }}>{companyNameEN.toUpperCase()}</span> "
            </div>
            <div style={{ color: '#000', marginTop: 5 }}>{shipToAddress}</div>
          </div>

          {/* Approval Section */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 15 }}>
            <tbody>
              <tr>
                <td style={{ width: '60%', border: 'none', verticalAlign: 'top' }}>&nbsp;</td>
                <td style={{ width: '40%', border: 'none', textAlign: 'center', paddingTop: 20 }}>
                  <div style={{ color: '#000' }}>Approved By : ......................................</div>
                  <div style={{ marginTop: 30, color: '#000' }}>( {approverName} )</div>
                  <div style={{ fontStyle: 'italic', color: '#000' }}>{approverTitle}</div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Footer Note */}
          <div style={{ borderTop: '1px solid #000', paddingTop: 10, fontSize: 11, color: '#000' }}>
            <strong>NOTE :</strong> If you have received this Purchase Order incompletely, please notify us immediately for the quick process. Thank you.
          </div>
        </div>
      )}
    </Modal>
  );
};

export default InternationalPOPrintPreview;
