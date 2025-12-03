import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ProjetoAtual } from '../../decorators/projeto-atual.decorator';
import { ProtectedRoute } from '../../decorators/protected-route.decorator';
import { Projeto } from '../projeto/entities/projeto.entity';
import { CasoUsoService } from './caso-uso.service';
import { CreateCasoUsoDto } from './dto/create-caso-uso.dto';
import { UpdateCasoUsoDto } from './dto/update-caso-uso.dto';

@ApiTags('Caso de Uso')
@ApiBearerAuth()
@Controller('caso-de-uso')
export class CasoUsoController {
  constructor(private readonly casoUsoService: CasoUsoService) {}

  /**
   * Lista casos de uso com paginação
   * @param requisito ID do requisito
   * @param page Número da página
   * @param pageSize Tamanho da página
   * @param projeto Projeto atual
   * @returns Lista paginada de casos de uso
   */
  @ProtectedRoute()
  @Get()
  @ApiOperation({
    summary: 'Listar casos de uso',
    description: 'Retorna uma lista paginada de casos de uso',
  })
  @ApiQuery({
    name: 'requisito',
    type: Number,
    description: 'ID do requisito',
    required: false,
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    description: 'Número da página',
    required: false,
  })
  @ApiQuery({
    name: 'pageSize',
    type: Number,
    description: 'Tamanho da página',
    required: false,
  })
  @ApiOkResponse({ description: 'Retorna todos os casos de uso' })
  findAll(
    @Query('requisito') requisito: number,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @ProjetoAtual() projeto: Projeto,
  ) {
    return this.casoUsoService.findAll(requisito, page, pageSize, projeto);
  }

  /**
   * Busca casos de uso por nome
   * @param nome Nome para filtrar
   * @returns Lista de casos de uso
   */
  @ProtectedRoute()
  @Get('findByNome')
  @ApiOperation({
    summary: 'Buscar casos de uso por nome',
    description: 'Retorna casos de uso que correspondem ao nome pesquisado',
  })
  @ApiQuery({
    name: 'nome',
    type: String,
    description: 'Nome para pesquisa',
    required: true,
  })
  @ApiOkResponse({ description: 'Retorna um caso de uso buscando pelo nome' })
  @ApiNotFoundResponse({ description: 'Nenhum caso de uso encontrado' })
  findByNome(@Query('nome') nome: string) {
    return this.casoUsoService.findByNome(nome);
  }

  /**
   * Busca caso de uso por ID
   * @param id ID do caso de uso
   * @returns O caso de uso encontrado
   */
  @ProtectedRoute()
  @Get('findById')
  @ApiOperation({
    summary: 'Buscar caso de uso por ID',
    description: 'Retorna um caso de uso específico pelo seu ID',
  })
  @ApiQuery({
    name: 'id',
    type: String,
    description: 'ID do caso de uso',
    required: true,
  })
  @ApiOkResponse({ description: 'Retorna um caso de uso buscando pelo id' })
  @ApiNotFoundResponse({ description: 'Caso de uso não encontrado' })
  findOne(@Query('id') id: string) {
    return this.casoUsoService.findOne(+id);
  }

  /**
   * Retorna métricas totais de casos de uso
   * @param caso ID do caso de uso
   * @returns Métricas de casos de uso
   */
  @ProtectedRoute()
  @Get('metrics/total')
  @ApiOperation({
    summary: 'Métricas totais',
    description: 'Retorna estatísticas totais sobre casos de uso',
  })
  @ApiQuery({
    name: 'caso',
    type: Number,
    description: 'ID do caso de uso',
    required: false,
  })
  @ApiOkResponse({ description: 'Retorna a quantiade total de casos de uso' })
  getTotal(@Query('caso') caso: number) {
    return this.casoUsoService.getMetrics(caso);
  }

  /**
   * Retorna métricas de casos de uso simples
   * @param caso ID do caso de uso
   * @returns Métricas de casos de uso simples
   */
  @ProtectedRoute()
  @Get('metrics/simples')
  @ApiOperation({
    summary: 'Métricas de casos simples',
    description: 'Retorna estatísticas de casos de uso simples',
  })
  @ApiQuery({
    name: 'caso',
    type: Number,
    description: 'ID do caso de uso',
    required: false,
  })
  @ApiOkResponse({
    description: 'Retorna a quantidade de casos de uso simples',
  })
  getTotalSimples(@Query('caso') caso: number) {
    return this.casoUsoService.getMetrics(caso, 'SIMPLES');
  }

