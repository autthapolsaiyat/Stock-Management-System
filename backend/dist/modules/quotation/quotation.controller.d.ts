import { QuotationService } from './quotation.service';
export declare class QuotationController {
    private readonly quotationService;
    constructor(quotationService: QuotationService);
    findAll(status?: string, qtType?: string): Promise<import("./entities").QuotationEntity[]>;
    findOne(id: number): Promise<import("./entities").QuotationEntity>;
    getItemsForPO(id: number): Promise<{
        quotation: {
            id: number;
            docFullNo: string;
            customerName: string;
        };
        needToOrder: import("./entities").QuotationItemEntity[];
        tempProducts: import("./entities").QuotationItemEntity[];
        masterProducts: import("./entities").QuotationItemEntity[];
    }>;
    getItemsForInvoice(id: number): Promise<{
        ready: any[];
        withVariance: any[];
        notReady: any[];
    }>;
    create(dto: any, req: any): Promise<import("./entities").QuotationEntity>;
    update(id: number, dto: any, req: any): Promise<import("./entities").QuotationEntity>;
    submitForApproval(id: number, req: any): Promise<import("./entities").QuotationEntity>;
    approve(id: number, note: string, req: any): Promise<import("./entities").QuotationEntity>;
    approveMargin(id: number, note: string, req: any): Promise<import("./entities").QuotationEntity>;
    send(id: number, req: any): Promise<import("./entities").QuotationEntity>;
    confirm(id: number, req: any): Promise<import("./entities").QuotationEntity>;
    cancel(id: number, reason: string, req: any): Promise<import("./entities").QuotationEntity>;
    cancelItem(id: number, itemId: number, reason: string, req: any): Promise<import("./entities").QuotationEntity>;
}
