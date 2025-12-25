import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { ProductCategoryEntity } from './entities/product-category.entity';
import { UnitEntity } from './entities/unit.entity';
import { CreateProductDto, UpdateProductDto, CreateCategoryDto, CreateUnitDto } from './dto/product.dto';
import { AuditLogService } from '../audit-log/audit-log.service';

export interface AuditContext {
  userId: number;
  userName?: string;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity) private productRepository: Repository<ProductEntity>,
    @InjectRepository(ProductCategoryEntity) private categoryRepository: Repository<ProductCategoryEntity>,
    @InjectRepository(UnitEntity) private unitRepository: Repository<UnitEntity>,
    private dataSource: DataSource,
    private auditLogService: AuditLogService,
  ) {}

  async findAll(categoryId?: number, quotationType?: string) {
    const where: any = { isActive: true };
    if (categoryId) where.categoryId = categoryId;
    if (quotationType) where.quotationType = quotationType;
    return this.productRepository.find({ where, relations: ['category', 'unit'], order: { id: 'DESC' } });
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({ where: { id }, relations: ['category', 'unit'] });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async create(dto: CreateProductDto, ctx?: AuditContext) {
    const existing = await this.productRepository.findOne({ where: { code: dto.code } });
    if (existing) throw new ConflictException('Product code already exists');

    const product = this.productRepository.create({ ...dto, isActive: true });
    const savedProduct = await this.productRepository.save(product);
    
    // Audit Log
    if (ctx) {
      await this.auditLogService.log({
        module: 'PRODUCT',
        action: 'CREATE',
        documentId: savedProduct.id,
        documentNo: savedProduct.code,
        userId: ctx.userId,
        userName: ctx.userName,
        ipAddress: ctx.ipAddress,
        userAgent: ctx.userAgent,
        details: { name: savedProduct.name, code: savedProduct.code },
      });
    }
    
    return this.findOne(savedProduct.id);
  }

  async update(id: number, dto: UpdateProductDto, ctx?: AuditContext) {
    const product = await this.findOne(id);
    const oldData = { ...product };
    Object.assign(product, dto);
    await this.productRepository.save(product);
    
    // Audit Log
    if (ctx) {
      await this.auditLogService.log({
        module: 'PRODUCT',
        action: 'UPDATE',
        documentId: id,
        documentNo: product.code,
        userId: ctx.userId,
        userName: ctx.userName,
        ipAddress: ctx.ipAddress,
        userAgent: ctx.userAgent,
        details: { before: { name: oldData.name, sellingPrice: oldData.sellingPrice }, after: { name: product.name, sellingPrice: product.sellingPrice } },
      });
    }
    
    return this.findOne(id);
  }

  async delete(id: number, ctx?: AuditContext) {
    const product = await this.findOne(id);
    product.isActive = false;
    
    // Audit Log
    if (ctx) {
      await this.auditLogService.log({
        module: 'PRODUCT',
        action: 'DELETE',
        documentId: id,
        documentNo: product.code,
        userId: ctx.userId,
        userName: ctx.userName,
        ipAddress: ctx.ipAddress,
        userAgent: ctx.userAgent,
        details: { name: product.name },
      });
    }
    
    return this.productRepository.save(product);
  }

  // Categories
  async findAllCategories() {
    return this.categoryRepository.find({ where: { isActive: true } });
  }

  async createCategory(dto: CreateCategoryDto, ctx?: AuditContext) {
    const category = this.categoryRepository.create({ ...dto, isActive: true });
    const saved = await this.categoryRepository.save(category);
    
    if (ctx) {
      await this.auditLogService.log({
        module: 'CATEGORY',
        action: 'CREATE',
        documentId: saved.id,
        documentNo: saved.name,
        userId: ctx.userId,
        userName: ctx.userName,
        ipAddress: ctx.ipAddress,
        userAgent: ctx.userAgent,
        details: { name: saved.name },
      });
    }
    
    return saved;
  }

  async updateCategory(id: number, dto: any, ctx?: AuditContext) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    Object.assign(category, dto);
    const saved = await this.categoryRepository.save(category);
    
    if (ctx) {
      await this.auditLogService.log({
        module: 'CATEGORY',
        action: 'UPDATE',
        documentId: id,
        documentNo: saved.name,
        userId: ctx.userId,
        userName: ctx.userName,
        ipAddress: ctx.ipAddress,
        userAgent: ctx.userAgent,
        details: { name: saved.name },
      });
    }
    
    return saved;
  }

  async deleteCategory(id: number, ctx?: AuditContext) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    category.isActive = false;
    
    if (ctx) {
      await this.auditLogService.log({
        module: 'CATEGORY',
        action: 'DELETE',
        documentId: id,
        documentNo: category.name,
        userId: ctx.userId,
        userName: ctx.userName,
        ipAddress: ctx.ipAddress,
        userAgent: ctx.userAgent,
        details: { name: category.name },
      });
    }
    
    return this.categoryRepository.save(category);
  }

  // Units
  async findAllUnits() {
    return this.unitRepository.find({ where: { isActive: true } });
  }

  async createUnit(dto: CreateUnitDto, ctx?: AuditContext) {
    const existing = await this.unitRepository.findOne({ where: { name: dto.name } });
    if (existing) throw new ConflictException('Unit name already exists');
    const unit = this.unitRepository.create({ ...dto, isActive: true });
    const saved = await this.unitRepository.save(unit);
    
    if (ctx) {
      await this.auditLogService.log({
        module: 'UNIT',
        action: 'CREATE',
        documentId: saved.id,
        documentNo: saved.name,
        userId: ctx.userId,
        userName: ctx.userName,
        ipAddress: ctx.ipAddress,
        userAgent: ctx.userAgent,
        details: { name: saved.name },
      });
    }
    
    return saved;
  }

  async updateUnit(id: number, dto: any, ctx?: AuditContext) {
    const unit = await this.unitRepository.findOne({ where: { id } });
    if (!unit) throw new NotFoundException('Unit not found');
    Object.assign(unit, dto);
    const saved = await this.unitRepository.save(unit);
    
    if (ctx) {
      await this.auditLogService.log({
        module: 'UNIT',
        action: 'UPDATE',
        documentId: id,
        documentNo: saved.name,
        userId: ctx.userId,
        userName: ctx.userName,
        ipAddress: ctx.ipAddress,
        userAgent: ctx.userAgent,
        details: { name: saved.name },
      });
    }
    
    return saved;
  }

  async deleteUnit(id: number, ctx?: AuditContext) {
    const unit = await this.unitRepository.findOne({ where: { id } });
    if (!unit) throw new NotFoundException('Unit not found');
    unit.isActive = false;
    
    if (ctx) {
      await this.auditLogService.log({
        module: 'UNIT',
        action: 'DELETE',
        documentId: id,
        documentNo: unit.name,
        userId: ctx.userId,
        userName: ctx.userName,
        ipAddress: ctx.ipAddress,
        userAgent: ctx.userAgent,
        details: { name: unit.name },
      });
    }
    
    return this.unitRepository.save(unit);
  }

  /**
   * Get price history for all products from approved/completed quotations
   * Returns: { productId: { salesCount, minPrice, maxPrice, avgPrice, lastPrice, yearlyData } }
   */
  async getPriceHistory(): Promise<Record<number, any>> {
    const query = `
      SELECT 
        qi.product_id as "productId",
        COUNT(DISTINCT q.id) as "salesCount",
        MIN(qi.unit_price) as "minPrice",
        MAX(qi.unit_price) as "maxPrice",
        AVG(qi.unit_price) as "avgPrice",
        EXTRACT(YEAR FROM q.doc_date) as "year"
      FROM quotation_items qi
      JOIN quotations q ON qi.quotation_id = q.id
      WHERE q.status IN ('APPROVED', 'COMPLETED', 'INVOICED', 'PAID')
        AND qi.product_id IS NOT NULL
        AND qi.source_type = 'MASTER'
      GROUP BY qi.product_id, EXTRACT(YEAR FROM q.doc_date)
      ORDER BY qi.product_id, "year" DESC
    `;

    const results = await this.dataSource.query(query);
    
    // Group by productId
    const priceHistory: Record<number, any> = {};
    
    for (const row of results) {
      const productId = row.productId;
      
      if (!priceHistory[productId]) {
        priceHistory[productId] = {
          salesCount: 0,
          minPrice: null,
          maxPrice: null,
          avgPrice: null,
          yearlyData: [],
        };
      }
      
      // Accumulate sales count
      priceHistory[productId].salesCount += parseInt(row.salesCount);
      
      // Track overall min/max
      const minPrice = parseFloat(row.minPrice);
      const maxPrice = parseFloat(row.maxPrice);
      
      if (priceHistory[productId].minPrice === null || minPrice < priceHistory[productId].minPrice) {
        priceHistory[productId].minPrice = minPrice;
      }
      if (priceHistory[productId].maxPrice === null || maxPrice > priceHistory[productId].maxPrice) {
        priceHistory[productId].maxPrice = maxPrice;
      }
      
      // Add yearly data
      priceHistory[productId].yearlyData.push({
        year: parseInt(row.year),
        salesCount: parseInt(row.salesCount),
        minPrice: minPrice,
        maxPrice: maxPrice,
        avgPrice: parseFloat(row.avgPrice),
      });
    }
    
    // Calculate overall average
    for (const productId in priceHistory) {
      const data = priceHistory[productId];
      if (data.yearlyData.length > 0) {
        const totalAvg = data.yearlyData.reduce((sum: number, y: any) => sum + y.avgPrice * y.salesCount, 0);
        data.avgPrice = totalAvg / data.salesCount;
      }
    }
    
    return priceHistory;
  }

  /**
   * Get price history for a specific product
   */
  async getProductPriceHistory(productId: number) {
    const query = `
      SELECT 
        qi.unit_price as "unitPrice",
        qi.qty,
        qi.line_total as "lineTotal",
        q.doc_full_no as "docNo",
        q.doc_date as "docDate",
        q.status,
        c.name as "customerName"
      FROM quotation_items qi
      JOIN quotations q ON qi.quotation_id = q.id
      LEFT JOIN customers c ON q.customer_id = c.id
      WHERE q.status IN ('APPROVED', 'COMPLETED', 'INVOICED', 'PAID')
        AND qi.product_id = $1
        AND qi.source_type = 'MASTER'
      ORDER BY q.doc_date DESC
      LIMIT 20
    `;

    const results = await this.dataSource.query(query, [productId]);
    
    // Calculate summary
    const summary = {
      salesCount: results.length,
      minPrice: results.length > 0 ? Math.min(...results.map((r: any) => parseFloat(r.unitPrice))) : 0,
      maxPrice: results.length > 0 ? Math.max(...results.map((r: any) => parseFloat(r.unitPrice))) : 0,
      avgPrice: results.length > 0 
        ? results.reduce((sum: number, r: any) => sum + parseFloat(r.unitPrice), 0) / results.length 
        : 0,
      lastPrice: results.length > 0 ? parseFloat(results[0].unitPrice) : 0,
      history: results.map((r: any) => ({
        unitPrice: parseFloat(r.unitPrice),
        qty: parseFloat(r.qty),
        lineTotal: parseFloat(r.lineTotal),
        docNo: r.docNo,
        docDate: r.docDate,
        customerName: r.customerName,
      })),
    };
    
    return summary;
  }
}
