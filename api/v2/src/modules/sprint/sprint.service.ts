import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import { Sprint } from './entities/sprint.entity';

@Injectable()
export class SprintService {
  constructor(
    @InjectRepository(Sprint)
    private readonly sprintRepository: Repository<Sprint>,
  ) {}

  create(createSprintDto: CreateSprintDto) {
    return this.sprintRepository.save(createSprintDto);
  }

  findAll() {
    return this.sprintRepository.find();
  }

  findByProjeto(projetoId: number) {
    return this.sprintRepository.find({
      where: { projeto: { id: projetoId } },
      order: { data_inicio: 'ASC' },
    });
  }

  findOne(id: number) {
    return this.sprintRepository.findOne({ where: { id } });
  }

  update(id: number, updateSprintDto: UpdateSprintDto) {
    return this.sprintRepository.update(id, updateSprintDto);
  }

  remove(id: number) {
    return this.sprintRepository.delete(id);
  }
}
