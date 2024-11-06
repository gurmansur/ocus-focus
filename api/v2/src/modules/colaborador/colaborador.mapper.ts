import { ColaboradorBo } from './bo/colaborador.bo';
import { ColaboradorDto } from './dto/colaborador.dto';
import { Colaborador } from './entities/colaborador.entity';

export class ColaboradorMapper {
  static fromEntityToBo(entity: Colaborador): ColaboradorBo {
    const bo = new ColaboradorBo();
    bo.id = entity.id;
    bo.nome = entity.nome;
    bo.email = entity.email;
    bo.senha = entity.senha;
    bo.empresa = entity.empresa;
    bo.cargo = entity.cargo;
    return bo;
  }

  static fromBoToDto(bo: ColaboradorBo): ColaboradorDto {
    const dto = new ColaboradorDto();
    dto.id = bo.id;
    dto.nome = bo.nome;
    dto.email = bo.email;
    dto.empresa = bo.empresa;
    dto.cargo = bo.cargo;
    return dto;
  }
}
