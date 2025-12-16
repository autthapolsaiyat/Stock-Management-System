import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSettingEntity } from './entities/user-setting.entity';

@Injectable()
export class UserSettingsService {
  constructor(
    @InjectRepository(UserSettingEntity)
    private settingsRepository: Repository<UserSettingEntity>,
  ) {}

  async getAll(userId: number): Promise<Record<string, any>> {
    const settings = await this.settingsRepository.find({ where: { userId } });
    const result: Record<string, any> = {};
    
    settings.forEach(s => {
      try {
        result[s.settingKey] = JSON.parse(s.settingValue);
      } catch {
        result[s.settingKey] = s.settingValue;
      }
    });
    
    return result;
  }

  async get(userId: number, key: string): Promise<any> {
    const setting = await this.settingsRepository.findOne({
      where: { userId, settingKey: key },
    });
    
    if (!setting) return null;
    
    try {
      return JSON.parse(setting.settingValue);
    } catch {
      return setting.settingValue;
    }
  }

  async set(userId: number, key: string, value: any): Promise<UserSettingEntity> {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    
    let setting = await this.settingsRepository.findOne({
      where: { userId, settingKey: key },
    });
    
    if (setting) {
      setting.settingValue = stringValue;
    } else {
      setting = this.settingsRepository.create({
        userId,
        settingKey: key,
        settingValue: stringValue,
      });
    }
    
    return this.settingsRepository.save(setting);
  }

  async setBulk(userId: number, settings: Record<string, any>): Promise<void> {
    for (const [key, value] of Object.entries(settings)) {
      await this.set(userId, key, value);
    }
  }

  async delete(userId: number, key: string): Promise<void> {
    await this.settingsRepository.delete({ userId, settingKey: key });
  }

  async getSellerSettings(userId: number): Promise<any> {
    const settings = await this.get(userId, 'seller');
    return settings || {
      name: '',
      surname: '',
      nickname: '',
      phone: '',
      email: '',
      signatureUrl: '',
      signaturePosition: 'ผู้เสนอราคา',
      displayOptions: {
        fullName: true,
        nickname: false,
        phone: true,
        email: true,
        signature: true,
      },
    };
  }

  async getQuotationDefaults(userId: number): Promise<any> {
    const settings = await this.get(userId, 'quotationDefaults');
    return settings || {
      validDays: 30,
      deliveryDays: 120,
      creditTermDays: 30,
      paymentTerms: 'ชำระเงินภายใน 30 วัน หลังจากวันที่ในใบแจ้งหนี้',
      deliveryTerms: 'จัดส่งภายใน 120 วัน หลังจากได้รับใบสั่งซื้อ',
      footerNote: '',
    };
  }
}
