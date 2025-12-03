import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ColaboradorAtual } from '../../decorators/colaborador-atual.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { ColaboradorDto } from '../colaborador/dto/colaborador.dto';
import { CreateProjetoDto } from './dto/create-projeto.dto';
import { UpdateProjetoDto } from './dto/update-projeto.dto';
import { ProjetoService } from './projeto.service';

/**
 * Controlador responsável por gerenciar as operações relacionadas aos projetos
 * Este controlador contém endpoints para criação, atualização, exclusão e consulta de projetos,
 * bem como para o gerenciamento de colaboradores associados aos projetos.
 */
@UseGuards(AuthGuard)
@ApiTags('Projeto')
@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description:
    'Não autorizado - O token de autenticação não foi fornecido ou é inválido',
})
@Controller('projetos')
export class ProjetoController {
  constructor(private readonly projetoService: ProjetoService) {}

  /*
   * =================================================
   * ENDPOINTS DE OPERAÇÕES BÁSICAS DE PROJETOS
   * =================================================
   */

  /**
   * Lista todos os projetos cadastrados no sistema
   * @returns Lista de todos os projetos
   */
  @Get()
  @ApiOperation({
    summary: 'Lista todos os projetos',
    description:
      'Retorna uma lista completa de todos os projetos cadastrados no sistema',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de projetos recuperada com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autenticado',
  })
  findAll() {
    return this.projetoService.findAll();
  }

  /**
   * Cria um novo projeto no sistema
   * @param createProjetoDto Dados do projeto a ser criado
   * @param user ID do usuário que está criando o projeto
   * @returns O projeto criado com seu ID gerado
   */
  @Post('new')
  @ApiOperation({
    summary: 'Cria um novo projeto',
    description:
      'Cria um novo projeto associado ao usuário especificado. O usuário se torna o proprietário do projeto.',
  })
  @ApiBody({
    type: CreateProjetoDto,
    description: 'Dados necessários para a criação de um projeto',
  })
  @ApiQuery({
    name: 'user',
    required: true,
    type: Number,
    description: 'ID do usuário que está criando o projeto',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Projeto criado com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Dados inválidos fornecidos. Verifique os seguintes pontos: \n' +
      '- Não envie o campo "admin" no payload \n' +
      '- Campos dataInicio e previsaoFim devem estar no formato ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ) \n' +
      '- O campo status deve ser um dos valores: EM ANDAMENTO, FINALIZADO, CANCELADO',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autenticado',
  })
  create(
    @Body() createProjetoDto: CreateProjetoDto,
    @Query('user') user: number,
  ) {
    return this.projetoService.create(createProjetoDto, user);
  }

  /**
   * Atualiza os dados de um projeto existente
   * @param id ID do projeto a ser atualizado
   * @param updateProjetoDto Dados atualizados do projeto
   * @returns Projeto atualizado
   */
  @Patch('update')
  @ApiOperation({
    summary: 'Atualiza um projeto existente',
    description:
      'Atualiza os dados de um projeto existente com base no ID fornecido e nos dados de atualização',
  })
  @ApiQuery({
    name: 'projeto',
    required: true,
    type: Number,
    description: 'ID do projeto a ser atualizado',
  })
  @ApiBody({
    type: UpdateProjetoDto,
    description: 'Dados para atualização do projeto',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Projeto atualizado com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Projeto não encontrado',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos fornecidos',
  })
  update(
    @Query('projeto') id: number,
    @Body() updateProjetoDto: UpdateProjetoDto,
  ) {
    return this.projetoService.update(id, updateProjetoDto);
  }

