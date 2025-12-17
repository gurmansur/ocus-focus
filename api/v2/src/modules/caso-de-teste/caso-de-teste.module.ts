import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuiteDeTesteModule } from '../suite-de-teste/suite-de-teste.module';
import { CasoDeTesteController } from './caso-de-teste.controller';
import { CasoDeTesteService } from './caso-de-teste.service';
import { CasoDeTeste } from './entities/caso-de-teste.entity';

@Module({
  controllers: [CasoDeTesteController],
  providers: [CasoDeTesteService],
  imports: [
    TypeOrmModule.forFeature([CasoDeTeste]),
    forwardRef(() => SuiteDeTesteModule),
  ],
  exports: [CasoDeTesteService],
})
export class CasoDeTesteModule {}
