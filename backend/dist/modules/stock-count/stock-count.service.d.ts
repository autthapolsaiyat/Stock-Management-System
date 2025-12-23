import { DataSource } from 'typeorm';
import { DocNumberingService } from '../doc-numbering/doc-numbering.service';
import { StockAdjustmentService } from '../stock-adjustment/stock-adjustment.service';
export declare class StockCountService {
    private dataSource;
    private docNumberingService;
    private stockAdjustmentService;
    constructor(dataSource: DataSource, docNumberingService: DocNumberingService, stockAdjustmentService: StockAdjustmentService);
    findAll(): Promise<any>;
    findOne(id: number): Promise<any>;
    create(dto: any, userId?: number): Promise<any>;
    startCount(id: number, userId?: number): Promise<any>;
    updateItemCount(id: number, itemId: number, dto: any, userId?: number): Promise<any>;
    updateHeaderCounts(id: number): Promise<void>;
    complete(id: number, userId?: number): Promise<any>;
    approve(id: number, userId?: number): Promise<any>;
    createAdjustment(id: number, userId?: number): Promise<{
        count: any;
        adjustment: any;
    }>;
    delete(id: number): Promise<{
        deleted: boolean;
    }>;
}
