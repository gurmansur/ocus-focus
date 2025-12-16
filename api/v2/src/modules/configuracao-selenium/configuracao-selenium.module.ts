import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfiguracaoSeleniumController } from './configuracao-selenium.controller';
import { ConfiguracaoSeleniumService } from './configuracao-selenium.service';
import { ConfiguracaoSelenium } from './entities/configuracao-selenium.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConfiguracaoSelenium])],
  controllers: [ConfiguracaoSeleniumController],
  providers: [ConfiguracaoSeleniumService],
  exports: [ConfiguracaoSeleniumService],
})
export class ConfiguracaoSeleniumModule {}
