import { Repository, DataSource } from 'typeorm';
import { SalesInvoiceEntity, SalesInvoiceItemEntity } from './entities';
import { DocNumberingService } from '../doc-numbering/doc-numbering.service';
import { FifoService } from '../fifo/fifo.service';
import { QuotationService } from '../quotation/quotation.service';
import { SystemSettingsService } from '../system-settings/system-settings.service';
export declare class SalesInvoiceService {
    private invoiceRepository;
    private itemRepository;
    private docNumberingService;
    private fifoService;
    private quotationService;
    private settingsService;
    private dataSource;
    constructor(invoiceRepository: Repository<SalesInvoiceEntity>, itemRepository: Repository<SalesInvoiceItemEntity>, docNumberingService: DocNumberingService, fifoService: FifoService, quotationService: QuotationService, settingsService: SystemSettingsService, dataSource: DataSource);
    findAll(status?: string): Promise<SalesInvoiceEntity[]>;
    findOne(id: number): Promise<SalesInvoiceEntity>;
    findByQuotation(quotationId: number): Promise<SalesInvoiceEntity[]>;
    create(dto: any, userId: number): Promise<SalesInvoiceEntity>;
    createFromQuotation(quotationId: number, dto: any, userId: number): Promise<SalesInvoiceEntity>;
    approvePriceVariance(id: number, userId: number): Promise<SalesInvoiceEntity>;
    post(id: number, userId: number): Promise<SalesInvoiceEntity>;
    cancel(id: number, userId: number, reason?: string): Promise<SalesInvoiceEntity>;
    markPaid(id: number, userId: number, dto?: {
        paymentMethod?: string;
        paymentReference?: string;
        paidAmount?: number;
    }): Promise<SalesInvoiceEntity>;
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
}
