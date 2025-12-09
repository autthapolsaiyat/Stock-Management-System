import { GoodsReceiptEntity } from './goods-receipt.entity';
export declare class GoodsReceiptItemEntity {
    id: number;
    goodsReceiptId: number;
    lineNo: number;
    productId: number;
    qty: number;
    unitCost: number;
    lineTotal: number;
    goodsReceipt: GoodsReceiptEntity;
}
