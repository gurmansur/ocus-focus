import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CasoDeTesteService } from '../caso-de-teste/caso-de-teste.service';
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
    private casoDeTesteService: CasoDeTesteService,
  ) {}

  async create(createExecucaoDeTesteBo: CreateExecucaoDeTesteBo) {
    const entity = ExecucaoDeTesteMapper.createBoToEntity(
      createExecucaoDeTesteBo,
    );

    if (createExecucaoDeTesteBo.casoDeTesteId) {
      const caso = await this.casoDeTesteService.findOne(
        createExecucaoDeTesteBo.casoDeTesteId,
      );

      if (!caso) {
        throw new BadRequestException('Caso de teste não encontrado');
      }
    }

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

  async changeStatus(
    id: number,
    changeStatusExecucaoDeTesteBo: ChangeStatusExecucaoDeTesteBo,
  ) {
    const entity = await this.execucaoDeTesteRepository.findOne({
      where: { id },
    });

    const updatedEntity = ExecucaoDeTesteMapper.changeStatusBoToEntity(
      changeStatusExecucaoDeTesteBo,
    );

    Object.assign(entity, updatedEntity);

    return this.execucaoDeTesteRepository.save(entity);
  }

  remove(id: number) {
    return this.execucaoDeTesteRepository.softDelete(id);
  }
}
