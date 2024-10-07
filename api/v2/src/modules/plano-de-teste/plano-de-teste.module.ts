import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanoDeTeste } from './entities/plano-de-teste.entity';
import { PlanoDeTesteController } from './plano-de-teste.controller';
import { PlanoDeTesteService } from './plano-de-teste.service';

@Module({
  controllers: [PlanoDeTesteController],
  providers: [PlanoDeTesteService],
  imports: [TypeOrmModule.forFeature([PlanoDeTeste])],
})
export class PlanoDeTesteModule {}
