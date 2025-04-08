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
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../../decorators/api-paginated-response.decorator';
import { ProtectedRoute } from '../../decorators/protected-route.decorator';
import { AtorService } from './ator.service';
import { AtoresMetricsQueryDto } from './dto/atores-metrics-query.dto';
import { AtoresMetricsDto } from './dto/atores-metrics.dto';
import { CreateAtorDto } from './dto/create-ator.dto';
import { DeleteAtorQueryDto } from './dto/delete-ator-query.dto';
import { FindAtorByIdDto } from './dto/find-ator-by-id.dto';
import { UpdateAtorQueryDto } from './dto/update-ator-query.dto';
import { UpdateAtorDto } from './dto/update-ator.dto';

/**
 * Controlador para gerenciamento de atores
 */
@ApiTags('Ator')
@ApiBearerAuth()
@Controller('atores')
export class AtorController {
  constructor(private readonly atorService: AtorService) {}

  /**
   * Lista atores com paginação
   */
  @ProtectedRoute()
  @Get()
  @ApiOperation({ summary: 'Listar atores' })
  @ApiPaginatedResponse(FindAtorByIdDto)
  findAll(
    @Query('projeto', ParseIntPipe) projetoId: number,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.atorService.findAll(projetoId, page || 0, pageSize || 10);
  }

  /**
   * Lista atores filtrados por nome
   */
  @ProtectedRoute()
  @Get('findByNome')
  @ApiOperation({ summary: 'Buscar atores por nome' })
  @ApiPaginatedResponse(FindAtorByIdDto)
  findByNome(
    @Query('nome') nome: string,
    @Query('projeto', ParseIntPipe) projetoId: number,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.atorService.findByNome(
      nome,
      projetoId,
      page || 0,
      pageSize || 10,
    );
  }

  /**
   * Cria um novo ator
   */
  @ProtectedRoute('admin', 'gerente', 'analista')
  @Post()
  @ApiOperation({ summary: 'Criar ator' })
  @ApiOkResponse({
    description: 'Ator criado com sucesso',
    type: FindAtorByIdDto,
  })
  create(
    @Body() createAtorDto: CreateAtorDto,
    @Query('projeto', ParseIntPipe) projetoId: number,
  ) {
    return this.atorService.create(createAtorDto, projetoId);
  }

  /**
   * Busca um ator pelo ID
   */
  @ProtectedRoute()
  @Get(':id')
  @ApiOperation({ summary: 'Buscar ator por ID' })
  @ApiOkResponse({ description: 'Ator encontrado', type: FindAtorByIdDto })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.atorService.findOne(id);
  }

  /**
   * Atualiza um ator pelo ID
   */
  @ProtectedRoute('admin', 'gerente', 'analista')
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar ator' })
  @ApiOkResponse({
    description: 'Ator atualizado com sucesso',
    type: FindAtorByIdDto,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAtorDto: UpdateAtorDto,
    @Query('projeto', ParseIntPipe) projetoId: number,
  ) {
    return this.atorService.update(id, projetoId, updateAtorDto);
  }

  /**
   * Remove um ator
   */
  @ProtectedRoute('admin', 'gerente')
  @Delete(':id')
  @ApiOperation({ summary: 'Remover ator' })
  @ApiOkResponse({ description: 'Ator removido com sucesso' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.atorService.remove(id);
  }

  /**
   * Obtém métricas de atores
   */
  @ProtectedRoute()
  @Get('metrics/total')
  @ApiOperation({ summary: 'Obter total de atores' })
  @ApiResponse({
    status: 200,
    description: 'Retorna a quantidade de atores do projeto',
    type: AtoresMetricsDto,
  })
  getTotal(@Query() { atores }: AtoresMetricsQueryDto) {
    return this.atorService.getMetrics(atores);
  }

  /**
   * Obtém métricas de atores simples
   */
  @ProtectedRoute()
  @Get('metrics/simples')
  @ApiOperation({ summary: 'Obter total de atores simples' })
  @ApiResponse({
    status: 200,
    description: 'Retorna a quantidade de atores simples',
    type: AtoresMetricsDto,
  })
  getTotalSimples(@Query() { atores }: AtoresMetricsQueryDto) {
    return this.atorService.getMetrics(atores, 'SIMPLES');
  }

  /**
   * Obtém métricas de atores médios
   */
  @ProtectedRoute()
  @Get('metrics/medios')
  @ApiOperation({ summary: 'Obter total de atores médios' })
  @ApiResponse({
    status: 200,
    description: 'Retorna a quantidade de atores médios',
    type: AtoresMetricsDto,
  })
  getTotalMedio(@Query() { atores }: AtoresMetricsQueryDto) {
    return this.atorService.getMetrics(atores, 'MEDIO');
  }

  /**
   * Obtém métricas de atores complexos
   */
  @ProtectedRoute()
  @Get('metrics/complexos')
  @ApiOperation({ summary: 'Obter total de atores complexos' })
  @ApiResponse({
    status: 200,
    description: 'Retorna a quantidade de atores complexos',
    type: AtoresMetricsDto,
  })
  getTotalComplexo(@Query() { atores }: AtoresMetricsQueryDto) {
    return this.atorService.getMetrics(atores, 'COMPLEXO');
  }

  /**
   * Atualiza um ator pela query
   */
  @ProtectedRoute('admin', 'gerente', 'analista')
  @Patch('update')
  @ApiOperation({ summary: 'Atualizar ator pela query' })
  @ApiResponse({
    status: 200,
    description: 'Atualiza o ator',
    type: FindAtorByIdDto,
  })
  updateByQuery(
    @Query() { atores, projeto }: UpdateAtorQueryDto,
    @Body() updateAtorDto: UpdateAtorDto,
  ) {
    return this.atorService.update(atores, projeto, updateAtorDto);
  }

  /**
   * Remove um ator pela query
   */
  @ProtectedRoute('admin', 'gerente')
  @Delete('delete')
  @ApiOperation({ summary: 'Remover ator pela query' })
  @ApiResponse({
    status: 200,
    description: 'Remove o ator',
  })
  removeByQuery(@Query() { atores }: DeleteAtorQueryDto) {
    return this.atorService.remove(atores);
  }
}
