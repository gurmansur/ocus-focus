import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Colaborador } from '../colaborador/entities/colaborador.entity';
import { Kanban } from '../kanban/entities/kanban.entity';
import { Swimlane } from '../kanban/entities/swimlane.entity';
import { Projeto } from '../projeto/entities/projeto.entity';
import { CreateUserStoryDto } from './dto/create-user-story.dto';
import { UpdateUserStoryDto } from './dto/update-user-story.dto';
import { UserStory } from './entities/user-story.entity';

@Injectable()
export class UserStoryService {
  constructor(
    @InjectRepository(UserStory)
    private readonly userStoryRepository: Repository<UserStory>,
    @InjectRepository(Colaborador)
    private readonly colaboradorRepository: Repository<Colaborador>,
    @InjectRepository(Projeto)
    private readonly projetoRepository: Repository<Projeto>,
    @InjectRepository(Kanban)
    private readonly kanbanRepository: Repository<Kanban>,
    @InjectRepository(Swimlane)
    private readonly swimlaneRepository: Repository<Swimlane>,
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
    try {
      const us = await this.userStoryRepository.findOne({
        where: {
          id,
        },
        relations: {
          swimlane: true,
          responsavel: true,
        },
      });

      if (!us) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

      return {
        ...us,
        responsavel: us.responsavel.id,
        swimlane: us.swimlane.id,
      };
    } catch (error) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findFromSwimlane(swimlane: number) {
    return await this.userStoryRepository.find({
      where: { swimlane: { id: swimlane } },
    });
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

  async findOneFullInformation(id: number) {
    try {
      const us = await this.userStoryRepository.findOne({
        where: {
          id,
        },
      });

      if (!us) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

      return us;
    } catch (error) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
