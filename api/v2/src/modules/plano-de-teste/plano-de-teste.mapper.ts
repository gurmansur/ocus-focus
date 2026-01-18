import { CreatePlanoDeTesteDto } from './dto/create-plano-de-teste.dto';
import { PlanoDeTesteDto } from './dto/plano-de-teste.dto';
import { UpdatePlanoDeTesteDto } from './dto/update-plano-de-teste.dto';
import { PlanoDeTeste } from './entities/plano-de-teste.entity';

export class PlanoDeTesteMapper {
  static entityToDto(entity: PlanoDeTeste): PlanoDeTesteDto {
    return {
      id: entity.id,
      nome: entity.nome,
      descricao: entity.descricao,
      status: entity.status,
      ambiente: entity.ambiente,
      dataAlvo: entity.dataAlvo,
      dataInicio: entity.dataInicio,
      responsaveis: entity.responsaveis,
      suitesIds: (entity.suites || []).map((suite) => suite.id),
      dataCriacao: entity.dataCriacao,
      dataAtualizacao: entity.dataAtualizacao,
    };
  }

  static createDtoToEntity(dto: CreatePlanoDeTesteDto): PlanoDeTeste {
    const entity = new PlanoDeTeste();
    entity.nome = dto.nome;
    entity.descricao = dto.descricao;
    entity.status = dto.status || 'RASCUNHO';
    entity.ambiente = dto.ambiente;
    entity.dataAlvo = dto.dataAlvo ? new Date(dto.dataAlvo) : undefined;
    entity.dataInicio = dto.dataInicio ? new Date(dto.dataInicio) : undefined;
    entity.responsaveis = dto.responsaveis;
    return entity;
  }

  static updateDtoToEntity(dto: UpdatePlanoDeTesteDto): Partial<PlanoDeTeste> {
    const partial: Partial<PlanoDeTeste> = {};
    if (dto.nome !== undefined) partial.nome = dto.nome;
    if (dto.descricao !== undefined) partial.descricao = dto.descricao;
    if (dto.status !== undefined) partial.status = dto.status;
    if (dto.ambiente !== undefined) partial.ambiente = dto.ambiente;
    if (dto.dataAlvo !== undefined)
      partial.dataAlvo = dto.dataAlvo ? new Date(dto.dataAlvo) : null;
    if (dto.dataInicio !== undefined)
      partial.dataInicio = dto.dataInicio ? new Date(dto.dataInicio) : null;
    if (dto.responsaveis !== undefined) partial.responsaveis = dto.responsaveis;
    return partial;
  }
}
