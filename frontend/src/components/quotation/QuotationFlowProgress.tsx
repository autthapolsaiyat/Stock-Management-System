import React from 'react';
import { Card, Progress, Tag, Tooltip, Button } from 'antd';
import { 
  FileTextOutlined, 
  ShoppingCartOutlined, 
  InboxOutlined, 
  FileProtectOutlined,
  DollarOutlined,
  CheckCircleFilled,
  ClockCircleFilled,
  MinusCircleOutlined,
  PlusOutlined
} from '@ant-design/icons';

interface FlowStep {
  key: string;
  icon: React.ReactNode;
  title: string;
  status: 'completed' | 'current' | 'pending';
  docNo?: string;
  docStatus?: string;
  date?: string;
  onClick?: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

interface QuotationFlowProgressProps {
  quotation: {
    docFullNo: string;
    status: string;
    customerName: string;
    grandTotal: number;
    docDate: string;
  };
  relatedDocs: {
    po?: { id: number; docNo: string; status: string; date?: string };
    gr?: { id: number; docNo: string; status: string; date?: string };
    inv?: { id: number; docNo: string; status: string; date?: string };
  };
  selectedStep?: 'QT' | 'PO' | 'GR' | 'INV' | 'PAID';
  onStepClick?: (step: 'QT' | 'PO' | 'GR' | 'INV' | 'PAID') => void;
  onNavigate?: (type: string, id: number) => void;
  onCreatePO?: () => void;
  onApprovePO?: () => void;
  onCreateGR?: () => void;
  onPostGR?: () => void;
  onCreateInvoice?: () => void;
  onPostInvoice?: () => void;
  onMarkPaid?: () => void;
}

const QuotationFlowProgress: React.FC<QuotationFlowProgressProps> = ({
  quotation,
  relatedDocs,
  selectedStep,
  onStepClick,
  onNavigate,
  onCreatePO,
  onApprovePO,
  onCreateGR,
  onPostGR,
  onCreateInvoice,
  onPostInvoice,
  onMarkPaid
}) => {
  // Calculate progress percentage
  const getProgressPercent = () => {
    let completed = 0;
    if (['CONFIRMED', 'PARTIALLY_CLOSED', 'CLOSED'].includes(quotation.status)) completed += 20;
    if (relatedDocs.po?.status === 'APPROVED') completed += 20;
    if (relatedDocs.gr?.status === 'POSTED') completed += 20;
    if (relatedDocs.inv) completed += 20;
    if (relatedDocs.inv?.status === 'PAID') completed += 20;
    return completed;
  };

  const getStatusIcon = (status: 'completed' | 'current' | 'pending') => {
    switch (status) {
      case 'completed':
        return <CheckCircleFilled style={{ color: '#10b981', fontSize: 20 }} />;
      case 'current':
        return <ClockCircleFilled style={{ color: '#f59e0b', fontSize: 20 }} />;
      default:
        return <MinusCircleOutlined style={{ color: '#6b7280', fontSize: 20 }} />;
    }
  };

  const getStepStatus = (step: string): 'completed' | 'current' | 'pending' => {
    switch (step) {
      case 'QT':
        if (['CONFIRMED', 'PARTIALLY_CLOSED', 'CLOSED'].includes(quotation.status)) return 'completed';
        return 'current';
      case 'PO':
        if (relatedDocs.po?.status === 'APPROVED') return 'completed';
        if (relatedDocs.po) return 'current';
        if (['CONFIRMED', 'PARTIALLY_CLOSED'].includes(quotation.status)) return 'current';
        return 'pending';
      case 'GR':
        if (relatedDocs.gr?.status === 'POSTED') return 'completed';
        if (relatedDocs.gr) return 'current';
        if (relatedDocs.po?.status === 'APPROVED') return 'current';
        return 'pending';
      case 'INV':
        if (relatedDocs.inv?.status === 'POSTED' || relatedDocs.inv?.status === 'PAID') return 'completed';
        if (relatedDocs.inv) return 'current';
        if (relatedDocs.gr?.status === 'POSTED') return 'current';
        return 'pending';
      case 'PAID':
        if (relatedDocs.inv?.status === 'PAID') return 'completed';
        if (relatedDocs.inv?.status === 'POSTED') return 'current';
        return 'pending';
      default:
        return 'pending';
    }
  };

  // Determine action button for each step
  const getStepAction = (step: string): { label: string; action: () => void } | null => {
    switch (step) {
      case 'PO':
        // ยังไม่มี PO → สร้าง PO
        if (!relatedDocs.po && ['CONFIRMED', 'PARTIALLY_CLOSED'].includes(quotation.status)) {
          return { label: 'สร้าง PO', action: onCreatePO || (() => {}) };
        }
        // มี PO แต่ยังไม่อนุมัติ → อนุมัติ PO
        if (relatedDocs.po?.status === 'DRAFT' || relatedDocs.po?.status === 'PENDING_APPROVAL') {
          return { label: 'อนุมัติ PO', action: onApprovePO || (() => {}) };
        }
        break;
      case 'GR':
        // มี PO อนุมัติแล้ว แต่ยังไม่มี GR → สร้าง GR
        if (!relatedDocs.gr && (relatedDocs.po?.status === 'APPROVED' || relatedDocs.po?.status === 'SENT')) {
          return { label: 'รับสินค้า', action: onCreateGR || (() => {}) };
        }
        // มี GR แต่ยังไม่ Post → Post GR
        if (relatedDocs.gr?.status === 'DRAFT') {
          return { label: 'บันทึก GR', action: onPostGR || (() => {}) };
        }
        break;
      case 'INV':
        // มี GR Posted แต่ยังไม่มี INV → สร้าง INV
        if (!relatedDocs.inv && relatedDocs.gr?.status === 'POSTED') {
          return { label: 'สร้างใบแจ้งหนี้', action: onCreateInvoice || (() => {}) };
        }
        // มี INV แต่ยังไม่ Post → Post INV
        if (relatedDocs.inv?.status === 'DRAFT') {
          return { label: 'บันทึก INV', action: onPostInvoice || (() => {}) };
        }
        break;
      case 'PAID':
        // มี INV Posted → บันทึกชำระ
        if (relatedDocs.inv?.status === 'POSTED') {
          return { label: 'บันทึกชำระ', action: onMarkPaid || (() => {}) };
        }
        break;
    }
    return null;
  };

  const steps: FlowStep[] = [
    {
      key: 'QT',
      icon: <FileTextOutlined style={{ fontSize: 28 }} />,
      title: 'ใบเสนอราคา',
      status: getStepStatus('QT'),
      docNo: quotation.docFullNo,
      docStatus: quotation.status,
      date: quotation.docDate,
    },
    {
      key: 'PO',
      icon: <ShoppingCartOutlined style={{ fontSize: 28 }} />,
      title: 'ใบสั่งซื้อ',
      status: getStepStatus('PO'),
      docNo: relatedDocs.po?.docNo,
      docStatus: relatedDocs.po?.status,
      date: relatedDocs.po?.date,
      onClick: relatedDocs.po ? () => onNavigate?.('po', relatedDocs.po!.id) : undefined,
    },
    {
      key: 'GR',
      icon: <InboxOutlined style={{ fontSize: 28 }} />,
      title: 'รับสินค้า',
      status: getStepStatus('GR'),
      docNo: relatedDocs.gr?.docNo,
      docStatus: relatedDocs.gr?.status,
      date: relatedDocs.gr?.date,
      onClick: relatedDocs.gr ? () => onNavigate?.('gr', relatedDocs.gr!.id) : undefined,
    },
    {
      key: 'INV',
      icon: <FileProtectOutlined style={{ fontSize: 28 }} />,
      title: 'ใบแจ้งหนี้',
      status: getStepStatus('INV'),
      docNo: relatedDocs.inv?.docNo,
      docStatus: relatedDocs.inv?.status,
      date: relatedDocs.inv?.date,
      onClick: relatedDocs.inv ? () => onNavigate?.('inv', relatedDocs.inv!.id) : undefined,
    },
    {
      key: 'PAID',
      icon: <DollarOutlined style={{ fontSize: 28 }} />,
      title: 'ชำระเงิน',
      status: getStepStatus('PAID'),
      docNo: relatedDocs.inv?.status === 'PAID' ? 'ชำระแล้ว' : undefined,
      docStatus: relatedDocs.inv?.status === 'PAID' ? 'PAID' : undefined,
    },
  ];

  const statusColors: Record<string, string> = {
    DRAFT: '#6b7280',
    CONFIRMED: '#10b981',
    APPROVED: '#10b981',
    POSTED: '#10b981',
    PAID: '#10b981',
    PENDING: '#f59e0b',
    PARTIALLY_CLOSED: '#3b82f6',
    CLOSED: '#10b981',
  };

  const statusLabels: Record<string, string> = {
    DRAFT: 'ร่าง',
    CONFIRMED: 'ยืนยันแล้ว',
    APPROVED: 'อนุมัติแล้ว',
    POSTED: 'บันทึกแล้ว',
    PAID: 'ชำระแล้ว',
    PENDING: 'รอดำเนินการ',
    PARTIALLY_CLOSED: 'ปิดบางส่วน',
    CLOSED: 'ปิดแล้ว',
    COMPLETED: 'เสร็จสิ้น',
  };

  const progressPercent = getProgressPercent();

  return (
    <Card 
      style={{ 
        marginBottom: 24, 
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        border: '1px solid #374151',
        borderRadius: 12,
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h2 style={{ color: '#e5e7eb', margin: 0, fontSize: 20 }}>
          📋 {quotation.docFullNo} - Flow Progress
        </h2>
      </div>

      {/* Flow Steps */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        padding: '0 20px',
        marginBottom: 24,
        position: 'relative',
      }}>
        {/* Connection Line */}
        <div style={{
          position: 'absolute',
          top: 45,
          left: '10%',
          right: '10%',
          height: 3,
          background: '#374151',
          zIndex: 0,
        }} />
        <div style={{
          position: 'absolute',
          top: 45,
          left: '10%',
          width: `${progressPercent * 0.8}%`,
          height: 3,
          background: 'linear-gradient(90deg, #10b981, #3b82f6)',
          zIndex: 1,
          transition: 'width 0.5s ease',
        }} />

        {steps.map((step) => {
          const stepAction = getStepAction(step.key);
          const isSelected = selectedStep === step.key;
          
          return (
            <Tooltip 
              key={step.key} 
              title="คลิกเพื่อดูรายละเอียด"
            >
              <div 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  cursor: 'pointer',
                  zIndex: 2,
                  flex: 1,
                }}
                onClick={() => onStepClick?.(step.key as 'QT' | 'PO' | 'GR' | 'INV' | 'PAID')}
              >
                {/* Step Box */}
                <div style={{
                  width: 90,
                  height: 90,
                  borderRadius: 12,
                  background: step.status === 'completed' 
                    ? 'linear-gradient(135deg, #065f46 0%, #047857 100%)'
                    : step.status === 'current'
                    ? 'linear-gradient(135deg, #92400e 0%, #b45309 100%)'
                    : '#1f2937',
                  border: isSelected 
                    ? '3px solid #3b82f6'
                    : step.status === 'completed' 
                    ? '2px solid #10b981'
                    : step.status === 'current'
                    ? '2px solid #f59e0b'
                    : '2px solid #374151',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12,
                  transition: 'all 0.3s ease',
                  boxShadow: isSelected 
                    ? '0 0 20px rgba(59,130,246,0.5)' 
                    : step.status !== 'pending' ? '0 4px 12px rgba(0,0,0,0.3)' : 'none',
                  transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                }}>
                  <div style={{ color: step.status === 'pending' ? '#6b7280' : '#fff' }}>
                    {step.icon}
                  </div>
                  <div style={{ 
                    color: step.status === 'pending' ? '#6b7280' : '#fff',
                    fontSize: 11,
                    fontWeight: 600,
                    marginTop: 4,
                  }}>
                    {step.title}
                  </div>
                </div>

                {/* Status Icon */}
                <div style={{ marginBottom: 8 }}>
                  {getStatusIcon(step.status)}
                </div>

                {/* Doc Number */}
                <div style={{ 
                  color: step.docNo ? '#e5e7eb' : '#6b7280',
                  fontSize: 12,
                  fontWeight: 600,
                  textAlign: 'center',
                  minHeight: 18,
                }}>
                  {step.docNo || '-'}
                </div>

                {/* Status Tag */}
                {step.docStatus && (
                  <Tag 
                    color={statusColors[step.docStatus] || '#6b7280'}
                    style={{ marginTop: 4, fontSize: 10 }}
                  >
                    {statusLabels[step.docStatus] || step.docStatus}
                  </Tag>
                )}

                {/* Action Button */}
                {stepAction && (
                  <Button
                    type="primary"
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      stepAction.action();
                    }}
                    style={{
                      marginTop: 8,
                      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                      border: 'none',
                      fontSize: 11,
                      height: 26,
                      borderRadius: 6,
                    }}
                  >
                    {stepAction.label}
                  </Button>
                )}
              </div>
            </Tooltip>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div style={{ padding: '0 20px', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ color: '#9ca3af', fontSize: 12 }}>Progress</span>
          <span style={{ color: '#10b981', fontSize: 12, fontWeight: 600 }}>{progressPercent}%</span>
        </div>
        <Progress 
          percent={progressPercent} 
          showInfo={false}
          strokeColor={{
            '0%': '#10b981',
            '100%': '#3b82f6',
          }}
          trailColor="#374151"
          strokeWidth={8}
        />
      </div>

      {/* Footer Info */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-around',
        padding: '16px 20px',
        borderTop: '1px solid #374151',
        background: 'rgba(0,0,0,0.2)',
        borderRadius: '0 0 12px 12px',
        margin: '0 -24px -24px -24px',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#9ca3af', fontSize: 11 }}>📅 วันที่</div>
          <div style={{ color: '#e5e7eb', fontSize: 13, fontWeight: 600 }}>
            {new Date(quotation.docDate).toLocaleDateString('th-TH')}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#9ca3af', fontSize: 11 }}>👤 ลูกค้า</div>
          <div style={{ color: '#e5e7eb', fontSize: 13, fontWeight: 600, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {quotation.customerName}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#9ca3af', fontSize: 11 }}>💵 ยอดรวม</div>
          <div style={{ color: '#10b981', fontSize: 13, fontWeight: 600 }}>
            ฿{Number(quotation.grandTotal || 0).toLocaleString()}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default QuotationFlowProgress;
