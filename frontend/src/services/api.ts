import axios from 'axios';

const API_URL = 'https://svs-stock-api.azurewebsites.net';

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
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (username: string, password: string) => api.post('/api/auth/login', { username, password }),
};

// Users API
export const usersApi = {
  getAll: () => api.get('/api/users'),
  getById: (id: number) => api.get(`/api/users/${id}`),
  getRoles: () => api.get('/api/users/roles'),
  create: (data: any) => api.post('/api/users', data),
  update: (id: number, data: any) => api.put(`/api/users/${id}`, data),
  delete: (id: number) => api.delete(`/api/users/${id}`),
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
  getUnits: () => api.get('/api/units'),
  // NEW: Price History API
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
  getAll: () => api.get('/api/units'),
  create: (data: any) => api.post('/api/units', data),
};

// Customers API
export const customersApi = {
  getAll: () => api.get('/api/customers'),
  getById: (id: number) => api.get(`/api/customers/${id}`),
  create: (data: any) => api.post('/api/customers', data),
  update: (id: number, data: any) => api.put(`/api/customers/${id}`, data),
  delete: (id: number) => api.delete(`/api/customers/${id}`),
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

// Quotations API
export const quotationsApi = {
  getAll: (params?: any) => api.get('/api/quotations', { params }),
  getById: (id: number) => api.get(`/api/quotations/${id}`),
  create: (data: any) => api.post('/api/quotations', data),
  update: (id: number, data: any) => api.put(`/api/quotations/${id}`, data),
  delete: (id: number) => api.delete(`/api/quotations/${id}`),
  submitForApproval: (id: number) => api.post(`/api/quotations/${id}/submit`),
  approve: (id: number) => api.post(`/api/quotations/${id}/approve`),
  reject: (id: number, reason: string) => api.post(`/api/quotations/${id}/reject`, { reason }),
  void: (id: number, reason: string) => api.post(`/api/quotations/${id}/void`, { reason }),
  revise: (id: number) => api.post(`/api/quotations/${id}/revise`),
  getFlowProgress: (id: number) => api.get(`/api/quotations/${id}/flow-progress`),
};

// Purchase Orders API
export const purchaseOrdersApi = {
  getAll: (params?: any) => api.get('/api/purchase-orders', { params }),
  getById: (id: number) => api.get(`/api/purchase-orders/${id}`),
  create: (data: any) => api.post('/api/purchase-orders', data),
  update: (id: number, data: any) => api.put(`/api/purchase-orders/${id}`, data),
  delete: (id: number) => api.delete(`/api/purchase-orders/${id}`),
  confirm: (id: number) => api.post(`/api/purchase-orders/${id}/confirm`),
  void: (id: number, reason: string) => api.post(`/api/purchase-orders/${id}/void`, { reason }),
  createFromQuotation: (quotationId: number) => api.post(`/api/purchase-orders/from-quotation/${quotationId}`),
};

// Goods Receipts API
export const goodsReceiptsApi = {
  getAll: (params?: any) => api.get('/api/goods-receipts', { params }),
  getById: (id: number) => api.get(`/api/goods-receipts/${id}`),
  create: (data: any) => api.post('/api/goods-receipts', data),
  update: (id: number, data: any) => api.put(`/api/goods-receipts/${id}`, data),
  delete: (id: number) => api.delete(`/api/goods-receipts/${id}`),
  confirm: (id: number) => api.post(`/api/goods-receipts/${id}/confirm`),
  void: (id: number, reason: string) => api.post(`/api/goods-receipts/${id}/void`, { reason }),
  createFromPO: (poId: number) => api.post(`/api/goods-receipts/from-po/${poId}`),
};

// Sales Invoices API
export const salesInvoicesApi = {
  getAll: (params?: any) => api.get('/api/sales-invoices', { params }),
  getById: (id: number) => api.get(`/api/sales-invoices/${id}`),
  create: (data: any) => api.post('/api/sales-invoices', data),
  update: (id: number, data: any) => api.put(`/api/sales-invoices/${id}`, data),
  delete: (id: number) => api.delete(`/api/sales-invoices/${id}`),
  confirm: (id: number) => api.post(`/api/sales-invoices/${id}/confirm`),
  void: (id: number, reason: string) => api.post(`/api/sales-invoices/${id}/void`, { reason }),
  createFromQuotation: (quotationId: number) => api.post(`/api/sales-invoices/from-quotation/${quotationId}`),
  recordPayment: (id: number, data: any) => api.post(`/api/sales-invoices/${id}/payment`, data),
};

// Stock Balance API
export const stockApi = {
  getBalances: (params?: any) => api.get('/api/stock/balances', { params }),
  getProductBalance: (productId: number, warehouseId?: number) => 
    api.get(`/api/stock/product/${productId}`, { params: { warehouseId } }),
  getFifoLayers: (productId: number) => api.get(`/api/stock/fifo/${productId}`),
  getMovements: (productId: number) => api.get(`/api/stock/movements/${productId}`),
};

// Stock Issue API
export const stockIssuesApi = {
  getAll: (params?: any) => api.get('/api/stock-issues', { params }),
  getById: (id: number) => api.get(`/api/stock-issues/${id}`),
  create: (data: any) => api.post('/api/stock-issues', data),
  update: (id: number, data: any) => api.put(`/api/stock-issues/${id}`, data),
  delete: (id: number) => api.delete(`/api/stock-issues/${id}`),
  confirm: (id: number) => api.post(`/api/stock-issues/${id}/confirm`),
  void: (id: number, reason: string) => api.post(`/api/stock-issues/${id}/void`, { reason }),
};

// Stock Transfer API
export const stockTransfersApi = {
  getAll: (params?: any) => api.get('/api/stock-transfers', { params }),
  getById: (id: number) => api.get(`/api/stock-transfers/${id}`),
  create: (data: any) => api.post('/api/stock-transfers', data),
  update: (id: number, data: any) => api.put(`/api/stock-transfers/${id}`, data),
  delete: (id: number) => api.delete(`/api/stock-transfers/${id}`),
  confirm: (id: number) => api.post(`/api/stock-transfers/${id}/confirm`),
};

// System Settings API
export const systemSettingsApi = {
  getAll: (category?: string) => api.get('/api/system-settings', { params: { category } }),
  update: (key: string, value: string) => api.put(`/api/system-settings/${key}`, { value }),
  bulkUpdate: (settings: Array<{ key: string; value: string }>) => 
    api.post('/api/system-settings/bulk', { settings }),
};

// Upload API
export const uploadApi = {
  uploadBase64: (base64: string, folder?: string) => 
    api.post('/api/upload/base64', { base64, folder }),
  uploadFile: (file: File, folder?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) formData.append('folder', folder);
    return api.post('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Temp Products API
export const tempProductsApi = {
  getAll: () => api.get('/api/temp-products'),
  getById: (id: number) => api.get(`/api/temp-products/${id}`),
  create: (data: any) => api.post('/api/temp-products', data),
  update: (id: number, data: any) => api.put(`/api/temp-products/${id}`, data),
  delete: (id: number) => api.delete(`/api/temp-products/${id}`),
  convertToMaster: (id: number, data: any) => api.post(`/api/temp-products/${id}/convert`, data),
};

export default api;
