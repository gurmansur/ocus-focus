import { Module } from '@nestjs/common';
import { SuiteDeTesteService } from './suite-de-teste.service';
import { SuiteDeTesteController } from './suite-de-teste.controller';

@Module({
  controllers: [SuiteDeTesteController],
  providers: [SuiteDeTesteService],
})
export class SuiteDeTesteModule {}
