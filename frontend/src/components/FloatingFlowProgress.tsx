import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileTextOutlined, 
  ShoppingCartOutlined, 
  InboxOutlined, 
  FileDoneOutlined, 
  DollarOutlined,
  CloseOutlined,
  CheckCircleFilled
} from '@ant-design/icons';
import { useActiveQuotation } from '../contexts/ActiveQuotationContext';

const FloatingFlowProgress: React.FC = () => {
  const navigate = useNavigate();
  const { activeQuotation, clearActiveQuotation } = useActiveQuotation();

  if (!activeQuotation) return null;

  const { relatedDocs } = activeQuotation;

  const steps = [
    {
      key: 'QT',
      icon: <FileTextOutlined />,
      label: 'ใบเสนอราคา',
      docNo: activeQuotation.docFullNo,
      status: activeQuotation.status,
      completed: ['CONFIRMED', 'PARTIALLY_CLOSED', 'CLOSED'].includes(activeQuotation.status),
      onClick: () => navigate(`/quotations/${activeQuotation.id}`),
    },
    {
      key: 'PO',
      icon: <ShoppingCartOutlined />,
      label: 'ใบสั่งซื้อ',
      docNo: relatedDocs.po?.docNo,
      status: relatedDocs.po?.status,
      completed: relatedDocs.po?.status === 'APPROVED',
      onClick: () => relatedDocs.po ? navigate(`/purchase-orders`) : navigate(`/quotations/${activeQuotation.id}`),
    },
    {
      key: 'GR',
      icon: <InboxOutlined />,
      label: 'รับสินค้า',
      docNo: relatedDocs.gr?.docNo,
      status: relatedDocs.gr?.status,
      completed: relatedDocs.gr?.status === 'POSTED',
      onClick: () => relatedDocs.gr ? navigate(`/goods-receipts`) : navigate(`/quotations/${activeQuotation.id}`),
    },
    {
      key: 'INV',
      icon: <FileDoneOutlined />,
      label: 'ใบแจ้งหนี้',
      docNo: relatedDocs.inv?.docNo,
      status: relatedDocs.inv?.status,
      completed: ['POSTED', 'PAID'].includes(relatedDocs.inv?.status || ''),
      onClick: () => relatedDocs.inv ? navigate(`/sales-invoices`) : navigate(`/quotations/${activeQuotation.id}`),
    },
    {
      key: 'PAID',
      icon: <DollarOutlined />,
      label: 'ชำระเงิน',
      docNo: relatedDocs.inv?.status === 'PAID' ? 'ชำระแล้ว' : undefined,
      status: relatedDocs.inv?.status === 'PAID' ? 'PAID' : undefined,
      completed: relatedDocs.inv?.status === 'PAID',
      onClick: () => navigate(`/quotations/${activeQuotation.id}`),
    },
  ];

  const completedCount = steps.filter(s => s.completed).length;
  const progress = (completedCount / steps.length) * 100;

  // ถ้าจบ flow แล้ว (100%) ให้ซ่อน
  if (progress === 100) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      borderTop: '2px solid #10b981',
      padding: '12px 20px',
      zIndex: 1000,
      boxShadow: '0 -4px 20px rgba(0,0,0,0.3)',
    }}>
      {/* Progress bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: '2px',
        width: `${progress}%`,
        background: '#10b981',
        transition: 'width 0.5s ease',
      }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Doc info */}
        <div style={{ color: '#fff', fontSize: 12, minWidth: 150 }}>
          <div style={{ fontWeight: 'bold', color: '#10b981' }}>{activeQuotation.docFullNo}</div>
          <div style={{ opacity: 0.7, fontSize: 11 }}>{activeQuotation.customerName?.substring(0, 20)}...</div>
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'center' }}>
          {steps.map((step, index) => (
            <React.Fragment key={step.key}>
              <div
                onClick={step.onClick}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  opacity: step.completed ? 1 : 0.5,
                  transition: 'all 0.2s',
                }}
              >
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: step.completed ? '#10b981' : '#374151',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: 16,
                  position: 'relative',
                }}>
                  {step.icon}
                  {step.completed && (
                    <CheckCircleFilled style={{
                      position: 'absolute',
                      bottom: -2,
                      right: -2,
                      fontSize: 14,
                      color: '#10b981',
                      background: '#1a1a2e',
                      borderRadius: '50%',
                    }} />
                  )}
                </div>
                <div style={{ color: '#fff', fontSize: 10, marginTop: 4 }}>{step.label}</div>
                {step.docNo && (
                  <div style={{ color: '#10b981', fontSize: 9 }}>{step.docNo}</div>
                )}
              </div>
              {index < steps.length - 1 && (
                <div style={{
                  width: 30,
                  height: 2,
                  background: steps[index + 1].completed ? '#10b981' : '#374151',
                }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Progress & Close */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 100 }}>
          <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: 14 }}>
            {Math.round(progress)}%
          </div>
          <CloseOutlined
            onClick={clearActiveQuotation}
            style={{ color: '#fff', opacity: 0.5, cursor: 'pointer', fontSize: 16 }}
          />
        </div>
      </div>
    </div>
  );
};

export default FloatingFlowProgress;
