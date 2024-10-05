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
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { AtorService } from './ator.service';
import { CreateAtorDto } from './dto/create-ator.dto';
import { FindAtorByNomeQueryDto } from './dto/find-ator-by-nome-query.dto';
import { FindAtorByNomeDto } from './dto/find-ator-by-nome.dto';
import { UpdateAtorDto } from './dto/update-ator.dto';

@UseGuards(AuthGuard)
@ApiTags('Ator')
@Controller('atores')
export class AtorController {
  constructor(private readonly atorService: AtorService) {}

  @Post('new')
  create(
    @Body() createAtorDto: CreateAtorDto,
    @Query('projeto') projetoId: string,
  ) {
    return this.atorService.create(createAtorDto, +projetoId);
  }

  @Get()
  findAll(
    @Query('projeto') projetoId: number,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.atorService.findAll(projetoId, page, pageSize);
  }

  @Get('findById')
  findOne(@Query('id') id: string) {
    return this.atorService.findOne(+id);
  }

  @ApiTags('Ator')
  @ApiResponse({
    status: 200,
    description: 'Retorna a lista de atores',
    type: FindAtorByNomeDto,
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @Get('findByNome')
  findByNome(
    @Query() { nome, projeto, page, pageSize }: FindAtorByNomeQueryDto,
  ) {
    return this.atorService.findByNome(nome, projeto, page, pageSize);
  }

  // ? Atores recebe o ID do projeto ?????????????
  @Get('metrics/total')
  getTotal(@Query('atores') atores: number) {
    return this.atorService.getMetrics(atores);
  }

  @Get('metrics/simples')
  getTotalSimples(@Query('atores') atores: number) {
    return this.atorService.getMetrics(atores, 'SIMPLES');
  }

  @Get('metrics/medios')
  getTotalMedio(@Query('atores') atores: number) {
    return this.atorService.getMetrics(atores, 'MEDIO');
  }

  @Get('metrics/complexos')
  getTotalComplexo(@Query('atores') atores: number) {
    return this.atorService.getMetrics(atores, 'COMPLEXO');
  }

  @Patch('update')
  update(
    @Query('atores') id: string,
    @Query('projeto') projectId: string,
    @Body() updateAtorDto: UpdateAtorDto,
  ) {
    return this.atorService.update(+id, +projectId, updateAtorDto);
  }

  @Delete('delete')
  remove(@Query('atores') id: number) {
    return this.atorService.remove(+id);
  }
}
