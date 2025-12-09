import { PurchaseOrderEntity } from './purchase-order.entity';
export declare class PurchaseOrderItemEntity {
    id: number;
    purchaseOrderId: number;
    lineNo: number;
    productId: number;
    qty: number;
    unitPrice: number;
    discountAmount: number;
    lineTotal: number;
    qtyReceived: number;
    purchaseOrder: PurchaseOrderEntity;
}
