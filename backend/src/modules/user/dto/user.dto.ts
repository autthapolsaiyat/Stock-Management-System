import { IsString, IsEmail, IsOptional, IsArray, IsNumber, MinLength, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'john' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  fullName: string;

  @ApiPropertyOptional({ example: 'Johnny' })
  @IsString()
  @IsOptional()
  nickname?: string;

  @ApiPropertyOptional({ example: 'john@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: [1] })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  roleIds?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  allowMultipleSessions?: boolean;
}

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  nickname?: string;

  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional()
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  roleIds?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  allowMultipleSessions?: boolean;
}
