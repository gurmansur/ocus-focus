import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../common/base/base.controller';
import { CreatePriorizacaoDto } from './dto/create-priorizacao.dto';
import { PriorizacaoService } from './priorizacao.service';

@ApiTags('Priorização')
@Controller('priorizacao-stakeholders')
export class PriorizacaoController extends BaseController {
  constructor(private readonly priorizacaoService: PriorizacaoService) {
    super();
  }

  @Post('new')
  createPriorizacao(
    @Body() createPriorizacaoDto: CreatePriorizacaoDto,
    @Query('stakeholder') stakeholderId: number,
  ) {
    return this.priorizacaoService.createPriorizacao(
      createPriorizacaoDto,
      stakeholderId,
    );
  }

  @Post('result')
  createResultado(
    @Query('requisito') requisitoId: number,
    @Query('resultadoFinal')
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

  @Get()
  findByProjeto(@Query('projeto') projetoId: number) {
    return this.priorizacaoService.findByProjeto(projetoId);
  }

  @Patch('complete')
  update(@Query('stakeholder') stakeholderId: number) {
    return this.priorizacaoService.update(stakeholderId);
  }

  @Get('getRequirementFinalClassification')
  getRequirementFinalClassification(@Query('requisito') requisitoId: number) {
    return this.priorizacaoService.getMostFrequentClassification(requisitoId);
  }
}
