import { StockIssueItemEntity } from './stock-issue-item.entity';
export declare class StockIssueEntity {
    id: number;
    docBaseNo: string;
    docRevision: number;
    docFullNo: string;
    isLatestRevision: boolean;
    warehouseId: number;
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
    items: StockIssueItemEntity[];
}
