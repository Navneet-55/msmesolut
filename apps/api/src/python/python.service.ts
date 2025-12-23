import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class PythonService {
  private readonly logger = new Logger(PythonService.name);
  private readonly client: AxiosInstance;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('PYTHON_API_URL', 'http://localhost:5000');
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/health');
      return response.data.status === 'ok';
    } catch (error) {
      this.logger.warn('Python service not available', error);
      return false;
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.client.post('/ai/embed', { text });
      return response.data.embedding;
    } catch (error: any) {
      this.logger.error('Failed to generate embedding', error.message);
      throw new Error(`Python embedding service error: ${error.message}`);
    }
  }

  async generateEmbeddingsBatch(texts: string[]): Promise<number[][]> {
    try {
      const response = await this.client.post('/ai/embed/batch', { texts });
      return response.data.embeddings;
    } catch (error: any) {
      this.logger.error('Failed to generate batch embeddings', error.message);
      throw new Error(`Python embedding service error: ${error.message}`);
    }
  }

  async calculateSimilarity(embedding1: number[], embedding2: number[]): Promise<number> {
    try {
      const response = await this.client.post('/ai/similarity', {
        embedding1,
        embedding2,
      });
      return response.data.similarity;
    } catch (error: any) {
      this.logger.error('Failed to calculate similarity', error.message);
      throw new Error(`Python similarity service error: ${error.message}`);
    }
  }

  async analyzeSentiment(text: string): Promise<{
    sentiment: string;
    confidence: number;
    positive_score: number;
    negative_score: number;
  }> {
    try {
      const response = await this.client.post('/ai/classify/sentiment', { text });
      return response.data;
    } catch (error: any) {
      this.logger.error('Failed to analyze sentiment', error.message);
      throw new Error(`Python sentiment analysis error: ${error.message}`);
    }
  }

  async analyzeTimeSeries(data: Array<Record<string, unknown>>, dateField = 'date', valueField = 'value') {
    try {
      const response = await this.client.post('/ai/analyze/timeseries', {
        data,
        date_field: dateField,
        value_field: valueField,
      });
      return response.data;
    } catch (error: any) {
      this.logger.error('Failed to analyze time series', error.message);
      throw new Error(`Python time series analysis error: ${error.message}`);
    }
  }

  async detectAnomalies(values: number[], method = 'iqr') {
    try {
      const response = await this.client.post('/ai/analyze/anomalies', {
        values,
        method,
      });
      return response.data;
    } catch (error: any) {
      this.logger.error('Failed to detect anomalies', error.message);
      throw new Error(`Python anomaly detection error: ${error.message}`);
    }
  }

  async forecast(values: number[], periods = 7, method = 'moving_average') {
    try {
      const response = await this.client.post('/ai/analyze/forecast', {
        values,
        periods,
        method,
      });
      return response.data;
    } catch (error: any) {
      this.logger.error('Failed to generate forecast', error.message);
      throw new Error(`Python forecasting error: ${error.message}`);
    }
  }

  async enhanceCustomerSupport(ticketText: string, knowledgeBase: string[]) {
    try {
      const response = await this.client.post('/agents/enhance/customer-support', {
        ticket_text: ticketText,
        knowledge_base: knowledgeBase,
      });
      return response.data;
    } catch (error: any) {
      this.logger.error('Failed to enhance customer support', error.message);
      throw new Error(`Python customer support enhancement error: ${error.message}`);
    }
  }

  async enhanceFinancialAnalysis(transactions: Array<Record<string, unknown>>) {
    try {
      const response = await this.client.post('/agents/enhance/financial', {
        transactions,
      });
      return response.data;
    } catch (error: any) {
      this.logger.error('Failed to enhance financial analysis', error.message);
      throw new Error(`Python financial enhancement error: ${error.message}`);
    }
  }

  async enhanceLeadScoring(leadData: Record<string, unknown>) {
    try {
      const response = await this.client.post('/agents/enhance/lead-scoring', {
        lead_data: leadData,
      });
      return response.data;
    } catch (error: any) {
      this.logger.error('Failed to enhance lead scoring', error.message);
      throw new Error(`Python lead scoring enhancement error: ${error.message}`);
    }
  }
}

