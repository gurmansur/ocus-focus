import { Module } from '@nestjs/common';
import { EstimativaService } from './estimativa.service';
import { EstimativaController } from './estimativa.controller';

@Module({
  controllers: [EstimativaController],
  providers: [EstimativaService],
})
export class EstimativaModule {}
