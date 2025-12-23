import { Logger } from '@nestjs/common';

export class AppLogger extends Logger {
  logWithContext(message: string, context?: Record<string, unknown>) {
    const logMessage = context
      ? `${message} - Context: ${JSON.stringify(context)}`
      : message;
    this.log(logMessage);
  }

  errorWithContext(
    message: string,
    error?: Error | unknown,
    context?: Record<string, unknown>,
  ) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    const logMessage = context
      ? `${message} - Error: ${errorMessage} - Context: ${JSON.stringify(context)}`
      : `${message} - Error: ${errorMessage}`;

    this.error(logMessage, errorStack);
  }

  warnWithContext(message: string, context?: Record<string, unknown>) {
    const logMessage = context
      ? `${message} - Context: ${JSON.stringify(context)}`
      : message;
    this.warn(logMessage);
  }
}

