import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estimativa } from './entities/estimativa.entity';
import { EstimativaController } from './estimativa.controller';
import { EstimativaService } from './estimativa.service';

@Module({
  controllers: [EstimativaController],
  providers: [EstimativaService],
  imports: [TypeOrmModule.forFeature([Estimativa])],
})
export class EstimativaModule {}
