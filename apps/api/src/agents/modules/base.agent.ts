import { PrismaService } from '../../prisma/prisma.service';
import { AIProvider } from '../../ai/ai.provider';

export interface AgentResult {
  output: any;
  reasoning?: string;
  metadata?: any;
}

export abstract class BaseAgent {
  constructor(
    protected prisma: PrismaService,
    protected ai: AIProvider,
  ) {}

  abstract execute(organizationId: string, input: any): Promise<AgentResult>;
}


