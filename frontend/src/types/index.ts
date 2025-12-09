// Auth Types
export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  isActive: boolean;
  roles: Role[];
}

export interface Role {
  id: number;
  name: string;
  code: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

// Product Types
export interface Product {
  id: number;
  code: string;
  name: string;
  description?: string;
  categoryId?: number;
  category?: ProductCategory;
  unitId?: number;
  unit?: Unit;
  barcode?: string;
  imageUrl?: string;
  sellingPrice: number;
  standardCost: number;
  minStock: number;
  maxStock: number;
  isActive: boolean;
}

export interface ProductCategory {
  id: number;
  code: string;
  name: string;
  description?: string;
  parentId?: number;
  isActive: boolean;
}

export interface Unit {
  id: number;
  name: string;
  abbreviation?: string;
  isActive: boolean;
}

// Customer Types
export interface Customer {
  id: number;
  code: string;
  name: string;
  taxId?: string;
  address?: string;
  phone?: string;
  email?: string;
  creditLimit?: number;
  creditTermDays?: number;
  isActive: boolean;
}

// Supplier Types
export interface Supplier {
  id: number;
  code: string;
  name: string;
  taxId?: string;
  address?: string;
  phone?: string;
  email?: string;
  creditTermDays?: number;
  isActive: boolean;
}

// Warehouse Types
export interface Warehouse {
  id: number;
  code: string;
  name: string;
  address?: string;
  isActive: boolean;
}

// Document Types
export type DocumentStatus = 'draft' | 'confirmed' | 'approved' | 'posted' | 'cancelled';

export interface Quotation {
  id: number;
  docNo: string;
  docDate: string;
  customerId: number;
  customer?: Customer;
  status: DocumentStatus;
  subtotal: number;
  discountAmount: number;
  vatAmount: number;
  totalAmount: number;
  validUntil?: string;
  remark?: string;
  items: QuotationItem[];
  createdAt: string;
}

export interface QuotationItem {
  id: number;
  lineNo: number;
  productId: number;
  product?: Product;
  qty: number;
  unitPrice: number;
  discountAmount: number;
  lineTotal: number;
}

export interface PurchaseOrder {
  id: number;
  docNo: string;
  docDate: string;
  supplierId: number;
  supplier?: Supplier;
  status: DocumentStatus;
  subtotal: number;
  discountAmount: number;
  vatAmount: number;
  totalAmount: number;
  expectedDate?: string;
  remark?: string;
  items: PurchaseOrderItem[];
  createdAt: string;
}

export interface PurchaseOrderItem {
  id: number;
  lineNo: number;
  productId: number;
  product?: Product;
  qty: number;
  unitPrice: number;
  discountAmount: number;
  lineTotal: number;
  qtyReceived: number;
}

export interface GoodsReceipt {
  id: number;
  docNo: string;
  docDate: string;
  supplierId: number;
  supplier?: Supplier;
  warehouseId: number;
  warehouse?: Warehouse;
  purchaseOrderId?: number;
  status: DocumentStatus;
  totalAmount: number;
  remark?: string;
  items: GoodsReceiptItem[];
  createdAt: string;
}

export interface GoodsReceiptItem {
  id: number;
  lineNo: number;
  productId: number;
  product?: Product;
  qty: number;
  unitCost: number;
  lineTotal: number;
}

export interface StockIssue {
  id: number;
  docNo: string;
  docDate: string;
  warehouseId: number;
  warehouse?: Warehouse;
  issueType: string;
  status: DocumentStatus;
  remark?: string;
  items: StockIssueItem[];
  createdAt: string;
}

export interface StockIssueItem {
  id: number;
  lineNo: number;
  productId: number;
  product?: Product;
  qty: number;
}

export interface SalesInvoice {
  id: number;
  docNo: string;
  docDate: string;
  customerId: number;
  customer?: Customer;
  warehouseId: number;
  warehouse?: Warehouse;
  status: DocumentStatus;
  subtotal: number;
  discountAmount: number;
  vatAmount: number;
  totalAmount: number;
  remark?: string;
  items: SalesInvoiceItem[];
  createdAt: string;
}

export interface SalesInvoiceItem {
  id: number;
  lineNo: number;
  productId: number;
  product?: Product;
  qty: number;
  unitPrice: number;
  discountAmount: number;
  lineTotal: number;
}

// Stock Types
export interface StockBalance {
  id: number;
  productId: number;
  product?: Product;
  warehouseId: number;
  warehouse?: Warehouse;
  qtyOnHand: number;
  qtyReserved: number;
  qtyAvailable: number;
}

export interface FifoLayer {
  id: number;
  productId: number;
  warehouseId: number;
  refType: string;
  refId: number;
  refDocNo: string;
  originalQty: number;
  remainingQty: number;
  unitCost: number;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
