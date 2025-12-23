import { AgentType } from '../types/agent.types';

export const AGENT_TYPES: AgentType[] = [
  'customer_support',
  'marketing',
  'financial',
  'supply_chain',
  'onboarding',
  'competitive',
  'data_integration',
  'sales_lead',
];

export const AGENT_ENTITY_MAPPING: Record<AgentType, string> = {
  customer_support: 'ticketId',
  marketing: 'campaignId',
  financial: '',
  supply_chain: '',
  onboarding: '',
  competitive: '',
  data_integration: '',
  sales_lead: 'leadId',
};

export const MAX_AGENT_RUNS_LIMIT = 100;
export const DEFAULT_AGENT_RUNS_LIMIT = 50;

