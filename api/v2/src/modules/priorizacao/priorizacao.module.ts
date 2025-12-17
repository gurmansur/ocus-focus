import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequisitoModule } from '../requisito/requisito-funcional.module';
import { ResultadoRequisitoModule } from '../resultado-requisito/resultado-requisito.module';
import { StakeholderModule } from '../stakeholder/stakeholder.module';
import { StatusPriorizacaoModule } from '../status-priorizacao/status-priorizacao.module';
import { Priorizacao } from './entities/priorizacao.entity';
import { PriorizacaoController } from './priorizacao.controller';
import { PriorizacaoService } from './priorizacao.service';

@Module({
  controllers: [PriorizacaoController],
  providers: [PriorizacaoService],
  imports: [
    TypeOrmModule.forFeature([Priorizacao]),
    ResultadoRequisitoModule,
    StakeholderModule,
    StatusPriorizacaoModule,
    RequisitoModule,
  ],
})
export class PriorizacaoModule {}
