import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAtorDto } from './dto/create-ator.dto';
import { UpdateAtorDto } from './dto/update-ator.dto';
import { Ator } from './entities/ator.entity';

@Injectable()
export class AtorService {
  constructor(
    @InjectRepository(Ator) private readonly atorRepository: Repository<Ator>,
  ) {}

  async create(createAtorDto: CreateAtorDto) {
    const ator = this.atorRepository.create(createAtorDto);
    return await this.atorRepository.save(ator);
  }

  async findAll() {
    return await this.atorRepository.find();
  }

  async findOne(id: number) {
    return await this.atorRepository.findOne({ where: { id } });
  }

  update(id: number, updateAtorDto: UpdateAtorDto) {
    return this.atorRepository.update(id, updateAtorDto);
  }

  remove(id: number) {
    return this.atorRepository.delete(id);
  }
}
