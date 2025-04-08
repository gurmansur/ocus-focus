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
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../../decorators/api-paginated-response.decorator';
import { ProtectedRoute } from '../../decorators/protected-route.decorator';
import { CreateRequisitoDto } from './dto/create-requisito.dto';
import { RequisitoDto } from './dto/requisito.dto';
import { UpdateRequisitoDto } from './dto/update-requisito.dto';
import { RequisitoService } from './requisito-funcional.service';

@ApiTags('Requisito')
@ApiBearerAuth()
@Controller('requisitos')
export class RequisitoController {
  constructor(private readonly requisitoService: RequisitoService) {}

  /**
   * Lista requisitos paginados
   * @param projetoId ID do projeto
   * @param page Número da página
   * @param pageSize Tamanho da página
   * @returns Lista paginada de requisitos
   */
  @Get()
  @ApiOperation({
    summary: 'Buscar',
    description: 'Busca recursos específicos',
  })
  @ApiOperation({ summary: 'Listar', description: 'Lista todos os recursos' })
  @ProtectedRoute()
  @ApiPaginatedResponse(RequisitoDto)
  list(
    @Query('projeto') projetoId: number,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.requisitoService.list(projetoId, page, pageSize);
  }

  /**
   * Lista requisitos por nome com paginação
   * @param nome Nome para filtrar
   * @param projetoId ID do projeto
   * @param page Número da página
   * @param pageSize Tamanho da página
   * @returns Lista paginada de requisitos filtrados por nome
   */
  @Get('/findByNome')
  @ApiOperation({
    summary: 'Buscar',
    description: 'Busca recursos específicos',
  })
  @ProtectedRoute()
  @ApiPaginatedResponse(RequisitoDto)
  listByNamePaginated(
    @Query('nome') nome: string,
    @Query('projeto') projetoId: number,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.requisitoService.listByNamePaginated(
      nome,
      projetoId,
      page,
      pageSize,
    );
  }

  /**
   * Busca um requisito pelo ID
   * @param id ID do requisito
   * @returns Requisito encontrado
   */
  @Get('/findById')
  @ApiOperation({
    summary: 'Buscar',
    description: 'Busca recursos específicos',
  })
  @ProtectedRoute()
  @ApiOkResponse({ description: 'Requisito encontrado', type: RequisitoDto })
  getById(@Query('id') id: number) {
    return this.requisitoService.getById(id);
  }

  /**
   * Cria um novo requisito
   * @param createRequisitoDto Dados do requisito a ser criado
   * @param projetoId ID do projeto
   * @returns Requisito criado
   */
  @Post('/new')
  @ApiOperation({ summary: 'Criar', description: 'Cria um novo recurso' })
  @ApiCreatedResponse({ description: 'Recurso criado com sucesso' })
  @ProtectedRoute('admin', 'gerente', 'analista')
  @ApiOkResponse({
    description: 'Requisito criado com sucesso',
    type: RequisitoDto,
  })
  create(
    @Body() createRequisitoDto: CreateRequisitoDto,
    @Query('projeto') projetoId: number,
  ) {
    return this.requisitoService.create(createRequisitoDto, projetoId);
  }

  /**
   * Atualiza um requisito
   * @param updateRequisitoDto Dados a serem atualizados
   * @param projetoId ID do projeto
   * @param requisitoId ID do requisito
   * @returns Requisito atualizado
   */
  @Patch('/update')
  @ApiOperation({
    summary: 'Atualizar',
    description: 'Atualiza um recurso existente',
  })
  @ApiResponse({ status: 200, description: 'Recurso atualizado com sucesso' })
  @ProtectedRoute('admin', 'gerente', 'analista')
  @ApiOkResponse({
    description: 'Requisito atualizado com sucesso',
    type: RequisitoDto,
  })
  update(
    @Body() updateRequisitoDto: UpdateRequisitoDto,
    @Query('projeto') projetoId: number,
    @Query('requisito') requisitoId: number,
  ) {
    return this.requisitoService.update(
      updateRequisitoDto,
      projetoId,
      requisitoId,
    );
  }

