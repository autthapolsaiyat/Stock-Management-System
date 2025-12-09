import { SalesInvoiceService } from './sales-invoice.service';
export declare class SalesInvoiceController {
    private readonly invoiceService;
    constructor(invoiceService: SalesInvoiceService);
    findAll(status?: string): Promise<import("./entities").SalesInvoiceEntity[]>;
    findOne(id: number): Promise<import("./entities").SalesInvoiceEntity>;
    create(dto: any, req: any): Promise<import("./entities").SalesInvoiceEntity>;
    post(id: number, req: any): Promise<import("./entities").SalesInvoiceEntity>;
    cancel(id: number, req: any): Promise<import("./entities").SalesInvoiceEntity>;
}
