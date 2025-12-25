import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface LoginAttempt {
  count: number;
  lockUntil: number;
}

// In-memory store (ใน production ควรใช้ Redis)
const rateLimitStore = new Map<string, RateLimitEntry>();
const loginAttemptStore = new Map<string, LoginAttempt>();

@Injectable()
export class ThrottleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const ip = this.getClientIp(request);
    const path = request.path;
    const method = request.method;

    // Skip GET requests (read-only)
    if (method === 'GET') {
      return true;
    }

    // Different limits for different endpoints
    const limits = this.getLimits(path);
    const key = `${ip}:${path}`;

    const now = Date.now();
    const entry = rateLimitStore.get(key);

    if (entry && now < entry.resetTime) {
      if (entry.count >= limits.max) {
        throw new HttpException(
          {
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            message: `Too many requests. Please try again after ${Math.ceil((entry.resetTime - now) / 1000)} seconds`,
            error: 'Too Many Requests',
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
      entry.count++;
    } else {
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + limits.windowMs,
      });
    }

    return true;
  }

  private getClientIp(request: any): string {
    return (
      request.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      request.headers['x-real-ip'] ||
      request.connection?.remoteAddress ||
      request.ip ||
      'unknown'
    );
  }

  private getLimits(path: string): { max: number; windowMs: number } {
    // Login endpoint - strict limit
    if (path.includes('/auth/login')) {
      return { max: 5, windowMs: 15 * 60 * 1000 }; // 5 attempts per 15 minutes
    }

    // Password reset
    if (path.includes('/password')) {
      return { max: 3, windowMs: 60 * 60 * 1000 }; // 3 attempts per hour
    }

    // Create/Update operations
    if (path.includes('/api/')) {
      return { max: 100, windowMs: 60 * 1000 }; // 100 requests per minute
    }

    // Default
    return { max: 200, windowMs: 60 * 1000 }; // 200 requests per minute
  }
}

// Account Lockout Service
@Injectable()
export class AccountLockoutService {
  private readonly MAX_ATTEMPTS = 5;
  private readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

  isLocked(username: string): boolean {
    const attempt = loginAttemptStore.get(username);
    if (!attempt) return false;

    if (Date.now() < attempt.lockUntil) {
      return true;
    }

    // Lockout expired, reset
    loginAttemptStore.delete(username);
    return false;
  }

  getLockoutRemaining(username: string): number {
    const attempt = loginAttemptStore.get(username);
    if (!attempt || Date.now() >= attempt.lockUntil) return 0;
    return Math.ceil((attempt.lockUntil - Date.now()) / 1000);
  }

  recordFailedAttempt(username: string): { locked: boolean; attemptsRemaining: number } {
    const attempt = loginAttemptStore.get(username) || { count: 0, lockUntil: 0 };
    attempt.count++;

    if (attempt.count >= this.MAX_ATTEMPTS) {
      attempt.lockUntil = Date.now() + this.LOCKOUT_DURATION;
      loginAttemptStore.set(username, attempt);
      return { locked: true, attemptsRemaining: 0 };
    }

    loginAttemptStore.set(username, attempt);
    return { locked: false, attemptsRemaining: this.MAX_ATTEMPTS - attempt.count };
  }

  resetAttempts(username: string): void {
    loginAttemptStore.delete(username);
  }
}
