import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuotationCalculatorEntity } from './entities/quotation-calculator.entity';
import { CreateCalculatorDto, UpdateCalculatorDto } from './dto/quotation-calculator.dto';

@Injectable()
export class QuotationCalculatorService {
  constructor(
    @InjectRepository(QuotationCalculatorEntity)
    private readonly calculatorRepo: Repository<QuotationCalculatorEntity>,
  ) {}

  // Default template with formulas
  private getDefaultTemplate() {
    return {
      settings: {
        exchangeRate: 33,
        clearanceFee: 4500,
      },
      columnHeaders: [
        'ราคาของ $',
        'ราคาต่อรอบ $',
        'ค่าของ (xRate)',
        'ค่าบริการ 10%',
        'Freight $/Sample',
        'ค่าส่ง (xRate)',
        'ค่าเคลียร์/รอบ',
        'ราคารวม',
        'XDS ($)',
        'ราคารวม+XDS',
        'จำนวน (N)',
        'ราคาสุดท้าย',
      ],
      cells: [
        // Row 1 - Empty template row
        [
          { value: null },           // A: ราคาของ $
          { value: null },           // B: ราคาต่อรอบ $
          { value: null, formula: '=B1*$RATE' },  // C: ค่าของ (xRate)
          { value: null, formula: '=C1*1.1' },    // D: ค่าบริการ 10%
          { value: 180 },            // E: Freight $/Sample (default 180)
          { value: null, formula: '=E1*$RATE' },  // F: ค่าส่ง (xRate)
          { value: null, formula: '=$CLEARANCE' }, // G: ค่าเคลียร์/รอบ
          { value: null, formula: '=D1+F1+G1' },  // H: ราคารวม
          { value: null },           // I: XDS ($)
          { value: null, formula: '=H1+(I1*$RATE)' }, // J: ราคารวม+XDS
          { value: 1 },              // K: จำนวน (N)
          { value: null, formula: '=J1+(G1/K1)' }, // L: ราคาสุดท้าย
        ],
      ],
    };
  }

  async findByQuotationId(quotationId: number): Promise<QuotationCalculatorEntity | null> {
    return this.calculatorRepo.findOne({
      where: { quotationId },
    });
  }

  async create(dto: CreateCalculatorDto): Promise<QuotationCalculatorEntity> {
    // Check if already exists
    const existing = await this.findByQuotationId(dto.quotationId);
    if (existing) {
      return existing;
    }

    const calculator = this.calculatorRepo.create({
      quotationId: dto.quotationId,
      name: dto.name || 'Default',
      data: dto.data || this.getDefaultTemplate(),
    });

    return this.calculatorRepo.save(calculator);
  }

  async update(id: number, dto: UpdateCalculatorDto): Promise<QuotationCalculatorEntity> {
    const calculator = await this.calculatorRepo.findOne({ where: { id } });
    if (!calculator) {
      throw new NotFoundException('Calculator not found');
    }

    if (dto.name) calculator.name = dto.name;
    if (dto.data) calculator.data = dto.data;

    return this.calculatorRepo.save(calculator);
  }

  async updateByQuotationId(quotationId: number, dto: UpdateCalculatorDto): Promise<QuotationCalculatorEntity> {
    let calculator = await this.findByQuotationId(quotationId);
    
    if (!calculator) {
      // Create new if not exists
      calculator = await this.create({ quotationId, ...dto });
    } else {
      if (dto.name) calculator.name = dto.name;
      if (dto.data) calculator.data = dto.data;
      calculator = await this.calculatorRepo.save(calculator);
    }

    return calculator;
  }

  async delete(id: number): Promise<void> {
    const result = await this.calculatorRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Calculator not found');
    }
  }

  async getOrCreateByQuotationId(quotationId: number): Promise<QuotationCalculatorEntity> {
    let calculator = await this.findByQuotationId(quotationId);
    
    if (!calculator) {
      calculator = await this.create({ quotationId });
    }

    return calculator;
  }

  // Add a new row to the calculator
  async addRow(quotationId: number): Promise<QuotationCalculatorEntity> {
    const calculator = await this.getOrCreateByQuotationId(quotationId);
    
    const newRow = [
      { value: null },
      { value: null },
      { value: null, formula: `=B${calculator.data.cells.length + 1}*$RATE` },
      { value: null, formula: `=C${calculator.data.cells.length + 1}*1.1` },
      { value: 180 },
      { value: null, formula: `=E${calculator.data.cells.length + 1}*$RATE` },
      { value: null, formula: '=$CLEARANCE' },
      { value: null, formula: `=D${calculator.data.cells.length + 1}+F${calculator.data.cells.length + 1}+G${calculator.data.cells.length + 1}` },
      { value: null },
      { value: null, formula: `=H${calculator.data.cells.length + 1}+(I${calculator.data.cells.length + 1}*$RATE)` },
      { value: 1 },
      { value: null, formula: `=J${calculator.data.cells.length + 1}+(G${calculator.data.cells.length + 1}/K${calculator.data.cells.length + 1})` },
    ];

    calculator.data.cells.push(newRow);
    return this.calculatorRepo.save(calculator);
  }

  // Remove a row from the calculator
  async removeRow(quotationId: number, rowIndex: number): Promise<QuotationCalculatorEntity> {
    const calculator = await this.getOrCreateByQuotationId(quotationId);
    
    if (rowIndex >= 0 && rowIndex < calculator.data.cells.length) {
      calculator.data.cells.splice(rowIndex, 1);
    }

    return this.calculatorRepo.save(calculator);
  }
}
