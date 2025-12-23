import { Controller, Get, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { DataService } from './data.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantInterceptor } from '../common/interceptors/tenant.interceptor';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../common/types/user.types';
import { PaginationDto, DateRangeDto } from './dto/data.dto';

@Controller('data')
@UseGuards(JwtAuthGuard)
@UseInterceptors(TenantInterceptor)
export class DataController {
  constructor(private dataService: DataService) {}

  @Get('dashboard')
  async getDashboard(@CurrentUser() user: User) {
    return this.dataService.getDashboard(user.currentOrganizationId);
  }

  @Get('analytics')
  async getAnalytics(
    @CurrentUser() user: User,
    @Query() dateRange: DateRangeDto,
  ) {
    const startDate = dateRange.startDate ? new Date(dateRange.startDate) : undefined;
    const endDate = dateRange.endDate ? new Date(dateRange.endDate) : undefined;
    return this.dataService.getAnalytics(user.currentOrganizationId, startDate, endDate);
  }

  @Get('activity')
  async getActivityLog(
    @CurrentUser() user: User,
    @Query() pagination: PaginationDto,
  ) {
    return this.dataService.getActivityLog(
      user.currentOrganizationId,
      pagination.page,
      pagination.limit,
    );
  }
}


