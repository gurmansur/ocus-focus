import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../usuario/entities/usuario.entity';
import { CreateColaboradorDto } from './dto/create-colaborador.dto';
import { UpdateColaboradorDto } from './dto/update-colaborador.dto';
import { Colaborador } from './entities/colaborador.entity';
import { ColaboradorRepository } from './repositories/colaborador.repository';

/**
 * Serviço para gerenciamento de colaboradores
 * Implementa operações de negócio relacionadas a colaboradores
 */
@Injectable()
export class ColaboradorService {
  constructor(
    @InjectRepository(Colaborador)
    private colaboradorRepository: Repository<Colaborador>,
    private readonly colaboradorRepositoryImpl: ColaboradorRepository,
  ) {}

  /**
   * Cria um novo colaborador
   * @param createColaboradorDto Dados do colaborador a ser criado
   * @param usuario Usuário associado (opcional)
   * @returns O colaborador criado
   */
  create(createColaboradorDto: CreateColaboradorDto, usuario?: Usuario) {
    return this.colaboradorRepositoryImpl.createWithUsuario(
      createColaboradorDto,
      usuario,
    );
  }

  /**
   * Busca todos os colaboradores de um projeto
   * @param projetoId ID do projeto
   * @param page Número da página (opcional)
   * @param pageSize Tamanho da página (opcional)
   * @returns Lista de colaboradores do projeto
   */
  async findAllFromProject(
    projetoId: number,
    page?: number,
    pageSize?: number,
  ) {
    if (page !== undefined && pageSize !== undefined) {
      return await this.colaboradorRepositoryImpl.findByProjetoPaginated(
        projetoId,
        page,
        pageSize,
      );
    }
    return await this.colaboradorRepositoryImpl.findByProjeto(projetoId);
  }

  /**
   * Busca todos os colaboradores com filtros opcionais
   * @param name Nome para filtrar (opcional)
   * @param projetoId ID do projeto para filtrar (opcional)
   * @param page Número da página (opcional)
   * @param pageSize Tamanho da página (opcional)
   * @returns Lista de colaboradores filtrados
   */
  async findAll(
    name?: string,
    projetoId?: number,
    page?: number,
    pageSize?: number,
  ) {
    return await this.colaboradorRepositoryImpl.findAllFilteredPaginated(
      name,
      projetoId,
      page,
      pageSize,
    );
  }

  /**
   * Busca um colaborador pelo email
   * @param email Email do colaborador
   * @returns O colaborador encontrado ou null
   */
  findByEmail(email: string) {
    return this.colaboradorRepositoryImpl.findByEmail(email);
  }

  /**
   * Busca um colaborador pelo ID
   * @param id ID do colaborador
   * @returns O colaborador encontrado ou null
   * @throws NotFoundException se o colaborador não for encontrado
   */
  async findOne(id: number) {
    const colaborador = await this.colaboradorRepositoryImpl.findById(id);
    if (!colaborador) {
      throw new NotFoundException(`Colaborador com ID ${id} não encontrado`);
    }
    return colaborador;
  }

  /**
   * Atualiza um colaborador
   * @param id ID do colaborador
   * @param updateColaboradorDto Dados a serem atualizados
   * @returns O colaborador atualizado
   * @throws NotFoundException se o colaborador não for encontrado
   */
  async update(id: number, updateColaboradorDto: UpdateColaboradorDto) {
    const colaborador = await this.findOne(id);
    if (!colaborador) {
      throw new NotFoundException(`Colaborador com ID ${id} não encontrado`);
    }
    return this.colaboradorRepositoryImpl.update(id, updateColaboradorDto);
  }

  /**
   * Remove um colaborador
   * @param id ID do colaborador
   * @returns Mensagem de confirmação
   * @throws NotFoundException se o colaborador não for encontrado
   */
  async remove(id: number) {
    const colaborador = await this.findOne(id);
    if (!colaborador) {
      throw new NotFoundException(`Colaborador com ID ${id} não encontrado`);
    }
    await this.colaboradorRepositoryImpl.remove(id);
    return { message: `Colaborador com ID ${id} removido com sucesso` };
  }
}
