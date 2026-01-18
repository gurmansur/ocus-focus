import { CreateRodadaDeTesteDto } from './dto/create-rodada-de-teste.dto';
import { RodadaDeTesteDto } from './dto/rodada-de-teste.dto';
import { UpdateRodadaDeTesteDto } from './dto/update-rodada-de-teste.dto';
import { UpdateRodadaResultadosDto } from './dto/update-rodada-resultados.dto';
import { RodadaDeTeste } from './entities/rodada-de-teste.entity';

export class RodadaDeTesteMapper {
  static entityToDto(entity: RodadaDeTeste): RodadaDeTesteDto {
    return {
      id: entity.id,
      nome: entity.nome,
      status: entity.status,
      casosIds: entity.casosIds,
      resultados:
        entity.resultados as unknown as RodadaDeTesteDto['resultados'],
      ambiente: entity.ambiente,
      responsavel: entity.responsavel,
      dataInicio: entity.dataInicio,
      dataFim: entity.dataFim,
      dataCriacao: entity.dataCriacao,
      dataAtualizacao: entity.dataAtualizacao,
    };
  }

  static createDtoToEntity(dto: CreateRodadaDeTesteDto): RodadaDeTeste {
    const entity = new RodadaDeTeste();
    entity.nome = dto.nome;
    entity.status = dto.status || 'NAO_INICIADO';
    entity.casosIds = dto.casosIds;
    entity.resultados = dto.resultados;
    entity.ambiente = dto.ambiente;
    entity.responsavel = dto.responsavel;
    entity.dataInicio = dto.dataInicio ? new Date(dto.dataInicio) : undefined;
    entity.dataFim = dto.dataFim ? new Date(dto.dataFim) : undefined;
    return entity;
  }

  static updateDtoToEntity(
    dto: UpdateRodadaDeTesteDto,
  ): Partial<RodadaDeTeste> {
    const partial: Partial<RodadaDeTeste> = {};
    if (dto.nome !== undefined) partial.nome = dto.nome;
    if (dto.status !== undefined) partial.status = dto.status;
    if (dto.casosIds !== undefined) partial.casosIds = dto.casosIds;
    if (dto.ambiente !== undefined) partial.ambiente = dto.ambiente;
    if (dto.responsavel !== undefined) partial.responsavel = dto.responsavel;
    if (dto.dataInicio !== undefined)
      partial.dataInicio = dto.dataInicio ? new Date(dto.dataInicio) : null;
    if (dto.dataFim !== undefined)
      partial.dataFim = dto.dataFim ? new Date(dto.dataFim) : null;
    if (dto.resultados !== undefined)
      partial.resultados =
        dto.resultados as unknown as RodadaDeTeste['resultados'];
    return partial;
  }

  static mergeResultados(
    entity: RodadaDeTeste,
    dto: UpdateRodadaResultadosDto,
  ): RodadaDeTeste {
    entity.resultados = dto.resultados;
    if (dto.status) {
      entity.status = dto.status;
    }
    if (dto.dataFim !== undefined) {
      entity.dataFim = dto.dataFim ? new Date(dto.dataFim) : null;
    }
    return entity;
  }
}
