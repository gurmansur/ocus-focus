import { Module } from '@nestjs/common';
import { PriorizacaoService } from './priorizacao.service';
import { PriorizacaoController } from './priorizacao.controller';

@Module({
  controllers: [PriorizacaoController],
  providers: [PriorizacaoService],
})
export class PriorizacaoModule {}
