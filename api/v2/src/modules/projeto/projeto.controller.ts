import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpStatus,
  Logger,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiDocs, ColaboradorAtual, Roles } from '../../decorators';
import { AuthGuard, RolesGuard } from '../../guards';
import {
  LoggingInterceptor,
  TimeoutInterceptor,
  TransformInterceptor,
} from '../../interceptors';
import { SanitizePipe } from '../../pipes';
import { ColaboradorDto } from '../colaborador/dto/colaborador.dto';
import { CreateProjetoDto } from './dto/create-projeto.dto';
import { UpdateProjetoDto } from './dto/update-projeto.dto';
import { ProjetoService } from './projeto.service';

/**
 * Controller responsável por gerenciar operações relacionadas a projetos
 */
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, TransformInterceptor, TimeoutInterceptor)
@ApiTags('Projeto')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Não autorizado' })
@Controller('projetos')
export class ProjetoController {
  private readonly logger = new Logger(ProjetoController.name);

  constructor(private readonly projetoService: ProjetoService) {}

  /**
   * Registra uma operação no log
   * @param operation Nome da operação
   * @param details Detalhes da operação
   */
  private logOperation(operation: string, details?: any): void {
    this.logger.log(
      `Operação: ${operation}${details ? ` - ${JSON.stringify(details)}` : ''}`,
    );
  }

  /**
   * Cria um novo projeto
   * @param createProjetoDto Dados do projeto a ser criado
   * @param user ID do usuário que está criando o projeto
   * @returns Projeto criado
   */
  @Post('new')
  @ApiDocs({
    summary: 'Criar um novo projeto',
    status: HttpStatus.CREATED,
    responseDescription: 'Projeto criado com sucesso',
  })
  create(
    @Body(SanitizePipe) createProjetoDto: CreateProjetoDto,
    @Query('user', ParseIntPipe) user: number,
  ) {
    this.logOperation('create', { dto: createProjetoDto, userId: user });
    return this.projetoService.create(createProjetoDto, user);
  }

  /**
   * Lista todos os projetos
   * @returns Lista de todos os projetos
   */
  @Get()
  @ApiDocs({
    summary: 'Listar todos os projetos',
    responseDescription: 'Lista de projetos recuperada com sucesso',
  })
  findAll() {
    this.logOperation('findAll');
    return this.projetoService.findAll();
  }

  /**
   * Busca projetos por nome
   * @param nome Nome a ser buscado
   * @param colaboradorId ID do colaborador
   * @param page Número da página
   * @param pageSize Tamanho da página
   * @returns Projetos encontrados
   */
  @Get('findByNome')
  @ApiDocs({
    summary: 'Buscar projetos por nome',
    responseDescription: 'Projetos encontrados com sucesso',
  })
  findByNome(
    @Query('nome', SanitizePipe) nome: string,
    @Query('user', ParseIntPipe) colaboradorId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
  ) {
    this.logOperation('findByNome', { nome, colaboradorId, page, pageSize });
    return this.projetoService.findByNome(
      nome,
      colaboradorId,
      !!pageSize,
      page,
      pageSize,
    );
  }

  /**
   * Busca projeto por ID
   * @param id ID do projeto
   * @param colaboradorId ID do colaborador
   * @param page Número da página
   * @param pageSize Tamanho da página
   * @returns Projeto encontrado
   */
  @Get('findById')
  @ApiDocs({
    summary: 'Buscar projeto por ID',
    responseDescription: 'Projeto encontrado com sucesso',
  })
  findById(
    @Query('projeto', ParseIntPipe) id: number,
    @Query('colaborador', ParseIntPipe) colaboradorId: number,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    this.logOperation('findById', { id, colaboradorId, page, pageSize });
    return this.projetoService.findById(
      id,
      colaboradorId,
      !!pageSize,
      page,
      pageSize,
    );
  }

  @Get('findByIdStakeholder')
  @ApiDocs({
    summary: 'Buscar projetos por ID do stakeholder',
    responseDescription: 'Projetos encontrados com sucesso',
  })
  findByIdStakeholder(
    @Query('stakeholder', ParseIntPipe) stakeholderId: number,
  ) {
    return this.projetoService.findByStakeholderId(stakeholderId);
  }

  @Get('metrics/total')
  @ApiDocs({
    summary: 'Obter o total de projetos de um usuário',
    responseDescription: 'Total de projetos obtido com sucesso',
  })
  findTotal(@Query('user', ParseIntPipe) user: number) {
    return this.projetoService.findTotal(user);
  }

  @Get('metrics/ongoing')
  @ApiDocs({
    summary: 'Obter a quantidade de projetos em andamento',
    responseDescription:
      'Quantidade de projetos em andamento obtida com sucesso',
  })
  findOngoingCount(@Query('user', ParseIntPipe) user: number) {
    return this.projetoService.findOngoingCount(user);
  }

