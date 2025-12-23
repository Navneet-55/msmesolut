import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { DataService } from './data.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantInterceptor } from '../common/interceptors/tenant.interceptor';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('data')
@UseGuards(JwtAuthGuard)
@UseInterceptors(TenantInterceptor)
export class DataController {
  constructor(private dataService: DataService) {}

  @Get('dashboard')
  async getDashboard(@CurrentUser() user: any) {
    return this.dataService.getDashboard(user.currentOrganizationId);
  }
}


