import { Module } from '@nestjs/common';
import { BillingModule } from '../billing/billing.module';
import { UsuarioModule } from '../usuario/usuario.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [UsuarioModule, BillingModule],
})
export class AuthModule {}
