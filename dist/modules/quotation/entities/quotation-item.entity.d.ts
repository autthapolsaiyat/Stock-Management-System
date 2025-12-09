import { QuotationEntity } from './quotation.entity';
export declare class QuotationItemEntity {
    id: number;
    quotationId: number;
    lineNo: number;
    productId: number;
    qty: number;
    unitPrice: number;
    discountAmount: number;
    lineTotal: number;
    quotation: QuotationEntity;
}
