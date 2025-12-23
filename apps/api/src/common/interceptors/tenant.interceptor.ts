import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../types/user.types';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as User | undefined;

    if (!user?.currentOrganizationId) {
      throw new ForbiddenException('No organization context');
    }

    // Attach organization ID to request for easy access
    request.organizationId = user.currentOrganizationId;

    return next.handle();
  }
}


