// Agent Types and Interfaces

export type AgentType =
  | 'customer_support'
  | 'marketing'
  | 'financial'
  | 'supply_chain'
  | 'onboarding'
  | 'competitive'
  | 'data_integration'
  | 'sales_lead';

export type AgentStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface AgentInput {
  action: string;
  [key: string]: unknown;
}

export interface AgentRunResult {
  id: string;
  output: Record<string, unknown>;
  reasoning?: string;
  metadata?: Record<string, unknown>;
}

export interface AgentEntityLink {
  ticketId?: string;
  campaignId?: string;
  leadId?: string;
}

