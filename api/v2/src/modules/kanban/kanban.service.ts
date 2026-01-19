import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Projeto } from '../projeto/entities/projeto.entity';
import { UserStory } from '../user-story/entities/user-story.entity';
import { SwimlaneDto } from './dto/swimlane.dto';
import { UpdateSwimlaneOrderDto } from './dto/update-swimlane-order.dto';
import { UpdateSwimlaneUsDto } from './dto/update-swimlane-us.dto';
import { UpdateSwimlaneDto } from './dto/update-swimlane.dto';
import { Kanban } from './entities/kanban.entity';
import { Swimlane } from './entities/swimlane.entity';
import { KanbanRepository } from './kanban.repository';

@Injectable()
export class KanbanService {
  constructor(
    @InjectRepository(Kanban)
    private readonly kanbanRepository: Repository<Kanban>,
    @InjectRepository(Projeto)
    private readonly projetoRepository: Repository<Projeto>,
    @InjectRepository(Swimlane)
    private readonly swimlaneRepository: Repository<Swimlane>,
    @InjectRepository(UserStory)
    private readonly userStoryRepository: Repository<UserStory>,
    @Inject()
    private readonly kanbanRepositoryCustom: KanbanRepository,
  ) {}

  async findBoard(projetoId: number, sprintId?: number) {
    return this.kanbanRepositoryCustom.findBoard(projetoId, sprintId);
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

  async findOneSwimlane(id: number, projetoId: number) {
    const swimlane = await this.swimlaneRepository.findOne({
      where: { id, kanban: { projeto: { id: projetoId } } },
      relations: ['kanban', 'kanban.projeto'],
    });

    if (!swimlane || swimlane.kanban.projeto.id !== projetoId) {
      throw new Error('Swimlane not found or does not belong to this project');
    }

    return swimlane;
  }

  async updateSwimlane(
    id: number,
    swimlaneDto: UpdateSwimlaneDto,
    projetoId: number,
  ) {
    // Verify swimlane belongs to the project
    const swimlane = await this.swimlaneRepository.findOne({
      where: { id },
      relations: ['kanban', 'kanban.projeto'],
    });

    if (!swimlane || swimlane.kanban.projeto.id !== projetoId) {
      throw new Error('Swimlane not found or does not belong to this project');
    }

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

  async updateSwimlaneUserStories(
    swimlaneDto: UpdateSwimlaneUsDto,
    projetoId: number,
  ) {
    const swimlane = await this.swimlaneRepository.findOne({
      where: { id: swimlaneDto.id },
      relations: ['kanban', 'kanban.projeto'],
    });

    if (!swimlane || swimlane.kanban.projeto.id !== projetoId) {
      throw new Error('Swimlane not found or does not belong to this project');
    }

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

  async updateSwimlaneOrder(swimlaneOrderDto: UpdateSwimlaneOrderDto) {
    // IDs should be validated by the controller, but we add defensive checks here
    if (
      !swimlaneOrderDto.swimlaneIds ||
      swimlaneOrderDto.swimlaneIds.length === 0
    ) {
      throw new Error('No swimlane IDs provided');
    }

    // Verify all swimlanes exist before updating
    const swimlaneIds = swimlaneOrderDto.swimlaneIds;
    console.log('Swimlane IDs to update:', swimlaneIds);
    const swimlanes = await this.swimlaneRepository.find({
      where: { id: In(swimlaneIds) },
    });

    console.log('Found swimlanes:', swimlanes);

    if (swimlanes.length !== swimlaneIds.length) {
      const foundIds = swimlanes.map((s) => s.id);
      const missingIds = swimlaneIds.filter((id) => !foundIds.includes(id));
      throw new Error(`Swimlanes not found with IDs: ${missingIds.join(', ')}`);
    }

    // Update order for each swimlane
    const updatePromises = swimlaneIds.map(async (swimlaneId, index) => {
      // Ensure we have valid numeric IDs
      if (
        typeof swimlaneId !== 'number' ||
        !Number.isInteger(swimlaneId) ||
        swimlaneId <= 0
      ) {
        throw new Error(`Invalid swimlane ID: ${swimlaneId}`);
      }

      const result = await this.swimlaneRepository.update(
        { id: swimlaneId },
        { ordem: index },
      );

      if (!result.affected || result.affected === 0) {
        throw new Error(`Failed to update swimlane with ID: ${swimlaneId}`);
      }
    });

    await Promise.all(updatePromises);

    return HttpStatus.OK;
  }

  async deleteSwimlane(id: number, projetoId: number) {
    // Verify swimlane belongs to the project
    const swimlane = await this.swimlaneRepository.findOne({
      where: { id },
      relations: ['kanban', 'kanban.projeto'],
    });

    if (!swimlane || swimlane.kanban.projeto.id !== projetoId) {
      throw new Error('Swimlane not found or does not belong to this project');
    }

    return await this.swimlaneRepository.delete(id);
  }

  async createSwimlane(swimlane: SwimlaneDto, projetoId: number) {
    // Verify kanban belongs to the project
    const kanban = await this.kanbanRepository.findOne({
      where: { id: swimlane.kanban },
      relations: ['projeto'],
    });

    if (!kanban || kanban.projeto.id !== projetoId) {
      throw new Error('Kanban not found or does not belong to this project');
    }

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
