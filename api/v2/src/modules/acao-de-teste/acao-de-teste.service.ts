import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CasoDeTesteService } from '../caso-de-teste/caso-de-teste.service';
import { AcaoDeTesteMapper } from './acao-de-teste.mapper';
import { CreateAcaoDeTesteBo } from './bo/create-acao-de-teste.bo';
import { UpdateAcaoDeTesteBo } from './bo/update-acao-de-teste.bo';
import { AcaoDeTeste } from './entities/acao-de-teste.entity';

@Injectable()
export class AcaoDeTesteService {
  constructor(
    @InjectRepository(AcaoDeTeste)
    private acaoDeTesteRepository: Repository<AcaoDeTeste>,
    private casoDeTesteService: CasoDeTesteService,
  ) {}

  async create(createAcaoDeTesteBo: CreateAcaoDeTesteBo) {
    const entity = AcaoDeTesteMapper.createBoToEntity(createAcaoDeTesteBo);

    if (createAcaoDeTesteBo.casoDeTesteId) {
      const caso = await this.casoDeTesteService.findOne(
        createAcaoDeTesteBo.casoDeTesteId,
      );

      if (!caso) {
        throw new BadRequestException('Caso de teste não encontrado');
      }
    }

    return AcaoDeTesteMapper.entityToBo(
      await this.acaoDeTesteRepository.save(entity),
    );
  }

  async findAll(casoDeTesteId?: number) {
    const where = casoDeTesteId ? { casoDeTeste: { id: casoDeTesteId } } : {};

    const entities = await this.acaoDeTesteRepository.find({
      where,
      order: { ordem: 'ASC' },
    });

    return entities.map((entity) => AcaoDeTesteMapper.entityToBo(entity));
  }

  async findOne(id: number) {
    const entity = await this.acaoDeTesteRepository.findOne({
      where: { id },
    });

    return AcaoDeTesteMapper.entityToBo(entity);
  }

  async update(id: number, updateAcaoDeTesteBo: UpdateAcaoDeTesteBo) {
    const entity = AcaoDeTesteMapper.updateBoToEntity(updateAcaoDeTesteBo);

    await this.acaoDeTesteRepository.update(id, entity);

    return this.findOne(id);
  }

  async remove(id: number) {
    return this.acaoDeTesteRepository.softDelete(id);
  }

  async findByCasoDeTesteId(
    casoDeTesteId: number,
    execucaoTipo?: 'MANUAL' | 'AUTOMATIZADO',
  ) {
    const where: any = { casoDeTeste: { id: casoDeTesteId } };

    if (execucaoTipo) {
      where.execucaoTipo = execucaoTipo;
    }

    const entities = await this.acaoDeTesteRepository.find({
      where,
      order: { ordem: 'ASC' },
    });

    return entities;
  }
}
