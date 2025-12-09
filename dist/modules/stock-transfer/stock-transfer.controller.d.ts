import { StockTransferService } from './stock-transfer.service';
export declare class StockTransferController {
    private readonly transferService;
    constructor(transferService: StockTransferService);
    findAll(status?: string): Promise<import("./entities").StockTransferEntity[]>;
    findOne(id: number): Promise<import("./entities").StockTransferEntity>;
    create(dto: any, req: any): Promise<import("./entities").StockTransferEntity>;
    post(id: number, req: any): Promise<import("./entities").StockTransferEntity>;
}
