import { ApiBearerAuth } from '@nestjs/swagger';
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
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../../decorators/api-paginated-response.decorator';
import { ProtectedRoute } from '../../decorators/protected-route.decorator';
import { CreateSuiteDeTesteDto } from './dto/create-suite-de-teste.dto';
import { SuiteDeTesteDto } from './dto/suite-de-teste.dto';
import { UpdateSuiteDeTesteDto } from './dto/update-suite-de-teste.dto';
import { SuiteDeTesteService } from './suite-de-teste.service';

/**
 * Controlador para gerenciamento de suites de teste
 */
@ApiTags('Suite de Teste')
@ApiBearerAuth()
@Controller('suites-de-teste')
export class SuiteDeTesteController {
  constructor(private readonly suiteDeTesteService: SuiteDeTesteService) {}

  /**
   * Lista suites de teste com paginação
   * @param projetoId ID do projeto
   * @param page Número da página
   * @param pageSize Tamanho da página
   * @returns Lista paginada de suites de teste
   */
  @ProtectedRoute()
  @Get()
  @ApiOperation({
    summary: 'Buscar',
    description: 'Busca recursos específicos',
  })
  @ApiOperation({ summary: 'Listar', description: 'Lista todos os recursos' })
  @ApiPaginatedResponse(SuiteDeTesteDto)
  findAll(
    @Query('projeto') projetoId: number,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.suiteDeTesteService.findAll(projetoId, page, pageSize);
  }

  /**
   * Busca suites de teste por nome
   * @param nome Nome para filtrar
   * @param projetoId ID do projeto
   * @param page Número da página
   * @param pageSize Tamanho da página
   * @returns Lista paginada de suites de teste
   */
  @ProtectedRoute()
  @Get('findByNome')
  @ApiOperation({
    summary: 'Buscar',
    description: 'Busca recursos específicos',
  })
  @ApiPaginatedResponse(SuiteDeTesteDto)
  findByNome(
    @Query('nome') nome: string,
    @Query('projeto') projetoId: number,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.suiteDeTesteService.findByNome(nome, projetoId, page, pageSize);
  }

  /**
   * Busca suite de teste por ID
   * @param id ID da suite de teste
   * @returns Suite de teste encontrada
   */
  @ProtectedRoute()
  @Get(':id')
  @ApiOperation({
    summary: 'Buscar',
    description: 'Busca recursos específicos',
  })
  @ApiOkResponse({
    description: 'Suite de teste encontrada',
    type: SuiteDeTesteDto,
  })
  findOne(@Param('id') id: number) {
    return this.suiteDeTesteService.findOne(id);
  }

  /**
   * Cria uma nova suite de teste
   * @param createSuiteDeTesteDto Dados da suite de teste
   * @param projetoId ID do projeto
   * @returns Suite de teste criada
   */
  @ProtectedRoute('admin', 'gerente', 'analista', 'testador')
  @Post()
  @ApiOperation({ summary: 'Criar', description: 'Cria um novo recurso' })
  @ApiCreatedResponse({ description: 'Recurso criado com sucesso' })
  @ApiOperation({ summary: 'Criar', description: 'Cria um novo recurso' })
  @ApiCreatedResponse({ description: 'Recurso criado com sucesso' })
  @ApiOkResponse({
    description: 'Suite de teste criada com sucesso',
    type: SuiteDeTesteDto,
  })
  create(
    @Body() createSuiteDeTesteDto: CreateSuiteDeTesteDto,
    @Query('projeto') projetoId: number,
  ) {
    return this.suiteDeTesteService.create(createSuiteDeTesteDto, projetoId);
  }

  /**
   * Atualiza uma suite de teste
   * @param id ID da suite de teste
   * @param updateSuiteDeTesteDto Dados a serem atualizados
   * @returns Suite de teste atualizada
   */
  @ProtectedRoute('admin', 'gerente', 'analista', 'testador')
  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar',
    description: 'Atualiza um recurso existente',
  })
  @ApiResponse({ status: 200, description: 'Recurso atualizado com sucesso' })
  @ApiOkResponse({
    description: 'Suite de teste atualizada com sucesso',
    type: SuiteDeTesteDto,
  })
  update(
    @Param('id') id: number,
    @Body() updateSuiteDeTesteDto: UpdateSuiteDeTesteDto,
  ) {
    return this.suiteDeTesteService.update(id, updateSuiteDeTesteDto);
  }

  /**
   * Remove uma suite de teste
   * @param id ID da suite de teste
   * @returns Mensagem de confirmação
   */
  @ProtectedRoute('admin', 'gerente')
  @Delete(':id')
  @ApiOperation({ summary: 'Remover', description: 'Remove um recurso' })
  @ApiResponse({ status: 200, description: 'Recurso removido com sucesso' })
  @ApiOkResponse({ description: 'Suite de teste removida com sucesso' })
  remove(@Param('id') id: number) {
    return this.suiteDeTesteService.remove(id);
  }
}
