import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { ColaboradorService } from 'src/modules/colaborador/colaborador.service';
import { ColaboradorDto } from 'src/modules/colaborador/dto/colaborador.dto';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      currentColaborator?: ColaboradorDto;
    }
  }
}

@Injectable()
export class ColaboradorAtualMiddleware implements NestMiddleware {
  constructor(
    private colaboradorService: ColaboradorService,
    private jwtService: JwtService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const access_token = req.headers.authorization?.split(' ')[1];

    if (access_token) {
      try {
        const payload = await this.jwtService.verifyAsync(access_token, {
          secret: process.env.JWT_SECRET,
        });

        req.currentColaborator = await this.colaboradorService.findOne(
          payload.id,
        );
      } catch (error) {
        req.currentColaborator = undefined;
      }
    }

    next();
  }
}
