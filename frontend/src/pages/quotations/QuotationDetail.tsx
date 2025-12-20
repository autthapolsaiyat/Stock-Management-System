import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card, Button, Tag, Space, Descriptions, Table, Divider,
  message, Popconfirm, Row, Col, Progress
} from 'antd';
import {
  EditOutlined, SendOutlined, CheckCircleOutlined,
  CloseCircleOutlined, FileTextOutlined, ShoppingCartOutlined,
  ArrowLeftOutlined, FilePdfOutlined
} from '@ant-design/icons';
import QuotationFlowProgress from '../../components/quotation/QuotationFlowProgress';
import QuotationPrintPreview from '../../components/quotation/QuotationPrintPreview';
import { quotationsApi, purchaseOrdersApi, salesInvoicesApi, goodsReceiptsApi } from '../../services/api';
import type { Quotation, QuotationItem, QuotationType, QuotationStatus } from '../../types/quotation';

const typeLabels: Record<QuotationType, { text: string; color: string; icon: string }> = {
  STANDARD: { text: 'Accustandard/PT', color: 'blue', icon: '🧪' },
  FORENSIC: { text: 'นิติวิทยาศาสตร์', color: 'purple', icon: '🔬' },
  MAINTENANCE: { text: 'บำรุงรักษา', color: 'green', icon: '🔧' },
  LAB: { text: 'เครื่องมือวิทยาศาสตร์', color: 'orange', icon: '🏭' },
};

const statusLabels: Record<QuotationStatus, { text: string; color: string }> = {
  DRAFT: { text: 'ร่าง', color: 'default' },
  PENDING: { text: 'รออนุมัติ', color: 'orange' },
  APPROVED: { text: 'อนุมัติแล้ว', color: 'green' },
  SENT: { text: 'ส่งแล้ว', color: 'blue' },
  CONFIRMED: { text: 'ยืนยันแล้ว', color: 'cyan' },
  PARTIALLY_CLOSED: { text: 'ปิดบางส่วน', color: 'geekblue' },
  CLOSED: { text: 'ปิดแล้ว', color: 'green' },
  CANCELLED: { text: 'ยกเลิก', color: 'red' },
};

const itemStatusLabels: Record<string, { text: string; color: string }> = {
  PENDING: { text: 'รอสั่งซื้อ', color: 'default' },
  ORDERED: { text: 'สั่งซื้อแล้ว', color: 'processing' },
  PARTIAL: { text: 'รับบางส่วน', color: 'warning' },
  RECEIVED: { text: 'รับครบ', color: 'success' },
  SOLD: { text: 'ขายแล้ว', color: 'green' },
  CANCELLED: { text: 'ยกเลิก', color: 'error' },
};

const QuotationDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [loading, setLoading] = useState(true);
  const [printPreviewOpen, setPrintPreviewOpen] = useState(false);
  const [relatedDocs, setRelatedDocs] = useState<{
    purchaseOrders: any[];
    goodsReceipts: any[];
    invoices: any[];
  }>({ purchaseOrders: [], goodsReceipts: [], invoices: [] });

  useEffect(() => {
    if (id) {
      loadQuotation(parseInt(id));
    }
  }, [id]);

  const loadQuotation = async (quotationId: number) => {
    setLoading(true);
    try {
      const response = await quotationsApi.getById(quotationId);
      setQuotation(response.data);
      
      // Load related documents
      const [poRes, grRes, invRes] = await Promise.all([
        purchaseOrdersApi.getByQuotation(quotationId).catch(() => ({ data: [] })),
        goodsReceiptsApi.getByQuotation(quotationId).catch(() => ({ data: [] })),
        salesInvoicesApi.getByQuotation(quotationId).catch(() => ({ data: [] })),
      ]);
      
      setRelatedDocs({
        purchaseOrders: Array.isArray(poRes.data) ? poRes.data : [],
        goodsReceipts: Array.isArray(grRes.data) ? grRes.data : [],
        invoices: Array.isArray(invRes.data) ? invRes.data : [],
      });
    } catch (error) {
      message.error('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    try {
      await quotationsApi.send(parseInt(id!));
      message.success('ส่งใบเสนอราคาสำเร็จ');
      loadQuotation(parseInt(id!));
    } catch (error) {
      message.error('ไม่สามารถส่งได้');
    }
  };

  const handleConfirm = async () => {
    try {
      await quotationsApi.confirm(parseInt(id!));
      message.success('ยืนยันใบเสนอราคาสำเร็จ');
      loadQuotation(parseInt(id!));
    } catch (error) {
      message.error('ไม่สามารถยืนยันได้');
    }
  };

  const handleCancel = async () => {
    try {
      await quotationsApi.cancel(parseInt(id!));
      message.success('ยกเลิกใบเสนอราคาสำเร็จ');
      loadQuotation(parseInt(id!));
    } catch (error) {
      message.error('ไม่สามารถยกเลิกได้');
    }
  };

  const handleCreatePO = async () => {
    try {
      await purchaseOrdersApi.createFromQuotation(parseInt(id!));
      message.success('สร้างใบสั่งซื้อสำเร็จ');
      navigate('/purchase-orders');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'ไม่สามารถสร้างใบสั่งซื้อได้');
    }
  };

  const handleCreateInvoice = async () => {
    try {
      await salesInvoicesApi.createFromQuotation(parseInt(id!));
      message.success('สร้างใบแจ้งหนี้สำเร็จ');
      navigate('/sales-invoices');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'ไม่สามารถสร้างใบแจ้งหนี้ได้');
    }
  };

  const handleMarkPaid = async () => {
    const inv = relatedDocs.invoices.find(i => i.status === "POSTED") || relatedDocs.invoices[0];
    if (!inv) {
      message.error("ไม่พบใบแจ้งหนี้ที่สามารถบันทึกชำระได้");
      return;
    }
    try {
      await salesInvoicesApi.markPaid(inv.id, { paymentMethod: "CASH", paymentReference: "" });
      message.success("บันทึกชำระเงินสำเร็จ");
      loadQuotation(parseInt(id!));
    } catch (error: any) {
      message.error(error.response?.data?.message || "ไม่สามารถบันทึกชำระเงินได้");
    }
  };

  if (loading || !quotation) {
    return <div style={{ padding: 24, textAlign: 'center' }}>กำลังโหลด...</div>;
  }

  const typeConfig = typeLabels[quotation.quotationType] || { text: quotation.quotationType, color: "default", icon: "📄" };
  const statusConfig = statusLabels[quotation.status] || { text: quotation.status, color: "default" };

  const totalItems = quotation.items?.length || 0;
  const soldItems = quotation.items?.filter(i => i.itemStatus === 'SOLD').length || 0;
  const fulfillmentPercent = totalItems > 0 ? (soldItems / totalItems) * 100 : 0;

  const itemColumns = [
    {
      title: '#',
      dataIndex: 'lineNo',
      width: 50,
      align: 'center' as const,
    },
    {
      title: 'สินค้า',
      dataIndex: 'itemName',
      render: (text: string, record: QuotationItem) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            {record.sourceType === 'TEMP' && <Tag color="orange">🔶</Tag>}
            {text}
          </div>
          <div style={{ fontSize: 12, color: '#888' }}>{record.itemCode}</div>
        </div>
      ),
    },
    {
      title: 'จำนวน',
      dataIndex: 'qty',
      width: 80,
      align: 'center' as const,
      render: (val: number, record: QuotationItem) => (
        <span>{val} {record.unit}</span>
      ),
    },
    {
      title: 'ราคา/หน่วย',
      dataIndex: 'unitPrice',
      width: 120,
      align: 'right' as const,
      render: (val: number) => `฿${Number(val || 0).toLocaleString()}`,
    },
    {
      title: 'Margin',
      dataIndex: 'expectedMarginPercent',
      width: 80,
      align: 'center' as const,
      render: (val: number) => {
        const percent = Number(val || 0);
        return (
          <Tag color={percent < 10 ? 'warning' : percent >= 20 ? 'green' : 'blue'}>
            {percent.toFixed(1)}%
          </Tag>
        );
      },
    },
    {
      title: 'รวม',
      dataIndex: 'lineTotal',
      width: 120,
      align: 'right' as const,
      render: (val: number) => `฿${Number(val || 0).toLocaleString()}`,
    },
    {
      title: 'สถานะ',
      dataIndex: 'itemStatus',
      width: 100,
      render: (status: string) => {
        const config = itemStatusLabels[status] || { text: status, color: 'default' };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/quotations')}
            style={{ marginBottom: 8 }}
          >
            กลับ
          </Button>
          <h1 style={{ margin: 0, fontSize: 24 }}>
            📋 {quotation.docFullNo}
          </h1>
          <Space style={{ marginTop: 8 }}>
            <Tag color={typeConfig.color}>{typeConfig.icon} {typeConfig.text}</Tag>
            <Tag color={statusConfig.color}>{statusConfig.text}</Tag>
          </Space>
        </div>
        
        {/* Actions */}
        <Space wrap>
          {quotation.status === 'DRAFT' && (
            <>
              <Button icon={<EditOutlined />} onClick={() => navigate(`/quotations/${id}/edit`)}>
                แก้ไข
              </Button>
              <Popconfirm title="ส่งใบเสนอราคาให้ลูกค้า?" onConfirm={handleSend}>
                <Button type="primary" icon={<SendOutlined />}>
                  ส่งลูกค้า
                </Button>
              </Popconfirm>
            </>
          )}
          
          {quotation.status === 'SENT' && (
            <Popconfirm title="ลูกค้ายืนยันรับงาน?" onConfirm={handleConfirm}>
              <Button type="primary" icon={<CheckCircleOutlined />}>
                ยืนยันรับงาน
              </Button>
            </Popconfirm>
          )}
          
          {(['CONFIRMED', 'PARTIALLY_CLOSED'] as string[]).includes(quotation.status) && (
            <>
              <Button type="primary" icon={<FileTextOutlined />} onClick={handleCreatePO}>
                สร้าง PO
              </Button>
              <Button icon={<ShoppingCartOutlined />} onClick={handleCreateInvoice}>
                สร้างใบแจ้งหนี้
              </Button>
            </>
          )}
          
          {quotation.status === 'DRAFT' && (
            <Popconfirm title="ยกเลิกใบเสนอราคา?" onConfirm={handleCancel}>
              <Button danger icon={<CloseCircleOutlined />}>
                ยกเลิก
              </Button>
            </Popconfirm>
          )}
          
          <Button icon={<FilePdfOutlined />} onClick={() => setPrintPreviewOpen(true)}>
            พิมพ์ PDF
          </Button>
        </Space>
      </div>
      

      {/* Flow Progress */}
      <QuotationFlowProgress
        quotation={{
          docFullNo: quotation.docFullNo || "",
          status: quotation.status || "DRAFT",
          customerName: quotation.customerName || "",
          grandTotal: Number(quotation.grandTotal),
          docDate: quotation.docDate || "",
        }}
        relatedDocs={{
          po: relatedDocs.purchaseOrders[0] ? {
            id: relatedDocs.purchaseOrders[0].id,
            docNo: relatedDocs.purchaseOrders[0].docFullNo,
            status: relatedDocs.purchaseOrders[0].status,
          } : undefined,
          gr: relatedDocs.goodsReceipts[0] ? {
            id: relatedDocs.goodsReceipts[0].id,
            docNo: relatedDocs.goodsReceipts[0].docFullNo,
            status: relatedDocs.goodsReceipts[0].status,
          } : undefined,
          inv: (() => { const best = relatedDocs.invoices.find(i => i.status === "PAID") || relatedDocs.invoices.find(i => i.status === "POSTED") || relatedDocs.invoices[0]; return best ? {
            id: best.id,
            docNo: best.docFullNo,
            status: best.status,
          } : undefined; })(),
        }}
    	        onNavigate={(type) => {
          if (type === "po") navigate("/purchase-orders");
          if (type === "gr") navigate("/goods-receipts");
          if (type === "inv") navigate("/sales-invoices");
        }}
        onCreatePO={handleCreatePO}
        onCreateGR={() => navigate("/goods-receipts")}
        onCreateInvoice={handleCreateInvoice}
        onMarkPaid={handleMarkPaid}
      />
      <Row gutter={24}>
        <Col xs={24} lg={16}>
          <Card title="ข้อมูลลูกค้า" style={{ marginBottom: 16 }}>
            <Descriptions column={{ xs: 1, sm: 2 }}>
              <Descriptions.Item label="ลูกค้า">{quotation.customerName}</Descriptions.Item>
              <Descriptions.Item label="ผู้ติดต่อ">{quotation.contactPerson}</Descriptions.Item>
              <Descriptions.Item label="โทรศัพท์">{quotation.contactPhone}</Descriptions.Item>
              <Descriptions.Item label="อีเมล">{quotation.contactEmail}</Descriptions.Item>
              <Descriptions.Item label="ที่อยู่" span={2}>{quotation.customerAddress}</Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="รายการสินค้า" style={{ marginBottom: 16 }}>
            <Table
              columns={itemColumns}
              dataSource={quotation.items}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>

          <Card title="สรุปยอด">
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="วันที่">
                    {new Date(quotation.docDate).toLocaleDateString('th-TH')}
                  </Descriptions.Item>
                  <Descriptions.Item label="ยืนราคา">{quotation.validDays} วัน</Descriptions.Item>
                  <Descriptions.Item label="กำหนดส่งมอบ">{quotation.deliveryDays} วัน</Descriptions.Item>
                  <Descriptions.Item label="เครดิต">{quotation.creditTermDays} วัน</Descriptions.Item>
                </Descriptions>
              </Col>
              <Col xs={24} md={12}>
                <div style={{ fontSize: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span>รวมสินค้า:</span>
                    <span>฿{Number(quotation.subtotal || 0).toLocaleString()}</span>
                  </div>
                  {Number(quotation.discountAmount || 0) > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#f5222d' }}>
                      <span>ส่วนลด:</span>
                      <span>-฿{Number(quotation.discountAmount).toLocaleString()}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span>VAT {quotation.taxRate}%:</span>
                    <span>฿{Number(quotation.taxAmount || 0).toLocaleString()}</span>
                  </div>
                  <Divider style={{ margin: '8px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: 18 }}>
                    <span>ยอดสุทธิ:</span>
                    <span>฿{Number(quotation.grandTotal || 0).toLocaleString()}</span>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="ความคืบหน้า" style={{ marginBottom: 16 }}>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <Progress
                type="circle"
                percent={Math.round(fulfillmentPercent)}
                format={() => `${soldItems}/${totalItems}`}
              />
            </div>
            <div style={{ textAlign: 'center', color: '#888' }}>
              รายการที่ขายแล้ว
            </div>
          </Card>

          <Card title="เอกสารที่เกี่ยวข้อง" style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 12 }}>
              <strong>📦 ใบสั่งซื้อ (PO):</strong>
              {relatedDocs.purchaseOrders.length > 0 ? (
                relatedDocs.purchaseOrders.map(po => (
                  <Button key={po.id} type="link" size="small">
                    {po.docFullNo}
                  </Button>
                ))
              ) : (
                <span style={{ color: '#888', marginLeft: 8 }}>ยังไม่มี</span>
              )}
            </div>
            <div style={{ marginBottom: 12 }}>
              <strong>📥 ใบรับสินค้า (GR):</strong>
              {relatedDocs.goodsReceipts.length > 0 ? (
                relatedDocs.goodsReceipts.map(gr => (
                  <Button key={gr.id} type="link" size="small">
                    {gr.docFullNo}
                  </Button>
                ))
              ) : (
                <span style={{ color: '#888', marginLeft: 8 }}>ยังไม่มี</span>
              )}
            </div>
            <div>
              <strong>🧾 ใบแจ้งหนี้ (INV):</strong>
              {relatedDocs.invoices.length > 0 ? (
                relatedDocs.invoices.map(inv => (
                  <Button key={inv.id} type="link" size="small">
                    {inv.docFullNo}
                  </Button>
                ))
              ) : (
                <span style={{ color: '#888', marginLeft: 8 }}>ยังไม่มี</span>
              )}
            </div>
          </Card>
        </Col>
      </Row>
      
      {quotation && (
        <QuotationPrintPreview
          open={printPreviewOpen}
          onClose={() => setPrintPreviewOpen(false)}
          quotation={{
            docFullNo: quotation.docFullNo || "",
            docDate: quotation.docDate || "",
            validDays: quotation.validDays,
            deliveryDays: quotation.deliveryDays,
            creditTermDays: quotation.creditTermDays,
            contactPerson: quotation.contactPerson,
            publicNote: quotation.publicNote,
            subtotal: Number(quotation.subtotal) || 0,
            discountAmount: Number(quotation.discountAmount) || 0,
            afterDiscount: Number(quotation.afterDiscount) || 0,
            taxAmount: Number(quotation.taxAmount) || 0,
            grandTotal: Number(quotation.grandTotal) || 0,
          }}
          items={quotation.items || []}
          customer={{ name: quotation.customerName, address: quotation.customerAddress }}
        />
      )}
    </div>
  );
};

export default QuotationDetail;
