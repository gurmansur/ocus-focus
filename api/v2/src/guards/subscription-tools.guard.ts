import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BillingService } from '../modules/billing/billing.service';

@Injectable()
export class SubscriptionToolsGuard implements CanActivate {
  constructor(
    private billingService: BillingService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const usuario =
      request.currentColaborator?.usuario || request.currentColaborator;

    if (!usuario) {
      throw new BadRequestException('Usuário não identificado');
    }

    // Get required tool from metadata
    const requiredTool = this.reflector.get<string>(
      'requiredTool',
      context.getHandler(),
    );

    if (!requiredTool) {
      return true; // No tool requirement
    }

    // Get subscription limits
    const limites =
      await this.billingService.verificarLimitesAssinatura(usuario);

    if (!limites.ferramentasDisponiveis.includes(requiredTool)) {
      throw new BadRequestException(
        `Ferramenta '${requiredTool}' não disponível no seu plano. Faça upgrade para acessá-la.`,
      );
    }

    return true;
  }
}
