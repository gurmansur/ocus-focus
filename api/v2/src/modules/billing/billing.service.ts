import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Projeto } from '../projeto/entities/projeto.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { CreateAssinaturaDto } from './dto/create-assinatura.dto';
import { CreatePlanoDto } from './dto/create-plano.dto';
import { UpdateAssinaturaDto } from './dto/update-assinatura.dto';
import { UpdatePlanoDto } from './dto/update-plano.dto';
import {
  Assinatura,
  StatusAssinatura,
  TipoPeriodo,
} from './entities/assinatura.entity';
import { Plano } from './entities/plano.entity';

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(Plano)
    private planoRepository: Repository<Plano>,
    @InjectRepository(Assinatura)
    private assinaturaRepository: Repository<Assinatura>,
  ) {}

  // ==================== PLANOS ====================

  async createPlano(createPlanoDto: CreatePlanoDto): Promise<Plano> {
    const plano = this.planoRepository.create(createPlanoDto);
    return this.planoRepository.save(plano);
  }

  async findAllPlanos(): Promise<Plano[]> {
    return this.planoRepository.find({
      where: { ativo: true },
      order: { precoMensal: 'ASC' },
    });
  }

  async findPlanoById(id: number): Promise<Plano> {
    const plano = await this.planoRepository.findOne({ where: { id } });
    if (!plano) {
      throw new NotFoundException(`Plano com ID ${id} não encontrado`);
    }
    return plano;
  }

  async updatePlano(
    id: number,
    updatePlanoDto: UpdatePlanoDto,
  ): Promise<Plano> {
    const plano = await this.findPlanoById(id);
    Object.assign(plano, updatePlanoDto);
    return this.planoRepository.save(plano);
  }

  async deletePlano(id: number): Promise<void> {
    const plano = await this.findPlanoById(id);
    plano.ativo = false;
    await this.planoRepository.save(plano);
  }

  // ==================== ASSINATURAS ====================

  async createAssinatura(
    createAssinaturaDto: CreateAssinaturaDto,
    usuario: Usuario,
  ): Promise<Assinatura> {
    if (!usuario || !usuario.id) {
      throw new BadRequestException('Usuário inválido');
    }
    const plano = await this.findPlanoById(createAssinaturaDto.planoId);

    // Verificar se já existe assinatura ativa para o usuário
    const assinaturaExistente = await this.assinaturaRepository.findOne({
      where: {
        usuario: { id: usuario.id },
        status: StatusAssinatura.ATIVA,
      },
    });

    if (assinaturaExistente) {
      throw new BadRequestException(
        'Usuário já possui uma assinatura ativa. Cancele a assinatura atual antes de criar uma nova.',
      );
    }

    const dataInicio = new Date();
    const proximoPagamento = this.calcularProximoPagamento(
      dataInicio,
      createAssinaturaDto.tipoPeriodo,
    );

    const valorAtual =
      createAssinaturaDto.tipoPeriodo === TipoPeriodo.MENSAL
        ? plano.precoMensal
        : plano.precoAnual;

    const assinatura = this.assinaturaRepository.create({
      usuario,
      plano,
      tipoPeriodo: createAssinaturaDto.tipoPeriodo,
      dataInicio,
      proximoPagamento,
      valorAtual,
      trial: createAssinaturaDto.trial || false,
      dataFimTrial: createAssinaturaDto.trial
        ? this.calcularDataFimTrial(dataInicio)
        : null,
      autoRenovacao: createAssinaturaDto.autoRenovacao ?? true,
      status: createAssinaturaDto.trial
        ? StatusAssinatura.TRIAL
        : StatusAssinatura.ATIVA,
    });

    if (createAssinaturaDto.projetoId) {
      assinatura.projeto = { id: createAssinaturaDto.projetoId } as Projeto;
    }

    return this.assinaturaRepository.save(assinatura);
  }

  async findAssinaturasByUsuario(usuario: Usuario): Promise<Assinatura[]> {
    return this.assinaturaRepository.find({
      where: { usuario: { id: usuario.id } },
      relations: ['plano', 'projeto'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAssinaturaAtiva(usuario: Usuario): Promise<Assinatura | null> {
    if (!usuario || !usuario.id) {
      return null;
    }
    return this.assinaturaRepository.findOne({
      where: {
        usuario: { id: usuario.id },
        status: StatusAssinatura.ATIVA,
      },
      relations: ['plano', 'projeto'],
    });
  }

  async findAssinaturaById(id: number): Promise<Assinatura> {
    const assinatura = await this.assinaturaRepository.findOne({
      where: { id },
      relations: ['plano', 'usuario', 'projeto', 'historicosPagamento'],
    });

    if (!assinatura) {
      throw new NotFoundException(`Assinatura com ID ${id} não encontrada`);
    }

    return assinatura;
  }

  async updateAssinatura(
    id: number,
    updateAssinaturaDto: UpdateAssinaturaDto,
  ): Promise<Assinatura> {
    const assinatura = await this.findAssinaturaById(id);

    // Se mudou o tipo de período, recalcular valor e próximo pagamento
    if (
      updateAssinaturaDto.tipoPeriodo &&
      updateAssinaturaDto.tipoPeriodo !== assinatura.tipoPeriodo
    ) {
      assinatura.valorAtual =
        updateAssinaturaDto.tipoPeriodo === TipoPeriodo.MENSAL
          ? assinatura.plano.precoMensal
          : assinatura.plano.precoAnual;

      assinatura.proximoPagamento = this.calcularProximoPagamento(
        new Date(),
        updateAssinaturaDto.tipoPeriodo,
      );
    }

    Object.assign(assinatura, updateAssinaturaDto);
    return this.assinaturaRepository.save(assinatura);
  }

  async cancelarAssinatura(id: number): Promise<Assinatura> {
    const assinatura = await this.findAssinaturaById(id);
    assinatura.status = StatusAssinatura.CANCELADA;
    assinatura.dataFim = new Date();
    assinatura.autoRenovacao = false;
    return this.assinaturaRepository.save(assinatura);
  }

  async reativarAssinatura(id: number): Promise<Assinatura> {
    const assinatura = await this.findAssinaturaById(id);

    if (assinatura.status !== StatusAssinatura.CANCELADA) {
      throw new BadRequestException(
        'Apenas assinaturas canceladas podem ser reativadas',
      );
    }

    assinatura.status = StatusAssinatura.ATIVA;
    assinatura.dataFim = null;
    assinatura.proximoPagamento = this.calcularProximoPagamento(
      new Date(),
      assinatura.tipoPeriodo,
    );
    assinatura.autoRenovacao = true;

    return this.assinaturaRepository.save(assinatura);
  }

  // ==================== HELPERS ====================

  private calcularProximoPagamento(
    dataInicio: Date,
    tipoPeriodo: TipoPeriodo,
  ): Date {
    const proximoPagamento = new Date(dataInicio);
    if (tipoPeriodo === TipoPeriodo.MENSAL) {
      proximoPagamento.setMonth(proximoPagamento.getMonth() + 1);
    } else {
      proximoPagamento.setFullYear(proximoPagamento.getFullYear() + 1);
    }
    return proximoPagamento;
  }

  private calcularDataFimTrial(dataInicio: Date): Date {
    const dataFimTrial = new Date(dataInicio);
    dataFimTrial.setDate(dataFimTrial.getDate() + 14); // 14 dias de trial
    return dataFimTrial;
  }

  async verificarLimitesAssinatura(usuario: Usuario): Promise<{
    limiteProjetos: number | null;
    limiteUsuarios: number | null;
    ferramentasDisponiveis: string[];
  }> {
    if (!usuario) {
      // Retorna limites do plano gratuito padrão se usuário não identificado
      return {
        limiteProjetos: 1,
        limiteUsuarios: 1,
        ferramentasDisponiveis: ['arcatest', 'prioreasy'],
      };
    }
    const assinatura = await this.findAssinaturaAtiva(usuario);

    if (!assinatura) {
      // Retorna limites do plano gratuito padrão
      return {
        limiteProjetos: 1,
        limiteUsuarios: 1,
        ferramentasDisponiveis: ['arcatest', 'prioreasy'],
      };
    }

    return {
      limiteProjetos: assinatura.plano.limiteProjetos,
      limiteUsuarios: assinatura.plano.limiteUsuarios,
      ferramentasDisponiveis: assinatura.plano.ferramentasDisponiveis,
    };
  }

  async createFreeSubscriptionForNewUser(
    usuario: Usuario,
  ): Promise<Assinatura> {
    if (!usuario || !usuario.id) {
      throw new BadRequestException('Usuário inválido');
    }

    // Check if user already has a subscription
    const assinaturaExistente = await this.assinaturaRepository.findOne({
      where: { usuario: { id: usuario.id } },
    });

    if (assinaturaExistente) {
      return assinaturaExistente;
    }

    // Find the starter plan
    const starterPlan = await this.planoRepository.findOne({
      where: { nome: 'Starter', ativo: true },
    });

    if (!starterPlan) {
      throw new NotFoundException(
        'Plano Starter não encontrado. Execute as migrations.',
      );
    }

    // Create free subscription
    const dataInicio = new Date();
    const assinatura = this.assinaturaRepository.create({
      usuario,
      plano: starterPlan,
      status: StatusAssinatura.ATIVA,
      tipoPeriodo: TipoPeriodo.MENSAL,
      dataInicio,
      proximoPagamento: dataInicio,
      valorAtual: 0,
      autoRenovacao: true,
      trial: true,
      dataFimTrial: new Date(dataInicio.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });

    return this.assinaturaRepository.save(assinatura);
  }
}
