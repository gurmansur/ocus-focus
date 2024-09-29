import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, MoreThanOrEqual, Repository } from 'typeorm';
import { ColaboradorProjetoService } from '../colaborador-projeto/colaborador-projeto.service';
import { ColaboradorService } from '../colaborador/colaborador.service';
import { ColaboradorDto } from '../colaborador/dto/colaborador.dto';
import { CreateProjetoDto } from './dto/create-projeto.dto';
import { UpdateProjetoDto } from './dto/update-projeto.dto';
import { Projeto } from './entities/projeto.entity';

@Injectable()
export class ProjetoService {
  constructor(
    @InjectRepository(Projeto)
    private readonly projetoRepository: Repository<Projeto>,
    @Inject()
    private colaboradorProjetoService: ColaboradorProjetoService,
    @Inject()
    private colaboradorService: ColaboradorService,
  ) {}

  async create(createProjetoDto: CreateProjetoDto, user: number) {
    const projeto = await this.projetoRepository.save(createProjetoDto);

    const colaborador = await this.colaboradorService.findOne(user);

    return this.colaboradorProjetoService.create({
      colaborador: colaborador,
      projeto: projeto,
      administrador: true,
      ativo: true,
      usuario: colaborador.usuario,
    });
  }

  findAll() {
    return `This action returns all projeto`;
  }

  findRecentes(colaboradorId?: number, limit?: number) {
    return this.projetoRepository
      .createQueryBuilder('projeto')
      .leftJoinAndSelect('projeto.colaboradores', 'colaborador')
      .where(
        colaboradorId
          ? 'colaborador.FK_COLABORADORES_COL_ID = :colaboradorId'
          : '',
        {
          colaboradorId: colaboradorId,
        },
      )
      .orderBy('projeto.dataInicio', 'DESC')
      .limit(limit ? limit : 3)
      .getMany();
  }

  async findByNome(
    nome: string,
    colaboradorId: number,
    paginated?: boolean,
    page?: number,
    pageSize?: number,
  ) {
    if (paginated) {
      const take = pageSize ? pageSize : 10;
      const skip = page ? page * take : 0;
      const items = await this.projetoRepository.findAndCount({
        where: {
          nome: Like(`%${nome}%`),
          colaboradores: { colaborador: { id: colaboradorId } },
        },
        relations: ['colaboradores', 'colaboradores.colaborador'],
        loadEagerRelations: true,
        take: take,
        skip: skip,
      });

      return {
        items: items[0].map((item) => {
          return {
            id: item.id,
            nome: item.nome,
            descricao: item.descricao,
            empresa: item.empresa,
            dataInicio: new Date(item.dataInicio).toLocaleDateString('pt-BR'),
            previsaoFim: new Date(item.previsaoFim).toLocaleDateString('pt-BR'),
            status: item.status,
            admin: item.colaboradores.find(
              (colaborador) => colaborador.colaborador.id === colaboradorId,
            ).administrador,
          };
        }),
        page: {
          size: take,
          totalElements: items[1],
          totalPages: Math.ceil(items[1] / take),
          number: page ? page : 0,
        },
      };
    }
    const items = await this.projetoRepository.find({
      where: { nome: Like(`%${nome}%`) },
      relations: ['colaboradores', 'colaboradores.colaborador'],
      loadEagerRelations: true,
    });

    return items.map((item) => {
      return {
        id: item.id,
        nome: item.nome,
        descricao: item.descricao,
        empresa: item.empresa,
        dataInicio: new Date(item.dataInicio).toLocaleDateString('pt-BR'),
        previsaoFim: new Date(item.previsaoFim).toLocaleDateString('pt-BR'),
        status: item.status,
        admin: item.colaboradores.find(
          (colaborador) => colaborador.administrador,
        ).administrador,
      };
    });
  }

