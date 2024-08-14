import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FatorTecnico } from './entities/fatores-tecnicos.entity';
import { FatoresTecnicosController } from './fatores-tecnicos.controller';
import { FatoresTecnicosService } from './fatores-tecnicos.service';

@Module({
  controllers: [FatoresTecnicosController],
  providers: [FatoresTecnicosService],
  imports: [TypeOrmModule.forFeature([FatorTecnico])],
})
export class FatoresTecnicosModule {}
