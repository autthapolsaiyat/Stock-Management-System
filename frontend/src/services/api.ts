import axios from 'axios';

const API_URL = 'https://svs-stock-api.azurewebsites.net';

// Session expired event
export const SESSION_EXPIRED_EVENT = 'session-expired';

export const dispatchSessionExpired = (details?: any) => {
  const event = new CustomEvent(SESSION_EXPIRED_EVENT, { detail: details });
  window.dispatchEvent(event);
};

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Handle 403 SESSION_EXPIRED
    if (error.response?.status === 403 && error.response?.data?.error === 'SESSION_EXPIRED') {
      dispatchSessionExpired(error.response.data);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (username: string, password: string) => api.post('/api/auth/login', { username, password }),
  logout: () => api.post('/api/auth/logout'),
  changePassword: (currentPassword: string, newPassword: string) => 
    api.put('/api/auth/change-password', { currentPassword, newPassword }),
};

// Users API
export const usersApi = {
  getAll: () => api.get('/api/users'),
  getById: (id: number) => api.get(`/api/users/${id}`),
  getRoles: () => api.get('/api/users/roles'),
  create: (data: any) => api.post('/api/users', data),
  update: (id: number, data: any) => api.put(`/api/users/${id}`, data),
  delete: (id: number) => api.delete(`/api/users/${id}`),
  forceLogout: (id: number) => api.post(`/api/users/${id}/force-logout`),
  toggleMultipleSessions: (id: number) => api.put(`/api/users/${id}/toggle-multiple-sessions`),
};

// Products API
export const productsApi = {
  getAll: (categoryId?: number, quotationType?: string) => 
    api.get('/api/products', { params: { categoryId, quotationType } }),
  getById: (id: number) => api.get(`/api/products/${id}`),
  create: (data: any) => api.post('/api/products', data),
  update: (id: number, data: any) => api.put(`/api/products/${id}`, data),
  delete: (id: number) => api.delete(`/api/products/${id}`),
  getCategories: () => api.get('/api/categories'),
  createCategory: (data: any) => api.post('/api/categories', data),
  updateCategory: (id: number, data: any) => api.put(`/api/categories/${id}`, data),
  deleteCategory: (id: number) => api.delete(`/api/categories/${id}`),
  getUnits: () => api.get('/api/products/units'),
  getPriceHistory: () => api.get('/api/products/price-history'),
  getProductPriceHistory: (id: number) => api.get(`/api/products/${id}/price-history`),
};

// Categories API
export const categoriesApi = {
  getAll: () => api.get('/api/categories'),
  getById: (id: number) => api.get(`/api/categories/${id}`),
  create: (data: any) => api.post('/api/categories', data),
  update: (id: number, data: any) => api.put(`/api/categories/${id}`, data),
  delete: (id: number) => api.delete(`/api/categories/${id}`),
};

// Units API
export const unitsApi = {
  getAll: () => api.get('/api/products/units'),
  create: (data: any) => api.post('/api/products/units', data),
  update: (id: number, data: any) => api.put(`/api/products/units/${id}`, data),
  delete: (id: number) => api.delete(`/api/products/units/${id}`),
};

// Customers API
export const customersApi = {
  getAll: (groupId?: number) => api.get('/api/customers', { params: { groupId } }),
  getById: (id: number) => api.get(`/api/customers/${id}`),
  create: (data: any) => api.post('/api/customers', data),
  update: (id: number, data: any) => api.put(`/api/customers/${id}`, data),
  delete: (id: number) => api.delete(`/api/customers/${id}`),
};

// Customer Groups API
export const customerGroupsApi = {
  getAll: () => api.get('/api/customer-groups'),
  getById: (id: number) => api.get(`/api/customer-groups/${id}`),
  create: (data: any) => api.post('/api/customer-groups', data),
  update: (id: number, data: any) => api.put(`/api/customer-groups/${id}`, data),
  delete: (id: number) => api.delete(`/api/customer-groups/${id}`),
};