  /**
   * Remove um requisito
   * @param requisitoId ID do requisito
   * @returns Mensagem de confirmação
   */
  @Delete('/delete')
  @ApiOperation({ summary: 'Remover', description: 'Remove um recurso' })
  @ApiResponse({ status: 200, description: 'Recurso removido com sucesso' })
  @ProtectedRoute('admin', 'gerente')
  @ApiOkResponse({ description: 'Requisito removido com sucesso' })
  delete(@Query('requisito') requisitoId: number) {
    return this.requisitoService.delete(requisitoId);
  }

  /**
   * Lista resultados de requisitos paginados
   * @param projetoId ID do projeto
   * @param page Número da página
   * @param pageSize Tamanho da página
   * @returns Lista paginada de resultados
   */
  @Get('/resultados/list')
  @ApiOperation({
    summary: 'Buscar',
    description: 'Busca recursos específicos',
  })
  @ProtectedRoute()
  @ApiPaginatedResponse(RequisitoDto)
  listResultados(
    @Query('projeto') projetoId: number,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.requisitoService.listResultados(projetoId, page, pageSize);
  }

  /**
   * Lista resultados de requisitos por nome
   * @param nome Nome para filtrar
   * @param projetoId ID do projeto
   * @param page Número da página
   * @param pageSize Tamanho da página
   * @returns Lista paginada de resultados filtrados por nome
   */
  @Get('/resultados/findByNome')
  @ApiOperation({
    summary: 'Buscar',
    description: 'Busca recursos específicos',
  })
  @ProtectedRoute()
  @ApiPaginatedResponse(RequisitoDto)
  listResultadosByName(
    @Query('nome') nome: string,
    @Query('projeto') projetoId: number,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.requisitoService.listResultadosByName(
      nome,
      projetoId,
      page,
      pageSize,
    );
  }

  /**
   * Lista priorização de stakeholders sem paginação
   * @param projetoId ID do projeto
   * @returns Lista de priorizações
   */
  @Get('/priorizacao-stakeholders')
  @ApiOperation({
    summary: 'Buscar',
    description: 'Busca recursos específicos',
  })
  @ProtectedRoute()
  @ApiOkResponse({ description: 'Lista de priorizações', type: [RequisitoDto] })
  listPriorizacaoStakeholdersWithoutPagination(
    @Query('projeto') projetoId: number,
  ) {
    return this.requisitoService.listPriorizacaoStakeholdersWithoutPagination(
      projetoId,
    );
  }

  /**
   * Lista priorização de stakeholders paginada
   * @param projetoId ID do projeto
   * @param stakeholderId ID do stakeholder
   * @param page Número da página
   * @param pageSize Tamanho da página
   * @returns Lista paginada de priorizações
   */
  @Get('/priorizacao-stakeholders/list')
  @ApiOperation({
    summary: 'Buscar',
    description: 'Busca recursos específicos',
  })
  @ProtectedRoute()
  @ApiPaginatedResponse(RequisitoDto)
  listPriorizacaoStakeholders(
    @Query('projeto') projetoId: number,
    @Query('stakeholder') stakeholderId: number,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.requisitoService.listPriorizacaoStakeholders(
      projetoId,
      stakeholderId,
      page,
      pageSize,
    );
  }

  /**
   * Lista priorização de stakeholders por nome
   * @param body Nome para filtrar
   * @param projetoId ID do projeto
   * @param stakeholderId ID do stakeholder
   * @param page Número da página
   * @param pageSize Tamanho da página
   * @returns Lista paginada de priorizações filtradas por nome
   */
  @Get('/priorizacao-stakeholders/findByNome')
  @ApiOperation({
    summary: 'Buscar',
    description: 'Busca recursos específicos',
  })
  @ProtectedRoute()
  @ApiPaginatedResponse(RequisitoDto)
  listPriorizacaoStakeholdersByNome(
    @Query('nome') body: string,
    @Query('projeto') projetoId: number,
    @Query('stakeholder') stakeholderId: number,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.requisitoService.listPriorizacaoStakeholdersByNome(
      body,
      projetoId,
      stakeholderId,
      page,
      pageSize,
    );
  }
}
