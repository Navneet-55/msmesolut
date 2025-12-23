import { BaseAgent, AgentResult } from '../base.agent';
import { PrismaService } from '../../../prisma/prisma.service';
import { AIProvider } from '../../../ai/ai.provider';

export class SupplyChainAgent extends BaseAgent {
  async execute(organizationId: string, input: any): Promise<AgentResult> {
    const { action, productId } = input;

    if (action === 'optimize_inventory') {
      return this.optimizeInventory(organizationId);
    }

    if (action === 'forecast_demand') {
      return this.forecastDemand(organizationId, productId);
    }

    if (action === 'suggest_reorder') {
      return this.suggestReorder(organizationId);
    }

    throw new Error(`Unknown action: ${action}`);
  }

  private async optimizeInventory(organizationId: string): Promise<AgentResult> {
    const inventory = await this.prisma.inventoryItem.findMany({
      where: { organizationId },
      include: { product: true },
    });

    const orders = await this.prisma.order.findMany({
      where: {
        organizationId,
        createdAt: { gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
      },
      include: { items: { include: { product: true } } },
    });

    // Calculate demand patterns
    const productDemand: Record<string, number> = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const sku = item.product.sku;
        productDemand[sku] = (productDemand[sku] || 0) + item.quantity;
      });
    });

    const prompt = `Optimize inventory levels for the organization.

Current Inventory:
${JSON.stringify(
  inventory.map((item) => ({
    product: item.product.name,
    sku: item.product.sku,
    currentStock: item.quantity,
    minStock: item.minStock,
    maxStock: item.maxStock,
    cost: item.product.cost,
  })),
  null,
  2,
)}

Demand (last 90 days):
${JSON.stringify(productDemand, null, 2)}

Provide:
1. Optimal stock levels for each product
2. Reorder points
3. Safety stock recommendations
4. Cost optimization suggestions
5. ABC analysis (high/medium/low value items)
6. Dead stock identification

Format as JSON:
{
  "recommendations": [
    {"sku": "...", "currentStock": 0, "recommendedStock": 0, "reorderPoint": 0, "reason": "..."}
  ],
  "abcAnalysis": {...},
  "deadStock": [...]
}`;

    const response = await this.ai.generateText({
      prompt,
      maxTokens: 2000,
      temperature: 0.5,
    });

    const structured = await this.ai.extractStructured({
      text: response.text,
      schema: {
        recommendations: [
          {
            sku: 'string',
            currentStock: 'number',
            recommendedStock: 'number',
            reorderPoint: 'number',
            reason: 'string',
          },
        ],
        abcAnalysis: 'object',
        deadStock: ['string'],
      },
    });

    return {
      output: {
        recommendations: structured.recommendations || [],
        abcAnalysis: structured.abcAnalysis || {},
        deadStock: structured.deadStock || [],
      },
      reasoning: 'Analyzed inventory levels, demand patterns, and cost factors to optimize stock levels and reduce carrying costs.',
    };
  }

  private async forecastDemand(organizationId: string, productId?: string): Promise<AgentResult> {
    const where: any = { organizationId };
    if (productId) {
      where.productId = productId;
    }

    const inventory = await this.prisma.inventoryItem.findMany({
      where,
      include: { product: true },
    });

    const orders = await this.prisma.order.findMany({
      where: {
        organizationId,
        createdAt: { gte: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000) },
      },
      include: { items: { include: { product: true } } },
    });

    // Group orders by month
    const monthlyDemand: Record<string, Record<string, number>> = {};
    orders.forEach((order) => {
      const month = order.createdAt.toISOString().substring(0, 7); // YYYY-MM
      order.items.forEach((item) => {
        const sku = item.product.sku;
        if (!monthlyDemand[month]) monthlyDemand[month] = {};
        monthlyDemand[month][sku] = (monthlyDemand[month][sku] || 0) + item.quantity;
      });
    });

    const prompt = `Forecast demand for products.

Historical Demand (last 6 months):
${JSON.stringify(monthlyDemand, null, 2)}

Current Inventory:
${JSON.stringify(
  inventory.map((item) => ({
    sku: item.product.sku,
    name: item.product.name,
    currentStock: item.quantity,
  })),
  null,
  2,
)}

Provide:
1. Demand forecast for next 3 months per product
2. Seasonal patterns identified
3. Growth trends
4. Confidence levels
5. Recommendations for procurement

Format as JSON:
{
  "forecast": [
    {"sku": "...", "month": "2024-01", "predictedDemand": 0, "confidence": 0.0}
  ],
  "trends": {...},
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
        forecast: [
          {
            sku: 'string',
            month: 'string',
            predictedDemand: 'number',
            confidence: 'number',
          },
        ],
        trends: 'object',
        recommendations: ['string'],
      },
    });

    return {
      output: {
        forecast: structured.forecast || [],
        trends: structured.trends || {},
        recommendations: structured.recommendations || [],
      },
      reasoning: 'Forecasted demand using historical sales data, seasonal patterns, and trend analysis.',
    };
  }

  private async suggestReorder(organizationId: string): Promise<AgentResult> {
    const inventory = await this.prisma.inventoryItem.findMany({
      where: { organizationId },
      include: { product: true },
    });

    const lowStockItems = inventory.filter(
      (item) => item.quantity <= item.minStock || (item.quantity < item.minStock * 1.2),
    );

    const prompt = `Suggest reorder quantities for low stock items.

Low Stock Items:
${JSON.stringify(
  lowStockItems.map((item) => ({
    product: item.product.name,
    sku: item.product.sku,
    currentStock: item.quantity,
    minStock: item.minStock,
    maxStock: item.maxStock,
    cost: item.product.cost,
    price: item.product.price,
  })),
  null,
  2,
)}

Provide:
1. Recommended reorder quantity for each item
2. Total reorder cost
3. Priority ranking
4. Supplier recommendations (if applicable)
5. Expected delivery timeline

Format as JSON:
{
  "reorders": [
    {"sku": "...", "currentStock": 0, "recommendedOrder": 0, "cost": 0, "priority": "high|medium|low"}
  ],
  "totalCost": 0,
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
        reorders: [
          {
            sku: 'string',
            currentStock: 'number',
            recommendedOrder: 'number',
            cost: 'number',
            priority: 'string',
          },
        ],
        totalCost: 'number',
        recommendations: ['string'],
      },
    });

    return {
      output: {
        reorders: structured.reorders || [],
        totalCost: structured.totalCost || 0,
        recommendations: structured.recommendations || [],
      },
      reasoning: 'Analyzed inventory levels against min/max thresholds and demand patterns to suggest optimal reorder quantities.',
    };
  }
}


