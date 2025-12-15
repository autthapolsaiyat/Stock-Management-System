import { GoodsReceiptEntity } from './goods-receipt.entity';
export declare class GoodsReceiptItemEntity {
    id: number;
    goodsReceiptId: number;
    lineNo: number;
    poItemId: number;
    quotationItemId: number;
    sourceType: string;
    productId: number;
    tempProductId: number;
    itemCode: string;
    itemName: string;
    itemDescription: string;
    brand: string;
    qty: number;
    unit: string;
    unitCost: number;
    lineTotal: number;
    expectedUnitCost: number;
    costVariance: number;
    variancePercent: number;
    hasVarianceAlert: boolean;
    lotNo: string;
    expiryDate: Date;
    locationCode: string;
    internalNote: string;
    activatedProductId: number;
    goodsReceipt: GoodsReceiptEntity;
}
