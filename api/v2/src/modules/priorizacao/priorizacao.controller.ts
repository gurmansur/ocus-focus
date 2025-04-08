import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProtectedRoute } from '../../decorators/protected-route.decorator';
import { CreatePriorizacaoDto } from './dto/create-priorizacao.dto';
import { PriorizacaoService } from './priorizacao.service';

@ApiTags('Priorização')
@Controller('priorizacao')
export class PriorizacaoController {
  constructor(private readonly priorizacaoService: PriorizacaoService) {}

  /**
   * Cria uma nova priorização
   */
  @ProtectedRoute('admin', 'gerente', 'analista', 'stakeholder')
  @Post()
  @ApiOperation({ summary: 'Criar priorização' })
  @ApiOkResponse({ description: 'Priorização criada com sucesso' })
  createPriorizacao(
    @Body() createPriorizacaoDto: CreatePriorizacaoDto,
    @Query('stakeholder', ParseIntPipe) stakeholderId: number,
  ) {
    return this.priorizacaoService.createPriorizacao(
      createPriorizacaoDto,
      stakeholderId,
    );
  }

  /**
   * Cria um resultado de priorização
   */
  @ProtectedRoute('admin', 'gerente', 'analista')
  @Post('resultado')
  @ApiOperation({ summary: 'Criar resultado de priorização' })
  @ApiOkResponse({ description: 'Resultado de priorização criado com sucesso' })
  createResultado(
    @Query('requisito', ParseIntPipe) requisitoId: number,
    @Query('resultado')
    resultadoFinal:
      | 'DEVE SER FEITO'
      | 'PERFORMANCE'
      | 'ATRATIVO'
      | 'INDIFERENTE'
      | 'QUESTIONAVEL'
      | 'REVERSO',
  ) {
    return this.priorizacaoService.createResultado(requisitoId, resultadoFinal);
  }

  /**
   * Busca priorizações por projeto
   */
  @ProtectedRoute()
  @Get()
  @ApiOperation({ summary: 'Listar priorizações por projeto' })
  @ApiOkResponse({ description: 'Priorizações por projeto' })
  findByProjeto(@Query('projeto', ParseIntPipe) projetoId: number) {
    return this.priorizacaoService.findByProjeto(projetoId);
  }

  /**
   * Marca priorização como completa
   */
  @ProtectedRoute('admin', 'gerente', 'analista', 'stakeholder')
  @Patch('complete')
  @ApiOperation({ summary: 'Marcar priorização como completa' })
  @ApiOkResponse({ description: 'Priorização marcada como completa' })
  update(@Query('stakeholder', ParseIntPipe) stakeholderId: number) {
    return this.priorizacaoService.update(stakeholderId);
  }

  /**
   * Obtém classificação final de um requisito
   */
  @ProtectedRoute()
  @Get('classificacao-final')
  @ApiOperation({ summary: 'Obter classificação final de um requisito' })
  @ApiOkResponse({ description: 'Classificação final do requisito' })
  getRequirementFinalClassification(
    @Query('requisito', ParseIntPipe) requisitoId: number,
  ) {
    return this.priorizacaoService.getMostFrequentClassification(requisitoId);
  }
}
