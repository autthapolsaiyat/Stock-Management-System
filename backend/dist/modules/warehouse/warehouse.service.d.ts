import { Repository } from 'typeorm';
import { WarehouseEntity } from './entities/warehouse.entity';
export declare class WarehouseService {
    private warehouseRepository;
    constructor(warehouseRepository: Repository<WarehouseEntity>);
    findAll(): Promise<WarehouseEntity[]>;
    findOne(id: number): Promise<WarehouseEntity>;
    create(dto: any): Promise<WarehouseEntity[]>;
    update(id: number, dto: any): Promise<WarehouseEntity>;
    delete(id: number): Promise<WarehouseEntity>;
}
