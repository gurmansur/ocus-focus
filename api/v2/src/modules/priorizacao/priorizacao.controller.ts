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
import { CreatePriorizacaoDto } from './dto/create-priorizacao.dto';
import { UpdatePriorizacaoDto } from './dto/update-priorizacao.dto';
import { PriorizacaoService } from './priorizacao.service';

@UseGuards(AuthGuard)
@Controller('priorizacao')
export class PriorizacaoController {
  constructor(private readonly priorizacaoService: PriorizacaoService) {}

  @Post()
  create(@Body() createPriorizacaoDto: CreatePriorizacaoDto) {
    return this.priorizacaoService.create(createPriorizacaoDto);
  }

  @Get()
  findAll() {
    return this.priorizacaoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.priorizacaoService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePriorizacaoDto: UpdatePriorizacaoDto,
  ) {
    return this.priorizacaoService.update(+id, updatePriorizacaoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.priorizacaoService.remove(+id);
  }
}
