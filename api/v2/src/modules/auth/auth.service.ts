import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ILogger } from '../../common/interfaces/logger.interface';
import { BillingService } from '../billing/billing.service';
import { ColaboradorService } from '../colaborador/colaborador.service';
import { StakeholderService } from '../stakeholder/stakeholder.service';
import { UsuarioService } from '../usuario/usuario.service';
import { AuthMapper } from './auth.mapper';
import { SignInColaboradorDto } from './dto/sign-in-colaborador.dto';
import { SignInStakeholderDto } from './dto/sign-in-stakeholder.dto';
import { SignUpResponseDto } from './dto/sign-up-response.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { ColaboradorAuthStrategy } from './strategies/colaborador-auth.strategy';
import { StakeholderAuthStrategy } from './strategies/stakeholder-auth.strategy';

@Injectable()
export class AuthService {
  constructor(
    @Inject() private readonly usuarioService: UsuarioService,
    @Inject() private readonly colaboradorService: ColaboradorService,
    @Inject() private readonly stakeholderService: StakeholderService,
    @Inject() private readonly billingService: BillingService,
    private readonly jwtService: JwtService,
    @Inject('ILogger') private logger: ILogger,
    private readonly colaboradorAuthStrategy: ColaboradorAuthStrategy,
    private readonly stakeholderAuthStrategy: StakeholderAuthStrategy,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<SignUpResponseDto> {
    this.logger.log(`SignUp attempt for email: ${signUpDto.email}`);
    const users = await this.colaboradorService.findByEmail(signUpDto.email);
    if (users) {
      this.logger.warn(
        `SignUp failed - email already exists: ${signUpDto.email}`,
      );
      throw new BadRequestException('Email já cadastrado!');
    }

    const { senha, ...payload } = signUpDto;

    const senhaHashed = await bcrypt.hash(signUpDto.senha, 10);

    const newUser = await this.usuarioService.create({
      ...payload,
      senha: senhaHashed,
    });

    const entity = await this.colaboradorService.create(
      AuthMapper.signUpDtoToCreateColaboradorDto({
        ...payload,
        senha: senhaHashed,
      }),
      newUser,
    );

    // Create free subscription for new user
    try {
      await this.billingService.createFreeSubscriptionForNewUser(newUser);
      this.logger.log(`Free subscription created for user: ${signUpDto.email}`);
    } catch (error) {
      this.logger.warn(
        `Failed to create free subscription for ${signUpDto.email}: ${error.message}`,
      );
      // Don't fail signup if billing fails, just log it
    }

    this.logger.log(`SignUp successful for email: ${signUpDto.email}`);
    return AuthMapper.colaboradorEntityToSignUpResponseDto(entity);
  }

  async signInColaborador(signInDto: SignInColaboradorDto) {
    const user = await this.colaboradorService.findByEmail(signInDto.email);
    if (!user) {
      throw new BadRequestException('Usuário não encontrado!');
    }

    const { accessToken, user: authenticatedUser } =
      await this.colaboradorAuthStrategy.authenticate({
        email: signInDto.email,
        senha: signInDto.senha,
        user,
      });

    this.logger.log(`Colaborador signed in: ${signInDto.email}`);
    return {
      message: 'Colaborador logado com sucesso!',
      usu_id: user.id,
      usu_name: user.nome,
      usu_email: user.email,
      usu_role: 'colaborador',
      accessToken,
    };
  }

  async signInStakeholder(signInDto: SignInStakeholderDto) {
    const user = await this.stakeholderService.findByChave(signInDto.chave);
    if (!user) {
      throw new BadRequestException('Usuário não encontrado!');
    }

    const { accessToken, user: authenticatedUser } =
      await this.stakeholderAuthStrategy.authenticate({
        chave: signInDto.chave,
        user,
      });

    this.logger.log(`Stakeholder signed in: ${signInDto.chave}`);
    return {
      message: 'Stakeholder logado com sucesso!',
      usu_id: user.id,
      usu_name: user.nome,
      usu_email: user.email,
      usu_role: 'stakeholder',
      accessToken,
    };
  }

  async verifyToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      return { auth: true, message: 'Token válido.' };
    } catch (error) {
      return { auth: false, message: 'Token inválido.' };
    }
  }
}
