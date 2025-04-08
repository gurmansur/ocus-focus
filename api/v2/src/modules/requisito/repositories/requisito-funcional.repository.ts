import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequisitoFuncional } from '../entities/requisito-funcional.entity';

@Injectable()
export class RequisitoFuncionalRepository {
  constructor(
    @InjectRepository(RequisitoFuncional)
    private readonly requisitoFuncionalRepo: Repository<RequisitoFuncional>,
  ) {}

  async findOne(options?: any): Promise<RequisitoFuncional> {
    return this.requisitoFuncionalRepo.findOne(options);
  }

  async find(options?: any): Promise<RequisitoFuncional[]> {
    return this.requisitoFuncionalRepo.find(options);
  }

  async findAndCount(options?: any): Promise<[RequisitoFuncional[], number]> {
    return this.requisitoFuncionalRepo.findAndCount(options);
  }

  async save(entity: Partial<RequisitoFuncional>): Promise<RequisitoFuncional> {
    return this.requisitoFuncionalRepo.save(entity);
  }

  async update(
    id: number,
    updateDto: Partial<RequisitoFuncional>,
  ): Promise<any> {
    return this.requisitoFuncionalRepo.update(id, updateDto);
  }

  async delete(criteria: any): Promise<any> {
    return this.requisitoFuncionalRepo.delete(criteria);
  }
}
