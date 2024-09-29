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
import { CreateEstimativaDto } from './dto/create-estimativa.dto';
import { UpdateEstimativaDto } from './dto/update-estimativa.dto';
import { EstimativaService } from './estimativa.service';

@UseGuards(AuthGuard)
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
  update(
    @Param('id') id: string,
    @Body() updateEstimativaDto: UpdateEstimativaDto,
  ) {
    return this.estimativaService.update(+id, updateEstimativaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.estimativaService.remove(+id);
  }
}
