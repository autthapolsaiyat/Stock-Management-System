import { StockIssueService } from './stock-issue.service';
export declare class StockIssueController {
    private readonly issueService;
    constructor(issueService: StockIssueService);
    findAll(status?: string): Promise<import("./entities").StockIssueEntity[]>;
    findOne(id: number): Promise<import("./entities").StockIssueEntity>;
    create(dto: any, req: any): Promise<import("./entities").StockIssueEntity>;
    post(id: number, req: any): Promise<import("./entities").StockIssueEntity>;
}
