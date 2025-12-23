import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async getNotifications(organizationId: string, userId?: string) {
    return this.prisma.notification.findMany({
      where: {
        organizationId,
        ...(userId && { userId }),
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async markAsRead(organizationId: string, notificationId: string, userId?: string) {
    return this.prisma.notification.updateMany({
      where: {
        id: notificationId,
        organizationId,
        ...(userId && { userId }),
      },
      data: {
        read: true,
        readAt: new Date(),
      },
    });
  }
}


