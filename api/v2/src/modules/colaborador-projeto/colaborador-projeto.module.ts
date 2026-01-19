/**
 * @deprecated This module is deprecated. Please use the 'usuario' module instead.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillingModule } from '../billing/billing.module';
import { ColaboradorModule } from '../colaborador/colaborador.module';
import { ColaboradorProjetoController } from './colaborador-projeto.controller';
import { ColaboradorProjetoService } from './colaborador-projeto.service';
import { ColaboradorProjeto } from './entities/colaborador-projeto.entity';

@Module({
  controllers: [ColaboradorProjetoController],
  providers: [ColaboradorProjetoService],
  exports: [ColaboradorProjetoService],
  imports: [
    TypeOrmModule.forFeature([ColaboradorProjeto]),
    ColaboradorModule,
    BillingModule,
  ],
})
export class ColaboradorProjetoModule {}
