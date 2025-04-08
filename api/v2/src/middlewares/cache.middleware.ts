import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class CacheMiddleware implements NestMiddleware {
  private readonly cache = new Map<string, { data: any; expiry: number }>();
  private readonly defaultTTL = 5 * 60 * 1000; // 5 minutos em ms

  use(req: Request, res: Response, next: NextFunction) {
    // Só aplica cache em requisições GET
    if (req.method !== 'GET') {
      return next();
    }

    const cacheKey = this.getCacheKey(req);
    const cachedItem = this.cache.get(cacheKey);

    // Verifica se tem item em cache válido
    if (cachedItem && cachedItem.expiry > Date.now()) {
      const originalSend = res.send;

      res.send = function (body) {
        return originalSend.call(this, cachedItem.data);
      };

      return next();
    }

    // Se não tiver em cache, intercepta a resposta para armazenar
    const originalSend = res.send;

    res.send = (body) => {
      const response = originalSend.call(res, body);

      // Não armazena em cache respostas de erro
      if (res.statusCode >= 200 && res.statusCode < 400) {
        this.cache.set(cacheKey, {
          data: body,
          expiry: Date.now() + this.defaultTTL,
        });
      }

      return response;
    };

    next();
  }

  private getCacheKey(req: Request): string {
    return `${req.method}:${req.originalUrl}`;
  }
}
