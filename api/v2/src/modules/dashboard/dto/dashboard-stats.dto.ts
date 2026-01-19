import { ApiProperty } from '@nestjs/swagger';

export class CollaboratorDashboardStatsDto {
  @ApiProperty({ description: 'Taxa de aprovação de testes (%)', example: 87 })
  testApprovalRate: number;

  @ApiProperty({ description: 'Número de user stories pendentes', example: 12 })
  pendingUserStories: number;

  @ApiProperty({ description: 'Total de horas estimadas', example: 240 })
  estimatedHours: number;

  @ApiProperty({
    description: 'Taxa de resposta dos questionários de priorização (%)',
    example: 75,
  })
  prioritizationResponseRate: number;
}

export class StakeholderDashboardStatsDto {
  @ApiProperty({ description: 'Taxa de aprovação de testes (%)', example: 87 })
  testApprovalRate: number;

  @ApiProperty({ description: 'Número de user stories pendentes', example: 12 })
  pendingUserStories: number;

  @ApiProperty({ description: 'Total de horas estimadas', example: 240 })
  estimatedHours: number;

  @ApiProperty({
    description: 'Taxa de resposta dos questionários de priorização (%)',
    example: 75,
  })
  prioritizationResponseRate: number;
}

export class RecentActivityDto {
  @ApiProperty({ description: 'Tipo da atividade', example: 'TEST_CREATED' })
  activityType: string;

  @ApiProperty({ description: 'Descrição da atividade' })
  description: string;

  @ApiProperty({ description: 'Item relacionado' })
  item: string;

  @ApiProperty({ description: 'Data e hora da atividade' })
  timestamp: Date;

  @ApiProperty({ description: 'Nome do usuário que realizou a atividade' })
  userName: string;

  @ApiProperty({ description: 'ID do usuário', required: false })
  userId?: number;
}

export class ProjectSummaryDto {
  @ApiProperty({ description: 'Nome do projeto' })
  projectName: string;

  @ApiProperty({ description: 'Progresso do projeto (%)', example: 85 })
  progress: number;

  @ApiProperty({ description: 'Status do projeto' })
  status: string;

  @ApiProperty({ description: 'Número de testes', example: 45 })
  testCount: number;

  @ApiProperty({ description: 'Taxa de sucesso (%)', example: 92 })
  successRate: number;
}
