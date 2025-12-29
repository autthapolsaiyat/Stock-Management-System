import { Controller, Get, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SystemSettingsService } from './system-settings.service';

@ApiTags('System Settings')
@Controller('system-settings')
export class SystemSettingsController {
  constructor(private readonly settingsService: SystemSettingsService) {}

  // Public endpoint - ไม่ต้อง login สำหรับหน้า Login
  @Get('public/branding')
  async getPublicBranding() {
    let systemName = 'SVS Business Suite';
    let systemLogo = '/icons/icon-192x192.png';
    
    try {
      const nameSetting = await this.settingsService.findByKey('SYSTEM_NAME');
      if (nameSetting?.settingValue) systemName = nameSetting.settingValue;
    } catch (e) {
      // Use default
    }
    
    // ดึงโลโก้จาก SYSTEM_LOGO_URL ก่อน ถ้าไม่มีค่อยดึงจาก COMPANY_LOGO_URL
    try {
      const logoSetting = await this.settingsService.findByKey('SYSTEM_LOGO_URL');
      if (logoSetting?.settingValue) systemLogo = logoSetting.settingValue;
    } catch (e) {
      // ถ้าไม่มี SYSTEM_LOGO_URL ลองดึง COMPANY_LOGO_URL
      try {
        const companyLogo = await this.settingsService.findByKey('COMPANY_LOGO_URL');
        if (companyLogo?.settingValue) systemLogo = companyLogo.settingValue;
      } catch (e2) {
        // Use default
      }
    }
    
    return { systemName, systemLogo };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.settingsService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('category/:category')
  findByCategory(@Param('category') category: string) {
    return this.settingsService.findByCategory(category);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('key/:key')
  findByKey(@Param('key') key: string) {
    return this.settingsService.findByKey(key);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('key/:key')
  update(@Param('key') key: string, @Body('value') value: string, @Request() req: any) {
    return this.settingsService.update(key, value, req.user.sub);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
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
