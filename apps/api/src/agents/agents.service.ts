import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AIProvider } from '../ai/ai.provider';
import { CustomerSupportAgent } from './modules/customer-support/customer-support.agent';
import { MarketingAgent } from './modules/marketing/marketing.agent';
import { FinancialAgent } from './modules/financial/financial.agent';
import { SupplyChainAgent } from './modules/supply-chain/supply-chain.agent';
import { OnboardingAgent } from './modules/onboarding/onboarding.agent';
import { CompetitiveAgent } from './modules/competitive/competitive.agent';
import { DataIntegrationAgent } from './modules/data-integration/data-integration.agent';
import { SalesLeadAgent } from './modules/sales-lead/sales-lead.agent';

@Injectable()
export class AgentsService {
  private agents: Map<string, any> = new Map();

  constructor(
    private prisma: PrismaService,
    @Inject('AI_PROVIDER') private aiProvider: AIProvider,
  ) {
    // Initialize all agents
    this.agents.set('customer_support', new CustomerSupportAgent(prisma, aiProvider));
    this.agents.set('marketing', new MarketingAgent(prisma, aiProvider));
    this.agents.set('financial', new FinancialAgent(prisma, aiProvider));
    this.agents.set('supply_chain', new SupplyChainAgent(prisma, aiProvider));
    this.agents.set('onboarding', new OnboardingAgent(prisma, aiProvider));
    this.agents.set('competitive', new CompetitiveAgent(prisma, aiProvider));
    this.agents.set('data_integration', new DataIntegrationAgent(prisma, aiProvider));
    this.agents.set('sales_lead', new SalesLeadAgent(prisma, aiProvider));
  }

  async runAgent(
    organizationId: string,
    agentType: string,
    input: any,
    userId?: string,
    entityId?: string,
  ) {
    const agent = this.agents.get(agentType);
    if (!agent) {
      throw new Error(`Unknown agent type: ${agentType}`);
    }

    // Create agent run record
    const agentRun = await this.prisma.agentRun.create({
      data: {
        organizationId,
        agentType,
        userId,
        status: 'running',
        input,
        startedAt: new Date(),
      },
    });

    try {
      // Execute agent
      const result = await agent.execute(organizationId, input);

      // Update agent run with results
      await this.prisma.agentRun.update({
        where: { id: agentRun.id },
        data: {
          status: 'completed',
          output: result.output,
          reasoning: result.reasoning,
          completedAt: new Date(),
        },
      });

      // Link to entity if provided
      if (entityId) {
        const updateData: any = {};
        if (agentType === 'customer_support') updateData.ticketId = entityId;
        if (agentType === 'marketing') updateData.campaignId = entityId;
        if (agentType === 'sales_lead') updateData.leadId = entityId;

        if (Object.keys(updateData).length > 0) {
          await this.prisma.agentRun.update({
            where: { id: agentRun.id },
            data: updateData,
          });
        }
      }

      return {
        id: agentRun.id,
        ...result,
      };
    } catch (error: any) {
      await this.prisma.agentRun.update({
        where: { id: agentRun.id },
        data: {
          status: 'failed',
          output: { error: error.message },
        },
      });

      await this.prisma.agentLog.create({
        data: {
          agentRunId: agentRun.id,
          level: 'error',
          message: error.message,
          data: { stack: error.stack },
        },
      });

      throw error;
    }
  }

  async getAgentRuns(organizationId: string, agentType?: string, limit = 50) {
    return this.prisma.agentRun.findMany({
      where: {
        organizationId,
        ...(agentType && { agentType }),
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async getAgentRun(organizationId: string, runId: string) {
    return this.prisma.agentRun.findFirst({
      where: {
        id: runId,
        organizationId,
      },
      include: {
        logs: {
          orderBy: { createdAt: 'asc' },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }
}


