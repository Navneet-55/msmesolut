import { GoogleGenerativeAI } from '@google/generative-ai';
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

export class GeminiProvider extends AIProvider {
  private genAI: GoogleGenerativeAI;
  private modelName: string;

  constructor(apiKey: string, modelName: string = 'gemini-pro') {
    super();
    if (!apiKey) {
      throw new Error('Gemini API key is required');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.modelName = modelName;
  }

  async generateText(options: AIGenerateTextOptions): Promise<AIGenerateTextResponse> {
    const { prompt, maxTokens = 2048, temperature = 0.7, systemPrompt } = options;

    try {
      const model = this.genAI.getGenerativeModel({
        model: this.modelName,
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature,
        },
      });

      const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();

      return {
        text,
        usage: {
          promptTokens: response.usageMetadata?.promptTokenCount || 0,
          completionTokens: response.usageMetadata?.candidatesTokenCount || 0,
          totalTokens: response.usageMetadata?.totalTokenCount || 0,
        },
      };
    } catch (error: any) {
      throw new Error(`Gemini API error: ${error.message}`);
    }
  }

  async summarize(options: AISummarizeOptions): Promise<string> {
    const { text, maxLength = 200, focus } = options;

    const focusPrompt = focus ? ` Focus on: ${focus}` : '';
    const prompt = `Summarize the following text in ${maxLength} words or less.${focusPrompt}\n\nText:\n${text}`;

    const response = await this.generateText({ prompt, maxTokens: 500 });
    return response.text;
  }

  async extractStructured<T = any>(options: AIExtractStructuredOptions): Promise<T> {
    const { text, schema, description } = options;

    const schemaDescription = JSON.stringify(schema, null, 2);
    const desc = description || 'Extract structured data from the text';
    const prompt = `${desc}\n\nSchema:\n${schemaDescription}\n\nText:\n${text}\n\nReturn only valid JSON matching the schema.`;

    const response = await this.generateText({
      prompt,
      maxTokens: 2048,
      temperature: 0.3, // Lower temperature for structured extraction
    });

    try {
      // Try to parse JSON from response
      const jsonMatch = response.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as T;
      }
      return JSON.parse(response.text) as T;
    } catch (error) {
      throw new Error(`Failed to parse structured data: ${error}`);
    }
  }

  async classify(options: AIClassifyOptions): Promise<{ category: string; confidence: number }> {
    const { text, categories, description } = options;

    const categoriesList = categories.join(', ');
    const desc = description || 'Classify the text into one of the categories';
    const prompt = `${desc}\n\nCategories: ${categoriesList}\n\nText: ${text}\n\nRespond with JSON: {"category": "category_name", "confidence": 0.0-1.0, "reasoning": "brief explanation"}`;

    const response = await this.generateText({
      prompt,
      maxTokens: 200,
      temperature: 0.5,
    });

    try {
      const jsonMatch = response.text.match(/\{[\s\S]*\}/);
      const result = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(response.text);
      return {
        category: result.category,
        confidence: result.confidence || 0.5,
      };
    } catch (error) {
      // Fallback: return first category with medium confidence
      return {
        category: categories[0],
        confidence: 0.5,
      };
    }
  }

  async embed(options: AIEmbedOptions): Promise<AIEmbedResponse> {
    // Gemini doesn't have a direct embedding API in the same way
    // This is a stub that could be implemented with alternative methods
    // For now, return a mock embedding
    const { text } = options;
    
    // In production, you might use a different embedding model
    // or use Gemini's text-embedding capabilities if available
    throw new Error('Embedding not yet implemented for Gemini. Use a dedicated embedding service.');
  }
}


