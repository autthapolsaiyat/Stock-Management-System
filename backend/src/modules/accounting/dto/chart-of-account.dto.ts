import { IsString, IsEnum, IsOptional, IsNumber, IsBoolean, MaxLength } from 'class-validator';
import { AccountType, AccountGroup, BalanceType } from '../entities/chart-of-account.entity';

export class CreateChartOfAccountDto {
  @IsString()
  @MaxLength(20)
  code: string;

  @IsString()
  @MaxLength(200)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  nameEn?: string;

  @IsEnum(AccountType)
  accountType: AccountType;

  @IsEnum(AccountGroup)
  accountGroup: AccountGroup;

  @IsEnum(BalanceType)
  balanceType: BalanceType;

  @IsOptional()
  @IsNumber()
  parentId?: number;

  @IsOptional()
  @IsNumber()
  level?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isControl?: boolean;

  @IsOptional()
  @IsString()
  controlType?: string;
}

export class UpdateChartOfAccountDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  nameEn?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  parentId?: number;
}
