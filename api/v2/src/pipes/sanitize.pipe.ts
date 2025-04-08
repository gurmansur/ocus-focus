import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class SanitizePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) return value;

    if (typeof value === 'string') {
      return this.sanitizeString(value);
    }

    if (typeof value === 'object' && value !== null) {
      return this.sanitizeObject(value);
    }

    return value;
  }

  private sanitizeString(text: string): string {
    // Remove qualquer tag HTML
    return (
      text
        .replace(/<[^>]*>/g, '')
        // Escapa caracteres especiais
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        // Trim de espaços extras
        .trim()
    );
  }

  private sanitizeObject(obj: Record<string, any>): Record<string, any> {
    const result: Record<string, any> = {};

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];

        if (typeof value === 'string') {
          result[key] = this.sanitizeString(value);
        } else if (typeof value === 'object' && value !== null) {
          result[key] = this.sanitizeObject(value);
        } else {
          result[key] = value;
        }
      }
    }

    return result;
  }
}
