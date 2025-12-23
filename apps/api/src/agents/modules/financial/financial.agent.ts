import { BaseAgent, AgentResult } from '../base.agent';
import { PrismaService } from '../../../prisma/prisma.service';
import { AIProvider } from '../../../ai/ai.provider';

export class FinancialAgent extends BaseAgent {
  async execute(organizationId: string, input: any): Promise<AgentResult> {
    const { action, period, forecastType } = input;

    if (action === 'generate_forecast') {
      return this.generateForecast(organizationId, period, forecastType);
    }

    if (action === 'analyze_cash_flow') {
      return this.analyzeCashFlow(organizationId);
    }

    if (action === 'detect_anomalies') {
      return this.detectAnomalies(organizationId);
    }

    throw new Error(`Unknown action: ${action}`);
  }

  private async generateForecast(
    organizationId: string,
    period: string = 'quarterly',
    forecastType: string = 'revenue',
  ): Promise<AgentResult> {
    // Get historical transactions
    const transactions = await this.prisma.transaction.findMany({
      where: {
        organizationId,
        date: { gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }, // Last year
      },
      orderBy: { date: 'asc' },
    });

    const historicalData = transactions
      .filter((t) => (forecastType === 'revenue' ? t.type === 'income' : t.type === 'expense'))
      .map((t) => ({
        date: t.date.toISOString(),
        amount: t.amount,
      }));

    const prompt = `Generate a ${period} financial forecast for ${forecastType}.

Historical Data (last 12 months):
${JSON.stringify(historicalData, null, 2)}

Provide:
1. Forecasted values for the next ${period === 'monthly' ? '12 months' : period === 'quarterly' ? '4 quarters' : '2 years'}
2. Confidence intervals
3. Key assumptions
4. Risk factors
5. Recommendations

Format as JSON with structure:
{
  "forecast": [
    {"period": "2024-Q1", "predicted": 100000, "confidence": 0.85, "lower": 90000, "upper": 110000}
  ],
  "assumptions": [...],
  "risks": [...],
  "recommendations": [...]
}`;

    const response = await this.ai.generateText({
      prompt,
      maxTokens: 2000,
      temperature: 0.5,
    });

    // Extract structured data
    const structured = await this.ai.extractStructured({
      text: response.text,
      schema: {
        forecast: [
          {
            period: 'string',
            predicted: 'number',
            confidence: 'number',
            lower: 'number',
            upper: 'number',
          },
        ],
        assumptions: ['string'],
        risks: ['string'],
        recommendations: ['string'],
      },
    });

    return {
      output: {
        forecast: structured,
        period,
        type: forecastType,
      },
      reasoning: `Generated ${period} forecast based on historical trends, seasonality patterns, and business context.`,
    };
  }

  private async analyzeCashFlow(organizationId: string): Promise<AgentResult> {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        organizationId,
        date: { gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) }, // Last 90 days
      },
      orderBy: { date: 'asc' },
    });

    const income = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const netCashFlow = income - expenses;

    const prompt = `Analyze cash flow for the organization.

Last 90 Days:
- Total Income: $${income.toFixed(2)}
- Total Expenses: $${expenses.toFixed(2)}
- Net Cash Flow: $${netCashFlow.toFixed(2)}

Transaction Breakdown:
${JSON.stringify(
  transactions.map((t) => ({
    date: t.date.toISOString(),
    type: t.type,
    category: t.category,
    amount: t.amount,
  })),
  null,
  2,
)}

Provide:
1. Cash flow health assessment
2. Trends and patterns
3. Cash runway estimate (days until zero)
4. Recommendations for improvement
5. Alert thresholds`;

    const response = await this.ai.generateText({
      prompt,
      maxTokens: 1000,
      temperature: 0.6,
    });

    // Calculate runway (simplified)
    const dailyBurn = expenses / 90;
    const runway = dailyBurn > 0 ? netCashFlow / dailyBurn : 999;

    return {
      output: {
        analysis: response.text,
        metrics: {
          income,
          expenses,
          netCashFlow,
          runwayDays: Math.floor(runway),
        },
      },
      reasoning: 'Analyzed cash flow patterns to assess financial health and provide actionable recommendations.',
    };
  }

  private async detectAnomalies(organizationId: string): Promise<AgentResult> {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        organizationId,
        date: { gte: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000) }, // Last 6 months
      },
      orderBy: { date: 'asc' },
    });

    const prompt = `Detect financial anomalies in transaction data.

Transactions (last 6 months):
${JSON.stringify(
  transactions.map((t) => ({
    date: t.date.toISOString(),
    type: t.type,
    category: t.category,
    amount: t.amount,
  })),
  null,
  2,
)}

Identify:
1. Unusual spending patterns
2. Revenue anomalies
3. Category-level outliers
4. Time-based irregularities
5. Potential fraud indicators

Format as JSON:
{
  "anomalies": [
    {"type": "unusual_spending", "description": "...", "severity": "high|medium|low", "date": "...", "amount": 0}
  ],
  "recommendations": [...]
}`;

    const response = await this.ai.generateText({
      prompt,
      maxTokens: 1500,
      temperature: 0.4,
    });

    const structured = await this.ai.extractStructured({
      text: response.text,
      schema: {
        anomalies: [
          {
            type: 'string',
            description: 'string',
            severity: 'string',
            date: 'string',
            amount: 'number',
          },
        ],
        recommendations: ['string'],
      },
    });

    return {
      output: {
        anomalies: structured.anomalies || [],
        recommendations: structured.recommendations || [],
      },
      reasoning: 'Analyzed transaction patterns using statistical methods to identify anomalies and potential issues.',
    };
  }
}


