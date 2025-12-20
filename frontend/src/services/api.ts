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

// Stock API
export const stockApi = {
  getBalance: (params?: { productId?: number; warehouseId?: number }) => 
    api.get('/api/stock/balance', { params }),
  getMovements: (productId: number) => api.get(`/api/stock/movements/${productId}`),
};

// System Settings API
export const systemSettingsApi = {
  getByCategory: (category: string) => api.get(`/api/system-settings/category/${category}`),
  getAll: (category?: string) => api.get('/api/system-settings', { params: { category } }),
  getByKey: (key: string) => api.get(`/api/system-settings/key/${key}`),
  update: (key: string, value: any) => api.put(`/api/system-settings/key/${key}`, { value }),
  updateBulk: (settings: { key: string; value: any }[]) => api.put('/api/system-settings/bulk', { settings }),
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
  createFromQuotation: (quotationId: number) => api.post(`/api/purchase-orders/from-quotation/${quotationId}`),
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
  markPaid: (id: number, data: any) => api.post("/api/sales-invoices/" + id + "/mark-paid", data),
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
  approveMargin: (id: number) => api.post(`/api/quotations/${id}/approve-margin`),
  send: (id: number) => api.post(`/api/quotations/${id}/send`),
  confirm: (id: number) => api.post(`/api/quotations/${id}/confirm`),
  cancel: (id: number) => api.post(`/api/quotations/${id}/cancel`),
};

// User Settings API
export const userSettingsApi = {
  getAll: () => api.get('/api/user-settings'),
  getSeller: () => api.get('/api/user-settings/seller'),
  updateSeller: (data: any) => api.put('/api/user-settings/seller', data),
  getQuotationDefaults: () => api.get('/api/user-settings/quotation-defaults'),
  getEmployees: () => api.get("/api/user-settings/employees"),
  getEmployeeById: (id: number) => api.get(`/api/user-settings/employee/${id}`),
  updateQuotationDefaults: (data: any) => api.put('/api/user-settings/quotation-defaults', data),
};

// Upload API
export const uploadApi = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadBase64: (base64: string, folder: string) => 
    api.post('/api/upload/base64', { base64, folder }),
};

export default api;
