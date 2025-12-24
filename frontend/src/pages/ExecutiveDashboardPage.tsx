import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spin, Statistic, Table, Progress, Tag, Divider, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  DollarOutlined,
  RiseOutlined,
  ClockCircleOutlined,
  BankOutlined,
  TeamOutlined,
  ShopOutlined,
  TrophyOutlined,
  ArrowLeftOutlined,
  SafetyCertificateOutlined,
  BarChartOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import api from '../services/api';

const { Title, Text } = Typography;

interface FinancialMetrics {
  totalStockValue: number;
  totalSalesYTD: number;
  totalSalesThisMonth: number;
  grossProfitYTD: number;
  grossMarginPercent: number;
  totalAR: number;
  totalAP: number;
  cashFlow: number;
}

interface BusinessMetrics {
  quotationsThisMonth: number;
  quotationsApproved: number;
  winRatePercent: number;
  poThisMonth: number;
  grThisMonth: number;
  invoicesPaid: number;
  invoicesPending: number;
  avgOrderValue: number;
}

interface MonthlyTrend {
  month: string;
  sales: number;
  profit: number;
}

interface TopCustomer {
  id: number;
  name: string;
  totalValue: number;
  orderCount: number;
}

const ExecutiveDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [darkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  
  const [financial, setFinancial] = useState<FinancialMetrics>({
    totalStockValue: 0,
    totalSalesYTD: 0,
    totalSalesThisMonth: 0,
    grossProfitYTD: 0,
    grossMarginPercent: 0,
    totalAR: 0,
    totalAP: 0,
    cashFlow: 0,
  });

  const [business, setBusiness] = useState<BusinessMetrics>({
    quotationsThisMonth: 0,
    quotationsApproved: 0,
    winRatePercent: 0,
    poThisMonth: 0,
    grThisMonth: 0,
    invoicesPaid: 0,
    invoicesPending: 0,
    avgOrderValue: 0,
  });

  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrend[]>([]);
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);
  const [companyInfo, setCompanyInfo] = useState<any>({});
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalSuppliers, setTotalSuppliers] = useState(0);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [
        stockRes,
        productsRes,
        customersRes,
        suppliersRes,
        quotationsRes,
        invoicesRes,
        poRes,
        grRes,
        settingsRes,
      ] = await Promise.all([
        api.get('/api/stock/balance'),
        api.get('/api/products'),
        api.get('/api/customers'),
        api.get('/api/suppliers'),
        api.get('/api/quotations'),
        api.get('/api/sales-invoices'),
        api.get('/api/purchase-orders'),
        api.get('/api/goods-receipts'),
        api.get('/api/settings').catch(() => ({ data: [] })),
      ]);

      const stockBalances = stockRes.data || [];
      const products = productsRes.data || [];
      const customers = customersRes.data || [];
      const suppliers = suppliersRes.data || [];
      const quotations = quotationsRes.data || [];
      const invoices = invoicesRes.data || [];
      const purchaseOrders = poRes.data || [];
      const goodsReceipts = grRes.data || [];
      const settings = settingsRes.data || [];

      // Parse settings
      const settingsObj: any = {};
      settings.forEach((s: any) => { settingsObj[s.key] = s.value; });
      setCompanyInfo(settingsObj);

      setTotalProducts(products.length);
      setTotalCustomers(customers.length);
      setTotalSuppliers(suppliers.length);

      // Calculate Financial Metrics
      const totalStockValue = stockBalances.reduce((sum: number, sb: any) => 
        sum + (Number(sb.qtyOnHand || sb.qty_on_hand || sb.balance || 0) * Number(sb.avgCost || sb.avg_cost || 0)), 0);

      // Filter this year and this month
      const now = new Date();
      const thisYear = now.getFullYear();
      const thisMonth = now.getMonth();

      const invoicesYTD = invoices.filter((inv: any) => {
        const d = new Date(inv.docDate);
        return d.getFullYear() === thisYear && ['POSTED', 'PAID'].includes(inv.status);
      });

      const invoicesThisMonth = invoicesYTD.filter((inv: any) => {
        const d = new Date(inv.docDate);
        return d.getMonth() === thisMonth;
      });

      const totalSalesYTD = invoicesYTD.reduce((sum: number, inv: any) => sum + Number(inv.grandTotal || 0), 0);
      const totalSalesThisMonth = invoicesThisMonth.reduce((sum: number, inv: any) => sum + Number(inv.grandTotal || 0), 0);
      const totalCostYTD = invoicesYTD.reduce((sum: number, inv: any) => sum + Number(inv.costTotal || 0), 0);
      const grossProfitYTD = totalSalesYTD - totalCostYTD;
      const grossMarginPercent = totalSalesYTD > 0 ? (grossProfitYTD / totalSalesYTD) * 100 : 0;

      // AR (Posted but not paid)
      const totalAR = invoices
        .filter((inv: any) => inv.status === 'POSTED')
        .reduce((sum: number, inv: any) => sum + Number(inv.grandTotal || 0), 0);

      // AP (Approved POs not fully received) - simplified
      const totalAP = purchaseOrders
        .filter((po: any) => ['APPROVED', 'SENT', 'PARTIAL_RECEIVED'].includes(po.status))
        .reduce((sum: number, po: any) => sum + Number(po.grandTotal || 0), 0);

      setFinancial({
        totalStockValue,
        totalSalesYTD,
        totalSalesThisMonth,
        grossProfitYTD,
        grossMarginPercent,
        totalAR,
        totalAP,
        cashFlow: totalSalesYTD - totalAP,
      });

      // Calculate Business Metrics
      const quotationsThisMonth = quotations.filter((qt: any) => {
        const d = new Date(qt.createdAt);
        return d.getFullYear() === thisYear && d.getMonth() === thisMonth;
      });

      const quotationsApproved = quotationsThisMonth.filter((qt: any) => 
        ['APPROVED', 'SENT', 'CONFIRMED', 'CLOSED', 'PARTIALLY_CLOSED'].includes(qt.status)
      );

      const poThisMonth = purchaseOrders.filter((po: any) => {
        const d = new Date(po.createdAt);
        return d.getFullYear() === thisYear && d.getMonth() === thisMonth;
      });

      const grThisMonth = goodsReceipts.filter((gr: any) => {
        const d = new Date(gr.createdAt);
        return d.getFullYear() === thisYear && d.getMonth() === thisMonth;
      });

      const invoicesPaid = invoices.filter((inv: any) => inv.status === 'PAID').length;
      const invoicesPending = invoices.filter((inv: any) => inv.status === 'POSTED').length;

      const avgOrderValue = invoicesYTD.length > 0 ? totalSalesYTD / invoicesYTD.length : 0;

      setBusiness({
        quotationsThisMonth: quotationsThisMonth.length,
        quotationsApproved: quotationsApproved.length,
        winRatePercent: quotationsThisMonth.length > 0 ? (quotationsApproved.length / quotationsThisMonth.length) * 100 : 0,
        poThisMonth: poThisMonth.length,
        grThisMonth: grThisMonth.length,
        invoicesPaid,
        invoicesPending,
        avgOrderValue,
      });

      // Monthly Trends (last 6 months)
      const months: MonthlyTrend[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(thisYear, thisMonth - i, 1);
        const monthInvoices = invoices.filter((inv: any) => {
          const invDate = new Date(inv.docDate);
          return invDate.getFullYear() === d.getFullYear() && 
                 invDate.getMonth() === d.getMonth() &&
                 ['POSTED', 'PAID'].includes(inv.status);
        });
        
        const sales = monthInvoices.reduce((sum: number, inv: any) => sum + Number(inv.grandTotal || 0), 0);
        const cost = monthInvoices.reduce((sum: number, inv: any) => sum + Number(inv.costTotal || 0), 0);
        
        months.push({
          month: d.toLocaleDateString('th-TH', { month: 'short', year: '2-digit' }),
          sales,
          profit: sales - cost,
        });
      }
      setMonthlyTrends(months);

      // Top Customers
      const customerSales: { [key: number]: { name: string; total: number; count: number } } = {};
      invoicesYTD.forEach((inv: any) => {
        const cid = inv.customerId;
        if (!customerSales[cid]) {
          customerSales[cid] = { name: inv.customerName || 'Unknown', total: 0, count: 0 };
        }
        customerSales[cid].total += Number(inv.grandTotal || 0);
        customerSales[cid].count += 1;
      });

      const topCust: TopCustomer[] = Object.entries(customerSales)
        .map(([id, data]) => ({
          id: Number(id),
          name: data.name,
          totalValue: data.total,
          orderCount: data.count,
        }))
        .sort((a, b) => b.totalValue - a.totalValue)
        .slice(0, 5);

      setTopCustomers(topCust);

    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `฿${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `฿${(num / 1000).toFixed(0)}K`;
    return `฿${num.toLocaleString()}`;
  };

  const formatFullNumber = (num: number) => `฿${Number(num || 0).toLocaleString('th-TH', { minimumFractionDigits: 2 })}`;

  const bgColor = darkMode ? '#0f172a' : '#f0f2f5';
  const cardBg = darkMode ? '#1e293b' : '#ffffff';
  const textColor = darkMode ? '#e2e8f0' : '#1f2937';
  const mutedColor = darkMode ? '#94a3b8' : '#6b7280';

  if (loading) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: bgColor 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: bgColor, 
      padding: '24px',
      color: textColor
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: 24,
        paddingBottom: 16,
        borderBottom: `1px solid ${darkMode ? '#334155' : '#e5e7eb'}`
      }}>
        <div>
          <div 
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: mutedColor }}
          >
            <ArrowLeftOutlined /> กลับหน้าหลัก
          </div>
          <Title level={2} style={{ margin: 0, color: textColor }}>
            <BankOutlined style={{ marginRight: 12 }} />
            Executive Financial Dashboard
          </Title>
          <Text style={{ color: mutedColor }}>
            {companyInfo.COMPANY_NAME_TH || 'บริษัท แสงวิทย์ ซายน์ จำกัด'} | ข้อมูล ณ วันที่ {new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}
          </Text>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Tag color="blue" style={{ marginBottom: 8 }}>
            <SafetyCertificateOutlined /> Internal Use Only
          </Tag>
          <div style={{ fontSize: 12, color: mutedColor }}>
            Tax ID: {companyInfo.COMPANY_TAX_ID || '0105545053424'}
          </div>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: 12
            }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>มูลค่าสินค้าคงคลัง</span>}
              value={financial.totalStockValue}
              precision={0}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#fff', fontSize: 28, fontWeight: 'bold' }}
              formatter={(v) => formatNumber(Number(v))}
            />
            <div style={{ color: 'rgba(255,255,255,0.7)', marginTop: 8, fontSize: 12 }}>
              {totalProducts.toLocaleString()} รายการสินค้า
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
              border: 'none',
              borderRadius: 12
            }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>ยอดขายปีนี้ (YTD)</span>}
              value={financial.totalSalesYTD}
              precision={0}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#fff', fontSize: 28, fontWeight: 'bold' }}
              formatter={(v) => formatNumber(Number(v))}
            />
            <div style={{ color: 'rgba(255,255,255,0.7)', marginTop: 8, fontSize: 12 }}>
              เดือนนี้: {formatNumber(financial.totalSalesThisMonth)}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              border: 'none',
              borderRadius: 12
            }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>กำไรขั้นต้น (YTD)</span>}
              value={financial.grossProfitYTD}
              precision={0}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#fff', fontSize: 28, fontWeight: 'bold' }}
              formatter={(v) => formatNumber(Number(v))}
            />
            <div style={{ color: 'rgba(255,255,255,0.7)', marginTop: 8, fontSize: 12 }}>
              Margin: {financial.grossMarginPercent.toFixed(1)}%
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              border: 'none',
              borderRadius: 12
            }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>ลูกหนี้การค้า (AR)</span>}
              value={financial.totalAR}
              precision={0}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#fff', fontSize: 28, fontWeight: 'bold' }}
              formatter={(v) => formatNumber(Number(v))}
            />
            <div style={{ color: 'rgba(255,255,255,0.7)', marginTop: 8, fontSize: 12 }}>
              รอเก็บเงิน {business.invoicesPending} รายการ
            </div>
          </Card>
        </Col>
      </Row>

      {/* Business Metrics & Trends */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* Business Performance */}
        <Col xs={24} lg={12}>
          <Card 
            title={<span style={{ color: textColor }}><BarChartOutlined /> ผลการดำเนินงานเดือนนี้</span>}
            style={{ background: cardBg, borderRadius: 12, height: '100%' }}
            headStyle={{ borderBottom: `1px solid ${darkMode ? '#334155' : '#e5e7eb'}` }}
          >
            <Row gutter={[16, 24]}>
              <Col span={8}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 32, fontWeight: 'bold', color: '#3b82f6' }}>
                    {business.quotationsThisMonth}
                  </div>
                  <div style={{ color: mutedColor, fontSize: 12 }}>ใบเสนอราคา</div>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 32, fontWeight: 'bold', color: '#22c55e' }}>
                    {business.quotationsApproved}
                  </div>
                  <div style={{ color: mutedColor, fontSize: 12 }}>อนุมัติแล้ว</div>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 32, fontWeight: 'bold', color: '#f59e0b' }}>
                    {business.winRatePercent.toFixed(0)}%
                  </div>
                  <div style={{ color: mutedColor, fontSize: 12 }}>Win Rate</div>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: '#8b5cf6' }}>
                    {business.poThisMonth}
                  </div>
                  <div style={{ color: mutedColor, fontSize: 12 }}>ใบสั่งซื้อ (PO)</div>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: '#06b6d4' }}>
                    {business.grThisMonth}
                  </div>
                  <div style={{ color: mutedColor, fontSize: 12 }}>รับสินค้า (GR)</div>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: '#ec4899' }}>
                    {business.invoicesPaid}
                  </div>
                  <div style={{ color: mutedColor, fontSize: 12 }}>ชำระแล้ว</div>
                </div>
              </Col>
            </Row>

            <Divider style={{ borderColor: darkMode ? '#334155' : '#e5e7eb' }} />

            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title={<span style={{ color: mutedColor }}>มูลค่าเฉลี่ย/ออเดอร์</span>}
                  value={business.avgOrderValue}
                  precision={0}
                  valueStyle={{ color: textColor, fontSize: 20 }}
                  formatter={(v) => formatFullNumber(Number(v))}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title={<span style={{ color: mutedColor }}>เจ้าหนี้การค้า (AP)</span>}
                  value={financial.totalAP}
                  precision={0}
                  valueStyle={{ color: '#ef4444', fontSize: 20 }}
                  formatter={(v) => formatNumber(Number(v))}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Monthly Trends */}
        <Col xs={24} lg={12}>
          <Card 
            title={<span style={{ color: textColor }}><RiseOutlined /> แนวโน้มยอดขาย 6 เดือน</span>}
            style={{ background: cardBg, borderRadius: 12, height: '100%' }}
            headStyle={{ borderBottom: `1px solid ${darkMode ? '#334155' : '#e5e7eb'}` }}
          >
            {monthlyTrends.map((trend, idx) => {
              const maxSales = Math.max(...monthlyTrends.map(t => t.sales));
              const percent = maxSales > 0 ? (trend.sales / maxSales) * 100 : 0;
              return (
                <div key={idx} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ color: mutedColor }}>{trend.month}</span>
                    <span style={{ fontWeight: 500, color: textColor }}>{formatNumber(trend.sales)}</span>
                  </div>
                  <Progress 
                    percent={percent} 
                    showInfo={false}
                    strokeColor={{
                      '0%': '#667eea',
                      '100%': '#764ba2',
                    }}
                    trailColor={darkMode ? '#334155' : '#e5e7eb'}
                  />
                  <div style={{ fontSize: 11, color: trend.profit >= 0 ? '#22c55e' : '#ef4444', marginTop: 2 }}>
                    กำไร: {formatNumber(trend.profit)}
                  </div>
                </div>
              );
            })}
          </Card>
        </Col>
      </Row>

      {/* Top Customers & Summary */}
      <Row gutter={[16, 16]}>
        {/* Top Customers */}
        <Col xs={24} lg={12}>
          <Card 
            title={<span style={{ color: textColor }}><TrophyOutlined /> Top 5 ลูกค้ายอดขายสูงสุด (ปีนี้)</span>}
            style={{ background: cardBg, borderRadius: 12 }}
            headStyle={{ borderBottom: `1px solid ${darkMode ? '#334155' : '#e5e7eb'}` }}
          >
            <Table
              dataSource={topCustomers}
              rowKey="id"
              pagination={false}
              size="small"
              columns={[
                {
                  title: '#',
                  width: 40,
                  render: (_: any, __: any, idx: number) => (
                    <Tag color={idx === 0 ? 'gold' : idx === 1 ? 'default' : idx === 2 ? 'orange' : 'default'}>
                      {idx + 1}
                    </Tag>
                  )
                },
                {
                  title: 'ลูกค้า',
                  dataIndex: 'name',
                  render: (name: string) => (
                    <span style={{ color: textColor, fontWeight: 500 }}>{name}</span>
                  )
                },
                {
                  title: 'ออเดอร์',
                  dataIndex: 'orderCount',
                  width: 70,
                  align: 'center' as const,
                  render: (v: number) => <span style={{ color: mutedColor }}>{v}</span>
                },
                {
                  title: 'ยอดรวม',
                  dataIndex: 'totalValue',
                  width: 120,
                  align: 'right' as const,
                  render: (v: number) => (
                    <span style={{ color: '#22c55e', fontWeight: 600 }}>{formatNumber(v)}</span>
                  )
                },
              ]}
            />
          </Card>
        </Col>

        {/* Company Summary */}
        <Col xs={24} lg={12}>
          <Card 
            title={<span style={{ color: textColor }}><ShopOutlined /> สรุปข้อมูลบริษัท</span>}
            style={{ background: cardBg, borderRadius: 12 }}
            headStyle={{ borderBottom: `1px solid ${darkMode ? '#334155' : '#e5e7eb'}` }}
          >
            <Row gutter={[16, 24]}>
              <Col span={8}>
                <Card 
                  size="small" 
                  style={{ 
                    background: darkMode ? '#334155' : '#f3f4f6', 
                    border: 'none',
                    textAlign: 'center' 
                  }}
                >
                  <ShoppingCartOutlined style={{ fontSize: 24, color: '#3b82f6', marginBottom: 8 }} />
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: textColor }}>{totalProducts.toLocaleString()}</div>
                  <div style={{ color: mutedColor, fontSize: 12 }}>สินค้าทั้งหมด</div>
                </Card>
              </Col>
              <Col span={8}>
                <Card 
                  size="small" 
                  style={{ 
                    background: darkMode ? '#334155' : '#f3f4f6', 
                    border: 'none',
                    textAlign: 'center' 
                  }}
                >
                  <TeamOutlined style={{ fontSize: 24, color: '#22c55e', marginBottom: 8 }} />
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: textColor }}>{totalCustomers.toLocaleString()}</div>
                  <div style={{ color: mutedColor, fontSize: 12 }}>ลูกค้า</div>
                </Card>
              </Col>
              <Col span={8}>
                <Card 
                  size="small" 
                  style={{ 
                    background: darkMode ? '#334155' : '#f3f4f6', 
                    border: 'none',
                    textAlign: 'center' 
                  }}
                >
                  <ShopOutlined style={{ fontSize: 24, color: '#f59e0b', marginBottom: 8 }} />
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: textColor }}>{totalSuppliers.toLocaleString()}</div>
                  <div style={{ color: mutedColor, fontSize: 12 }}>ผู้จำหน่าย</div>
                </Card>
              </Col>
            </Row>

            <Divider style={{ borderColor: darkMode ? '#334155' : '#e5e7eb' }} />

            <div style={{ 
              background: darkMode ? '#334155' : '#f0fdf4', 
              padding: 16, 
              borderRadius: 8,
              border: `1px solid ${darkMode ? '#334155' : '#bbf7d0'}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: mutedColor, fontSize: 12, marginBottom: 4 }}>มูลค่ารวมทั้งหมด</div>
                  <div style={{ fontSize: 28, fontWeight: 'bold', color: '#22c55e' }}>
                    {formatFullNumber(financial.totalStockValue + financial.totalSalesYTD)}
                  </div>
                </div>
                <CheckCircleOutlined style={{ fontSize: 48, color: '#22c55e', opacity: 0.3 }} />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Footer */}
      <div style={{ 
        marginTop: 32, 
        textAlign: 'center', 
        color: mutedColor,
        fontSize: 12,
        padding: '16px 0',
        borderTop: `1px solid ${darkMode ? '#334155' : '#e5e7eb'}`
      }}>
        <div>รายงานนี้สร้างโดยระบบ SVS Business Suite | {companyInfo.COMPANY_NAME_EN || 'Saengvith Science Co., Ltd.'}</div>
        <div>Generated: {new Date().toLocaleString('th-TH')}</div>
      </div>
    </div>
  );
};

export default ExecutiveDashboardPage;
