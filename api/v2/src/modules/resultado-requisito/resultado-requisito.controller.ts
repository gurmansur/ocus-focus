import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateResultadoRequisitoDto } from './dto/create-resultado-requisito.dto';
import { UpdateResultadoRequisitoDto } from './dto/update-resultado-requisito.dto';
import { ResultadoRequisitoService } from './resultado-requisito.service';

@UseGuards(AuthGuard)
@Controller('resultado-requisito')
export class ResultadoRequisitoController {
  constructor(
    private readonly resultadoRequisitoService: ResultadoRequisitoService,
  ) {}

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
