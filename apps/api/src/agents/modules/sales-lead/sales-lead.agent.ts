import { BaseAgent, AgentResult } from '../base.agent';
import { PrismaService } from '../../../prisma/prisma.service';
import { AIProvider } from '../../../ai/ai.provider';

export class SalesLeadAgent extends BaseAgent {
  async execute(organizationId: string, input: any): Promise<AgentResult> {
    const { action, leadId } = input;

    if (action === 'qualify_lead') {
      return this.qualifyLead(organizationId, leadId);
    }

    if (action === 'enrich_lead') {
      return this.enrichLead(organizationId, leadId);
    }

    if (action === 'score_lead') {
      return this.scoreLead(organizationId, leadId);
    }

    throw new Error(`Unknown action: ${action}`);
  }

  private async qualifyLead(organizationId: string, leadId: string): Promise<AgentResult> {
    const lead = await this.prisma.lead.findFirst({
      where: { id: leadId, organizationId },
    });

    if (!lead) {
      throw new Error('Lead not found');
    }

    // Get similar leads for context
    const similarLeads = await this.prisma.lead.findMany({
      where: {
        organizationId,
        status: { in: ['qualified', 'converted'] },
      },
      take: 10,
    });

    const prompt = `Qualify a sales lead based on available information.

Lead Information:
- Name: ${lead.name || 'N/A'}
- Email: ${lead.email}
- Company: ${lead.company || 'N/A'}
- Source: ${lead.source || 'N/A'}
- Current Status: ${lead.status}
- Current Score: ${lead.score}/100

Enrichment Data:
${lead.enrichment ? JSON.stringify(lead.enrichment, null, 2) : 'None available'}

Similar Qualified Leads (for reference):
${JSON.stringify(
  similarLeads.map((l) => ({
    company: l.company,
    status: l.status,
    score: l.score,
  })),
  null,
  2,
)}

Assess:
1. Lead qualification status (qualified, not qualified, needs more info)
2. Fit score (0-100) based on ICP
3. Buying signals
4. Potential deal size
5. Timeline estimate
6. Next steps recommendation

Format as JSON:
{
  "qualified": true|false,
  "fitScore": 0,
  "buyingSignals": [...],
  "dealSize": "...",
  "timeline": "...",
  "nextSteps": [...],
  "reasoning": "..."
}`;

    const response = await this.ai.generateText({
      prompt,
      maxTokens: 1500,
      temperature: 0.5,
    });

    const structured = await this.ai.extractStructured({
      text: response.text,
      schema: {
        qualified: 'boolean',
        fitScore: 'number',
        buyingSignals: ['string'],
        dealSize: 'string',
        timeline: 'string',
        nextSteps: ['string'],
        reasoning: 'string',
      },
    });

    // Update lead with qualification results
    await this.prisma.lead.update({
      where: { id: leadId },
      data: {
        status: structured.qualified ? 'qualified' : 'new',
        score: structured.fitScore,
      },
    });

    return {
      output: {
        qualification: structured,
        leadId,
      },
      reasoning: structured.reasoning || 'Qualified lead based on ICP fit, buying signals, and historical conversion patterns.',
    };
  }

  private async enrichLead(organizationId: string, leadId: string): Promise<AgentResult> {
    const lead = await this.prisma.lead.findFirst({
      where: { id: leadId, organizationId },
    });

    if (!lead) {
      throw new Error('Lead not found');
    }

    const prompt = `Enrich lead data with additional information and insights.

Current Lead Data:
- Name: ${lead.name || 'N/A'}
- Email: ${lead.email}
- Company: ${lead.company || 'N/A'}
- Phone: ${lead.phone || 'N/A'}

Generate enriched data including:
1. Company size estimate
2. Industry classification
3. Technology stack (if inferable)
4. Recent news or events
5. Social media presence
6. Funding information (if applicable)
7. Key decision makers (inferred)
8. Pain points (inferred from industry/company)

Format as JSON:
{
  "companySize": "...",
  "industry": "...",
  "techStack": [...],
  "recentNews": [...],
  "socialPresence": {...},
  "funding": {...},
  "decisionMakers": [...],
  "painPoints": [...],
  "confidence": 0.0
}`;

    const response = await this.ai.generateText({
      prompt,
      maxTokens: 1500,
      temperature: 0.6,
    });

    const structured = await this.ai.extractStructured({
      text: response.text,
      schema: {
        companySize: 'string',
        industry: 'string',
        techStack: ['string'],
        recentNews: ['string'],
        socialPresence: 'object',
        funding: 'object',
        decisionMakers: ['string'],
        painPoints: ['string'],
        confidence: 'number',
      },
    });

    // Update lead with enrichment
    await this.prisma.lead.update({
      where: { id: leadId },
      data: {
        enrichment: structured,
      },
    });

    return {
      output: {
        enrichment: structured,
        leadId,
      },
      reasoning: 'Enriched lead data using available information and industry knowledge to provide comprehensive lead profile.',
    };
  }

  private async scoreLead(organizationId: string, leadId: string): Promise<AgentResult> {
    const lead = await this.prisma.lead.findFirst({
      where: { id: leadId, organizationId },
    });

    if (!lead) {
      throw new Error('Lead not found');
    }

    // Get conversion data for scoring model
    const convertedLeads = await this.prisma.lead.findMany({
      where: {
        organizationId,
        status: 'converted',
      },
      take: 20,
    });

    const prompt = `Score a sales lead using a predictive scoring model.

Lead Information:
- Name: ${lead.name || 'N/A'}
- Email: ${lead.email}
- Company: ${lead.company || 'N/A'}
- Source: ${lead.source || 'N/A'}
- Current Score: ${lead.score}/100

Enrichment Data:
${lead.enrichment ? JSON.stringify(lead.enrichment, null, 2) : 'None'}

Historical Conversion Patterns:
${JSON.stringify(
  convertedLeads.map((l) => ({
    company: l.company,
    source: l.source,
    score: l.score,
    enrichment: l.enrichment,
  })),
  null,
  2,
)}

Calculate lead score (0-100) based on:
1. Company fit (size, industry, tech stack)
2. Engagement signals (source, activity)
3. Buying intent indicators
4. Data completeness
5. Historical conversion patterns

Provide:
- Overall score (0-100)
- Score breakdown by factor
- Confidence level
- Recommendations to improve score

Format as JSON:
{
  "score": 0,
  "breakdown": {
    "companyFit": 0,
    "engagement": 0,
    "buyingIntent": 0,
    "dataQuality": 0
  },
  "confidence": 0.0,
  "recommendations": [...]
}`;

    const response = await this.ai.generateText({
      prompt,
      maxTokens: 1500,
      temperature: 0.5,
    });

    const structured = await this.ai.extractStructured({
      text: response.text,
      schema: {
        score: 'number',
        breakdown: {
          companyFit: 'number',
          engagement: 'number',
          buyingIntent: 'number',
          dataQuality: 'number',
        },
        confidence: 'number',
        recommendations: ['string'],
      },
    });

    // Update lead score
    await this.prisma.lead.update({
      where: { id: leadId },
      data: {
        score: structured.score,
      },
    });

    return {
      output: {
        scoring: structured,
        leadId,
      },
      reasoning: 'Calculated lead score using predictive model based on fit, engagement, intent, and historical conversion data.',
    };
  }
}


