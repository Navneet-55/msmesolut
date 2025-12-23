import { IsString, IsNotEmpty, IsOptional, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AgentType } from '../types/agent.types';

export class RunAgentDto {
  @IsString()
  @IsNotEmpty()
  agentType: AgentType;

  @IsObject()
  @IsNotEmpty()
  input: Record<string, unknown>;

  @IsString()
  @IsOptional()
  entityId?: string;
}

export class GetAgentRunsDto {
  @IsString()
  @IsOptional()
  agentType?: AgentType;

  @IsOptional()
  limit?: number;
}

