import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BaseController } from '../../common/base/base.controller';
import { ProjetoAtual } from '../../decorators/projeto-atual.decorator';
import { Serialize } from '../../decorators/serialize.decorator';
import { Projeto } from '../projeto/entities/projeto.entity';
import { CreateRodadaDeTesteDto } from './dto/create-rodada-de-teste.dto';
import { RodadaDeTesteDto } from './dto/rodada-de-teste.dto';
import { UpdateRodadaDeTesteDto } from './dto/update-rodada-de-teste.dto';
import { UpdateRodadaResultadosDto } from './dto/update-rodada-resultados.dto';
import { RodadaDeTesteMapper } from './rodada-de-teste.mapper';
import { RodadaDeTesteService } from './rodada-de-teste.service';

@ApiTags('Rodada de Teste')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Não autorizado' })
@Serialize()
@Controller('rodada-de-teste')
export class RodadaDeTesteController extends BaseController {
  constructor(private readonly rodadaService: RodadaDeTesteService) {
    super();
  }

  @Post()
  @ApiResponse({ status: 201, type: RodadaDeTesteDto })
  async create(
    @Body() dto: CreateRodadaDeTesteDto,
    @ProjetoAtual() projeto: Projeto,
  ): Promise<RodadaDeTesteDto> {
    const created = await this.rodadaService.create(dto, projeto);
    return RodadaDeTesteMapper.entityToDto(created);
  }

  @Get()
  @ApiResponse({ status: 200, type: [RodadaDeTesteDto] })
  async findAll(@ProjetoAtual() projeto: Projeto): Promise<RodadaDeTesteDto[]> {
    const items = await this.rodadaService.findAll(projeto);
    return items.map((item) => RodadaDeTesteMapper.entityToDto(item));
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'ID da rodada de teste' })
  @ApiResponse({ status: 200, type: RodadaDeTesteDto })
  async findOne(
    @Param('id') id: string,
    @ProjetoAtual() projeto: Projeto,
  ): Promise<RodadaDeTesteDto> {
    const item = await this.rodadaService.findOne(+id, projeto);
    return RodadaDeTesteMapper.entityToDto(item);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', description: 'ID da rodada de teste' })
  @ApiResponse({ status: 200, type: RodadaDeTesteDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateRodadaDeTesteDto,
    @ProjetoAtual() projeto: Projeto,
  ): Promise<RodadaDeTesteDto> {
    const updated = await this.rodadaService.update(+id, dto, projeto);
    return RodadaDeTesteMapper.entityToDto(updated);
  }

  @Patch(':id/resultados')
  @ApiParam({ name: 'id', description: 'ID da rodada de teste' })
  @ApiResponse({ status: 200, type: RodadaDeTesteDto })
  async updateResultados(
    @Param('id') id: string,
    @Body() dto: UpdateRodadaResultadosDto,
    @ProjetoAtual() projeto: Projeto,
  ): Promise<RodadaDeTesteDto> {
    const updated = await this.rodadaService.updateResultados(
      +id,
      dto,
      projeto,
    );
    return RodadaDeTesteMapper.entityToDto(updated);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'ID da rodada de teste' })
  @ApiResponse({ status: 200 })
  async remove(@Param('id') id: string, @ProjetoAtual() projeto: Projeto) {
    return this.rodadaService.remove(+id, projeto);
  }
}
