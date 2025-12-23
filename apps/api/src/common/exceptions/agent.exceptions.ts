import { BadRequestException, NotFoundException } from '@nestjs/common';

export class UnknownAgentTypeException extends BadRequestException {
  constructor(agentType: string) {
    super(`Unknown agent type: ${agentType}`);
  }
}

export class AgentExecutionException extends BadRequestException {
  constructor(message: string, public readonly agentRunId?: string) {
    super(`Agent execution failed: ${message}`);
  }
}

export class EntityNotFoundException extends NotFoundException {
  constructor(entityType: string, entityId: string) {
    super(`${entityType} with ID ${entityId} not found`);
  }
}

