import { Repository, DataSource } from 'typeorm';
import { UserSettingEntity } from './entities/user-setting.entity';
export declare class UserSettingsService {
    private settingsRepository;
    private dataSource;
    constructor(settingsRepository: Repository<UserSettingEntity>, dataSource: DataSource);
    getAll(userId: number): Promise<Record<string, any>>;
    get(userId: number, key: string): Promise<any>;
    set(userId: number, key: string, value: any): Promise<UserSettingEntity>;
    setBulk(userId: number, settings: Record<string, any>): Promise<void>;
    delete(userId: number, key: string): Promise<void>;
    getEmployeeList(): Promise<any[]>;
    getEmployeeById(id: number): Promise<any>;
    getSellerSettings(userId: number): Promise<any>;
    getQuotationDefaults(userId: number): Promise<any>;
}
