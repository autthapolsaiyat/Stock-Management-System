import { Repository, DataSource } from 'typeorm';
import { StockIssueEntity, StockIssueItemEntity } from './entities';
import { DocNumberingService } from '../doc-numbering/doc-numbering.service';
import { FifoService } from '../fifo/fifo.service';
export declare class StockIssueService {
    private issueRepository;
    private itemRepository;
    private docNumberingService;
    private fifoService;
    private dataSource;
    constructor(issueRepository: Repository<StockIssueEntity>, itemRepository: Repository<StockIssueItemEntity>, docNumberingService: DocNumberingService, fifoService: FifoService, dataSource: DataSource);
    findAll(status?: string): Promise<StockIssueEntity[]>;
    findOne(id: number): Promise<StockIssueEntity>;
    create(dto: any, userId: number): Promise<StockIssueEntity>;
    post(id: number, userId: number): Promise<StockIssueEntity>;
}
