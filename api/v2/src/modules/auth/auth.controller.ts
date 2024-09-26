import { Body, Controller, Get, HttpCode, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { UserTokenDto } from './dto/user-token.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @HttpCode(200)
  @Post('/signin-colaborador')
  signInColaborador(@Body() signInDto: SignInDto): Promise<UserTokenDto> {
    return this.authService.signInColaborador(signInDto);
  }

  // @Post('/signin-stakeholder')
  // signInStakeholder(@Body() signInDto: SignInDto) {
  //   return this.authService.signInStakeholder();
  // }

  @Get('/verify')
  verifyToken(@Req() req) {
    const token = req.headers.authorization.replace('Bearer ', '');
    return this.authService.verifyToken(token);
  }
}
