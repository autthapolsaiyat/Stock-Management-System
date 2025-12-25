import { IsString, IsEnum, IsOptional, IsNumber, IsBoolean, IsDateString, MaxLength } from 'class-validator';
import { BankAccountType } from '../entities/bank-account.entity';

export class CreateBankAccountDto {
  @IsString()
  @MaxLength(20)
  code: string;

  @IsString()
  @MaxLength(200)
  name: string;

  @IsString()
  @MaxLength(100)
  bankName: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  bankBranch?: string;

  @IsString()
  @MaxLength(30)
  accountNumber: string;

  @IsEnum(BankAccountType)
  accountType: BankAccountType;

  @IsNumber()
  chartOfAccountId: number;

  @IsOptional()
  @IsNumber()
  openingBalance?: number;

  @IsOptional()
  @IsDateString()
  openingBalanceDate?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateBankAccountDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  bankBranch?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  description?: string;
}
