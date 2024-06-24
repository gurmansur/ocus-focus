import { Module } from '@nestjs/common';
import { CasoUsoService } from './caso-uso.service';
import { CasoUsoController } from './caso-uso.controller';

@Module({
  controllers: [CasoUsoController],
  providers: [CasoUsoService],
})
export class CasoUsoModule {}
