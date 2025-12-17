import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CasoDeTesteModule } from '../caso-de-teste/caso-de-teste.module';
import { SuiteDeTeste } from './entities/suite-de-teste.entity';
import { SuiteDeTesteController } from './suite-de-teste.controller';
import { SuiteDeTesteService } from './suite-de-teste.service';

@Module({
  controllers: [SuiteDeTesteController],
  providers: [SuiteDeTesteService],
  imports: [
    forwardRef(() => CasoDeTesteModule),
    TypeOrmModule.forFeature([SuiteDeTeste]),
  ],
  exports: [SuiteDeTesteService],
})
export class SuiteDeTesteModule {}
