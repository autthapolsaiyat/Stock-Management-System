export declare class StockBalanceEntity {
    id: number;
    productId: number;
    warehouseId: number;
    qtyOnHand: number;
    qtyReserved: number;
    avgCost: number;
    lastReceivedAt: Date;
    lastIssuedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    get qtyAvailable(): number;
}
