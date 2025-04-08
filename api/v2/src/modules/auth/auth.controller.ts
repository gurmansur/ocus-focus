import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { ApiDocs } from '../../decorators/api-docs.decorator';
import { Serialize } from '../../decorators/serialize.decorator';
import { TimeoutInterceptor } from '../../interceptors/timeout.interceptor';
import { SanitizePipe } from '../../pipes/sanitize.pipe';
import { AuthService } from './auth.service';
import { SignInColaboradorDto } from './dto/sign-in-colaborador.dto';
import { SignInStakeholderDto } from './dto/sign-in-stakeholder.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { UserTokenDto } from './dto/user-token.dto';

@Controller()
@ApiTags('Auth')
@UseInterceptors(TimeoutInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Serialize()
  @Post('/signup')
  @ApiDocs({
    summary: 'Cadastro de novo usuário',
    description: 'Cria um novo usuário com os dados fornecidos',
    responseDescription: 'Usuário cadastrado com sucesso',
    status: HttpStatus.CREATED,
    requiresAuth: false,
  })
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body(SanitizePipe) signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/signin-colaborador')
  @ApiDocs({
    summary: 'Login de colaborador',
    description: 'Autentica um colaborador com email e senha',
    responseDescription: 'Colaborador autenticado com sucesso',
    status: HttpStatus.OK,
    requiresAuth: false,
  })
  signInColaborador(
    @Body(SanitizePipe) signInDto: SignInColaboradorDto,
    @Headers('user-agent') userAgent?: string,
  ): Promise<UserTokenDto> {
    return this.authService.signInColaborador(
      signInDto,
      userAgent,
    ) as Promise<UserTokenDto>;
  }

  @HttpCode(HttpStatus.OK)
  @Post('/signin-stakeholder')
  @ApiDocs({
    summary: 'Login de stakeholder',
    description: 'Autentica um stakeholder com email e senha',
    responseDescription: 'Stakeholder autenticado com sucesso',
    status: HttpStatus.OK,
    requiresAuth: false,
  })
  signInStakeholder(
    @Body(SanitizePipe) signInDto: SignInStakeholderDto,
    @Headers('user-agent') userAgent?: string,
  ) {
    return this.authService.signInStakeholder(signInDto, userAgent);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/verify')
  @ApiDocs({
    summary: 'Verificar token',
    description: 'Verifica se o token JWT fornecido é válido',
    responseDescription: 'Informações do token válido',
    status: HttpStatus.OK,
  })
  verifyToken(@Req() req: Request) {
    const token = req?.headers?.authorization?.replace('Bearer ', '');

    const ipAddress =
      req.ip ||
      req.connection?.remoteAddress ||
      (req.headers['x-forwarded-for'] as string);

    return this.authService.verifyToken(token, ipAddress);
  }
}
