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
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateFatoresAmbientaiDto } from './dto/create-fatores-ambientai.dto';
import { UpdateFatoresAmbientaiDto } from './dto/update-fatores-ambientai.dto';
import { FatoresAmbientaisService } from './fatores-ambientais.service';

@UseGuards(AuthGuard)
// esse tem que tirar pq não usa essa rota, usa só a Fator-Ambiental-Projeto
@ApiTags('Fatores Ambientais - Não tem uso')
@Controller('fatores-ambientais')
export class FatoresAmbientaisController {
  constructor(
    private readonly fatoresAmbientaisService: FatoresAmbientaisService,
  ) {}

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
  update(
    @Param('id') id: string,
    @Body() updateFatoresAmbientaiDto: UpdateFatoresAmbientaiDto,
  ) {
    return this.fatoresAmbientaisService.update(+id, updateFatoresAmbientaiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fatoresAmbientaisService.remove(+id);
  }
}
