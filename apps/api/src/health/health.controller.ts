import { Controller, Get, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Public } from '../common/decorators/public.decorator';
import { ConfigService } from '@nestjs/config';

@Controller('health')
export class HealthController {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  @Public()
  @Get()
  async check() {
    const startTime = Date.now();
    let dbStatus = 'connected';
    let dbLatency = 0;

    try {
      const dbStart = Date.now();
      await this.prisma.$queryRaw`SELECT 1`;
      dbLatency = Date.now() - dbStart;
    } catch (error) {
      dbStatus = 'disconnected';
    }

    return {
      status: dbStatus === 'connected' ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: this.configService.get('NODE_ENV', 'development'),
      uptime: process.uptime(),
      checks: {
        database: {
          status: dbStatus,
          latency: `${dbLatency}ms`,
        },
      },
      responseTime: `${Date.now() - startTime}ms`,
    };
  }

  @Public()
  @Get('live')
  async liveness() {
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
    };
  }

  @Public()
  @Get('ready')
  async readiness() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        ready: true,
        timestamp: new Date().toISOString(),
      };
    } catch {
      return {
        ready: false,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Public()
  @Get('version')
  async version() {
    return {
      version: '1.0.0',
      name: 'Lumina AI',
      description: 'Intelligent Business Operations, Illuminated',
      environment: this.configService.get('NODE_ENV', 'development'),
    };
  }
}

