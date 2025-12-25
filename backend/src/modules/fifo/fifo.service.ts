import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, QueryRunner, Like } from 'typeorm';
import { FifoLayerEntity, FifoTransactionEntity, StockBalanceEntity, SerialNumberEntity } from './entities';

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
    @InjectRepository(SerialNumberEntity)
    private serialRepository: Repository<SerialNumberEntity>,
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

  async getStockMovement(startDate: string, endDate: string, warehouseId?: number, categoryId?: number) {
    // Get all transactions in date range with product info
    let query = this.transactionRepository
      .createQueryBuilder('tx')
      .innerJoin('fifo_layers', 'layer', 'layer.id = tx.fifo_layer_id')
      .innerJoin('products', 'p', 'p.id = layer.product_id')
      .leftJoin('product_categories', 'c', 'c.id = p.category_id')
      .leftJoin('warehouses', 'w', 'w.id = layer.warehouse_id')
      .where('tx.created_at >= :startDate', { startDate: new Date(startDate) })
      .andWhere('tx.created_at <= :endDate', { endDate: new Date(endDate + 'T23:59:59') });
    
    if (warehouseId) {
      query = query.andWhere('layer.warehouse_id = :warehouseId', { warehouseId });
    }
    
    if (categoryId) {
      query = query.andWhere('p.category_id = :categoryId', { categoryId });
    }
    
    // Aggregate by product
    const movementQuery = this.transactionRepository
      .createQueryBuilder('tx')
      .innerJoin('fifo_layers', 'layer', 'layer.id = tx.fifo_layer_id')
      .innerJoin('products', 'p', 'p.id = layer.product_id')
      .leftJoin('product_categories', 'c', 'c.id = p.category_id')
      .select([
        'p.id as product_id',
        'p.code as product_code',
        'p.name as product_name',
        'p.unit as unit',
        'c.name as category_name',
        'SUM(CASE WHEN tx.transaction_type = \'IN\' THEN tx.qty ELSE 0 END) as qty_in',
        'SUM(CASE WHEN tx.transaction_type = \'OUT\' THEN tx.qty ELSE 0 END) as qty_out',
        'SUM(CASE WHEN tx.transaction_type = \'IN\' THEN tx.total_cost ELSE 0 END) as value_in',
        'SUM(CASE WHEN tx.transaction_type = \'OUT\' THEN tx.total_cost ELSE 0 END) as value_out',
        'COUNT(tx.id) as transaction_count',
      ])
      .where('tx.created_at >= :startDate', { startDate: new Date(startDate) })
      .andWhere('tx.created_at <= :endDate', { endDate: new Date(endDate + 'T23:59:59') })
      .groupBy('p.id, p.code, p.name, p.unit, c.name');
    
    if (warehouseId) {
      movementQuery.andWhere('layer.warehouse_id = :warehouseId', { warehouseId });
    }
    
    if (categoryId) {
      movementQuery.andWhere('p.category_id = :categoryId', { categoryId });
    }
    
    const items = await movementQuery.orderBy('SUM(CASE WHEN tx.transaction_type = \'OUT\' THEN tx.qty ELSE 0 END)', 'DESC').getRawMany();
    
    // Calculate totals and classify Fast/Slow moving
    let totalQtyIn = 0, totalQtyOut = 0, totalValueIn = 0, totalValueOut = 0;
    
    const mappedItems = items.map(item => {
      const qtyIn = parseFloat(item.qty_in) || 0;
      const qtyOut = parseFloat(item.qty_out) || 0;
      const valueIn = parseFloat(item.value_in) || 0;
      const valueOut = parseFloat(item.value_out) || 0;
      
      totalQtyIn += qtyIn;
      totalQtyOut += qtyOut;
      totalValueIn += valueIn;
      totalValueOut += valueOut;
      
      return {
        productId: item.product_id,
        productCode: item.product_code,
        productName: item.product_name,
        unit: item.unit,
        categoryName: item.category_name || 'ไม่ระบุหมวด',
        qtyIn,
        qtyOut,
        qtyNet: qtyIn - qtyOut,
        valueIn,
        valueOut,
        valueNet: valueIn - valueOut,
        transactionCount: parseInt(item.transaction_count) || 0,
      };
    });
    
    // Classify items: Fast (top 20%), Medium (middle 60%), Slow (bottom 20%)
    const sortedByOut = [...mappedItems].sort((a, b) => b.qtyOut - a.qtyOut);
    const fastThreshold = Math.ceil(sortedByOut.length * 0.2);
    const slowThreshold = Math.ceil(sortedByOut.length * 0.8);
    
    const classifiedItems = mappedItems.map(item => {
      const rank = sortedByOut.findIndex(i => i.productId === item.productId);
      let movementClass: 'FAST' | 'MEDIUM' | 'SLOW' | 'NO_MOVEMENT';
      
      if (item.qtyOut === 0 && item.qtyIn === 0) {
        movementClass = 'NO_MOVEMENT';
      } else if (rank < fastThreshold) {
        movementClass = 'FAST';
      } else if (rank >= slowThreshold) {
        movementClass = 'SLOW';
      } else {
        movementClass = 'MEDIUM';
      }
      
      return { ...item, movementClass };
    });
    
    // Summary by movement class
    const movementSummary = {
      fast: classifiedItems.filter(i => i.movementClass === 'FAST').length,
      medium: classifiedItems.filter(i => i.movementClass === 'MEDIUM').length,
      slow: classifiedItems.filter(i => i.movementClass === 'SLOW').length,
      noMovement: classifiedItems.filter(i => i.movementClass === 'NO_MOVEMENT').length,
    };
    
    return {
      startDate,
      endDate,
      summary: {
        totalItems: items.length,
        totalQtyIn,
        totalQtyOut,
        totalValueIn,
        totalValueOut,
        ...movementSummary,
      },
      items: classifiedItems,
    };
  }

  async getReorderAlerts(warehouseId?: number, categoryId?: number) {
    // Get products with reorder point or min stock set
    let query = `
      SELECT 
        p.id as product_id,
        p.code as product_code,
        p.name as product_name,
        u.name as unit,
        p.min_stock,
        p.max_stock,
        p.reorder_point,
        p.standard_cost,
        c.name as category_name,
        w.id as warehouse_id,
        w.code as warehouse_code,
        w.name as warehouse_name,
        COALESCE(sb.qty_on_hand, 0) as qty_on_hand,
        COALESCE(sb.avg_cost, 0) as avg_cost
      FROM products p
      LEFT JOIN product_categories c ON c.id = p.category_id
      LEFT JOIN units u ON u.id = p.unit_id
      CROSS JOIN warehouses w
      LEFT JOIN stock_balances sb ON sb.product_id = p.id AND sb.warehouse_id = w.id
      WHERE p.is_active = true
        AND (p.reorder_point > 0 OR p.min_stock > 0)
    `;
    
    const params: any[] = [];
    let paramIndex = 1;
    
    if (warehouseId) {
      query += ` AND w.id = $${paramIndex++}`;
      params.push(warehouseId);
    }
    
    if (categoryId) {
      query += ` AND p.category_id = $${paramIndex++}`;
      params.push(categoryId);
    }
    
    query += ` ORDER BY p.code, w.code`;
    
    const items = await this.balanceRepository.query(query, params);
    
    // Classify alerts
    const alerts: any[] = [];
    let criticalCount = 0, warningCount = 0, normalCount = 0;
    
    items.forEach((item: any) => {
      const qtyOnHand = parseFloat(item.qty_on_hand) || 0;
      const minStock = parseFloat(item.min_stock) || 0;
      const maxStock = parseFloat(item.max_stock) || 0;
      const reorderPoint = parseFloat(item.reorder_point) || minStock;
      const standardCost = parseFloat(item.standard_cost) || parseFloat(item.avg_cost) || 0;
      
      let alertLevel: 'CRITICAL' | 'WARNING' | 'NORMAL' | 'OVERSTOCK';
      let suggestedOrderQty = 0;
      
      if (qtyOnHand <= 0) {
        alertLevel = 'CRITICAL';
        suggestedOrderQty = maxStock > 0 ? maxStock : reorderPoint * 2;
        criticalCount++;
      } else if (qtyOnHand <= minStock) {
        alertLevel = 'CRITICAL';
        suggestedOrderQty = (maxStock > 0 ? maxStock : reorderPoint * 2) - qtyOnHand;
        criticalCount++;
      } else if (qtyOnHand <= reorderPoint) {
        alertLevel = 'WARNING';
        suggestedOrderQty = (maxStock > 0 ? maxStock : reorderPoint * 2) - qtyOnHand;
        warningCount++;
      } else if (maxStock > 0 && qtyOnHand > maxStock) {
        alertLevel = 'OVERSTOCK';
        normalCount++;
      } else {
        alertLevel = 'NORMAL';
        normalCount++;
      }
      
      // Only include items that need attention
      if (alertLevel === 'CRITICAL' || alertLevel === 'WARNING') {
        alerts.push({
          productId: item.product_id,
          productCode: item.product_code,
          productName: item.product_name,
          unit: item.unit,
          categoryName: item.category_name || 'ไม่ระบุหมวด',
          warehouseId: item.warehouse_id,
          warehouseCode: item.warehouse_code,
          warehouseName: item.warehouse_name,
          qtyOnHand,
          minStock,
          maxStock,
          reorderPoint,
          avgCost: parseFloat(item.avg_cost) || 0,
          alertLevel,
          suggestedOrderQty: Math.max(0, Math.ceil(suggestedOrderQty)),
          estimatedCost: Math.max(0, suggestedOrderQty) * standardCost,
        });
      }
    });
    
    // Sort by alert level (CRITICAL first) then by qty
    alerts.sort((a, b) => {
      if (a.alertLevel === 'CRITICAL' && b.alertLevel !== 'CRITICAL') return -1;
      if (a.alertLevel !== 'CRITICAL' && b.alertLevel === 'CRITICAL') return 1;
      return a.qtyOnHand - b.qtyOnHand;
    });
    
    return {
      summary: {
        totalProducts: items.length,
        critical: criticalCount,
        warning: warningCount,
        normal: normalCount,
        totalAlerts: alerts.length,
        totalEstimatedCost: alerts.reduce((sum, a) => sum + a.estimatedCost, 0),
      },
      alerts,
    };
  }

  async getExpiryAlerts(daysAhead: number = 90, warehouseId?: number) {
    // Get items with expiry dates approaching or past
    let query = `
      SELECT 
        gri.id as item_id,
        gri.lot_no,
        gri.expiry_date,
        gri.qty,
        gri.item_code,
        gri.item_name,
        gr.doc_full_no as gr_doc_no,
        gr.warehouse_id,
        w.name as warehouse_name,
        p.id as product_id,
        p.code as product_code,
        p.name as product_name,
        c.name as category_name
      FROM goods_receipt_items gri
      INNER JOIN goods_receipts gr ON gr.id = gri.goods_receipt_id
      LEFT JOIN products p ON p.id = gri.product_id
      LEFT JOIN product_categories c ON c.id = p.category_id
      LEFT JOIN warehouses w ON w.id = gr.warehouse_id
      WHERE gri.expiry_date IS NOT NULL
        AND gr.status = 'POSTED'
        AND gri.qty > 0
    `;
    
    const params: any[] = [];
    let paramIndex = 1;
    
    if (warehouseId) {
      query += ` AND gr.warehouse_id = $${paramIndex++}`;
      params.push(warehouseId);
    }
    
    query += ` ORDER BY gri.expiry_date ASC`;
    
    const items = await this.balanceRepository.query(query, params);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const alertDate = new Date(today);
    alertDate.setDate(alertDate.getDate() + daysAhead);
    
    const alerts: any[] = [];
    let expiredCount = 0, warningCount = 0, normalCount = 0;
    
    items.forEach((item: any) => {
      const expiryDate = new Date(item.expiry_date);
      expiryDate.setHours(0, 0, 0, 0);
      
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      let alertLevel: 'EXPIRED' | 'CRITICAL' | 'WARNING' | 'NORMAL';
      
      if (daysUntilExpiry < 0) {
        alertLevel = 'EXPIRED';
        expiredCount++;
      } else if (daysUntilExpiry <= 30) {
        alertLevel = 'CRITICAL';
        warningCount++;
      } else if (daysUntilExpiry <= daysAhead) {
        alertLevel = 'WARNING';
        warningCount++;
      } else {
        alertLevel = 'NORMAL';
        normalCount++;
        return; // Don't include normal items in alerts
      }
      
      alerts.push({
        itemId: item.item_id,
        productId: item.product_id,
        productCode: item.product_code || item.item_code,
        productName: item.product_name || item.item_name,
        categoryName: item.category_name || 'ไม่ระบุหมวด',
        warehouseId: item.warehouse_id,
        warehouseName: item.warehouse_name,
        lotNo: item.lot_no,
        expiryDate: item.expiry_date,
        qty: parseFloat(item.qty) || 0,
        grDocNo: item.gr_doc_no,
        daysUntilExpiry,
        alertLevel,
      });
    });
    
    // Sort by days until expiry (expired first, then closest to expiry)
    alerts.sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);
    
    return {
      summary: {
        totalItems: items.length,
        expired: expiredCount,
        warning: warningCount,
        normal: normalCount,
        totalAlerts: alerts.length,
      },
      alerts,
    };
  }

  // ==================== Serial Number Methods ====================

  async getSerialNumbers(filters: {
    productId?: number;
    warehouseId?: number;
    status?: string;
    search?: string;
  }) {
    const where: any = {};
    
    if (filters.productId) where.productId = filters.productId;
    if (filters.warehouseId) where.warehouseId = filters.warehouseId;
    if (filters.status) where.status = filters.status;
    if (filters.search) where.serialNo = Like(`%${filters.search}%`);
    
    const serials = await this.serialRepository.find({
      where,
      relations: ['product'],
      order: { createdAt: 'DESC' },
      take: 500,
    });
    
    return serials.map(s => ({
      id: s.id,
      serialNo: s.serialNo,
      productId: s.productId,
      productCode: s.product?.code,
      productName: s.product?.name,
      warehouseId: s.warehouseId,
      status: s.status,
      grId: s.grId,
      grDocNo: s.grDocNo,
      receivedDate: s.receivedDate,
      invoiceId: s.invoiceId,
      invoiceDocNo: s.invoiceDocNo,
      soldDate: s.soldDate,
      lotNo: s.lotNo,
      expiryDate: s.expiryDate,
      notes: s.notes,
      createdAt: s.createdAt,
    }));
  }

  async createSerialNumber(data: {
    productId: number;
    serialNo: string;
    warehouseId?: number;
    grId?: number;
    grDocNo?: string;
    lotNo?: string;
    expiryDate?: string;
    notes?: string;
    createdBy?: number;
  }) {
    // Check if serial already exists for this product
    const existing = await this.serialRepository.findOne({
      where: { productId: data.productId, serialNo: data.serialNo },
    });
    
    if (existing) {
      throw new BadRequestException(`Serial number ${data.serialNo} already exists for this product`);
    }
    
    const serial = this.serialRepository.create({
      productId: data.productId,
      serialNo: data.serialNo,
      warehouseId: data.warehouseId,
      status: 'IN_STOCK',
      grId: data.grId,
      grDocNo: data.grDocNo,
      receivedDate: new Date(),
      lotNo: data.lotNo,
      expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
      notes: data.notes,
      createdBy: data.createdBy,
    });
    
    return this.serialRepository.save(serial);
  }

  async createBulkSerialNumbers(data: {
    productId: number;
    serialNumbers: string[];
    warehouseId?: number;
    grId?: number;
    grDocNo?: string;
    lotNo?: string;
    expiryDate?: string;
    createdBy?: number;
  }) {
    const results = { created: 0, skipped: 0, errors: [] as string[] };
    
    for (const serialNo of data.serialNumbers) {
      try {
        await this.createSerialNumber({
          ...data,
          serialNo: serialNo.trim(),
        });
        results.created++;
      } catch (error: any) {
        results.skipped++;
        results.errors.push(`${serialNo}: ${error.message}`);
      }
    }
    
    return results;
  }

  async updateSerialStatus(id: number, status: string, data?: {
    invoiceId?: number;
    invoiceDocNo?: string;
    notes?: string;
  }) {
    const serial = await this.serialRepository.findOne({ where: { id } });
    if (!serial) {
      throw new BadRequestException('Serial number not found');
    }
    
    serial.status = status;
    if (data?.invoiceId) serial.invoiceId = data.invoiceId;
    if (data?.invoiceDocNo) serial.invoiceDocNo = data.invoiceDocNo;
    if (data?.notes) serial.notes = data.notes;
    if (status === 'SOLD') serial.soldDate = new Date();
    
    return this.serialRepository.save(serial);
  }

  async lookupSerial(serialNo: string) {
    const serial = await this.serialRepository.findOne({
      where: { serialNo },
      relations: ['product'],
    });
    
    if (!serial) {
      return null;
    }
    
    return {
      id: serial.id,
      serialNo: serial.serialNo,
      productId: serial.productId,
      productCode: serial.product?.code,
      productName: serial.product?.name,
      warehouseId: serial.warehouseId,
      status: serial.status,
      grDocNo: serial.grDocNo,
      receivedDate: serial.receivedDate,
      invoiceDocNo: serial.invoiceDocNo,
      soldDate: serial.soldDate,
      lotNo: serial.lotNo,
      expiryDate: serial.expiryDate,
    };
  }
}
