import { StockTransferItemEntity } from './stock-transfer-item.entity';
export declare class StockTransferEntity {
    id: number;
    docBaseNo: string;
    docRevision: number;
    docFullNo: string;
    isLatestRevision: boolean;
    fromWarehouseId: number;
    toWarehouseId: number;
    docDate: Date;
    reason: string;
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
    items: StockTransferItemEntity[];
}
