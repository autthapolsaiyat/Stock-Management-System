import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, QueryRunner } from 'typeorm';
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
  details: { layerId: number; qty: number; unitCost: number; cost: number }[];
}

@Injectable()
export class FifoService {
  constructor(
    @InjectRepository(FifoLayerEntity)
    private layerRepository: Repository<FifoLayerEntity>,
    @InjectRepository(FifoTransactionEntity)
    private transactionRepository: Repository<FifoTransactionEntity>,
    @InjectRepository(StockBalanceEntity)
    private balanceRepository: Repository<StockBalanceEntity>,
  ) {}

  async createLayer(params: CreateLayerParams, queryRunner?: QueryRunner): Promise<FifoLayerEntity> {
    const repo = queryRunner ? queryRunner.manager.getRepository(FifoLayerEntity) : this.layerRepository;
    const txRepo = queryRunner ? queryRunner.manager.getRepository(FifoTransactionEntity) : this.transactionRepository;
    
    const layer = repo.create({
      productId: params.productId,
      warehouseId: params.warehouseId,
      qtyOriginal: params.qty,
      qtyRemaining: params.qty,
      unitCost: params.unitCost,
      referenceType: params.referenceType,
      referenceId: params.referenceId,
      referenceItemId: params.referenceItemId,
      receivedAt: new Date(),
    });
    const savedLayer = await repo.save(layer);
    
    // Record transaction
    const tx = txRepo.create({
      fifoLayerId: savedLayer.id,
      qty: params.qty,
      unitCost: params.unitCost,
      totalCost: params.qty * params.unitCost,
      transactionType: 'IN',
      referenceType: params.referenceType,
      referenceId: params.referenceId,
      referenceItemId: params.referenceItemId,
    });
    await txRepo.save(tx);
    
    // Update balance
    await this.updateBalance(params.productId, params.warehouseId, params.qty, 'receive', queryRunner);
    
    return savedLayer;
  }

  async deductFifo(productId: number, warehouseId: number, qty: number, refType: string, refId?: number, refItemId?: number, queryRunner?: QueryRunner): Promise<DeductResult> {
    const repo = queryRunner ? queryRunner.manager.getRepository(FifoLayerEntity) : this.layerRepository;
    const txRepo = queryRunner ? queryRunner.manager.getRepository(FifoTransactionEntity) : this.transactionRepository;
    
    const layers = await repo.find({
      where: { productId, warehouseId, qtyRemaining: MoreThan(0) },
      order: { receivedAt: 'ASC', id: 'ASC' },
    });
    
    let remaining = qty;
    let totalCost = 0;
    const details: DeductResult['details'] = [];
    
    for (const layer of layers) {
      if (remaining <= 0) break;
      
      const deduct = Math.min(Number(layer.qtyRemaining), remaining);
      const cost = deduct * Number(layer.unitCost);
      
      layer.qtyRemaining = Number(layer.qtyRemaining) - deduct;
      await repo.save(layer);
      
      const tx = txRepo.create({
        fifoLayerId: layer.id,
        qty: deduct,
        unitCost: layer.unitCost,
        totalCost: cost,
        transactionType: 'OUT',
        referenceType: refType,
        referenceId: refId,
        referenceItemId: refItemId,
      });
      await txRepo.save(tx);
      
      details.push({ layerId: layer.id, qty: deduct, unitCost: Number(layer.unitCost), cost });
      totalCost += cost;
      remaining -= deduct;
    }
    
    if (remaining > 0) {
      throw new BadRequestException(`Insufficient stock. Short by ${remaining} units`);
    }
    
    await this.updateBalance(productId, warehouseId, -qty, 'issue', queryRunner);
    
    return { totalCost, details };
  }

  async updateBalance(productId: number, warehouseId: number, qtyChange: number, type: 'receive' | 'issue', queryRunner?: QueryRunner) {
    const repo = queryRunner ? queryRunner.manager.getRepository(StockBalanceEntity) : this.balanceRepository;
    
    let balance = await repo.findOne({ where: { productId, warehouseId } });
    
    if (!balance) {
      balance = repo.create({ productId, warehouseId, qtyOnHand: 0, qtyReserved: 0 });
    }
    
    balance.qtyOnHand = Number(balance.qtyOnHand) + qtyChange;
    
    if (type === 'receive') {
      balance.lastReceivedAt = new Date();
    } else {
      balance.lastIssuedAt = new Date();
    }
    
    await repo.save(balance);
  }

  async getStockBalance(productId?: number, warehouseId?: number) {
    const where: any = {};
    if (productId) where.productId = productId;
    if (warehouseId) where.warehouseId = warehouseId;
    
    return this.balanceRepository.find({ where });
  }

