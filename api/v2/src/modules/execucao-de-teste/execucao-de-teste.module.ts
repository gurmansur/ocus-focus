import { Module } from '@nestjs/common';
import { ExecucaoDeTesteService } from './execucao-de-teste.service';
import { ExecucaoDeTesteController } from './execucao-de-teste.controller';

@Module({
  controllers: [ExecucaoDeTesteController],
  providers: [ExecucaoDeTesteService],
})
export class ExecucaoDeTesteModule {}
