import { Repository } from 'typeorm';
import { SystemSettingEntity } from './entities';
export declare class SystemSettingsService {
    private settingRepository;
    constructor(settingRepository: Repository<SystemSettingEntity>);
    findAll(): Promise<SystemSettingEntity[]>;
    findByCategory(category: string): Promise<SystemSettingEntity[]>;
    findByKey(key: string): Promise<SystemSettingEntity>;
    getValue(key: string, defaultValue?: any): Promise<any>;
    update(key: string, value: string, userId: number): Promise<SystemSettingEntity>;
    createOrUpdate(key: string, value: string, type: string, category: string, description: string, userId: number): Promise<SystemSettingEntity>;
    private parseValue;
    getMinMarginPercent(): Promise<number>;
    getLowMarginApproverRole(): Promise<string>;
    getVarianceAlertPercent(): Promise<number>;
    getQuotationTypes(): Promise<string[]>;
}
