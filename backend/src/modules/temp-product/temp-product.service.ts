import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { TempProductEntity } from './entities';

@Injectable()
export class TempProductService {
  constructor(
    @InjectRepository(TempProductEntity)
    private tempProductRepository: Repository<TempProductEntity>,
    private dataSource: DataSource,
  ) {}

  async findAll(status?: string) {
    const where: any = {};
    if (status) where.status = status;
    return this.tempProductRepository.find({ where, order: { createdAt: 'DESC' } });
  }

  async findByQuotation(quotationId: number) {
    return this.tempProductRepository.find({ 
      where: { sourceQuotationId: quotationId },
      order: { createdAt: 'ASC' } 
    });
  }

  async findOne(id: number) {
    const tempProduct = await this.tempProductRepository.findOne({ where: { id } });
    if (!tempProduct) throw new NotFoundException('Temp product not found');
    return tempProduct;
  }

  async generateTempCode(): Promise<string> {
    const now = new Date();
    const yymm = now.getFullYear().toString().slice(-2) + (now.getMonth() + 1).toString().padStart(2, '0');
    
    const lastTemp = await this.tempProductRepository
      .createQueryBuilder('tp')
      .where('tp.temp_code LIKE :prefix', { prefix: `TEMP-${yymm}-%` })
      .orderBy('tp.id', 'DESC')
      .getOne();
    
    let seq = 1;
    if (lastTemp) {
      const lastSeq = parseInt(lastTemp.tempCode.split('-')[2], 10);
      seq = lastSeq + 1;
    }
    
    return `TEMP-${yymm}-${seq.toString().padStart(3, '0')}`;
  }

  async create(dto: any, userId: number) {
    const tempCode = await this.generateTempCode();
    
    const tempProduct = this.tempProductRepository.create({
      tempCode,
      name: dto.name,
      description: dto.description,
      brand: dto.brand,
      unit: dto.unit || 'ea',
      estimatedCost: dto.estimatedCost || 0,
      quotedPrice: dto.quotedPrice || 0,
      sourceQuotationId: dto.sourceQuotationId,
      sourceQtItemId: dto.sourceQtItemId,
      internalNote: dto.internalNote,
      supplierNote: dto.supplierNote,
      status: 'PENDING',
      createdBy: userId,
    });
    
    return this.tempProductRepository.save(tempProduct);
  }

  async update(id: number, dto: any, userId: number) {
    const tempProduct = await this.findOne(id);
    
    if (tempProduct.status !== 'PENDING') {
      throw new BadRequestException('Cannot update activated or cancelled temp product');
    }
    
    Object.assign(tempProduct, {
      name: dto.name ?? tempProduct.name,
      description: dto.description ?? tempProduct.description,
      brand: dto.brand ?? tempProduct.brand,
      unit: dto.unit ?? tempProduct.unit,
      estimatedCost: dto.estimatedCost ?? tempProduct.estimatedCost,
      quotedPrice: dto.quotedPrice ?? tempProduct.quotedPrice,
      internalNote: dto.internalNote ?? tempProduct.internalNote,
      supplierNote: dto.supplierNote ?? tempProduct.supplierNote,
      updatedBy: userId,
    });
    
    return this.tempProductRepository.save(tempProduct);
  }

  async activate(id: number, dto: { newProductId: number; grId?: number }, userId: number) {
    const tempProduct = await this.findOne(id);
    
    if (tempProduct.status !== 'PENDING') {
      throw new BadRequestException('Temp product is not pending');
    }
    
    tempProduct.status = 'ACTIVATED';
    tempProduct.activatedToProductId = dto.newProductId;
    tempProduct.activatedFromGrId = dto.grId;
    tempProduct.activatedAt = new Date();
    tempProduct.activatedBy = userId;
    tempProduct.updatedBy = userId;
    
    return this.tempProductRepository.save(tempProduct);
  }

  async cancel(id: number, userId: number) {
    const tempProduct = await this.findOne(id);
    
    if (tempProduct.status !== 'PENDING') {
      throw new BadRequestException('Only pending temp products can be cancelled');
    }
    
    tempProduct.status = 'CANCELLED';
    tempProduct.updatedBy = userId;
    
    return this.tempProductRepository.save(tempProduct);
  }
}
