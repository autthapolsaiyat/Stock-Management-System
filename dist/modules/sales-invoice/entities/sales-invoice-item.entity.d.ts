import { SalesInvoiceEntity } from './sales-invoice.entity';
export declare class SalesInvoiceItemEntity {
    id: number;
    salesInvoiceId: number;
    lineNo: number;
    productId: number;
    qty: number;
    unitPrice: number;
    discountAmount: number;
    lineTotal: number;
    unitCost: number;
    costTotal: number;
    salesInvoice: SalesInvoiceEntity;
}
