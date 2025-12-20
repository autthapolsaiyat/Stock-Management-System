import { SalesInvoiceService } from './sales-invoice.service';
export declare class SalesInvoiceController {
    private readonly invoiceService;
    constructor(invoiceService: SalesInvoiceService);
    findAll(status?: string): Promise<import("./entities").SalesInvoiceEntity[]>;
    findOne(id: number): Promise<import("./entities").SalesInvoiceEntity>;
    findByQuotation(quotationId: number): Promise<import("./entities").SalesInvoiceEntity[]>;
    getProfitReport(id: number): Promise<{
        invoice: {
            id: number;
            docFullNo: string;
            customerName: string;
            subtotal: number;
            costTotal: number;
            profitTotal: number;
            profitPercent: number;
        };
        items: {
            itemName: string;
            qty: number;
            unitPrice: number;
            lineTotal: number;
            unitCost: number;
            costTotal: number;
            profitAmount: number;
            profitPercent: number;
        }[];
    }>;
    create(dto: any, req: any): Promise<import("./entities").SalesInvoiceEntity>;
    createFromQuotation(quotationId: number, dto: any, req: any): Promise<import("./entities").SalesInvoiceEntity>;
    approvePriceVariance(id: number, req: any): Promise<import("./entities").SalesInvoiceEntity>;
    post(id: number, req: any): Promise<import("./entities").SalesInvoiceEntity>;
    cancel(id: number, reason: string, req: any): Promise<import("./entities").SalesInvoiceEntity>;
    markPaid(id: number, dto: any, req: any): Promise<import("./entities").SalesInvoiceEntity>;
    createCreditNote(id: number, dto: {
        reason: string;
    }, req: any): Promise<import("./entities").SalesInvoiceEntity>;
}