// Suppliers API
export const suppliersApi = {
  getAll: () => api.get('/api/suppliers'),
  getById: (id: number) => api.get(`/api/suppliers/${id}`),
  create: (data: any) => api.post('/api/suppliers', data),
  update: (id: number, data: any) => api.put(`/api/suppliers/${id}`, data),
  delete: (id: number) => api.delete(`/api/suppliers/${id}`),
};

// Warehouses API
export const warehousesApi = {
  getAll: () => api.get('/api/warehouses'),
  getById: (id: number) => api.get(`/api/warehouses/${id}`),
  create: (data: any) => api.post('/api/warehouses', data),
  update: (id: number, data: any) => api.put(`/api/warehouses/${id}`, data),
  delete: (id: number) => api.delete(`/api/warehouses/${id}`),
};

// Stock API
export const stockApi = {
  getBalance: (params?: { productId?: number; warehouseId?: number }) => 
    api.get('/api/stock/balance', { params }),
  getMovements: (productId: number) => api.get(`/api/stock/movements/${productId}`),
};

// Stock Balance API
export const stockBalanceApi = {
  getAll: (params?: { warehouse_id?: number }) => 
    api.get('/api/stock/balance', { params: { warehouseId: params?.warehouse_id } }),
};

// System Settings API
export const systemSettingsApi = {
  getByCategory: (category: string) => api.get(`/api/system-settings/category/${category}`),
  getAll: (category?: string) => api.get('/api/system-settings', { params: { category } }),
  getByKey: (key: string) => api.get(`/api/system-settings/key/${key}`),
  update: (key: string, value: any) => api.put(`/api/system-settings/key/${key}`, { value }),
  updateBulk: (settings: { key: string; value: any }[]) => api.put('/api/system-settings/bulk', { settings }),
  getPublicBranding: () => api.get('/api/system-settings/public/branding'),
};

// Purchase Orders API
export const purchaseOrdersApi = {
  getAll: () => api.get('/api/purchase-orders'),
  getById: (id: number) => api.get(`/api/purchase-orders/${id}`),
  create: (data: any) => api.post('/api/purchase-orders', data),
  update: (id: number, data: any) => api.put(`/api/purchase-orders/${id}`, data),
  submit: (id: number) => api.post(`/api/purchase-orders/${id}/submit`),
  approve: (id: number) => api.post(`/api/purchase-orders/${id}/approve`),
  cancel: (id: number) => api.post(`/api/purchase-orders/${id}/cancel`),
  createFromQuotation: (quotationId: number, supplierId?: number) => 
    api.post(`/api/purchase-orders/from-quotation/${quotationId}`, { supplierId }),
  getByQuotation: (quotationId: number) => api.get(`/api/purchase-orders/quotation/${quotationId}`),
};

// Goods Receipts API
export const goodsReceiptsApi = {
  getAll: () => api.get('/api/goods-receipts'),
  getById: (id: number) => api.get(`/api/goods-receipts/${id}`),
  create: (data: any) => api.post('/api/goods-receipts', data),
  update: (id: number, data: any) => api.put(`/api/goods-receipts/${id}`, data),
  post: (id: number) => api.post(`/api/goods-receipts/${id}/post`),
  cancel: (id: number) => api.post(`/api/goods-receipts/${id}/cancel`),
  getByQuotation: (quotationId: number) => api.get(`/api/goods-receipts/quotation/${quotationId}`),
  reverse: (id: number, reason: string) => api.post(`/api/goods-receipts/${id}/reverse`, { reason }),
  createFromPO: (poId: number, data?: any) => api.post(`/api/goods-receipts/from-po/${poId}`, data),
};

