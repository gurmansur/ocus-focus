import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { Assinatura } from './entities/assinatura.entity';
import { HistoricoPagamento } from './entities/historico-pagamento.entity';
import { Plano } from './entities/plano.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Plano, Assinatura, HistoricoPagamento])],
  controllers: [BillingController],
  providers: [BillingService],
  exports: [BillingService],
})
export class BillingModule {}
