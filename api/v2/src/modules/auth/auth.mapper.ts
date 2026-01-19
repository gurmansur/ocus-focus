import { CreateUsuarioDto } from '../usuario/dto/create-usuario.dto';
import { Usuario } from '../usuario/entities/usuario.entity';
import { SignUpResponseDto } from './dto/sign-up-response.dto';

export class AuthMapper {
  static signUpDtoToCreateUsuarioDto(signUpDto) {
    const usuarioDto = new CreateUsuarioDto();

    usuarioDto.nome = signUpDto.nome;
    usuarioDto.email = signUpDto.email;
    usuarioDto.empresa = signUpDto.empresa || 'N/A';
    usuarioDto.cargo = signUpDto.cargo || 'Desenvolvedor';
    usuarioDto.senha = signUpDto.senha;

    return usuarioDto;
  }

  static usuarioEntityToSignUpResponseDto(usuario: Usuario): SignUpResponseDto {
    const dto = new SignUpResponseDto();

    dto.nome = usuario.nome;
    dto.email = usuario.email;
    dto.empresa = usuario.empresa;
    dto.cargo = usuario.cargo;
    dto.id = usuario.id;
    dto.senha = usuario.senha;

    return dto;
  }
}
