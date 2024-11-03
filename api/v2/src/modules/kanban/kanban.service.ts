import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Projeto } from '../projeto/entities/projeto.entity';
import { UserStoryService } from '../user-story/user-story.service';
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

  async findSwimlanes(projetoId: number) {
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
}
