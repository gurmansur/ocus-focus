import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FatorAmbiental } from './entities/fatores-ambientais.entity';
import { FatoresAmbientaisService } from './fatores-ambientais.service';

@Module({
  providers: [FatoresAmbientaisService],
  imports: [TypeOrmModule.forFeature([FatorAmbiental])],
})
export class FatoresAmbientaisModule {}