// Sales Invoices API
export const salesInvoicesApi = {
  getAll: () => api.get('/api/sales-invoices'),
  getById: (id: number) => api.get(`/api/sales-invoices/${id}`),
  create: (data: any) => api.post('/api/sales-invoices', data),
  post: (id: number) => api.post(`/api/sales-invoices/${id}/post`),
  cancel: (id: number) => api.post(`/api/sales-invoices/${id}/cancel`),
  createFromQuotation: (quotationId: number) => api.post(`/api/sales-invoices/from-quotation/${quotationId}`),
  getByQuotation: (quotationId: number) => api.get(`/api/sales-invoices/quotation/${quotationId}`),
  markPaid: (id: number, data: any) => api.post(`/api/sales-invoices/${id}/mark-paid`, data),
};

// Quotations API
export const quotationsApi = {
  getAll: (params?: { status?: string; quotationType?: string; customerGroupId?: number }) => 
    api.get('/api/quotations', { params }),
  getById: (id: number) => api.get(`/api/quotations/${id}`),
  create: (data: any) => api.post('/api/quotations', data),
  update: (id: number, data: any) => api.put(`/api/quotations/${id}`, data),
  submit: (id: number) => api.post(`/api/quotations/${id}/submit`),
  approve: (id: number) => api.post(`/api/quotations/${id}/approve`),
  reject: (id: number, reason: string) => api.post(`/api/quotations/${id}/reject`, { reason }),
  revise: (id: number, data: any) => api.post(`/api/quotations/${id}/revise`, data),
  cancel: (id: number) => api.post(`/api/quotations/${id}/cancel`),
  won: (id: number) => api.post(`/api/quotations/${id}/won`),
  lost: (id: number, reason: string) => api.post(`/api/quotations/${id}/lost`, { reason }),
  delete: (id: number) => api.delete(`/api/quotations/${id}`),
  duplicate: (id: number) => api.post(`/api/quotations/${id}/duplicate`),
  print: (id: number) => api.get(`/api/quotations/${id}/print`),
};

// FIFO API
export const fifoApi = {
  getLayers: (productId?: number, warehouseId?: number) => 
    api.get('/api/fifo/layers', { params: { productId, warehouseId } }),
  getMovements: (productId: number) => api.get(`/api/fifo/movements/${productId}`),
  getCostHistory: (productId: number) => api.get(`/api/fifo/cost-history/${productId}`),
  recalculate: (productId?: number) => api.post('/api/fifo/recalculate', { productId }),
};

// Stock Count API
export const stockCountApi = {
  getAll: () => api.get('/api/stock-counts'),
  getById: (id: number) => api.get(`/api/stock-counts/${id}`),
  create: (data: any) => api.post('/api/stock-counts', data),
  update: (id: number, data: any) => api.put(`/api/stock-counts/${id}`, data),
  post: (id: number) => api.post(`/api/stock-counts/${id}/post`),
  cancel: (id: number) => api.post(`/api/stock-counts/${id}/cancel`),
};

// Stock Adjustment API
export const stockAdjustmentApi = {
  getAll: () => api.get('/api/stock-adjustments'),
  getById: (id: number) => api.get(`/api/stock-adjustments/${id}`),
  create: (data: any) => api.post('/api/stock-adjustments', data),
  post: (id: number) => api.post(`/api/stock-adjustments/${id}/post`),
  cancel: (id: number) => api.post(`/api/stock-adjustments/${id}/cancel`),
};

// Stock Transfer API
export const stockTransferApi = {
  getAll: () => api.get('/api/stock-transfers'),
  getById: (id: number) => api.get(`/api/stock-transfers/${id}`),
  create: (data: any) => api.post('/api/stock-transfers', data),
  post: (id: number) => api.post(`/api/stock-transfers/${id}/post`),
  cancel: (id: number) => api.post(`/api/stock-transfers/${id}/cancel`),
};

// Stock Issue API
export const stockIssueApi = {
  getAll: () => api.get('/api/stock-issues'),
  getById: (id: number) => api.get(`/api/stock-issues/${id}`),
  create: (data: any) => api.post('/api/stock-issues', data),
  post: (id: number) => api.post(`/api/stock-issues/${id}/post`),
  cancel: (id: number) => api.post(`/api/stock-issues/${id}/cancel`),
};