  async getFifoLayers(productId: number, warehouseId?: number) {
    const where: any = { productId, qtyRemaining: MoreThan(0) };
    if (warehouseId) where.warehouseId = warehouseId;
    
    return this.layerRepository.find({ where, order: { receivedAt: 'ASC' } });
  }

  async getStockCard(productId: number, warehouseId?: number, startDate?: string, endDate?: string) {
    // Build query for transactions
    let query = this.transactionRepository
      .createQueryBuilder('tx')
      .innerJoin('fifo_layers', 'layer', 'layer.id = tx.fifo_layer_id')
      .where('layer.product_id = :productId', { productId });
    
    if (warehouseId) {
      query = query.andWhere('layer.warehouse_id = :warehouseId', { warehouseId });
    }
    
    if (startDate) {
      query = query.andWhere('tx.created_at >= :startDate', { startDate: new Date(startDate) });
    }
    
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query = query.andWhere('tx.created_at <= :endDate', { endDate: end });
    }
    
    query = query.orderBy('tx.created_at', 'ASC').addOrderBy('tx.id', 'ASC');
    
    const transactions = await query
      .select([
        'tx.id as id',
        'tx.created_at as date',
        'tx.transaction_type as type',
        'tx.qty as qty',
        'tx.unit_cost as unit_cost',
        'tx.total_cost as total_cost',
        'tx.reference_type as reference_type',
        'tx.reference_id as reference_id',
        'layer.warehouse_id as warehouse_id',
      ])
      .getRawMany();
    
    // Calculate running balance
    let runningQty = 0;
    let runningValue = 0;
    
    // Get opening balance if startDate is provided
    if (startDate) {
      const openingQuery = this.transactionRepository
        .createQueryBuilder('tx')
        .innerJoin('fifo_layers', 'layer', 'layer.id = tx.fifo_layer_id')
        .where('layer.product_id = :productId', { productId })
        .andWhere('tx.created_at < :startDate', { startDate: new Date(startDate) });
      
      if (warehouseId) {
        openingQuery.andWhere('layer.warehouse_id = :warehouseId', { warehouseId });
      }
      
      const openingResult = await openingQuery
        .select([
          'SUM(CASE WHEN tx.transaction_type = \'IN\' THEN tx.qty ELSE -tx.qty END) as qty',
          'SUM(CASE WHEN tx.transaction_type = \'IN\' THEN tx.total_cost ELSE -tx.total_cost END) as value',
        ])
        .getRawOne();
      
      runningQty = parseFloat(openingResult?.qty || 0);
      runningValue = parseFloat(openingResult?.value || 0);
    }
    
    const openingBalance = { qty: runningQty, value: runningValue };
    
    // Map transactions with running balance
    const mappedTransactions = transactions.map((tx) => {
      const qty = parseFloat(tx.qty);
      const totalCost = parseFloat(tx.total_cost);
      
      if (tx.type === 'IN') {
        runningQty += qty;
        runningValue += totalCost;
      } else {
        runningQty -= qty;
        runningValue -= totalCost;
      }
      
      return {
        id: tx.id,
        date: tx.date,
        type: tx.type,
        referenceType: tx.reference_type,
        referenceId: tx.reference_id,
        warehouseId: tx.warehouse_id,
        qtyIn: tx.type === 'IN' ? qty : 0,
        qtyOut: tx.type === 'OUT' ? qty : 0,
        unitCost: parseFloat(tx.unit_cost),
        totalCost: totalCost,
        balanceQty: runningQty,
        balanceValue: runningValue,
      };
    });
    
    const closingBalance = { qty: runningQty, value: runningValue };
    
    // Get product info
    const balance = await this.balanceRepository.findOne({ 
      where: warehouseId ? { productId, warehouseId } : { productId } 
    });
    
