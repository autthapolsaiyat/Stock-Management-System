import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Select, MenuItem, FormControl,
  InputLabel, Chip, Alert, Snackbar, Collapse, CircularProgress
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon,
  Refresh as RefreshIcon, AccountBalance as AccountIcon
} from '@mui/icons-material';
import { chartOfAccountsApi } from '../../services/api';

// Types
interface ChartOfAccount {
  id: number;
  code: string;
  name: string;
  nameEn?: string;
  accountType: string;
  accountGroup: string;
  balanceType: string;
  level: number;
  parentId?: number;
  isActive: boolean;
  isSystem: boolean;
  isControl: boolean;
  controlType?: string;
  children?: ChartOfAccount[];
}

const ACCOUNT_TYPES = [
  { value: 'ASSET', label: 'สินทรัพย์', color: '#4caf50' },
  { value: 'LIABILITY', label: 'หนี้สิน', color: '#f44336' },
  { value: 'EQUITY', label: 'ส่วนของผู้ถือหุ้น', color: '#9c27b0' },
  { value: 'REVENUE', label: 'รายได้', color: '#2196f3' },
  { value: 'EXPENSE', label: 'ค่าใช้จ่าย', color: '#ff9800' },
];

const ACCOUNT_GROUPS = {
  ASSET: [
    { value: 'CURRENT_ASSET', label: 'สินทรัพย์หมุนเวียน' },
    { value: 'FIXED_ASSET', label: 'สินทรัพย์ถาวร' },
    { value: 'OTHER_ASSET', label: 'สินทรัพย์อื่น' },
  ],
  LIABILITY: [
    { value: 'CURRENT_LIABILITY', label: 'หนี้สินหมุนเวียน' },
    { value: 'LONG_TERM_LIABILITY', label: 'หนี้สินระยะยาว' },
  ],
  EQUITY: [
    { value: 'SHARE_CAPITAL', label: 'ทุนเรือนหุ้น' },
    { value: 'RETAINED_EARNINGS', label: 'กำไรสะสม' },
  ],
  REVENUE: [
    { value: 'SALES_REVENUE', label: 'รายได้จากการขาย' },
    { value: 'OTHER_REVENUE', label: 'รายได้อื่น' },
  ],
  EXPENSE: [
    { value: 'COST_OF_GOODS', label: 'ต้นทุนขาย' },
    { value: 'OPERATING_EXPENSE', label: 'ค่าใช้จ่ายดำเนินงาน' },
    { value: 'OTHER_EXPENSE', label: 'ค่าใช้จ่ายอื่น' },
  ],
};

