import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateProjetoDto } from './dto/create-projeto.dto';
import { UpdateProjetoDto } from './dto/update-projeto.dto';
import { ProjetoService } from './projeto.service';

@Controller('projetos')
export class ProjetoController {
  constructor(private readonly projetoService: ProjetoService) {}

  @Post()
  create(@Body() createProjetoDto: CreateProjetoDto) {
    return this.projetoService.create(createProjetoDto);
  }

  @Get()
  findAll() {
    return this.projetoService.findAll();
  }

  @Get('findByNome')
  findByNome(
    @Query('nome') nome: string,
    @Query('user') colaboradorId: number,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.projetoService.findByNome(
      nome,
      colaboradorId,
      !!pageSize,
      page,
      pageSize,
    );
  }

  @Get('metrics/total')
  findTotal() {
    return this.projetoService.findTotal();
  }

  @Get('metrics/ongoing')
  findOngoingCount() {
    return this.projetoService.findOngoingCount();
  }

  @Get('metrics/finished')
  findFinishedCount() {
    return this.projetoService.findFinishedCount();
  }

  @Get('metrics/new')
  findNewCount() {
    return this.projetoService.findNewCount();
  }

  @Get('recentes')
  findRecentes(
    @Query('user', ParseIntPipe) user: number,
    @Query('limit') limit: number,
  ) {
    return this.projetoService.findRecentes(user, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projetoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjetoDto: UpdateProjetoDto) {
    return this.projetoService.update(+id, updateProjetoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projetoService.remove(+id);
  }
}
