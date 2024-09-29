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
import { CreateFatorTecnicoProjetoDto } from './dto/create-fator-tecnico-projeto.dto';
import { UpdateFatorTecnicoProjetoDto } from './dto/update-fator-tecnico-projeto.dto';
import { FatorTecnicoProjetoService } from './fator-tecnico-projeto.service';

@UseGuards(AuthGuard)
@Controller('fator-tecnico-projeto')
export class FatorTecnicoProjetoController {
  constructor(
    private readonly fatorTecnicoProjetoService: FatorTecnicoProjetoService,
  ) {}

  @Post()
  create(@Body() createFatorTecnicoProjetoDto: CreateFatorTecnicoProjetoDto) {
    return this.fatorTecnicoProjetoService.create(createFatorTecnicoProjetoDto);
  }

  @Get()
  findAll() {
    return this.fatorTecnicoProjetoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fatorTecnicoProjetoService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFatorTecnicoProjetoDto: UpdateFatorTecnicoProjetoDto,
  ) {
    return this.fatorTecnicoProjetoService.update(
      +id,
      updateFatorTecnicoProjetoDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fatorTecnicoProjetoService.remove(+id);
  }
}
