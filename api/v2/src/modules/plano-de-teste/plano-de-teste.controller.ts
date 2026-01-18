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
import { CreatePlanoDeTesteDto } from './dto/create-plano-de-teste.dto';
import { PlanoDeTesteDto } from './dto/plano-de-teste.dto';
import { UpdatePlanoDeTesteDto } from './dto/update-plano-de-teste.dto';
import { PlanoDeTesteMapper } from './plano-de-teste.mapper';
import { PlanoDeTesteService } from './plano-de-teste.service';

@ApiTags('Plano de Teste')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Não autorizado' })
@Serialize()
@Controller('plano-de-teste')
export class PlanoDeTesteController extends BaseController {
  constructor(private readonly planoService: PlanoDeTesteService) {
    super();
  }

  @Post()
  @ApiResponse({ status: 201, type: PlanoDeTesteDto })
  async create(
    @Body() dto: CreatePlanoDeTesteDto,
    @ProjetoAtual() projeto: Projeto,
  ): Promise<PlanoDeTesteDto> {
    const created = await this.planoService.create(dto, projeto);
    return PlanoDeTesteMapper.entityToDto(created);
  }

  @Get()
  @ApiResponse({ status: 200, type: [PlanoDeTesteDto] })
  async findAll(@ProjetoAtual() projeto: Projeto): Promise<PlanoDeTesteDto[]> {
    const items = await this.planoService.findAll(projeto);
    return items.map((item) => PlanoDeTesteMapper.entityToDto(item));
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'ID do plano de teste' })
  @ApiResponse({ status: 200, type: PlanoDeTesteDto })
  async findOne(
    @Param('id') id: string,
    @ProjetoAtual() projeto: Projeto,
  ): Promise<PlanoDeTesteDto> {
    const item = await this.planoService.findOne(+id, projeto);
    return PlanoDeTesteMapper.entityToDto(item);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', description: 'ID do plano de teste' })
  @ApiResponse({ status: 200, type: PlanoDeTesteDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePlanoDeTesteDto,
    @ProjetoAtual() projeto: Projeto,
  ): Promise<PlanoDeTesteDto> {
    const updated = await this.planoService.update(+id, dto, projeto);
    return PlanoDeTesteMapper.entityToDto(updated);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'ID do plano de teste' })
  @ApiResponse({ status: 200 })
  async remove(@Param('id') id: string, @ProjetoAtual() projeto: Projeto) {
    return this.planoService.remove(+id, projeto);
  }
}
