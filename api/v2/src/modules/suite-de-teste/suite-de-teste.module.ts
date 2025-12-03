import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CasoDeTesteModule } from '../caso-de-teste/caso-de-teste.module';
import { ProjetoModule } from '../projeto/projeto.module';
import { SuiteDeTeste } from './entities/suite-de-teste.entity';
import { SuiteDeTesteController } from './suite-de-teste.controller';
import { SuiteDeTesteMapper } from './suite-de-teste.mapper';
import { SuiteDeTesteService } from './suite-de-teste.service';

@Module({
  controllers: [SuiteDeTesteController],
  providers: [SuiteDeTesteService, SuiteDeTesteMapper],
  imports: [
    forwardRef(() => CasoDeTesteModule),
    ProjetoModule,
    TypeOrmModule.forFeature([SuiteDeTeste]),
  ],
  exports: [SuiteDeTesteService, SuiteDeTesteMapper],
})
export class SuiteDeTesteModule {}
