import { PurchaseOrderItemEntity } from './purchase-order-item.entity';
export declare class PurchaseOrderEntity {
    id: number;
    docBaseNo: string;
    docRevision: number;
    docFullNo: string;
    isLatestRevision: boolean;
    supplierId: number;
    docDate: Date;
    deliveryDate: Date;
    paymentTermDays: number;
    status: string;
    subtotal: number;
    discountTotal: number;
    taxRate: number;
    taxAmount: number;
    grandTotal: number;
    remark: string;
    approvedAt: Date;
    approvedBy: number;
    cancelledAt: Date;
    cancelledBy: number;
    createdAt: Date;
    updatedAt: Date;
    createdBy: number;
    updatedBy: number;
    items: PurchaseOrderItemEntity[];
}
