import { Repository, DataSource } from 'typeorm';
import { PurchaseOrderEntity, PurchaseOrderItemEntity } from './entities';
import { DocNumberingService } from '../doc-numbering/doc-numbering.service';
export declare class PurchaseOrderService {
    private poRepository;
    private itemRepository;
    private docNumberingService;
    private dataSource;
    constructor(poRepository: Repository<PurchaseOrderEntity>, itemRepository: Repository<PurchaseOrderItemEntity>, docNumberingService: DocNumberingService, dataSource: DataSource);
    findAll(status?: string): Promise<PurchaseOrderEntity[]>;
    findOne(id: number): Promise<PurchaseOrderEntity>;
    create(dto: any, userId: number): Promise<PurchaseOrderEntity>;
    approve(id: number, userId: number): Promise<PurchaseOrderEntity>;
    cancel(id: number, userId: number): Promise<PurchaseOrderEntity>;
}
