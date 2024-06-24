import { Module } from '@nestjs/common';
import { FatoresTecnicosService } from './fatores-tecnicos.service';
import { FatoresTecnicosController } from './fatores-tecnicos.controller';

@Module({
  controllers: [FatoresTecnicosController],
  providers: [FatoresTecnicosService],
})
export class FatoresTecnicosModule {}
