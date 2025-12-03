import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../../decorators/api-paginated-response.decorator';
import { ProtectedRoute } from '../../decorators/protected-route.decorator';
import { CreateExecucaoDeTesteDto } from './dto/create-execucao-de-teste.dto';
import { ExecucaoDeTesteDto } from './dto/execucao-de-teste.dto';
import { UpdateExecucaoDeTesteDto } from './dto/update-execucao-de-teste.dto';
import { ExecucaoDeTesteService } from './execucao-de-teste.service';

/**
 * Controlador para gerenciamento de execuções de teste
 */
@ApiTags('Execução de Teste')
@ApiBearerAuth()
@Controller('execucao-de-teste')
export class ExecucaoDeTesteController {
  constructor(
    private readonly execucaoDeTesteService: ExecucaoDeTesteService,
  ) {}

  /**
   * Lista execuções de teste com paginação
   * @param projetoId ID do projeto
   * @param page Número da página
   * @param pageSize Tamanho da página
   * @returns Lista paginada de execuções de teste
   */
  @ProtectedRoute()
  @Get()
  @ApiOperation({
    summary: 'Buscar',
    description: 'Busca recursos específicos',
  })
  @ApiOperation({ summary: 'Listar', description: 'Lista todos os recursos' })
  @ApiPaginatedResponse(ExecucaoDeTesteDto)
  findAll(
    @Query('projeto') projetoId: number,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.execucaoDeTesteService.findAll(projetoId, page, pageSize);
  }

  /**
   * Busca execuções de teste por nome
   * @param nome Nome para filtrar
   * @param projetoId ID do projeto
   * @param page Número da página
   * @param pageSize Tamanho da página
   * @returns Lista paginada de execuções de teste
   */
  @ProtectedRoute()
  @Get('findByNome')
  @ApiOperation({
    summary: 'Buscar',
    description: 'Busca recursos específicos',
  })
  @ApiPaginatedResponse(ExecucaoDeTesteDto)
  findByNome(
    @Query('nome') nome: string,
    @Query('projeto') projetoId: number,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.execucaoDeTesteService.findByNome(
      nome,
      projetoId,
      page,
      pageSize,
    );
  }

  /**
   * Busca execuções de teste por caso de teste
   * @param casoDeTesteId ID do caso de teste
   * @param page Número da página
   * @param pageSize Tamanho da página
   * @returns Lista paginada de execuções de teste
   */
  @ProtectedRoute()
  @Get('findByCasoDeTeste')
  @ApiOperation({
    summary: 'Buscar',
    description: 'Busca recursos específicos',
  })
  @ApiPaginatedResponse(ExecucaoDeTesteDto)
  findByCasoDeTeste(
    @Query('casoDeTeste') casoDeTesteId: number,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.execucaoDeTesteService.findByCasoDeTeste(
      casoDeTesteId,
      page,
      pageSize,
    );
  }

  /**
   * Busca execução de teste por ID
   * @param id ID da execução de teste
   * @returns A execução de teste encontrada
   */
  @ProtectedRoute()
  @Get(':id')
  @ApiOperation({
    summary: 'Buscar',
    description: 'Busca recursos específicos',
  })
  @ApiOkResponse({
    description: 'Execução de teste encontrada',
    type: ExecucaoDeTesteDto,
  })
  findOne(@Param('id') id: number) {
    return this.execucaoDeTesteService.findOne(id);
  }

  /**
   * Cria uma nova execução de teste
   * @param createExecucaoDeTesteDto Dados da execução de teste
   * @param projetoId ID do projeto
   * @returns A execução de teste criada
   */
  @ProtectedRoute('admin', 'gerente', 'analista', 'testador')
  @Post()
  @ApiOperation({ summary: 'Criar', description: 'Cria um novo recurso' })
  @ApiCreatedResponse({ description: 'Recurso criado com sucesso' })
  @ApiOperation({ summary: 'Criar', description: 'Cria um novo recurso' })
  @ApiCreatedResponse({ description: 'Recurso criado com sucesso' })
  @ApiOkResponse({
    description: 'Execução de teste criada com sucesso',
    type: ExecucaoDeTesteDto,
  })
  create(
    @Body() createExecucaoDeTesteDto: CreateExecucaoDeTesteDto,
    @Query('projeto') projetoId: number,
  ) {
    return this.execucaoDeTesteService.create(
      createExecucaoDeTesteDto,
      projetoId,
    );
  }

  /**
   * Atualiza uma execução de teste
   * @param id ID da execução de teste
   * @param updateExecucaoDeTesteDto Dados para atualização
   * @returns A execução de teste atualizada
   */
  @ProtectedRoute('admin', 'gerente', 'analista', 'testador')
  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar',
    description: 'Atualiza um recurso existente',
  })
  @ApiResponse({ status: 200, description: 'Recurso atualizado com sucesso' })
  @ApiOkResponse({
    description: 'Execução de teste atualizada com sucesso',
    type: ExecucaoDeTesteDto,
  })
  update(
    @Param('id') id: number,
    @Body() updateExecucaoDeTesteDto: UpdateExecucaoDeTesteDto,
  ) {
    return this.execucaoDeTesteService.update(id, updateExecucaoDeTesteDto);
  }

  /**
   * Remove uma execução de teste
   * @param id ID da execução de teste
   * @returns Confirmação de remoção
   */
  @ProtectedRoute('admin', 'gerente')
  @Delete(':id')
  @ApiOperation({ summary: 'Remover', description: 'Remove um recurso' })
  @ApiResponse({ status: 200, description: 'Recurso removido com sucesso' })
  @ApiOkResponse({ description: 'Execução de teste removida com sucesso' })
  remove(@Param('id') id: number) {
    return this.execucaoDeTesteService.remove(id);
  }
}
