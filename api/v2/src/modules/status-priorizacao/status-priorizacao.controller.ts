import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProtectedRoute } from '../../decorators/protected-route.decorator';
import { CreateStatusPriorizacaoDto } from './dto/create-status-priorizacao.dto';
import { UpdateStatusPriorizacaoDto } from './dto/update-status-priorizacao.dto';
import { StatusPriorizacaoService } from './status-priorizacao.service';

@ApiTags('Status Priorização')
@Controller('status-priorizacao')
export class StatusPriorizacaoController {
  constructor(
    private readonly statusPriorizacaoService: StatusPriorizacaoService,
  ) {}

  /**
   * Cria um novo status de priorização
   * @param createStatusPriorizacaoDto Dados do status
   * @returns O status criado
   */
  @ProtectedRoute('admin', 'gerente')
  @Post()
  @ApiOperation({ summary: 'Criar status de priorização' })
  @ApiOkResponse({ description: 'Status de priorização criado com sucesso' })
  create(@Body() createStatusPriorizacaoDto: CreateStatusPriorizacaoDto) {
    return `This action adds a new statusPriorizacao`;
  }

  /**
   * Lista todos os status de priorização
   * @returns Lista de status
   */
  @ProtectedRoute()
  @Get()
  @ApiOperation({ summary: 'Listar status de priorização' })
  @ApiOkResponse({ description: 'Lista de status de priorização' })
  findAll() {
    return this.statusPriorizacaoService.findAll();
  }

  /**
   * Busca um status de priorização por ID
   * @param id ID do status
   * @returns O status encontrado
   */
  @ProtectedRoute()
  @Get(':id')
  @ApiOperation({ summary: 'Buscar status de priorização por ID' })
  @ApiOkResponse({ description: 'Status de priorização encontrado' })
  findOne(@Param('id') id: number) {
    return this.statusPriorizacaoService.findOne(id);
  }

  /**
   * Atualiza um status de priorização
   * @param id ID do status
   * @param updateStatusPriorizacaoDto Dados para atualização
   * @returns O status atualizado
   */
  @ProtectedRoute('admin', 'gerente')
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar status de priorização' })
  @ApiOkResponse({
    description: 'Status de priorização atualizado com sucesso',
  })
  update(
    @Param('id') id: number,
    @Body() updateStatusPriorizacaoDto: UpdateStatusPriorizacaoDto,
  ) {
    return this.statusPriorizacaoService.update(id);
  }

  /**
   * Remove um status de priorização
   * @param id ID do status
   * @returns Confirmação de remoção
   */
  @ProtectedRoute('admin', 'gerente')
  @Delete(':id')
  @ApiOperation({ summary: 'Remover status de priorização' })
  @ApiOkResponse({ description: 'Status de priorização removido com sucesso' })
  remove(@Param('id') id: number) {
    return this.statusPriorizacaoService.remove(id);
  }
}
