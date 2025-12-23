import { PrismaService } from '../../prisma/prisma.service';
import { AIProvider } from '../../ai/ai.provider';
import { AgentInput } from '../../common/types/agent.types';

export interface AgentResult {
  output: Record<string, unknown>;
  reasoning?: string;
  metadata?: Record<string, unknown>;
}

export abstract class BaseAgent {
  constructor(
    protected prisma: PrismaService,
    protected ai: AIProvider,
  ) {}

  abstract execute(organizationId: string, input: AgentInput): Promise<AgentResult>;
}


