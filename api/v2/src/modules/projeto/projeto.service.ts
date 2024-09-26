import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, MoreThanOrEqual, Repository } from 'typeorm';
import { CreateProjetoDto } from './dto/create-projeto.dto';
import { UpdateProjetoDto } from './dto/update-projeto.dto';
import { Projeto } from './entities/projeto.entity';

@Injectable()
export class ProjetoService {
  constructor(
    @InjectRepository(Projeto)
    private readonly projetoRepository: Repository<Projeto>,
  ) {}
  create(createProjetoDto: CreateProjetoDto) {
    return 'This action adds a new projeto';
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
      const skip = page ? (page - 1) * take : 0;
      const items = await this.projetoRepository.findAndCount({
        where: { nome: Like(`%${nome}%`) },
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
              (colaborador) => colaborador.administrador,
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
        admin: item.colaboradores.flatMap(
          (colaborador) => colaborador.administrador,
        ),
      };
    });
  }

  async findTotal() {
    return { totalCount: await this.projetoRepository.count() };
  }

  async findOngoingCount() {
    return {
      totalCount: await this.projetoRepository.count({
        where: { status: 'EM ANDAMENTO' },
      }),
    };
  }

  async findFinishedCount() {
    return {
      totalCount: await this.projetoRepository.count({
        where: { status: 'CONCLUIDO' },
      }),
    };
  }

  async findNewCount() {
    // count amount of projects that started in the last 30 days
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return {
      totalCount: await this.projetoRepository.count({
        where: { dataInicio: MoreThanOrEqual(date) },
      }),
    };
  }

  findOne(id: number) {
    return this.projetoRepository.findOne({ where: { id } });
  }

  update(id: number, updateProjetoDto: UpdateProjetoDto) {
    return `This action updates a #${id} projeto`;
  }

  remove(id: number) {
    return `This action removes a #${id} projeto`;
  }
}
