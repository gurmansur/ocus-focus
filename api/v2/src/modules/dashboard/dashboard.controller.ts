import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BaseController } from '../../common/base/base.controller';
import { ProjetoAtual } from '../../decorators/projeto-atual.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { Projeto } from '../projeto/entities/projeto.entity';
import { DashboardService } from './dashboard.service';
import {
  CollaboratorDashboardStatsDto,
  ProjectSummaryDto,
  RecentActivityDto,
  StakeholderDashboardStatsDto,
} from './dto/dashboard-stats.dto';

@ApiTags('Dashboard')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Não autorizado' })
@UseGuards(AuthGuard)
@Controller('dashboard')
export class DashboardController extends BaseController {
  constructor(private readonly dashboardService: DashboardService) {
    super();
  }

  @ApiOperation({ summary: 'Get dashboard statistics for collaborators' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
    type: CollaboratorDashboardStatsDto,
  })
  @Get('collaborator-stats')
  async getCollaboratorStats(
    @ProjetoAtual() projeto: Projeto,
  ): Promise<CollaboratorDashboardStatsDto> {
    return this.dashboardService.getCollaboratorStats(projeto.id);
  }

  @ApiOperation({ summary: 'Get dashboard statistics for stakeholders' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
    type: StakeholderDashboardStatsDto,
  })
  @Get('stakeholder-stats')
  async getStakeholderStats(
    @ProjetoAtual() projeto: Projeto,
  ): Promise<StakeholderDashboardStatsDto> {
    return this.dashboardService.getStakeholderStats(projeto.id);
  }

  @ApiOperation({ summary: 'Get recent activity for the project' })
  @ApiResponse({
    status: 200,
    description: 'Recent activity retrieved successfully',
    type: [RecentActivityDto],
  })
  @Get('recent-activity')
  async getRecentActivity(
    @ProjetoAtual() projeto: Projeto,
  ): Promise<RecentActivityDto[]> {
    return this.dashboardService.getRecentActivity(projeto.id);
  }

  @ApiOperation({ summary: 'Get project summary' })
  @ApiResponse({
    status: 200,
    description: 'Project summary retrieved successfully',
    type: ProjectSummaryDto,
  })
  @Get('project-summary')
  async getProjectSummary(
    @ProjetoAtual() projeto: Projeto,
  ): Promise<ProjectSummaryDto> {
    return this.dashboardService.getProjectSummary(projeto.id);
  }
}
