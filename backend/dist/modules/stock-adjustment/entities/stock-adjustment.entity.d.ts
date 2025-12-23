import { StockAdjustmentItemEntity } from './stock-adjustment-item.entity';
export declare class StockAdjustmentEntity {
    id: number;
    docBaseNo: string;
    docRevision: number;
    docFullNo: string;
    isLatestRevision: boolean;
    warehouseId: number;
    warehouseName: string;
    docDate: Date;
    adjustmentType: string;
    reason: string;
    status: string;
    totalQtyAdjust: number;
    totalValueAdjust: number;
    remark: string;
    stockCountId: number;
    postedAt: Date;
    postedBy: number;
    cancelledAt: Date;
    cancelledBy: number;
    createdAt: Date;
    updatedAt: Date;
    createdBy: number;
    updatedBy: number;
    items: StockAdjustmentItemEntity[];
}
