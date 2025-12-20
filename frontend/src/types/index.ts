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
  contactName?: string;
  isActive: boolean;
}

// Warehouse Types
export interface Warehouse {
  id: number;
  code: string;
  name: string;
  location?: string;
  isActive: boolean;
}

// Document Status - support both lowercase and UPPERCASE
export type DocumentStatus = 
  | 'draft' | 'confirmed' | 'approved' | 'posted' | 'cancelled'
  | 'DRAFT' | 'CONFIRMED' | 'APPROVED' | 'POSTED' | 'CANCELLED';

export interface Quotation {
  id: number;
  docNo: string;
  docFullNo?: string;
  docDate: string;
  customerId: number;
  customer?: Customer;
  status: DocumentStatus;
  subtotal: number;
  discountAmount: number;
  vatAmount: number;
  totalAmount: number;
  grandTotal?: number;
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
  docFullNo?: string;
  docBaseNo?: string;
  docDate: string;
  supplierId: number;
  supplier?: Supplier;
  status: DocumentStatus;
  subtotal: number;
  discountAmount: number;
  vatAmount: number;
  totalAmount: number;
  grandTotal?: number;
  grandTotal?: number;
  expectedDate?: string;
  deliveryDate?: string;
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
  docFullNo?: string;
  docBaseNo?: string;
  docDate: string;
  supplierId: number;
  supplier?: Supplier;
  warehouseId: number;
  warehouse?: Warehouse;
  purchaseOrderId?: number;
  status: DocumentStatus;
  totalAmount: number;
  grandTotal?: number;
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
  docFullNo?: string;
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

export interface StockTransfer {
  id: number;
  docNo: string;
  docFullNo?: string;
  docDate: string;
  fromWarehouseId: number;
  fromWarehouse?: Warehouse;
  toWarehouseId: number;
  toWarehouse?: Warehouse;
  status: DocumentStatus;
  remark?: string;
  items: StockTransferItem[];
  createdAt: string;
}

export interface StockTransferItem {
  id: number;
  lineNo: number;
  productId: number;
  product?: Product;
  qty: number;
}

export interface SalesInvoice {
  id: number;
  docNo: string;
  docFullNo?: string;
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
  grandTotal?: number;
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

export interface StockBalance {
  productId: number;
  product?: Product;
  warehouseId: number;
  warehouse?: Warehouse;
  qtyOnHand: number;
  avgCost: number;
  totalValue: number;
}
