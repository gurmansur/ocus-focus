import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FatoresAmbientaisService } from './fatores-ambientais.service';
import { CreateFatoresAmbientaiDto } from './dto/create-fatores-ambientai.dto';
import { UpdateFatoresAmbientaiDto } from './dto/update-fatores-ambientai.dto';

@Controller('fatores-ambientais')
export class FatoresAmbientaisController {
  constructor(private readonly fatoresAmbientaisService: FatoresAmbientaisService) {}

  @Post()
  create(@Body() createFatoresAmbientaiDto: CreateFatoresAmbientaiDto) {
    return this.fatoresAmbientaisService.create(createFatoresAmbientaiDto);
  }

  @Get()
  findAll() {
    return this.fatoresAmbientaisService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fatoresAmbientaisService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFatoresAmbientaiDto: UpdateFatoresAmbientaiDto) {
    return this.fatoresAmbientaisService.update(+id, updateFatoresAmbientaiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fatoresAmbientaisService.remove(+id);
  }
}