  /**
   * Remove um projeto do sistema
   * @param id ID do projeto a ser removido
   * @returns Confirmação de remoção
   */
  @Delete('delete')
  @ApiOperation({
    summary: 'Remove um projeto',
    description:
      'Remove permanentemente um projeto do sistema com base no ID fornecido',
  })
  @ApiQuery({
    name: 'projeto',
    required: true,
    type: Number,
    description: 'ID do projeto a ser removido',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Projeto removido com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Projeto não encontrado',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Usuário não tem permissão para remover este projeto',
  })
  remove(@Query('projeto') id: number) {
    return this.projetoService.remove(id);
  }

  /*
   * =================================================
   * ENDPOINTS DE BUSCA DE PROJETOS
   * =================================================
   */

  /**
   * Busca projetos pelo nome, com paginação
   * @param nome Nome ou parte do nome do projeto a ser buscado
   * @param colaboradorId ID do colaborador associado aos projetos
   * @param page Número da página para paginação
   * @param pageSize Quantidade de itens por página
   * @returns Lista paginada de projetos que correspondem ao nome buscado
   */
  @Get('findByNome')
  @ApiOperation({
    summary: 'Busca projetos por nome',
    description:
      'Retorna uma lista paginada de projetos que correspondem ao nome ou parte do nome fornecido, filtrando por colaborador',
  })
  @ApiQuery({
    name: 'nome',
    required: true,
    type: String,
    description: 'Nome ou parte do nome do projeto a ser buscado',
  })
  @ApiQuery({
    name: 'user',
    required: true,
    type: Number,
    description: 'ID do colaborador para filtrar os projetos',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número da página para paginação (começa em 1)',
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description: 'Quantidade de itens por página',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de projetos recuperada com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Parâmetros de paginação inválidos',
  })
  findByNome(
    @Query('nome') nome: string,
    @Query('user') colaboradorId: number,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.projetoService.findByNome(nome, page, pageSize, colaboradorId);
  }

  /**
   * Busca um projeto específico pelo ID, com paginação de dados relacionados
   * @param id ID do projeto a ser buscado
   * @param colaboradorId ID do colaborador para verificar permissões
   * @param page Número da página para paginação
   * @param pageSize Quantidade de itens por página
   * @returns Dados do projeto com informações relacionadas paginadas
   */
  @Get('findById')
  @ApiOperation({
    summary: 'Busca projeto por ID',
    description:
      'Retorna os detalhes de um projeto específico com base no ID fornecido, incluindo dados relacionados paginados',
  })
  @ApiQuery({
    name: 'projeto',
    required: true,
    type: Number,
    description: 'ID do projeto a ser buscado',
  })
  @ApiQuery({
    name: 'colaborador',
    required: true,
    type: Number,
    description: 'ID do colaborador para verificar permissões',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número da página para paginação (começa em 1)',
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description: 'Quantidade de itens por página',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Projeto encontrado com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Projeto não encontrado',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Colaborador não tem permissão para visualizar este projeto',
  })
  findById(
    @Query('projeto') id: number,
    @Query('colaborador') colaboradorId: number,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.projetoService.findById(
      id,
      colaboradorId,
      !!pageSize,
      page,
      pageSize,
    );
  }

  /**
   * Busca projetos associados a um stakeholder específico
   * @param stakeholderId ID do stakeholder
   * @returns Lista de projetos associados ao stakeholder
   */
  @Get('findByIdStakeholder')
  @ApiOperation({
    summary: 'Busca projetos por ID do stakeholder',
    description:
      'Retorna a lista de projetos associados a um stakeholder específico',
  })
  @ApiQuery({
    name: 'stakeholder',
    required: true,
    type: Number,
    description: 'ID do stakeholder para filtrar os projetos',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de projetos recuperada com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Stakeholder não encontrado',
  })
  findByIdStakeholder(@Query('stakeholder') stakeholderId: number) {
    return this.projetoService.findByStakeholderId(stakeholderId);
  }

