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
import { CreateRequisitoDto } from './dto/create-requisito.dto';
import { UpdateRequisitoDto } from './dto/update-requisito.dto';
import { RequisitoService } from './requisito-funcional.service';

@UseGuards(AuthGuard)
@Controller('requisito')
export class RequisitoController {
  constructor(private readonly requisitoService: RequisitoService) {}

  @Post()
  create(@Body() createRequisitoDto: CreateRequisitoDto) {
    return this.requisitoService.create(createRequisitoDto);
  }

  @Get()
  findAll() {
    return this.requisitoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requisitoService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRequisitoDto: UpdateRequisitoDto,
  ) {
    return this.requisitoService.update(+id, updateRequisitoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requisitoService.remove(+id);
  }
}
