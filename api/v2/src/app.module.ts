import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
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
import { TypeOrmConfigService } from './config/typeorm.config';

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
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {}
