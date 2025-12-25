import { IsString, IsEnum, IsOptional, IsNumber, IsArray, ValidateNested, IsDateString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '../entities/payment-receipt.entity';

// Payment Receipt Item
export class PaymentReceiptItemDto {
  @IsNumber()
  lineNo: number;

  @IsNumber()
  invoiceId: number;

  @IsNumber()
  paymentAmount: number;

  @IsOptional()
  @IsNumber()
  discountAmount?: number;

  @IsOptional()
  @IsNumber()
  withholdingTax?: number;

  @IsOptional()
  @IsString()
  remark?: string;
}

// Create Payment Receipt
export class CreatePaymentReceiptDto {
  @IsDateString()
  docDate: string;

  @IsNumber()
  customerId: number;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsOptional()
  @IsNumber()
  bankAccountId?: number;

  @IsOptional()
  @IsString()
  chequeNo?: string;

  @IsOptional()
  @IsDateString()
  chequeDate?: string;

  @IsOptional()
  @IsString()
  chequeBank?: string;

  @IsOptional()
  @IsString()
  referenceNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  remark?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentReceiptItemDto)
  items: PaymentReceiptItemDto[];
}

// Payment Voucher Item
export class PaymentVoucherItemDto {
  @IsNumber()
  lineNo: number;

  @IsString()
  referenceType: string; // GOODS_RECEIPT, PURCHASE_ORDER

  @IsNumber()
  referenceId: number;

  @IsNumber()
  paymentAmount: number;

  @IsOptional()
  @IsNumber()
  discountAmount?: number;

  @IsOptional()
  @IsNumber()
  withholdingTax?: number;

  @IsOptional()
  @IsString()
  remark?: string;
}

// Create Payment Voucher
export class CreatePaymentVoucherDto {
  @IsDateString()
  docDate: string;

  @IsNumber()
  supplierId: number;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsOptional()
  @IsNumber()
  bankAccountId?: number;

  @IsOptional()
  @IsString()
  chequeNo?: string;

  @IsOptional()
  @IsDateString()
  chequeDate?: string;

  @IsOptional()
  @IsString()
  referenceNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  remark?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentVoucherItemDto)
  items: PaymentVoucherItemDto[];
}
