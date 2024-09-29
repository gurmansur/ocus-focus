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
import { CasoUsoService } from './caso-uso.service';
import { CreateCasoUsoDto } from './dto/create-caso-uso.dto';
import { UpdateCasoUsoDto } from './dto/update-caso-uso.dto';

@UseGuards(AuthGuard)
@Controller('caso-uso')
export class CasoUsoController {
  constructor(private readonly casoUsoService: CasoUsoService) {}

  @Post()
  create(@Body() createCasoUsoDto: CreateCasoUsoDto) {
    return this.casoUsoService.create(createCasoUsoDto);
  }

  @Get()
  findAll() {
    return this.casoUsoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.casoUsoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCasoUsoDto: UpdateCasoUsoDto) {
    return this.casoUsoService.update(+id, updateCasoUsoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.casoUsoService.remove(+id);
  }
}