  @Get('metrics/finished')
  @ApiDocs({
    summary: 'Obter a quantidade de projetos finalizados',
    responseDescription:
      'Quantidade de projetos finalizados obtida com sucesso',
  })
  findFinishedCount(@Query('user', ParseIntPipe) user: number) {
    return this.projetoService.findFinishedCount(user);
  }

  @Get('metrics/new')
  @ApiDocs({
    summary: 'Obter a quantidade de projetos novos',
    responseDescription: 'Quantidade de projetos novos obtida com sucesso',
  })
  findNewCount(@Query('user', ParseIntPipe) user: number) {
    return this.projetoService.findNewCount(user);
  }

  @Get('recentes')
  @ApiDocs({
    summary: 'Obter projetos recentes de um usuário',
    responseDescription: 'Projetos recentes obtidos com sucesso',
  })
  findRecentes(
    @Query('user', ParseIntPipe) user: number,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number,
  ) {
    return this.projetoService.findRecentes(user, limit);
  }

  /**
   * Atualiza um projeto existente
   * @param id ID do projeto
   * @param updateProjetoDto Dados para atualização
   * @returns Projeto atualizado
   */
  @Patch('update')
  @ApiDocs({
    summary: 'Atualizar um projeto',
    responseDescription: 'Projeto atualizado com sucesso',
  })
  @Roles('admin', 'gerente')
  update(
    @Query('projeto', ParseIntPipe) id: number,
    @Body(SanitizePipe) updateProjetoDto: UpdateProjetoDto,
  ) {
    this.logOperation('update', { id, dto: updateProjetoDto });
    return this.projetoService.update(id, updateProjetoDto);
  }

  /**
   * Remove um projeto
   * @param id ID do projeto
   * @returns Confirmação de remoção
   */
  @Delete('delete')
  @ApiDocs({
    summary: 'Remover um projeto',
    responseDescription: 'Projeto removido com sucesso',
    status: HttpStatus.NO_CONTENT,
  })
  @Roles('admin')
  remove(@Query('projeto', ParseIntPipe) id: number) {
    this.logOperation('remove', { id });
    return this.projetoService.remove(id);
  }

  @Get('colaboradores')
  @ApiDocs({
    summary: 'Listar colaboradores de um projeto',
    responseDescription: 'Lista de colaboradores recuperada com sucesso',
  })
  findColaboradores(
    @Query('projeto', ParseIntPipe) projetoId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
  ) {
    return this.projetoService.findColaboradores(projetoId, page, pageSize);
  }

  @Get('colaboradores/findByNome')
  @ApiDocs({
    summary: 'Buscar colaboradores de um projeto por nome',
    responseDescription: 'Colaboradores encontrados com sucesso',
  })
  findColaboradoresByNome(
    @Query('projeto', ParseIntPipe) projetoId: number,
    @Query('nome', SanitizePipe) nome: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
  ) {
    return this.projetoService.findColaboradoresByNome(
      projetoId,
      nome,
      page,
      pageSize,
    );
  }

  /**
   * Adiciona um colaborador a um projeto
   * @param projetoId ID do projeto
   * @param colaboradorId ID do colaborador
   * @returns Resultado da operação
   */
  @Post('colaborador/add')
  @ApiDocs({
    summary: 'Adicionar colaborador a um projeto',
    responseDescription: 'Colaborador adicionado com sucesso',
  })
  @Roles('admin', 'gerente')
  addColaborador(
    @Query('projeto', ParseIntPipe) projetoId: number,
    @Query('colaborador', ParseIntPipe) colaboradorId: number,
  ) {
    this.logOperation('addColaborador', { projetoId, colaboradorId });
    return this.projetoService.addColaborador(projetoId, colaboradorId);
  }

  /**
   * Remove um colaborador de um projeto
   * @param projetoId ID do projeto
   * @param colaboradorId ID do colaborador
   * @param user Colaborador atual
   * @returns Resultado da operação
   */
  @Delete('colaborador/remove')
  @ApiDocs({
    summary: 'Remover colaborador de um projeto',
    responseDescription: 'Colaborador removido com sucesso',
  })
  @Roles('admin', 'gerente')
  removeColaborador(
    @Query('projeto', ParseIntPipe) projetoId: number,
    @Query('colaborador', ParseIntPipe) colaboradorId: number,
    @ColaboradorAtual() user: ColaboradorDto,
  ) {
    this.logOperation('removeColaborador', {
      projetoId,
      colaboradorId,
      userId: user.id,
    });
    return this.projetoService.removeColaborador(
      projetoId,
      colaboradorId,
      user,
    );
  }
}
