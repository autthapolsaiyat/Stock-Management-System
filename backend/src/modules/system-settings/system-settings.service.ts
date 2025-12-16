import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemSettingEntity } from './entities';

@Injectable()
export class SystemSettingsService {
  constructor(
    @InjectRepository(SystemSettingEntity)
    private settingRepository: Repository<SystemSettingEntity>,
  ) {}

  async findAll() {
    return this.settingRepository.find({ order: { category: 'ASC', settingKey: 'ASC' } });
  }

  async findByCategory(category: string) {
    return this.settingRepository.find({ where: { category }, order: { settingKey: 'ASC' } });
  }

  async findByKey(key: string) {
    const setting = await this.settingRepository.findOne({ where: { settingKey: key } });
    if (!setting) throw new NotFoundException(`Setting ${key} not found`);
    return setting;
  }

  async getValue(key: string, defaultValue?: any): Promise<any> {
    try {
      const setting = await this.findByKey(key);
      return this.parseValue(setting.settingValue, setting.settingType);
    } catch {
      return defaultValue;
    }
  }

  async update(key: string, value: string, userId: number) {
    const setting = await this.findByKey(key);
    setting.settingValue = value;
    setting.updatedBy = userId;
    return this.settingRepository.save(setting);
  }

  async upsert(key: string, value: string, userId: number, category?: string, type?: string) {
    let setting = await this.settingRepository.findOne({ where: { settingKey: key } });
    
    if (setting) {
      setting.settingValue = value;
      setting.updatedBy = userId;
    } else {
      setting = this.settingRepository.create({
        settingKey: key,
        settingValue: value,
        settingType: type || 'STRING',
        category: category || 'GENERAL',
        updatedBy: userId,
      });
    }
    
    return this.settingRepository.save(setting);
  }

  async createOrUpdate(key: string, value: string, type: string, category: string, description: string, userId: number) {
    let setting = await this.settingRepository.findOne({ where: { settingKey: key } });
    
    if (setting) {
      setting.settingValue = value;
      setting.updatedBy = userId;
    } else {
      setting = this.settingRepository.create({
        settingKey: key,
        settingValue: value,
        settingType: type,
        category,
        description,
        updatedBy: userId,
      });
    }
    
    return this.settingRepository.save(setting);
  }

  private parseValue(value: string, type: string): any {
    switch (type) {
      case 'NUMBER':
        return parseFloat(value);
      case 'BOOLEAN':
        return value === 'true';
      case 'JSON':
        return JSON.parse(value);
      default:
        return value;
    }
  }

  // Quick access methods
  async getMinMarginPercent(): Promise<number> {
    return this.getValue('QT_MIN_MARGIN_PERCENT', 10);
  }

  async getLowMarginApproverRole(): Promise<string> {
    return this.getValue('QT_LOW_MARGIN_APPROVER_ROLE', 'MANAGER');
  }

  async getVarianceAlertPercent(): Promise<number> {
    return this.getValue('QT_VARIANCE_ALERT_PERCENT', 5);
  }

  async getQuotationTypes(): Promise<string[]> {
    return this.getValue('QT_TYPES', ['STANDARD', 'FORENSIC', 'MAINTENANCE']);
  }
}
