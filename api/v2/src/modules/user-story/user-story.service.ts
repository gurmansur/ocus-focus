import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CasoUso } from '../caso-uso/entities/caso-uso.entity';
import { Colaborador } from '../colaborador/entities/colaborador.entity';
import { Kanban } from '../kanban/entities/kanban.entity';
import { Swimlane } from '../kanban/entities/swimlane.entity';
import { Projeto } from '../projeto/entities/projeto.entity';
import { Sprint } from '../sprint/entities/sprint.entity';
import { CreateUserStoryDto } from './dto/create-user-story.dto';
import { UpdateUserStoryDto } from './dto/update-user-story.dto';
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
      // Return the responsible user's display name expected by the UI
      responsavel: us.responsavel ? us.responsavel.nome : null,
      requisitos: us['requisitos'] || [],
    }));
  }

  async create(createUserStoryDto: CreateUserStoryDto) {
    const criador = await this.colaboradorRepository.findOne({
      where: {
        id: createUserStoryDto.criador,
      },
    });

    const responsavel = await this.colaboradorRepository.findOne({
      where: {
        id: parseInt(createUserStoryDto.responsavel),
      },
    });

    const projeto = await this.projetoRepository.findOne({
      where: {
        id: createUserStoryDto.projeto,
      },
    });

    const kanban = await this.kanbanRepository.findOne({
      where: {
        id: createUserStoryDto.kanban,
      },
    });

    const swimlane = await this.swimlaneRepository.findOne({
      where: {
        id: parseInt(createUserStoryDto.swimlane),
      },
    });

    const userStory = {
      titulo: createUserStoryDto.titulo,
      descricao: createUserStoryDto.descricao,
      estimativa_tempo: parseInt(createUserStoryDto.estimativa_tempo),
      responsavel: responsavel,
      criador: criador,
      swimlane: swimlane,
      projeto: projeto,
      kanban: kanban,
    };

    const userStoryCreated = this.userStoryRepository.create(userStory);

    return await this.userStoryRepository.save(userStoryCreated);
  }

  async update(id: number, updateUserStoryDto: UpdateUserStoryDto) {
    const criador = await this.colaboradorRepository.findOne({
      where: {
        id: updateUserStoryDto.criador,
      },
    });

    const responsavel = await this.colaboradorRepository.findOne({
      where: {
        id: parseInt(updateUserStoryDto.responsavel),
      },
    });

    const projeto = await this.projetoRepository.findOne({
      where: {
        id: updateUserStoryDto.projeto,
      },
    });

    const kanban = await this.kanbanRepository.findOne({
      where: {
        id: updateUserStoryDto.kanban,
      },
    });

    const swimlane = await this.swimlaneRepository.findOne({
      where: {
        id: parseInt(updateUserStoryDto.swimlane),
      },
    });

    const userStory = {
      titulo: updateUserStoryDto.titulo,
      descricao: updateUserStoryDto.descricao,
      estimativa_tempo: parseInt(updateUserStoryDto.estimativa_tempo),
      responsavel: responsavel,
      criador: criador,
      swimlane: swimlane,
      projeto: projeto,
      kanban: kanban,
    };

    const result = await this.userStoryRepository.update(id, userStory);

    console.log(result);

    return;
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
}
