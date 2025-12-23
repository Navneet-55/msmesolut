import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DataService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(organizationId: string) {
    const [tickets, orders, transactions, leads] = await Promise.all([
      this.prisma.ticket.findMany({
        where: { organizationId },
        take: 10,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.findMany({
        where: { organizationId },
        take: 10,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.transaction.findMany({
        where: {
          organizationId,
          date: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
      }),
      this.prisma.lead.findMany({
        where: { organizationId },
        take: 10,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const revenue = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      tickets: {
        total: tickets.length,
        open: tickets.filter((t) => t.status === 'open').length,
        recent: tickets.slice(0, 5),
      },
      orders: {
        total: orders.length,
        totalValue: orders.reduce((sum, o) => sum + o.total, 0),
        recent: orders.slice(0, 5),
      },
      financial: {
        revenue,
        expenses,
        net: revenue - expenses,
      },
      leads: {
        total: leads.length,
        qualified: leads.filter((l) => l.status === 'qualified').length,
        recent: leads.slice(0, 5),
      },
    };
  }
}


