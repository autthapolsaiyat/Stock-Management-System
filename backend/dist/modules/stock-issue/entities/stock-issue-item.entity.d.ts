import { StockIssueEntity } from './stock-issue.entity';
export declare class StockIssueItemEntity {
    id: number;
    stockIssueId: number;
    lineNo: number;
    productId: number;
    qty: number;
    unitCost: number;
    lineTotal: number;
    stockIssue: StockIssueEntity;
}
