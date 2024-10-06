import { Module } from '@nestjs/common';
import { PlanoDeTesteService } from './plano-de-teste.service';
import { PlanoDeTesteController } from './plano-de-teste.controller';

@Module({
  controllers: [PlanoDeTesteController],
  providers: [PlanoDeTesteService],
})
export class PlanoDeTesteModule {}
