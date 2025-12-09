import { GoodsReceiptService } from './goods-receipt.service';
export declare class GoodsReceiptController {
    private readonly grnService;
    constructor(grnService: GoodsReceiptService);
    findAll(status?: string): Promise<import("./entities").GoodsReceiptEntity[]>;
    findOne(id: number): Promise<import("./entities").GoodsReceiptEntity>;
    create(dto: any, req: any): Promise<import("./entities").GoodsReceiptEntity>;
    post(id: number, req: any): Promise<import("./entities").GoodsReceiptEntity>;
    cancel(id: number, req: any): Promise<import("./entities").GoodsReceiptEntity>;
}
