import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { CreateProjetoDto } from 'src/modules/projeto/dto/create-projeto.dto';
import { ProjetoService } from 'src/modules/projeto/projeto.service';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      currentProject?: CreateProjetoDto;
    }
    interface Headers {
      projeto?: string;
    }
  }
}

declare global {
  namespace Express {}
}

@Injectable()
export class ProjetoAtualMiddleware implements NestMiddleware {
  constructor(@Inject() private projetoService: ProjetoService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const projetoId = req.headers.projeto;

    if (projetoId !== undefined) {
      req.currentProject = await this.projetoService.findOne(+projetoId);
    }

    next();
  }
}
