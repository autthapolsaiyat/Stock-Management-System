import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { QuotationCalculatorService } from './quotation-calculator.service';
import { CreateCalculatorDto, UpdateCalculatorDto } from './dto/quotation-calculator.dto';

@Controller('api/quotation-calculators')
@UseGuards(JwtAuthGuard)
export class QuotationCalculatorController {
  constructor(private readonly calculatorService: QuotationCalculatorService) {}

  // Get calculator by quotation ID
  @Get('quotation/:quotationId')
  async getByQuotationId(@Param('quotationId', ParseIntPipe) quotationId: number) {
    return this.calculatorService.getOrCreateByQuotationId(quotationId);
  }

  // Create new calculator
  @Post()
  async create(@Body() dto: CreateCalculatorDto) {
    return this.calculatorService.create(dto);
  }

  // Update calculator by ID
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCalculatorDto,
  ) {
    return this.calculatorService.update(id, dto);
  }

  // Update calculator by quotation ID
  @Put('quotation/:quotationId')
  async updateByQuotationId(
    @Param('quotationId', ParseIntPipe) quotationId: number,
    @Body() dto: UpdateCalculatorDto,
  ) {
    return this.calculatorService.updateByQuotationId(quotationId, dto);
  }

  // Delete calculator
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.calculatorService.delete(id);
    return { message: 'Calculator deleted successfully' };
  }

  // Add row to calculator
  @Post('quotation/:quotationId/row')
  async addRow(@Param('quotationId', ParseIntPipe) quotationId: number) {
    return this.calculatorService.addRow(quotationId);
  }

  // Remove row from calculator
  @Delete('quotation/:quotationId/row/:rowIndex')
  async removeRow(
    @Param('quotationId', ParseIntPipe) quotationId: number,
    @Param('rowIndex', ParseIntPipe) rowIndex: number,
  ) {
    return this.calculatorService.removeRow(quotationId, rowIndex);
  }
}
