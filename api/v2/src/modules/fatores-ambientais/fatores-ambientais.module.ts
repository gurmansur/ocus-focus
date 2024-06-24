import { Module } from '@nestjs/common';
import { FatoresAmbientaisService } from './fatores-ambientais.service';
import { FatoresAmbientaisController } from './fatores-ambientais.controller';

@Module({
  controllers: [FatoresAmbientaisController],
  providers: [FatoresAmbientaisService],
})
export class FatoresAmbientaisModule {}
