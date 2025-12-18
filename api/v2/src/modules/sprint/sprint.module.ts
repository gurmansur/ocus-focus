import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColaboradorProjeto } from '../colaborador-projeto/entities/colaborador-projeto.entity';
import { Projeto } from '../projeto/entities/projeto.entity';
import { Sprint } from './entities/sprint.entity';
import { SprintController } from './sprint.controller';
import { SprintService } from './sprint.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sprint, Projeto, ColaboradorProjeto])],
  controllers: [SprintController],
  providers: [SprintService],
  exports: [SprintService],
})
export class SprintModule {}
