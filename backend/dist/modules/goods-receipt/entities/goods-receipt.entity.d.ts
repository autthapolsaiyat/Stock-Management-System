import { GoodsReceiptItemEntity } from './goods-receipt-item.entity';
export declare class GoodsReceiptEntity {
    id: number;
    docBaseNo: string;
    docRevision: number;
    docFullNo: string;
    isLatestRevision: boolean;
    purchaseOrderId: number;
    supplierId: number;
    warehouseId: number;
    docDate: Date;
    supplierInvoiceNo: string;
    status: string;
    totalAmount: number;
    remark: string;
    postedAt: Date;
    postedBy: number;
    cancelledAt: Date;
    cancelledBy: number;
    createdAt: Date;
    updatedAt: Date;
    createdBy: number;
    updatedBy: number;
    items: GoodsReceiptItemEntity[];
}
