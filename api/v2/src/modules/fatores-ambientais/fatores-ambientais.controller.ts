import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProtectedRoute } from '../../decorators/protected-route.decorator';
import { CreateFatoresAmbientaiDto } from './dto/create-fatores-ambientai.dto';
import { UpdateFatoresAmbientaiDto } from './dto/update-fatores-ambientai.dto';
import { FatoresAmbientaisService } from './fatores-ambientais.service';

@ApiTags('Fatores Ambientais')
@Controller('fatores-ambientais')
export class FatoresAmbientaisController {
  constructor(
    private readonly fatoresAmbientaisService: FatoresAmbientaisService,
  ) {}

  /**
   * Cria um novo fator ambiental
   * @param createFatoresAmbientaiDto Dados do fator ambiental
   * @returns O fator ambiental criado
   */
  @ProtectedRoute('admin', 'gerente')
  @Post()
  @ApiOperation({ summary: 'Criar fator ambiental' })
  @ApiOkResponse({ description: 'Fator ambiental criado com sucesso' })
  create(@Body() createFatoresAmbientaiDto: CreateFatoresAmbientaiDto) {
    return this.fatoresAmbientaisService.create(createFatoresAmbientaiDto);
  }

  /**
   * Lista todos os fatores ambientais
   * @returns Lista de fatores ambientais
   */
  @ProtectedRoute()
  @Get()
  @ApiOperation({ summary: 'Listar fatores ambientais' })
  @ApiOkResponse({ description: 'Lista de fatores ambientais' })
  findAll() {
    return this.fatoresAmbientaisService.findAll();
  }

  /**
   * Busca um fator ambiental por ID
   * @param id ID do fator ambiental
   * @returns O fator ambiental encontrado
   */
  @ProtectedRoute()
  @Get(':id')
  @ApiOperation({ summary: 'Buscar fator ambiental por ID' })
  @ApiOkResponse({ description: 'Fator ambiental encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.fatoresAmbientaisService.findOne(id);
  }

  /**
   * Atualiza um fator ambiental
   * @param id ID do fator ambiental
   * @param updateFatoresAmbientaiDto Dados para atualização
   * @returns O fator ambiental atualizado
   */
  @ProtectedRoute('admin', 'gerente')
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar fator ambiental' })
  @ApiOkResponse({ description: 'Fator ambiental atualizado com sucesso' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFatoresAmbientaiDto: UpdateFatoresAmbientaiDto,
  ) {
    return this.fatoresAmbientaisService.update(id, updateFatoresAmbientaiDto);
  }

  /**
   * Remove um fator ambiental
   * @param id ID do fator ambiental
   * @returns Confirmação de remoção
   */
  @ProtectedRoute('admin', 'gerente')
  @Delete(':id')
  @ApiOperation({ summary: 'Remover fator ambiental' })
  @ApiOkResponse({ description: 'Fator ambiental removido com sucesso' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.fatoresAmbientaisService.remove(id);
  }
}
