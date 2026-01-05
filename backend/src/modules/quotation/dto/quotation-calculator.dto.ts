import { IsNumber, IsOptional, IsString, IsObject } from 'class-validator';

export class CreateCalculatorDto {
  @IsNumber()
  quotationId: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsObject()
  data?: {
    settings: {
      exchangeRate: number;
      clearanceFee: number;
    };
    cells: Array<Array<{
      value: string | number | null;
      formula?: string;
    }>>;
    columnHeaders?: string[];
  };
}

export class UpdateCalculatorDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsObject()
  data?: {
    settings: {
      exchangeRate: number;
      clearanceFee: number;
    };
    cells: Array<Array<{
      value: string | number | null;
      formula?: string;
    }>>;
    columnHeaders?: string[];
  };
}
