import { BaseAgent, AgentResult } from '../base.agent';
import { PrismaService } from '../../../prisma/prisma.service';
import { AIProvider } from '../../../ai/ai.provider';

export class CompetitiveAgent extends BaseAgent {
  async execute(organizationId: string, input: any): Promise<AgentResult> {
    const { action, competitorId, topic } = input;

    if (action === 'analyze_competitor') {
      return this.analyzeCompetitor(organizationId, competitorId);
    }

    if (action === 'market_research') {
      return this.marketResearch(organizationId, topic);
    }

    if (action === 'competitive_positioning') {
      return this.competitivePositioning(organizationId);
    }

    throw new Error(`Unknown action: ${action}`);
  }

  private async analyzeCompetitor(organizationId: string, competitorId: string): Promise<AgentResult> {
    const competitor = await this.prisma.competitor.findFirst({
      where: { id: competitorId, organizationId },
      include: {
        insights: { orderBy: { date: 'desc' }, take: 20 },
      },
    });

    if (!competitor) {
      throw new Error('Competitor not found');
    }

    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });

    const prompt = `Perform a comprehensive competitive analysis.

Our Organization: ${org?.name}
Competitor: ${competitor.name}
Industry: ${competitor.industry || 'N/A'}
Website: ${competitor.website || 'N/A'}

Known Strengths:
${competitor.strengths.join('\n')}

Known Weaknesses:
${competitor.weaknesses.join('\n')}

Recent Insights:
${JSON.stringify(
  competitor.insights.map((i) => ({
    type: i.type,
    title: i.title,
    description: i.description,
    date: i.date.toISOString(),
  })),
  null,
  2,
)}

Provide:
1. Competitive overview
2. Strengths and weaknesses analysis
3. Market positioning
4. Pricing strategy (if known)
5. Product/service comparison
6. Market share estimates
7. Threat assessment
8. Opportunities to differentiate

Format as JSON:
{
  "overview": "...",
  "strengths": [...],
  "weaknesses": [...],
  "positioning": "...",
  "threatLevel": "high|medium|low",
  "differentiation": [...]
}`;

    const response = await this.ai.generateText({
      prompt,
      maxTokens: 2000,
      temperature: 0.6,
    });

    const structured = await this.ai.extractStructured({
      text: response.text,
      schema: {
        overview: 'string',
        strengths: ['string'],
        weaknesses: ['string'],
        positioning: 'string',
        threatLevel: 'string',
        differentiation: ['string'],
      },
    });

    return {
      output: {
        analysis: structured,
        competitorId,
      },
      reasoning: 'Analyzed competitor data, insights, and market position to provide comprehensive competitive intelligence.',
    };
  }

  private async marketResearch(organizationId: string, topic: string): Promise<AgentResult> {
    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });

    const competitors = await this.prisma.competitor.findMany({
      where: { organizationId },
      take: 10,
    });

    const prompt = `Conduct market research on a specific topic.

Organization: ${org?.name}
Research Topic: ${topic}

Known Competitors:
${competitors.map((c) => `${c.name} - ${c.industry || 'N/A'}`).join('\n')}

Provide:
1. Market overview and size
2. Key trends and drivers
3. Competitive landscape
4. Customer segments
5. Opportunities
6. Threats
7. Recommendations

Format as JSON:
{
  "marketOverview": "...",
  "marketSize": "...",
  "trends": [...],
  "drivers": [...],
  "segments": [...],
  "opportunities": [...],
  "threats": [...],
  "recommendations": [...]
}`;

    const response = await this.ai.generateText({
      prompt,
      maxTokens: 2000,
      temperature: 0.7,
    });

    const structured = await this.ai.extractStructured({
      text: response.text,
      schema: {
        marketOverview: 'string',
        marketSize: 'string',
        trends: ['string'],
        drivers: ['string'],
        segments: ['string'],
        opportunities: ['string'],
        threats: ['string'],
        recommendations: ['string'],
      },
    });

    return {
      output: {
        research: structured,
        topic,
      },
      reasoning: 'Conducted market research using available data and competitive intelligence to provide strategic insights.',
    };
  }

  private async competitivePositioning(organizationId: string): Promise<AgentResult> {
    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!org) {
      throw new Error(`Organization with ID ${organizationId} not found.`);
    }

    const competitors = await this.prisma.competitor.findMany({
      where: { organizationId },
      include: {
        insights: { orderBy: { date: 'desc' }, take: 5 },
      },
    });

    const prompt = `Analyze competitive positioning for the organization.

Our Organization: ${org.name}

Competitors:
${JSON.stringify(
  competitors.map((c) => ({
    name: c.name,
    industry: c.industry,
    strengths: c.strengths,
    weaknesses: c.weaknesses,
    recentInsights: c.insights.map((i) => i.title),
  })),
  null,
  2,
)}

Provide:
1. Current market position
2. Competitive advantages
3. Areas of vulnerability
4. Positioning strategy recommendations
5. Differentiation opportunities
6. Market share positioning
7. Strategic recommendations

Format as JSON:
{
  "currentPosition": "...",
  "advantages": [...],
  "vulnerabilities": [...],
  "positioningStrategy": "...",
  "differentiation": [...],
  "recommendations": [...]
}`;

    const response = await this.ai.generateText({
      prompt,
      maxTokens: 2000,
      temperature: 0.7,
    });

    const structured = await this.ai.extractStructured({
      text: response.text,
      schema: {
        currentPosition: 'string',
        advantages: ['string'],
        vulnerabilities: ['string'],
        positioningStrategy: 'string',
        differentiation: ['string'],
        recommendations: ['string'],
      },
    });

    return {
      output: {
        positioning: structured,
      },
      reasoning: 'Analyzed competitive landscape to determine optimal market positioning and differentiation strategy.',
    };
  }
}
