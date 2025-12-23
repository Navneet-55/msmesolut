// AI Provider Interface
// Abstract interface for AI providers (Gemini, OpenAI, etc.)

export interface AIGenerateTextOptions {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

export interface AIGenerateTextResponse {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AISummarizeOptions {
  text: string;
  maxLength?: number;
  focus?: string;
}

export interface AIExtractStructuredOptions {
  text: string;
  schema: Record<string, any>;
  description?: string;
}

export interface AIClassifyOptions {
  text: string;
  categories: string[];
  description?: string;
}

export interface AIEmbedOptions {
  text: string;
  model?: string;
}

export interface AIEmbedResponse {
  embedding: number[];
  model?: string;
}

export abstract class AIProvider {
  abstract generateText(options: AIGenerateTextOptions): Promise<AIGenerateTextResponse>;
  abstract summarize(options: AISummarizeOptions): Promise<string>;
  abstract extractStructured<T = any>(options: AIExtractStructuredOptions): Promise<T>;
  abstract classify(options: AIClassifyOptions): Promise<{ category: string; confidence: number }>;
  abstract embed(options: AIEmbedOptions): Promise<AIEmbedResponse>;
}


