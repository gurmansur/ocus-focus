import { ApiBearerAuth } from '@nestjs/swagger';
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
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../../decorators/api-paginated-response.decorator';
import { ProtectedRoute } from '../../decorators/protected-route.decorator';
import { CasoDeTesteService } from './caso-de-teste.service';
import { CasoDeTesteDto } from './dto/caso-de-teste.dto';
import { CreateCasoDeTesteDto } from './dto/create-caso-de-teste.dto';
import { UpdateCasoDeTesteDto } from './dto/update-caso-de-teste.dto';

/**
 * Controlador para gerenciamento de casos de teste
 */
@ApiTags('Caso de Teste')
@ApiBearerAuth()
@Controller('casos-de-teste')
export class CasoDeTesteController {
  constructor(private readonly casoDeTesteService: CasoDeTesteService) {}

  /**
   * Lista casos de teste com paginação
   * @param projetoId ID do projeto
   * @param page Número da página
   * @param pageSize Tamanho da página
   * @returns Lista paginada de casos de teste
   */
  @ProtectedRoute()
  @Get()
  @ApiOperation({
    summary: 'Buscar',
    description: 'Busca recursos específicos',
  })
  @ApiOperation({ summary: 'Listar', description: 'Lista todos os recursos' })
  @ApiPaginatedResponse(CasoDeTesteDto)
  findAll(
    @Query('projeto', ParseIntPipe) projetoId: number,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.casoDeTesteService.findAll(projetoId, page, pageSize);
  }

  /**
   * Busca casos de teste por nome
   * @param nome Nome para filtrar
   * @param projetoId ID do projeto
   * @param page Número da página
   * @param pageSize Tamanho da página
   * @returns Lista paginada de casos de teste
   */
  @ProtectedRoute()
  @Get('findByNome')
  @ApiOperation({
    summary: 'Buscar',
    description: 'Busca recursos específicos',
  })
  @ApiPaginatedResponse(CasoDeTesteDto)
  findByNome(
    @Query('nome') nome: string,
    @Query('projeto', ParseIntPipe) projetoId: number,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.casoDeTesteService.findByNome(nome, projetoId, page, pageSize);
  }

  /**
   * Busca casos de teste por suite de teste
   * @param suiteDeTesteId ID da suite de teste
   * @param page Número da página
   * @param pageSize Tamanho da página
   * @returns Lista paginada de casos de teste
   */
  @ProtectedRoute()
  @Get('findBySuiteDeTeste')
  @ApiOperation({
    summary: 'Buscar',
    description: 'Busca recursos específicos',
  })
  @ApiPaginatedResponse(CasoDeTesteDto)
  findBySuiteDeTeste(
    @Query('suiteDeTeste', ParseIntPipe) suiteDeTesteId: number,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.casoDeTesteService.findBySuiteDeTeste(
      suiteDeTesteId,
      page,
      pageSize,
    );
  }

  /**
   * Busca caso de teste por ID
   * @param id ID do caso de teste
   * @returns Caso de teste encontrado
   */
  @ProtectedRoute()
  @Get(':id')
  @ApiOperation({
    summary: 'Buscar',
    description: 'Busca recursos específicos',
  })
  @ApiOkResponse({
    description: 'Caso de teste encontrado',
    type: CasoDeTesteDto,
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.casoDeTesteService.findOne(id);
  }

  /**
   * Cria um novo caso de teste
   * @param createCasoDeTesteDto Dados do caso de teste
   * @param projetoId ID do projeto
   * @returns Caso de teste criado
   */
  @ProtectedRoute('admin', 'gerente', 'analista', 'testador')
  @Post()
  @ApiOperation({ summary: 'Criar', description: 'Cria um novo recurso' })
  @ApiCreatedResponse({ description: 'Recurso criado com sucesso' })
  @ApiOperation({ summary: 'Criar', description: 'Cria um novo recurso' })
  @ApiCreatedResponse({ description: 'Recurso criado com sucesso' })
  @ApiOkResponse({
    description: 'Caso de teste criado com sucesso',
    type: CasoDeTesteDto,
  })
  create(
    @Body() createCasoDeTesteDto: CreateCasoDeTesteDto,
    @Query('projeto', ParseIntPipe) projetoId: number,
  ) {
    return this.casoDeTesteService.create(createCasoDeTesteDto, projetoId);
  }

  /**
   * Atualiza um caso de teste
   */
  @ProtectedRoute('admin', 'gerente', 'analista', 'testador')
  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar',
    description: 'Atualiza um recurso existente',
  })
  @ApiResponse({ status: 200, description: 'Recurso atualizado com sucesso' })
  @ApiOkResponse({
    description: 'Caso de teste atualizado com sucesso',
    type: CasoDeTesteDto,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCasoDeTesteDto: UpdateCasoDeTesteDto,
    @Query('projeto', ParseIntPipe) projetoId: number,
  ) {
    return this.casoDeTesteService.update(id, updateCasoDeTesteDto, projetoId);
  }

  /**
   * Remove um caso de teste
   * @param id ID do caso de teste
   * @returns Mensagem de confirmação
   */
  @ProtectedRoute('admin', 'gerente')
  @Delete(':id')
  @ApiOperation({ summary: 'Remover', description: 'Remove um recurso' })
  @ApiResponse({ status: 200, description: 'Recurso removido com sucesso' })
  @ApiOkResponse({ description: 'Caso de teste removido com sucesso' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.casoDeTesteService.remove(id);
  }
}
