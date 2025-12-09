import { Repository, DataSource } from 'typeorm';
import { StockTransferEntity, StockTransferItemEntity } from './entities';
import { DocNumberingService } from '../doc-numbering/doc-numbering.service';
import { FifoService } from '../fifo/fifo.service';
export declare class StockTransferService {
    private transferRepository;
    private itemRepository;
    private docNumberingService;
    private fifoService;
    private dataSource;
    constructor(transferRepository: Repository<StockTransferEntity>, itemRepository: Repository<StockTransferItemEntity>, docNumberingService: DocNumberingService, fifoService: FifoService, dataSource: DataSource);
    findAll(status?: string): Promise<StockTransferEntity[]>;
    findOne(id: number): Promise<StockTransferEntity>;
    create(dto: any, userId: number): Promise<StockTransferEntity>;
    post(id: number, userId: number): Promise<StockTransferEntity>;
}