  async findById(
    id: number,
    colaboradorId: number,
    paginated?: boolean,
    page?: number,
    pageSize?: number,
  ) {
    if (paginated) {
      const take = pageSize ? pageSize : 5;
      const skip = page ? page * take : 0;
      const items = await this.projetoRepository.findAndCount({
        where: {
          id: id,
          colaboradores: { colaborador: { id: colaboradorId } },
        },
        relations: ['colaboradores', 'colaboradores.colaborador'],
        loadEagerRelations: true,
        take: take,
        skip: skip,
      });

      return {
        items: items[0].map((item) => {
          return {
            id: item.id,
            nome: item.nome,
            descricao: item.descricao,
            empresa: item.empresa,
            dataInicio: new Date(item.dataInicio).toLocaleDateString('pt-BR'),
            previsaoFim: new Date(item.previsaoFim).toLocaleDateString('pt-BR'),
            status: item.status,
            admin: item.colaboradores.find(
              (colaborador) => colaborador.colaborador.id === colaboradorId,
            ).administrador
              ? 1
              : 0,
          };
        }),
        page: {
          size: take,
          totalElements: items[1],
          totalPages: Math.ceil(items[1] / take),
          number: page ? page : 0,
        },
      };
    }
    const item = await this.projetoRepository.findOne({
      where: { id, colaboradores: { colaborador: { id: colaboradorId } } },
      relations: ['colaboradores', 'colaboradores.colaborador'],
    });

    if (!item) {
      return null;
    }

    return {
      id: item.id,
      nome: item.nome,
      descricao: item.descricao,
      empresa: item.empresa,
      dataInicio: new Date(item.dataInicio).toLocaleDateString('pt-BR'),
      previsaoFim: new Date(item.previsaoFim).toLocaleDateString('pt-BR'),
      status: item.status,
      admin: item.colaboradores.find(
        (colaborador) => colaborador.colaborador.id === colaboradorId,
      ).administrador
        ? 1
        : 0,
    };
  }

  findByStakeholderId(stakeholderId: number) {
    return this.projetoRepository
      .createQueryBuilder('projeto')
      .leftJoinAndSelect('projeto.stakeholders', 'stakeholder')
      .where('stakeholder.id = :stakeholderId', { stakeholderId })
      .getMany();
  }

  async findTotal(user: number) {
    return {
      totalCount: await this.projetoRepository.count({
        where: { colaboradores: { colaborador: { id: user } } },
        relations: ['colaboradores'],
      }),
    };
  }

  async findOngoingCount(user: number) {
    return {
      totalCount: await this.projetoRepository.count({
        where: {
          status: 'EM ANDAMENTO',
          colaboradores: { colaborador: { id: user } },
        },
        relations: ['colaboradores'],
      }),
    };
  }

  async findFinishedCount(user: number) {
    return {
      totalCount: await this.projetoRepository.count({
        where: {
          status: 'FINALIZADO',
          colaboradores: { colaborador: { id: user } },
        },
        relations: ['colaboradores'],
      }),
    };
  }

  async findNewCount(user: number) {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return {
      totalCount: await this.projetoRepository.count({
        where: {
          dataInicio: MoreThanOrEqual(date),
          colaboradores: { colaborador: { id: user } },
        },
        relations: ['colaboradores'],
      }),
    };
  }

  findOne(id: number) {
    return this.projetoRepository.findOne({ where: { id } });
  }

  update(id: number, updateProjetoDto: UpdateProjetoDto) {
    return this.projetoRepository.update(id, updateProjetoDto);
  }

  remove(id: number) {
    return `This action removes a #${id} projeto`;
  }

  async findColaboradores(id: number, page: number, pageSize: number) {
    const items =
      await this.colaboradorProjetoService.findColaboradoresByProjetoId(
        id,
        page,
        pageSize,
      );

    return {
      items: items,
      page: {
        size: pageSize,
        number: page,
        totalElements: items.length || 1,
        totalPages: Math.ceil(items.length / pageSize) || 1,
      },
    };
  }

  async findColaboradoresByNome(
    id: number,
    nome: string,
    page: number,
    pageSize: number,
  ) {
    const items = await this.colaboradorProjetoService.findColaboradoresByNome(
      id,
      nome,
      page,
      pageSize,
    );

    return {
      items: items,
      page: {
        size: pageSize,
        totalElements: items.length || 1,
        totalPages: Math.ceil(items.length / pageSize) || 1,
        number: page,
      },
    };
  }

  async addColaborador(projetoId: number, colaboradorId: number) {
    const projeto = await this.projetoRepository.findOne({
      where: { id: projetoId },
    });
    if (!projeto) {
      throw new Error('Projeto não encontrado');
    }

    const colaborador = await this.colaboradorService.findOne(colaboradorId);
    if (!colaborador) {
      throw new Error('Colaborador não encontrado');
    }

    return this.colaboradorProjetoService.create({
      colaborador: colaborador,
      usuario: colaborador.usuario,
      projeto: projeto,
      administrador: false,
      ativo: true,
    });
  }

  removeColaborador(
    projetoId: number,
    colaboradorId: number,
    user: ColaboradorDto,
  ) {
    console.log(user);
    console.log(colaboradorId);

    if (user.id === colaboradorId) {
      throw new Error('Você não pode remover a si mesmo');
    }

    return this.colaboradorProjetoService.removeByProjetoAndColaborador(
      projetoId,
      colaboradorId,
    );
  }
}
