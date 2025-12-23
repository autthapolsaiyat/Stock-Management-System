import { StockCountService } from './stock-count.service';
export declare class StockCountController {
    private readonly stockCountService;
    constructor(stockCountService: StockCountService);
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    create(dto: any, req: any): Promise<any>;
    startCount(id: string, req: any): Promise<any>;
    updateItemCount(id: string, itemId: string, dto: any, req: any): Promise<any>;
    complete(id: string, req: any): Promise<any>;
    approve(id: string, req: any): Promise<any>;
    createAdjustment(id: string, req: any): Promise<{
        count: any;
        adjustment: any;
    }>;
    delete(id: string): Promise<{
        deleted: boolean;
    }>;
}
