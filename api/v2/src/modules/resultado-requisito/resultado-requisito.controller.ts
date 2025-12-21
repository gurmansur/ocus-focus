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
import { CreateResultadoRequisitoDto } from './dto/create-resultado-requisito.dto';
import { UpdateResultadoRequisitoDto } from './dto/update-resultado-requisito.dto';
import { ResultadoRequisitoService } from './resultado-requisito.service';

@ApiTags('Resultado-Requisito')
@Controller('resultado-requisito')
export class ResultadoRequisitoController extends BaseController {
  constructor(
    private readonly resultadoRequisitoService: ResultadoRequisitoService,
  ) {
    super();
  }

  @Post()
  create(@Body() createResultadoRequisitoDto: CreateResultadoRequisitoDto) {}

  @Get()
  findAll() {
    return this.resultadoRequisitoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resultadoRequisitoService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateResultadoRequisitoDto: UpdateResultadoRequisitoDto,
  ) {
    return this.resultadoRequisitoService.update(
      +id,
      updateResultadoRequisitoDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resultadoRequisitoService.remove(+id);
  }
}
