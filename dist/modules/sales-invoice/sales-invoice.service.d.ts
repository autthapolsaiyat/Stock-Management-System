import { Repository, DataSource } from 'typeorm';
import { SalesInvoiceEntity, SalesInvoiceItemEntity } from './entities';
import { DocNumberingService } from '../doc-numbering/doc-numbering.service';
import { FifoService } from '../fifo/fifo.service';
export declare class SalesInvoiceService {
    private invoiceRepository;
    private itemRepository;
    private docNumberingService;
    private fifoService;
    private dataSource;
    constructor(invoiceRepository: Repository<SalesInvoiceEntity>, itemRepository: Repository<SalesInvoiceItemEntity>, docNumberingService: DocNumberingService, fifoService: FifoService, dataSource: DataSource);
    findAll(status?: string): Promise<SalesInvoiceEntity[]>;
    findOne(id: number): Promise<SalesInvoiceEntity>;
    create(dto: any, userId: number): Promise<SalesInvoiceEntity>;
    post(id: number, userId: number): Promise<SalesInvoiceEntity>;
    cancel(id: number, userId: number): Promise<SalesInvoiceEntity>;
}