// Audit Log API
export const auditLogApi = {
  getAll: (params?: { module?: string; startDate?: string; endDate?: string; limit?: number }) =>
    api.get('/api/audit-log', { params }),
};

// Chart of Accounts API
export const chartOfAccountsApi = {
  getAll: () => api.get('/api/accounting/chart-of-accounts'),
  getById: (id: number) => api.get(`/api/accounting/chart-of-accounts/${id}`),
  create: (data: any) => api.post('/api/accounting/chart-of-accounts', data),
  update: (id: number, data: any) => api.put(`/api/accounting/chart-of-accounts/${id}`, data),
  delete: (id: number) => api.delete(`/api/accounting/chart-of-accounts/${id}`),
  getTree: () => api.get('/api/accounting/chart-of-accounts/tree'),
};

// Journal Entry API
export const journalEntryApi = {
  getAll: (params?: { startDate?: string; endDate?: string; status?: string }) =>
    api.get('/api/accounting/journal-entries', { params }),
  getById: (id: number) => api.get(`/api/accounting/journal-entries/${id}`),
  create: (data: any) => api.post('/api/accounting/journal-entries', data),
  update: (id: number, data: any) => api.put(`/api/accounting/journal-entries/${id}`, data),
  post: (id: number) => api.post(`/api/accounting/journal-entries/${id}/post`),
  reverse: (id: number) => api.post(`/api/accounting/journal-entries/${id}/reverse`),
  delete: (id: number) => api.delete(`/api/accounting/journal-entries/${id}`),
};

// Bank Account API
export const bankAccountApi = {
  getAll: () => api.get('/api/accounting/bank-accounts'),
  getById: (id: number) => api.get(`/api/accounting/bank-accounts/${id}`),
  create: (data: any) => api.post('/api/accounting/bank-accounts', data),
  update: (id: number, data: any) => api.put(`/api/accounting/bank-accounts/${id}`, data),
  delete: (id: number) => api.delete(`/api/accounting/bank-accounts/${id}`),
  getTransactions: (id: number, params?: { startDate?: string; endDate?: string }) =>
    api.get(`/api/accounting/bank-accounts/${id}/transactions`, { params }),
};

// Payment Receipt API
export const paymentReceiptApi = {
  getAll: (params?: { startDate?: string; endDate?: string; customerId?: number }) =>
    api.get('/api/accounting/payment-receipts', { params }),
  getById: (id: number) => api.get(`/api/accounting/payment-receipts/${id}`),
  create: (data: any) => api.post('/api/accounting/payment-receipts', data),
  post: (id: number) => api.post(`/api/accounting/payment-receipts/${id}/post`),
  cancel: (id: number, reason: string) => api.post(`/api/accounting/payment-receipts/${id}/cancel`, { reason }),
};

// Payment Voucher API
export const paymentVoucherApi = {
  getAll: (params?: { startDate?: string; endDate?: string; supplierId?: number }) =>
    api.get('/api/accounting/payment-vouchers', { params }),
  getById: (id: number) => api.get(`/api/accounting/payment-vouchers/${id}`),
  create: (data: any) => api.post('/api/accounting/payment-vouchers', data),
  post: (id: number) => api.post(`/api/accounting/payment-vouchers/${id}/post`),
  cancel: (id: number, reason: string) => api.post(`/api/accounting/payment-vouchers/${id}/cancel`, { reason }),
};

// AR API
export const arApi = {
  getOutstanding: (params?: { customerId?: number; status?: string }) => 
    api.get('/api/accounting/ar/outstanding', { params }),
  getAging: (asOfDate?: string) => 
    api.get('/api/accounting/ar/aging', { params: { asOfDate } }),
  getSummary: () => api.get('/api/accounting/ar/summary'),
};

// AP API
export const apApi = {
  getOutstanding: (params?: { supplierId?: number; status?: string }) => 
    api.get('/api/accounting/ap/outstanding', { params }),
  getAging: (asOfDate?: string) => 
    api.get('/api/accounting/ap/aging', { params: { asOfDate } }),
  getSummary: () => api.get('/api/accounting/ap/summary'),
};

