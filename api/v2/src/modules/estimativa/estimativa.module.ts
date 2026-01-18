import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ator } from '../ator/entities/ator.entity';
import { BillingModule } from '../billing/billing.module';
import { CasoUso } from '../caso-uso/entities/caso-uso.entity';
import { FatorAmbientalProjeto } from '../fator-ambiental-projeto/entities/fator-ambiental-projeto.entity';
import { FatorTecnicoProjeto } from '../fator-tecnico-projeto/entities/fator-tecnico-projeto.entity';
import { ProjetoModule } from '../projeto/projeto.module';
import { Estimativa } from './entities/estimativa.entity';
import { EstimativaController } from './estimativa.controller';
import { EstimativaService } from './estimativa.service';

@Module({
  controllers: [EstimativaController],
  providers: [EstimativaService],
  imports: [
    TypeOrmModule.forFeature([
      Estimativa,
      Ator,
      CasoUso,
      FatorAmbientalProjeto,
      FatorTecnicoProjeto,
    ]),
    ProjetoModule,
    BillingModule,
  ],
})
export class EstimativaModule {}
