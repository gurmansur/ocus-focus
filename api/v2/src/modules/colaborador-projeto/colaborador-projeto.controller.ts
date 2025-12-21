import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../common/base/base.controller';
import { ColaboradorProjetoService } from './colaborador-projeto.service';
import { CreateColaboradorProjetoDto } from './dto/create-colaborador-projeto.dto';
import { UpdateColaboradorProjetoDto } from './dto/update-colaborador-projeto.dto';

@ApiTags('Colaborador-Projeto')
@Controller('colaborador-projeto')
export class ColaboradorProjetoController extends BaseController {
  constructor(
    private readonly colaboradorProjetoService: ColaboradorProjetoService,
  ) {
    super();
  }

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
  update(
    @Param('id') id: string,
    @Body() updateColaboradorProjetoDto: UpdateColaboradorProjetoDto,
  ) {
    return this.colaboradorProjetoService.update(
      +id,
      updateColaboradorProjetoDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.colaboradorProjetoService.remove(+id);
  }
}
