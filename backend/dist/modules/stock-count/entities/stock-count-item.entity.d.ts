import { StockCountEntity } from './stock-count.entity';
export declare class StockCountItemEntity {
    id: number;
    stockCountId: number;
    lineNo: number;
    productId: number;
    itemCode: string;
    itemName: string;
    unit: string;
    location: string;
    qtySystem: number;
    qtyCount1: number;
    qtyCount2: number;
    qtyFinal: number;
    qtyVariance: number;
    unitCost: number;
    valueVariance: number;
    countStatus: string;
    countedAt: Date;
    countedBy: number;
    remark: string;
    createdAt: Date;
    updatedAt: Date;
    stockCount: StockCountEntity;
}
