import { BaseAgent, AgentResult } from '../base.agent';
import { PrismaService } from '../../../prisma/prisma.service';
import { AIProvider } from '../../../ai/ai.provider';

export class CustomerSupportAgent extends BaseAgent {
  async execute(organizationId: string, input: any): Promise<AgentResult> {
    const { ticketId, action } = input;

    if (action === 'analyze_sentiment') {
      return this.analyzeSentiment(organizationId, ticketId);
    }

    if (action === 'generate_response') {
      return this.generateResponse(organizationId, ticketId);
    }

    if (action === 'suggest_solution') {
      return this.suggestSolution(organizationId, ticketId);
    }

    throw new Error(`Unknown action: ${action}`);
  }

  private async analyzeSentiment(organizationId: string, ticketId: string): Promise<AgentResult> {
    const ticket = await this.prisma.ticket.findFirst({
      where: { id: ticketId, organizationId },
      include: { messages: { orderBy: { createdAt: 'desc' }, take: 5 } },
    });

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    const text = `${ticket.subject}\n${ticket.description}\n${ticket.messages.map((m) => m.content).join('\n')}`;

    const classification = await this.ai.classify({
      text,
      categories: ['positive', 'neutral', 'negative', 'urgent'],
      description: 'Classify customer sentiment and urgency',
    });

    // Update ticket with sentiment
    await this.prisma.message.updateMany({
      where: { ticketId },
      data: { sentiment: classification.category },
    });

    const reasoning = `Analyzed customer communication and classified sentiment as ${classification.category} with ${(classification.confidence * 100).toFixed(0)}% confidence.`;

    return {
      output: {
        sentiment: classification.category,
        confidence: classification.confidence,
        ticketId,
      },
      reasoning,
    };
  }

  private async generateResponse(organizationId: string, ticketId: string): Promise<AgentResult> {
    const ticket = await this.prisma.ticket.findFirst({
      where: { id: ticketId, organizationId },
      include: {
        customer: true,
        messages: { orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // Get knowledge base for context
    const knowledgeBase = await this.prisma.knowledgeBase.findMany({
      where: {
        organizationId,
        type: { in: ['faq', 'sop', 'manual'] },
      },
      take: 5,
    });

    const context = knowledgeBase.map((kb) => `${kb.title}: ${kb.content}`).join('\n\n');

    const prompt = `You are a customer support agent. Generate a professional, helpful response to this customer ticket.

Customer: ${ticket.customer?.name || 'Customer'}
Subject: ${ticket.subject}
Description: ${ticket.description}

Previous messages:
${ticket.messages.map((m) => `${m.senderType}: ${m.content}`).join('\n')}

Knowledge Base Context:
${context}

Generate a response that:
1. Acknowledges the customer's concern
2. Provides a clear solution or next steps
3. Is empathetic and professional
4. References relevant information from the knowledge base if applicable`;

    const response = await this.ai.generateText({
      prompt,
      maxTokens: 500,
      temperature: 0.7,
    });

    return {
      output: {
        response: response.text,
        ticketId,
      },
      reasoning: 'Generated response based on ticket context, customer history, and knowledge base.',
    };
  }

  private async suggestSolution(organizationId: string, ticketId: string): Promise<AgentResult> {
    const ticket = await this.prisma.ticket.findFirst({
      where: { id: ticketId, organizationId },
      include: { customer: true },
    });

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    const prompt = `Analyze this support ticket and suggest the best solution approach.

Ticket: ${ticket.subject}
Description: ${ticket.description}
Category: ${ticket.category || 'General'}
Priority: ${ticket.priority}

Provide:
1. Root cause analysis
2. Recommended solution steps
3. Estimated resolution time
4. Required resources`;

    const response = await this.ai.generateText({
      prompt,
      maxTokens: 800,
      temperature: 0.6,
    });

    return {
      output: {
        suggestion: response.text,
        ticketId,
      },
      reasoning: 'Analyzed ticket details to provide structured solution recommendations.',
    };
  }
}


