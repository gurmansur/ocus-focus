import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { BillingService } from '../modules/billing/billing.service';
import { ProjetoService } from '../modules/projeto/projeto.service';

@Injectable()
export class SubscriptionLimitsGuard implements CanActivate {
  constructor(
    private billingService: BillingService,
    private projetoService: ProjetoService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const usuario =
      request.currentColaborator?.usuario || request.currentColaborator;

    if (!usuario) {
      throw new BadRequestException('Usuário não identificado');
    }

    // Get subscription limits
    const limites =
      await this.billingService.verificarLimitesAssinatura(usuario);

    // Store limits in request for use in controller
    request.subscriptionLimits = limites;

    // Validate projects limit
    if (limites.limiteProjetos !== null) {
      const projetoCount = await this.projetoService.countUserProjects(
        usuario.id,
      );

      if (
        context.getHandler().name === 'create' &&
        projetoCount >= limites.limiteProjetos
      ) {
        throw new BadRequestException(
          `Limite de ${limites.limiteProjetos} projeto(s) atingido. Faça upgrade de plano para criar mais projetos.`,
        );
      }
    }

    return true;
  }
}
