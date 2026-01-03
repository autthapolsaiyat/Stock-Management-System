import { IsOptional, IsNumber, IsString, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LeaveType, LeaveDuration } from '../entities/leave-record.entity';

export class ClockInDto {
  @ApiPropertyOptional({ description: 'Latitude from GPS' })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ description: 'Longitude from GPS' })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({ description: 'Note/Remark' })
  @IsOptional()
  @IsString()
  note?: string;
}

export class ClockOutDto {
  @ApiPropertyOptional({ description: 'Latitude from GPS' })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ description: 'Longitude from GPS' })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({ description: 'Note/Remark' })
  @IsOptional()
  @IsString()
  note?: string;
}

export class CreateLeaveDto {
  @ApiProperty({ description: 'Leave date (YYYY-MM-DD)' })
  @IsDateString()
  leaveDate: string;

  @ApiProperty({ enum: LeaveType, description: 'Type of leave' })
  @IsEnum(LeaveType)
  leaveType: LeaveType;

  @ApiPropertyOptional({ enum: LeaveDuration, description: 'Duration: FULL, HALF_AM, HALF_PM' })
  @IsOptional()
  @IsEnum(LeaveDuration)
  leaveDuration?: LeaveDuration;

  @ApiPropertyOptional({ description: 'Reason for leave' })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class UpdateLeaveDto {
  @ApiPropertyOptional({ enum: LeaveType })
  @IsOptional()
  @IsEnum(LeaveType)
  leaveType?: LeaveType;

  @ApiPropertyOptional({ enum: LeaveDuration })
  @IsOptional()
  @IsEnum(LeaveDuration)
  leaveDuration?: LeaveDuration;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;
}

export class CheckinSettingsDto {
  @ApiPropertyOptional({ description: 'Clock in time (HH:mm)', example: '09:00' })
  @IsOptional()
  @IsString()
  clockInTime?: string;

  @ApiPropertyOptional({ description: 'Clock out time (HH:mm)', example: '18:00' })
  @IsOptional()
  @IsString()
  clockOutTime?: string;

  @ApiPropertyOptional({ description: 'Grace period in minutes', example: 15 })
  @IsOptional()
  @IsNumber()
  gracePeriodMinutes?: number;

  @ApiPropertyOptional({ description: 'LINE Notify Token (legacy)' })
  @IsOptional()
  @IsString()
  lineNotifyToken?: string;

  @ApiPropertyOptional({ description: 'LINE Channel Access Token' })
  @IsOptional()
  @IsString()
  lineChannelAccessToken?: string;

  @ApiPropertyOptional({ description: 'LINE Group ID or User ID' })
  @IsOptional()
  @IsString()
  lineGroupId?: string;

  @ApiPropertyOptional({ description: 'Notify on check-in' })
  @IsOptional()
  notifyOnCheckin?: boolean;

  @ApiPropertyOptional({ description: 'Notify on check-out' })
  @IsOptional()
  notifyOnCheckout?: boolean;

  @ApiPropertyOptional({ description: 'Notify when late' })
  @IsOptional()
  notifyOnLate?: boolean;

  @ApiPropertyOptional({ description: 'Send daily summary' })
  @IsOptional()
  notifyDailySummary?: boolean;

  @ApiPropertyOptional({ description: 'Daily summary time (HH:mm)', example: '18:30' })
  @IsOptional()
  @IsString()
  dailySummaryTime?: string;
}

export class CreateBulkLeaveDto {
  @ApiProperty({ description: 'Start date (YYYY-MM-DD)' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'End date (YYYY-MM-DD)' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ enum: LeaveType, description: 'Type of leave' })
  @IsEnum(LeaveType)
  leaveType: LeaveType;

  @ApiPropertyOptional({ description: 'Reason for leave' })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class MonthlyReportQueryDto {
  @ApiProperty({ description: 'Year', example: 2567 })
  @IsNumber()
  year: number;

  @ApiProperty({ description: 'Month (1-12)', example: 12 })
  @IsNumber()
  month: number;
}
