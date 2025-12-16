import { UserEntity } from '../../user/entities/user.entity';
export declare class UserSettingEntity {
    id: number;
    userId: number;
    settingKey: string;
    settingValue: string;
    createdAt: Date;
    updatedAt: Date;
    user: UserEntity;
}
