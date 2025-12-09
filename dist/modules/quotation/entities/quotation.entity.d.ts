import { QuotationItemEntity } from './quotation-item.entity';
export declare class QuotationEntity {
    id: number;
    docBaseNo: string;
    docRevision: number;
    docFullNo: string;
    isLatestRevision: boolean;
    customerId: number;
    docDate: Date;
    validUntil: Date;
    creditTermDays: number;
    status: string;
    subtotal: number;
    discountTotal: number;
    taxRate: number;
    taxAmount: number;
    grandTotal: number;
    remark: string;
    revisionReason: string;
    confirmedAt: Date;
    confirmedBy: number;
    cancelledAt: Date;
    cancelledBy: number;
    createdAt: Date;
    updatedAt: Date;
    createdBy: number;
    updatedBy: number;
    items: QuotationItemEntity[];
}
