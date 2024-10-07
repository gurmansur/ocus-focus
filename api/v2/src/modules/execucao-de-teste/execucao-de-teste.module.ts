import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExecucaoDeTeste } from './entities/execucao-de-teste.entity';
import { ExecucaoDeTesteController } from './execucao-de-teste.controller';
import { ExecucaoDeTesteService } from './execucao-de-teste.service';

@Module({
  controllers: [ExecucaoDeTesteController],
  providers: [ExecucaoDeTesteService],
  imports: [TypeOrmModule.forFeature([ExecucaoDeTeste])],
})
export class ExecucaoDeTesteModule {}
