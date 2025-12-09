import { QuotationService } from './quotation.service';
export declare class QuotationController {
    private readonly quotationService;
    constructor(quotationService: QuotationService);
    findAll(status?: string): Promise<import("./entities").QuotationEntity[]>;
    findOne(id: number): Promise<import("./entities").QuotationEntity>;
    create(dto: any, req: any): Promise<import("./entities").QuotationEntity>;
    confirm(id: number, req: any): Promise<import("./entities").QuotationEntity>;
    cancel(id: number, req: any): Promise<import("./entities").QuotationEntity>;
}
