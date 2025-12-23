import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IntegrationsService {
  constructor(private prisma: PrismaService) {}

  async getIntegrations(organizationId: string) {
    return this.prisma.integration.findMany({
      where: { organizationId },
      include: { dataSources: true },
    });
  }

  async createIntegration(organizationId: string, data: any) {
    return this.prisma.integration.create({
      data: {
        organizationId,
        ...data,
      },
    });
  }
}


