import { MiddlewareConsumer, Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StakeholderAtualMiddleware } from '../../middlewares/stakeholder-atual.middleware';
import { ProjetoModule } from '../projeto/projeto.module';
import { StatusPriorizacaoModule } from '../status-priorizacao/status-priorizacao.module';
import { UsuarioModule } from '../usuario/usuario.module';
import { Stakeholder } from './entities/stakeholder.entity';
import { StakeholderController } from './stakeholder.controller';
import { StakeholderService } from './stakeholder.service';

@Module({
  controllers: [StakeholderController],
  providers: [StakeholderService],
  exports: [StakeholderService],
  imports: [
    TypeOrmModule.forFeature([Stakeholder]),
    UsuarioModule,
    forwardRef(() => ProjetoModule),
    StatusPriorizacaoModule,
  ],
})
export class StakeholderModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(StakeholderAtualMiddleware).forRoutes('*');
  }
}
