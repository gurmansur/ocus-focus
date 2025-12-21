import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IAuthenticationStrategy } from '../../../common/interfaces/authentication.interface';
import { ILogger } from '../../../common/interfaces/logger.interface';

/**
 * StakeholderAuthStrategy - Strategy Pattern + Single Responsibility
 * Handles only Stakeholder authentication logic
 * Isolated from Colaborador authentication
 */
@Injectable()
export class StakeholderAuthStrategy implements IAuthenticationStrategy {
  constructor(
    private jwtService: JwtService,
    @Inject('ILogger') private logger: ILogger,
  ) {}

  async authenticate(credentials: {
    chave: string;
    user: any;
  }): Promise<{ accessToken: string; user: any }> {
    if (!credentials.chave) {
      throw new BadRequestException('Chave de acesso é obrigatória');
    }

    if (credentials.chave !== credentials.user.chave) {
      this.logger.warn(`Failed stakeholder login attempt`);
      throw new BadRequestException('Chave de acesso inválida');
    }

    const payload = { id: credentials.user.id, chave: credentials.user.chave };
    const accessToken = await this.jwtService.signAsync(payload);

    this.logger.log(`Stakeholder logged in: ${credentials.chave}`);
    return { accessToken, user: payload };
  }

  async validate(token: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch (error) {
      this.logger.warn(`Invalid stakeholder token validation attempt`);
      throw new BadRequestException('Token inválido');
    }
  }
}
