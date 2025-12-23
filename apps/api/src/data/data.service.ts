import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DataService {
  private readonly logger = new Logger(DataService.name);

  constructor(private prisma: PrismaService) {}

  async getDashboard(organizationId: string) {
    this.logger.debug(`Fetching dashboard for org: ${organizationId}`);

    const [tickets, orders, transactions, leads, agentRuns] = await Promise.all([
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
      this.prisma.agentRun.count({
        where: {
          organizationId,
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
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
      agentRuns: {
        weeklyTotal: agentRuns,
      },
    };
  }

  async getAnalytics(organizationId: string, startDate?: Date, endDate?: Date) {
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate || new Date();

    const [transactions, agentRuns, tickets] = await Promise.all([
      this.prisma.transaction.findMany({
        where: {
          organizationId,
          date: { gte: start, lte: end },
        },
        orderBy: { date: 'asc' },
      }),
      this.prisma.agentRun.groupBy({
        by: ['agentType'],
        where: {
          organizationId,
          createdAt: { gte: start, lte: end },
        },
        _count: true,
      }),
      this.prisma.ticket.groupBy({
        by: ['status'],
        where: {
          organizationId,
          createdAt: { gte: start, lte: end },
        },
        _count: true,
      }),
    ]);

    // Group transactions by month
    const monthlyData = transactions.reduce((acc, t) => {
      const month = t.date.toISOString().slice(0, 7);
      if (!acc[month]) {
        acc[month] = { revenue: 0, expenses: 0 };
      }
      if (t.type === 'income') {
        acc[month].revenue += t.amount;
      } else {
        acc[month].expenses += t.amount;
      }
      return acc;
    }, {} as Record<string, { revenue: number; expenses: number }>);

    return {
      revenueByMonth: Object.entries(monthlyData).map(([month, data]) => ({
        month,
        ...data,
      })),
      agentUsage: agentRuns.map((r) => ({
        agent: r.agentType,
        count: r._count,
      })),
      ticketsByStatus: tickets.map((t) => ({
        status: t.status,
        count: t._count,
      })),
    };
  }

  async getActivityLog(organizationId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [activities, total] = await Promise.all([
      this.prisma.auditTrail.findMany({
        where: { organizationId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
      }),
      this.prisma.auditTrail.count({ where: { organizationId } }),
    ]);

    return {
      data: activities,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}


