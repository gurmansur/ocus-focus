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
import { CreateFatoresTecnicoDto } from './dto/create-fatores-tecnico.dto';
import { UpdateFatoresTecnicoDto } from './dto/update-fatores-tecnico.dto';
import { FatoresTecnicosService } from './fatores-tecnicos.service';

@UseGuards(AuthGuard)
// essa rota já existe, é do Fator-Tecnico-Projeto. Mudei pra Fatores apenas
@Controller('fatores')
export class FatoresTecnicosController {
  constructor(
    private readonly fatoresTecnicosService: FatoresTecnicosService,
  ) {}

  @Post()
  create(@Body() createFatoresTecnicoDto: CreateFatoresTecnicoDto) {
    return this.fatoresTecnicosService.create(createFatoresTecnicoDto);
  }

  @Get()
  findAll() {
    return this.fatoresTecnicosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fatoresTecnicosService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFatoresTecnicoDto: UpdateFatoresTecnicoDto,
  ) {
    return this.fatoresTecnicosService.update(+id, updateFatoresTecnicoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fatoresTecnicosService.remove(+id);
  }
}
