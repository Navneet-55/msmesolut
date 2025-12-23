import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AIModule } from './ai/ai.module';
import { AgentsModule } from './agents/agents.module';
import { DataModule } from './data/data.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AIModule,
    AuthModule,
    AgentsModule,
    DataModule,
    IntegrationsModule,
    NotificationsModule,
  ],
})
export class AppModule {}


