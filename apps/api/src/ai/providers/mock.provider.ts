import {
  AIProvider,
  AIGenerateTextOptions,
  AIGenerateTextResponse,
  AISummarizeOptions,
  AIExtractStructuredOptions,
  AIClassifyOptions,
  AIEmbedOptions,
  AIEmbedResponse,
} from '../ai.provider';

// Mock provider for development/testing without API keys
export class MockProvider extends AIProvider {
  async generateText(options: AIGenerateTextOptions): Promise<AIGenerateTextResponse> {
    const { prompt } = options;
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Generate a mock response based on prompt
    const mockResponse = this.generateMockResponse(prompt);

    return {
      text: mockResponse,
      usage: {
        promptTokens: Math.floor(prompt.length / 4),
        completionTokens: Math.floor(mockResponse.length / 4),
        totalTokens: Math.floor((prompt.length + mockResponse.length) / 4),
      },
    };
  }

  async summarize(options: AISummarizeOptions): Promise<string> {
    const { text, maxLength } = options;
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    const words = text.split(' ').slice(0, maxLength || 50);
    return words.join(' ') + '...';
  }

  async extractStructured<T = any>(options: AIExtractStructuredOptions): Promise<T> {
    const { text, schema } = options;
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Generate mock structured data based on schema
    const mockData: any = {};
    for (const key in schema) {
      if (typeof schema[key] === 'string') {
        mockData[key] = `Mock ${key} from: ${text.substring(0, 50)}`;
      } else if (typeof schema[key] === 'number') {
        mockData[key] = Math.floor(Math.random() * 100);
      } else if (typeof schema[key] === 'boolean') {
        mockData[key] = Math.random() > 0.5;
      } else if (Array.isArray(schema[key])) {
        mockData[key] = [];
      } else if (typeof schema[key] === 'object') {
        mockData[key] = {};
      }
    }

    return mockData as T;
  }

  async classify(options: AIClassifyOptions): Promise<{ category: string; confidence: number }> {
    const { categories } = options;
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Randomly select a category with high confidence
    const category = categories[Math.floor(Math.random() * categories.length)];
    return {
      category,
      confidence: 0.7 + Math.random() * 0.3, // 0.7-1.0
    };
  }

  async embed(options: AIEmbedOptions): Promise<AIEmbedResponse> {
    const { text } = options;
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Generate a mock 768-dimensional embedding
    const embedding = Array.from({ length: 768 }, () => Math.random() * 2 - 1);
    return {
      embedding,
      model: 'mock-embedding',
    };
  }

  private generateMockResponse(prompt: string): string {
    const lowerPrompt = prompt.toLowerCase();

    if (lowerPrompt.includes('ticket') || lowerPrompt.includes('support')) {
      return `Based on the ticket information, I recommend the following response:

Thank you for contacting us. We understand your concern and are here to help. Our team will review your request and get back to you within 24 hours.

In the meantime, you might find our knowledge base article helpful: [Link to relevant article]

Best regards,
Support Team`;
    }

    if (lowerPrompt.includes('marketing') || lowerPrompt.includes('campaign')) {
      return `Marketing Campaign Strategy:

1. Target Audience: Identify key demographics and pain points
2. Messaging: Craft compelling value propositions
3. Channels: Multi-channel approach (email, social, content)
4. Timeline: 4-week campaign with weekly milestones
5. Budget Allocation: 40% content, 30% ads, 20% email, 10% analytics

Expected ROI: 3-5x based on historical data.`;
    }

    if (lowerPrompt.includes('financial') || lowerPrompt.includes('forecast')) {
      return `Financial Forecast Analysis:

Based on current trends and historical data:
- Q1 Revenue: $125,000 (projected)
- Q2 Revenue: $145,000 (projected)
- Cash Flow: Positive with 45-day runway
- Key Risks: Seasonal fluctuations, market volatility

Recommendations:
1. Maintain 3-month emergency fund
2. Monitor accounts receivable closely
3. Consider diversifying revenue streams`;
    }

    if (lowerPrompt.includes('lead') || lowerPrompt.includes('qualify')) {
      return `Lead Qualification Analysis:

Score: 85/100 (High Priority)

Strengths:
- Company size matches ICP
- Budget confirmed
- Decision maker identified
- Timeline: 30-60 days

Next Steps:
1. Schedule discovery call
2. Send personalized demo
3. Provide case studies
4. Follow up in 3 days`;
    }

    // Default generic response
    return `I've analyzed your request and here's my recommendation:

Based on the information provided, I suggest taking a systematic approach to address this. The key factors to consider are:

1. Understanding the core requirements
2. Identifying potential challenges
3. Developing a structured solution
4. Implementing with measurable outcomes

Would you like me to elaborate on any specific aspect?`;
  }
}


