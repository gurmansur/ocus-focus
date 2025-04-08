import { Injectable } from '@nestjs/common';
import { CasoDeTesteMapper } from '../caso-de-teste/caso-de-teste.mapper';
import { CreateSuiteDeTesteBo } from './bo/create-suite-de-teste.bo';
import { FileTreeBo } from './bo/file-tree.bo';
import { SuiteDeTesteBo } from './bo/suite-de-teste.bo';
import { UpdateSuiteDeTesteBo } from './bo/update-suite-de-teste.bo';
import { CreateSuiteDeTesteDto } from './dto/create-suite-de-teste.dto';
import { FileTreeDto } from './dto/file-tree.dto';
import { SuiteDeTesteDto } from './dto/suite-de-teste.dto';
import { UpdateSuiteDeTesteDto } from './dto/update-suite-de-teste.dto';
import { SuiteDeTeste } from './entities/suite-de-teste.entity';

@Injectable()
export class SuiteDeTesteMapper {
  static createSuiteDeTesteDtoToBo(
    dto: CreateSuiteDeTesteDto,
  ): Partial<SuiteDeTeste> {
    const entity = new SuiteDeTeste();
    entity.nome = dto.nome;
    entity.status = dto.status || 'ATIVO';
    entity.descricao = dto.descricao;
    entity.observacoes = dto.observacoes;

    return entity;
  }

  static createSuiteDeTesteBoToEntity(bo: CreateSuiteDeTesteBo): SuiteDeTeste {
    const entity = new SuiteDeTeste();
    entity.nome = bo.nome;
    entity.status = bo.status;
    entity.descricao = bo.descricao;
    entity.observacoes = bo.observacoes;
    entity.suitePai = bo.suitePaiId
      ? ({ id: bo.suitePaiId } as SuiteDeTeste)
      : null;
    return entity;
  }

  static updateSuiteDeTesteDtoToBo(
    dto: UpdateSuiteDeTesteDto,
  ): Partial<SuiteDeTeste> {
    const entity = {} as Partial<SuiteDeTeste>;

    if (dto.nome !== undefined) {
      entity.nome = dto.nome;
    }

    if (dto.status !== undefined) {
      entity.status = dto.status;
    }

    if (dto.descricao !== undefined) {
      entity.descricao = dto.descricao;
    }

    if (dto.observacoes !== undefined) {
      entity.observacoes = dto.observacoes;
    }

    return entity;
  }

  static updateSuiteDeTesteBoToEntity(bo: UpdateSuiteDeTesteBo): SuiteDeTeste {
    const entity = new SuiteDeTeste();
    entity.nome = bo.nome;
    entity.status = bo.status;
    entity.descricao = bo.descricao;
    entity.observacoes = bo.observacoes;
    entity.suitePai = bo.suitePaiId
      ? ({ id: bo.suitePaiId } as SuiteDeTeste)
      : null;
    return entity;
  }

  static entityToBo(entity: SuiteDeTeste): SuiteDeTesteBo {
    const bo = new SuiteDeTesteBo();
    bo.id = entity.id;
    bo.nome = entity.nome;
    bo.status = entity.status;
    bo.descricao = entity.descricao;
    bo.observacoes = entity.observacoes;
    bo.dataCriacao = entity.dataCriacao;
    bo.dataAtualizacao = entity.dataAtualizacao;
    bo.dataExclusao = entity.dataExclusao;
    bo.projeto = entity.projeto;
    bo.suitePai = entity.suitePai ? this.entityToBo(entity.suitePai) : null;
    bo.suitesFilhas = entity.suitesFilhas?.map((suite) =>
      this.entityToBo(suite),
    );
    bo.suites = bo.suitesFilhas; // Set alias
    bo.casosDeTeste = entity.casosDeTeste?.map((caso) =>
      CasoDeTesteMapper.entityToCasoDeTesteBo(caso),
    );
    return bo;
  }

  static boToDto(bo: SuiteDeTeste): SuiteDeTesteDto {
    const dto = new SuiteDeTesteDto({
      id: bo.id,
      nome: bo.nome,
      status: bo.status,
      descricao: bo.descricao,
      observacoes: bo.observacoes,
      suitePaiId: bo.suitePai ? bo.suitePai.id : null,
      projetoId: bo.projeto ? bo.projeto.id : null,
    });

    if (bo.suitePai) {
      dto.suitePai = new SuiteDeTesteDto({
        id: bo.suitePai.id,
        nome: bo.suitePai.nome,
        descricao: bo.suitePai.descricao,
      });
    }

    if (bo.suitesFilhas && bo.suitesFilhas.length > 0) {
      dto.suitesFilhas = bo.suitesFilhas.map((suite) => {
        return new SuiteDeTesteDto({
          id: suite.id,
          nome: suite.nome,
          descricao: suite.descricao,
          status: suite.status,
          observacoes: suite.observacoes,
          suitePaiId: suite.suitePai ? suite.suitePai.id : null,
          projetoId: suite.projeto ? suite.projeto.id : null,
        });
      });
    }

    if (bo.casosDeTeste && bo.casosDeTeste.length > 0) {
      dto.casosDeTeste = bo.casosDeTeste.map((caso) =>
        CasoDeTesteMapper.entityToDto(caso),
      );
    }

    return dto;
  }

  static entityToDto(entity: SuiteDeTeste): SuiteDeTesteDto {
    return this.boToDto(entity);
  }

  static fileTreeBoToDto(bo: FileTreeBo): FileTreeDto {
    const dto = new FileTreeDto();

    // Map suites safely
    dto.suites = bo.suites.map((suite) => {
      const suiteDto = new SuiteDeTesteDto({
        id: suite.id,
        nome: suite.nome,
        descricao: suite.descricao,
        status: suite.status,
        observacoes: suite.observacoes,
        suitePaiId: suite.suitePai ? suite.suitePai.id : null,
        projetoId: suite.projeto ? suite.projeto.id : null,
      });

      // Handle children safely
      if (suite.suitesFilhas && suite.suitesFilhas.length > 0) {
        suiteDto.suitesFilhas = suite.suitesFilhas.map(
          (childSuite) =>
            new SuiteDeTesteDto({
              id: childSuite.id,
              nome: childSuite.nome,
              descricao: childSuite.descricao,
              status: childSuite.status,
              observacoes: childSuite.observacoes,
            }),
        );
      }

      return suiteDto;
    });

    // Map casos safely if they exist
    if (bo.casos && bo.casos.length > 0) {
      dto.casos = bo.casos.map((caso) =>
        CasoDeTesteMapper.casoDeTesteBoToDto(caso),
      );
    } else {
      dto.casos = [];
    }

    return dto;
  }
}
