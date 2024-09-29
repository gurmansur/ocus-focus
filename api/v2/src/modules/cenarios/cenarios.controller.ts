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
import { CenariosService } from './cenarios.service';
import { CreateCenarioDto } from './dto/create-cenario.dto';
import { UpdateCenarioDto } from './dto/update-cenario.dto';

@UseGuards(AuthGuard)
@Controller('cenarios')
export class CenariosController {
  constructor(private readonly cenariosService: CenariosService) {}

  @Post()
  create(@Body() createCenarioDto: CreateCenarioDto) {
    return this.cenariosService.create(createCenarioDto);
  }

  @Get()
  findAll() {
    return this.cenariosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cenariosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCenarioDto: UpdateCenarioDto) {
    return this.cenariosService.update(+id, updateCenarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cenariosService.remove(+id);
  }
}
