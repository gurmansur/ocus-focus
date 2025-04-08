import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';

@Injectable()
export class UsuarioService {
  private readonly logger = new Logger(UsuarioService.name);
  private readonly defaultPageSize = 10;

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  /**
   * Cria um novo usuário
   * @param createUsuarioDto Dados para criar o usuário
   * @returns Usuário criado
   */
  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    try {
      const usuario = this.usuarioRepository.create(createUsuarioDto);
      return await this.usuarioRepository.save(usuario);
    } catch (error) {
      this.logger.error(`Erro ao criar usuário: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Busca todos os usuários com opção de paginação
   * @param paginated Indica se deve usar paginação
   * @param page Número da página 
   * @returns Array com usuários e contagem total
   */
  async findAll(paginated = false, page = 1): Promise<[Usuario[], number]> {
    try {
      if (paginated) {
        const take = this.defaultPageSize;
        // Evita página negativa
        const pageValue = page < 1 ? 1 : page;
        const skip = (pageValue - 1) * take;
        
        // Otimização: Executa query personalizada para melhor performance
        return await this.usuarioRepository.findAndCount({
          take,
          skip,
          // Seleciona apenas campos essenciais para a listagem
          select: ['id', 'dataCadastro'],
          // Ordena por data de cadastro para resultados consistentes
          order: { dataCadastro: 'DESC' },
        });
      }
      
      // Se não for paginado, busca todos com ordem consistente
      return await this.usuarioRepository.findAndCount({
        order: { dataCadastro: 'DESC' },
      });
    } catch (error) {
      this.logger.error(`Erro ao buscar usuários: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Busca um usuário pelo ID
   * @param id ID do usuário
   * @returns Usuário encontrado ou erro se não existir
   */
  async findOne(id: number): Promise<Usuario> {
    try {
      const usuario = await this.usuarioRepository.findOne({ where: { id } });
      
      if (!usuario) {
        throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
      }
      
      return usuario;
    } catch (error) {
      this.logger.error(`Erro ao buscar usuário ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Atualiza um usuário existente
   * @param id ID do usuário
   * @param updateUsuarioDto Dados para atualização
   * @returns Resultado da operação de atualização
   */
  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    try {
      const usuario = await this.findOne(id);
      
      // Cria novo objeto para evitar modificar a entidade gerenciada
      const usuarioAtualizado = { ...usuario, ...updateUsuarioDto };
      
      // Remove propriedades que não devem ser atualizadas manualmente
      delete usuarioAtualizado.id;
      delete usuarioAtualizado.dataCadastro;
      
      return await this.usuarioRepository.update(id, usuarioAtualizado);
    } catch (error) {
      this.logger.error(`Erro ao atualizar usuário ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Remove um usuário
   * @param id ID do usuário
   * @returns Usuário removido
   */
  async remove(id: number): Promise<Usuario> {
    try {
      const usuario = await this.findOne(id);
      return await this.usuarioRepository.remove(usuario);
    } catch (error) {
      this.logger.error(`Erro ao remover usuário ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
