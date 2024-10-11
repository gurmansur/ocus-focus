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

export class SuiteDeTesteMapper {
  static createSuiteDeTesteDtoToBo(
    dto: CreateSuiteDeTesteDto,
  ): CreateSuiteDeTesteBo {
    const bo = new CreateSuiteDeTesteBo();
    bo.nome = dto.nome;
    bo.status = dto.status;
    bo.descricao = dto.descricao;
    bo.observacoes = dto.observacoes;
    bo.suitePaiId = dto.suitePaiId ? +dto.suitePaiId : null;
    return bo;
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
  ): UpdateSuiteDeTesteBo {
    const bo = new UpdateSuiteDeTesteBo();
    bo.nome = dto.nome;
    bo.status = dto.status;
    bo.descricao = dto.descricao;
    bo.observacoes = dto.observacoes;
    bo.suitePaiId = dto.suitePaiId ? +dto.suitePaiId : null;
    return bo;
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
    bo.suitePai = entity.suitePai ? this.entityToBo(entity.suitePai) : null;
    bo.suitesFilhas = entity.suitesFilhas?.map((suite) =>
      this.entityToBo(suite),
    );
    bo.casosDeTeste = entity.casosDeTeste?.map((caso) =>
      CasoDeTesteMapper.entityToCasoDeTesteBo(caso),
    );
    return bo;
  }

  static boToDto(bo: SuiteDeTesteBo): SuiteDeTesteDto {
    const dto = new SuiteDeTesteDto();
    dto.id = bo.id;
    dto.nome = bo.nome;
    dto.status = bo.status;
    dto.descricao = bo.descricao;
    dto.observacoes = bo.observacoes;
    dto.suitePai = bo.suitePai ? this.boToDto(bo.suitePai) : null;
    dto.suitesFilhas = bo.suitesFilhas?.map((suite) => this.boToDto(suite));
    dto.casosDeTeste = bo.casosDeTeste?.map((caso) =>
      CasoDeTesteMapper.casoDeTesteBoToDto(caso),
    );
    return dto;
  }

  static fileTreeBoToDto(bo: FileTreeBo): FileTreeDto {
    const dto = new FileTreeDto();
    dto.suites = bo.suites.map((suite) => this.boToDto(suite));
    dto.casos = bo.casos.map((caso) =>
      CasoDeTesteMapper.casoDeTesteBoToDto(caso),
    );
    return dto;
  }
}
