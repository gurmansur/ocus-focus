import { CasoDeTesteMapper } from '../caso-de-teste/caso-de-teste.mapper';
import { CasoDeTeste } from '../caso-de-teste/entities/caso-de-teste.entity';
import { ChangeStatusExecucaoDeTesteBo } from './bo/change-status-execucao-de-teste.bo';
import { CreateExecucaoDeTesteBo } from './bo/create-execucao-de-teste.bo';
import { ExecucaoDeTesteBo } from './bo/execucao-de-teste.bo';
import { ChangeStatusExecucaoDeTesteDto } from './dto/change-status-execucao-de-teste.dto';
import { CreateExecucaoDeTesteDto } from './dto/create-execucao-de-teste.dto';
import { ExecucaoDeTesteDto } from './dto/execucao-de-teste.dto';
import { UpdateExecucaoDeTesteDto } from './dto/update-execucao-de-teste.dto';
import { ExecucaoDeTeste } from './entities/execucao-de-teste.entity';

export class ExecucaoDeTesteMapper {
  static createDtoToBo(
    createDto: CreateExecucaoDeTesteDto,
  ): CreateExecucaoDeTesteBo {
    const bo = new CreateExecucaoDeTesteBo();
    bo.nome = createDto.nome;
    bo.casoDeTesteId = createDto.casoDeTesteId;
    bo.dataExecucao = createDto.dataExecucao;
    return bo;
  }

  static createBoToEntity(bo: CreateExecucaoDeTesteBo): ExecucaoDeTeste {
    const entity = new ExecucaoDeTeste();
    entity.nome = bo.nome;
    entity.casoDeTeste = { id: bo.casoDeTesteId } as CasoDeTeste;
    entity.dataExecucao = bo.dataExecucao;
    return entity;
  }

  static updateDtoToBo(
    dto: UpdateExecucaoDeTesteDto,
  ): UpdateExecucaoDeTesteDto {
    const bo = new UpdateExecucaoDeTesteDto();
    bo.nome = dto.nome;
    bo.casoDeTesteId = dto.casoDeTesteId;
    bo.dataExecucao = dto.dataExecucao;
    return bo;
  }

  static updateBoToEntity(bo: UpdateExecucaoDeTesteDto): ExecucaoDeTeste {
    const entity = new ExecucaoDeTeste();
    entity.nome = bo.nome;
    entity.casoDeTeste = { id: bo.casoDeTesteId } as CasoDeTeste;
    entity.dataExecucao = bo.dataExecucao;
    return entity;
  }

  static changeStatusDtoToBo(
    dto: ChangeStatusExecucaoDeTesteDto,
  ): ChangeStatusExecucaoDeTesteBo {
    const bo = new ChangeStatusExecucaoDeTesteBo();
    bo.resultado = dto.resultado;
    bo.observacao = dto.observacao;
    return bo;
  }

  static changeStatusBoToEntity(
    bo: ChangeStatusExecucaoDeTesteBo,
  ): ExecucaoDeTeste {
    const entity = new ExecucaoDeTeste();
    entity.resultado = bo.resultado;
    entity.observacao = bo.observacao;
    return entity;
  }

  static entityToBo(entity: ExecucaoDeTeste): ExecucaoDeTesteBo {
    const bo = new ExecucaoDeTesteBo();
    bo.id = entity.id;
    bo.nome = entity.nome;
    bo.casoDeTeste = entity.casoDeTeste
      ? CasoDeTesteMapper.entityToCasoDeTesteBo(entity.casoDeTeste)
      : null;
    bo.dataExecucao = entity.dataExecucao;
    bo.metodo = entity.metodo;
    bo.observacao = entity.observacao;
    bo.resposta = entity.resposta;
    bo.resultado = entity.resultado;

    return bo;
  }

  static boToDto(bo: ExecucaoDeTesteBo): ExecucaoDeTesteDto {
    const dto = new ExecucaoDeTesteDto();
    dto.id = bo.id;
    dto.nome = bo.nome;
    dto.casoDeTeste = bo.casoDeTeste
      ? CasoDeTesteMapper.casoDeTesteBoToDto(bo.casoDeTeste)
      : null;
    dto.dataExecucao = bo.dataExecucao;
    dto.metodo = bo.metodo;
    dto.observacao = bo.observacao;
    dto.resposta = bo.resposta;
    dto.resultado = bo.resultado;
    return dto;
  }
}