  /**
   * Lista os projetos recentes do usuário
   * @param user ID do usuário
   * @param limit Limite de projetos a serem retornados
   * @returns Lista de projetos recentes do usuário
   */
  @Get('recentes')
  @ApiOperation({
    summary: 'Lista projetos recentes do usuário',
    description:
      'Retorna uma lista dos projetos mais recentes associados ao usuário, limitada pelo parâmetro informado',
  })
  @ApiQuery({
    name: 'user',
    required: true,
    type: Number,
    description: 'ID do usuário para obter os projetos recentes',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Número máximo de projetos a serem retornados',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de projetos recentes recuperada com sucesso',
  })
  findRecentes(@Query('user') user: number, @Query('limit') limit?: number) {
    return this.projetoService.findRecentes(user, limit);
  }

  /*
   * =================================================
   * ENDPOINTS DE MÉTRICAS
   * =================================================
   */

  /**
   * Retorna o total de projetos do usuário
   * @param user ID do usuário
   * @returns Total de projetos associados ao usuário
   */
  @Get('metrics/total')
  @ApiOperation({
    summary: 'Obtém o total de projetos do usuário',
    description:
      'Retorna o número total de projetos associados ao usuário especificado',
  })
  @ApiQuery({
    name: 'user',
    required: true,
    type: Number,
    description: 'ID do usuário para obter as métricas',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Total de projetos recuperado com sucesso',
  })
  findTotal(@Query('user') user: number) {
    return this.projetoService.findTotal(user);
  }

  /**
   * Retorna o total de projetos em andamento do usuário
   * @param user ID do usuário
   * @returns Total de projetos em andamento
   */
  @Get('metrics/ongoing')
  @ApiOperation({
    summary: 'Obtém o total de projetos em andamento',
    description:
      'Retorna o número de projetos que estão atualmente em andamento para o usuário especificado',
  })
  @ApiQuery({
    name: 'user',
    required: true,
    type: Number,
    description: 'ID do usuário para obter as métricas',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Total de projetos em andamento recuperado com sucesso',
  })
  findOngoingCount(@Query('user') user: number) {
    return this.projetoService.findOngoingCount(user);
  }

  /**
   * Retorna o total de projetos finalizados do usuário
   * @param user ID do usuário
   * @returns Total de projetos finalizados
   */
  @Get('metrics/finished')
  @ApiOperation({
    summary: 'Obtém o total de projetos finalizados',
    description:
      'Retorna o número de projetos que foram finalizados para o usuário especificado',
  })
  @ApiQuery({
    name: 'user',
    required: true,
    type: Number,
    description: 'ID do usuário para obter as métricas',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Total de projetos finalizados recuperado com sucesso',
  })
  findFinishedCount(@Query('user') user: number) {
    return this.projetoService.findFinishedCount(user);
  }

  /**
   * Retorna o total de projetos novos do usuário
   * @param user ID do usuário
   * @returns Total de projetos novos
   */
  @Get('metrics/new')
  @ApiOperation({
    summary: 'Obtém o total de projetos novos',
    description:
      'Retorna o número de projetos que foram recentemente criados para o usuário especificado',
  })
  @ApiQuery({
    name: 'user',
    required: true,
    type: Number,
    description: 'ID do usuário para obter as métricas',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Total de projetos novos recuperado com sucesso',
  })
  findNewCount(@Query('user') user: number) {
    return this.projetoService.findNewCount(user);
  }

  /*
   * =================================================
   * ENDPOINTS DE GESTÃO DE COLABORADORES DO PROJETO
   * =================================================
   */

  /**
   * Lista os colaboradores associados a um projeto
   * @param projetoId ID do projeto
   * @param page Número da página para paginação
   * @param pageSize Quantidade de itens por página
   * @returns Lista paginada de colaboradores do projeto
   */
  @Get('colaboradores')
  @ApiOperation({
    summary: 'Lista colaboradores de um projeto',
    description:
      'Retorna uma lista paginada de colaboradores associados ao projeto especificado',
  })
  @ApiQuery({
    name: 'projeto',
    required: true,
    type: Number,
    description: 'ID do projeto para listar os colaboradores',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número da página para paginação (começa em 1)',
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description: 'Quantidade de itens por página',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de colaboradores recuperada com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Projeto não encontrado',
  })
  findColaboradores(
    @Query('projeto') projetoId: number,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.projetoService.findColaboradores(projetoId, page, pageSize);
  }

