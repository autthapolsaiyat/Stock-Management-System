import { StockAdjustmentEntity } from './stock-adjustment.entity';
export declare class StockAdjustmentItemEntity {
    id: number;
    stockAdjustmentId: number;
    lineNo: number;
    productId: number;
    itemCode: string;
    itemName: string;
    unit: string;
    qtySystem: number;
    qtyCounted: number;
    qtyAdjust: number;
    unitCost: number;
    valueAdjust: number;
    remark: string;
    createdAt: Date;
    updatedAt: Date;
    stockAdjustment: StockAdjustmentEntity;
}
