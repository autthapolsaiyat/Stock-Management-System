import { FifoService } from './fifo.service';
export declare class FifoController {
    private readonly fifoService;
    constructor(fifoService: FifoService);
    getBalance(productId?: number, warehouseId?: number): Promise<import("./entities").StockBalanceEntity[]>;
    getFifoLayers(productId: number, warehouseId?: number): Promise<import("./entities").FifoLayerEntity[]>;
}
