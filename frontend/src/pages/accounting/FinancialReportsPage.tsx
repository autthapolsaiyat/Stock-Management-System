import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Grid, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, Tabs, Tab,
  CircularProgress, Card, CardContent, Button, Divider
} from '@mui/material';
import {
  Assessment as ReportIcon, AccountBalance as BalanceIcon,
  TrendingUp as ProfitIcon, Print as PrintIcon
} from '@mui/icons-material';
import { financialReportsApi } from '../../services/api';

interface TrialBalanceRow {
  accountId: number;
  accountCode: string;
  accountName: string;
  accountType: string;
  debit: number;
  credit: number;
  debitBalance: number;
  creditBalance: number;
}

interface ProfitLossData {
  startDate: string;
  endDate: string;
  revenue: { details: any[]; total: number };
  expense: { details: any[]; total: number };
  netProfit: number;
  netProfitPercent: number;
}

interface BalanceSheetData {
  asOfDate: string;
  assets: { details: any[]; total: number };
  liabilities: { details: any[]; total: number };
  equity: { details: any[]; retainedEarnings: number; total: number };
  totalLiabilitiesAndEquity: number;
  isBalanced: boolean;
}

const FinancialReportsPage: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    asOfDate: new Date().toISOString().split('T')[0],
  });
  
  const [trialBalance, setTrialBalance] = useState<{ details: TrialBalanceRow[]; totals: any } | null>(null);
  const [profitLoss, setProfitLoss] = useState<ProfitLossData | null>(null);
  const [balanceSheet, setBalanceSheet] = useState<BalanceSheetData | null>(null);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const loadTrialBalance = async () => {
    try {
      setLoading(true);
      const res = await financialReportsApi.getTrialBalance(filters.startDate, filters.endDate);
      setTrialBalance(res.data);
    } catch (error) {
      console.error('Error loading trial balance:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProfitLoss = async () => {
    try {
      setLoading(true);
      const res = await financialReportsApi.getProfitLoss(filters.startDate, filters.endDate);
      setProfitLoss(res.data);
    } catch (error) {
      console.error('Error loading P&L:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBalanceSheet = async () => {
    try {
      setLoading(true);
      const res = await financialReportsApi.getBalanceSheet(filters.asOfDate);
      setBalanceSheet(res.data);
    } catch (error) {
      console.error('Error loading balance sheet:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab === 0) loadTrialBalance();
    else if (tab === 1) loadProfitLoss();
    else if (tab === 2) loadBalanceSheet();
  }, [tab]);

  const handleLoadReport = () => {
    if (tab === 0) loadTrialBalance();
    else if (tab === 1) loadProfitLoss();
    else if (tab === 2) loadBalanceSheet();
  };

  // Trial Balance Component
  const renderTrialBalance = () => (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.100' }}>
            <TableCell>รหัสบัญชี</TableCell>
            <TableCell>ชื่อบัญชี</TableCell>
            <TableCell align="right">เดบิต</TableCell>
            <TableCell align="right">เครดิต</TableCell>
            <TableCell align="right">ยอดเดบิต</TableCell>
            <TableCell align="right">ยอดเครดิต</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {trialBalance?.details.map((row) => (
            <TableRow key={row.accountId} hover>
              <TableCell>{row.accountCode}</TableCell>
              <TableCell>{row.accountName}</TableCell>
              <TableCell align="right">{row.debit > 0 ? formatCurrency(row.debit) : '-'}</TableCell>
              <TableCell align="right">{row.credit > 0 ? formatCurrency(row.credit) : '-'}</TableCell>
              <TableCell align="right">{row.debitBalance > 0 ? formatCurrency(row.debitBalance) : '-'}</TableCell>
              <TableCell align="right">{row.creditBalance > 0 ? formatCurrency(row.creditBalance) : '-'}</TableCell>
            </TableRow>
          ))}
          {trialBalance?.details.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                <Typography color="text.secondary">ไม่มีรายการ</Typography>
              </TableCell>
            </TableRow>
          )}
          <TableRow sx={{ bgcolor: 'primary.50' }}>
            <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>รวม</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>-</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>-</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>{formatCurrency(trialBalance?.totals?.totalDebit || 0)}</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>{formatCurrency(trialBalance?.totals?.totalCredit || 0)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );

  // Profit & Loss Component
  const renderProfitLoss = () => (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ bgcolor: 'success.100', p: 1 }}>
        รายได้
      </Typography>
      <Table size="small" sx={{ mb: 2 }}>
        <TableBody>
          {profitLoss?.revenue.details.map((item) => (
            <TableRow key={item.accountId}>
              <TableCell sx={{ pl: 4 }}>{item.accountCode} - {item.accountName}</TableCell>
              <TableCell align="right">{formatCurrency(item.balance)}</TableCell>
            </TableRow>
          ))}
          <TableRow sx={{ bgcolor: 'success.50' }}>
            <TableCell sx={{ fontWeight: 'bold' }}>รวมรายได้</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>
              {formatCurrency(profitLoss?.revenue.total || 0)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Typography variant="h6" gutterBottom sx={{ bgcolor: 'error.100', p: 1 }}>
        ค่าใช้จ่าย
      </Typography>
      <Table size="small" sx={{ mb: 2 }}>
        <TableBody>
          {profitLoss?.expense.details.map((item) => (
            <TableRow key={item.accountId}>
              <TableCell sx={{ pl: 4 }}>{item.accountCode} - {item.accountName}</TableCell>
              <TableCell align="right">{formatCurrency(item.balance)}</TableCell>
            </TableRow>
          ))}
          <TableRow sx={{ bgcolor: 'error.50' }}>
            <TableCell sx={{ fontWeight: 'bold' }}>รวมค่าใช้จ่าย</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>
              {formatCurrency(profitLoss?.expense.total || 0)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Divider sx={{ my: 2 }} />

      <Card sx={{ bgcolor: (profitLoss?.netProfit || 0) >= 0 ? 'success.100' : 'error.100' }}>
        <CardContent>
          <Grid container>
            <Grid item xs={6}>
              <Typography variant="h6">กำไร(ขาดทุน)สุทธิ</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h5" align="right" fontWeight="bold">
                {formatCurrency(profitLoss?.netProfit || 0)}
              </Typography>
              <Typography variant="body2" align="right" color="text.secondary">
                ({(profitLoss?.netProfitPercent || 0).toFixed(2)}% ของรายได้)
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );

  // Balance Sheet Component
  const renderBalanceSheet = () => (
    <Grid container spacing={3}>
      {/* Assets */}
      <Grid item xs={12} md={6}>
        <Typography variant="h6" sx={{ bgcolor: 'primary.100', p: 1 }}>สินทรัพย์</Typography>
        <Table size="small">
          <TableBody>
            {balanceSheet?.assets.details.map((item) => (
              <TableRow key={item.accountId}>
                <TableCell sx={{ pl: 2 }}>{item.accountCode} - {item.accountName}</TableCell>
                <TableCell align="right">{formatCurrency(item.balance)}</TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ bgcolor: 'primary.50' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>รวมสินทรัพย์</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                {formatCurrency(balanceSheet?.assets.total || 0)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Grid>

      {/* Liabilities & Equity */}
      <Grid item xs={12} md={6}>
        <Typography variant="h6" sx={{ bgcolor: 'error.100', p: 1 }}>หนี้สิน</Typography>
        <Table size="small">
          <TableBody>
            {balanceSheet?.liabilities.details.map((item) => (
              <TableRow key={item.accountId}>
                <TableCell sx={{ pl: 2 }}>{item.accountCode} - {item.accountName}</TableCell>
                <TableCell align="right">{formatCurrency(Math.abs(item.balance))}</TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ bgcolor: 'error.50' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>รวมหนี้สิน</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                {formatCurrency(balanceSheet?.liabilities.total || 0)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Typography variant="h6" sx={{ bgcolor: 'secondary.100', p: 1, mt: 2 }}>ส่วนของผู้ถือหุ้น</Typography>
        <Table size="small">
          <TableBody>
            {balanceSheet?.equity.details.map((item) => (
              <TableRow key={item.accountId}>
                <TableCell sx={{ pl: 2 }}>{item.accountCode} - {item.accountName}</TableCell>
                <TableCell align="right">{formatCurrency(Math.abs(item.balance))}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell sx={{ pl: 2 }}>กำไรสะสมปีปัจจุบัน</TableCell>
              <TableCell align="right">{formatCurrency(balanceSheet?.equity.retainedEarnings || 0)}</TableCell>
            </TableRow>
            <TableRow sx={{ bgcolor: 'secondary.50' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>รวมส่วนของผู้ถือหุ้น</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                {formatCurrency(balanceSheet?.equity.total || 0)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Card sx={{ mt: 2, bgcolor: balanceSheet?.isBalanced ? 'success.100' : 'error.100' }}>
          <CardContent sx={{ py: 1 }}>
            <Grid container>
              <Grid item xs={6}>
                <Typography fontWeight="bold">รวมหนี้สินและส่วนของผู้ถือหุ้น</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" align="right" fontWeight="bold">
                  {formatCurrency(balanceSheet?.totalLiabilitiesAndEquity || 0)}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ReportIcon sx={{ fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h5" fontWeight="bold">รายงานการเงิน</Typography>
        </Box>
        <Button variant="outlined" startIcon={<PrintIcon />} onClick={() => window.print()}>
          พิมพ์
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          {tab !== 2 ? (
            <>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="วันที่เริ่มต้น"
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="วันที่สิ้นสุด"
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </>
          ) : (
            <Grid item xs={12} sm={3}>
              <TextField
                label="ณ วันที่"
                type="date"
                value={filters.asOfDate}
                onChange={(e) => setFilters({ ...filters, asOfDate: e.target.value })}
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          )}
          <Grid item>
            <Button variant="contained" onClick={handleLoadReport}>
              แสดงรายงาน
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="งบทดลอง" icon={<ReportIcon />} iconPosition="start" />
          <Tab label="งบกำไรขาดทุน" icon={<ProfitIcon />} iconPosition="start" />
          <Tab label="งบดุล" icon={<BalanceIcon />} iconPosition="start" />
        </Tabs>
      </Paper>

      {/* Content */}
      <Paper elevation={2} sx={{ p: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {tab === 0 && renderTrialBalance()}
            {tab === 1 && renderProfitLoss()}
            {tab === 2 && renderBalanceSheet()}
          </>
        )}
      </Paper>
    </Box>
  );
};

export default FinancialReportsPage;
