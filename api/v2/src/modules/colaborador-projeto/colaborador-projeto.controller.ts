import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ColaboradorProjetoService } from './colaborador-projeto.service';
import { CreateColaboradorProjetoDto } from './dto/create-colaborador-projeto.dto';
import { UpdateColaboradorProjetoDto } from './dto/update-colaborador-projeto.dto';

@Controller('colaborador-projeto')
export class ColaboradorProjetoController {
  constructor(private readonly colaboradorProjetoService: ColaboradorProjetoService) {}

  @Post()
  create(@Body() createColaboradorProjetoDto: CreateColaboradorProjetoDto) {
    return this.colaboradorProjetoService.create(createColaboradorProjetoDto);
  }

  @Get()
  findAll() {
    return this.colaboradorProjetoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.colaboradorProjetoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateColaboradorProjetoDto: UpdateColaboradorProjetoDto) {
    return this.colaboradorProjetoService.update(+id, updateColaboradorProjetoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.colaboradorProjetoService.remove(+id);
  }
}
