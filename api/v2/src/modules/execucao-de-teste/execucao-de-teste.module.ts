import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcaoDeTesteModule } from '../acao-de-teste/acao-de-teste.module';
import { CasoDeTesteModule } from '../caso-de-teste/caso-de-teste.module';
import { ConfiguracaoSeleniumModule } from '../configuracao-selenium/configuracao-selenium.module';
import { ExecutorSeleniumModule } from '../executor-selenium/executor-selenium.module';
import { SuiteDeTesteModule } from '../suite-de-teste/suite-de-teste.module';
import { ExecucaoDeTeste } from './entities/execucao-de-teste.entity';
import { ExecucaoDeTesteController } from './execucao-de-teste.controller';
import { ExecucaoDeTesteService } from './execucao-de-teste.service';

@Module({
  controllers: [ExecucaoDeTesteController],
  providers: [ExecucaoDeTesteService],
  imports: [
    TypeOrmModule.forFeature([ExecucaoDeTeste]),
    CasoDeTesteModule,
    SuiteDeTesteModule,
    AcaoDeTesteModule,
    ConfiguracaoSeleniumModule,
    ExecutorSeleniumModule,
  ],
})
export class ExecucaoDeTesteModule {}
