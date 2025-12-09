import { StockTransferEntity } from './stock-transfer.entity';
export declare class StockTransferItemEntity {
    id: number;
    stockTransferId: number;
    lineNo: number;
    productId: number;
    qty: number;
    unitCost: number;
    lineTotal: number;
    stockTransfer: StockTransferEntity;
}
