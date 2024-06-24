import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PriorizacaoService } from './priorizacao.service';
import { CreatePriorizacaoDto } from './dto/create-priorizacao.dto';
import { UpdatePriorizacaoDto } from './dto/update-priorizacao.dto';

@Controller('priorizacao')
export class PriorizacaoController {
  constructor(private readonly priorizacaoService: PriorizacaoService) {}

  @Post()
  create(@Body() createPriorizacaoDto: CreatePriorizacaoDto) {
    return this.priorizacaoService.create(createPriorizacaoDto);
  }

  @Get()
  findAll() {
    return this.priorizacaoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.priorizacaoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePriorizacaoDto: UpdatePriorizacaoDto) {
    return this.priorizacaoService.update(+id, updatePriorizacaoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.priorizacaoService.remove(+id);
  }
}
