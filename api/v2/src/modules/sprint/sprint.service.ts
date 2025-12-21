import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ILogger } from '../../common/interfaces/logger.interface';
import { Projeto } from '../projeto/entities/projeto.entity';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import { Sprint } from './entities/sprint.entity';
import { SprintMapper } from './sprint.mapper';

@Injectable()
export class SprintService {
  constructor(
    @InjectRepository(Sprint)
    private readonly sprintRepository: Repository<Sprint>,
    @InjectRepository(Projeto)
    private readonly projetoRepository: Repository<Projeto>,
    @Inject('ILogger') private logger: ILogger,
  ) {}

  async create(createSprintDto: CreateSprintDto, projeto: Projeto) {
    this.logger.log(`Creating sprint for projeto ${projeto.id}`);
    const sprint = this.sprintRepository.create({
      ...createSprintDto,
      projeto,
    });
    const savedSprint = await this.sprintRepository.save(sprint);
    return SprintMapper.entityToBo(savedSprint);
  }

  async findAll(projeto: Projeto) {
    const sprints = await this.sprintRepository.find({
      where: { projeto: { id: projeto.id } },
      relations: ['userStories'],
    });
    return sprints.map((sprint) => SprintMapper.entityToBo(sprint));
  }

  async findByProject(projeto: Projeto) {
    const sprints = await this.sprintRepository.find({
      where: { projeto: { id: projeto.id } },
      relations: ['userStories'],
    });
    return sprints.map((sprint) => SprintMapper.entityToBo(sprint));
  }

  async findOne(id: number) {
    const sprint = await this.sprintRepository.findOne({
      where: { id },
      relations: ['userStories'],
    });
    return sprint ? SprintMapper.entityToBo(sprint) : null;
  }

  async update(id: number, updateSprintDto: UpdateSprintDto) {
    this.logger.log(`Updating sprint ${id}`);
    await this.sprintRepository.update(id, updateSprintDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    this.logger.warn(`Deleting sprint ${id}`);
    const sprint = await this.findOne(id);
    await this.sprintRepository.delete(id);
    return sprint;
  }
}
