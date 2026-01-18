import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ILogger } from '../../common/interfaces/logger.interface';
import { CasoUso } from '../caso-uso/entities/caso-uso.entity';
import { ColaboradorProjeto } from '../colaborador-projeto/entities/colaborador-projeto.entity';
import { Colaborador } from '../colaborador/entities/colaborador.entity';
import { Kanban } from '../kanban/entities/kanban.entity';
import { Swimlane } from '../kanban/entities/swimlane.entity';
import { NotificacaoService } from '../notificacao/notificacao.service';
import { Projeto } from '../projeto/entities/projeto.entity';
import { Sprint } from '../sprint/entities/sprint.entity';
import { Stakeholder } from '../stakeholder/entities/stakeholder.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { CreateUserStoryDto } from './dto/create-user-story.dto';
import { UpdateUserStoryDto } from './dto/update-user-story.dto';
import { Comentario } from './entities/comentario.entity';
import { UserStory } from './entities/user-story.entity';

@Injectable()
export class UserStoryService {
  constructor(
    @InjectRepository(UserStory)
    private readonly userStoryRepository: Repository<UserStory>,
    @InjectRepository(CasoUso)
    private readonly casoUsoRepository: Repository<CasoUso>,
    @InjectRepository(Colaborador)
    private readonly colaboradorRepository: Repository<Colaborador>,
    @InjectRepository(Projeto)
    private readonly projetoRepository: Repository<Projeto>,
    @InjectRepository(Kanban)
    private readonly kanbanRepository: Repository<Kanban>,
    @InjectRepository(Swimlane)
    private readonly swimlaneRepository: Repository<Swimlane>,
    @InjectRepository(Sprint)
    private readonly sprintRepository: Repository<Sprint>,
    @InjectRepository(Comentario)
    private readonly comentarioRepository: Repository<Comentario>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Stakeholder)
    private readonly stakeholderRepository: Repository<Stakeholder>,
    @InjectRepository(ColaboradorProjeto)
    private readonly colaboradorProjetoRepository: Repository<ColaboradorProjeto>,
    private readonly notificacaoService: NotificacaoService,
    @Inject('ILogger') private logger: ILogger,
  ) {}

  async findAll(projetoId: Projeto) {
    if (!projetoId)
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);

    const userStories = await this.userStoryRepository.find({
      where: { projeto: { id: projetoId.id } },
      relations: ['swimlane'],
    });

    const response = userStories.map((userStory) => {
      return {
        id: userStory.id,
        titulo: userStory.titulo,
        descricao: userStory.descricao,
        estimativa_tempo: userStory.estimativa_tempo,
        swimlane: userStory.swimlane.id,
      };
    });

    return response;
  }

  async findOne(id: number) {
    const us = await this.userStoryRepository.findOne({
      where: {
        id,
      },
      relations: ['swimlane', 'responsavel'],
    });

    return {
      ...us,
      responsavel: us.responsavel.id,
      swimlane: us.swimlane.id,
    };
  }

  async findFromSwimlane(swimlane: number, sprintId?: number) {
    let query = this.userStoryRepository
      .createQueryBuilder('us')
      .leftJoinAndSelect('us.responsavel', 'responsavel')
      .leftJoinAndSelect('us.sprints', 'sprints')
      .where('us.swimlane = :swimlaneId', { swimlaneId: swimlane });

    // If sprintId is provided, filter to only stories in that sprint
    if (sprintId) {
      query = query.andWhere('sprints.id = :sprintId', { sprintId });
    }

    const stories = await query.getMany();

    return stories.map((us) => ({
      id: us.id,
      titulo: us.titulo,
      descricao: us.descricao,
      estimativa_tempo: us.estimativa_tempo,
      // Return both id and nome for proper assignment detection in the UI
      responsavel: us.responsavel
        ? { id: us.responsavel.id, nome: us.responsavel.nome }
        : null,
      requisitos: us['requisitos'] || [],
    }));
  }

  async create(
    createUserStoryDto: CreateUserStoryDto,
    colaborador: Colaborador,
    projeto: Projeto,
  ) {
    this.logger.log(`Creating new user story: ${createUserStoryDto.titulo}`);

    const updateData: any = {
      titulo: createUserStoryDto.titulo,
      descricao: createUserStoryDto.descricao,
      estimativa_tempo: parseInt(createUserStoryDto.estimativa_tempo),
      criador: { id: colaborador.id },
      projeto: { id: projeto.id },
    };

    if (createUserStoryDto.responsavel !== undefined) {
      updateData.responsavel = { id: createUserStoryDto.responsavel };
    }
    if (createUserStoryDto.swimlane !== undefined) {
      updateData.swimlane = { id: parseInt(createUserStoryDto.swimlane) };
    }
    if (createUserStoryDto.kanban !== undefined) {
      updateData.kanban = { id: createUserStoryDto.kanban };
    }

    const userStory = this.userStoryRepository.create(updateData);
    return await this.userStoryRepository.save(userStory);
  }

  async update(id: number, updateUserStoryDto: UpdateUserStoryDto) {
    const updateData: any = {};

    if (updateUserStoryDto.titulo !== undefined) {
      updateData.titulo = updateUserStoryDto.titulo;
    }
    if (updateUserStoryDto.descricao !== undefined) {
      updateData.descricao = updateUserStoryDto.descricao;
    }
    if (updateUserStoryDto.estimativa_tempo !== undefined) {
      updateData.estimativa_tempo = parseInt(
        updateUserStoryDto.estimativa_tempo,
      );
    }
    if (updateUserStoryDto.responsavel !== undefined) {
      updateData.responsavel = { id: updateUserStoryDto.responsavel };
    }
    if (updateUserStoryDto.swimlane !== undefined) {
      updateData.swimlane = { id: parseInt(updateUserStoryDto.swimlane) };
    }
    if (updateUserStoryDto.kanban !== undefined) {
      updateData.kanban = { id: updateUserStoryDto.kanban };
    }

    return await this.userStoryRepository.update(id, updateData);
  }

  async remove(id: number) {
    return await this.userStoryRepository.delete(id);
  }

  async findByProject(projectId: number) {
    const userStories = await this.userStoryRepository.find({
      where: { projeto: { id: projectId } },
      relations: ['sprints', 'responsavel'],
    });

    return userStories.map((us) => ({
      id: us.id,
      titulo: us.titulo,
      descricao: us.descricao,
      estimativa_tempo: us.estimativa_tempo,
      sprints: us.sprints || [],
      responsavel: us.responsavel
        ? { id: us.responsavel.id, nome: us.responsavel.nome }
        : null,
    }));
  }

  async assignToSprint(userStoryId: number, sprintId: number) {
    const userStory = await this.userStoryRepository.findOne({
      where: { id: userStoryId },
      relations: ['sprints'],
    });

    const sprint = await this.sprintRepository.findOne({
      where: { id: sprintId },
    });

    if (!userStory) {
      throw new HttpException('User Story not found', HttpStatus.NOT_FOUND);
    }

    if (!sprint) {
      throw new HttpException('Sprint not found', HttpStatus.NOT_FOUND);
    }

    if (!userStory.sprints) {
      userStory.sprints = [];
    }

    // Check if already assigned
    if (!userStory.sprints.some((s) => s.id === sprintId)) {
      userStory.sprints.push(sprint);
      await this.userStoryRepository.save(userStory);
    }

    return userStory;
  }

  async removeFromSprint(userStoryId: number, sprintId: number) {
    const userStory = await this.userStoryRepository.findOne({
      where: { id: userStoryId },
      relations: ['sprints'],
    });

    if (!userStory) {
      throw new HttpException('User Story not found', HttpStatus.NOT_FOUND);
    }

    if (userStory.sprints) {
      userStory.sprints = userStory.sprints.filter((s) => s.id !== sprintId);
      await this.userStoryRepository.save(userStory);
    }

    return userStory;
  }

  async linkCasoUso(userStoryId: number, casoUsoId: number) {
    const userStory = await this.userStoryRepository.findOne({
      where: { id: userStoryId },
      relations: ['casosDeUso'],
    });

    const casoUso = await this.casoUsoRepository.findOne({
      where: { id: casoUsoId },
    });

    if (!userStory) {
      throw new HttpException('User Story not found', HttpStatus.NOT_FOUND);
    }

    if (!casoUso) {
      throw new HttpException('Caso de Uso not found', HttpStatus.NOT_FOUND);
    }

    if (!userStory.casosDeUso) {
      userStory.casosDeUso = [];
    }

    if (!userStory.casosDeUso.some((c) => c.id === casoUsoId)) {
      userStory.casosDeUso.push(casoUso);
      await this.userStoryRepository.save(userStory);
    }

    return userStory;
  }

  async unlinkCasoUso(userStoryId: number, casoUsoId: number) {
    const userStory = await this.userStoryRepository.findOne({
      where: { id: userStoryId },
      relations: ['casosDeUso'],
    });

    if (!userStory) {
      throw new HttpException('User Story not found', HttpStatus.NOT_FOUND);
    }

    if (userStory.casosDeUso) {
      userStory.casosDeUso = userStory.casosDeUso.filter(
        (c) => c.id !== casoUsoId,
      );
      await this.userStoryRepository.save(userStory);
    }

    return userStory;
  }

  async getCasosUso(userStoryId: number) {
    const userStory = await this.userStoryRepository.findOne({
      where: { id: userStoryId },
      relations: ['casosDeUso'],
    });

    return userStory?.casosDeUso || [];
  }

  async getComentarios(userStoryId: number) {
    const comentarios = await this.comentarioRepository.find({
      where: { userStory: { id: userStoryId } },
      relations: ['usuario'],
      order: { criado_em: 'DESC' },
    });

    const usuarioIds = comentarios
      .map((c) => c.usuario?.id)
      .filter((id): id is number => typeof id === 'number');

    const nomePorUsuario = new Map<number, string>();

    if (usuarioIds.length > 0) {
      const colaboradores = await this.colaboradorRepository.find({
        where: { usuario: { id: In(usuarioIds) } },
        relations: ['usuario'],
      });
      for (const col of colaboradores) {
        if (col.usuario?.id) nomePorUsuario.set(col.usuario.id, col.nome);
      }

      const stakeholders = await this.stakeholderRepository.find({
        where: { usuario: { id: In(usuarioIds) } },
        relations: ['usuario'],
      });
      for (const stk of stakeholders) {
        if (stk.usuario?.id && !nomePorUsuario.has(stk.usuario.id)) {
          nomePorUsuario.set(stk.usuario.id, stk.nome);
        }
      }
    }

    return comentarios.map((c) => {
      const uid = c.usuario?.id;
      const nome =
        (uid ? nomePorUsuario.get(uid) : undefined) ||
        (uid ? `Usuário ${uid}` : 'Usuário');
      return {
        id: c.id,
        comentario: c.comentario,
        criado_em: c.criado_em,
        modificado_em: c.modificado_em,
        usuario: {
          id: uid,
          nome,
        },
      };
    });
  }

  async createComentario(
    userStoryId: number,
    createComentarioDto: CreateComentarioDto,
  ) {
    const userStory = await this.userStoryRepository.findOne({
      where: { id: userStoryId },
    });

    if (!userStory) {
      throw new HttpException('User Story not found', HttpStatus.NOT_FOUND);
    }

    const usuario = await this.usuarioRepository.findOne({
      where: { id: createComentarioDto.usuarioId },
    });

    if (!usuario) {
      throw new HttpException('Usuario not found', HttpStatus.NOT_FOUND);
    }

    const comentario = this.comentarioRepository.create({
      comentario: createComentarioDto.comentario,
      usuario,
      userStory,
      criado_em: new Date(),
      modificado_em: new Date(),
    });

    const saved = await this.comentarioRepository.save(comentario);

    // Resolve display name for the usuario (prefer Colaborador, fallback to Stakeholder)
    let nome = '';
    const col = await this.colaboradorRepository.findOne({
      where: { usuario: { id: usuario.id } },
      relations: ['usuario'],
    });
    if (col) {
      nome = col.nome;
    } else {
      const stk = await this.stakeholderRepository.findOne({
        where: { usuario: { id: usuario.id } },
        relations: ['usuario'],
      });
      nome = stk?.nome || `Usuário ${usuario.id}`;
    }

    const response = {
      id: saved.id,
      comentario: saved.comentario,
      criado_em: saved.criado_em,
      modificado_em: saved.modificado_em,
      usuario: {
        id: usuario.id,
        nome,
      },
    };

    // Create notifications for mentions if provided
    try {
      await this.notificacaoService.createForMentions(
        createComentarioDto.mentionUsuarioIds,
        {
          remetenteUsuarioId: usuario.id,
          userStoryId: userStoryId,
          comentarioId: saved.id,
          mensagem: `${nome} mencionou você em "${userStory.titulo}"`,
        },
      );
    } catch (e) {
      // swallow notification errors
    }

    return response;
  }

  async getMentionablesByProject(projectId: number) {
    if (!projectId) {
      throw new HttpException('Projeto é obrigatório', HttpStatus.BAD_REQUEST);
    }

    // Fetch colaboradores for the project via the join table
    const colProjetos = await this.colaboradorProjetoRepository.find({
      where: { projeto: { id: projectId } },
      relations: ['colaborador', 'colaborador.usuario', 'projeto'],
    });

    // Fetch stakeholders linked directly to the project
    const stakeholders = await this.stakeholderRepository.find({
      where: { projeto: { id: projectId } },
      relations: ['usuario', 'projeto'],
    });

    // Normalize and deduplicate by usuarioId (a usuario could exist in both roles)
    const mentionablesMap = new Map<
      number,
      {
        usuarioId: number;
        nome: string;
        tipo: 'colaborador' | 'stakeholder';
        id: number;
      }
    >();

    colProjetos.forEach((cp) => {
      const usuarioId = cp.colaborador?.usuario?.id;
      if (!usuarioId) return;
      if (!mentionablesMap.has(usuarioId)) {
        mentionablesMap.set(usuarioId, {
          usuarioId,
          nome: cp.colaborador.nome,
          tipo: 'colaborador',
          id: cp.colaborador.id,
        });
      }
    });

    stakeholders.forEach((s) => {
      const usuarioId = s.usuario?.id;
      if (!usuarioId) return;
      if (!mentionablesMap.has(usuarioId)) {
        mentionablesMap.set(usuarioId, {
          usuarioId,
          nome: s.nome,
          tipo: 'stakeholder',
          id: s.id,
        });
      }
    });

    return Array.from(mentionablesMap.values()).sort((a, b) =>
      a.nome.localeCompare(b.nome),
    );
  }

  async deleteComentario(comentarioId: number) {
    const comentario = await this.comentarioRepository.findOne({
      where: { id: comentarioId },
    });

    if (!comentario) {
      throw new HttpException('Comentario not found', HttpStatus.NOT_FOUND);
    }

    await this.comentarioRepository.delete(comentarioId);
    return { success: true };
  }
}
