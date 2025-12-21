import { UserSettingsService } from './user-settings.service';
export declare class UserSettingsController {
    private settingsService;
    constructor(settingsService: UserSettingsService);
    getAll(req: any): Promise<Record<string, any>>;
    getProfile(req: any): Promise<any>;
    updateProfile(req: any, body: any): Promise<any>;
    getEmployees(): Promise<any[]>;
    getEmployeeById(id: number): Promise<any>;
    getSellerSettings(req: any): Promise<any>;
    updateSellerSettings(req: any, body: any): Promise<{
        success: boolean;
        message: string;
    }>;
    getQuotationDefaults(req: any): Promise<any>;
    updateQuotationDefaults(req: any, body: any): Promise<{
        success: boolean;
        message: string;
    }>;
    get(req: any, key: string): Promise<any>;
    set(req: any, key: string, body: any): Promise<{
        success: boolean;
    }>;
    delete(req: any, key: string): Promise<{
        success: boolean;
    }>;
}
