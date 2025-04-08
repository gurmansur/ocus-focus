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
import { CreateFatorAmbientalProjetoDto } from './dto/create-fator-ambiental-projeto.dto';
import { UpdateFatorAmbientalProjetoDto } from './dto/update-fator-ambiental-projeto.dto';
import { FatorAmbientalProjetoService } from './fator-ambiental-projeto.service';

@ApiTags('Fator Ambiental Projeto')
@ApiBearerAuth()
@Controller('fator-ambiental-projeto')
export class FatorAmbientalProjetoController {
  constructor(
    private readonly fatorAmbientalProjetoService: FatorAmbientalProjetoService,
  ) {}

  /**
   * Cria um novo fator ambiental para o projeto
   * @param createFatorAmbientalProjetoDto Dados do fator ambiental
   * @returns O fator ambiental criado
   */
  @ProtectedRoute('admin', 'gerente', 'analista')
  @Post()
  @ApiOperation({ summary: 'Criar', description: 'Cria um novo recurso' })
  @ApiCreatedResponse({ description: 'Recurso criado com sucesso' })
  @ApiOperation({ summary: 'Criar', description: 'Cria um novo recurso' })
  @ApiCreatedResponse({ description: 'Recurso criado com sucesso' })
  @ApiOkResponse({ description: 'Fator ambiental criado com sucesso' })
  create(
    @Body() createFatorAmbientalProjetoDto: CreateFatorAmbientalProjetoDto,
  ) {
    return this.fatorAmbientalProjetoService.create(
      createFatorAmbientalProjetoDto.projetoId,
      createFatorAmbientalProjetoDto,
    );
  }

  /**
   * Lista todos os fatores ambientais do projeto
   * @returns Lista de fatores ambientais
   */
  @ProtectedRoute()
  @Get()
  @ApiOperation({
    summary: 'Buscar',
    description: 'Busca recursos específicos',
  })
  @ApiOperation({ summary: 'Listar', description: 'Lista todos os recursos' })
  @ApiOkResponse({ description: 'Lista de fatores ambientais do projeto' })
  findAll(@Query('projetoId') projetoId: string) {
    return this.fatorAmbientalProjetoService.findAll(+projetoId);
  }

  /**
   * Busca fatores ambientais por projeto
   * @param projetoId ID do projeto
   * @returns Lista de fatores ambientais
   */
  @ProtectedRoute()
  @Get('findByProjeto')
  @ApiOperation({
    summary: 'Buscar',
    description: 'Busca recursos específicos',
  })
  @ApiOkResponse({ description: 'Fatores ambientais por projeto' })
  findByProjeto(@Query('projetoId') projetoId: string) {
    return this.fatorAmbientalProjetoService.findByProjeto(+projetoId);
  }

  /**
   * Busca um fator ambiental do projeto por ID
   * @param id ID do fator ambiental
   * @returns O fator ambiental encontrado
   */
  @ProtectedRoute()
  @Get(':id')
  @ApiOperation({
    summary: 'Buscar',
    description: 'Busca recursos específicos',
  })
  @ApiOkResponse({ description: 'Fator ambiental do projeto encontrado' })
  findOne(@Param('id') id: string) {
    return this.fatorAmbientalProjetoService.findOne(+id);
  }

  /**
   * Atualiza um fator ambiental do projeto
   * @param id ID do fator ambiental
   * @param updateFatorAmbientalProjetoDto Dados para atualização
   * @returns O fator ambiental atualizado
   */
  @ProtectedRoute('admin', 'gerente', 'analista')
  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar',
    description: 'Atualiza um recurso existente',
  })
  @ApiResponse({ status: 200, description: 'Recurso atualizado com sucesso' })
  @ApiOkResponse({
    description: 'Fator ambiental do projeto atualizado com sucesso',
  })
  update(
    @Param('id') id: string,
    @Body() updateFatorAmbientalProjetoDto: UpdateFatorAmbientalProjetoDto,
  ) {
    return this.fatorAmbientalProjetoService.update(
      +id,
      updateFatorAmbientalProjetoDto,
    );
  }

  /**
   * Remove um fator ambiental do projeto
   * @param id ID do fator ambiental
   * @returns Confirmação de remoção
   */
  @ProtectedRoute('admin', 'gerente')
  @Delete(':id')
  @ApiOperation({ summary: 'Remover', description: 'Remove um recurso' })
  @ApiResponse({ status: 200, description: 'Recurso removido com sucesso' })
  @ApiOkResponse({
    description: 'Fator ambiental do projeto removido com sucesso',
  })
  remove(@Param('id') id: string) {
    return this.fatorAmbientalProjetoService.remove(+id);
  }
}
