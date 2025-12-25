import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Grid, Card, CardContent, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, TextField, Tabs, Tab,
  CircularProgress
} from '@mui/material';
import {
  TrendingUp as ARIcon, TrendingDown as APIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { arApi, apApi, arApDashboardApi } from '../../services/api';

interface AgingData {
  asOfDate: string;
  details: AgingDetail[];
  totals: AgingTotals;
}

interface AgingDetail {
  partnerId: number;
  partnerCode: string;
  partnerName: string;
  CURRENT: number;
  '1-30': number;
  '31-60': number;
  '61-90': number;
  '90+': number;
  total: number;
}

interface AgingTotals {
  CURRENT: number;
  '1-30': number;
  '31-60': number;
  '61-90': number;
  '90+': number;
  total: number;
}

interface DashboardSummary {
  ar: { totalOutstanding: number; overdueAmount: number; overdueCount: number };
  ap: { totalOutstanding: number; overdueAmount: number; overdueCount: number };
}

const ARAPAgingPage: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [asOfDate, setAsOfDate] = useState(new Date().toISOString().split('T')[0]);
  const [arData, setARData] = useState<AgingData | null>(null);
  const [apData, setAPData] = useState<AgingData | null>(null);
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    loadData();
  }, [asOfDate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [arRes, apRes, dashRes] = await Promise.all([
        arApi.getAging(asOfDate),
        apApi.getAging(asOfDate),
        arApDashboardApi.getSummary(),
      ]);
      setARData(arRes.data);
      setAPData(apRes.data);
      setDashboard(dashRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const renderAgingTable = (data: AgingData | null, type: 'AR' | 'AP') => {
    if (!data) return null;

    return (
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.100' }}>
              <TableCell>รหัส</TableCell>
              <TableCell>ชื่อ{type === 'AR' ? 'ลูกค้า' : 'ผู้จำหน่าย'}</TableCell>
              <TableCell align="right">ยังไม่ครบกำหนด</TableCell>
              <TableCell align="right">1-30 วัน</TableCell>
              <TableCell align="right">31-60 วัน</TableCell>
              <TableCell align="right">61-90 วัน</TableCell>
              <TableCell align="right" sx={{ color: 'error.main' }}>90+ วัน</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>รวม</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.details.map((row, index) => (
              <TableRow key={index} hover>
                <TableCell>{row.partnerCode}</TableCell>
                <TableCell>{row.partnerName}</TableCell>
                <TableCell align="right">{row.CURRENT > 0 ? formatCurrency(row.CURRENT) : '-'}</TableCell>
                <TableCell align="right">{row['1-30'] > 0 ? formatCurrency(row['1-30']) : '-'}</TableCell>
                <TableCell align="right">{row['31-60'] > 0 ? formatCurrency(row['31-60']) : '-'}</TableCell>
                <TableCell align="right">{row['61-90'] > 0 ? formatCurrency(row['61-90']) : '-'}</TableCell>
                <TableCell align="right" sx={{ color: row['90+'] > 0 ? 'error.main' : 'inherit' }}>
                  {row['90+'] > 0 ? formatCurrency(row['90+']) : '-'}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                  {formatCurrency(row.total)}
                </TableCell>
              </TableRow>
            ))}
            {data.details.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">ไม่มียอดค้างชำระ</Typography>
                </TableCell>
              </TableRow>
            )}
            <TableRow sx={{ bgcolor: 'primary.50' }}>
              <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>รวมทั้งหมด</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>{formatCurrency(data.totals.CURRENT)}</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>{formatCurrency(data.totals['1-30'])}</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>{formatCurrency(data.totals['31-60'])}</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>{formatCurrency(data.totals['61-90'])}</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', color: 'error.main' }}>{formatCurrency(data.totals['90+'])}</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{formatCurrency(data.totals.total)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        รายงานอายุลูกหนี้/เจ้าหนี้ (AR/AP Aging Report)
      </Typography>

      {/* Dashboard Summary */}
      {dashboard && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'success.50' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <ARIcon color="success" />
                  <Typography variant="subtitle2" color="text.secondary">ลูกหนี้ค้างชำระ</Typography>
                </Box>
                <Typography variant="h5" fontWeight="bold" color="success.main">
                  ฿{formatCurrency(dashboard.ar.totalOutstanding)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'warning.50' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <WarningIcon color="warning" />
                  <Typography variant="subtitle2" color="text.secondary">ลูกหนี้เกินกำหนด</Typography>
                </Box>
                <Typography variant="h5" fontWeight="bold" color="warning.main">
                  ฿{formatCurrency(dashboard.ar.overdueAmount)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {dashboard.ar.overdueCount} รายการ
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'error.50' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <APIcon color="error" />
                  <Typography variant="subtitle2" color="text.secondary">เจ้าหนี้ค้างชำระ</Typography>
                </Box>
                <Typography variant="h5" fontWeight="bold" color="error.main">
                  ฿{formatCurrency(dashboard.ap.totalOutstanding)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'info.50' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <WarningIcon color="info" />
                  <Typography variant="subtitle2" color="text.secondary">เจ้าหนี้เกินกำหนด</Typography>
                </Box>
                <Typography variant="h5" fontWeight="bold" color="info.main">
                  ฿{formatCurrency(dashboard.ap.overdueAmount)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {dashboard.ap.overdueCount} รายการ
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Filter */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          label="ณ วันที่"
          type="date"
          value={asOfDate}
          onChange={(e) => setAsOfDate(e.target.value)}
          size="small"
          InputLabelProps={{ shrink: true }}
        />
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="ลูกหนี้ (AR)" icon={<ARIcon />} iconPosition="start" />
          <Tab label="เจ้าหนี้ (AP)" icon={<APIcon />} iconPosition="start" />
        </Tabs>
      </Paper>

      {/* Content */}
      <Paper elevation={2}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {tab === 0 && renderAgingTable(arData, 'AR')}
            {tab === 1 && renderAgingTable(apData, 'AP')}
          </>
        )}
      </Paper>
    </Box>
  );
};

export default ARAPAgingPage;
