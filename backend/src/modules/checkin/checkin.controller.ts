import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CheckinService } from './checkin.service';
import {
  ClockInDto,
  ClockOutDto,
  CreateLeaveDto,
  UpdateLeaveDto,
  CheckinSettingsDto,
} from './dto';

@ApiTags('Checkin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('checkin')
export class CheckinController {
  constructor(private readonly checkinService: CheckinService) {}

  // ==================== CLOCK IN/OUT ====================

  @Post('clock-in')
  @ApiOperation({ summary: 'Clock in for today' })
  async clockIn(@Request() req, @Body() dto: ClockInDto) {
    const userId = req.user.userId || req.user.id || req.user.sub;
    return this.checkinService.clockIn(userId, dto);
  }

  @Post('clock-out')
  @ApiOperation({ summary: 'Clock out for today' })
  async clockOut(@Request() req, @Body() dto: ClockOutDto) {
    const userId = req.user.userId || req.user.id || req.user.sub;
    return this.checkinService.clockOut(userId, dto);
  }

  @Get('today')
  @ApiOperation({ summary: 'Get today status' })
  async getTodayStatus(@Request() req) {
    const userId = req.user.userId || req.user.id || req.user.sub;
    return this.checkinService.getTodayStatus(userId);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get checkin history' })
  async getHistory(@Request() req, @Query('limit') limit?: number) {
    const userId = req.user.userId || req.user.id || req.user.sub;
    return this.checkinService.getHistory(userId, limit || 10);
  }

  @Get('monthly-summary')
  @ApiOperation({ summary: 'Get monthly summary for current user' })
  async getMonthlySummary(
    @Request() req,
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    const userId = req.user.userId || req.user.id || req.user.sub;
    const now = new Date();
    const y = year || now.getFullYear();
    const m = month || now.getMonth() + 1;
    return this.checkinService.getMonthlySummary(userId, y, m);
  }

  // ==================== LEAVE ====================

  @Post('leave')
  @ApiOperation({ summary: 'Create leave request' })
  async createLeave(@Request() req, @Body() dto: CreateLeaveDto) {
    const userId = req.user.userId || req.user.id || req.user.sub;
    return this.checkinService.createLeave(userId, dto);
  }

  @Put('leave/:id')
  @ApiOperation({ summary: 'Update leave request' })
  async updateLeave(@Param('id') id: number, @Body() dto: UpdateLeaveDto) {
    return this.checkinService.updateLeave(id, dto);
  }

  @Delete('leave/:id')
  @ApiOperation({ summary: 'Delete leave request' })
  async deleteLeave(@Param('id') id: number) {
    return this.checkinService.deleteLeave(id);
  }

  @Get('leave')
  @ApiOperation({ summary: 'Get my leaves for a month' })
  async getMyLeaves(
    @Request() req,
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    const userId = req.user.userId || req.user.id || req.user.sub;
    const now = new Date();
    const y = year || now.getFullYear();
    const m = month || now.getMonth() + 1;
    return this.checkinService.getLeavesByUser(userId, y, m);
  }

  // ==================== ADMIN: REPORT ====================

  @Get('report/monthly')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'MANAGER', 'HR')
  @ApiOperation({ summary: 'Get monthly report (Admin)' })
  async getMonthlyReport(
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    const now = new Date();
    const y = year || now.getFullYear();
    const m = month || now.getMonth() + 1;
    return this.checkinService.getMonthlyReport(y, m);
  }

  // ==================== ADMIN: SETTINGS ====================

  @Get('settings')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Get checkin settings (Admin)' })
  async getSettings() {
    return this.checkinService.getSettings();
  }

  @Put('settings')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Update checkin settings (Admin)' })
  async updateSettings(@Body() dto: CheckinSettingsDto) {
    return this.checkinService.updateSettings(dto);
  }

  @Post('settings/test-line')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Test LINE notify (Admin)' })
  async testLineNotify() {
    return this.checkinService.testLineNotify();
  }

  @Post('settings/send-daily-summary')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Send daily summary manually (Admin)' })
  async sendDailySummary() {
    return this.checkinService.sendDailySummary();
  }
}
