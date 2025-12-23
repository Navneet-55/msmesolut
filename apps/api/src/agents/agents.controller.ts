import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { AgentsService } from './agents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantInterceptor } from '../common/interceptors/tenant.interceptor';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RunAgentDto } from '../common/dto/agent.dto';
import { User } from '../common/types/user.types';
import { AgentType } from '../common/types/agent.types';

@Controller('agents')
@UseGuards(JwtAuthGuard)
@UseInterceptors(TenantInterceptor)
export class AgentsController {
  constructor(private agentsService: AgentsService) {}

  @Post('run')
  async runAgent(
    @Body() body: RunAgentDto,
    @CurrentUser() user: User,
  ) {
    return this.agentsService.runAgent(
      user.currentOrganizationId,
      body.agentType,
      body.input,
      user.id,
      body.entityId,
    );
  }

  @Get('runs')
  async getRuns(
    @Query('agentType') agentType?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @CurrentUser() user?: User,
  ) {
    if (!user?.currentOrganizationId) {
      throw new Error('User organization not found');
    }
    return this.agentsService.getAgentRuns(
      user.currentOrganizationId,
      agentType as AgentType | undefined,
      limit || 50,
    );
  }

  @Get('runs/:id')
  async getRun(@Param('id') id: string, @CurrentUser() user: any) {
    return this.agentsService.getAgentRun(user.currentOrganizationId, id);
  }
}


