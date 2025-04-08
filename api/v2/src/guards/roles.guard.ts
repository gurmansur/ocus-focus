import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Verificar se a rota é marcada como pública
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (isPublic) {
      return true;
    }

    // Obter as funções requeridas da rota
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    // Se não houver funções definidas, permite o acesso
    if (!requiredRoles) {
      return true;
    }
    
    // Verificar se o usuário tem a função necessária
    const { user } = context.switchToHttp().getRequest();
    
    // Se não houver usuário autenticado, nega o acesso
    if (!user) {
      return false;
    }
    
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
} 