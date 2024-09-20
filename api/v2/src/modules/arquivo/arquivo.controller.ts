import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ArquivoService } from './arquivo.service';
import { CreateArquivoDto } from './dto/create-arquivo.dto';
import { UpdateArquivoDto } from './dto/update-arquivo.dto';

@Controller('arquivo')
export class ArquivoController {
  constructor(private readonly arquivoService: ArquivoService) {}

  @Post()
  create(@Body() createArquivoDto: CreateArquivoDto) {
    return this.arquivoService.create(createArquivoDto);
  }

  @Get()
  findAll() {
    return this.arquivoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.arquivoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArquivoDto: UpdateArquivoDto) {
    return this.arquivoService.update(+id, updateArquivoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.arquivoService.remove(+id);
  }
}
