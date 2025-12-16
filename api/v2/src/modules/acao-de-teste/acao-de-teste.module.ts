import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CasoDeTesteModule } from '../caso-de-teste/caso-de-teste.module';
import { AcaoDeTesteController } from './acao-de-teste.controller';
import { AcaoDeTesteService } from './acao-de-teste.service';
import { AcaoDeTeste } from './entities/acao-de-teste.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AcaoDeTeste]), CasoDeTesteModule],
  controllers: [AcaoDeTesteController],
  providers: [AcaoDeTesteService],
  exports: [AcaoDeTesteService],
})
export class AcaoDeTesteModule {}
