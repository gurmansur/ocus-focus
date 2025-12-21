import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IAuthenticationStrategy } from '../../../common/interfaces/authentication.interface';
import { ILogger } from '../../../common/interfaces/logger.interface';
/**
 * ColaboradorAuthStrategy - Strategy Pattern + Single Responsibility
 * Handles only Colaborador authentication logic
 * Can be extended or replaced without affecting other auth strategies
 */
@Injectable()
export class ColaboradorAuthStrategy implements IAuthenticationStrategy {
  constructor(
    private jwtService: JwtService,
    @Inject('ILogger') private logger: ILogger,
  ) {}

  async authenticate(credentials: {
    email: string;
    senha: string;
    user: any;
  }): Promise<{ accessToken: string; user: any }> {
    if (!credentials.email || !credentials.senha) {
      throw new BadRequestException('Email e senha são obrigatórios');
    }

    const isValid = await bcrypt.compare(
      credentials.senha,
      credentials.user.senha,
    );
    if (!isValid) {
      this.logger.warn(`Failed login attempt for email: ${credentials.email}`);
      throw new BadRequestException('Credenciais inválidas');
    }

    const { senha, ...payload } = credentials.user;
    const accessToken = await this.jwtService.signAsync(payload);

    this.logger.log(`Colaborador logged in: ${credentials.email}`);
    return { accessToken, user: payload };
  }

  async validate(token: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch (error) {
      this.logger.warn(`Invalid token validation attempt`);
      throw new BadRequestException('Token inválido');
    }
  }
}