const ChartOfAccountsPage: React.FC = () => {
  const [accounts, setAccounts] = useState<ChartOfAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAccount, setEditingAccount] = useState<ChartOfAccount | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    nameEn: '',
    accountType: 'ASSET',
    accountGroup: 'CURRENT_ASSET',
    balanceType: 'DEBIT',
    description: '',
    parentId: null as number | null,
  });

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const response = await chartOfAccountsApi.getTree();
      setAccounts(response.data);
      // Expand first level by default
      const firstLevelIds = new Set(response.data.map((a: ChartOfAccount) => a.id));
      setExpandedRows(firstLevelIds);
    } catch (error) {
      console.error('Error loading accounts:', error);
      setSnackbar({ open: true, message: 'เกิดข้อผิดพลาดในการโหลดข้อมูล', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleOpenDialog = (account?: ChartOfAccount) => {
    if (account) {
      setEditingAccount(account);
      setFormData({
        code: account.code,
        name: account.name,
        nameEn: account.nameEn || '',
        accountType: account.accountType,
        accountGroup: account.accountGroup,
        balanceType: account.balanceType,
        description: '',
        parentId: account.parentId || null,
      });
    } else {
      setEditingAccount(null);
      setFormData({
        code: '',
        name: '',
        nameEn: '',
        accountType: 'ASSET',
        accountGroup: 'CURRENT_ASSET',
        balanceType: 'DEBIT',
        description: '',
        parentId: null,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingAccount(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingAccount) {
        await chartOfAccountsApi.update(editingAccount.id, formData);
        setSnackbar({ open: true, message: 'อัพเดทบัญชีสำเร็จ', severity: 'success' });
      } else {
        await chartOfAccountsApi.create(formData);
        setSnackbar({ open: true, message: 'สร้างบัญชีสำเร็จ', severity: 'success' });
      }
      handleCloseDialog();
      loadAccounts();
    } catch (error: any) {
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.message || 'เกิดข้อผิดพลาด', 
        severity: 'error' 
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('ต้องการลบบัญชีนี้?')) return;
    try {
      await chartOfAccountsApi.delete(id);
      setSnackbar({ open: true, message: 'ลบบัญชีสำเร็จ', severity: 'success' });
      loadAccounts();
    } catch (error: any) {
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.message || 'ไม่สามารถลบได้', 
        severity: 'error' 
      });
    }
  };

  const handleInitialize = async () => {
    if (!window.confirm('ต้องการสร้างผังบัญชีมาตรฐาน? (จะไม่ทับบัญชีที่มีอยู่แล้ว)')) return;
    try {
      await chartOfAccountsApi.initialize();
      setSnackbar({ open: true, message: 'สร้างผังบัญชีมาตรฐานสำเร็จ', severity: 'success' });
      loadAccounts();
    } catch (error) {
      setSnackbar({ open: true, message: 'เกิดข้อผิดพลาด', severity: 'error' });
    }
  };

  const renderAccountRow = (account: ChartOfAccount, depth: number = 0) => {
    const hasChildren = account.children && account.children.length > 0;
    const isExpanded = expandedRows.has(account.id);
    const typeInfo = ACCOUNT_TYPES.find(t => t.value === account.accountType);

    return (
      <React.Fragment key={account.id}>
        <TableRow hover sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
          <TableCell sx={{ pl: depth * 3 + 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {hasChildren ? (
                <IconButton size="small" onClick={() => toggleExpand(account.id)}>
                  {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              ) : (
                <Box sx={{ width: 28 }} />
              )}
              <Typography fontWeight={depth === 0 ? 'bold' : 'normal'}>
                {account.code}
              </Typography>
            </Box>
          </TableCell>
          <TableCell>
            <Typography fontWeight={depth === 0 ? 'bold' : 'normal'}>
              {account.name}
            </Typography>
            {account.nameEn && (
              <Typography variant="caption" color="text.secondary">
                {account.nameEn}
              </Typography>
            )}
          </TableCell>
          <TableCell>
            <Chip 
              label={typeInfo?.label} 
              size="small" 
              sx={{ bgcolor: typeInfo?.color, color: 'white' }}
            />
          </TableCell>
          <TableCell>
            <Chip 
              label={account.balanceType === 'DEBIT' ? 'เดบิต' : 'เครดิต'} 
              size="small" 
              variant="outlined"
            />
          </TableCell>
          <TableCell>
            {account.isControl && (
              <Chip label={account.controlType} size="small" color="info" />
            )}
          </TableCell>
          <TableCell>
            <Chip 
              label={account.isActive ? 'ใช้งาน' : 'ปิดใช้งาน'} 
              size="small" 
              color={account.isActive ? 'success' : 'default'}
            />
          </TableCell>
          <TableCell>
            <IconButton 
              size="small" 
              onClick={() => handleOpenDialog(account)}
              disabled={account.isSystem}
            >
              <EditIcon />
            </IconButton>
            <IconButton 
              size="small" 
              onClick={() => handleDelete(account.id)}
              disabled={account.isSystem}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </TableCell>
        </TableRow>
        {hasChildren && isExpanded && account.children!.map(child => 
          renderAccountRow(child, depth + 1)
        )}
      </React.Fragment>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AccountIcon sx={{ fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h5" fontWeight="bold">ผังบัญชี (Chart of Accounts)</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />}
            onClick={loadAccounts}
          >
            รีเฟรช
          </Button>
          <Button 
            variant="outlined" 
            onClick={handleInitialize}
          >
            สร้างผังมาตรฐาน
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            เพิ่มบัญชี
          </Button>
        </Box>
      </Box>

      <Paper elevation={2}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.100' }}>
                  <TableCell width="15%">รหัสบัญชี</TableCell>
                  <TableCell width="30%">ชื่อบัญชี</TableCell>
                  <TableCell width="12%">ประเภท</TableCell>
                  <TableCell width="10%">ยอดคงเหลือ</TableCell>
                  <TableCell width="10%">บัญชีคุม</TableCell>
                  <TableCell width="10%">สถานะ</TableCell>
                  <TableCell width="13%">จัดการ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {accounts.map(account => renderAccountRow(account))}
                {accounts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        ยังไม่มีผังบัญชี กดปุ่ม "สร้างผังมาตรฐาน" เพื่อเริ่มต้น
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingAccount ? 'แก้ไขบัญชี' : 'เพิ่มบัญชีใหม่'}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="รหัสบัญชี"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              disabled={!!editingAccount}
              required
              size="small"
            />
            <TextField
              label="ชื่อบัญชี (ไทย)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              size="small"
            />
            <TextField
              label="ชื่อบัญชี (อังกฤษ)"
              value={formData.nameEn}
              onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
              size="small"
            />
            <FormControl size="small">
              <InputLabel>ประเภทบัญชี</InputLabel>
              <Select
                value={formData.accountType}
                label="ประเภทบัญชี"
                onChange={(e) => {
                  const type = e.target.value;
                  const groups = ACCOUNT_GROUPS[type as keyof typeof ACCOUNT_GROUPS] || [];
                  setFormData({ 
                    ...formData, 
                    accountType: type,
                    accountGroup: groups[0]?.value || '',
                    balanceType: ['ASSET', 'EXPENSE'].includes(type) ? 'DEBIT' : 'CREDIT'
                  });
                }}
              >
                {ACCOUNT_TYPES.map(t => (
                  <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small">
              <InputLabel>กลุ่มบัญชี</InputLabel>
              <Select
                value={formData.accountGroup}
                label="กลุ่มบัญชี"
                onChange={(e) => setFormData({ ...formData, accountGroup: e.target.value })}
              >
                {(ACCOUNT_GROUPS[formData.accountType as keyof typeof ACCOUNT_GROUPS] || []).map(g => (
                  <MenuItem key={g.value} value={g.value}>{g.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small">
              <InputLabel>ยอดคงเหลือปกติ</InputLabel>
              <Select
                value={formData.balanceType}
                label="ยอดคงเหลือปกติ"
                onChange={(e) => setFormData({ ...formData, balanceType: e.target.value })}
              >
                <MenuItem value="DEBIT">เดบิต</MenuItem>
                <MenuItem value="CREDIT">เครดิต</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="คำอธิบาย"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={2}
              size="small"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>ยกเลิก</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editingAccount ? 'บันทึก' : 'สร้าง'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ChartOfAccountsPage;
