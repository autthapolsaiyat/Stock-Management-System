import { Repository, DataSource } from 'typeorm';
import { QuotationEntity, QuotationItemEntity } from './entities';
import { DocNumberingService } from '../doc-numbering/doc-numbering.service';
import { TempProductService } from '../temp-product/temp-product.service';
import { SystemSettingsService } from '../system-settings/system-settings.service';
export declare class QuotationService {
    private quotationRepository;
    private itemRepository;
    private docNumberingService;
    private tempProductService;
    private settingsService;
    private dataSource;
    constructor(quotationRepository: Repository<QuotationEntity>, itemRepository: Repository<QuotationItemEntity>, docNumberingService: DocNumberingService, tempProductService: TempProductService, settingsService: SystemSettingsService, dataSource: DataSource);
    findAll(status?: string, qtType?: string): Promise<QuotationEntity[]>;
    findOne(id: number): Promise<QuotationEntity>;
    create(dto: any, userId: number): Promise<QuotationEntity>;
    update(id: number, dto: any, userId: number): Promise<QuotationEntity>;
    submitForApproval(id: number, userId: number): Promise<QuotationEntity>;
    approve(id: number, userId: number, note?: string): Promise<QuotationEntity>;
    approveMargin(id: number, userId: number, note?: string): Promise<QuotationEntity>;
    send(id: number, userId: number): Promise<QuotationEntity>;
    confirm(id: number, userId: number): Promise<QuotationEntity>;
    cancel(id: number, userId: number, reason?: string): Promise<QuotationEntity>;
    cancelItem(id: number, itemId: number, userId: number, reason?: string): Promise<QuotationEntity>;
    updateFulfillmentSummary(id: number): Promise<void>;
    getItemsForPO(id: number): Promise<{
        quotation: {
            id: number;
            docFullNo: string;
            customerName: string;
        };
        needToOrder: QuotationItemEntity[];
        tempProducts: QuotationItemEntity[];
        masterProducts: QuotationItemEntity[];
    }>;
    getItemsForInvoice(id: number): Promise<{
        ready: any[];
        withVariance: any[];
        notReady: any[];
    }>;
    delete(id: number, userId: number): Promise<{
        success: boolean;
        message: string;
    }>;
    createRevision(id: number, userId: number, reason?: string): Promise<QuotationEntity>;
}
