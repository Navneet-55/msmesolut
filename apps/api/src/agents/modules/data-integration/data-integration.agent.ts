import { BaseAgent, AgentResult } from '../base.agent';
import { PrismaService } from '../../../prisma/prisma.service';
import { AIProvider } from '../../../ai/ai.provider';

export class DataIntegrationAgent extends BaseAgent {
  async execute(organizationId: string, input: any): Promise<AgentResult> {
    const { action, integrationId, data } = input;

    if (action === 'analyze_data') {
      return this.analyzeData(organizationId, data);
    }

    if (action === 'suggest_insights') {
      return this.suggestInsights(organizationId);
    }

    if (action === 'create_dashboard') {
      return this.createDashboard(organizationId, input);
    }

    throw new Error(`Unknown action: ${action}`);
  }

  private async analyzeData(organizationId: string, data: any): Promise<AgentResult> {
    const prompt = `Analyze the provided dataset and extract key insights.

Data:
${JSON.stringify(data, null, 2)}

Provide:
1. Data quality assessment
2. Key patterns and trends
3. Statistical summary
4. Anomalies detected
5. Business insights
6. Recommendations

Format as JSON:
{
  "quality": {"completeness": 0.0, "accuracy": 0.0, "issues": [...]},
  "summary": {"rows": 0, "columns": 0, "statistics": {...}},
  "patterns": [...],
  "anomalies": [...],
  "insights": [...],
  "recommendations": [...]
}`;

    const response = await this.ai.generateText({
      prompt,
      maxTokens: 2000,
      temperature: 0.5,
    });

    const structured = await this.ai.extractStructured({
      text: response.text,
      schema: {
        quality: {
          completeness: 'number',
          accuracy: 'number',
          issues: ['string'],
        },
        summary: {
          rows: 'number',
          columns: 'number',
          statistics: 'object',
        },
        patterns: ['string'],
        anomalies: ['string'],
        insights: ['string'],
        recommendations: ['string'],
      },
    });

    return {
      output: {
        analysis: structured,
      },
      reasoning: 'Analyzed dataset using statistical methods and pattern recognition to extract actionable insights.',
    };
  }

  private async suggestInsights(organizationId: string): Promise<AgentResult> {
    // Get aggregated data from various sources
    const transactions = await this.prisma.transaction.findMany({
      where: {
        organizationId,
        date: { gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
      },
    });

    const orders = await this.prisma.order.findMany({
      where: {
        organizationId,
        createdAt: { gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
      },
    });

    const tickets = await this.prisma.ticket.findMany({
      where: {
        organizationId,
        createdAt: { gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
      },
    });

    const revenue = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const prompt = `Generate business intelligence insights from organizational data.

Financial (Last 90 Days):
- Revenue: $${revenue.toFixed(2)}
- Expenses: $${expenses.toFixed(2)}
- Net: $${(revenue - expenses).toFixed(2)}

Orders: ${orders.length}
- Total Value: $${orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}

Support Tickets: ${tickets.length}
- Open: ${tickets.filter((t) => t.status === 'open').length}
- Resolved: ${tickets.filter((t) => t.status === 'resolved').length}

Provide:
1. Key performance indicators
2. Trends and patterns
3. Opportunities
4. Risks and alerts
5. Actionable recommendations
6. Suggested metrics to track

Format as JSON:
{
  "kpis": [
    {"name": "...", "value": 0, "trend": "up|down|stable", "insight": "..."}
  ],
  "trends": [...],
  "opportunities": [...],
  "risks": [...],
  "recommendations": [...],
  "metrics": [...]
}`;

    const response = await this.ai.generateText({
      prompt,
      maxTokens: 2000,
      temperature: 0.6,
    });

    const structured = await this.ai.extractStructured({
      text: response.text,
      schema: {
        kpis: [
          {
            name: 'string',
            value: 'number',
            trend: 'string',
            insight: 'string',
          },
        ],
        trends: ['string'],
        opportunities: ['string'],
        risks: ['string'],
        recommendations: ['string'],
        metrics: ['string'],
      },
    });

    return {
      output: {
        insights: structured,
      },
      reasoning: 'Analyzed cross-functional data to generate comprehensive business intelligence insights and recommendations.',
    };
  }

  private async createDashboard(organizationId: string, input: any): Promise<AgentResult> {
    const { dashboardType, metrics } = input;

    const prompt = `Design a business intelligence dashboard.

Dashboard Type: ${dashboardType || 'executive'}
Metrics to Include: ${metrics?.join(', ') || 'All key metrics'}

Provide:
1. Dashboard layout and structure
2. Recommended visualizations (charts, graphs, tables)
3. Key metrics and KPIs
4. Data sources
5. Refresh frequency
6. User personas and use cases

Format as JSON:
{
  "layout": {
    "sections": [
      {"title": "...", "type": "chart|table|metric", "dataSource": "...", "visualization": "..."}
    ]
  },
  "metrics": [...],
  "refreshFrequency": "...",
  "useCases": [...]
}`;

    const response = await this.ai.generateText({
      prompt,
      maxTokens: 2000,
      temperature: 0.7,
    });

    const structured = await this.ai.extractStructured({
      text: response.text,
      schema: {
        layout: {
          sections: [
            {
              title: 'string',
              type: 'string',
              dataSource: 'string',
              visualization: 'string',
            },
          ],
        },
        metrics: ['string'],
        refreshFrequency: 'string',
        useCases: ['string'],
      },
    });

    return {
      output: {
        dashboard: structured,
        type: dashboardType,
      },
      reasoning: 'Designed dashboard layout and visualizations optimized for the specified dashboard type and user needs.',
    };
  }
}


