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
import { ColaboradorProjetoService } from './colaborador-projeto.service';
import { CreateColaboradorProjetoDto } from './dto/create-colaborador-projeto.dto';
import { UpdateColaboradorProjetoDto } from './dto/update-colaborador-projeto.dto';

@ApiTags('Colaborador Projeto')
@ApiBearerAuth()
@Controller('colaborador-projeto')
export class ColaboradorProjetoController {
  constructor(
    private readonly colaboradorProjetoService: ColaboradorProjetoService,
  ) {}

  /**
   * Cria uma nova associação colaborador-projeto
   * @param createColaboradorProjetoDto Dados da associação
   * @returns A associação criada
   */
  @ProtectedRoute('admin', 'gerente')
  @Post()
  @ApiOperation({ summary: 'Criar', description: 'Cria um novo recurso' })
  @ApiCreatedResponse({ description: 'Recurso criado com sucesso' })
  @ApiOperation({ summary: 'Criar', description: 'Cria um novo recurso' })
  @ApiCreatedResponse({ description: 'Recurso criado com sucesso' })
  @ApiOkResponse({
    description: 'Associação colaborador-projeto criada com sucesso',
  })
  create(@Body() createColaboradorProjetoDto: CreateColaboradorProjetoDto) {
    return this.colaboradorProjetoService.create(createColaboradorProjetoDto);
  }

  /**
   * Lista todas as associações colaborador-projeto
   * @returns Lista de associações
   */
  @ProtectedRoute()
  @Get()
  @ApiOperation({
    summary: 'Buscar',
    description: 'Busca recursos específicos',
  })
  @ApiOperation({ summary: 'Listar', description: 'Lista todos os recursos' })
  @ApiOkResponse({ description: 'Lista de associações colaborador-projeto' })
  findAll() {
    return this.colaboradorProjetoService.findAll();
  }

  /**
   * Busca associações por projeto
   * @param projetoId ID do projeto
   * @returns Lista de associações
   */
  @ProtectedRoute()
  @Get('findByProjeto')
  @ApiOperation({
    summary: 'Buscar',
    description: 'Busca recursos específicos',
  })
  @ApiOkResponse({ description: 'Associações colaborador-projeto por projeto' })
  findByProjeto(@Query('projetoId') projetoId: string) {
    return this.colaboradorProjetoService.findByProjeto(+projetoId);
  }

  /**
   * Busca uma associação por ID
   * @param id ID da associação
   * @returns A associação encontrada
   */
  @ProtectedRoute()
  @Get(':id')
  @ApiOperation({
    summary: 'Buscar',
    description: 'Busca recursos específicos',
  })
  @ApiOkResponse({ description: 'Associação colaborador-projeto encontrada' })
  findOne(@Param('id') id: string) {
    return this.colaboradorProjetoService.findOne(+id);
  }

  /**
   * Atualiza uma associação colaborador-projeto
   * @param id ID da associação
   * @param updateColaboradorProjetoDto Dados para atualização
   * @returns A associação atualizada
   */
  @ProtectedRoute('admin', 'gerente')
  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar',
    description: 'Atualiza um recurso existente',
  })
  @ApiResponse({ status: 200, description: 'Recurso atualizado com sucesso' })
  @ApiOkResponse({
    description: 'Associação colaborador-projeto atualizada com sucesso',
  })
  update(
    @Param('id') id: string,
    @Body() updateColaboradorProjetoDto: UpdateColaboradorProjetoDto,
  ) {
    return this.colaboradorProjetoService.update(
      +id,
      updateColaboradorProjetoDto,
    );
  }

  /**
   * Remove uma associação colaborador-projeto
   * @param id ID da associação
   * @returns Confirmação de remoção
   */
  @ProtectedRoute('admin', 'gerente')
  @Delete(':id')
  @ApiOperation({ summary: 'Remover', description: 'Remove um recurso' })
  @ApiResponse({ status: 200, description: 'Recurso removido com sucesso' })
  @ApiOkResponse({
    description: 'Associação colaborador-projeto removida com sucesso',
  })
  remove(@Param('id') id: string) {
    return this.colaboradorProjetoService.remove(+id);
  }
}
