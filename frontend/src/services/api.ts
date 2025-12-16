import axios from 'axios';

// Hardcode API URL for production
const API_URL = 'https://svs-stock-api.azurewebsites.net';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401
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
  login: (username: string, password: string) =>
    api.post('/api/auth/login', { username, password }),
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
  getCategories: () => api.get('/api/products/categories'),
  createCategory: (data: any) => api.post('/api/products/categories', data),
  updateCategory: (id: number, data: any) => api.put(`/api/products/categories/${id}`, data),
  deleteCategory: (id: number) => api.delete(`/api/products/categories/${id}`),
  getUnits: () => api.get('/api/products/units'),
  createUnit: (data: any) => api.post('/api/products/units', data),
  updateUnit: (id: number, data: any) => api.put(`/api/products/units/${id}`, data),
  deleteUnit: (id: number) => api.delete(`/api/products/units/${id}`),
};

// Customers API
export const customersApi = {
  getAll: () => api.get('/api/customers'),
  getById: (id: number) => api.get(`/api/customers/${id}`),
  create: (data: any) => api.post('/api/customers', data),
  update: (id: number, data: any) => api.put(`/api/customers/${id}`, data),
};

// Suppliers API
export const suppliersApi = {
  getAll: () => api.get('/api/suppliers'),
  getById: (id: number) => api.get(`/api/suppliers/${id}`),
  create: (data: any) => api.post('/api/suppliers', data),
  update: (id: number, data: any) => api.put(`/api/suppliers/${id}`, data),
};

// Warehouses API
export const warehousesApi = {
  getAll: () => api.get('/api/warehouses'),
  getById: (id: number) => api.get(`/api/warehouses/${id}`),
  create: (data: any) => api.post('/api/warehouses', data),
  update: (id: number, data: any) => api.put(`/api/warehouses/${id}`, data),
};

// Quotations API
export const quotationsApi = {
  getAll: (params?: { status?: string; type?: string }) => 
    api.get('/api/quotations', { params }),
  getById: (id: number) => api.get(`/api/quotations/${id}`),
  create: (data: any) => api.post('/api/quotations', data),
  update: (id: number, data: any) => api.put(`/api/quotations/${id}`, data),
  submitForApproval: (id: number) => api.post(`/api/quotations/${id}/submit`),
  approve: (id: number) => api.post(`/api/quotations/${id}/approve`),
  approveMargin: (id: number) => api.post(`/api/quotations/${id}/approve-margin`),
  send: (id: number) => api.post(`/api/quotations/${id}/send`),
  confirm: (id: number) => api.post(`/api/quotations/${id}/confirm`),
  cancel: (id: number, reason?: string) => api.post(`/api/quotations/${id}/cancel`, { reason }),
};

// Temp Products API
export const tempProductsApi = {
  getAll: (params?: { status?: string }) => api.get('/api/temp-products', { params }),
  getById: (id: number) => api.get(`/api/temp-products/${id}`),
  create: (data: any) => api.post('/api/temp-products', data),
  update: (id: number, data: any) => api.put(`/api/temp-products/${id}`, data),
  activate: (id: number, productData: any) => api.post(`/api/temp-products/${id}/activate`, productData),
  cancel: (id: number) => api.post(`/api/temp-products/${id}/cancel`),
};

// System Settings API
export const systemSettingsApi = {
  getAll: (category?: string) => api.get('/api/system-settings', { params: { category } }),
  getByKey: (key: string) => api.get(`/api/system-settings/${key}`),
  update: (key: string, value: any) => api.put(`/api/system-settings/${key}`, { value }),
  updateBulk: (settings: { key: string; value: any }[]) => 
    api.put('/api/system-settings/bulk', { settings }),
};

// Purchase Orders API
export const purchaseOrdersApi = {
  getAll: () => api.get('/api/purchase-orders'),
  getById: (id: number) => api.get(`/api/purchase-orders/${id}`),
  create: (data: any) => api.post('/api/purchase-orders', data),
  createFromQuotation: (quotationId: number, data?: any) => 
    api.post(`/api/purchase-orders/from-quotation/${quotationId}`, data),
  update: (id: number, data: any) => api.put(`/api/purchase-orders/${id}`, data),
  approve: (id: number) => api.post(`/api/purchase-orders/${id}/approve`),
  cancel: (id: number) => api.post(`/api/purchase-orders/${id}/cancel`),
};

// Goods Receipts API
export const goodsReceiptsApi = {
  getAll: () => api.get('/api/goods-receipts'),
  getById: (id: number) => api.get(`/api/goods-receipts/${id}`),
  create: (data: any) => api.post('/api/goods-receipts', data),
  createFromPO: (poId: number, data?: any) => 
    api.post(`/api/goods-receipts/from-po/${poId}`, data),
  update: (id: number, data: any) => api.put(`/api/goods-receipts/${id}`, data),
  post: (id: number) => api.post(`/api/goods-receipts/${id}/post`),
  cancel: (id: number) => api.post(`/api/goods-receipts/${id}/cancel`),
};

// Stock Issues API
export const stockIssuesApi = {
  getAll: () => api.get('/api/stock-issues'),
  getById: (id: number) => api.get(`/api/stock-issues/${id}`),
  create: (data: any) => api.post('/api/stock-issues', data),
  post: (id: number) => api.post(`/api/stock-issues/${id}/post`),
};

// Stock Transfers API
export const stockTransfersApi = {
  getAll: () => api.get('/api/stock-transfers'),
  getById: (id: number) => api.get(`/api/stock-transfers/${id}`),
  create: (data: any) => api.post('/api/stock-transfers', data),
  post: (id: number) => api.post(`/api/stock-transfers/${id}/post`),
};

// Sales Invoices API
export const salesInvoicesApi = {
  getAll: (params?: { status?: string }) => api.get('/api/sales-invoices', { params }),
  getById: (id: number) => api.get(`/api/sales-invoices/${id}`),
  create: (data: any) => api.post('/api/sales-invoices', data),
  createFromQuotation: (quotationId: number, data?: any) => 
    api.post(`/api/sales-invoices/from-quotation/${quotationId}`, data),
  update: (id: number, data: any) => api.put(`/api/sales-invoices/${id}`, data),
  post: (id: number) => api.post(`/api/sales-invoices/${id}/post`),
  cancel: (id: number, reason?: string) => api.post(`/api/sales-invoices/${id}/cancel`, { reason }),
};

// Stock API
export const stockApi = {
  getBalance: (params?: { productId?: number; warehouseId?: number }) =>
    api.get('/api/stock/balance', { params }),
  getFifoLayers: (params?: { productId?: number; warehouseId?: number }) =>
    api.get('/api/stock/fifo-layers', { params }),
};

// Upload API
export const uploadApi = {
  uploadBase64: (image: string, folder: string = 'products') =>
    api.post('/api/upload/base64', { image, folder }),
  uploadFile: (file: File, folder: string = 'uploads') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    return api.post('/api/upload/file', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default api;

// User Settings API
export const userSettingsApi = {
  getAll: () => api.get('/api/user-settings'),
  getSeller: () => api.get('/api/user-settings/seller'),
  updateSeller: (data: any) => api.put('/api/user-settings/seller', data),
  getQuotationDefaults: () => api.get('/api/user-settings/quotation-defaults'),
  updateQuotationDefaults: (data: any) => api.put('/api/user-settings/quotation-defaults', data),
};

