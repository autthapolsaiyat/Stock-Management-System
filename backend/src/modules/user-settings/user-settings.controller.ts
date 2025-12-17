import { Controller, Get, Put, Delete, Param, Body, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserSettingsService } from './user-settings.service';

@ApiTags('User Settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user-settings')
export class UserSettingsController {
  constructor(private settingsService: UserSettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all settings for current user' })
  async getAll(@Request() req: any) {
    return this.settingsService.getAll(req.user.id);
  }

  @Get('employees')
  @ApiOperation({ summary: 'Get all employees for seller selection' })
  async getEmployees() {
    return this.settingsService.getEmployeeList();
  }

  @Get('employee/:id')
  @ApiOperation({ summary: 'Get employee by ID' })
  async getEmployeeById(@Param('id', ParseIntPipe) id: number) {
    return this.settingsService.getEmployeeById(id);
  }

  @Get('seller')
  @ApiOperation({ summary: 'Get seller settings' })
  async getSellerSettings(@Request() req: any) {
    return this.settingsService.getSellerSettings(req.user.id);
  }

  @Put('seller')
  @ApiOperation({ summary: 'Update seller settings' })
  async updateSellerSettings(@Request() req: any, @Body() body: any) {
    await this.settingsService.set(req.user.id, 'seller', body);
    return { success: true, message: 'บันทึกข้อมูลผู้ขายสำเร็จ' };
  }

  @Get('quotation-defaults')
  @ApiOperation({ summary: 'Get quotation defaults' })
  async getQuotationDefaults(@Request() req: any) {
    return this.settingsService.getQuotationDefaults(req.user.id);
  }

  @Put('quotation-defaults')
  @ApiOperation({ summary: 'Update quotation defaults' })
  async updateQuotationDefaults(@Request() req: any, @Body() body: any) {
    await this.settingsService.set(req.user.id, 'quotationDefaults', body);
    return { success: true, message: 'บันทึกค่าเริ่มต้นสำเร็จ' };
  }

  @Get(':key')
  @ApiOperation({ summary: 'Get specific setting' })
  async get(@Request() req: any, @Param('key') key: string) {
    return this.settingsService.get(req.user.id, key);
  }

  @Put(':key')
  @ApiOperation({ summary: 'Update specific setting' })
  async set(@Request() req: any, @Param('key') key: string, @Body() body: any) {
    await this.settingsService.set(req.user.id, key, body.value);
    return { success: true };
  }

  @Delete(':key')
  @ApiOperation({ summary: 'Delete specific setting' })
  async delete(@Request() req: any, @Param('key') key: string) {
    await this.settingsService.delete(req.user.id, key);
    return { success: true };
  }
}
