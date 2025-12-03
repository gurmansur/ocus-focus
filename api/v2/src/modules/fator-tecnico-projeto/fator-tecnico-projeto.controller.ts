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
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProtectedRoute } from '../../decorators/protected-route.decorator';
import { CreateFatorTecnicoProjetoDto } from './dto/create-fator-tecnico-projeto.dto';
import { UpdateFatorTecnicoProjetoDto } from './dto/update-fator-tecnico-projeto.dto';
import { FatorTecnicoProjetoService } from './fator-tecnico-projeto.service';

@ApiTags('Fator Técnico Projeto')
@Controller('fator-tecnico-projeto')
export class FatorTecnicoProjetoController {
  constructor(
    private readonly fatorTecnicoProjetoService: FatorTecnicoProjetoService,
  ) {}

  /**
   * Cria um novo fator técnico para o projeto
   * @param createFatorTecnicoProjetoDto Dados do fator técnico
   * @param projetoId ID do projeto
   * @returns O fator técnico criado
   */
  @ProtectedRoute('admin', 'gerente', 'analista')
  @Post()
  @ApiOperation({ summary: 'Criar fator técnico' })
  @ApiOkResponse({ description: 'Fator técnico criado com sucesso' })
  create(
    @Body() createFatorTecnicoProjetoDto: CreateFatorTecnicoProjetoDto,
    @Query('projeto') projetoId: number,
  ) {
    return this.fatorTecnicoProjetoService.create(
      projetoId,
      createFatorTecnicoProjetoDto,
    );
  }

  /**
   * Lista todos os fatores técnicos do projeto
   * @param projetoId ID do projeto
   * @param page Número da página
   * @param pageSize Tamanho da página
   * @returns Lista paginada de fatores técnicos
   */
  @ProtectedRoute()
  @Get()
  @ApiOperation({ summary: 'Listar fatores técnicos' })
  @ApiOkResponse({ description: 'Lista de fatores técnicos do projeto' })
  findAll(
    @Query('projeto') projetoId: number,
    @Query('page') page?: number,
    @Query('size') pageSize?: number,
  ) {
    return this.fatorTecnicoProjetoService.findAll(
      projetoId,
      page || 0,
      pageSize || 10,
    );
  }

  /**
   * Busca um fator técnico do projeto por ID
   * @param id ID do fator técnico
   * @returns O fator técnico encontrado
   */
  @ProtectedRoute()
  @Get(':id')
  @ApiOperation({ summary: 'Buscar fator técnico por ID' })
  @ApiOkResponse({ description: 'Fator técnico do projeto encontrado' })
  findOne(@Param('id') id: number) {
    return this.fatorTecnicoProjetoService.getById(id);
  }

  /**
   * Atualiza um fator técnico do projeto
   * @param id ID do fator técnico
   * @param updateFatorTecnicoProjetoDto Dados para atualização
   * @returns O fator técnico atualizado
   */
  @ProtectedRoute('admin', 'gerente', 'analista')
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar fator técnico' })
  @ApiOkResponse({
    description: 'Fator técnico do projeto atualizado com sucesso',
  })
  update(
    @Param('id') id: number,
    @Body() updateFatorTecnicoProjetoDto: UpdateFatorTecnicoProjetoDto,
  ) {
    return this.fatorTecnicoProjetoService.update(
      id,
      updateFatorTecnicoProjetoDto,
    );
  }

  /**
   * Remove um fator técnico do projeto
   * @param id ID do fator técnico
   * @returns Confirmação de remoção
   */
  @ProtectedRoute('admin', 'gerente')
  @Delete(':id')
  @ApiOperation({ summary: 'Remover fator técnico' })
  @ApiOkResponse({
    description: 'Fator técnico do projeto removido com sucesso',
  })
  remove(@Param('id') id: number) {
    return this.fatorTecnicoProjetoService.remove(id);
  }
}
