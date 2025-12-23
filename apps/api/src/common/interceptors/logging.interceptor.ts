import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url, body, query, params } = request;
    const startTime = Date.now();

    // Generate request ID
    const requestId = uuidv4();
    request['requestId'] = requestId;
    response.setHeader('X-Request-ID', requestId);

    // Log request
    this.logger.log(
      `[${requestId}] ${method} ${url} - Query: ${JSON.stringify(query)} - Params: ${JSON.stringify(params)}`,
    );

    return next.handle().pipe(
      tap((data) => {
        const duration = Date.now() - startTime;
        this.logger.log(
          `[${requestId}] ${method} ${url} ${response.statusCode} - ${duration}ms`,
        );
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;
        this.logger.error(
          `[${requestId}] ${method} ${url} ${response.statusCode || 500} - ${duration}ms - Error: ${error.message}`,
        );
        throw error;
      }),
    );
  }
}

