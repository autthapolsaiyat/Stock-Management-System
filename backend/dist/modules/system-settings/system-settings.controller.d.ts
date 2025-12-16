import { SystemSettingsService } from './system-settings.service';
export declare class SystemSettingsController {
    private readonly settingsService;
    constructor(settingsService: SystemSettingsService);
    findAll(): Promise<import("./entities").SystemSettingEntity[]>;
    findByCategory(category: string): Promise<import("./entities").SystemSettingEntity[]>;
    findByKey(key: string): Promise<import("./entities").SystemSettingEntity>;
    update(key: string, value: string, req: any): Promise<import("./entities").SystemSettingEntity>;
    updateBulk(body: {
        settings: {
            key: string;
            value: any;
        }[];
    }, req: any): Promise<{
        success: boolean;
        updated: number;
    }>;
}
