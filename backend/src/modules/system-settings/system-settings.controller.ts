import { Controller, Get, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SystemSettingsService } from './system-settings.service';

@ApiTags('System Settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('system-settings')
export class SystemSettingsController {
  constructor(private readonly settingsService: SystemSettingsService) {}

  @Get()
  findAll() {
    return this.settingsService.findAll();
  }

  @Get('category/:category')
  findByCategory(@Param('category') category: string) {
    return this.settingsService.findByCategory(category);
  }

  @Get('key/:key')
  findByKey(@Param('key') key: string) {
    return this.settingsService.findByKey(key);
  }

  @Put('key/:key')
  update(@Param('key') key: string, @Body('value') value: string, @Request() req: any) {
    return this.settingsService.update(key, value, req.user.sub);
  }

  @Put('bulk')
  async updateBulk(@Body() body: { settings: { key: string; value: any }[] }, @Request() req: any) {
    const results = [];
    for (const setting of body.settings) {
      const value = typeof setting.value === 'string' ? setting.value : JSON.stringify(setting.value);
      const result = await this.settingsService.upsert(setting.key, value, req.user.sub);
      results.push(result);
    }
    return { success: true, updated: results.length };
  }
}
