import { Injectable, Inject } from '@nestjs/common';
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
import { PythonService } from '../../python/python.service';
import { GeminiProvider } from './gemini.provider';

/**
 * Enhanced AI Provider that combines Gemini with Python services
 * Uses Python for embeddings, sentiment analysis, and advanced ML operations
 */
@Injectable()
export class PythonEnhancedProvider extends AIProvider {
  private geminiProvider: GeminiProvider;
  private pythonService: PythonService;

  constructor(
    apiKey: string,
    modelName: string,
    pythonService: PythonService,
  ) {
    super();
    this.geminiProvider = new GeminiProvider(apiKey, modelName);
    this.pythonService = pythonService;
  }

  async generateText(options: AIGenerateTextOptions): Promise<AIGenerateTextResponse> {
    return this.geminiProvider.generateText(options);
  }

  async summarize(options: AISummarizeOptions): Promise<string> {
    return this.geminiProvider.summarize(options);
  }

  async extractStructured<T = any>(options: AIExtractStructuredOptions): Promise<T> {
    return this.geminiProvider.extractStructured<T>(options);
  }

  async classify(options: AIClassifyOptions): Promise<{ category: string; confidence: number }> {
    // Try Python service first for better classification
    try {
      const isAvailable = await this.pythonService.healthCheck();
      if (isAvailable) {
        // Use Python for sentiment-based classification
        const sentiment = await this.pythonService.analyzeSentiment(options.text);
        // Map sentiment to categories if applicable
        if (options.categories.includes(sentiment.sentiment)) {
          return {
            category: sentiment.sentiment,
            confidence: sentiment.confidence,
          };
        }
      }
    } catch (error) {
      // Fallback to Gemini
    }

    return this.geminiProvider.classify(options);
  }

  async embed(options: AIEmbedOptions): Promise<AIEmbedResponse> {
    // Use Python service for embeddings (better quality)
    try {
      const isAvailable = await this.pythonService.healthCheck();
      if (isAvailable) {
        const embedding = await this.pythonService.generateEmbedding(options.text);
        return {
          embedding,
          model: 'sentence-transformers',
        };
      }
    } catch (error) {
      throw new Error('Python embedding service not available');
    }

    throw new Error('Embedding service not available');
  }
}

