import { Injectable, BadRequestException } from '@nestjs/common';

export interface PasswordStrength {
  score: number; // 0-4
  feedback: string[];
  isValid: boolean;
}

@Injectable()
export class PasswordPolicyService {
  private readonly MIN_LENGTH = 8;
  private readonly MAX_LENGTH = 128;

  // Common weak passwords (top 100 most common)
  private readonly COMMON_PASSWORDS = new Set([
    'password', '123456', '12345678', 'qwerty', 'abc123', 'monkey', '1234567',
    'letmein', 'trustno1', 'dragon', 'baseball', 'iloveyou', 'master', 'sunshine',
    'ashley', 'bailey', 'shadow', '123123', '654321', 'superman', 'qazwsx',
    'michael', 'football', 'password1', 'password123', 'welcome', 'welcome1',
    'admin', 'admin123', 'root', 'toor', 'pass', 'test', 'guest', 'master',
    'changeme', 'passwd', '1234', '12345', '123456789', '1234567890',
  ]);

  validatePassword(password: string, username?: string): PasswordStrength {
    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (password.length < this.MIN_LENGTH) {
      feedback.push(`รหัสผ่านต้องมีอย่างน้อย ${this.MIN_LENGTH} ตัวอักษร`);
    } else if (password.length >= 12) {
      score += 1;
    }

    if (password.length > this.MAX_LENGTH) {
      feedback.push(`รหัสผ่านต้องไม่เกิน ${this.MAX_LENGTH} ตัวอักษร`);
    }

    // Complexity checks
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    if (!hasLower) {
      feedback.push('ควรมีตัวอักษรพิมพ์เล็ก (a-z)');
    } else {
      score += 0.5;
    }

    if (!hasUpper) {
      feedback.push('ควรมีตัวอักษรพิมพ์ใหญ่ (A-Z)');
    } else {
      score += 0.5;
    }

    if (!hasNumber) {
      feedback.push('ควรมีตัวเลข (0-9)');
    } else {
      score += 0.5;
    }

    if (!hasSpecial) {
      feedback.push('ควรมีอักขระพิเศษ (!@#$%^&*)');
    } else {
      score += 0.5;
    }

    // Common password check
    if (this.COMMON_PASSWORDS.has(password.toLowerCase())) {
      feedback.push('รหัสผ่านนี้เป็นรหัสผ่านที่คาดเดาได้ง่าย');
      score = Math.max(0, score - 2);
    }

    // Username in password check
    if (username && password.toLowerCase().includes(username.toLowerCase())) {
      feedback.push('รหัสผ่านไม่ควรมีชื่อผู้ใช้');
      score = Math.max(0, score - 1);
    }

    // Sequential characters check
    if (this.hasSequentialChars(password)) {
      feedback.push('ไม่ควรใช้ตัวอักษรหรือตัวเลขเรียงกัน (เช่น 123, abc)');
      score = Math.max(0, score - 0.5);
    }

    // Repeated characters check
    if (this.hasRepeatedChars(password)) {
      feedback.push('ไม่ควรใช้ตัวอักษรซ้ำกันติดต่อกันหลายตัว');
      score = Math.max(0, score - 0.5);
    }

    // Normalize score to 0-4
    score = Math.min(4, Math.max(0, Math.round(score)));

    const isValid = password.length >= this.MIN_LENGTH && 
                   password.length <= this.MAX_LENGTH &&
                   hasLower && hasUpper && hasNumber;

    return { score, feedback, isValid };
  }

  assertValidPassword(password: string, username?: string): void {
    const result = this.validatePassword(password, username);
    if (!result.isValid) {
      throw new BadRequestException({
        message: 'รหัสผ่านไม่ผ่านเกณฑ์ความปลอดภัย',
        errors: result.feedback,
      });
    }
  }

  private hasSequentialChars(password: string): boolean {
    const sequences = [
      'abcdefghijklmnopqrstuvwxyz',
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      '01234567890',
      'qwertyuiop',
      'asdfghjkl',
      'zxcvbnm',
    ];

    const lower = password.toLowerCase();
    for (const seq of sequences) {
      for (let i = 0; i <= seq.length - 3; i++) {
        if (lower.includes(seq.substring(i, i + 3))) {
          return true;
        }
      }
    }
    return false;
  }

  private hasRepeatedChars(password: string): boolean {
    return /(.)\1{2,}/.test(password);
  }

  getStrengthLabel(score: number): string {
    switch (score) {
      case 0: return 'อ่อนมาก';
      case 1: return 'อ่อน';
      case 2: return 'ปานกลาง';
      case 3: return 'แข็งแรง';
      case 4: return 'แข็งแรงมาก';
      default: return 'ไม่ทราบ';
    }
  }
}
