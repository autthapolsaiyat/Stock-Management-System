import { Repository } from 'typeorm';
import { SupplierEntity } from './entities/supplier.entity';
export declare class SupplierService {
    private supplierRepository;
    constructor(supplierRepository: Repository<SupplierEntity>);
    findAll(): Promise<SupplierEntity[]>;
    findOne(id: number): Promise<SupplierEntity>;
    create(dto: any): Promise<SupplierEntity[]>;
    update(id: number, dto: any): Promise<SupplierEntity>;
}
