import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChangeStatusExecucaoDeTesteBo } from './bo/change-status-execucao-de-teste.bo';
import { CreateExecucaoDeTesteBo } from './bo/create-execucao-de-teste.bo';
import { UpdateExecucaoDeTesteBo } from './bo/update-execucao-de-teste.bo';
import { ExecucaoDeTeste } from './entities/execucao-de-teste.entity';
import { ExecucaoDeTesteMapper } from './execucao-de-teste.mapper';

@Injectable()
export class ExecucaoDeTesteService {
  constructor(
    @InjectRepository(ExecucaoDeTeste)
    private execucaoDeTesteRepository: Repository<ExecucaoDeTeste>,
  ) {}

  async create(createExecucaoDeTesteBo: CreateExecucaoDeTesteBo) {
    const entity = ExecucaoDeTesteMapper.createBoToEntity(
      createExecucaoDeTesteBo,
    );

    return ExecucaoDeTesteMapper.entityToBo(
      await this.execucaoDeTesteRepository.save(entity),
    );
  }

  async findAll() {
    const entities = await this.execucaoDeTesteRepository.find();

    return entities.map((entity) => ExecucaoDeTesteMapper.entityToBo(entity));
  }

  async findOne(id: number) {
    return ExecucaoDeTesteMapper.entityToBo(
      await this.execucaoDeTesteRepository.findOne({ where: { id } }),
    );
  }

  update(id: number, updateExecucaoDeTesteBo: UpdateExecucaoDeTesteBo) {
    const entity = ExecucaoDeTesteMapper.updateBoToEntity(
      updateExecucaoDeTesteBo,
    );

    return this.execucaoDeTesteRepository.update(id, entity);
  }

  changeStatus(
    id: number,
    changeStatusExecucaoDeTesteBo: ChangeStatusExecucaoDeTesteBo,
  ) {
    const entity = ExecucaoDeTesteMapper.changeStatusBoToEntity(
      changeStatusExecucaoDeTesteBo,
    );

    return this.execucaoDeTesteRepository.update(id, entity);
  }

  remove(id: number) {
    return this.execucaoDeTesteRepository.softDelete(id);
  }
}
