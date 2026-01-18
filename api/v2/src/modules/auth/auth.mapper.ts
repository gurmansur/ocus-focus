import { CreateColaboradorDto } from '../colaborador/dto/create-colaborador.dto';
import { Colaborador } from '../colaborador/entities/colaborador.entity';
import { SignUpResponseDto } from './dto/sign-up-response.dto';

export class AuthMapper {
  static signUpDtoToCreateColaboradorDto(signUpDto) {
    const colaboradorDto = new CreateColaboradorDto();

    colaboradorDto.nome = signUpDto.nome;
    colaboradorDto.email = signUpDto.email;
    colaboradorDto.empresa = signUpDto.empresa || 'N/A';
    colaboradorDto.cargo = signUpDto.cargo || 'Desenvolvedor';
    colaboradorDto.senha = signUpDto.senha;

    return colaboradorDto;
  }

  static colaboradorEntityToSignUpResponseDto(
    colaborador: Colaborador,
  ): SignUpResponseDto {
    const dto = new SignUpResponseDto();

    dto.nome = colaborador.nome;
    dto.email = colaborador.email;
    dto.empresa = colaborador.empresa;
    dto.cargo = colaborador.cargo;
    dto.usuario = colaborador.usuario;
    dto.id = colaborador.id;
    dto.senha = colaborador.senha;

    return dto;
  }
}
