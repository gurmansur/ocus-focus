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
import { ProtectedRoute } from '../../decorators/protected-route.decorator';
import { CreateKanbanDto } from './dto/create-kanban.dto';
import { UpdateKanbanDto } from './dto/update-kanban.dto';
import { KanbanService } from './kanban.service';

@ApiTags('Kanban')
@ApiBearerAuth()
@Controller('kanban')
export class KanbanController {
  constructor(private readonly kanbanService: KanbanService) {}

  /**
   * Cria um novo quadro kanban
   * @param createKanbanDto Dados do quadro kanban
   * @returns O quadro kanban criado
   */
  @ProtectedRoute('admin', 'gerente')
  @Post()
  @ApiOperation({
    summary: 'Criar quadro kanban',
    description: 'Cria um novo quadro kanban no sistema',
  })
  @ApiBody({
    type: CreateKanbanDto,
    description: 'Dados do quadro kanban a ser criado',
  })
  @ApiCreatedResponse({ description: 'Quadro kanban criado com sucesso' })
  create(@Body() createKanbanDto: CreateKanbanDto) {
    return this.kanbanService.create(createKanbanDto);
  }

  /**
   * Lista todos os quadros kanban
   * @returns Lista de quadros kanban
   */
  @ProtectedRoute()
  @Get()
  @ApiOperation({
    summary: 'Listar quadros kanban',
    description: 'Retorna uma lista de todos os quadros kanban',
  })
  @ApiOkResponse({ description: 'Lista de quadros kanban' })
  findAll() {
    return this.kanbanService.findAll();
  }

  /**
   * Busca quadros kanban por projeto
   * @param projetoId ID do projeto
   * @returns Lista de quadros kanban
   */
  @ProtectedRoute()
  @Get('findByProjeto')
  @ApiOperation({
    summary: 'Buscar quadros kanban por projeto',
    description:
      'Retorna a lista de quadros kanban associados a um projeto específico',
  })
  @ApiQuery({
    name: 'projetoId',
    type: String,
    description: 'ID do projeto',
    required: true,
  })
  @ApiOkResponse({ description: 'Quadros kanban por projeto' })
  @ApiNotFoundResponse({ description: 'Projeto não encontrado' })
  findByProjeto(@Query('projetoId') projetoId: string) {
    return this.kanbanService.findByProjeto(+projetoId);
  }

  /**
   * Busca um quadro kanban por ID
   * @param id ID do quadro kanban
   * @returns O quadro kanban encontrado
   */
  @ProtectedRoute()
  @Get(':id')
  @ApiOperation({
    summary: 'Buscar quadro kanban por ID',
    description: 'Retorna um quadro kanban específico pelo seu ID',
  })
  @ApiParam({ name: 'id', description: 'ID do quadro kanban', type: String })
  @ApiOkResponse({ description: 'Quadro kanban encontrado' })
  @ApiNotFoundResponse({ description: 'Quadro kanban não encontrado' })
  findOne(@Param('id') id: string) {
    return this.kanbanService.findOne(+id);
  }

  /**
   * Atualiza um quadro kanban
   * @param id ID do quadro kanban
   * @param updateKanbanDto Dados para atualização
   * @returns O quadro kanban atualizado
   */
  @ProtectedRoute('admin', 'gerente')
  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar quadro kanban',
    description: 'Atualiza um quadro kanban existente',
  })
  @ApiParam({ name: 'id', description: 'ID do quadro kanban', type: String })
  @ApiBody({
    type: UpdateKanbanDto,
    description: 'Dados atualizados do quadro kanban',
  })
  @ApiOkResponse({ description: 'Quadro kanban atualizado com sucesso' })
  @ApiNotFoundResponse({ description: 'Quadro kanban não encontrado' })
  update(@Param('id') id: string, @Body() updateKanbanDto: UpdateKanbanDto) {
    return this.kanbanService.update(+id, updateKanbanDto);
  }

  /**
   * Remove um quadro kanban
   * @param id ID do quadro kanban
   * @returns Confirmação de remoção
   */
  @ProtectedRoute('admin', 'gerente')
  @Delete(':id')
  @ApiOperation({
    summary: 'Remover quadro kanban',
    description: 'Remove um quadro kanban do sistema',
  })
  @ApiParam({ name: 'id', description: 'ID do quadro kanban', type: String })
  @ApiOkResponse({ description: 'Quadro kanban removido com sucesso' })
  @ApiNotFoundResponse({ description: 'Quadro kanban não encontrado' })
  remove(@Param('id') id: string) {
    return this.kanbanService.remove(+id);
  }
}
