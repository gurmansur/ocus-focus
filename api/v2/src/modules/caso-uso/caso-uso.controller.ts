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
import { AuthGuard } from 'src/guards/auth.guard';
import { CasoUsoService } from './caso-uso.service';
import { CreateCasoUsoDto } from './dto/create-caso-uso.dto';
import { UpdateCasoUsoDto } from './dto/update-caso-uso.dto';

@UseGuards(AuthGuard)
@Controller('caso-uso')
export class CasoUsoController {
  constructor(private readonly casoUsoService: CasoUsoService) {}

  @Get()
  findAll(
    @Query('requisito') requisito: number,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.casoUsoService.findAll(requisito, page, pageSize);
  }

  @Get('findByNome')
  findByNome(@Query('nome') nome: string) {
    return this.casoUsoService.findByNome(nome);
  }

  @Get('findById')
  findOne(@Query('id') id: string) {
    return this.casoUsoService.findOne(+id);
  }

  // aqui ele recebe o id de requisito funcional
  @Get('metrics/total')
  getTotal(@Query('caso') caso: number) {
    return this.casoUsoService.getMetrics(caso);
  }

  @Get('metrics/simples')
  getTotalSimples(@Query('caso') caso: number) {
    return this.casoUsoService.getMetrics(caso, 'SIMPLES');
  }

  @Get('metrics/medios')
  getTotalMedios(@Query('caso') caso: number) {
    return this.casoUsoService.getMetrics(caso, 'MEDIO');
  }

  @Get('metrics/complexos')
  getTotalComplexos(@Query('caso') caso: number) {
    return this.casoUsoService.getMetrics(caso, 'COMPLEXO');
  }

  @Post('new')
  create(@Body() createCasoUsoDto: CreateCasoUsoDto) {
    return this.casoUsoService.create(createCasoUsoDto);
  }

  @Patch('update')
  update(
    @Query('caso') id: string,
    @Query('requisito') requisito: number,
    @Body() updateCasoUsoDto: UpdateCasoUsoDto,
  ) {
    return this.casoUsoService.update(+id, +requisito, updateCasoUsoDto);
  }

  @Delete('delete')
  remove(@Query('id') id: string) {
    return this.casoUsoService.remove(+id);
  }
}
