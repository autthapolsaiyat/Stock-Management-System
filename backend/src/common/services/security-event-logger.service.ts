import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLogEntity } from '../../modules/audit-log/entities';

export enum SecurityEventType {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  LOGIN_BLOCKED = 'LOGIN_BLOCKED',
  LOGOUT = 'LOGOUT',
  PASSWORD_CHANGED = 'PASSWORD_CHANGED',
  PASSWORD_RESET_REQUESTED = 'PASSWORD_RESET_REQUESTED',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  ACCOUNT_UNLOCKED = 'ACCOUNT_UNLOCKED',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  SESSION_HIJACK_ATTEMPT = 'SESSION_HIJACK_ATTEMPT',
  BRUTE_FORCE_DETECTED = 'BRUTE_FORCE_DETECTED',
  SQL_INJECTION_ATTEMPT = 'SQL_INJECTION_ATTEMPT',
  XSS_ATTEMPT = 'XSS_ATTEMPT',
}

export interface SecurityEventData {
  eventType: SecurityEventType;
  userId?: number;
  username?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, any>;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

@Injectable()
export class SecurityEventLogger {
  constructor(
    @InjectRepository(AuditLogEntity)
    private auditLogRepository: Repository<AuditLogEntity>,
  ) {}

  async log(event: SecurityEventData): Promise<void> {
    const severity = event.severity || this.getSeverity(event.eventType);

    // Log to console for immediate visibility
    const logMessage = `[SECURITY ${severity}] ${event.eventType} - User: ${event.username || event.userId || 'anonymous'} - IP: ${event.ipAddress || 'unknown'}`;
    
    if (severity === 'CRITICAL' || severity === 'HIGH') {
      console.error(logMessage, event.details);
    } else {
      console.warn(logMessage);
    }

    // Log to database
    try {
      await this.auditLogRepository.save({
        module: 'SECURITY',
        action: event.eventType,
        documentId: event.userId,
        documentNo: event.username,
        userId: event.userId || 0,
        userName: event.username,
        ipAddress: event.ipAddress,
        userAgent: event.userAgent,
        details: {
          ...event.details,
          severity,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      // Don't fail if logging fails, but log the error
      console.error('Failed to log security event:', error);
    }
  }

  async logLoginSuccess(userId: number, username: string, ipAddress: string, userAgent?: string): Promise<void> {
    await this.log({
      eventType: SecurityEventType.LOGIN_SUCCESS,
      userId,
      username,
      ipAddress,
      userAgent,
      severity: 'LOW',
    });
  }

  async logLoginFailed(username: string, ipAddress: string, reason: string, userAgent?: string): Promise<void> {
    await this.log({
      eventType: SecurityEventType.LOGIN_FAILED,
      username,
      ipAddress,
      userAgent,
      details: { reason },
      severity: 'MEDIUM',
    });
  }

  async logAccountLocked(username: string, ipAddress: string, attemptsCount: number): Promise<void> {
    await this.log({
      eventType: SecurityEventType.ACCOUNT_LOCKED,
      username,
      ipAddress,
      details: { attemptsCount, lockDuration: '15 minutes' },
      severity: 'HIGH',
    });
  }

  async logBruteForceDetected(ipAddress: string, targetEndpoint: string, attemptCount: number): Promise<void> {
    await this.log({
      eventType: SecurityEventType.BRUTE_FORCE_DETECTED,
      ipAddress,
      details: { targetEndpoint, attemptCount },
      severity: 'CRITICAL',
    });
  }

  async logSuspiciousActivity(
    eventType: SecurityEventType,
    ipAddress: string,
    details: Record<string, any>,
    userId?: number,
    username?: string,
  ): Promise<void> {
    await this.log({
      eventType,
      userId,
      username,
      ipAddress,
      details,
      severity: 'HIGH',
    });
  }

  private getSeverity(eventType: SecurityEventType): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    const severityMap: Record<SecurityEventType, 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'> = {
      [SecurityEventType.LOGIN_SUCCESS]: 'LOW',
      [SecurityEventType.LOGOUT]: 'LOW',
      [SecurityEventType.LOGIN_FAILED]: 'MEDIUM',
      [SecurityEventType.PASSWORD_CHANGED]: 'MEDIUM',
      [SecurityEventType.PASSWORD_RESET_REQUESTED]: 'MEDIUM',
      [SecurityEventType.LOGIN_BLOCKED]: 'HIGH',
      [SecurityEventType.ACCOUNT_LOCKED]: 'HIGH',
      [SecurityEventType.ACCOUNT_UNLOCKED]: 'MEDIUM',
      [SecurityEventType.PERMISSION_DENIED]: 'MEDIUM',
      [SecurityEventType.RATE_LIMIT_EXCEEDED]: 'MEDIUM',
      [SecurityEventType.INVALID_TOKEN]: 'MEDIUM',
      [SecurityEventType.TOKEN_EXPIRED]: 'LOW',
      [SecurityEventType.SUSPICIOUS_ACTIVITY]: 'HIGH',
      [SecurityEventType.SESSION_HIJACK_ATTEMPT]: 'CRITICAL',
      [SecurityEventType.BRUTE_FORCE_DETECTED]: 'CRITICAL',
      [SecurityEventType.SQL_INJECTION_ATTEMPT]: 'CRITICAL',
      [SecurityEventType.XSS_ATTEMPT]: 'CRITICAL',
    };

    return severityMap[eventType] || 'MEDIUM';
  }
}
