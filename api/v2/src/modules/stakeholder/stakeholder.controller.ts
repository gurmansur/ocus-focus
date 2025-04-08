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
import { CreateStakeholderDto } from './dto/create-stakeholder.dto';
import { UpdateStakeholderDto } from './dto/update-stakeholder.dto';
import { StakeholderService } from './stakeholder.service';

@ApiTags('Stakeholder')
@ApiBearerAuth()
@Controller('stakeholder')
export class StakeholderController {
  constructor(private readonly stakeholderService: StakeholderService) {}

  /**
   * Cria um novo stakeholder
   * @param createStakeholderDto Dados do stakeholder
   * @returns O stakeholder criado
   */
  @ProtectedRoute('admin', 'gerente')
  @Post()
  @ApiOperation({ summary: 'Criar', description: 'Cria um novo recurso' })
  @ApiCreatedResponse({ description: 'Recurso criado com sucesso' })
  @ApiOperation({ summary: 'Criar', description: 'Cria um novo recurso' })
  @ApiCreatedResponse({ description: 'Recurso criado com sucesso' })
  @ApiOkResponse({ description: 'Stakeholder criado com sucesso' })
  create(@Body() createStakeholderDto: CreateStakeholderDto) {
    return this.stakeholderService.create(createStakeholderDto);
  }

  /**
   * Lista todos os stakeholders
   * @returns Lista de stakeholders
   */
  @ProtectedRoute()
  @Get()
  @ApiOperation({
    summary: 'Buscar',
    description: 'Busca recursos específicos',
  })
  @ApiOperation({ summary: 'Listar', description: 'Lista todos os recursos' })
  @ApiOkResponse({ description: 'Lista de stakeholders' })
  findAll() {
    return this.stakeholderService.findAll();
  }

  /**
   * Busca stakeholders por projeto
   * @param projetoId ID do projeto
   * @returns Lista de stakeholders
   */
  @ProtectedRoute()
  @Get('findByProjeto')
  @ApiOperation({
    summary: 'Buscar',
    description: 'Busca recursos específicos',
  })
  @ApiOkResponse({ description: 'Stakeholders por projeto' })
  findByProjeto(@Query('projetoId') projetoId: string) {
    return this.stakeholderService.findByProjeto(+projetoId, 0, 10);
  }

  /**
   * Busca um stakeholder por ID
   * @param id ID do stakeholder
   * @returns O stakeholder encontrado
   */
  @ProtectedRoute()
  @Get(':id')
  @ApiOperation({
    summary: 'Buscar',
    description: 'Busca recursos específicos',
  })
  @ApiOkResponse({ description: 'Stakeholder encontrado' })
  findOne(@Param('id') id: string) {
    return this.stakeholderService.findOne(+id);
  }

  /**
   * Atualiza um stakeholder
   * @param id ID do stakeholder
   * @param updateStakeholderDto Dados para atualização
   * @returns O stakeholder atualizado
   */
  @ProtectedRoute('admin', 'gerente')
  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar',
    description: 'Atualiza um recurso existente',
  })
  @ApiResponse({ status: 200, description: 'Recurso atualizado com sucesso' })
  @ApiOkResponse({ description: 'Stakeholder atualizado com sucesso' })
  update(
    @Param('id') id: string,
    @Body() updateStakeholderDto: UpdateStakeholderDto,
  ) {
    return this.stakeholderService.updateStakeholder(+id, updateStakeholderDto);
  }

  /**
   * Remove um stakeholder
   * @param id ID do stakeholder
   * @returns Confirmação de remoção
   */
  @ProtectedRoute('admin', 'gerente')
  @Delete(':id')
  @ApiOperation({ summary: 'Remover', description: 'Remove um recurso' })
  @ApiResponse({ status: 200, description: 'Recurso removido com sucesso' })
  @ApiOkResponse({ description: 'Stakeholder removido com sucesso' })
  remove(@Param('id') id: string) {
    return this.stakeholderService.remove(+id);
  }
}
