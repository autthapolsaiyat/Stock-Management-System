import { IsString, IsEnum, IsOptional, IsNumber, IsDate, IsArray, ValidateNested, IsDateString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { JournalType, ReferenceType } from '../entities/journal-entry.entity';

export class JournalEntryLineDto {
  @IsNumber()
  lineNo: number;

  @IsNumber()
  accountId: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  debitAmount: number;

  @IsNumber()
  creditAmount: number;

  @IsOptional()
  @IsString()
  partnerType?: string;

  @IsOptional()
  @IsNumber()
  partnerId?: number;

  @IsOptional()
  @IsString()
  partnerName?: string;

  @IsOptional()
  @IsString()
  costCenter?: string;

  @IsOptional()
  @IsNumber()
  productId?: number;

  @IsOptional()
  @IsNumber()
  warehouseId?: number;
}

export class CreateJournalEntryDto {
  @IsOptional()
  @IsEnum(JournalType)
  journalType?: JournalType;

  @IsDateString()
  docDate: string;

  @IsOptional()
  @IsDateString()
  postingDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsEnum(ReferenceType)
  referenceType?: ReferenceType;

  @IsOptional()
  @IsNumber()
  referenceId?: number;

  @IsOptional()
  @IsString()
  referenceDocNo?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JournalEntryLineDto)
  lines: JournalEntryLineDto[];
}

export class UpdateJournalEntryDto {
  @IsOptional()
  @IsDateString()
  docDate?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JournalEntryLineDto)
  lines?: JournalEntryLineDto[];
}
