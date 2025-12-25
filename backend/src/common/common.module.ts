import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottleGuard, AccountLockoutService } from './guards/throttle.guard';
import { PasswordPolicyService } from './services/password-policy.service';
import { SecurityEventLogger } from './services/security-event-logger.service';
import { AuditLogEntity } from '../modules/audit-log/entities';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([AuditLogEntity])],
  providers: [
    ThrottleGuard,
    AccountLockoutService,
    PasswordPolicyService,
    SecurityEventLogger,
  ],
  exports: [
    ThrottleGuard,
    AccountLockoutService,
    PasswordPolicyService,
    SecurityEventLogger,
  ],
})
export class CommonModule {}
