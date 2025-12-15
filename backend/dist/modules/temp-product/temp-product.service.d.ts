import { Repository, DataSource } from 'typeorm';
import { TempProductEntity } from './entities';
export declare class TempProductService {
    private tempProductRepository;
    private dataSource;
    constructor(tempProductRepository: Repository<TempProductEntity>, dataSource: DataSource);
    findAll(status?: string): Promise<TempProductEntity[]>;
    findByQuotation(quotationId: number): Promise<TempProductEntity[]>;
    findOne(id: number): Promise<TempProductEntity>;
    generateTempCode(): Promise<string>;
    create(dto: any, userId: number): Promise<TempProductEntity>;
    update(id: number, dto: any, userId: number): Promise<TempProductEntity>;
    activate(id: number, dto: {
        newProductId: number;
        grId?: number;
    }, userId: number): Promise<TempProductEntity>;
    cancel(id: number, userId: number): Promise<TempProductEntity>;
}
