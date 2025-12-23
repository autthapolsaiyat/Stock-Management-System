import { DataSource } from 'typeorm';
import { DocNumberingService } from '../doc-numbering/doc-numbering.service';
import { FifoService } from '../fifo/fifo.service';
export declare class StockAdjustmentService {
    private dataSource;
    private docNumberingService;
    private fifoService;
    constructor(dataSource: DataSource, docNumberingService: DocNumberingService, fifoService: FifoService);
    findAll(): Promise<any>;
    findOne(id: number): Promise<any>;
    create(dto: any, userId?: number): Promise<any>;
    post(id: number, userId?: number): Promise<any>;
    cancel(id: number, userId?: number): Promise<any>;
    delete(id: number): Promise<{
        deleted: boolean;
    }>;
    getProductsForAdjustment(warehouseId: number): Promise<any>;
}
