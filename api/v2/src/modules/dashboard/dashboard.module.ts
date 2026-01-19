import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CasoDeTeste,
      ExecucaoDeTeste,
      UserStory,
      ColaboradorProjeto,
      Projeto,
      Kanban,
      Sprint,
      Estimativa,
      RequisitoFuncional,
      Priorizacao,
      Swimlane,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
