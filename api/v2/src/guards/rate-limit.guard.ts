import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly requestMap = new Map<
    string,
    { count: number; timestamp: number }
  >();
  private readonly windowMs = 60 * 1000; // 1 minuto
  private readonly maxRequests = 100; // 100 requisições por minuto

  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const ipAddress = request.ip;
    const currentTime = Date.now();

    // Limpe entradas expiradas
    this.cleanupExpiredEntries();

    // Verifique se o cliente atingiu o limite
    if (!this.requestMap.has(ipAddress)) {
      this.requestMap.set(ipAddress, { count: 1, timestamp: currentTime });
    } else {
      const record = this.requestMap.get(ipAddress);

      if (record.timestamp + this.windowMs < currentTime) {
        // Se a janela de tempo expirou, reinicie o contador
        this.requestMap.set(ipAddress, { count: 1, timestamp: currentTime });
      } else {
        // Incremente o contador
        record.count += 1;

        // Verifique se excedeu o limite
        if (record.count > this.maxRequests) {
          throw new HttpException(
            'Muitas requisições, tente novamente mais tarde',
            HttpStatus.TOO_MANY_REQUESTS,
          );
        }
      }
    }

    return true;
  }

  private cleanupExpiredEntries() {
    const currentTime = Date.now();
    for (const [key, value] of this.requestMap.entries()) {
      if (value.timestamp + this.windowMs < currentTime) {
        this.requestMap.delete(key);
      }
    }
  }
}
