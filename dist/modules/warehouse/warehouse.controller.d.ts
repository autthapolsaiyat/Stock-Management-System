import { WarehouseService } from './warehouse.service';
export declare class WarehouseController {
    private readonly warehouseService;
    constructor(warehouseService: WarehouseService);
    findAll(): Promise<import("./entities").WarehouseEntity[]>;
    findOne(id: number): Promise<import("./entities").WarehouseEntity>;
    create(dto: any): Promise<import("./entities").WarehouseEntity[]>;
    update(id: number, dto: any): Promise<import("./entities").WarehouseEntity>;
}
