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
import { CreateResultadoRequisitoDto } from './dto/create-resultado-requisito.dto';
import { UpdateResultadoRequisitoDto } from './dto/update-resultado-requisito.dto';
import { ResultadoRequisitoService } from './resultado-requisito.service';

@ApiTags('Resultado Requisito')
@Controller('resultado-requisito')
export class ResultadoRequisitoController {
  constructor(
    private readonly resultadoRequisitoService: ResultadoRequisitoService,
  ) {}

  /**
   * Cria um novo resultado de requisito
   * @param createResultadoRequisitoDto Dados do resultado
   * @returns O resultado criado
   */
  @ProtectedRoute('admin', 'gerente', 'analista')
  @Post()
  @ApiOperation({ summary: 'Criar resultado de requisito' })
  @ApiOkResponse({ description: 'Resultado de requisito criado com sucesso' })
  create(@Body() createResultadoRequisitoDto: CreateResultadoRequisitoDto) {
    return this.resultadoRequisitoService.create(createResultadoRequisitoDto);
  }

  /**
   * Lista todos os resultados de requisitos
   * @returns Lista de resultados
   */
  @ProtectedRoute()
  @Get()
  @ApiOperation({ summary: 'Listar resultados de requisitos' })
  @ApiOkResponse({ description: 'Lista de resultados de requisitos' })
  findAll() {
    return this.resultadoRequisitoService.findAll();
  }

  /**
   * Busca um resultado de requisito por ID
   * @param id ID do resultado
   * @returns O resultado encontrado
   */
  @ProtectedRoute()
  @Get(':id')
  @ApiOperation({ summary: 'Buscar resultado de requisito por ID' })
  @ApiOkResponse({ description: 'Resultado de requisito encontrado' })
  findOne(@Param('id') id: number) {
    return this.resultadoRequisitoService.findOne(id);
  }

  /**
   * Atualiza um resultado de requisito
   * @param id ID do resultado
   * @param updateResultadoRequisitoDto Dados para atualização
   * @returns O resultado atualizado
   */
  @ProtectedRoute('admin', 'gerente', 'analista')
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar resultado de requisito' })
  @ApiOkResponse({
    description: 'Resultado de requisito atualizado com sucesso',
  })
  update(
    @Param('id') id: number,
    @Body() updateResultadoRequisitoDto: UpdateResultadoRequisitoDto,
  ) {
    return this.resultadoRequisitoService.update(
      id,
      updateResultadoRequisitoDto,
    );
  }

  /**
   * Remove um resultado de requisito
   * @param id ID do resultado
   * @returns Confirmação de remoção
   */
  @ProtectedRoute('admin', 'gerente')
  @Delete(':id')
  @ApiOperation({ summary: 'Remover resultado de requisito' })
  @ApiOkResponse({ description: 'Resultado de requisito removido com sucesso' })
  remove(@Param('id') id: number) {
    return this.resultadoRequisitoService.remove(id);
  }
}
