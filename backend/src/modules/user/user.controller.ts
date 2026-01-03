import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, ParseIntPipe, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

interface AuditContext {
  userId: number;
  userName?: string;
  ipAddress?: string;
  userAgent?: string;
}

function getAuditContext(req: any): AuditContext {
  return {
    userId: req.user?.sub || req.user?.id,
    userName: req.user?.fullName || req.user?.username,
    ipAddress: req.ip || req.headers?.['x-forwarded-for'] || req.connection?.remoteAddress,
    userAgent: req.headers?.['user-agent'],
  };
}

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  findAll() {
    return this.userService.findAllWithInactive();
  }

  @Get('roles')
  @ApiOperation({ summary: 'Get all roles' })
  findAllRoles() {
    return this.userService.findAllRoles();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create user' })
  create(@Body() dto: CreateUserDto, @Req() req: any) {
    return this.userService.create(dto, getAuditContext(req));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto, @Req() req: any) {
    return this.userService.update(id, dto, getAuditContext(req));
  }

  @Put(':id/roles')
  @ApiOperation({ summary: 'Update user roles by code' })
  updateRoles(@Param('id', ParseIntPipe) id: number, @Body() body: { roles: string[] }, @Req() req: any) {
    return this.userService.updateRolesByCodes(id, body.roles, getAuditContext(req));
  }

  @Put(':id/password')
  @ApiOperation({ summary: 'Reset user password' })
  resetPassword(@Param('id', ParseIntPipe) id: number, @Body() body: { password: string }, @Req() req: any) {
    return this.userService.resetPassword(id, body.password, getAuditContext(req));
  }

  @Put(':id/toggle-active')
  @ApiOperation({ summary: 'Toggle user active status' })
  toggleActive(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.userService.toggleActive(id, getAuditContext(req));
  }

  @Put(':id/toggle-multiple-sessions')
  @ApiOperation({ summary: 'Toggle allow multiple sessions' })
  toggleMultipleSessions(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.userService.toggleMultipleSessions(id, getAuditContext(req));
  }

  @Post(':id/force-logout')
  @ApiOperation({ summary: 'Force logout user' })
  forceLogout(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.userService.forceLogout(id, getAuditContext(req));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  delete(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.userService.delete(id, getAuditContext(req));
  }
}
