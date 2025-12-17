import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FatorTecnico } from './entities/fatores-tecnicos.entity';
import { FatoresTecnicosService } from './fatores-tecnicos.service';

@Module({
  providers: [FatoresTecnicosService],
  imports: [TypeOrmModule.forFeature([FatorTecnico])],
})
export class FatoresTecnicosModule {}
