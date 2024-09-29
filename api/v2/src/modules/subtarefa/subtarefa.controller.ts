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
import { CreateSubtarefaDto } from './dto/create-subtarefa.dto';
import { UpdateSubtarefaDto } from './dto/update-subtarefa.dto';
import { SubtarefaService } from './subtarefa.service';

@UseGuards(AuthGuard)
@Controller('subtarefa')
export class SubtarefaController {
  constructor(private readonly subtarefaService: SubtarefaService) {}

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
