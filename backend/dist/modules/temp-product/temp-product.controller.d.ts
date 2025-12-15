import { TempProductService } from './temp-product.service';
export declare class TempProductController {
    private readonly tempProductService;
    constructor(tempProductService: TempProductService);
    findAll(status?: string): Promise<import("./entities").TempProductEntity[]>;
    findByQuotation(quotationId: number): Promise<import("./entities").TempProductEntity[]>;
    findOne(id: number): Promise<import("./entities").TempProductEntity>;
    create(dto: any, req: any): Promise<import("./entities").TempProductEntity>;
    update(id: number, dto: any, req: any): Promise<import("./entities").TempProductEntity>;
    activate(id: number, dto: any, req: any): Promise<import("./entities").TempProductEntity>;
    cancel(id: number, req: any): Promise<import("./entities").TempProductEntity>;
}
