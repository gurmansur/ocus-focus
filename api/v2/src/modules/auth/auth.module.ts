import { Module } from '@nestjs/common';
import { ColaboradorModule } from '../colaborador/colaborador.module';
import { StakeholderModule } from '../stakeholder/stakeholder.module';
import { UsuarioModule } from '../usuario/usuario.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [ColaboradorModule, StakeholderModule, UsuarioModule],
})
export class AuthModule {}