  /**
   * Busca colaboradores de um projeto por nome
   * @param projetoId ID do projeto
   * @param nome Nome ou parte do nome do colaborador a ser buscado
   * @param page Número da página para paginação
   * @param pageSize Quantidade de itens por página
   * @returns Lista paginada de colaboradores que correspondem ao nome buscado
   */
  @Get('colaboradores/findByNome')
  @ApiOperation({
    summary: 'Busca colaboradores de um projeto por nome',
    description:
      'Retorna uma lista paginada de colaboradores do projeto que correspondem ao nome ou parte do nome fornecido',
  })
  @ApiQuery({
    name: 'projeto',
    required: true,
    type: Number,
    description: 'ID do projeto para buscar os colaboradores',
  })
  @ApiQuery({
    name: 'nome',
    required: true,
    type: String,
    description: 'Nome ou parte do nome do colaborador a ser buscado',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número da página para paginação (começa em 1)',
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description: 'Quantidade de itens por página',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de colaboradores recuperada com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Projeto não encontrado',
  })
  findColaboradoresByNome(
    @Query('projeto') projetoId: number,
    @Query('nome') nome: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.projetoService.findColaboradoresByNome(
      projetoId,
      nome,
      page,
      pageSize,
    );
  }

  /**
   * Adiciona um colaborador a um projeto existente
   * @param projetoId ID do projeto
   * @param colaboradorId ID do colaborador a ser adicionado
   * @returns Confirmação da adição do colaborador
   */
  @Post('addColaborador')
  @ApiOperation({
    summary: 'Adiciona um colaborador ao projeto',
    description: 'Associa um colaborador existente a um projeto específico',
  })
  @ApiQuery({
    name: 'projeto',
    required: true,
    type: Number,
    description: 'ID do projeto ao qual o colaborador será adicionado',
  })
  @ApiQuery({
    name: 'colaborador',
    required: true,
    type: Number,
    description: 'ID do colaborador a ser adicionado ao projeto',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Colaborador adicionado com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Projeto ou colaborador não encontrado',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Colaborador já está associado ao projeto',
  })
  addColaborador(
    @Query('projeto') projetoId: number,
    @Query('colaborador') colaboradorId: number,
  ) {
    return this.projetoService.addColaborador(projetoId, colaboradorId);
  }

  /**
   * Remove um colaborador de um projeto
   * @param projetoId ID do projeto
   * @param colaboradorId ID do colaborador a ser removido
   * @param user Dados do colaborador autenticado que está realizando a operação
   * @returns Confirmação da remoção do colaborador
   */
  @Delete('removeColaborador')
  @ApiOperation({
    summary: 'Remove um colaborador do projeto',
    description:
      'Remove a associação de um colaborador a um projeto específico. O usuário deve ter permissão adequada para realizar esta operação.',
  })
  @ApiQuery({
    name: 'projeto',
    required: true,
    type: Number,
    description: 'ID do projeto do qual o colaborador será removido',
  })
  @ApiQuery({
    name: 'colaborador',
    required: true,
    type: Number,
    description: 'ID do colaborador a ser removido do projeto',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Colaborador removido com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Projeto ou colaborador não encontrado',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description:
      'Usuário não tem permissão para remover colaboradores deste projeto',
  })
  removeColaborador(
    @Query('projeto') projetoId: number,
    @Query('colaborador') colaboradorId: number,
    @ColaboradorAtual() user: ColaboradorDto,
  ) {
    return this.projetoService.removeColaborador(
      projetoId,
      colaboradorId,
      user,
    );
  }
}
