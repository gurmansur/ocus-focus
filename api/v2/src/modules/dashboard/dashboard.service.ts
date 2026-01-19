import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CasoDeTeste } from '../caso-de-teste/entities/caso-de-teste.entity';
import { ColaboradorProjeto } from '../colaborador-projeto/entities/colaborador-projeto.entity';
import { Estimativa } from '../estimativa/entities/estimativa.entity';
import { ExecucaoDeTeste } from '../execucao-de-teste/entities/execucao-de-teste.entity';
import { Kanban } from '../kanban/entities/kanban.entity';
import { Swimlane } from '../kanban/entities/swimlane.entity';
import { Priorizacao } from '../priorizacao/entities/priorizacao.entity';
import { Projeto } from '../projeto/entities/projeto.entity';
import { RequisitoFuncional } from '../requisito/entities/requisito-funcional.entity';
import { Sprint } from '../sprint/entities/sprint.entity';
import { UserStory } from '../user-story/entities/user-story.entity';
import {
  CollaboratorDashboardStatsDto,
  ProjectSummaryDto,
  RecentActivityDto,
  StakeholderDashboardStatsDto,
} from './dto/dashboard-stats.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(CasoDeTeste)
    private casoDeTesteRepository: Repository<CasoDeTeste>,
    @InjectRepository(ExecucaoDeTeste)
    private execucaoDeTesteRepository: Repository<ExecucaoDeTeste>,
    @InjectRepository(UserStory)
    private userStoryRepository: Repository<UserStory>,
    @InjectRepository(ColaboradorProjeto)
    private colaboradorProjetoRepository: Repository<ColaboradorProjeto>,
    @InjectRepository(Projeto)
    private projetoRepository: Repository<Projeto>,
    @InjectRepository(Kanban)
    private kanbanRepository: Repository<Kanban>,
    @InjectRepository(Sprint)
    private sprintRepository: Repository<Sprint>,
    @InjectRepository(Estimativa)
    private estimativaRepository: Repository<Estimativa>,
    @InjectRepository(RequisitoFuncional)
    private requisitoRepository: Repository<RequisitoFuncional>,
    @InjectRepository(Priorizacao)
    private priorizacaoRepository: Repository<Priorizacao>,
    @InjectRepository(Swimlane)
    private swimlaneRepository: Repository<Swimlane>,
  ) {}

  async getCollaboratorStats(
    projetoId: number,
  ): Promise<CollaboratorDashboardStatsDto> {
    // Test approval rate
    const recentExecutions = await this.execucaoDeTesteRepository.find({
      where: {
        casoDeTeste: { projeto: { id: projetoId } },
      },
      relations: ['casoDeTeste', 'casoDeTeste.projeto'],
    });

    const testsPassed = recentExecutions.filter(
      (e) => e.resultado === 'SUCESSO',
    ).length;

    const testApprovalRate =
      recentExecutions.length > 0
        ? Math.round((testsPassed / recentExecutions.length) * 100)
        : 0;

    // Pending user stories (not in done swimlane)
    const userStoriesWithSwimlane = await this.userStoryRepository.find({
      where: { projeto: { id: projetoId } },
      relations: ['swimlane'],
    });

    const pendingUserStories = userStoriesWithSwimlane.filter(
      (story) =>
        !story.swimlane?.nome?.toLowerCase().includes('done') &&
        !story.swimlane?.nome?.toLowerCase().includes('concluído'),
    ).length;

    // Estimated hours
    const estimativaList = await this.estimativaRepository.find({
      where: { projeto: { id: projetoId } },
    });

    const estimatedHours = Math.round(
      estimativaList.reduce((sum, est) => sum + (est.estimatedHours || 0), 0),
    );

    // Prioritization response rate
    const allRequisitos = await this.requisitoRepository.find({
      where: { projeto: { id: projetoId } },
    });

    const priorizacoes = await this.priorizacaoRepository.find({
      relations: ['requisitoFuncional', 'requisitoFuncional.projeto'],
    });

    const priorizacoesForProject = priorizacoes.filter(
      (p) => p.requisitoFuncional?.projeto?.id === projetoId,
    );

    // Response rate: how many requirements have at least one prioritization response
    const requisitosWithResponse = new Set(
      priorizacoesForProject
        .map((p) => p.requisitoFuncional?.id)
        .filter(Boolean),
    );

    const prioritizationResponseRate =
      allRequisitos.length > 0
        ? Math.round((requisitosWithResponse.size / allRequisitos.length) * 100)
        : 0;

    return {
      testApprovalRate,
      pendingUserStories,
      estimatedHours,
      prioritizationResponseRate,
    };
  }

  async getStakeholderStats(
    projetoId: number,
  ): Promise<StakeholderDashboardStatsDto> {
    // Test approval rate
    const recentExecutions = await this.execucaoDeTesteRepository.find({
      where: {
        casoDeTeste: { projeto: { id: projetoId } },
      },
      relations: ['casoDeTeste', 'casoDeTeste.projeto'],
    });

    const testsPassed = recentExecutions.filter(
      (e) => e.resultado === 'SUCESSO',
    ).length;

    const testApprovalRate =
      recentExecutions.length > 0
        ? Math.round((testsPassed / recentExecutions.length) * 100)
        : 0;

    // Pending user stories (not in done swimlane)
    const userStoriesWithSwimlane = await this.userStoryRepository.find({
      where: { projeto: { id: projetoId } },
      relations: ['swimlane'],
    });

    const pendingUserStories = userStoriesWithSwimlane.filter(
      (story) =>
        !story.swimlane?.nome?.toLowerCase().includes('done') &&
        !story.swimlane?.nome?.toLowerCase().includes('concluído'),
    ).length;

    // Estimated hours
    const estimativaList = await this.estimativaRepository.find({
      where: { projeto: { id: projetoId } },
    });

    const estimatedHours = Math.round(
      estimativaList.reduce((sum, est) => sum + (est.estimatedHours || 0), 0),
    );

    // Prioritization response rate
    const allRequisitos = await this.requisitoRepository.find({
      where: { projeto: { id: projetoId } },
    });

    const priorizacoes = await this.priorizacaoRepository.find({
      relations: ['requisitoFuncional', 'requisitoFuncional.projeto'],
    });

    const priorizacoesForProject = priorizacoes.filter(
      (p) => p.requisitoFuncional?.projeto?.id === projetoId,
    );

    // Response rate: how many requirements have at least one prioritization response
    const requisitosWithResponse = new Set(
      priorizacoesForProject
        .map((p) => p.requisitoFuncional?.id)
        .filter(Boolean),
    );

    const prioritizationResponseRate =
      allRequisitos.length > 0
        ? Math.round((requisitosWithResponse.size / allRequisitos.length) * 100)
        : 0;

    return {
      testApprovalRate,
      pendingUserStories,
      estimatedHours,
      prioritizationResponseRate,
    };
  }

  async getRecentActivity(projetoId: number): Promise<RecentActivityDto[]> {
    const recentExecutions = await this.execucaoDeTesteRepository.find({
      where: {
        casoDeTeste: { projeto: { id: projetoId } },
      },
      relations: ['casoDeTeste'],
      order: { dataCriacao: 'DESC' },
      take: 10,
    });

    const recentUserStories = await this.userStoryRepository.find({
      where: { projeto: { id: projetoId } },
      relations: ['criador'],
      order: { createdAt: 'DESC' },
      take: 5,
    });

    const activities: RecentActivityDto[] = [];

    // Add test executions
    for (const execution of recentExecutions) {
      let activityType = 'TEST_EXECUTED';
      let description = 'Executed test';

      if (execution.resultado === 'SUCESSO') {
        activityType = 'TEST_PASSED';
        description = 'Test passed successfully';
      } else if (execution.resultado === 'FALHA') {
        activityType = 'TEST_FAILED';
        description = 'Test failed';
      }

      activities.push({
        activityType,
        description,
        item: execution.casoDeTeste?.nome || execution.nome,
        timestamp: execution.dataCriacao,
        userName: 'System',
      });
    }

    // Add user story updates
    for (const story of recentUserStories) {
      activities.push({
        activityType: 'STORY_CREATED',
        description: 'User story created',
        item: story.titulo,
        timestamp: story.createdAt,
        userName: story.criador?.nome || 'Unknown',
        userId: story.criador?.id,
      });
    }

    // Sort by timestamp and limit
    activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return activities.slice(0, 10);
  }

  async getProjectSummary(projetoId: number): Promise<ProjectSummaryDto> {
    const projeto = await this.projetoRepository.findOne({
      where: { id: projetoId },
    });

    const totalTests = await this.casoDeTesteRepository.count({
      where: { projeto: { id: projetoId }, status: 'ATIVO' },
    });

    const executions = await this.execucaoDeTesteRepository.find({
      where: {
        casoDeTeste: { projeto: { id: projetoId } },
      },
      relations: ['casoDeTeste'],
    });

    const successfulTests = executions.filter(
      (e) => e.resultado === 'SUCESSO',
    ).length;
    const successRate =
      executions.length > 0
        ? Math.round((successfulTests / executions.length) * 100)
        : 0;

    const userStories = await this.userStoryRepository.find({
      where: { projeto: { id: projetoId } },
      relations: ['swimlane'],
    });

    const completedStories = userStories.filter(
      (s) =>
        s.swimlane?.nome?.toLowerCase().includes('done') ||
        s.swimlane?.nome?.toLowerCase().includes('concluído'),
    ).length;
    const progress =
      userStories.length > 0
        ? Math.round((completedStories / userStories.length) * 100)
        : 0;

    // Determine status
    let status = 'On Track';
    if (progress >= 100) {
      status = 'Completed';
    } else if (progress < 30 || successRate < 70) {
      status = 'At Risk';
    } else if (progress < 80) {
      status = 'In Progress';
    }

    return {
      projectName: projeto?.nome || 'Unknown Project',
      progress,
      status,
      testCount: totalTests,
      successRate,
    };
  }
}
