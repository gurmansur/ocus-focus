import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCasoDeTesteBo } from './bo/create-caso-de-teste.bo';
import { UpdateCasoDeTesteBo } from './bo/update-caso-de-teste.bo';
import { CasoDeTesteMapper } from './caso-de-teste.mapper';
import { CasoDeTeste } from './entities/caso-de-teste.entity';

@Injectable()
export class CasoDeTesteService {
  constructor(
    @InjectRepository(CasoDeTeste)
    private casoDeTesteRepository: Repository<CasoDeTeste>,
  ) {}

  async create(createCasoDeTesteBo: CreateCasoDeTesteBo) {
    return CasoDeTesteMapper.entityToCasoDeTesteBo(
      await this.casoDeTesteRepository.save(
        CasoDeTesteMapper.createCasoDeTesteBoToEntity(createCasoDeTesteBo),
      ),
    );
  }

  async findAll() {
    return (
      await this.casoDeTesteRepository.find({
        relations: ['testadorDesignado', 'suiteDeTeste', 'casoDeUso'],
      })
    ).map((casoDeTeste) =>
      CasoDeTesteMapper.entityToCasoDeTesteBo(casoDeTeste),
    );
  }

  async findOne(id: number) {
    const casoDeTeste = await this.casoDeTesteRepository.findOne({
      where: { id },
      relations: ['testadorDesignado', 'suiteDeTeste', 'casoDeUso'],
    });

    if (!casoDeTeste) {
      throw new BadRequestException('Caso de teste não encontrado');
    }

    return CasoDeTesteMapper.entityToCasoDeTesteBo(casoDeTeste);
  }

  update(id: number, updateCasoDeTesteBo: UpdateCasoDeTesteBo) {
    return this.casoDeTesteRepository.update(
      id,
      CasoDeTesteMapper.updateCasoDeTesteBoToEntity(updateCasoDeTesteBo),
    );
  }

  remove(id: number) {
    return this.casoDeTesteRepository.softDelete(id);
  }
}
