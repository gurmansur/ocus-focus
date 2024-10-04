import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreatePriorizacaoDto } from './dto/create-priorizacao.dto';
import { PriorizacaoService } from './priorizacao.service';

@UseGuards(AuthGuard)
@ApiTags('Priorização')
@Controller('priorizacao-stakeholders')
export class PriorizacaoController {
  constructor(private readonly priorizacaoService: PriorizacaoService) {}

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
