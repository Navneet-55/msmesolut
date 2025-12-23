import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AIModule } from './ai/ai.module';
import { AgentsModule } from './agents/agents.module';
import { DataModule } from './data/data.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { NotificationsModule } from './notifications/notifications.module';
import { HealthModule } from './health/health.module';
import { PythonModule } from './python/python.module';
import { SecurityMiddleware } from './common/middleware/security.middleware';
import appConfig from './common/config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
      expandVariables: true,
      load: [appConfig],
    }),
    PrismaModule,
    AIModule,
    AuthModule,
    AgentsModule,
    DataModule,
    IntegrationsModule,
    NotificationsModule,
    HealthModule,
    PythonModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SecurityMiddleware).forRoutes('*');
  }
}