// AR/AP Dashboard API
export const arApDashboardApi = {
  getSummary: () => api.get('/api/accounting/ar-ap/dashboard'),
};

// Financial Reports API
export const financialReportsApi = {
  getTrialBalance: (startDate: string, endDate: string, showZeroBalance?: boolean) =>
    api.get('/api/accounting/reports/trial-balance', { params: { startDate, endDate, showZeroBalance } }),
  getProfitLoss: (startDate: string, endDate: string) =>
    api.get('/api/accounting/reports/profit-loss', { params: { startDate, endDate } }),
  getBalanceSheet: (asOfDate: string) =>
    api.get('/api/accounting/reports/balance-sheet', { params: { asOfDate } }),
  getGeneralLedger: (accountId: number, startDate: string, endDate: string) =>
    api.get(`/api/accounting/reports/general-ledger/${accountId}`, { params: { startDate, endDate } }),
  getFinancialSummary: (year?: number) =>
    api.get('/api/accounting/reports/financial-summary', { params: { year } }),
};

// General Ledger API
export const generalLedgerApi = {
  getByAccount: (accountId: number, startDate: string, endDate: string) =>
    api.get(`/api/accounting/general-ledger/${accountId}`, { params: { startDate, endDate } }),
};

// Bank Reconciliation API
export const bankReconciliationApi = {
  getItems: (bankAccountId: number, asOfDate: string) =>
    api.get(`/api/accounting/bank-reconciliation/${bankAccountId}`, { params: { asOfDate } }),
  reconcile: (data: any) => api.post('/api/accounting/bank-reconciliation/reconcile', data),
  autoReconcile: (bankAccountId: number, asOfDate: string) =>
    api.post(`/api/accounting/bank-reconciliation/${bankAccountId}/auto-reconcile`, { asOfDate }),
};

// Closing Period API
export const closingPeriodApi = {
  getByYear: (year: number) => api.get('/api/accounting/closing-periods', { params: { year } }),
  initializeYear: (year: number) => api.post('/api/accounting/closing-periods/initialize', { year }),
  checkClosing: (id: number) => api.get(`/api/accounting/closing-periods/${id}/check`),
  close: (id: number) => api.post(`/api/accounting/closing-periods/${id}/close`),
  reopen: (id: number, reason: string) => api.post(`/api/accounting/closing-periods/${id}/reopen`, { reason }),
};

// Tax Invoices API
export const taxInvoicesApi = {
  getAll: (params?: { startDate?: string; endDate?: string; docType?: string }) =>
    api.get('/api/accounting/tax-invoices', { params }),
  getById: (id: number) => api.get(`/api/accounting/tax-invoices/${id}`),
  create: (data: any) => api.post('/api/accounting/tax-invoices', data),
  issue: (id: number) => api.post(`/api/accounting/tax-invoices/${id}/issue`),
  cancel: (id: number, reason: string) => api.post(`/api/accounting/tax-invoices/${id}/cancel`, { reason }),
  delete: (id: number) => api.delete(`/api/accounting/tax-invoices/${id}`),
};

// Withholding Tax API
export const withholdingTaxApi = {
  getAll: (params?: { startDate?: string; endDate?: string; formType?: string }) =>
    api.get('/api/accounting/withholding-tax', { params }),
  getById: (id: number) => api.get(`/api/accounting/withholding-tax/${id}`),
  create: (data: any) => api.post('/api/accounting/withholding-tax', data),
  issue: (id: number) => api.post(`/api/accounting/withholding-tax/${id}/issue`),
  delete: (id: number) => api.delete(`/api/accounting/withholding-tax/${id}`),
};

