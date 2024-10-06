import { Body, Controller, Get, HttpCode, Post, Req } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Serialize } from 'src/decorators/serialize.decorator';
import { AuthService } from './auth.service';
import { SignInColaboradorDto } from './dto/sign-in-colaborador.dto';
import { SignInStakeholderDto } from './dto/sign-in-stakeholder.dto';
import { SignUpResponseDto } from './dto/sign-up-response.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { TokenVerificationDto } from './dto/token-verification.dto';
import { UserTokenDto } from './dto/user-token.dto';

@Controller()
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Serialize()
  @ApiResponse({
    status: 201,
    description: 'Retorna o token de autenticação',
    type: SignUpResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Email já cadastrado',
  })
  @Post('/signup')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Retorna o token de autenticação',
    type: UserTokenDto,
  })
  @Post('/signin-colaborador')
  signInColaborador(
    @Body() signInDto: SignInColaboradorDto,
  ): Promise<UserTokenDto> {
    return this.authService.signInColaborador(
      signInDto,
    ) as Promise<UserTokenDto>;
  }

  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Retorna o token de autenticação',
    type: UserTokenDto,
  })
  @Post('/signin-stakeholder')
  signInStakeholder(@Body() signInDto: SignInStakeholderDto) {
    return this.authService.signInStakeholder(signInDto);
  }

  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Retorna o token de autenticação',
    type: TokenVerificationDto,
  })
  @Get('/verify')
  verifyToken(@Req() req) {
    const token = req?.headers?.authorization?.replace('Bearer ', '');
    return this.authService.verifyToken(token);
  }
}
