import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ColaboradorService } from '../../colaborador/colaborador.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly colaboradorService: ColaboradorService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('auth.jwt.secret'),
    });
  }

  async validate(payload: any) {
    // The payload should have user information from the token
    // We should have a user ID and role in the payload from the JWT token
    if (!payload.id) {
      throw new UnauthorizedException('Invalid token payload');
    }

    // Depending on the role, get the appropriate user
    if (payload.role === 'colaborador') {
      const colaborador = await this.colaboradorService.findOne(payload.id);

      if (!colaborador) {
        throw new UnauthorizedException('User no longer exists');
      }

      return {
        id: colaborador.id,
        email: colaborador.email,
        role: payload.role,
        nome: colaborador.nome,
        usuarioId: colaborador.usuario?.id,
      };
    } else {
      // For stakeholders or other roles
      // This can be expanded later as needed
      return {
        id: payload.id,
        role: payload.role,
      };
    }
  }
}
