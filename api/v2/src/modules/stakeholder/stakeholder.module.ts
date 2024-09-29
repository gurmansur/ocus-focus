import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
    ProjetoModule,
    StatusPriorizacaoModule,
  ],
})
export class StakeholderModule {}
