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
import { BaseController } from '../../common/base/base.controller';
import { CreateSubtarefaDto } from './dto/create-subtarefa.dto';
import { UpdateSubtarefaDto } from './dto/update-subtarefa.dto';
import { SubtarefaService } from './subtarefa.service';

@ApiTags('Subtarefa')
@Controller('subtarefa')
export class SubtarefaController extends BaseController {
  constructor(private readonly subtarefaService: SubtarefaService) {
    super();
  }

  @Post()
  create(@Body() createSubtarefaDto: CreateSubtarefaDto) {
    return this.subtarefaService.create(createSubtarefaDto);
  }

  @Get()
  findAll() {
    return this.subtarefaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subtarefaService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubtarefaDto: UpdateSubtarefaDto,
  ) {
    return this.subtarefaService.update(+id, updateSubtarefaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subtarefaService.remove(+id);
  }
}
