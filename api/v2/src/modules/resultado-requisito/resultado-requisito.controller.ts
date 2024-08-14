import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ResultadoRequisitoService } from './resultado-requisito.service';
import { CreateResultadoRequisitoDto } from './dto/create-resultado-requisito.dto';
import { UpdateResultadoRequisitoDto } from './dto/update-resultado-requisito.dto';

@Controller('resultado-requisito')
export class ResultadoRequisitoController {
  constructor(private readonly resultadoRequisitoService: ResultadoRequisitoService) {}

  @Post()
  create(@Body() createResultadoRequisitoDto: CreateResultadoRequisitoDto) {
    return this.resultadoRequisitoService.create(createResultadoRequisitoDto);
  }

  @Get()
  findAll() {
    return this.resultadoRequisitoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resultadoRequisitoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResultadoRequisitoDto: UpdateResultadoRequisitoDto) {
    return this.resultadoRequisitoService.update(+id, updateResultadoRequisitoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resultadoRequisitoService.remove(+id);
  }
}
