import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ProjetoAtual } from '../../decorators/projeto-atual.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { Projeto } from '../projeto/entities/projeto.entity';
import { ChangeStatusExecucaoDeTesteDto } from './dto/change-status-execucao-de-teste.dto';
import { CreateExecucaoDeTesteDto } from './dto/create-execucao-de-teste.dto';
import { ExecucaoDeTesteDto } from './dto/execucao-de-teste.dto';
import { GetExecucaoDeTesteGraficoQueryDto } from './dto/get-execucao-de-teste-grafico-query.dto';
import { GetExecucaoDeTesteGraficoDto } from './dto/get-execucao-de-teste-grafico.dto';
import { UpdateExecucaoDeTesteDto } from './dto/update-execucao-de-teste.dto';
import { ExecucaoDeTesteMapper } from './execucao-de-teste.mapper';
import { ExecucaoDeTesteService } from './execucao-de-teste.service';

@ApiTags('Execução de Teste')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiUnauthorizedResponse({ description: 'Não autorizado' })
@Controller('execucao-de-teste')
export class ExecucaoDeTesteController {
  constructor(
    private readonly execucaoDeTesteService: ExecucaoDeTesteService,
  ) {}

  @ApiResponse({
    status: 201,
    description: 'Criado com sucesso',
    type: ExecucaoDeTesteDto,
  })
  @Post()
  create(@Body() createExecucaoDeTesteDto: CreateExecucaoDeTesteDto) {
    const bo = ExecucaoDeTesteMapper.createDtoToBo(createExecucaoDeTesteDto);

    return this.execucaoDeTesteService.create(bo);
  }

  @ApiResponse({
    status: 200,
    description: 'Lista de execuções de teste',
    type: [ExecucaoDeTesteDto],
  })
  @Get()
  async findAll(@ProjetoAtual() projeto: Projeto) {
    const bos = await this.execucaoDeTesteService.findAll(projeto);

    return bos.map((bo) => ExecucaoDeTesteMapper.boToDto(bo));
  }

  @ApiResponse({
    status: 200,
    description: 'Execução de teste encontrada',
    type: GetExecucaoDeTesteGraficoDto,
  })
  @Get('grafico')
  async getGrafico(
    @Query()
    getExecucaoDeTesteGraficoQueryDto: GetExecucaoDeTesteGraficoQueryDto,
    @ProjetoAtual() projeto: Projeto,
  ) {
    const bo = ExecucaoDeTesteMapper.getExecucaoDeTesteGraficoQueryDtoToBo(
      getExecucaoDeTesteGraficoQueryDto,
    );

    return this.execucaoDeTesteService.getGrafico(bo, projeto);
  }

  @ApiResponse({
    status: 200,
    description: 'Execução de teste encontrada',
    type: ExecucaoDeTesteDto,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID da execução de teste',
    example: 1,
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return ExecucaoDeTesteMapper.boToDto(
      await this.execucaoDeTesteService.findOne(+id),
    );
  }

  @ApiResponse({
    status: 200,
    description: 'Atualizado com sucesso',
    type: ExecucaoDeTesteDto,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID da execução de teste',
    example: 1,
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExecucaoDeTesteDto: UpdateExecucaoDeTesteDto,
  ) {
    const bo = ExecucaoDeTesteMapper.updateDtoToBo(updateExecucaoDeTesteDto);

    return this.execucaoDeTesteService.update(+id, bo);
  }

  @ApiResponse({
    status: 200,
    description: 'Status alterado com sucesso',
    type: ExecucaoDeTesteDto,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID da execução de teste',
    example: 1,
  })
  @Patch(':id/status')
  changeStatus(
    @Param('id') id: string,
    @Body() changeStatusExecucaoDeTesteDto: ChangeStatusExecucaoDeTesteDto,
  ) {
    const bo = ExecucaoDeTesteMapper.changeStatusDtoToBo(
      changeStatusExecucaoDeTesteDto,
    );

    return this.execucaoDeTesteService.changeStatus(+id, bo);
  }

  @ApiResponse({
    status: 200,
    description: 'Removido com sucesso',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID da execução de teste',
    example: 1,
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.execucaoDeTesteService.remove(+id);
  }
}
