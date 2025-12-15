import { GoodsReceiptService } from './goods-receipt.service';
export declare class GoodsReceiptController {
    private readonly grService;
    constructor(grService: GoodsReceiptService);
    findAll(status?: string): Promise<import("./entities").GoodsReceiptEntity[]>;
    findOne(id: number): Promise<import("./entities").GoodsReceiptEntity>;
    findByPO(poId: number): Promise<import("./entities").GoodsReceiptEntity[]>;
    findByQuotation(quotationId: number): Promise<import("./entities").GoodsReceiptEntity[]>;
    getVarianceReport(id: number): Promise<{
        goodsReceipt: {
            id: number;
            docFullNo: string;
            totalExpectedCost: number;
            totalAmount: number;
            totalVariance: number;
            variancePercent: number;
        };
        itemsWithVariance: import("./entities").GoodsReceiptItemEntity[];
        summary: {
            totalItems: number;
            itemsWithAlert: number;
            hasAlert: boolean;
        };
    }>;
    create(dto: any, req: any): Promise<import("./entities").GoodsReceiptEntity>;
    createFromPO(poId: number, dto: any, req: any): Promise<import("./entities").GoodsReceiptEntity>;
    post(id: number, req: any): Promise<import("./entities").GoodsReceiptEntity>;
    cancel(id: number, reason: string, req: any): Promise<import("./entities").GoodsReceiptEntity>;
}
