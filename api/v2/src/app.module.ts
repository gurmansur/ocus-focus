import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { TypeOrmConfigService } from './config/typeorm.config';
import { AtorModule } from './modules/ator/ator.module';
import { AuthModule } from './modules/auth/auth.module';
import { CasoDeTesteModule } from './modules/caso-de-teste/caso-de-teste.module';
import { CasoUsoModule } from './modules/caso-uso/caso-uso.module';
import { CenariosModule } from './modules/cenarios/cenarios.module';
import { ColaboradorProjetoModule } from './modules/colaborador-projeto/colaborador-projeto.module';
import { ColaboradorModule } from './modules/colaborador/colaborador.module';
import { ComentarioModule } from './modules/comentario/comentario.module';
import { EstimativaModule } from './modules/estimativa/estimativa.module';
import { ExecucaoDeTesteModule } from './modules/execucao-de-teste/execucao-de-teste.module';
import { FatorAmbientalProjetoModule } from './modules/fator-ambiental-projeto/fator-ambiental-projeto.module';
import { FatorTecnicoProjetoModule } from './modules/fator-tecnico-projeto/fator-tecnico-projeto.module';
import { FatoresAmbientaisModule } from './modules/fatores-ambientais/fatores-ambientais.module';
import { FatoresTecnicosModule } from './modules/fatores-tecnicos/fatores-tecnicos.module';
import { KanbanModule } from './modules/kanban/kanban.module';
import { PriorizacaoModule } from './modules/priorizacao/priorizacao.module';
import { ProjetoModule } from './modules/projeto/projeto.module';
import { RequisitoModule } from './modules/requisito/requisito-funcional.module';
import { ResultadoRequisitoModule } from './modules/resultado-requisito/resultado-requisito.module';
import { SprintModule } from './modules/sprint/sprint.module';
import { StakeholderModule } from './modules/stakeholder/stakeholder.module';
import { StatusPriorizacaoModule } from './modules/status-priorizacao/status-priorizacao.module';
import { SuiteDeTesteModule } from './modules/suite-de-teste/suite-de-teste.module';
import { TagModule } from './modules/tag/tag.module';
import { UserStoryModule } from './modules/user-story/user-story.module';
import { UsuarioModule } from './modules/usuario/usuario.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
    AtorModule,
    AuthModule,
    CasoUsoModule,
    CenariosModule,
    ColaboradorModule,
    EstimativaModule,
    FatoresAmbientaisModule,
    FatoresTecnicosModule,
    PriorizacaoModule,
    ProjetoModule,
    RequisitoModule,
    StakeholderModule,
    UsuarioModule,
    FatorTecnicoProjetoModule,
    FatorAmbientalProjetoModule,
    ColaboradorProjetoModule,
    StatusPriorizacaoModule,
    ResultadoRequisitoModule,
    SprintModule,
    UserStoryModule,
    ExecucaoDeTesteModule,
    CasoDeTesteModule,
    SuiteDeTesteModule,
    KanbanModule,
    ComentarioModule,
    TagModule,
  ],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    },
  ],
})
export class AppModule {}
