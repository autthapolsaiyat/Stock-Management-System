import { Repository, QueryRunner } from 'typeorm';
import { FifoLayerEntity, FifoTransactionEntity, StockBalanceEntity } from './entities';
export interface CreateLayerParams {
    productId: number;
    warehouseId: number;
    qty: number;
    unitCost: number;
    referenceType: string;
    referenceId?: number;
    referenceItemId?: number;
}
export interface DeductResult {
    totalCost: number;
    details: {
        layerId: number;
        qty: number;
        unitCost: number;
        cost: number;
    }[];
}
export declare class FifoService {
    private layerRepository;
    private transactionRepository;
    private balanceRepository;
    constructor(layerRepository: Repository<FifoLayerEntity>, transactionRepository: Repository<FifoTransactionEntity>, balanceRepository: Repository<StockBalanceEntity>);
    createLayer(params: CreateLayerParams, queryRunner?: QueryRunner): Promise<FifoLayerEntity>;
    deductFifo(productId: number, warehouseId: number, qty: number, refType: string, refId?: number, refItemId?: number, queryRunner?: QueryRunner): Promise<DeductResult>;
    updateBalance(productId: number, warehouseId: number, qtyChange: number, type: 'receive' | 'issue', queryRunner?: QueryRunner): Promise<void>;
    getStockBalance(productId?: number, warehouseId?: number): Promise<StockBalanceEntity[]>;
    getFifoLayers(productId: number, warehouseId?: number): Promise<FifoLayerEntity[]>;
}
