import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StakeholderModule } from '../stakeholder/stakeholder.module';
import { StatusPriorizacao } from './entities/status-priorizacao.entity';
import { StatusPriorizacaoController } from './status-priorizacao.controller';
import { StatusPriorizacaoService } from './status-priorizacao.service';

@Module({
  controllers: [StatusPriorizacaoController],
  providers: [StatusPriorizacaoService],
  imports: [
    TypeOrmModule.forFeature([StatusPriorizacao]),
    forwardRef(() => StakeholderModule),
  ],
  exports: [StatusPriorizacaoService],
})
export class StatusPriorizacaoModule {}
