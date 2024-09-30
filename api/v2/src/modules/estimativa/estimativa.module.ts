import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ator } from '../ator/entities/ator.entity';
import { CasoUso } from '../caso-uso/entities/caso-uso.entity';
import { ProjetoModule } from '../projeto/projeto.module';
import { Estimativa } from './entities/estimativa.entity';
import { EstimativaController } from './estimativa.controller';
import { EstimativaService } from './estimativa.service';

@Module({
  controllers: [EstimativaController],
  providers: [EstimativaService],
  imports: [
    TypeOrmModule.forFeature([Estimativa, Ator, CasoUso]),
    ProjetoModule,
  ],
})
export class EstimativaModule {}
