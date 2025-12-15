import { Repository, DataSource } from 'typeorm';
import { PurchaseOrderEntity, PurchaseOrderItemEntity } from './entities';
import { DocNumberingService } from '../doc-numbering/doc-numbering.service';
import { QuotationService } from '../quotation/quotation.service';
export declare class PurchaseOrderService {
    private poRepository;
    private itemRepository;
    private docNumberingService;
    private quotationService;
    private dataSource;
    constructor(poRepository: Repository<PurchaseOrderEntity>, itemRepository: Repository<PurchaseOrderItemEntity>, docNumberingService: DocNumberingService, quotationService: QuotationService, dataSource: DataSource);
    findAll(status?: string): Promise<PurchaseOrderEntity[]>;
    findOne(id: number): Promise<PurchaseOrderEntity>;
    findByQuotation(quotationId: number): Promise<PurchaseOrderEntity[]>;
    create(dto: any, userId: number): Promise<PurchaseOrderEntity>;
    createFromQuotation(quotationId: number, supplierId: number, dto: any, userId: number): Promise<PurchaseOrderEntity>;
    update(id: number, dto: any, userId: number): Promise<PurchaseOrderEntity>;
    submitForApproval(id: number, userId: number): Promise<PurchaseOrderEntity>;
    approve(id: number, userId: number, note?: string): Promise<PurchaseOrderEntity>;
    send(id: number, userId: number): Promise<PurchaseOrderEntity>;
    cancel(id: number, userId: number, reason?: string): Promise<PurchaseOrderEntity>;
    updateReceiveStatus(id: number): Promise<void>;
    getItemsForGR(id: number): Promise<{
        purchaseOrder: {
            id: number;
            docFullNo: string;
            supplierId: number;
            supplierName: string;
            quotationId: number;
            quotationDocNo: string;
        };
        pendingItems: PurchaseOrderItemEntity[];
        summary: {
            totalItems: number;
            received: number;
            partial: number;
            pending: number;
        };
    }>;
}
