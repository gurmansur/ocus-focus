import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StatusPriorizacaoService } from './status-priorizacao.service';
import { CreateStatusPriorizacaoDto } from './dto/create-status-priorizacao.dto';
import { UpdateStatusPriorizacaoDto } from './dto/update-status-priorizacao.dto';

@Controller('status-priorizacao')
export class StatusPriorizacaoController {
  constructor(private readonly statusPriorizacaoService: StatusPriorizacaoService) {}

  @Post()
  create(@Body() createStatusPriorizacaoDto: CreateStatusPriorizacaoDto) {
    return this.statusPriorizacaoService.create(createStatusPriorizacaoDto);
  }

  @Get()
  findAll() {
    return this.statusPriorizacaoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.statusPriorizacaoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStatusPriorizacaoDto: UpdateStatusPriorizacaoDto) {
    return this.statusPriorizacaoService.update(+id, updateStatusPriorizacaoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.statusPriorizacaoService.remove(+id);
  }
}
