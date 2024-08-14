import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Priorizacao } from './entities/priorizacao.entity';
import { PriorizacaoController } from './priorizacao.controller';
import { PriorizacaoService } from './priorizacao.service';

@Module({
  controllers: [PriorizacaoController],
  providers: [PriorizacaoService],
  imports: [TypeOrmModule.forFeature([Priorizacao])],
})
export class PriorizacaoModule {}
