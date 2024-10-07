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
import { CreatePlanoDeTesteDto } from './dto/create-plano-de-teste.dto';
import { UpdatePlanoDeTesteDto } from './dto/update-plano-de-teste.dto';
import { PlanoDeTesteService } from './plano-de-teste.service';

@ApiTags('Plano de Teste')
@Controller('plano-de-teste')
export class PlanoDeTesteController {
  constructor(private readonly planoDeTesteService: PlanoDeTesteService) {}

  @Post()
  create(@Body() createPlanoDeTesteDto: CreatePlanoDeTesteDto) {
    return this.planoDeTesteService.create(createPlanoDeTesteDto);
  }

  @Get()
  findAll() {
    return this.planoDeTesteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.planoDeTesteService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePlanoDeTesteDto: UpdatePlanoDeTesteDto,
  ) {
    return this.planoDeTesteService.update(+id, updatePlanoDeTesteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.planoDeTesteService.remove(+id);
  }
}
