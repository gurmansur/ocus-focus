import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Projeto } from '../projeto/entities/projeto.entity';
import { UserStoryService } from '../user-story/user-story.service';
import { SwimlaneDto } from './dto/swimlane.dto';
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
  ) {}

  async findBoard(projetoId: number) {
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
        const us = await this.userStoryService.findFromSwimlane(swimlane.id);

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

  async findIdFromProject(projetoId: number) {
    const projeto = await this.projetoRepository.findOne({
      where: { id: projetoId },
    });
    const kanban = await this.kanbanRepository.findOne({
      where: { projeto: projeto },
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
