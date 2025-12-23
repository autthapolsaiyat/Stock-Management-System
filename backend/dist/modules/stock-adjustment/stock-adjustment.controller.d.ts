import { StockAdjustmentService } from './stock-adjustment.service';
export declare class StockAdjustmentController {
    private readonly stockAdjustmentService;
    constructor(stockAdjustmentService: StockAdjustmentService);
    findAll(): Promise<any>;
    getProductsForAdjustment(warehouseId: string): Promise<any>;
    findOne(id: string): Promise<any>;
    create(dto: any, req: any): Promise<any>;
    post(id: string, req: any): Promise<any>;
    cancel(id: string, req: any): Promise<any>;
    delete(id: string): Promise<{
        deleted: boolean;
    }>;
}
