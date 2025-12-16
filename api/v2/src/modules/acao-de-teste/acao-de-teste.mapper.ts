import { CasoDeTeste } from '../caso-de-teste/entities/caso-de-teste.entity';
import { AcaoDeTesteBo } from './bo/acao-de-teste.bo';
import { CreateAcaoDeTesteBo } from './bo/create-acao-de-teste.bo';
import { UpdateAcaoDeTesteBo } from './bo/update-acao-de-teste.bo';
import { AcaoDeTesteDto } from './dto/acao-de-teste.dto';
import { CreateAcaoDeTesteDto } from './dto/create-acao-de-teste.dto';
import { UpdateAcaoDeTesteDto } from './dto/update-acao-de-teste.dto';
import { AcaoDeTeste } from './entities/acao-de-teste.entity';

export class AcaoDeTesteMapper {
  static entityToBo(entity: AcaoDeTeste): AcaoDeTesteBo {
    if (!entity) return null;

    const bo = new AcaoDeTesteBo();
    bo.id = entity.id;
    bo.ordem = entity.ordem;
    bo.tipo = entity.tipo;
    bo.seletor = entity.seletor;
    bo.tipoSeletor = entity.tipoSeletor;
    bo.valor = entity.valor;
    bo.timeout = entity.timeout;
    bo.descricao = entity.descricao;
    bo.obrigatorio = entity.obrigatorio;
    bo.mensagemErro = entity.mensagemErro;
    bo.casoDeTesteId = entity.casoDeTeste?.id;
    bo.dataCriacao = entity.dataCriacao;
    bo.dataAtualizacao = entity.dataAtualizacao;

    return bo;
  }

  static boToDto(bo: AcaoDeTesteBo): AcaoDeTesteDto {
    if (!bo) return null;

    const dto = new AcaoDeTesteDto();
    dto.id = bo.id;
    dto.ordem = bo.ordem;
    dto.tipo = bo.tipo;
    dto.seletor = bo.seletor;
    dto.tipoSeletor = bo.tipoSeletor;
    dto.valor = bo.valor;
    dto.timeout = bo.timeout;
    dto.descricao = bo.descricao;
    dto.obrigatorio = bo.obrigatorio;
    dto.mensagemErro = bo.mensagemErro;
    dto.casoDeTesteId = bo.casoDeTesteId;
    dto.dataCriacao = bo.dataCriacao;
    dto.dataAtualizacao = bo.dataAtualizacao;

    return dto;
  }

  static createDtoToBo(dto: CreateAcaoDeTesteDto): CreateAcaoDeTesteBo {
    if (!dto) return null;

    const bo = new CreateAcaoDeTesteBo();
    bo.ordem = dto.ordem;
    bo.tipo = dto.tipo;
    bo.seletor = dto.seletor;
    bo.tipoSeletor = dto.tipoSeletor;
    bo.valor = dto.valor;
    bo.timeout = dto.timeout ?? 5000;
    bo.descricao = dto.descricao;
    bo.obrigatorio = dto.obrigatorio ?? true;
    bo.mensagemErro = dto.mensagemErro;
    bo.casoDeTesteId = dto.casoDeTesteId;

    return bo;
  }

  static createBoToEntity(bo: CreateAcaoDeTesteBo): AcaoDeTeste {
    if (!bo) return null;

    const entity = new AcaoDeTeste();
    entity.ordem = bo.ordem;
    entity.tipo = bo.tipo as any;
    entity.seletor = bo.seletor;
    entity.tipoSeletor = bo.tipoSeletor as any;
    entity.valor = bo.valor;
    entity.timeout = bo.timeout ?? 5000;
    entity.descricao = bo.descricao;
    entity.obrigatorio = bo.obrigatorio ?? true;
    entity.mensagemErro = bo.mensagemErro;

    if (bo.casoDeTesteId) {
      entity.casoDeTeste = { id: bo.casoDeTesteId } as CasoDeTeste;
    }

    return entity;
  }

  static updateDtoToBo(dto: UpdateAcaoDeTesteDto): UpdateAcaoDeTesteBo {
    if (!dto) return null;

    const bo = new UpdateAcaoDeTesteBo();
    bo.ordem = dto.ordem;
    bo.tipo = dto.tipo;
    bo.seletor = dto.seletor;
    bo.tipoSeletor = dto.tipoSeletor;
    bo.valor = dto.valor;
    bo.timeout = dto.timeout;
    bo.descricao = dto.descricao;
    bo.obrigatorio = dto.obrigatorio;
    bo.mensagemErro = dto.mensagemErro;

    return bo;
  }

  static updateBoToEntity(bo: UpdateAcaoDeTesteBo): Partial<AcaoDeTeste> {
    if (!bo) return null;

    const entity: Partial<AcaoDeTeste> = {};

    if (bo.ordem !== undefined) entity.ordem = bo.ordem;
    if (bo.tipo !== undefined) entity.tipo = bo.tipo as any;
    if (bo.seletor !== undefined) entity.seletor = bo.seletor;
    if (bo.tipoSeletor !== undefined)
      entity.tipoSeletor = bo.tipoSeletor as any;
    if (bo.valor !== undefined) entity.valor = bo.valor;
    if (bo.timeout !== undefined) entity.timeout = bo.timeout;
    if (bo.descricao !== undefined) entity.descricao = bo.descricao;
    if (bo.obrigatorio !== undefined) entity.obrigatorio = bo.obrigatorio;
    if (bo.mensagemErro !== undefined) entity.mensagemErro = bo.mensagemErro;

    return entity;
  }
}
