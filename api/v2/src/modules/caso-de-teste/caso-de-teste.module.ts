import { Module } from '@nestjs/common';
import { CasoDeTesteService } from './caso-de-teste.service';
import { CasoDeTesteController } from './caso-de-teste.controller';

@Module({
  controllers: [CasoDeTesteController],
  providers: [CasoDeTesteService],
})
export class CasoDeTesteModule {}
