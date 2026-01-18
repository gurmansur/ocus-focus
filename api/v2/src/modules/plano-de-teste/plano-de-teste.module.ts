import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuiteDeTeste } from '../suite-de-teste/entities/suite-de-teste.entity';
import { PlanoDeTeste } from './entities/plano-de-teste.entity';
import { PlanoDeTesteController } from './plano-de-teste.controller';
import { PlanoDeTesteService } from './plano-de-teste.service';

@Module({
  imports: [TypeOrmModule.forFeature([PlanoDeTeste, SuiteDeTeste])],
  controllers: [PlanoDeTesteController],
  providers: [PlanoDeTesteService],
  exports: [PlanoDeTesteService],
})
export class PlanoDeTesteModule {}
