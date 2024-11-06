import { CasoUso } from '../caso-uso/entities/caso-uso.entity';
import { ColaboradorMapper } from '../colaborador/colaborador.mapper';
import { Colaborador } from '../colaborador/entities/colaborador.entity';
import { SuiteDeTeste } from '../suite-de-teste/entities/suite-de-teste.entity';
import { SuiteDeTesteMapper } from '../suite-de-teste/suite-de-teste.mapper';
import { CasoDeTesteBo } from './bo/caso-de-teste.bo';
import { CreateCasoDeTesteBo } from './bo/create-caso-de-teste.bo';
import { UpdateCasoDeTesteBo } from './bo/update-caso-de-teste.bo';
import { CasoDeTesteDto } from './dto/caso-de-teste.dto';
import { CreateCasoDeTesteDto } from './dto/create-caso-de-teste.dto';
import { UpdateCasoDeTesteDto } from './dto/update-caso-de-teste.dto';
import { CasoDeTeste } from './entities/caso-de-teste.entity';

export class CasoDeTesteMapper {
  static createCasoDeTesteDtoToBo(
    dto: CreateCasoDeTesteDto,
  ): CreateCasoDeTesteBo {
    const bo = new CreateCasoDeTesteBo();

    bo.nome = dto.nome;
    bo.descricao = dto.descricao;
    bo.observacoes = dto.observacoes;
    bo.prioridade = dto.prioridade;
    bo.preCondicao = dto.preCondicao;
    bo.posCondicao = dto.posCondicao;
    bo.complexidade = dto.complexidade;
    bo.status = dto.status;
    bo.resultadoEsperado = dto.resultadoEsperado;
    bo.metodo = dto.metodo;
    bo.tecnica = dto.tecnica;
    bo.dadosEntrada = dto.dadosEntrada;
    bo.casoDeUsoId = dto.casoDeUsoId;
    bo.suiteDeTesteId = dto.suiteDeTesteId;
    bo.testadorDesignadoId = dto.testadorDesignadoId;

    return bo;
  }

  static createCasoDeTesteBoToEntity(bo: CreateCasoDeTesteBo): CasoDeTeste {
    const entity = new CasoDeTeste();

    entity.nome = bo.nome;
    entity.descricao = bo.descricao;
    entity.observacoes = bo.observacoes;
    entity.prioridade = bo.prioridade;
    entity.preCondicao = bo.preCondicao;
    entity.posCondicao = bo.posCondicao;
    entity.complexidade = bo.complexidade;
    entity.status = bo.status;
    entity.resultadoEsperado = bo.resultadoEsperado;
    entity.metodo = bo.metodo;
    entity.tecnica = bo.tecnica;
    entity.dadosEntrada = bo.dadosEntrada;
    entity.casoDeUso = { id: bo.casoDeUsoId } as CasoUso;
    entity.suiteDeTeste = { id: bo.suiteDeTesteId } as SuiteDeTeste;
    entity.testadorDesignado = { id: bo.testadorDesignadoId } as Colaborador;

    return entity;
  }

  static updateCasoDeTesteDtoToBo(
    dto: UpdateCasoDeTesteDto,
  ): UpdateCasoDeTesteBo {
    const bo = new UpdateCasoDeTesteBo();

    bo.nome = dto.nome;
    bo.descricao = dto.descricao;
    bo.observacoes = dto.observacoes;
    bo.prioridade = dto.prioridade;
    bo.preCondicao = dto.preCondicao;
    bo.posCondicao = dto.posCondicao;
    bo.complexidade = dto.complexidade;
    bo.status = dto.status;
    bo.resultadoEsperado = dto.resultadoEsperado;
    bo.metodo = dto.metodo;
    bo.tecnica = dto.tecnica;
    bo.dadosEntrada = dto.dadosEntrada;
    bo.casoDeUsoId = dto.casoDeUsoId;
    bo.suiteDeTesteId = dto.suiteDeTesteId;
    bo.testadorDesignadoId = dto.testadorDesignadoId;

    return bo;
  }

  static updateCasoDeTesteBoToEntity(bo: UpdateCasoDeTesteBo): CasoDeTeste {
    const entity = new CasoDeTeste();

    entity.nome = bo.nome;
    entity.descricao = bo.descricao;
    entity.observacoes = bo.observacoes;
    entity.prioridade = bo.prioridade;
    entity.preCondicao = bo.preCondicao;
    entity.posCondicao = bo.posCondicao;
    entity.complexidade = bo.complexidade;
    entity.status = bo.status;
    entity.resultadoEsperado = bo.resultadoEsperado;
    entity.metodo = bo.metodo;
    entity.tecnica = bo.tecnica;
    entity.dadosEntrada = bo.dadosEntrada;
    entity.casoDeUso = { id: bo.casoDeUsoId } as CasoUso;
    entity.suiteDeTeste = { id: bo.suiteDeTesteId } as SuiteDeTeste;
    entity.testadorDesignado = { id: bo.testadorDesignadoId } as Colaborador;

    return entity;
  }

  static entityToCasoDeTesteBo(entity: CasoDeTeste): CasoDeTesteBo {
    const bo = new CasoDeTesteBo();

    bo.id = entity.id;
    bo.nome = entity.nome;
    bo.descricao = entity.descricao;
    bo.observacoes = entity.observacoes;
    bo.prioridade = entity.prioridade;
    bo.preCondicao = entity.preCondicao;
    bo.posCondicao = entity.posCondicao;
    bo.complexidade = entity.complexidade;
    bo.status = entity.status;
    bo.resultadoEsperado = entity.resultadoEsperado;
    bo.metodo = entity.metodo;
    bo.tecnica = entity.tecnica;
    bo.dadosEntrada = entity.dadosEntrada;
    bo.casoDeUso = entity.casoDeUso;
    bo.suiteDeTeste = entity.suiteDeTeste
      ? SuiteDeTesteMapper.entityToBo(entity.suiteDeTeste)
      : null;
    bo.testadorDesignado = entity.testadorDesignado
      ? ColaboradorMapper.fromEntityToBo(entity.testadorDesignado)
      : null;
    bo.projeto = entity.projeto;

    return bo;
  }

  static casoDeTesteBoToDto(bo: CasoDeTesteBo): CasoDeTesteDto {
    const dto = new CasoDeTesteDto();

    dto.id = bo.id;
    dto.nome = bo.nome;
    dto.descricao = bo.descricao;
    dto.observacoes = bo.observacoes;
    dto.prioridade = bo.prioridade;
    dto.preCondicao = bo.preCondicao;
    dto.posCondicao = bo.posCondicao;
    dto.complexidade = bo.complexidade;
    dto.status = bo.status;
    dto.resultadoEsperado = bo.resultadoEsperado;
    dto.metodo = bo.metodo;
    dto.tecnica = bo.tecnica;
    dto.dadosEntrada = bo.dadosEntrada;
    dto.casoDeUso = bo.casoDeUso;
    dto.suiteDeTeste = bo.suiteDeTeste;
    dto.testadorDesignado = bo.testadorDesignado
      ? ColaboradorMapper.fromBoToDto(bo.testadorDesignado)
      : null;
    dto.projeto = bo.projeto;

    return dto;
  }
}
