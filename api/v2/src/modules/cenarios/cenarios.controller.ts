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
import { CenariosService } from './cenarios.service';
import { CreateCenarioDto } from './dto/create-cenario.dto';
import { UpdateCenarioDto } from './dto/update-cenario.dto';

@ApiTags('Cenários')
@ApiBearerAuth()
@Controller('cenarios')
export class CenariosController {
  constructor(private readonly cenariosService: CenariosService) {}

  /**
   * Cria um novo cenário
   * @param createCenarioDto Dados do cenário
   * @returns O cenário criado
   */
  @ProtectedRoute('admin', 'gerente', 'analista', 'testador')
  @Post()
  @ApiOperation({ summary: 'Criar', description: 'Cria um novo recurso' })
  @ApiCreatedResponse({ description: 'Recurso criado com sucesso' })
  @ApiOperation({ summary: 'Criar', description: 'Cria um novo recurso' })
  @ApiCreatedResponse({ description: 'Recurso criado com sucesso' })
  @ApiOkResponse({ description: 'Cenário criado com sucesso' })
  create(@Body() createCenarioDto: CreateCenarioDto) {
    return this.cenariosService.create(createCenarioDto);
  }

  /**
   * Lista todos os cenários
   * @param casoId ID do caso de uso
   * @param page Número da página
   * @param pageSize Tamanho da página
   * @returns Lista de cenários
   */
  @ProtectedRoute()
  @Get()
  @ApiOperation({
    summary: 'Buscar',
    description: 'Busca recursos específicos',
  })
  @ApiOperation({ summary: 'Listar', description: 'Lista todos os recursos' })
  @ApiOkResponse({ description: 'Lista de cenários' })
  findAll(
    @Query('casoId') casoId: number,
    @Query('page') page: number = 0,
    @Query('pageSize') pageSize: number = 10,
  ) {
    return this.cenariosService.findAll(casoId, page, pageSize);
  }

  /**
   * Busca cenários por nome
   * @param nome Nome para filtrar
   * @returns Lista de cenários
   */
  @ProtectedRoute()
  @Get('findByNome')
  @ApiOperation({
    summary: 'Buscar',
    description: 'Busca recursos específicos',
  })
  @ApiOkResponse({ description: 'Cenários por nome' })
  findByNome(@Query('nome') nome: string) {
    return this.cenariosService.findByNome(nome);
  }

  /**
   * Busca cenários por caso de uso
   * @param casoId ID do caso de uso
   * @returns Lista de cenários
   */
  @ProtectedRoute()
  @Get('findByCasoUso')
  @ApiOperation({
    summary: 'Buscar',
    description: 'Busca recursos específicos',
  })
  @ApiOkResponse({ description: 'Cenários por caso de uso' })
  findByCasoUso(@Query('casoId') casoId: number) {
    return this.cenariosService.findAll(casoId);
  }

  /**
   * Busca um cenário por ID
   * @param id ID do cenário
   * @returns O cenário encontrado
   */
  @ProtectedRoute()
  @Get(':id')
  @ApiOperation({
    summary: 'Buscar',
    description: 'Busca recursos específicos',
  })
  @ApiOkResponse({ description: 'Cenário encontrado' })
  findOne(@Param('id') id: string) {
    return this.cenariosService.findOne(+id);
  }

  /**
   * Atualiza um cenário
   * @param id ID do cenário
   * @param updateCenarioDto Dados para atualização
   * @param casoId ID do caso de uso
   * @returns O cenário atualizado
   */
  @ProtectedRoute('admin', 'gerente', 'analista', 'testador')
  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar',
    description: 'Atualiza um recurso existente',
  })
  @ApiResponse({ status: 200, description: 'Recurso atualizado com sucesso' })
  @ApiOkResponse({ description: 'Cenário atualizado com sucesso' })
  update(
    @Param('id') id: string,
    @Body() updateCenarioDto: UpdateCenarioDto,
    @Query('casoId') casoId: number,
  ) {
    return this.cenariosService.update(+id, casoId, updateCenarioDto);
  }

  /**
   * Remove um cenário
   * @param id ID do cenário
   * @returns Confirmação de remoção
   */
  @ProtectedRoute('admin', 'gerente')
  @Delete(':id')
  @ApiOperation({ summary: 'Remover', description: 'Remove um recurso' })
  @ApiResponse({ status: 200, description: 'Recurso removido com sucesso' })
  @ApiOkResponse({ description: 'Cenário removido com sucesso' })
  remove(@Param('id') id: string) {
    return this.cenariosService.remove(+id);
  }
}
