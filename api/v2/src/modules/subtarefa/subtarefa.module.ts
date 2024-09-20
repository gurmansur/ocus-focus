import { Module } from '@nestjs/common';
import { SubtarefaService } from './subtarefa.service';
import { SubtarefaController } from './subtarefa.controller';

@Module({
  controllers: [SubtarefaController],
  providers: [SubtarefaService],
})
export class SubtarefaModule {}
