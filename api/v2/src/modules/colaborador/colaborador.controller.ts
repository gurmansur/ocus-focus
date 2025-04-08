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
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../../decorators/api-paginated-response.decorator';
import { ProtectedRoute } from '../../decorators/protected-route.decorator';
import { Serialize } from '../../decorators/serialize.decorator';
import { ColaboradorService } from './colaborador.service';
import { ColaboradorDto } from './dto/colaborador.dto';
import { CreateColaboradorDto } from './dto/create-colaborador.dto';
import { UpdateColaboradorDto } from './dto/update-colaborador.dto';

@Serialize()
@ApiTags('Colaborador')
@ApiBearerAuth()
@Controller('colaboradores')
export class ColaboradorController {
  constructor(private readonly colaboradorService: ColaboradorService) {}

  /**
   * Cria um novo colaborador
   * @param createColaboradorDto Dados do colaborador a ser criado
   * @returns O colaborador criado
   */
  @Post()
  @ProtectedRoute('admin')
  @ApiOperation({
    summary: 'Criar colaborador',
    description: 'Cria um novo colaborador no sistema',
  })
  @ApiBody({
    type: CreateColaboradorDto,
    description: 'Dados do colaborador a ser criado',
  })
  @ApiCreatedResponse({
    description: 'Colaborador criado com sucesso',
    type: ColaboradorDto,
  })
  create(@Body() createColaboradorDto: CreateColaboradorDto) {
    return this.colaboradorService.create(createColaboradorDto);
  }

  /**
   * Busca todos os colaboradores de um projeto
   * @param projeto ID do projeto
   * @returns Lista de colaboradores do projeto
   */
  @Get('projeto')
  @ProtectedRoute()
  @ApiOperation({
    summary: 'Listar colaboradores por projeto',
    description: 'Retorna todos os colaboradores de um projeto específico',
  })
  @ApiQuery({
    name: 'projeto',
    type: Number,
    description: 'ID do projeto',
    required: true,
  })
  @ApiOkResponse({
    description: 'Lista de colaboradores do projeto',
    type: [ColaboradorDto],
  })
  @ApiNotFoundResponse({ description: 'Projeto não encontrado' })
  findAllFromProject(@Query('projeto') projeto: number) {
    return this.colaboradorService.findAllFromProject(+projeto);
  }

  /**
   * Busca todos os colaboradores com filtros opcionais
   * @param name Nome para filtrar (opcional)
   * @param projetoId ID do projeto para filtrar (opcional)
   * @returns Lista de colaboradores filtrados
   */
  @Get()
  @ProtectedRoute()
  @ApiOperation({
    summary: 'Listar colaboradores',
    description:
      'Retorna uma lista paginada de colaboradores com filtros opcionais',
  })
  @ApiQuery({
    name: 'name',
    type: String,
    description: 'Filtro por nome',
    required: false,
  })
  @ApiQuery({
    name: 'projeto',
    type: String,
    description: 'Filtro por ID do projeto',
    required: false,
  })
  @ApiQuery({
    name: 'page',
    type: String,
    description: 'Número da página',
    required: false,
  })
  @ApiQuery({
    name: 'pageSize',
    type: String,
    description: 'Tamanho da página',
    required: false,
  })
  @ApiPaginatedResponse(ColaboradorDto)
  findAll(
    @Query('name') name: string,
    @Query('projeto') projetoId: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.colaboradorService.findAll(
      name,
      projetoId ? parseInt(projetoId) : undefined,
      page ? parseInt(page) : undefined,
      pageSize ? parseInt(pageSize) : undefined,
    );
  }

  /**
   * Busca um colaborador pelo ID
   * @param id ID do colaborador
   * @returns O colaborador encontrado
   */
  @Get(':id')
  @ProtectedRoute()
  @ApiOperation({
    summary: 'Buscar colaborador por ID',
    description: 'Retorna um colaborador específico pelo seu ID',
  })
  @ApiParam({ name: 'id', type: String, description: 'ID do colaborador' })
  @ApiOkResponse({
    description: 'Colaborador encontrado',
    type: ColaboradorDto,
  })
  @ApiNotFoundResponse({ description: 'Colaborador não encontrado' })
  findOne(@Param('id') id: string) {
    return this.colaboradorService.findOne(+id);
  }

  /**
   * Atualiza um colaborador
   * @param id ID do colaborador
   * @param updateColaboradorDto Dados a serem atualizados
   * @returns O colaborador atualizado
   */
  @Patch(':id')
  @ProtectedRoute('admin')
  @ApiOperation({
    summary: 'Atualizar colaborador',
    description: 'Atualiza os dados de um colaborador existente',
  })
  @ApiParam({ name: 'id', type: String, description: 'ID do colaborador' })
  @ApiBody({
    type: UpdateColaboradorDto,
    description: 'Dados atualizados do colaborador',
  })
  @ApiOkResponse({
    description: 'Colaborador atualizado com sucesso',
    type: ColaboradorDto,
  })
  @ApiNotFoundResponse({ description: 'Colaborador não encontrado' })
  update(
    @Param('id') id: string,
    @Body() updateColaboradorDto: UpdateColaboradorDto,
  ) {
    return this.colaboradorService.update(+id, updateColaboradorDto);
  }

  /**
   * Remove um colaborador
   * @param id ID do colaborador
   */
  @Delete(':id')
  @ProtectedRoute('admin')
  @ApiOperation({
    summary: 'Remover colaborador',
    description: 'Remove um colaborador do sistema',
  })
  @ApiParam({ name: 'id', type: String, description: 'ID do colaborador' })
  @ApiOkResponse({ description: 'Colaborador removido com sucesso' })
  @ApiNotFoundResponse({ description: 'Colaborador não encontrado' })
  remove(@Param('id') id: string) {
    return this.colaboradorService.remove(+id);
  }
}
