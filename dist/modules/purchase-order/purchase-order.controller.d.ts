import { PurchaseOrderService } from './purchase-order.service';
export declare class PurchaseOrderController {
    private readonly poService;
    constructor(poService: PurchaseOrderService);
    findAll(status?: string): Promise<import("./entities").PurchaseOrderEntity[]>;
    findOne(id: number): Promise<import("./entities").PurchaseOrderEntity>;
    create(dto: any, req: any): Promise<import("./entities").PurchaseOrderEntity>;
    approve(id: number, req: any): Promise<import("./entities").PurchaseOrderEntity>;
    cancel(id: number, req: any): Promise<import("./entities").PurchaseOrderEntity>;
}
