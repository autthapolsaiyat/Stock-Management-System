import { Controller, Post, Put, Body, UseGuards, Request, Headers, Ip } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  async login(
    @Body() dto: LoginDto,
    @Headers('user-agent') userAgent: string,
    @Ip() ip: string,
  ) {
    const device = {
      browser: this.parseBrowser(userAgent),
      os: this.parseOS(userAgent),
      ip: ip || 'Unknown',
      userAgent: userAgent || 'Unknown',
    };

    return this.authService.login(dto, device);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'User logout' })
  async logout(@Request() req: any) {
    await this.authService.logout(req.user.sub);
    return { message: 'ออกจากระบบสำเร็จ' };
  }

  @Put('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change own password' })
  async changePassword(
    @Request() req: any,
    @Body() body: { currentPassword: string; newPassword: string }
  ) {
    return this.authService.changePassword(req.user.sub, body.currentPassword, body.newPassword);
  }

  private parseBrowser(userAgent: string): string {
    if (!userAgent) return 'Unknown';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('SamsungBrowser')) return 'Samsung Browser';
    if (userAgent.includes('Opera') || userAgent.includes('OPR')) return 'Opera';
    if (userAgent.includes('Trident')) return 'Internet Explorer';
    if (userAgent.includes('Edge') || userAgent.includes('Edg')) return 'Edge';
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Safari')) return 'Safari';
    return 'Unknown';
  }

  private parseOS(userAgent: string): string {
    if (!userAgent) return 'Unknown';
    if (userAgent.includes('Windows NT 10')) return 'Windows 10';
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac OS X')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS';
    return 'Unknown';
  }
}
