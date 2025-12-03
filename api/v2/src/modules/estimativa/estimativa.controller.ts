import { ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Post, Query } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ProtectedRoute } from '../../decorators/protected-route.decorator';
import { EstimativaService } from './estimativa.service';

@ApiTags('Estimativa')
@ApiBearerAuth()
@Controller('estimativa')
export class EstimativaController {
  constructor(private readonly estimativaService: EstimativaService) {}

  @Get()
  @ApiOperation({
    summary: 'Buscar',
    description: 'Busca recursos específicos',
  })
  @ApiOperation({ summary: 'Listar', description: 'Lista todos os recursos' })
  findAll(
    @Query('projeto') projetoId: number,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.estimativaService.findAll(projetoId, page, pageSize);
  }

  @Post('new')
  @ApiOperation({ summary: 'Criar', description: 'Cria um novo recurso' })
  @ApiCreatedResponse({ description: 'Recurso criado com sucesso' })
  create(@Query('projeto') projetoId: string) {
    return this.estimativaService.create(+projetoId);
  }

  /**
   * Calcula fator de ajuste do projeto
   * @param projetoId ID do projeto
   * @returns Valor do fator de ajuste
   */
  @ProtectedRoute()
  @Get('fator-de-ajuste')
  @ApiOperation({
    summary: 'Buscar',
    description: 'Busca recursos específicos',
  })
  @ApiOkResponse({ description: 'Fator de ajuste calculado com sucesso' })
  getFatorDeAjuste(@Query('projetoId') projetoId: string) {
    return this.estimativaService.getFatorDeAjuste(+projetoId);
  }

  /**
   * Calcula pontos de função não ajustados
   * @param projetoId ID do projeto
   * @returns Pontos de função não ajustados
   */
  @ProtectedRoute()
  @Get('pf-nao-ajustados')
  @ApiOperation({
    summary: 'Buscar',
    description: 'Busca recursos específicos',
  })
  @ApiOkResponse({
    description: 'Pontos de função não ajustados calculados com sucesso',
  })
  getPontosDeNaoAjustados(@Query('projetoId') projetoId: string) {
    return this.estimativaService.getPontosDeNaoAjustados(+projetoId);
  }
}
