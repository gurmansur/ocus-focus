import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { randomBytes } from 'crypto';
import { Repository } from 'typeorm';
import { ProjetoService } from '../projeto/projeto.service';
import { StatusPriorizacaoService } from '../status-priorizacao/status-priorizacao.service';
import { UsuarioService } from '../usuario/usuario.service';
import { CreateStakeholderDto } from './dto/create-stakeholder.dto';
import { UpdateStakeholderDto } from './dto/update-stakeholder.dto';
import { Stakeholder } from './entities/stakeholder.entity';
import { StakeholderBuilder } from './stakeholder.builder';

@Injectable()
export class StakeholderService {
  constructor(
    @InjectRepository(Stakeholder)
    private readonly stakeholderRepository: Repository<Stakeholder>,
    @Inject() private readonly usuarioService: UsuarioService,
    @Inject() private readonly projetoService: ProjetoService,
    @Inject()
    private readonly statusPriorizacaoService: StatusPriorizacaoService,
  ) {}

  async create(createStakeholderDto: CreateStakeholderDto) {
    const chave = randomBytes(20).toString('hex');

    const usuarioPorChave = await this.stakeholderRepository.findOne({
      where: { chave },
    });

    if (usuarioPorChave) {
      throw new Error('Chave já cadastrada!');
    }

    const usuario = await this.usuarioService.create({});

    const projeto = await this.projetoService.findOne(
      createStakeholderDto.projeto_id,
    );

    if (!projeto) {
      throw new Error('Projeto não encontrado');
    }

    createStakeholderDto.senha = await hash(createStakeholderDto.senha, 10);

    const stakeholderEntity = StakeholderBuilder.buildStakeholderEntityFromDto(
      createStakeholderDto,
      chave,
      usuario,
      projeto,
    );

    this.statusPriorizacaoService.create(stakeholderEntity);

    return this.stakeholderRepository.save(stakeholderEntity);
  }

  findAll() {
    return `This action returns all stakeholder`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stakeholder`;
  }

  findByChave(chave: string) {
    return this.stakeholderRepository.findOne({ where: { chave } });
  }

  update(id: number, updateStakeholderDto: UpdateStakeholderDto) {
    return `This action updates a #${id} stakeholder`;
  }

  remove(id: number) {
    return `This action removes a #${id} stakeholder`;
  }
}
