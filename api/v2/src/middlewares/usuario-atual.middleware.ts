import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { UsuarioDto } from '../modules/usuario/dto/usuario.dto';
import { UsuarioService } from '../modules/usuario/usuario.service';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      currentUser?: UsuarioDto;
    }
  }
}

@Injectable()
export class UsuarioAtualMiddleware implements NestMiddleware {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const access_token = req.headers.authorization?.split(' ')[1];

    if (access_token) {
      try {
        const payload = await this.jwtService.verifyAsync(access_token, {
          secret: process.env.JWT_SECRET,
        });

        const usuario = await this.usuarioService.findOne(payload.id);

        if (usuario) {
          const usuarioDto: UsuarioDto = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            empresa: usuario.empresa,
            cargo: usuario.cargo,
            dataCadastro: usuario.dataCadastro,
          };

          req.currentUser = usuarioDto;
          // For backward compatibility during transition
          req.currentColaborator = usuarioDto as any;
          req.currentStakeholder = usuarioDto as any;
        }
      } catch (error) {
        req.currentUser = undefined;
        req.currentColaborator = undefined;
        req.currentStakeholder = undefined;
      }
    }

    next();
  }
}
