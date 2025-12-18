import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import { Sprint } from './entities/sprint.entity';
import { SprintMapper } from './sprint.mapper';

@Injectable()
export class SprintService {
  constructor(
    @InjectRepository(Sprint)
    private readonly sprintRepository: Repository<Sprint>,
  ) {}

  async create(createSprintDto: CreateSprintDto) {
    const sprint = this.sprintRepository.create(createSprintDto);
    const savedSprint = await this.sprintRepository.save(sprint);
    return SprintMapper.entityToBo(savedSprint);
  }

  async findAll() {
    const sprints = await this.sprintRepository.find({
      relations: ['userStories'],
    });
    return sprints.map((sprint) => SprintMapper.entityToBo(sprint));
  }

  async findByProject(projectId: number) {
    const sprints = await this.sprintRepository.find({
      where: { projeto: { id: projectId } },
      relations: ['userStories', 'projeto'],
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
    await this.sprintRepository.update(id, updateSprintDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const sprint = await this.findOne(id);
    await this.sprintRepository.delete(id);
    return sprint;
  }
}
