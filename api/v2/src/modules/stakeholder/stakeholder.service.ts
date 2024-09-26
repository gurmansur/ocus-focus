import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStakeholderDto } from './dto/create-stakeholder.dto';
import { UpdateStakeholderDto } from './dto/update-stakeholder.dto';
import { Stakeholder } from './entities/stakeholder.entity';

@Injectable()
export class StakeholderService {
  constructor(
    @InjectRepository(Stakeholder)
    private readonly stakeholderRepository: Repository<Stakeholder>,
  ) {}

  create(createStakeholderDto: CreateStakeholderDto) {
    return 'This action adds a new stakeholder';
  }

  findAll() {
    return `This action returns all stakeholder`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stakeholder`;
  }

  findByEmail(email: string) {
    return this.stakeholderRepository.findOne({ where: { email } });
  }

  update(id: number, updateStakeholderDto: UpdateStakeholderDto) {
    return `This action updates a #${id} stakeholder`;
  }

  remove(id: number) {
    return `This action removes a #${id} stakeholder`;
  }
}
