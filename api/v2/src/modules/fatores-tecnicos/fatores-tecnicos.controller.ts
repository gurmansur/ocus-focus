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
import { CreateFatoresTecnicoDto } from './dto/create-fatores-tecnico.dto';
import { UpdateFatoresTecnicoDto } from './dto/update-fatores-tecnico.dto';
import { FatoresTecnicosService } from './fatores-tecnicos.service';

@ApiTags('Fatores Técnicos')
@Controller('fatores-tecnicos')
export class FatoresTecnicosController {
  constructor(
    private readonly fatoresTecnicosService: FatoresTecnicosService,
  ) {}

  /**
   * Cria um novo fator técnico
   * @param createFatoresTecnicoDto Dados do fator técnico
   * @returns O fator técnico criado
   */
  @ProtectedRoute('admin', 'gerente')
  @Post()
  @ApiOperation({ summary: 'Criar fator técnico' })
  @ApiOkResponse({ description: 'Fator técnico criado com sucesso' })
  create(@Body() createFatoresTecnicoDto: CreateFatoresTecnicoDto) {
    return this.fatoresTecnicosService.create(createFatoresTecnicoDto);
  }

  /**
   * Lista todos os fatores técnicos
   * @returns Lista de fatores técnicos
   */
  @ProtectedRoute()
  @Get()
  @ApiOperation({ summary: 'Listar fatores técnicos' })
  @ApiOkResponse({ description: 'Lista de fatores técnicos' })
  findAll() {
    return this.fatoresTecnicosService.findAll();
  }

  /**
   * Busca um fator técnico por ID
   * @param id ID do fator técnico
   * @returns O fator técnico encontrado
   */
  @ProtectedRoute()
  @Get(':id')
  @ApiOperation({ summary: 'Buscar fator técnico por ID' })
  @ApiOkResponse({ description: 'Fator técnico encontrado' })
  findOne(@Param('id') id: number) {
    return this.fatoresTecnicosService.findOne(id);
  }

  /**
   * Atualiza um fator técnico
   * @param id ID do fator técnico
   * @param updateFatoresTecnicoDto Dados para atualização
   * @returns O fator técnico atualizado
   */
  @ProtectedRoute('admin', 'gerente')
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar fator técnico' })
  @ApiOkResponse({ description: 'Fator técnico atualizado com sucesso' })
  update(
    @Param('id') id: number,
    @Body() updateFatoresTecnicoDto: UpdateFatoresTecnicoDto,
  ) {
    return this.fatoresTecnicosService.update(id, updateFatoresTecnicoDto);
  }

  /**
   * Remove um fator técnico
   * @param id ID do fator técnico
   * @returns Confirmação de remoção
   */
  @ProtectedRoute('admin', 'gerente')
  @Delete(':id')
  @ApiOperation({ summary: 'Remover fator técnico' })
  @ApiOkResponse({ description: 'Fator técnico removido com sucesso' })
  remove(@Param('id') id: number) {
    return this.fatoresTecnicosService.remove(id);
  }
}
