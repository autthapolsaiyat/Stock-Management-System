import { SupplierService } from './supplier.service';
export declare class SupplierController {
    private readonly supplierService;
    constructor(supplierService: SupplierService);
    findAll(): Promise<import("./entities").SupplierEntity[]>;
    findOne(id: number): Promise<import("./entities").SupplierEntity>;
    create(dto: any): Promise<import("./entities").SupplierEntity[]>;
    update(id: number, dto: any): Promise<import("./entities").SupplierEntity>;
    delete(id: number): Promise<import("./entities").SupplierEntity>;
}
