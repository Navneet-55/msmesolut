import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AgentsService } from './agents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantInterceptor } from '../common/interceptors/tenant.interceptor';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('agents')
@UseGuards(JwtAuthGuard)
@UseInterceptors(TenantInterceptor)
export class AgentsController {
  constructor(private agentsService: AgentsService) {}

  @Post('run')
  async runAgent(
    @Body() body: { agentType: string; input: any; entityId?: string },
    @CurrentUser() user: any,
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
    @Query('limit') limit?: string,
    @CurrentUser() user?: any,
  ) {
    return this.agentsService.getAgentRuns(
      user.currentOrganizationId,
      agentType,
      limit ? parseInt(limit) : 50,
    );
  }

  @Get('runs/:id')
  async getRun(@Param('id') id: string, @CurrentUser() user: any) {
    return this.agentsService.getAgentRun(user.currentOrganizationId, id);
  }
}


