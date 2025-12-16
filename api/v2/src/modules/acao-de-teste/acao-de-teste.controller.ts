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
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../../guards/auth.guard';
import { AcaoDeTesteMapper } from './acao-de-teste.mapper';
import { AcaoDeTesteService } from './acao-de-teste.service';
import { AcaoDeTesteDto } from './dto/acao-de-teste.dto';
import { CreateAcaoDeTesteDto } from './dto/create-acao-de-teste.dto';
import { UpdateAcaoDeTesteDto } from './dto/update-acao-de-teste.dto';

@ApiTags('Ação de Teste')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiUnauthorizedResponse({ description: 'Não autorizado' })
@Controller('acao-de-teste')
export class AcaoDeTesteController {
  constructor(private readonly acaoDeTesteService: AcaoDeTesteService) {}

  @ApiResponse({
    status: 201,
    description: 'Criado com sucesso',
    type: AcaoDeTesteDto,
  })
  @Post()
  async create(@Body() createAcaoDeTesteDto: CreateAcaoDeTesteDto) {
    const bo = AcaoDeTesteMapper.createDtoToBo(createAcaoDeTesteDto);
    const result = await this.acaoDeTesteService.create(bo);
    return AcaoDeTesteMapper.boToDto(result);
  }

  @ApiResponse({
    status: 200,
    description: 'Lista de ações de teste',
    type: [AcaoDeTesteDto],
  })
  @ApiQuery({
    name: 'casoDeTesteId',
    required: false,
    type: Number,
    description: 'Filtrar por ID do caso de teste',
  })
  @Get()
  async findAll(@Query('casoDeTesteId') casoDeTesteId?: string) {
    const bos = await this.acaoDeTesteService.findAll(
      casoDeTesteId ? +casoDeTesteId : undefined,
    );
    return bos.map((bo) => AcaoDeTesteMapper.boToDto(bo));
  }

  @ApiResponse({
    status: 200,
    description: 'Ação de teste encontrada',
    type: AcaoDeTesteDto,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID da ação de teste',
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const bo = await this.acaoDeTesteService.findOne(+id);
    return AcaoDeTesteMapper.boToDto(bo);
  }

  @ApiResponse({
    status: 200,
    description: 'Atualizado com sucesso',
    type: AcaoDeTesteDto,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID da ação de teste',
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAcaoDeTesteDto: UpdateAcaoDeTesteDto,
  ) {
    const bo = AcaoDeTesteMapper.updateDtoToBo(updateAcaoDeTesteDto);
    const result = await this.acaoDeTesteService.update(+id, bo);
    return AcaoDeTesteMapper.boToDto(result);
  }

  @ApiResponse({
    status: 200,
    description: 'Removido com sucesso',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID da ação de teste',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.acaoDeTesteService.remove(+id);
  }
}
