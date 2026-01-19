import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillingModule } from '../billing/billing.module';
import { RequisitoModule } from '../requisito/requisito-funcional.module';
import { ResultadoRequisitoModule } from '../resultado-requisito/resultado-requisito.module';
import { StatusPriorizacaoModule } from '../status-priorizacao/status-priorizacao.module';
import { UsuarioModule } from '../usuario/usuario.module';
import { Priorizacao } from './entities/priorizacao.entity';
import { PriorizacaoController } from './priorizacao.controller';
import { PriorizacaoService } from './priorizacao.service';

@Module({
  controllers: [PriorizacaoController],
  providers: [PriorizacaoService],
  imports: [
    TypeOrmModule.forFeature([Priorizacao]),
    ResultadoRequisitoModule,
    UsuarioModule,
    StatusPriorizacaoModule,
    RequisitoModule,
    BillingModule,
  ],
})
export class PriorizacaoModule {}
