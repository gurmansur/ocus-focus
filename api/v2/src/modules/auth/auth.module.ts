import { Module } from '@nestjs/common';
import { BillingModule } from '../billing/billing.module';
import { ColaboradorModule } from '../colaborador/colaborador.module';
import { StakeholderModule } from '../stakeholder/stakeholder.module';
import { UsuarioModule } from '../usuario/usuario.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ColaboradorAuthStrategy } from './strategies/colaborador-auth.strategy';
import { StakeholderAuthStrategy } from './strategies/stakeholder-auth.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, ColaboradorAuthStrategy, StakeholderAuthStrategy],
  imports: [ColaboradorModule, StakeholderModule, UsuarioModule, BillingModule],
})
export class AuthModule {}
