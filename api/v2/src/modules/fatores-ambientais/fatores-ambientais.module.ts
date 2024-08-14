import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FatorAmbiental } from './entities/fatores-ambientais.entity';
import { FatoresAmbientaisController } from './fatores-ambientais.controller';
import { FatoresAmbientaisService } from './fatores-ambientais.service';

@Module({
  controllers: [FatoresAmbientaisController],
  providers: [FatoresAmbientaisService],
  imports: [TypeOrmModule.forFeature([FatorAmbiental])],
})
export class FatoresAmbientaisModule {}