// VAT Report API
export const vatReportApi = {
  getOutputVat: (year: number, month: number) =>
    api.get('/api/accounting/vat-report/output', { params: { year, month } }),
  getInputVat: (year: number, month: number) =>
    api.get('/api/accounting/vat-report/input', { params: { year, month } }),
  getSummary: (year: number, month: number) =>
    api.get('/api/accounting/vat-report/summary', { params: { year, month } }),
  exportPP30: (year: number, month: number) =>
    api.get('/api/accounting/vat-report/export-pp30', { params: { year, month }, responseType: 'blob' }),
};

// Fixed Assets API
export const fixedAssetsApi = {
  getAll: (params?: { category?: string; status?: string }) =>
    api.get('/api/accounting/fixed-assets', { params }),
  getById: (id: number) => api.get(`/api/accounting/fixed-assets/${id}`),
  create: (data: any) => api.post('/api/accounting/fixed-assets', data),
  update: (id: number, data: any) => api.put(`/api/accounting/fixed-assets/${id}`, data),
  delete: (id: number) => api.delete(`/api/accounting/fixed-assets/${id}`),
  dispose: (id: number, data: { disposalDate: string; disposalAmount: number }) =>
    api.post(`/api/accounting/fixed-assets/${id}/dispose`, data),
  calculateDepreciation: (year: number, month: number) =>
    api.post('/api/accounting/fixed-assets/calculate-depreciation', { year, month }),
  getDepreciationReport: (year: number) =>
    api.get('/api/accounting/fixed-assets/depreciation-report', { params: { year } }),
};

// Cash Flow API
export const cashFlowApi = {
  getStatement: (startDate: string, endDate: string) =>
    api.get('/api/accounting/cash-flow/statement', { params: { startDate, endDate } }),
  getByActivity: (activity: 'operating' | 'investing' | 'financing', startDate: string, endDate: string) =>
    api.get(`/api/accounting/cash-flow/${activity}`, { params: { startDate, endDate } }),
};

// Checkin API
export const checkinApi = {
  clockIn: (data: { latitude?: number; longitude?: number; note?: string }) =>
    api.post('/api/checkin/clock-in', data),
  clockOut: (data: { latitude?: number; longitude?: number; note?: string }) =>
    api.post('/api/checkin/clock-out', data),
  getTodayStatus: () => api.get('/api/checkin/today'),
  getHistory: (limit = 10) => api.get('/api/checkin/history', { params: { limit } }),
  getMonthlySummary: (year?: number, month?: number) =>
    api.get('/api/checkin/monthly-summary', { params: { year, month } }),
  createLeave: (data: { leaveDate: string; leaveType: string; leaveDuration?: string; reason?: string }) =>
    api.post('/api/checkin/leave', data),
  createBulkLeave: (data: { startDate: string; endDate: string; leaveType: string; reason?: string }) =>
    api.post('/api/checkin/leave/bulk', data),
  createBulkCheckin: (data: { startDate: string; endDate: string; note?: string }) =>
    api.post('/api/checkin/bulk', data),
  updateLeave: (id: number, data: any) => api.put(`/api/checkin/leave/${id}`, data),
  deleteLeave: (id: number) => api.delete(`/api/checkin/leave/${id}`),
  getMyLeaves: (year?: number, month?: number) =>
    api.get('/api/checkin/leave', { params: { year, month } }),
  getMonthlyReport: (year: number, month: number) =>
    api.get('/api/checkin/report/monthly', { params: { year, month } }),
  getSettings: () => api.get('/api/checkin/settings'),
  updateSettings: (data: any) => api.put('/api/checkin/settings', data),
  testLineNotify: () => api.post('/api/checkin/settings/test-line'),
  sendDailySummary: () => api.post('/api/checkin/settings/send-daily-summary'),
  getRecordsByDate: (date: string) => api.get('/api/checkin/admin/records', { params: { date } }),
  deleteCheckinRecord: (id: number) => api.delete(`/api/checkin/admin/records/${id}`),
  deleteLeaveRecordAdmin: (id: number) => api.delete(`/api/checkin/admin/leave/${id}`),
};

export default api;
