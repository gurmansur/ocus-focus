import { Injectable } from '@nestjs/common';
import { CreateEstimativaDto } from './dto/create-estimativa.dto';
import { UpdateEstimativaDto } from './dto/update-estimativa.dto';

@Injectable()
export class EstimativaService {
  create(createEstimativaDto: CreateEstimativaDto) {
    return 'This action adds a new estimativa';
  }

  findAll() {
    return `This action returns all estimativa`;
  }

  findOne(id: number) {
    return `This action returns a #${id} estimativa`;
  }

  update(id: number, updateEstimativaDto: UpdateEstimativaDto) {
    return `This action updates a #${id} estimativa`;
  }

  remove(id: number) {
    return `This action removes a #${id} estimativa`;
  }
}
