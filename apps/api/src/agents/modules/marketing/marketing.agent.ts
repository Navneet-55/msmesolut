import { BaseAgent, AgentResult } from '../base.agent';
import { PrismaService } from '../../../prisma/prisma.service';
import { AIProvider } from '../../../ai/ai.provider';

export class MarketingAgent extends BaseAgent {
  async execute(organizationId: string, input: any): Promise<AgentResult> {
    const { action, campaignId, contentType, topic } = input;

    if (action === 'generate_content') {
      return this.generateContent(organizationId, contentType, topic, campaignId);
    }

    if (action === 'create_campaign') {
      return this.createCampaign(organizationId, input);
    }

    if (action === 'optimize_campaign') {
      return this.optimizeCampaign(organizationId, campaignId);
    }

    throw new Error(`Unknown action: ${action}`);
  }

  private async generateContent(
    organizationId: string,
    contentType: string,
    topic: string,
    campaignId?: string,
  ): Promise<AgentResult> {
    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });

    let campaignContext = '';
    if (campaignId) {
      const campaign = await this.prisma.campaign.findFirst({
        where: { id: campaignId, organizationId },
      });
      if (campaign) {
        campaignContext = `Campaign: ${campaign.name}\nType: ${campaign.type}\nBudget: $${campaign.budget}`;
      }
    }

    const prompt = `Create ${contentType} content for ${org?.name || 'the organization'}.

Topic: ${topic}
${campaignContext}

Requirements:
- Engaging and professional tone
- Clear call-to-action
- Optimized for ${contentType === 'email' ? 'email marketing' : contentType === 'social' ? 'social media' : 'web'}
- Include relevant keywords naturally

Generate the complete ${contentType} content.`;

    const response = await this.ai.generateText({
      prompt,
      maxTokens: 1000,
      temperature: 0.8,
    });

    return {
      output: {
        content: response.text,
        type: contentType,
        topic,
      },
      reasoning: `Generated ${contentType} content tailored for the organization's brand and campaign goals.`,
    };
  }

  private async createCampaign(organizationId: string, input: any): Promise<AgentResult> {
    const { name, type, budget, targetAudience, goals } = input;

    const prompt = `Create a comprehensive marketing campaign strategy.

Campaign Name: ${name}
Type: ${type}
Budget: $${budget}
Target Audience: ${targetAudience || 'General audience'}
Goals: ${goals || 'Increase awareness and engagement'}

Provide:
1. Campaign overview and objectives
2. Target audience personas
3. Key messaging and value propositions
4. Channel strategy (email, social, content, ads)
5. Content calendar outline
6. Success metrics and KPIs
7. Budget allocation recommendations`;

    const response = await this.ai.generateText({
      prompt,
      maxTokens: 1500,
      temperature: 0.7,
    });

    return {
      output: {
        strategy: response.text,
        campaignName: name,
      },
      reasoning: 'Created comprehensive campaign strategy based on objectives, budget, and target audience.',
    };
  }

  private async optimizeCampaign(organizationId: string, campaignId: string): Promise<AgentResult> {
    const campaign = await this.prisma.campaign.findFirst({
      where: { id: campaignId, organizationId },
      include: {
        metrics: { orderBy: { date: 'desc' }, take: 30 },
        content: { take: 10 },
      },
    });

    if (!campaign) {
      throw new Error('Campaign not found');
    }

    const metricsSummary = campaign.metrics.reduce(
      (acc, m) => ({
        impressions: acc.impressions + m.impressions,
        clicks: acc.clicks + m.clicks,
        conversions: acc.conversions + m.conversions,
        revenue: acc.revenue + m.revenue,
      }),
      { impressions: 0, clicks: 0, conversions: 0, revenue: 0 },
    );

    const ctr = metricsSummary.impressions > 0 ? (metricsSummary.clicks / metricsSummary.impressions) * 100 : 0;
    const conversionRate =
      metricsSummary.clicks > 0 ? (metricsSummary.conversions / metricsSummary.clicks) * 100 : 0;

    const prompt = `Analyze this marketing campaign and provide optimization recommendations.

Campaign: ${campaign.name}
Type: ${campaign.type}
Status: ${campaign.status}
Budget: $${campaign.budget}

Performance Metrics:
- Impressions: ${metricsSummary.impressions}
- Clicks: ${metricsSummary.clicks}
- CTR: ${ctr.toFixed(2)}%
- Conversions: ${metricsSummary.conversions}
- Conversion Rate: ${conversionRate.toFixed(2)}%
- Revenue: $${metricsSummary.revenue}

Content Pieces: ${campaign.content.length}

Provide:
1. Performance analysis
2. Strengths and weaknesses
3. Specific optimization recommendations
4. A/B testing suggestions
5. Budget reallocation recommendations
6. Timeline for improvements`;

    const response = await this.ai.generateText({
      prompt,
      maxTokens: 1200,
      temperature: 0.6,
    });

    return {
      output: {
        analysis: response.text,
        metrics: {
          ctr,
          conversionRate,
          totalRevenue: metricsSummary.revenue,
        },
        campaignId,
      },
      reasoning: 'Analyzed campaign performance data to provide data-driven optimization recommendations.',
    };
  }
}


