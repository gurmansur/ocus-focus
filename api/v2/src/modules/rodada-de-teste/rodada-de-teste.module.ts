import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RodadaDeTeste } from './entities/rodada-de-teste.entity';
import { RodadaDeTesteController } from './rodada-de-teste.controller';
import { RodadaDeTesteService } from './rodada-de-teste.service';

@Module({
  imports: [TypeOrmModule.forFeature([RodadaDeTeste])],
  controllers: [RodadaDeTesteController],
  providers: [RodadaDeTesteService],
  exports: [RodadaDeTesteService],
})
export class RodadaDeTesteModule {}
