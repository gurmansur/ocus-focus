import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../../decorators/api-paginated-response.decorator';
import { ProtectedRoute } from '../../decorators/protected-route.decorator';
import { Serialize } from '../../decorators/serialize.decorator';
import { ColaboradorService } from '../colaborador/colaborador.service';
import { ColaboradorDto } from '../colaborador/dto/colaborador.dto';
import { CreateColaboradorDto } from '../colaborador/dto/create-colaborador.dto';
import { UpdateColaboradorDto } from '../colaborador/dto/update-colaborador.dto';
import { CreateProjetoDto } from './dto/create-projeto.dto';
import { ProjetoDto } from './dto/projeto.dto';
import { UpdateProjetoDto } from './dto/update-projeto.dto';
import { ProjetoService } from './projeto.service';

@ApiTags('Projeto')
@ApiBearerAuth()
@Controller('projetos')
@Serialize()
export class ProjetoController {
  constructor(
    private readonly projetoService: ProjetoService,
    private readonly colaboradorService: ColaboradorService,
  ) {}

  /**
   * Cria um novo projeto
   * @param createProjetoDto Dados do projeto a ser criado
   * @returns O projeto criado
   */
  @Post()
  @ProtectedRoute('admin', 'gerente')
  @ApiOperation({
    summary: 'Criar novo projeto',
    description:
      'Cria um novo projeto no sistema com as informações fornecidas. Disponível apenas para administradores e gerentes.',
  })
  @ApiCreatedResponse({
    description: 'Projeto criado com sucesso',
    type: ProjetoDto,
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos fornecidos para a criação do projeto',
  })
  @ApiUnauthorizedResponse({
    description: 'Usuário não autenticado',
  })
  @ApiForbiddenResponse({
    description: 'Usuário não tem permissão para criar projeto',
  })
  @ApiQuery({
    name: 'user',
    description: 'ID do usuário criador do projeto',
    type: String,
    required: true,
    example: '1',
  })
  create(
    @Body() createProjetoDto: CreateProjetoDto,
    @Query('user') user: string,
  ) {
    return this.projetoService.create(createProjetoDto, parseInt(user));
  }

  /**
   * Lista todos os projetos com paginação
   * @param page Número da página
   * @param pageSize Tamanho da página
   * @returns Lista paginada de projetos
   */
  @Get()
  @ProtectedRoute()
  @ApiPaginatedResponse(ProjetoDto)
  @ApiOperation({
    summary: 'Listar projetos',
    description:
      'Retorna uma lista paginada de todos os projetos cadastrados no sistema',
  })
  @ApiOkResponse({
    description: 'Lista de projetos recuperada com sucesso',
  })
  @ApiUnauthorizedResponse({
    description: 'Usuário não autenticado',
  })
  @ApiQuery({
    name: 'page',
    description: 'Número da página a ser exibida (começa em 1)',
    type: Number,
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'pageSize',
    description: 'Quantidade de itens por página',
    type: Number,
    required: false,
    example: 10,
  })
  findAll(@Query('page') page?: string, @Query('pageSize') pageSize?: string) {
    return this.projetoService.findAll(
      page ? parseInt(page) : undefined,
      pageSize ? parseInt(pageSize) : undefined,
    );
  }

