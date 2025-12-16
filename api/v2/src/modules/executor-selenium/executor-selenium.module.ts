import { Module } from '@nestjs/common';
import { AcaoDeTesteModule } from '../acao-de-teste/acao-de-teste.module';
import { ConfiguracaoSeleniumModule } from '../configuracao-selenium/configuracao-selenium.module';
import { ExecutorSeleniumService } from './executor-selenium.service';

@Module({
  imports: [AcaoDeTesteModule, ConfiguracaoSeleniumModule],
  providers: [ExecutorSeleniumService],
  exports: [ExecutorSeleniumService],
})
export class ExecutorSeleniumModule {}
