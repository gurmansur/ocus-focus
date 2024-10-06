import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CasoDeTesteService } from './caso-de-teste.service';
import { CreateCasoDeTesteDto } from './dto/create-caso-de-teste.dto';
import { UpdateCasoDeTesteDto } from './dto/update-caso-de-teste.dto';

@Controller('caso-de-teste')
export class CasoDeTesteController {
  constructor(private readonly casoDeTesteService: CasoDeTesteService) {}

  @Post()
  create(@Body() createCasoDeTesteDto: CreateCasoDeTesteDto) {
    return this.casoDeTesteService.create(createCasoDeTesteDto);
  }

  @Get()
  findAll() {
    return this.casoDeTesteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.casoDeTesteService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCasoDeTesteDto: UpdateCasoDeTesteDto) {
    return this.casoDeTesteService.update(+id, updateCasoDeTesteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.casoDeTesteService.remove(+id);
  }
}