    return {
      productId,
      warehouseId: warehouseId || null,
      openingBalance,
      closingBalance,
      currentBalance: {
        qty: balance?.qtyOnHand || 0,
        avgCost: balance?.avgCost || 0,
      },
      transactions: mappedTransactions,
    };
  }

  async getStockValuation(warehouseId?: number, categoryId?: number, asOfDate?: string) {
    // Build query to get valuation from FIFO layers
    let query = this.layerRepository
      .createQueryBuilder('layer')
      .innerJoin('products', 'p', 'p.id = layer.product_id')
      .leftJoin('product_categories', 'c', 'c.id = p.category_id')
      .leftJoin('warehouses', 'w', 'w.id = layer.warehouse_id');
    
    if (warehouseId) {
      query = query.andWhere('layer.warehouse_id = :warehouseId', { warehouseId });
    }
    
    if (categoryId) {
      query = query.andWhere('p.category_id = :categoryId', { categoryId });
    }
    
    // If asOfDate provided, calculate historical valuation
    if (asOfDate) {
      const asOf = new Date(asOfDate);
      asOf.setHours(23, 59, 59, 999);
      query = query.andWhere('layer.received_at <= :asOfDate', { asOfDate: asOf });
    }
    
    // Get detailed valuation by product
    const valuationQuery = this.layerRepository
      .createQueryBuilder('layer')
      .innerJoin('products', 'p', 'p.id = layer.product_id')
      .leftJoin('product_categories', 'c', 'c.id = p.category_id')
      .leftJoin('warehouses', 'w', 'w.id = layer.warehouse_id')
      .select([
        'p.id as product_id',
        'p.code as product_code',
        'p.name as product_name',
        'p.unit as unit',
        'c.id as category_id',
        'c.name as category_name',
        'layer.warehouse_id as warehouse_id',
        'w.name as warehouse_name',
        'SUM(layer.qty_remaining) as qty',
        'SUM(layer.qty_remaining * layer.unit_cost) as value',
        'CASE WHEN SUM(layer.qty_remaining) > 0 THEN SUM(layer.qty_remaining * layer.unit_cost) / SUM(layer.qty_remaining) ELSE 0 END as avg_cost',
      ])
      .where('layer.qty_remaining > 0')
      .groupBy('p.id, p.code, p.name, p.unit, c.id, c.name, layer.warehouse_id, w.name');
    
    if (warehouseId) {
      valuationQuery.andWhere('layer.warehouse_id = :warehouseId', { warehouseId });
    }
    
    if (categoryId) {
      valuationQuery.andWhere('p.category_id = :categoryId', { categoryId });
    }
    
    if (asOfDate) {
      const asOf = new Date(asOfDate);
      asOf.setHours(23, 59, 59, 999);
      valuationQuery.andWhere('layer.received_at <= :asOfDate', { asOfDate: asOf });
    }
    
    const items = await valuationQuery.orderBy('p.code', 'ASC').getRawMany();
    
    // Calculate summary by category
    const categoryMap = new Map<string, { categoryId: number; categoryName: string; qty: number; value: number }>();
    let totalQty = 0;
    let totalValue = 0;
    
    items.forEach(item => {
      const catName = item.category_name || 'ไม่ระบุหมวด';
      const catId = item.category_id || 0;
      const qty = parseFloat(item.qty) || 0;
      const value = parseFloat(item.value) || 0;
      
      if (!categoryMap.has(catName)) {
        categoryMap.set(catName, { categoryId: catId, categoryName: catName, qty: 0, value: 0 });
      }
      const cat = categoryMap.get(catName)!;
      cat.qty += qty;
      cat.value += value;
      
      totalQty += qty;
      totalValue += value;
    });
    
    const categoryBreakdown = Array.from(categoryMap.values())
      .sort((a, b) => b.value - a.value);
    
    // Calculate summary by warehouse
    const warehouseMap = new Map<string, { warehouseId: number; warehouseName: string; qty: number; value: number }>();
    
    items.forEach(item => {
      const whName = item.warehouse_name || 'ไม่ระบุคลัง';
      const whId = item.warehouse_id || 0;
      const qty = parseFloat(item.qty) || 0;
      const value = parseFloat(item.value) || 0;
      
      if (!warehouseMap.has(whName)) {
        warehouseMap.set(whName, { warehouseId: whId, warehouseName: whName, qty: 0, value: 0 });
      }
      const wh = warehouseMap.get(whName)!;
      wh.qty += qty;
      wh.value += value;
    });
    
    const warehouseBreakdown = Array.from(warehouseMap.values())
      .sort((a, b) => b.value - a.value);
    
    return {
      asOfDate: asOfDate || new Date().toISOString().split('T')[0],
      summary: {
        totalItems: items.length,
        totalQty,
        totalValue,
        avgCost: totalQty > 0 ? totalValue / totalQty : 0,
      },
      categoryBreakdown,
      warehouseBreakdown,
      items: items.map(item => ({
        productId: item.product_id,
        productCode: item.product_code,
        productName: item.product_name,
        unit: item.unit,
        categoryId: item.category_id,
        categoryName: item.category_name || 'ไม่ระบุหมวด',
        warehouseId: item.warehouse_id,
        warehouseName: item.warehouse_name || 'ไม่ระบุคลัง',
        qty: parseFloat(item.qty) || 0,
        avgCost: parseFloat(item.avg_cost) || 0,
        value: parseFloat(item.value) || 0,
      })),
    };
  }
}