  /**
   * Retorna a contagem total de projetos
   * @returns Total de projetos
   */
  @Get('metrics/count')
  @ProtectedRoute('admin', 'gerente')
  @ApiOperation({
    summary: 'Contagem total de projetos',
    description: 'Retorna a contagem total de projetos cadastrados no sistema',
  })
  @ApiOkResponse({
    description: 'Contagem de projetos recuperada com sucesso',
    schema: {
      type: 'object',
      properties: {
        count: {
          type: 'number',
          example: 42,
          description: 'Número total de projetos',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Usuário não autenticado',
  })
  @ApiForbiddenResponse({
    description: 'Usuário não tem permissão para acessar métricas',
  })
  countProjects() {
    return this.projetoService.findTotal(0); // Using existing methods
  }

  /**
   * Retorna a contagem de projetos por status
   * @returns Contagem de projetos por status
   */
  @Get('metrics/status')
  @ProtectedRoute('admin', 'gerente')
  @ApiOperation({ description: 'Retorna a contagem de projetos por status' })
  countProjectsByStatus() {
    // Use existing method or implement as needed
    // Return structure expected by frontend
    return {
      ongoing: this.projetoService.findOngoingCount(0),
      finished: this.projetoService.findFinishedCount(0),
      new: this.projetoService.findNewCount(0),
    };
  }

  /**
   * Retorna a contagem de projetos por gerente
   * @returns Contagem de projetos por gerente
   */
  @Get('metrics/gerente')
  @ProtectedRoute('admin', 'gerente')
  @ApiOperation({ description: 'Retorna a contagem de projetos por gerente' })
  countProjectsByGerente() {
    // Return structure expected by frontend
    return this.projetoService.findRecentes(0, 10);
  }

  /**
   * Busca um projeto pelo ID
   * @param id ID do projeto
   * @returns O projeto encontrado
   */
  @Get(':id')
  @ProtectedRoute()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.projetoService.findOne(id);
  }

  /**
   * Atualiza um projeto
   * @param id ID do projeto
   * @param updateProjetoDto Dados a serem atualizados
   * @returns O projeto atualizado
   */
  @Patch(':id')
  @ProtectedRoute('admin', 'gerente')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjetoDto: UpdateProjetoDto,
  ) {
    return this.projetoService.update(id, updateProjetoDto);
  }

  /**
   * Remove um projeto
   * @param id ID do projeto
   * @returns Mensagem de confirmação
   */
  @Delete(':id')
  @ProtectedRoute('admin', 'gerente')
  @ApiOkResponse({ description: 'Projeto removido com sucesso' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.projetoService.remove(id);
  }

  // Colaborador endpoints

  /**
   * Busca todos os colaboradores de um projeto
   * @param id ID do projeto
   * @returns Lista de colaboradores do projeto
   */
  @Get(':id/colaboradores')
  @ProtectedRoute()
  @ApiOkResponse({
    description: 'Lista de colaboradores do projeto',
    type: [ColaboradorDto],
  })
  findColaboradores(
    @Param('id', ParseIntPipe) id: number,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.colaboradorService.findAllFromProject(
      id,
      page ? parseInt(page) : undefined,
      pageSize ? parseInt(pageSize) : undefined,
    );
  }

  /**
   * Adiciona um colaborador ao projeto
   * @param id ID do projeto
   * @param createColaboradorDto Dados do colaborador a ser adicionado
   * @returns O colaborador adicionado
   */
  @Post(':id/colaboradores')
  @ProtectedRoute('admin', 'gerente')
  @ApiOkResponse({
    description: 'Colaborador adicionado com sucesso',
    type: ColaboradorDto,
  })
  addColaborador(
    @Param('id', ParseIntPipe) id: number,
    @Body() createColaboradorDto: CreateColaboradorDto,
  ) {
    // Create a new collaborator with the project reference
    const collaborator = {
      ...createColaboradorDto,
      projeto: id,
    };
    return this.colaboradorService.create(collaborator);
  }

  /**
   * Atualiza um colaborador do projeto
   * @param projetoId ID do projeto
   * @param colaboradorId ID do colaborador
   * @param updateColaboradorDto Dados a serem atualizados
   * @returns O colaborador atualizado
   */
  @Patch(':projetoId/colaboradores/:colaboradorId')
  @ProtectedRoute('admin', 'gerente')
  @ApiOkResponse({
    description: 'Colaborador atualizado com sucesso',
    type: ColaboradorDto,
  })
  updateColaborador(
    @Param('projetoId', ParseIntPipe) projetoId: number,
    @Param('colaboradorId', ParseIntPipe) colaboradorId: number,
    @Body() updateColaboradorDto: UpdateColaboradorDto,
  ) {
    // Manually handle projeto relationship
    const updatedDto = {
      ...updateColaboradorDto,
      projeto_id: projetoId,
    };
    return this.colaboradorService.update(colaboradorId, updatedDto);
  }

  /**
   * Remove um colaborador do projeto
   * @param projetoId ID do projeto
   * @param colaboradorId ID do colaborador
   * @returns Mensagem de confirmação
   */
  @Delete(':projetoId/colaboradores/:colaboradorId')
  @ProtectedRoute('admin', 'gerente')
  @ApiOkResponse({ description: 'Colaborador removido com sucesso' })
  removeColaborador(
    @Param('projetoId', ParseIntPipe) projetoId: number,
    @Param('colaboradorId', ParseIntPipe) colaboradorId: number,
  ) {
    return this.colaboradorService.remove(colaboradorId);
  }
}
