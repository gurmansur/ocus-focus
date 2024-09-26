import { CreateColaboradorDto } from '../colaborador/dto/create-colaborador.dto';

export class AuthMapper {
  static signUpDtoToCreateColaboradorDto(signUpDto) {
    const colaboradorDto = new CreateColaboradorDto();

    colaboradorDto.nome = signUpDto.nome;
    colaboradorDto.email = signUpDto.email;
    colaboradorDto.empresa = signUpDto.empresa;
    colaboradorDto.cargo = signUpDto.cargo;
    colaboradorDto.senha = signUpDto.senha;

    return colaboradorDto;
  }
}
