import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { scrypt as _scrypt, randomBytes } from 'crypto';
// import { promisify } from 'util';
import * as bcrypt from 'bcrypt';
import { ColaboradorService } from '../colaborador/colaborador.service';
import { StakeholderService } from '../stakeholder/stakeholder.service';
import { UsuarioService } from '../usuario/usuario.service';
import { AuthMapper } from './auth.mapper';
import { SignInColaboradorDto } from './dto/sign-in-colaborador.dto';
import { SignInStakeholderDto } from './dto/sign-in-stakeholder.dto';
import { SignUpResponseDto } from './dto/sign-up-response.dto';
import { SignUpDto } from './dto/sign-up.dto';
// const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject() private readonly usuarioService: UsuarioService,
    @Inject() private readonly colaboradorService: ColaboradorService,
    @Inject() private readonly stakeholderService: StakeholderService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Registra um novo usuário
   * @param signUpDto Dados do novo usuário
   * @returns Dados do usuário criado
   */
  async signUp(signUpDto: SignUpDto): Promise<SignUpResponseDto> {
    try {
      const users = await this.colaboradorService.findByEmail(signUpDto.email);
      if (users) {
        throw new BadRequestException('Email já cadastrado!');
      }

      const { senha, ...payload } = signUpDto;

      // Aumenta o fator de custo para 12 para maior segurança
      const senhaHashed = await bcrypt.hash(signUpDto.senha, 12);

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

      this.logger.log(`Usuário registrado com sucesso: ${signUpDto.email}`);
      return AuthMapper.colaboradorEntityToSignUpResponseDto(entity);
    } catch (error) {
      this.logger.error(
        `Erro ao registrar usuário: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Autentica um colaborador
   * @param signInDto Credenciais de login
   * @param userAgent User-Agent do cliente (opcional)
   * @returns Token de acesso e informações do usuário
   */
  async signInColaborador(signInDto: SignInColaboradorDto, userAgent?: string) {
    try {
      const user = await this.colaboradorService.findByEmail(signInDto.email);
      if (!user) {
        throw new BadRequestException('Usuário não encontrado!');
      }

      if (await bcrypt.compare(signInDto.senha, user.senha)) {
        const { senha, ...payload } = user;

        // Inclui informações adicionais no payload do token
        const tokenPayload = {
          ...payload,
          userAgent: userAgent || 'unknown',
          role: 'colaborador',
          iat: Math.floor(Date.now() / 1000),
        };

        const token = await this.jwtService.signAsync(tokenPayload);

        this.logger.log(
          `Login de colaborador bem-sucedido: ${signInDto.email}`,
        );
        return {
          message: 'Colaborador logado com sucesso!',
          usu_id: user.id,
          usu_name: user.nome,
          usu_email: user.email,
          usu_role: 'colaborador',
          accessToken: token,
        };
      } else {
        this.logger.warn(
          `Tentativa de login com senha incorreta: ${signInDto.email}`,
        );
        throw new BadRequestException('Senha incorreta!');
      }
    } catch (error) {
      this.logger.error(
        `Erro ao autenticar colaborador: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Autentica um stakeholder
   * @param signInDto Credenciais de login
   * @param userAgent User-Agent do cliente (opcional)
   * @returns Token de acesso e informações do usuário
   */
  async signInStakeholder(signInDto: SignInStakeholderDto, userAgent?: string) {
    try {
      const user = await this.stakeholderService.findByChave(signInDto.chave);
      if (!user) {
        throw new BadRequestException('Usuário não encontrado!');
      }

      if (await bcrypt.compare(signInDto.senha, user.senha)) {
        const { senha, ...payload } = user;

        // Inclui informações adicionais no payload do token
        const tokenPayload = {
          ...payload,
          userAgent: userAgent || 'unknown',
          role: 'stakeholder',
          iat: Math.floor(Date.now() / 1000),
        };

        const token = await this.jwtService.signAsync(tokenPayload);

        this.logger.log(
          `Login de stakeholder bem-sucedido: ${signInDto.chave}`,
        );
        return {
          message: 'Stakeholder logado com sucesso!',
          usu_id: user.id,
          usu_name: user.nome,
          usu_email: user.email,
          usu_role: 'stakeholder',
          accessToken: token,
        };
      } else {
        this.logger.warn(
          `Tentativa de login com senha incorreta para stakeholder: ${signInDto.chave}`,
        );
        throw new BadRequestException('Senha incorreta!');
      }
    } catch (error) {
      this.logger.error(
        `Erro ao autenticar stakeholder: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Verifica a validade de um token JWT
   * @param token Token a ser verificado
   * @param ipAddress Endereço IP do cliente (opcional)
   * @returns Informações sobre a validade do token
   */
  async verifyToken(token: string, ipAddress?: string) {
    try {
      if (!token) {
        return { auth: false, message: 'Token não fornecido.' };
      }

      const payload = await this.jwtService.verifyAsync(token);

      // Registra a verificação do token para fins de auditoria
      this.logger.log(
        `Token verificado com sucesso. IP: ${ipAddress || 'desconhecido'}`,
      );

      return {
        auth: true,
        message: 'Token válido.',
        userRole: payload.role,
        userId: payload.id,
      };
    } catch (error) {
      this.logger.warn(
        `Verificação de token inválido. IP: ${ipAddress || 'desconhecido'}`,
      );
      return { auth: false, message: 'Token inválido.' };
    }
  }
}
