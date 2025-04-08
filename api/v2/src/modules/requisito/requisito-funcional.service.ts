import { Injectable } from '@nestjs/common';
import { Like } from 'typeorm';
import { CreateRequisitoDto } from './dto/create-requisito.dto';
import { UpdateRequisitoDto } from './dto/update-requisito.dto';
import { RequisitoFuncionalRepository } from './repositories/requisito-funcional.repository';

@Injectable()
export class RequisitoService {
  constructor(
    private readonly requisitoRepository: RequisitoFuncionalRepository,
  ) {}

  async list(projetoId: number, page: number, pageSize: number) {
    const take = pageSize ? pageSize : 5;
    const skip = page ? page * take : 0;
    const [items, count] = await this.requisitoRepository.findAndCount({
      where: {
        projeto: { id: projetoId },
      },
      relations: ['projeto'],
      loadEagerRelations: true,
      take: take,
      skip: skip,
    });

    return {
      items: items.map((item) => {
        return {
          id: item.id,
          nome: item.nome,
          especificacao: item.especificacao,
          numeroIdentificador: item.numeroIdentificador,
        };
      }),
      page: {
        size: take,
        totalElements: count,
        totalPages: Math.ceil(count / take),
        number: page ? page : 0,
      },
    };
  }

  async listByNamePaginated(
    nome: string,
    projetoId: number,
    page: number,
    pageSize: number,
  ) {
    const take = pageSize ? pageSize : 5;
    const skip = page ? page * take : 0;
    const [items, count] = await this.requisitoRepository.findAndCount({
      where: {
        nome: Like(`%${nome}%`),
        projeto: { id: projetoId },
      },
      relations: ['projeto'],
      loadEagerRelations: true,
      take: take,
      skip: skip,
    });

    return {
      items: items.map((item) => {
        return {
          id: item.id,
          nome: item.nome,
          especificacao: item.especificacao,
          numeroIdentificador: item.numeroIdentificador,
        };
      }),
      page: {
        size: take,
        totalElements: count,
        totalPages: Math.ceil(count / take),
        number: page ? page : 0,
      },
    };
  }

  getById(id: number) {
    return this.requisitoRepository.findOne({ where: { id: id } });
  }

  delete(requsitoId: number) {
    return this.requisitoRepository.delete({ id: requsitoId });
  }

  async listResultados(projetoId: number, page: number, pageSize: number) {
    const take = pageSize ? pageSize : 5;
    const skip = page ? page * take : 0;
    const [items, count] = await this.requisitoRepository.findAndCount({
      where: {
        projeto: { id: projetoId },
      },
      relations: ['projeto', 'resultados', 'resultados.requisitoFuncional'],
      loadEagerRelations: true,
      take: take,
      skip: skip,
    });

    return {
      items: items.map((item) => {
        return {
          id: item.id,
          nome: item.nome,
          especificacao: item.especificacao,
          numeroIdentificador: item.numeroIdentificador,
          resultadoFinal: item.resultados.find(
            (resultado) => resultado?.requisitoFuncional?.id === item.id,
          )?.resultadoFinal,
        };
      }),
      page: {
        size: take,
        totalElements: count,
        totalPages: Math.ceil(count / take),
        number: page ? page : 0,
      },
    };
  }

  async listResultadosByName(
    nome: string,
    projetoId: number,
    page: number,
    pageSize: number,
  ) {
    const take = pageSize ? pageSize : 5;
    const skip = page ? page * take : 0;
    const [items, count] = await this.requisitoRepository.findAndCount({
      where: {
        nome: Like(`%${nome}%`),
        projeto: { id: projetoId },
      },
      relations: ['projeto', 'resultados', 'resultados.requisitoFuncional'],
      loadEagerRelations: true,
      take: take,
      skip: skip,
    });

    return {
      items: items.map((item) => {
        return {
          id: item.id,
          nome: item.nome,
          especificacao: item.especificacao,
          numeroIdentificador: item.numeroIdentificador,
          resultadoFinal: item.resultados.find(
            (resultado) => resultado?.requisitoFuncional?.id === item.id,
          )?.resultadoFinal,
        };
      }),
      page: {
        size: take,
        totalElements: count,
        totalPages: Math.ceil(count / take),
        number: page ? page : 0,
      },
    };
  }

