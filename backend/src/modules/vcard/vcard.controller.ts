import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';

@ApiTags('VCard')
@Controller('vcard')
export class VCardController {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private dataSource: DataSource,
  ) {}

  @Get(':username')
  async getVCard(
    @Param('username') username: string,
    @Res() res: Response,
  ) {
    // Find user
    const user = await this.userRepository.findOne({
      where: { username, isActive: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get user profile settings
    const profileSettings = await this.dataSource.query(
      `SELECT setting_value FROM user_settings 
       WHERE user_id = $1 AND setting_key = 'profile'`,
      [user.id]
    );

    let profile: any = {};
    if (profileSettings && profileSettings.length > 0) {
      try {
        profile = JSON.parse(profileSettings[0].setting_value);
      } catch (e) {
        profile = {};
      }
    }

    // Get company settings
    const companySettings = await this.dataSource.query(
      `SELECT setting_key, setting_value FROM system_settings 
       WHERE setting_key IN ('companyName', 'companyWebsite', 'companyAddress', 'companyPhone')`
    );

    const company: Record<string, string> = {};
    companySettings.forEach((s: any) => {
      company[s.setting_key] = s.setting_value;
    });

    // Parse full name to first/last name
    const fullName = user.fullName || username;
    const nameParts = fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Build vCard
    const vcard = this.buildVCard({
      firstName,
      lastName,
      fullName,
      organization: company.companyName || 'บริษัท แสงวิทย์ไซเอนซ์ จำกัด',
      title: profile.position || '',
      phone: profile.phone || '',
      email: user.email || '',
      website: company.companyWebsite || 'https://www.saengvithscience.co.th',
      address: company.companyAddress || '',
      note: `SVS Business Suite - ${profile.department || ''}`.trim(),
    });

    // Set response headers for vCard download
    const filename = `${username}.vcf`;
    res.setHeader('Content-Type', 'text/vcard; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(vcard);
  }

  private buildVCard(data: {
    firstName: string;
    lastName: string;
    fullName: string;
    organization: string;
    title: string;
    phone: string;
    email: string;
    website: string;
    address: string;
    note: string;
  }): string {
    const lines: string[] = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `N:${data.lastName};${data.firstName};;;`,
      `FN:${data.fullName}`,
    ];

    if (data.organization) {
      lines.push(`ORG:${data.organization}`);
    }

    if (data.title) {
      lines.push(`TITLE:${data.title}`);
    }

    if (data.phone) {
      // Clean phone number
      const cleanPhone = data.phone.replace(/[^\d-]/g, '');
      lines.push(`TEL;TYPE=CELL:${cleanPhone}`);
    }

    if (data.email) {
      lines.push(`EMAIL:${data.email}`);
    }

    if (data.website) {
      lines.push(`URL:${data.website}`);
    }

    if (data.address) {
      lines.push(`ADR;TYPE=WORK:;;${data.address};;;;`);
    }

    if (data.note && data.note.trim() !== 'SVS Business Suite -') {
      lines.push(`NOTE:${data.note}`);
    }

    lines.push('END:VCARD');

    return lines.join('\r\n');
  }
}
