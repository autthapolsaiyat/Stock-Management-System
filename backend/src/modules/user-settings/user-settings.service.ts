import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { UserSettingEntity } from './entities/user-setting.entity';

@Injectable()
export class UserSettingsService {
  constructor(
    @InjectRepository(UserSettingEntity)
    private settingsRepository: Repository<UserSettingEntity>,
    private dataSource: DataSource,
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

  async getEmployeeList(): Promise<any[]> {
    const employees = await this.dataSource.query(
      `SELECT id, employee_code, full_name_th, nickname, position, phone, email, signature_url
       FROM employees 
       WHERE is_active = true
       ORDER BY full_name_th`
    );
    return employees;
  }

  async getEmployeeById(id: number): Promise<any> {
    const employees = await this.dataSource.query(
      `SELECT id, employee_code, full_name_th, nickname, position, phone, email, signature_url
       FROM employees 
       WHERE id = $1`,
      [id]
    );
    
    if (employees && employees.length > 0) {
      const emp = employees[0];
      const nameParts = (emp.full_name_th || '').trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      return {
        id: emp.id,
        employeeCode: emp.employee_code,
        name: firstName,
        surname: lastName,
        nickname: emp.nickname || '',
        position: emp.position || '',
        phone: emp.phone || '',
        email: emp.email || '',
        signatureUrl: emp.signature_url || '',
      };
    }
    return null;
  }

  async getSellerSettings(userId: number): Promise<any> {
    const settings = await this.get(userId, 'seller');
    
    if (settings && settings.name) {
      return settings;
    }
    
    const employee = await this.dataSource.query(
      `SELECT e.full_name_th, e.nickname, e.phone, e.email, e.signature_url, e.position
       FROM employees e 
       WHERE e.user_id = $1`,
      [userId]
    );
    
    if (employee && employee.length > 0) {
      const emp = employee[0];
      const nameParts = (emp.full_name_th || '').trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      return {
        name: firstName,
        surname: lastName,
        nickname: emp.nickname || '',
        phone: emp.phone || '',
        email: emp.email || '',
        signatureUrl: emp.signature_url || '',
        signaturePosition: emp.position || 'ผู้เสนอราคา',
        displayOptions: {
          fullName: true,
          nickname: false,
          phone: true,
          email: true,
          signature: true,
        },
      };
    }
    
    return {
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