  async listPriorizacaoStakeholdersWithoutPagination(projetoId: number) {
    const items = await this.requisitoRepository.find({
      where: {
        projeto: { id: projetoId },
      },
      relations: ['projeto', 'priorizacoes', 'priorizacoes.requisitoFuncional'],
      loadEagerRelations: true,
    });

    return {
      items: items.map((item) => {
        return {
          id: item.id,
          nome: item.nome,
          especificacao: item.especificacao,
          numeroIdentificador: item.numeroIdentificador,
          respostaPositiva: null,
          respostaNegativa: null,
          classificacaoRequisito: null,
        };
      }),
    };
  }

  async listPriorizacaoStakeholders(
    projetoId: number,
    stakeholderId: number,
    page: number,
    pageSize: number,
  ) {
    const take = pageSize ? pageSize : 5;
    const skip = page ? page * take : 0;
    const [items, count] = await this.requisitoRepository.findAndCount({
      where: {
        projeto: { id: projetoId },
        // ? Faz sentido filtrar por stakeholderId?
        // priorizacoes: { stakeholder: { id: stakeholderId } },
      },
      relations: ['projeto', 'priorizacoes', 'priorizacoes.requisitoFuncional'],
      loadEagerRelations: true,
      take: take,
      skip: skip,
    });

    return {
      items: items.map((item) => {
        const priorizacao = item.priorizacoes.find(
          (priorizacao) => priorizacao?.requisitoFuncional?.id === item.id,
        );

        return {
          id: item.id,
          nome: item.nome,
          especificacao: item.especificacao,
          numeroIdentificador: item.numeroIdentificador,
          respostaPositiva: priorizacao?.respostaPositiva,
          respostaNegativa: priorizacao?.respostaNegativa,
          classificacaoRequisito: priorizacao?.classificacaoRequisito,
        };
      }),
      page: {
        size: take,
        totalElements: count,
        totalPages: Math.ceil(count / take),
        number: page ? page : 0,
      },
    };
  }

  async listPriorizacaoStakeholdersByNome(
    nome: string,
    projetoId: number,
    stakeholderId: number,
    page: number,
    pageSize: number,
  ) {
    const take = pageSize ? pageSize : 5;
    const skip = page ? page * take : 0;
    const [items, count] = await this.requisitoRepository.findAndCount({
      where: {
        nome: Like(`%${nome}%`),
        projeto: { id: projetoId },
        // ? Faz sentido filtrar por stakeholderId?
        // priorizacoes: { stakeholder: { id: stakeholderId } },
      },
      relations: ['projeto', 'priorizacoes', 'priorizacoes.requisitoFuncional'],
      loadEagerRelations: true,
      take: take,
      skip: skip,
    });

    return {
      items: items.map((item) => {
        const priorizacao = item.priorizacoes.find(
          (priorizacao) => priorizacao?.requisitoFuncional?.id === item.id,
        );

        return {
          id: item.id,
          nome: item.nome,
          especificacao: item.especificacao,
          numeroIdentificador: item.numeroIdentificador,
          respostaPositiva: priorizacao?.respostaPositiva,
          respostaNegativa: priorizacao?.respostaNegativa,
          classificacaoRequisito: priorizacao?.classificacaoRequisito,
        };
      }),
      page: {
        size: take,
        totalElements: count,
        totalPages: Math.ceil(count / take),
        number: page ? page : 0,
      },
    };
  }

  create(createRequisitoDto: CreateRequisitoDto, projetoId: number) {
    return this.requisitoRepository.save({
      ...createRequisitoDto,
      projeto: { id: projetoId } as any,
    });
  }

  update(
    updateRequisitoDto: UpdateRequisitoDto,
    projetoId: number,
    requisitoId: number,
  ) {
    return this.requisitoRepository.update(requisitoId, {
      ...updateRequisitoDto,
    });
  }
}
