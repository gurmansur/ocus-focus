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
import { CreateSubtarefaDto } from './dto/create-subtarefa.dto';
import { UpdateSubtarefaDto } from './dto/update-subtarefa.dto';
import { SubtarefaService } from './subtarefa.service';

@ApiTags('Subtarefa')
@ApiBearerAuth()
@Controller('subtarefa')
export class SubtarefaController {
  constructor(private readonly subtarefaService: SubtarefaService) {}

  /**
   * Cria uma nova subtarefa
   * @param createSubtarefaDto Dados da subtarefa
   * @returns A subtarefa criada
   */
  @ProtectedRoute('admin', 'gerente', 'analista', 'desenvolvedor')
  @Post()
  @ApiOperation({ summary: 'Criar', description: 'Cria um novo recurso' })
  @ApiCreatedResponse({ description: 'Recurso criado com sucesso' })
  @ApiOperation({ summary: 'Criar', description: 'Cria um novo recurso' })
  @ApiCreatedResponse({ description: 'Recurso criado com sucesso' })
  @ApiOkResponse({ description: 'Subtarefa criada com sucesso' })
  create(@Body() createSubtarefaDto: CreateSubtarefaDto) {
    return this.subtarefaService.create(createSubtarefaDto);
  }

  /**
   * Lista todas as subtarefas
   * @returns Lista de subtarefas
   */
  @ProtectedRoute()
  @Get()
  @ApiOperation({
    summary: 'Buscar',
    description: 'Busca recursos específicos',
  })
  @ApiOperation({ summary: 'Listar', description: 'Lista todos os recursos' })
  @ApiOkResponse({ description: 'Lista de subtarefas' })
  findAll() {
    return this.subtarefaService.findAll();
  }

  /**
   * Busca subtarefas por tarefa
   * @param tarefaId ID da tarefa
   * @returns Lista de subtarefas
   */
  @ProtectedRoute()
  @Get('findByTarefa')
  @ApiOperation({
    summary: 'Buscar',
    description: 'Busca recursos específicos',
  })
  @ApiOkResponse({ description: 'Subtarefas por tarefa' })
  findByTarefa(@Query('tarefaId') tarefaId: string) {
    return this.subtarefaService.findByTarefa(+tarefaId);
  }

  /**
   * Busca uma subtarefa por ID
   * @param id ID da subtarefa
   * @returns A subtarefa encontrada
   */
  @ProtectedRoute()
  @Get(':id')
  @ApiOperation({
    summary: 'Buscar',
    description: 'Busca recursos específicos',
  })
  @ApiOkResponse({ description: 'Subtarefa encontrada' })
  findOne(@Param('id') id: string) {
    return this.subtarefaService.findOne(+id);
  }

  /**
   * Atualiza uma subtarefa
   * @param id ID da subtarefa
   * @param updateSubtarefaDto Dados para atualização
   * @returns A subtarefa atualizada
   */
  @ProtectedRoute('admin', 'gerente', 'analista', 'desenvolvedor')
  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar',
    description: 'Atualiza um recurso existente',
  })
  @ApiResponse({ status: 200, description: 'Recurso atualizado com sucesso' })
  @ApiOkResponse({ description: 'Subtarefa atualizada com sucesso' })
  update(
    @Param('id') id: string,
    @Body() updateSubtarefaDto: UpdateSubtarefaDto,
  ) {
    return this.subtarefaService.update(+id, updateSubtarefaDto);
  }

  /**
   * Remove uma subtarefa
   * @param id ID da subtarefa
   * @returns Confirmação de remoção
   */
  @ProtectedRoute('admin', 'gerente')
  @Delete(':id')
  @ApiOperation({ summary: 'Remover', description: 'Remove um recurso' })
  @ApiResponse({ status: 200, description: 'Recurso removido com sucesso' })
  @ApiOkResponse({ description: 'Subtarefa removida com sucesso' })
  remove(@Param('id') id: string) {
    return this.subtarefaService.remove(+id);
  }
}
