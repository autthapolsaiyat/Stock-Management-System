import { Repository, DataSource } from 'typeorm';
import { QuotationEntity, QuotationItemEntity } from './entities';
import { DocNumberingService } from '../doc-numbering/doc-numbering.service';
export declare class QuotationService {
    private quotationRepository;
    private itemRepository;
    private docNumberingService;
    private dataSource;
    constructor(quotationRepository: Repository<QuotationEntity>, itemRepository: Repository<QuotationItemEntity>, docNumberingService: DocNumberingService, dataSource: DataSource);
    findAll(status?: string): Promise<QuotationEntity[]>;
    findOne(id: number): Promise<QuotationEntity>;
    create(dto: any, userId: number): Promise<QuotationEntity>;
    confirm(id: number, userId: number): Promise<QuotationEntity>;
    cancel(id: number, userId: number): Promise<QuotationEntity>;
}
