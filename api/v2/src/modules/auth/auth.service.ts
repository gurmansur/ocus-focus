import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ILogger } from '../../common/interfaces/logger.interface';
import { BillingService } from '../billing/billing.service';
import { UsuarioService } from '../usuario/usuario.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpResponseDto } from './dto/sign-up-response.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject() private readonly usuarioService: UsuarioService,
    @Inject() private readonly billingService: BillingService,
    private readonly jwtService: JwtService,
    @Inject('ILogger') private logger: ILogger,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<SignUpResponseDto> {
    this.logger.log(`SignUp attempt for email: ${signUpDto.email}`);
    const existingUser = await this.usuarioService.findByEmail(signUpDto.email);
    if (existingUser) {
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

    // Generate JWT token
    const accessToken = this.jwtService.sign({
      usu_email: newUser.email,
      usu_name: newUser.nome,
      usu_id: newUser.id,
      usu_role: newUser.tipo,
    });

    this.logger.log(`SignUp successful for email: ${signUpDto.email}`);
    return {
      id: newUser.id,
      nome: newUser.nome,
      email: newUser.email,
      empresa: newUser.empresa,
      cargo: newUser.cargo,
      dataCadastro: newUser.dataCadastro,
      senha: newUser.senha,
      usuario: {
        id: newUser.id,
        nome: newUser.nome,
        email: newUser.email,
        empresa: newUser.empresa,
        cargo: newUser.cargo,
        dataCadastro: newUser.dataCadastro,
      },
      accessToken,
      usu_email: newUser.email,
      usu_name: newUser.nome,
      usu_id: newUser.id,
      usu_role: newUser.tipo as 'stakeholder' | 'colaborador',
    };
  }

  async signIn(signInDto: SignInDto) {
    let user;
    let identifier: string;

    // Check if signing in with email or chave (legacy stakeholder login)
    if (signInDto.email) {
      user = await this.usuarioService.findByEmail(signInDto.email);
      identifier = signInDto.email;
    } else {
      throw new BadRequestException('Email ou chave é obrigatório!');
    }

    if (!user) {
      throw new BadRequestException('Usuário não encontrado!');
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(signInDto.senha, user.senha);
    if (!passwordMatch) {
      throw new BadRequestException('Senha incorreta!');
    }

    // Generate JWT token
    const payload = { id: user.id, email: user.email, nome: user.nome };
    const accessToken = await this.jwtService.signAsync(payload);

    this.logger.log(`User signed in: ${identifier}`);
    return {
      message: 'Login realizado com sucesso!',
      usu_id: user.id,
      usu_name: user.nome,
      usu_email: user.email,
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
