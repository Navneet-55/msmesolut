/**
 * Input sanitization utilities
 */

export class SanitizeUtil {
  /**
   * Sanitize string input - remove dangerous characters
   */
  static sanitizeString(input: string): string {
    if (typeof input !== 'string') {
      return '';
    }

    return input
      .trim()
      .replace(/[<>]/g, '') // Remove HTML brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, ''); // Remove event handlers
  }

  /**
   * Sanitize object recursively
   */
  static sanitizeObject<T>(obj: T): T {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (typeof obj === 'string') {
      return this.sanitizeString(obj) as unknown as T;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.sanitizeObject(item)) as unknown as T;
    }

    if (typeof obj === 'object') {
      const sanitized: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[this.sanitizeString(key)] = this.sanitizeObject(value);
      }
      return sanitized as T;
    }

    return obj;
  }

  /**
   * Validate and sanitize email
   */
  static sanitizeEmail(email: string): string {
    const sanitized = this.sanitizeString(email);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitized)) {
      throw new Error('Invalid email format');
    }
    return sanitized.toLowerCase();
  }

  /**
   * Sanitize URL
   */
  static sanitizeUrl(url: string): string {
    const sanitized = this.sanitizeString(url);
    try {
      const parsed = new URL(sanitized);
      // Only allow http and https
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        throw new Error('Invalid URL protocol');
      }
      return parsed.toString();
    } catch {
      throw new Error('Invalid URL format');
    }
  }
}

