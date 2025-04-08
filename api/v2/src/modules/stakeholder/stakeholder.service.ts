import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { Like, Repository } from 'typeorm';
import { ProjetoService } from '../projeto/projeto.service';
import { StatusPriorizacaoService } from '../status-priorizacao/status-priorizacao.service';
import { UsuarioService } from '../usuario/usuario.service';
import { CreateStakeholderDto } from './dto/create-stakeholder.dto';
import { Stakeholder } from './entities/stakeholder.entity';
import { StakeholderBuilder } from './stakeholder.builder';
import { hash } from 'bcrypt';

@Injectable()
export class StakeholderService {
  constructor(
    @InjectRepository(Stakeholder)
    private readonly stakeholderRepository: Repository<Stakeholder>,
    @Inject() private readonly usuarioService: UsuarioService,
    @Inject(forwardRef(() => ProjetoService))
    private readonly projetoService: ProjetoService,
    @Inject(forwardRef(() => StatusPriorizacaoService))
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

    const hashedPassword = await hash(createStakeholderDto.senha, 10);

    const usuario = await this.usuarioService.create({
      nome: createStakeholderDto.nome,
      email: createStakeholderDto.email,
      senha: hashedPassword,
      perfil: 'cliente',
    });

    const projeto = await this.projetoService.findOne(
      createStakeholderDto.projeto_id,
    );

    if (!projeto) {
      throw new Error('Projeto não encontrado');
    }

    const stakeholderEntity = StakeholderBuilder.buildStakeholderEntityFromDto(
      createStakeholderDto,
      chave,
      usuario as any,
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

  async updateStakeholder(id: number, updateStakeholderDto: any) {
    return this.stakeholderRepository.update(id, updateStakeholderDto);
  }
}
