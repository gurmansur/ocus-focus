import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResultadoRequisito } from './entities/resultado-requisito.entity';
import { ResultadoRequisitoController } from './resultado-requisito.controller';
import { ResultadoRequisitoService } from './resultado-requisito.service';

@Module({
  controllers: [ResultadoRequisitoController],
  providers: [ResultadoRequisitoService],
  imports: [TypeOrmModule.forFeature([ResultadoRequisito])],
})
export class ResultadoRequisitoModule {}
