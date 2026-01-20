import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, MoreThanOrEqual, Repository } from 'typeorm';
import { ILogger } from '../../common/interfaces/logger.interface';
import { KanbanService } from '../kanban/kanban.service';
import { UsuarioProjetoService } from '../usuario-projeto/usuario-projeto.service';
import { UserRole } from '../usuario/enums/user-role.enum';
import { UsuarioService } from '../usuario/usuario.service';
import { CreateProjetoDto } from './dto/create-projeto.dto';
import { UpdateProjetoDto } from './dto/update-projeto.dto';
import { Projeto } from './entities/projeto.entity';

@Injectable()
export class ProjetoService {
  constructor(
    @InjectRepository(Projeto)
    private readonly projetoRepository: Repository<Projeto>,
    @Inject()
    private usuarioProjetoService: UsuarioProjetoService,
    @Inject()
    private usuarioService: UsuarioService,
    @Inject()
    private kanbanService: KanbanService,
    @Inject('ILogger') private logger: ILogger,
  ) {}

  async create(createProjetoDto: CreateProjetoDto, user: number) {
    this.logger.log('Creating new projeto');

    // Provide default values for optional fields
    const projetoData = {
      ...createProjetoDto,
      empresa: createProjetoDto.empresa || 'N/A',
      dataInicio: createProjetoDto.dataInicio || new Date(),
      previsaoFim:
        createProjetoDto.previsaoFim ||
        new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
      status: createProjetoDto.status || 'EM ANDAMENTO',
    };

    const projeto = await this.projetoRepository.save(projetoData);

    const usuario = await this.usuarioService.findOne(user);

    this.kanbanService.createKanban(projeto);

    return this.usuarioProjetoService.create({
      usuarioId: usuario.id,
      projetoId: projeto.id,
      role: UserRole.COLABORADOR,
      administrador: true,
    });
  }

  findAll(usuarioId?: number) {
    return this.projetoRepository
      .createQueryBuilder('projeto')
      .leftJoinAndSelect('projeto.usuariosProjetos', 'usuarioProjeto')
      .leftJoinAndSelect('usuarioProjeto.usuario', 'usuario')
      .where(usuarioId ? 'usuario.id = :usuarioId' : '', {
        usuarioId: usuarioId,
      })
      .orderBy('projeto.nome', 'DESC')
      .getMany();
  }

  findRecentes(usuarioId?: number, limit?: number) {
    return this.projetoRepository
      .createQueryBuilder('projeto')
      .leftJoinAndSelect('projeto.usuariosProjetos', 'usuarioProjeto')
      .leftJoinAndSelect('usuarioProjeto.usuario', 'usuario')
      .where(usuarioId ? 'usuario.id = :usuarioId' : '', {
        usuarioId: usuarioId,
      })
      .orderBy('projeto.dataInicio', 'DESC')
      .limit(limit ? limit : 3)
      .getMany();
  }

  async findByNome(
    nome: string,
    usuarioId: number,
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
          usuariosProjetos: { usuario: { id: usuarioId } },
        },
        order: { status: 'ASC' },
        relations: ['usuariosProjetos', 'usuariosProjetos.usuario'],
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
            admin: item.usuariosProjetos.find(
              (up) => up.usuario.id === usuarioId,
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
      relations: ['usuariosProjetos', 'usuariosProjetos.usuario'],
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
        admin: item.usuariosProjetos.find((up) => up.administrador)
          .administrador,
      };
    });
  }

  async findById(
    id: number,
    usuarioId: number,
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
          usuariosProjetos: { usuario: { id: usuarioId } },
        },
        relations: ['usuariosProjetos', 'usuariosProjetos.usuario'],
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
            admin: item.usuariosProjetos.find(
              (up) => up.usuario.id === usuarioId,
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
      where: { id, usuariosProjetos: { usuario: { id: usuarioId } } },
      relations: ['usuariosProjetos', 'usuariosProjetos.usuario'],
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
      admin: item.usuariosProjetos.find((up) => up.usuario.id === usuarioId)
        .administrador
        ? 1
        : 0,
    };
  }

  async findTotal(user: number) {
    return {
      totalCount: await this.projetoRepository.count({
        where: { usuariosProjetos: { usuario: { id: user } } },
        relations: ['usuariosProjetos'],
      }),
    };
  }

  async findOngoingCount(user: number) {
    return {
      totalCount: await this.projetoRepository.count({
        where: {
          status: 'EM ANDAMENTO',
          usuariosProjetos: { usuario: { id: user } },
        },
        relations: ['usuariosProjetos'],
      }),
    };
  }

  async findFinishedCount(user: number) {
    return {
      totalCount: await this.projetoRepository.count({
        where: {
          status: 'FINALIZADO',
          usuariosProjetos: { usuario: { id: user } },
        },
        relations: ['usuariosProjetos'],
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
          usuariosProjetos: { usuario: { id: user } },
        },
        relations: ['usuariosProjetos'],
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
    return this.projetoRepository.softDelete(id);
  }

  async findUsuarios(id: number, page?: number, pageSize?: number) {
    const items = await this.usuarioProjetoService.findUsuariosByProjetoId(
      id,
      page ? page : undefined,
      pageSize ? pageSize : undefined,
    );

    // Return just the users array for the colaboradores endpoint
    // Map UsuarioProjeto to just the usuario data with their role
    return items.map((up) => ({
      id: up.usuario.id,
      nome: up.usuario.nome,
      email: up.usuario.email,
      papel: up.role,
    }));
  }

  async findUsuariosByNome(
    id: number,
    nome: string,
    page: number,
    pageSize: number,
  ) {
    const items = await this.usuarioProjetoService.findUsuariosByNome(
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

  async addUsuario(projetoId: number, usuarioId: number) {
    const projeto = await this.projetoRepository.findOne({
      where: { id: projetoId },
    });
    if (!projeto) {
      throw new Error('Projeto não encontrado');
    }

    const usuario = await this.usuarioService.findOne(usuarioId);
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    return this.usuarioProjetoService.create({
      usuarioId: usuario.id,
      projetoId: projeto.id,
      role: UserRole.COLABORADOR,
      administrador: false,
    });
  }

  removeUsuario(projetoId: number, usuarioId: number, currentUserId: number) {
    if (currentUserId === usuarioId) {
      throw new Error('Você não pode remover a si mesmo');
    }

    return this.usuarioProjetoService.removeByProjetoAndUsuario(
      projetoId,
      usuarioId,
    );
  }

  async countUserProjects(usuarioId: number): Promise<number> {
    return this.projetoRepository.count({
      where: {
        usuariosProjetos: { usuario: { id: usuarioId } },
      },
      relations: ['usuariosProjetos'],
    });
  }
}
