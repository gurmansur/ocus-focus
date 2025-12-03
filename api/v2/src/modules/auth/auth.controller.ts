import { Body, Controller, Get, HttpCode, Post, Req } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ProtectedRoute } from '../../decorators/protected-route.decorator';
import { Public } from '../../decorators/public.decorator';
import { Serialize } from '../../decorators/serialize.decorator';
import { AuthService } from './auth.service';
import { SignInColaboradorDto } from './dto/sign-in-colaborador.dto';
import { SignInStakeholderDto } from './dto/sign-in-stakeholder.dto';
import { SignUpResponseDto } from './dto/sign-up-response.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { TokenVerificationDto } from './dto/token-verification.dto';
import { UserTokenDto } from './dto/user-token.dto';

/**
 * Controlador de autenticação
 * Gerencia login, registro e verificação de token
 */
@Controller()
@ApiTags('Auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Registra um novo usuário no sistema
   * @param signUpDto Dados de registro
   * @returns Token de autenticação e dados do usuário
   */
  @Public()
  @Serialize()
  @Post('/signup')
  @ApiOperation({
    summary: 'Registrar novo usuário',
    description: 'Cria um novo usuário no sistema com os dados fornecidos',
  })
  @ApiCreatedResponse({
    description: 'Usuário registrado com sucesso',
    type: SignUpResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Email já cadastrado ou dados inválidos fornecidos',
  })
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  /**
   * Autentica um colaborador
   * @param signInDto Credenciais do colaborador
   * @returns Token de autenticação
   */
  @Public()
  @HttpCode(200)
  @Post('/signin-colaborador')
  @ApiOperation({
    summary: 'Login de colaborador',
    description: 'Autentica um colaborador no sistema usando email e senha',
  })
  @ApiOkResponse({
    description: 'Colaborador autenticado com sucesso',
    type: UserTokenDto,
  })
  @ApiBadRequestResponse({
    description: 'Credenciais inválidas ou usuário não encontrado',
  })
  signInColaborador(
    @Body() signInDto: SignInColaboradorDto,
  ): Promise<UserTokenDto> {
    return this.authService.signInColaborador(
      signInDto,
    ) as Promise<UserTokenDto>;
  }

  /**
   * Autentica um stakeholder
   * @param signInDto Credenciais do stakeholder
   * @returns Token de autenticação
   */
  @Public()
  @HttpCode(200)
  @Post('/signin-stakeholder')
  @ApiOperation({
    summary: 'Login de stakeholder',
    description: 'Autentica um stakeholder no sistema usando chave e senha',
  })
  @ApiOkResponse({
    description: 'Stakeholder autenticado com sucesso',
    type: UserTokenDto,
  })
  @ApiBadRequestResponse({
    description: 'Credenciais inválidas ou usuário não encontrado',
  })
  signInStakeholder(@Body() signInDto: SignInStakeholderDto) {
    return this.authService.signInStakeholder(signInDto);
  }

  /**
   * Verifica se um token é válido
   * @param req Requisição com o token no cabeçalho
   * @returns Informações sobre o token
   */
  @Public()
  @HttpCode(200)
  @Get('/verify')
  @ApiOperation({
    summary: 'Verificar token',
    description: 'Verifica se um token JWT é válido e não expirou',
  })
  @ApiOkResponse({
    description: 'Resultado da verificação do token',
    type: TokenVerificationDto,
  })
  verifyToken(@Req() req) {
    const token = req?.headers?.authorization?.replace('Bearer ', '');
    return this.authService.verifyToken(token);
  }

  /**
   * Rota protegida para teste de autenticação
   * @returns Mensagem de confirmação
   */
  @ProtectedRoute('admin')
  @Get('/admin-only')
  @ApiOperation({
    summary: 'Rota de administrador',
    description:
      'Rota protegida para verificar se o usuário tem perfil de administrador',
  })
  @ApiOkResponse({
    description: 'Acesso concedido para administrador',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Você tem acesso de administrador!',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Usuário não autenticado',
  })
  @ApiForbiddenResponse({
    description: 'Usuário não tem permissão de administrador',
  })
  adminOnly() {
    return { message: 'Você tem acesso de administrador!' };
  }
}
