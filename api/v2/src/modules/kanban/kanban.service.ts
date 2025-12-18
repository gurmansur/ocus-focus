import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Projeto } from '../projeto/entities/projeto.entity';
import { UserStory } from '../user-story/entities/user-story.entity';
import { UserStoryService } from '../user-story/user-story.service';
import { SwimlaneDto } from './dto/swimlane.dto';
import { UpdateSwimlaneUsDto } from './dto/update-swimlane-us.dto';
import { UpdateSwimlaneDto } from './dto/update-swimlane.dto';
import { Kanban } from './entities/kanban.entity';
import { Swimlane } from './entities/swimlane.entity';

@Injectable()
export class KanbanService {
  constructor(
    @InjectRepository(Kanban)
    private readonly kanbanRepository: Repository<Kanban>,
    @InjectRepository(Projeto)
    private readonly projetoRepository: Repository<Projeto>,
    @InjectRepository(Swimlane)
    private readonly swimlaneRepository: Repository<Swimlane>,
    @Inject() private readonly userStoryService: UserStoryService,
    @InjectRepository(UserStory)
    private readonly userStoryRepository: Repository<UserStory>,
  ) {}

  async findBoard(projetoId: number, sprintId?: number) {
    const projeto = await this.projetoRepository.findOne({
      where: { id: projetoId },
    });
    const kanban = await this.kanbanRepository.findOne({
      where: { projeto: projeto },
      relations: ['projeto'],
    });

    const swimlaneRepo = await this.swimlaneRepository.find({
      where: { kanban: kanban },
      relations: ['kanban'],
    });

    const swimlanes = await Promise.all(
      swimlaneRepo.map(async (swimlane) => {
        const us = await this.userStoryService.findFromSwimlane(
          swimlane.id,
          sprintId,
        );

        return {
          id: swimlane.id,
          nome: swimlane.nome,
          cor: swimlane.cor,
          vertical: swimlane.vertical,
          userStories: us,
        };
      }),
    );

    return {
      nome: projeto.nome,
      swimlanes,
    };
  }

  async findSwimlaneFromProject(projetoId: number) {
    const projeto = await this.projetoRepository.findOne({
      where: { id: projetoId },
    });
    const kanban = await this.kanbanRepository.findOne({
      where: { projeto: projeto },
      relations: ['projeto'],
    });

    const swimlaneRepo = await this.swimlaneRepository.find({
      where: { kanban: kanban },
      relations: ['kanban'],
    });

    const swimlanes = swimlaneRepo.map((swimlane) => {
      return { id: swimlane.id, nome: swimlane.nome };
    });

    return swimlanes;
  }

  async findIdFromProject(projeto: Projeto) {
    const kanban = await this.kanbanRepository.findOne({
      where: { projeto: { id: projeto.id } },
      relations: ['projeto'],
    });

    return kanban.id;
  }

  async findOneSwimlane(id: number) {
    return await this.swimlaneRepository.findOne({
      where: {
        id,
      },
    });
  }

  async updateSwimlane(id: number, swimlaneDto: UpdateSwimlaneDto) {
    console.log(swimlaneDto);
    const kanban = await this.kanbanRepository.findOne({
      where: {
        id: swimlaneDto.kanban,
      },
    });

    return await this.swimlaneRepository.update(id, {
      ...swimlaneDto,
      kanban: kanban,
    });
  }

  async updateSwimlaneUserStories(swimlaneDto: UpdateSwimlaneUsDto) {
    const swimlane = await this.swimlaneRepository.findOne({
      where: {
        id: swimlaneDto.id,
      },
    });

    const userStories = await Promise.all(
      swimlaneDto.userStories.map(async (userStory) => {
        const us = await this.userStoryRepository.findOne({
          where: {
            id: userStory,
          },
        });

        us.swimlane = swimlane;

        this.userStoryRepository.update(us.id, us);

        return us;
      }),
    );

    if (userStories) return HttpStatus.OK;
  }

  async deleteSwimlane(id: number) {
    return await this.swimlaneRepository.delete(id);
  }

  async createSwimlane(swimlane: SwimlaneDto) {
    const kanban = await this.kanbanRepository.findOne({
      where: {
        id: swimlane.kanban,
      },
    });

    const swimlaneCreated = this.swimlaneRepository.create({
      ...swimlane,
      kanban,
    });

    return await this.swimlaneRepository.save(swimlaneCreated);
  }

  async createKanban(projeto: Projeto) {
    const kanban = this.kanbanRepository.create({ projeto: projeto });

    return await this.kanbanRepository.save(kanban);
  }
}
