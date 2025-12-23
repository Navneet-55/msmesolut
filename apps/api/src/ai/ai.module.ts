import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AIProvider } from './ai.provider';
import { GeminiProvider } from './providers/gemini.provider';
import { MockProvider } from './providers/mock.provider';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'AI_PROVIDER',
      useFactory: (configService: ConfigService): AIProvider => {
        const apiKey = configService.get<string>('GEMINI_API_KEY');
        const model = configService.get<string>('GEMINI_MODEL', 'gemini-pro');
        const nodeEnv = configService.get<string>('NODE_ENV', 'development');

        // Use mock provider if no API key or in test mode
        if (!apiKey || nodeEnv === 'test') {
          return new MockProvider();
        }

        try {
          return new GeminiProvider(apiKey, model);
        } catch (error: any) {
          // eslint-disable-next-line no-console
          console.warn('Failed to initialize Gemini provider, falling back to mock:', error);
          return new MockProvider();
        }
      },
      inject: [ConfigService],
    },
  ],
  exports: ['AI_PROVIDER'],
})
export class AIModule {}
