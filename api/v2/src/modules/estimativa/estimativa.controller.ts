import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EstimativaService } from './estimativa.service';
import { CreateEstimativaDto } from './dto/create-estimativa.dto';
import { UpdateEstimativaDto } from './dto/update-estimativa.dto';

@Controller('estimativa')
export class EstimativaController {
  constructor(private readonly estimativaService: EstimativaService) {}

  @Post()
  create(@Body() createEstimativaDto: CreateEstimativaDto) {
    return this.estimativaService.create(createEstimativaDto);
  }

  @Get()
  findAll() {
    return this.estimativaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.estimativaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEstimativaDto: UpdateEstimativaDto) {
    return this.estimativaService.update(+id, updateEstimativaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.estimativaService.remove(+id);
  }
}
