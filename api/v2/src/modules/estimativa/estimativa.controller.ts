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
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BaseController } from '../../common/base/base.controller';
import { ColaboradorAtual } from '../../decorators/colaborador-atual.decorator';
import { ProjetoAtual } from '../../decorators/projeto-atual.decorator';
import { Serialize } from '../../decorators/serialize.decorator';
import { Colaborador } from '../colaborador/entities/colaborador.entity';
import { Projeto } from '../projeto/entities/projeto.entity';
import { CreateEstimativaSessionDto } from './dto/create-estimativa-session.dto';
import { EstimativaSessionDto } from './dto/estimativa-session.dto';
import { UpdateEstimativaSessionDto } from './dto/update-estimativa-session.dto';
import { EstimativaService } from './estimativa.service';

@ApiTags('Estimativa')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Não autorizado' })
@Serialize()
@Controller('estimativa')
export class EstimativaController extends BaseController {
  constructor(private readonly estimativaService: EstimativaService) {
    super();
  }

  @ApiOperation({ summary: 'Get all estimation sessions for current project' })
  @ApiResponse({
    status: 200,
    description: 'List of estimation sessions',
    type: [EstimativaSessionDto],
  })
  @Get()
  findAll(
    @ProjetoAtual() projeto: Projeto,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.estimativaService.findAll(projeto.id, page, pageSize);
  }

  @ApiOperation({ summary: 'Get estimation session by ID' })
  @ApiResponse({
    status: 200,
    description: 'Estimation session found',
    type: EstimativaSessionDto,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Estimation session ID',
    example: 1,
  })
  @Get(':id')
  findOne(@Param('id') id: string, @ProjetoAtual() projeto: Projeto) {
    return this.estimativaService.findOne(+id, projeto.id);
  }

  @ApiOperation({ summary: 'Create new estimation session' })
  @ApiResponse({
    status: 201,
    description: 'Estimation session created',
    type: EstimativaSessionDto,
  })
  @Post()
  create(
    @Body() createEstimativaSessionDto: CreateEstimativaSessionDto,
    @ProjetoAtual() projeto: Projeto,
    @ColaboradorAtual() colaborador: Colaborador,
  ) {
    return this.estimativaService.createSession(
      createEstimativaSessionDto,
      projeto,
      colaborador,
    );
  }

  @ApiOperation({ summary: 'Update estimation session' })
  @ApiResponse({
    status: 200,
    description: 'Estimation session updated',
    type: EstimativaSessionDto,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Estimation session ID',
    example: 1,
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEstimativaSessionDto: UpdateEstimativaSessionDto,
    @ProjetoAtual() projeto: Projeto,
  ) {
    return this.estimativaService.updateSession(
      +id,
      updateEstimativaSessionDto,
      projeto.id,
    );
  }

  @ApiOperation({ summary: 'Delete estimation session' })
  @ApiResponse({
    status: 200,
    description: 'Estimation session deleted',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Estimation session ID',
    example: 1,
  })
  @Delete(':id')
  remove(@Param('id') id: string, @ProjetoAtual() projeto: Projeto) {
    return this.estimativaService.removeSession(+id, projeto.id);
  }

  // Legacy endpoint for backward compatibility
  @ApiOperation({
    summary: 'Create legacy estimation (deprecated)',
    deprecated: true,
  })
  @Post('legacy')
  createLegacy(@Query('projeto') projetoId: string) {
    return this.estimativaService.create(+projetoId);
  }
}
