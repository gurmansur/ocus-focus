import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { createPaginatedResponse } from '../../../common/utils/pagination.util';
import { Colaborador } from '../../colaborador/entities/colaborador.entity';
import { Projeto } from '../entities/projeto.entity';
import { ColaboradorProjeto } from '../../colaborador-projeto/entities/colaborador-projeto.entity';

/**
 * Repositório para a entidade Projeto
 * Implementa operações específicas para gerenciamento de projetos
 */
@Injectable()
export class ProjetoRepository extends BaseRepository<Projeto> {
  constructor(
    @InjectRepository(Projeto)
    private readonly projetoRepo: Repository<Projeto>,
  ) {
    super(projetoRepo);
  }

  /**
   * Busca projetos por nome com paginação
   * @param nome Nome a ser pesquisado
   * @param colaboradorId ID do colaborador para filtrar projetos
   * @param paginated Se deve retornar resultados paginados
   * @param page Página atual
   * @param pageSize Tamanho da página
   * @returns Projetos encontrados, paginados ou não
   */
  async findByNomePaginated(
    nome: string,
    colaboradorId: number,
    paginated: boolean = false,
    page: number = 0,
    pageSize: number = 10,
  ) {
    const queryBuilder = this.projetoRepo
      .createQueryBuilder('projeto')
      .innerJoin('projeto.colaboradores', 'colaborador')
      .where('colaborador.id = :colaboradorId', { colaboradorId });

    if (nome) {
      queryBuilder.andWhere('LOWER(projeto.nome) LIKE LOWER(:nome)', {
        nome: `%${nome}%`,
      });
    }

    if (paginated) {
      const [items, count] = await queryBuilder
        .skip(page * pageSize)
        .take(pageSize)
        .getManyAndCount();

      return {
        items,
        meta: {
          totalItems: count,
          itemCount: items.length,
          itemsPerPage: pageSize,
          totalPages: Math.ceil(count / pageSize),
          currentPage: page,
        },
      };
    }

    return await queryBuilder.getMany();
  }

  /**
   * Busca projetos por ID do colaborador
   * @param colaboradorId ID do colaborador
   * @returns Lista de projetos associados ao colaborador
   */
  async findByColaboradorId(colaboradorId: number): Promise<Projeto[]> {
    return await this.projetoRepo.find({
      where: {
        colaboradores: { id: colaboradorId },
      },
      relations: ['colaboradores'],
    });
  }

  /**
   * Adiciona um colaborador a um projeto
   * @param projetoId ID do projeto
   * @param colaborador Colaborador a ser adicionado
   * @returns O projeto atualizado
   */
  async addColaborador(
    projetoId: number,
    colaborador: Colaborador,
  ): Promise<Projeto> {
    const projeto = await this.projetoRepo.findOne({
      where: { id: projetoId },
      relations: ['colaboradores'],
    });

    if (!projeto) {
      return null;
    }

    if (!projeto.colaboradores) {
      projeto.colaboradores = [];
    }

    // Create a ColaboradorProjeto instance
    const colaboradorProjeto = new ColaboradorProjeto();
    colaboradorProjeto.colaborador = colaborador;
    colaboradorProjeto.projeto = projeto;
    colaboradorProjeto.ativo = true;
    colaboradorProjeto.administrador = false;
    
    // Add to the project's collaborators
    projeto.colaboradores.push(colaboradorProjeto);
    return await this.projetoRepo.save(projeto);
  }

  /**
   * Remove um colaborador de um projeto
   * @param projetoId ID do projeto
   * @param colaboradorId ID do colaborador a ser removido
   * @returns O projeto atualizado
   */
  async removeColaborador(
    projetoId: number,
    colaboradorId: number,
  ): Promise<Projeto> {
    const projeto = await this.projetoRepo.findOne({
      where: { id: projetoId },
      relations: ['colaboradores'],
    });

    if (!projeto) {
      return null;
    }

    projeto.colaboradores = projeto.colaboradores.filter(
      (c) => c.id !== colaboradorId,
    );

    return await this.projetoRepo.save(projeto);
  }

  /**
   * Conta projetos por status para um colaborador
   * @param colaboradorId ID do colaborador
   * @param status Status do projeto a ser contado
   * @returns Número de projetos com o status especificado
   */
  async countByStatusForColaborador(
    colaboradorId: number,
    status: string,
  ): Promise<number> {
    return await this.projetoRepo
      .createQueryBuilder('projeto')
      .innerJoin('projeto.colaboradores', 'colaborador')
      .where('colaborador.id = :colaboradorId', { colaboradorId })
      .andWhere('projeto.status = :status', { status })
      .getCount();
  }
}
