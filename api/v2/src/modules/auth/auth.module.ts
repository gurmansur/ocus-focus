import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ColaboradorModule } from '../colaborador/colaborador.module';
import { StakeholderModule } from '../stakeholder/stakeholder.module';
import { UsuarioModule } from '../usuario/usuario.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  imports: [
    PassportModule,
    ColaboradorModule,
    StakeholderModule,
    UsuarioModule,
  ],
  exports: [AuthService],
})
export class AuthModule {}
