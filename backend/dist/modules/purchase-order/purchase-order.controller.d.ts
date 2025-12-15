import { PurchaseOrderService } from './purchase-order.service';
export declare class PurchaseOrderController {
    private readonly poService;
    constructor(poService: PurchaseOrderService);
    findAll(status?: string): Promise<import("./entities").PurchaseOrderEntity[]>;
    findOne(id: number): Promise<import("./entities").PurchaseOrderEntity>;
    findByQuotation(quotationId: number): Promise<import("./entities").PurchaseOrderEntity[]>;
    getItemsForGR(id: number): Promise<{
        purchaseOrder: {
            id: number;
            docFullNo: string;
            supplierId: number;
            supplierName: string;
            quotationId: number;
            quotationDocNo: string;
        };
        pendingItems: import("./entities").PurchaseOrderItemEntity[];
        summary: {
            totalItems: number;
            received: number;
            partial: number;
            pending: number;
        };
    }>;
    create(dto: any, req: any): Promise<import("./entities").PurchaseOrderEntity>;
    createFromQuotation(quotationId: number, dto: any, req: any): Promise<import("./entities").PurchaseOrderEntity>;
    update(id: number, dto: any, req: any): Promise<import("./entities").PurchaseOrderEntity>;
    submitForApproval(id: number, req: any): Promise<import("./entities").PurchaseOrderEntity>;
    approve(id: number, note: string, req: any): Promise<import("./entities").PurchaseOrderEntity>;
    send(id: number, req: any): Promise<import("./entities").PurchaseOrderEntity>;
    cancel(id: number, reason: string, req: any): Promise<import("./entities").PurchaseOrderEntity>;
}
