// Quotation Types
export type QuotationType = 'STANDARD' | 'FORENSIC' | 'MAINTENANCE';
export type QuotationStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'SENT' | 'CONFIRMED' | 'PARTIALLY_CLOSED' | 'CLOSED' | 'CANCELLED';
export type ItemStatus = 'PENDING' | 'ORDERED' | 'PARTIAL' | 'RECEIVED' | 'SOLD' | 'CANCELLED';
export type DiscountDisplayMode = 'SHOW' | 'HIDE' | 'NONE';
export type SourceType = 'MASTER' | 'TEMP';

export interface QuotationItem {
  id?: number;
  lineNo: number;
  sourceType: SourceType;
  productId?: number;
  tempProductId?: number;
  itemCode: string;
  itemName: string;
  itemDescription?: string;
  brand?: string;
  qty: number;
  unit: string;
  unitPrice: number;
  discountPercent?: number;
  discountAmount?: number;
  lineTotal: number;
  estimatedCost: number;
  expectedMarginPercent: number;
  actualCost?: number;
  actualMarginPercent?: number;
  itemStatus: ItemStatus;
  qtyOrdered?: number;
  qtyReceived?: number;
  qtySold?: number;
  qtyCancelled?: number;
  qtyRemaining?: number;
  internalNote?: string;
}

export interface Quotation {
  id?: number;
  docBaseNo?: string;
  docRevision?: number;
  docFullNo?: string;
  quotationType: QuotationType;
  customerId: number;
  customerName?: string;
  customerAddress?: string;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  docDate: string;
  validUntil?: string;
  validDays: number;
  deliveryDays: number;
  creditTermDays: number;
  status: QuotationStatus;
  // Amounts
  subtotal: number;
  discountPercent?: number;
  discountAmount?: number;
  discountDisplayMode: DiscountDisplayMode;
  afterDiscount: number;
  taxRate: number;
  taxAmount: number;
  grandTotal: number;
  // Margin
  totalEstimatedCost: number;
  expectedMarginAmount: number;
  expectedMarginPercent: number;
  totalActualCost?: number;
  actualMarginAmount?: number;
  actualMarginPercent?: number;
  requiresMarginApproval: boolean;
  marginApproved: boolean;
  // Notes
  publicNote?: string;
  internalNote?: string;
  termsAndConditions?: string;
  // Items
  items: QuotationItem[];
  // Images
  images?: QuotationImage[];
}

export interface QuotationImage {
  id?: number;
  quotationId?: number;
  imageUrl: string;
  fileName?: string;
  sortOrder: number;
  caption?: string;
}

// Temp Product
export type TempProductStatus = 'PENDING' | 'ACTIVATED' | 'CANCELLED';

export interface TempProduct {
  id?: number;
  tempCode?: string;
  name: string;
  description?: string;
  brand?: string;
  model?: string;
  unit: string;
  estimatedCost: number;
  suggestedPrice?: number;
  sourceQuotationId?: number;
  sourceQuotationDocNo?: string;
  status: TempProductStatus;
  activatedProductId?: number;
  activatedAt?: string;
}

// Company Settings
export interface CompanySettings {
  // Thai
  companyNameTh: string;
  address1Th: string;
  address2Th: string;
  address3Th: string;
  address4Th: string;
  phoneTh: string;
  faxTh: string;
  taxIdTh: string;
  // English
  companyNameEn: string;
  address1En: string;
  address2En: string;
  address3En: string;
  phoneEn: string;
  faxEn: string;
  taxIdEn: string;
  // Common
  email: string;
  logoUrl?: string;
  displayLang: 'BOTH' | 'TH' | 'EN';
  displayOptions: {
    logo: boolean;
    name: boolean;
    address: boolean;
    taxId: boolean;
  };
}

export interface SellerSettings {
  name: string;
  surname: string;
  nickname: string;
  phone: string;
  email: string;
  signatureUrl?: string;
  signaturePosition: string;
  displayOptions: {
    fullName: boolean;
    nickname: boolean;
    phone: boolean;
    email: boolean;
    signature: boolean;
  };
}

export interface QuotationDefaults {
  validDays: number;
  deliveryDays: number;
  creditTermDays: number;
  minMarginPercent: number;
  varianceAlertPercent: number;
  paymentTerms: string;
  deliveryTerms: string;
  footerNote: string;
}

export interface QuotationSettings {
  company: CompanySettings;
  seller: SellerSettings;
  defaults: QuotationDefaults;
}

// Form State
export interface QuotationFormState {
  quotation: Partial<Quotation>;
  items: QuotationItem[];
  images: QuotationImage[];
  settings: QuotationSettings | null;
  isLoading: boolean;
  isSaving: boolean;
  errors: Record<string, string>;
}

// Quick Calculator
export interface CalculatorItem {
  name: string;
  qty: number;
  price: number;
  total: number;
}

export interface CalculatorResult {
  items: CalculatorItem[];
  subtotal: number;
  vat: number;
  grandTotal: number;
}
