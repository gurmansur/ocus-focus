import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AtorService } from './ator.service';
import { CreateAtorDto } from './dto/create-ator.dto';
import { UpdateAtorDto } from './dto/update-ator.dto';

@Controller('atores')
export class AtorController {
  constructor(private readonly atorService: AtorService) {}

  @Post('new')
  create(@Body() createAtorDto: CreateAtorDto) {
    return this.atorService.create(createAtorDto);
  }

  @Get()
  findAll(
    @Query() { paginated, page }: { paginated?: boolean; page?: number },
  ) {
    return this.atorService.findAll(paginated, page);
  }

  @Get('findById')
  findOne(@Query('id') id: string) {
    return this.atorService.findOne(+id);
  }

  @Get('findByNome')
  findByNome(@Query('nome') nome: string) {
    return this.atorService.findByNome(nome);
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
    @Query('id') id: string,
    @Query('projeto') projectId: string,
    @Body() updateAtorDto: UpdateAtorDto,
  ) {
    return this.atorService.update(+id, +projectId, updateAtorDto);
  }

  @Delete('delete')
  remove(@Query('id') id: string) {
    return this.atorService.remove(+id);
  }
}
