import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuiteDeTeste } from './entities/suite-de-teste.entity';
import { SuiteDeTesteController } from './suite-de-teste.controller';
import { SuiteDeTesteService } from './suite-de-teste.service';

@Module({
  controllers: [SuiteDeTesteController],
  providers: [SuiteDeTesteService],
  imports: [TypeOrmModule.forFeature([SuiteDeTeste])],
})
export class SuiteDeTesteModule {}
