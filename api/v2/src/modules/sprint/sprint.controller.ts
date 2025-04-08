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
import { ProtectedRoute } from '../../decorators/protected-route.decorator';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import { SprintService } from './sprint.service';

@ApiTags('Sprint')
@ApiBearerAuth()
@Controller('sprint')
export class SprintController {
  constructor(private readonly sprintService: SprintService) {}

  /**
   * Cria uma nova sprint
   * @param createSprintDto Dados da sprint
   * @returns A sprint criada
   */
  @ProtectedRoute('admin', 'gerente', 'scrum_master')
  @Post()
  @ApiOperation({ summary: 'Criar', description: 'Cria um novo recurso' })
  @ApiCreatedResponse({ description: 'Recurso criado com sucesso' })
  @ApiOperation({ summary: 'Criar', description: 'Cria um novo recurso' })
  @ApiCreatedResponse({ description: 'Recurso criado com sucesso' })
  @ApiOkResponse({ description: 'Sprint criada com sucesso' })
  create(@Body() createSprintDto: CreateSprintDto) {
    return this.sprintService.create(createSprintDto);
  }

  /**
   * Lista todas as sprints
   * @returns Lista de sprints
   */
  @ProtectedRoute()
  @Get()
  @ApiOperation({
    summary: 'Buscar',
    description: 'Busca recursos específicos',
  })
  @ApiOperation({ summary: 'Listar', description: 'Lista todos os recursos' })
  @ApiOkResponse({ description: 'Lista de sprints' })
  findAll() {
    return this.sprintService.findAll();
  }

  /**
   * Busca sprints por projeto
   * @param projetoId ID do projeto
   * @returns Lista de sprints
   */
  @ProtectedRoute()
  @Get('findByProjeto')
  @ApiOperation({
    summary: 'Buscar',
    description: 'Busca recursos específicos',
  })
  @ApiOkResponse({ description: 'Sprints por projeto' })
  findByProjeto(@Query('projetoId') projetoId: string) {
    return this.sprintService.findByProjeto(+projetoId);
  }

  /**
   * Busca uma sprint por ID
   * @param id ID da sprint
   * @returns A sprint encontrada
   */
  @ProtectedRoute()
  @Get(':id')
  @ApiOperation({
    summary: 'Buscar',
    description: 'Busca recursos específicos',
  })
  @ApiOkResponse({ description: 'Sprint encontrada' })
  findOne(@Param('id') id: string) {
    return this.sprintService.findOne(+id);
  }

  /**
   * Atualiza uma sprint
   * @param id ID da sprint
   * @param updateSprintDto Dados para atualização
   * @returns A sprint atualizada
   */
  @ProtectedRoute('admin', 'gerente', 'scrum_master')
  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar',
    description: 'Atualiza um recurso existente',
  })
  @ApiResponse({ status: 200, description: 'Recurso atualizado com sucesso' })
  @ApiOkResponse({ description: 'Sprint atualizada com sucesso' })
  update(@Param('id') id: string, @Body() updateSprintDto: UpdateSprintDto) {
    return this.sprintService.update(+id, updateSprintDto);
  }

  /**
   * Remove uma sprint
   * @param id ID da sprint
   * @returns Confirmação de remoção
   */
  @ProtectedRoute('admin', 'gerente', 'scrum_master')
  @Delete(':id')
  @ApiOperation({ summary: 'Remover', description: 'Remove um recurso' })
  @ApiResponse({ status: 200, description: 'Recurso removido com sucesso' })
  @ApiOkResponse({ description: 'Sprint removida com sucesso' })
  remove(@Param('id') id: string) {
    return this.sprintService.remove(+id);
  }
}
