import { MiddlewareConsumer, Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjetoAtualMiddleware } from '../../middlewares/projeto-atual.middleware';
import { ColaboradorProjetoModule } from '../colaborador-projeto/colaborador-projeto.module';
import { ColaboradorModule } from '../colaborador/colaborador.module';
import { KanbanModule } from '../kanban/kanban.module';
import { ResultadoRequisitoModule } from '../resultado-requisito/resultado-requisito.module';
import { StakeholderModule } from '../stakeholder/stakeholder.module';
import { StatusPriorizacaoModule } from '../status-priorizacao/status-priorizacao.module';
import { Projeto } from './entities/projeto.entity';
import { ProjetoController } from './projeto.controller';
import { ProjetoService } from './projeto.service';
import { ProjetoRepository } from './repositories/projeto.repository';

/**
 * Módulo de projetos
 * Responsável por gerenciar todas as funcionalidades relacionadas a projetos
 */
@Module({
  controllers: [ProjetoController],
  providers: [ProjetoService, ProjetoRepository],
  exports: [ProjetoService, ProjetoRepository],
  imports: [
    TypeOrmModule.forFeature([Projeto]),
    ColaboradorModule,
    ColaboradorProjetoModule,
    KanbanModule,
    ResultadoRequisitoModule,
    forwardRef(() => StakeholderModule),
    StatusPriorizacaoModule,
  ],
})
export class ProjetoModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProjetoAtualMiddleware).forRoutes('*');
  }
}
