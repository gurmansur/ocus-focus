import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../guards/auth.guard';
import { AtorService } from './ator.service';
import { AtoresMetricsQueryDto } from './dto/atores-metrics-query.dto';
import { AtoresMetricsDto } from './dto/atores-metrics.dto';
import { CreateAtorQueryDto } from './dto/create-ator-query.dto';
import { CreateAtorDto } from './dto/create-ator.dto';
import { DeleteAtorQueryDto } from './dto/delete-ator-query.dto';
import { FindAtorByIdQueryDto } from './dto/find-ator-by-id-query.dto';
import { FindAtorByIdDto } from './dto/find-ator-by-id.dto';
import { FindAtorByNomeQueryDto } from './dto/find-ator-by-nome-query.dto';
import { FindAtoresQueryDto } from './dto/find-atores-query.dto';
import { FindAtoresDto } from './dto/find-atores.dto';
import { UpdateAtorQueryDto } from './dto/update-ator-query.dto';
import { UpdateAtorDto } from './dto/update-ator.dto';

@UseGuards(AuthGuard)
@ApiTags('Ator')
@ApiResponse({ status: 401, description: 'Não autorizado' })
@ApiBearerAuth()
@Controller('atores')
export class AtorController {
  constructor(private readonly atorService: AtorService) {}

  @ApiResponse({
    status: 200,
    description: 'Cria um novo ator e retorna o ator criado',
    type: FindAtorByIdDto,
  })
  @Post('new')
  create(
    @Body() createAtorDto: CreateAtorDto,
    @Query() { projeto }: CreateAtorQueryDto,
  ) {
    return this.atorService.create(createAtorDto, +projeto);
  }

  @ApiResponse({
    status: 200,
    description: 'Retorna a lista de atores',
    type: FindAtoresDto,
  })
  @Get()
  findAll(@Query() { projeto, page, size }: FindAtoresQueryDto) {
    return this.atorService.findAll(projeto, page, size);
  }

  @ApiResponse({
    status: 200,
    description: 'Retorna o ator',
    type: FindAtorByIdDto,
  })
  @Get('findById')
  findOne(@Query() { id }: FindAtorByIdQueryDto) {
    return this.atorService.findOne(+id);
  }

  @ApiResponse({
    status: 200,
    description: 'Retorna a lista de atores',
    type: FindAtoresDto,
  })
  @Get('findByNome')
  findByNome(
    @Query() { nome, projeto, page, pageSize }: FindAtorByNomeQueryDto,
  ) {
    return this.atorService.findByNome(nome, projeto, page, pageSize);
  }

  // ? Atores recebe o ID do projeto ?????????????
  @ApiResponse({
    status: 200,
    description: 'Retorna a quantidade de atores do projeto',
    type: AtoresMetricsDto,
  })
  @Get('metrics/total')
  getTotal(@Query() { atores }: AtoresMetricsQueryDto) {
    return this.atorService.getMetrics(atores);
  }

  @ApiResponse({
    status: 200,
    description: 'Retorna a quantidade de atores simples',
    type: AtoresMetricsDto,
  })
  @Get('metrics/simples')
  getTotalSimples(@Query() { atores }: AtoresMetricsQueryDto) {
    return this.atorService.getMetrics(atores, 'SIMPLES');
  }

  @ApiResponse({
    status: 200,
    description: 'Retorna a quantidade de atores médios',
    type: AtoresMetricsDto,
  })
  @Get('metrics/medios')
  getTotalMedio(@Query() { atores }: AtoresMetricsQueryDto) {
    return this.atorService.getMetrics(atores, 'MEDIO');
  }

  @ApiResponse({
    status: 200,
    description: 'Retorna a quantidade de atores complexos',
    type: AtoresMetricsDto,
  })
  @Get('metrics/complexos')
  getTotalComplexo(@Query() { atores }: AtoresMetricsQueryDto) {
    return this.atorService.getMetrics(atores, 'COMPLEXO');
  }

  @ApiResponse({
    status: 200,
    description: 'Atualiza o ator',
    type: FindAtorByIdDto,
  })
  @Patch('update')
  update(
    @Query() { atores, projeto }: UpdateAtorQueryDto,
    @Body() updateAtorDto: UpdateAtorDto,
  ) {
    return this.atorService.update(atores, projeto, updateAtorDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Remove o ator',
  })
  @Delete('delete')
  remove(@Query() { atores }: DeleteAtorQueryDto) {
    return this.atorService.remove(atores);
  }
}
