import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjetoAtualMiddleware } from '../../middlewares/projeto-atual.middleware';
import { BillingModule } from '../billing/billing.module';
import { KanbanModule } from '../kanban/kanban.module';
import { UsuarioProjetoModule } from '../usuario-projeto/usuario-projeto.module';
import { UsuarioModule } from '../usuario/usuario.module';
import { Projeto } from './entities/projeto.entity';
import { ProjetoController } from './projeto.controller';
import { ProjetoService } from './projeto.service';

@Module({
  controllers: [ProjetoController],
  providers: [ProjetoService],
  exports: [ProjetoService],
  imports: [
    TypeOrmModule.forFeature([Projeto]),
    UsuarioModule,
    UsuarioProjetoModule,
    KanbanModule,
    BillingModule,
  ],
})
export class ProjetoModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProjetoAtualMiddleware).forRoutes('*');
  }
}
