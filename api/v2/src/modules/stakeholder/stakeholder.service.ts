import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { randomBytes } from 'crypto';
import { Like, Repository } from 'typeorm';
import { ILogger } from '../../common/interfaces/logger.interface';
import { ProjetoService } from '../projeto/projeto.service';
import { StatusPriorizacaoService } from '../status-priorizacao/status-priorizacao.service';
import { UsuarioService } from '../usuario/usuario.service';
import { CreateStakeholderDto } from './dto/create-stakeholder.dto';
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
    @Inject('ILogger') private logger: ILogger,
  ) {}

  async create(createStakeholderDto: CreateStakeholderDto) {
    this.logger.log('Creating new stakeholder');
    const chave = randomBytes(20).toString('hex');

    const usuarioPorChave = await this.stakeholderRepository.findOne({
      where: { chave },
    });

    if (usuarioPorChave) {
      this.logger.warn('Failed to create stakeholder - key already exists');
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
    return this.stakeholderRepository.findOne({ where: { id } });
  }

  findByChave(chave: string) {
    return this.stakeholderRepository.findOne({ where: { chave } });
  }

  updateAlert(id: number) {
    return this.statusPriorizacaoService.update(id);
  }

  async remove(id: number) {
    await this.statusPriorizacaoService.deleteByStakeholder(id);

    return this.stakeholderRepository.delete(id);
  }

  async findByProjeto(projetoId: number, page: number, pageSize: number) {
    const take = pageSize ? pageSize : 5;
    const skip = page ? page * take : 0;
    const [items, count] = await this.stakeholderRepository.findAndCount({
      relations: ['statusPriorizacao', 'statusPriorizacao.stakeholder'],
      where: { projeto: { id: projetoId } },
      take,
      skip,
    });

    return {
      items: items.map((item) => {
        const status = item.statusPriorizacao.find(
          (status) => status?.stakeholder?.id === item.id,
        );

        return {
          id: item.id,
          nome: item.nome,
          email: item.email,
          cargo: item.cargo,
          chave: item.chave,
          alertaEmitido: status?.alertaEmitido ? 'Sim' : 'Não',
          participacaoRealizada: status?.participacaoRealizada ? 'Sim' : 'Não',
        };
      }),
      page: {
        size: take,
        number: page,
        totalElements: count,
        totalPages: Math.ceil(count / take),
      },
    };
  }

  async findByNome(
    nome: string,
    projetoId: number,
    page: number,
    pageSize: number,
  ) {
    const take = pageSize ? pageSize : 5;
    const skip = page ? page * take : 0;
    const [items, count] = await this.stakeholderRepository.findAndCount({
      relations: ['statusPriorizacao', 'statusPriorizacao.stakeholder'],
      where: { projeto: { id: projetoId }, nome: Like(`%${nome}%`) },
      take,
      skip,
    });

    return {
      items: items.map((item) => {
        return {
          id: item.id,
          nome: item.nome,
          email: item.email,
          cargo: item.cargo,
          chave: item.chave,
          alertaEmitido: item.statusPriorizacao[0].alertaEmitido
            ? 'Sim'
            : 'Não',
          participacaoRealizada: item.statusPriorizacao[0].participacaoRealizada
            ? 'Sim'
            : 'Não',
        };
      }),
      page: {
        size: take,
        number: page,
        totalElements: count,
        totalPages: Math.ceil(count / take),
      },
    };
  }

  async verifyParticipation(projetoId: number) {
    const notParticipated =
      await this.statusPriorizacaoService.verifyParticipation(projetoId);

    if (notParticipated.length > 0) {
      throw new BadRequestException(
        'Nem todos os stakeholders participaram da priorização.',
      );
    }

    return { message: 'Todos os stakeholders participaram da priorização.' };
  }
}
