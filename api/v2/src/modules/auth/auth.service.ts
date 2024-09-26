import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { scrypt as _scrypt, randomBytes } from 'crypto';
// import { promisify } from 'util';
import * as bcrypt from 'bcrypt';
import { ColaboradorService } from '../colaborador/colaborador.service';
import { StakeholderService } from '../stakeholder/stakeholder.service';
import { AuthMapper } from './auth.mapper';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
// const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    @Inject() private readonly colaboradorService: ColaboradorService,
    @Inject() private readonly stakeholderService: StakeholderService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const users = await this.colaboradorService.findByEmail(signUpDto.email);
    if (users) {
      throw new BadRequestException('Email já cadastrado!');
    }

    signUpDto.senha = await bcrypt.hash(signUpDto.senha, 10);

    return this.colaboradorService.create(
      AuthMapper.signUpDtoToCreateColaboradorDto(signUpDto),
    );
  }

  async signInColaborador(signInDto: SignInDto) {
    const user = await this.colaboradorService.findByEmail(signInDto.email);
    if (!user) {
      throw new BadRequestException('Usuário não encontrado!');
    }

    if (await bcrypt.compare(signInDto.senha, user.senha)) {
      const { senha, ...payload } = user;

      const token = await this.jwtService.signAsync(payload);

      return {
        message: 'Colaborador logado com sucesso!',
        usu_id: user.id,
        usu_name: user.nome,
        usu_email: user.email,
        usu_role: 'colaborador',
        accessToken: token,
      };
    } else {
      throw new BadRequestException('Senha incorreta!');
    }
  }

  async signInStakeholder(signInDto: SignInDto) {
    const user = await this.stakeholderService.findByEmail(signInDto.email);
    if (!user) {
      throw new BadRequestException('Usuário não encontrado!');
    }

    if (await bcrypt.compare(signInDto.senha, user.senha)) {
      const { senha, ...payload } = user;

      const token = await this.jwtService.signAsync(payload);

      return {
        message: 'Stakeholder logado com sucesso!',
        usu_id: user.id,
        usu_name: user.nome,
        usu_email: user.email,
        usu_role: 'stakeholder',
        accessToken: token,
      };
    } else {
      throw new BadRequestException('Senha incorreta!');
    }
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
