import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AtorModule } from './modules/ator/ator.module';
import { AuthModule } from './modules/auth/auth.module';
import { CasoUsoModule } from './modules/caso-uso/caso-uso.module';
import { CenariosModule } from './modules/cenarios/cenarios.module';
import { ColaboradorModule } from './modules/colaborador/colaborador.module';
import { EstimativaModule } from './modules/estimativa/estimativa.module';
import { FatoresAmbientaisModule } from './modules/fatores-ambientais/fatores-ambientais.module';
import { FatoresTecnicosModule } from './modules/fatores-tecnicos/fatores-tecnicos.module';
import { PriorizacaoModule } from './modules/priorizacao/priorizacao.module';
import { ProjetoModule } from './modules/projeto/projeto.module';
import { RequisitoModule } from './modules/requisito/requisito.module';
import { StakeholderModule } from './modules/stakeholder/stakeholder.module';

@Module({
  imports: [AtorModule, AuthModule, CasoUsoModule, CenariosModule, ColaboradorModule, EstimativaModule, FatoresAmbientaisModule, FatoresTecnicosModule, PriorizacaoModule, ProjetoModule, RequisitoModule, StakeholderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
