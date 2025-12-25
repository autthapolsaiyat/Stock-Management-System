import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class SanitizePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value === null || value === undefined) {
      return value;
    }

    if (typeof value === 'string') {
      return this.sanitizeString(value);
    }

    if (typeof value === 'object') {
      return this.sanitizeObject(value);
    }

    return value;
  }

  private sanitizeString(str: string): string {
    // Remove null bytes
    str = str.replace(/\0/g, '');

    // Remove potential SQL injection patterns (additional layer, TypeORM handles this)
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|TRUNCATE)\b)/gi,
      /(--|\*\/|\/\*)/g,
    ];

    for (const pattern of sqlPatterns) {
      if (pattern.test(str)) {
        // Log suspicious input but don't block - TypeORM will handle parameterization
        console.warn(`[Security] Suspicious input detected: ${str.substring(0, 50)}...`);
      }
    }

    // Trim and limit length
    str = str.trim();
    if (str.length > 10000) {
      str = str.substring(0, 10000);
    }

    return str;
  }

  private sanitizeObject(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(item => this.transform(item, { type: 'body' } as ArgumentMetadata));
    }

    const sanitized: any = {};
    for (const key of Object.keys(obj)) {
      // Validate key names - prevent prototype pollution
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        throw new BadRequestException('Invalid field name');
      }

      sanitized[key] = this.transform(obj[key], { type: 'body' } as ArgumentMetadata);
    }

    return sanitized;
  }
}

// XSS Prevention for HTML content
@Injectable()
export class XssSanitizePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value === null || value === undefined) {
      return value;
    }

    if (typeof value === 'string') {
      return this.escapeHtml(value);
    }

    if (typeof value === 'object') {
      return this.sanitizeObject(value);
    }

    return value;
  }

  private escapeHtml(str: string): string {
    const htmlEntities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;',
    };

    return str.replace(/[&<>"'/]/g, char => htmlEntities[char] || char);
  }

  private sanitizeObject(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(item => this.transform(item, { type: 'body' } as ArgumentMetadata));
    }

    const sanitized: any = {};
    for (const key of Object.keys(obj)) {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        throw new BadRequestException('Invalid field name');
      }
      sanitized[key] = this.transform(obj[key], { type: 'body' } as ArgumentMetadata);
    }

    return sanitized;
  }
}
