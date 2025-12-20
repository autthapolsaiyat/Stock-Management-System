import { Repository, DataSource } from 'typeorm';
import { GoodsReceiptEntity, GoodsReceiptItemEntity } from './entities';
import { DocNumberingService } from '../doc-numbering/doc-numbering.service';
import { FifoService } from '../fifo/fifo.service';
import { PurchaseOrderService } from '../purchase-order/purchase-order.service';
import { TempProductService } from '../temp-product/temp-product.service';
import { SystemSettingsService } from '../system-settings/system-settings.service';
export declare class GoodsReceiptService {
    private grRepository;
    private itemRepository;
    private docNumberingService;
    private fifoService;
    private poService;
    private tempProductService;
    private settingsService;
    private dataSource;
    constructor(grRepository: Repository<GoodsReceiptEntity>, itemRepository: Repository<GoodsReceiptItemEntity>, docNumberingService: DocNumberingService, fifoService: FifoService, poService: PurchaseOrderService, tempProductService: TempProductService, settingsService: SystemSettingsService, dataSource: DataSource);
    findAll(status?: string): Promise<GoodsReceiptEntity[]>;
    findOne(id: number): Promise<GoodsReceiptEntity>;
    findByPO(purchaseOrderId: number): Promise<GoodsReceiptEntity[]>;
    findByQuotation(quotationId: number): Promise<GoodsReceiptEntity[]>;
    create(dto: any, userId: number): Promise<GoodsReceiptEntity>;
    createFromPO(purchaseOrderId: number, dto: any, userId: number): Promise<GoodsReceiptEntity>;
    post(id: number, userId: number): Promise<GoodsReceiptEntity>;
    cancel(id: number, userId: number, reason?: string): Promise<GoodsReceiptEntity>;
    getVarianceReport(id: number): Promise<{
        goodsReceipt: {
            id: number;
            docFullNo: string;
            totalExpectedCost: number;
            totalAmount: number;
            totalVariance: number;
            variancePercent: number;
        };
        itemsWithVariance: GoodsReceiptItemEntity[];
        summary: {
            totalItems: number;
            itemsWithAlert: number;
            hasAlert: boolean;
        };
    }>;
    reverse(id: number, userId: number, reason?: string): Promise<GoodsReceiptEntity>;
}