  /**
   * Retorna métricas de casos de uso médios
   * @param caso ID do caso de uso
   * @returns Métricas de casos de uso médios
   */
  @ProtectedRoute()
  @Get('metrics/medios')
  @ApiOperation({
    summary: 'Métricas de casos médios',
    description: 'Retorna estatísticas de casos de uso médios',
  })
  @ApiQuery({
    name: 'caso',
    type: Number,
    description: 'ID do caso de uso',
    required: false,
  })
  @ApiOkResponse({ description: 'Retorna a quantidade de casos de uso médios' })
  getTotalMedios(@Query('caso') caso: number) {
    return this.casoUsoService.getMetrics(caso, 'MEDIO');
  }

  /**
   * Retorna métricas de casos de uso complexos
   * @param caso ID do caso de uso
   * @returns Métricas de casos de uso complexos
   */
  @ProtectedRoute()
  @Get('metrics/complexos')
  @ApiOperation({
    summary: 'Métricas de casos complexos',
    description: 'Retorna estatísticas de casos de uso complexos',
  })
  @ApiQuery({
    name: 'caso',
    type: Number,
    description: 'ID do caso de uso',
    required: false,
  })
  @ApiOkResponse({
    description: 'Retorna a quantidade de casos de uso complexos',
  })
  getTotalComplexos(@Query('caso') caso: number) {
    return this.casoUsoService.getMetrics(caso, 'COMPLEXO');
  }

  /**
   * Cria um novo caso de uso
   * @param createCasoUsoDto Dados do caso de uso
   * @param requisitoId ID do requisito
   * @returns O caso de uso criado
   */
  @ProtectedRoute('admin', 'gerente', 'analista')
  @Post('new')
  @ApiOperation({
    summary: 'Criar caso de uso',
    description: 'Cria um novo caso de uso no sistema',
  })
  @ApiQuery({
    name: 'requisito',
    type: Number,
    description: 'ID do requisito',
    required: true,
  })
  @ApiBody({
    type: CreateCasoUsoDto,
    description: 'Dados do caso de uso a ser criado',
  })
  @ApiCreatedResponse({
    description: 'Caso de uso criado com sucesso',
    type: CreateCasoUsoDto,
  })
  create(
    @Body() createCasoUsoDto: CreateCasoUsoDto,
    @Query('requisito') requisitoId: number,
  ) {
    return this.casoUsoService.create(createCasoUsoDto, requisitoId);
  }

  /**
   * Atualiza um caso de uso
   * @param id ID do caso de uso
   * @param requisito ID do requisito
   * @param updateCasoUsoDto Dados para atualização
   * @returns O caso de uso atualizado
   */
  @ProtectedRoute('admin', 'gerente', 'analista')
  @Patch('update')
  @ApiOperation({
    summary: 'Atualizar caso de uso',
    description: 'Atualiza um caso de uso existente',
  })
  @ApiQuery({
    name: 'caso',
    type: String,
    description: 'ID do caso de uso',
    required: true,
  })
  @ApiQuery({
    name: 'requisito',
    type: Number,
    description: 'ID do requisito',
    required: true,
  })
  @ApiBody({
    type: UpdateCasoUsoDto,
    description: 'Dados atualizados do caso de uso',
  })
  @ApiOkResponse({
    description: 'Caso de uso atualizado com sucesso',
    type: UpdateCasoUsoDto,
  })
  @ApiNotFoundResponse({ description: 'Caso de uso não encontrado' })
  update(
    @Query('caso') id: string,
    @Query('requisito') requisito: number,
    @Body() updateCasoUsoDto: UpdateCasoUsoDto,
  ) {
    return this.casoUsoService.update(+id, +requisito, updateCasoUsoDto);
  }

  /**
   * Remove um caso de uso
   * @param id ID do caso de uso
   * @returns Confirmação de remoção
   */
  @ProtectedRoute('admin', 'gerente')
  @Delete('delete')
  @ApiOperation({
    summary: 'Remover caso de uso',
    description: 'Remove um caso de uso do sistema',
  })
  @ApiQuery({
    name: 'id',
    type: String,
    description: 'ID do caso de uso',
    required: true,
  })
  @ApiOkResponse({ description: 'Caso de uso removido com sucesso' })
  @ApiNotFoundResponse({ description: 'Caso de uso não encontrado' })
  remove(@Query('id') id: string) {
    return this.casoUsoService.remove(+id);
  }
}
