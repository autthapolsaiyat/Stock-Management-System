import { Repository, DataSource } from 'typeorm';
import { GoodsReceiptEntity, GoodsReceiptItemEntity } from './entities';
import { DocNumberingService } from '../doc-numbering/doc-numbering.service';
import { FifoService } from '../fifo/fifo.service';
export declare class GoodsReceiptService {
    private grnRepository;
    private itemRepository;
    private docNumberingService;
    private fifoService;
    private dataSource;
    constructor(grnRepository: Repository<GoodsReceiptEntity>, itemRepository: Repository<GoodsReceiptItemEntity>, docNumberingService: DocNumberingService, fifoService: FifoService, dataSource: DataSource);
    findAll(status?: string): Promise<GoodsReceiptEntity[]>;
    findOne(id: number): Promise<GoodsReceiptEntity>;
    create(dto: any, userId: number): Promise<GoodsReceiptEntity>;
    post(id: number, userId: number): Promise<GoodsReceiptEntity>;
    cancel(id: number, userId: number): Promise<GoodsReceiptEntity>;
}
