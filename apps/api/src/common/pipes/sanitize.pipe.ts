import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { SanitizeUtil } from '../utils/sanitize.util';

@Injectable()
export class SanitizePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value === null || value === undefined) {
      return value;
    }

    // Skip sanitization for certain types
    if (metadata.type === 'param' && metadata.data === 'id') {
      return value; // IDs are usually UUIDs, don't sanitize
    }

    return SanitizeUtil.sanitizeObject(value);
  }
}

