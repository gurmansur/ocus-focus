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
import { CreateFatorAmbientalProjetoDto } from './dto/create-fator-ambiental-projeto.dto';
import { UpdateFatorAmbientalProjetoDto } from './dto/update-fator-ambiental-projeto.dto';
import { FatorAmbientalProjetoService } from './fator-ambiental-projeto.service';

@UseGuards(AuthGuard)
@Controller('fator-ambiental-projeto')
export class FatorAmbientalProjetoController {
  constructor(
    private readonly fatorAmbientalProjetoService: FatorAmbientalProjetoService,
  ) {}

  @Post()
  create(
    @Body() createFatorAmbientalProjetoDto: CreateFatorAmbientalProjetoDto,
  ) {
    return this.fatorAmbientalProjetoService.create(
      createFatorAmbientalProjetoDto,
    );
  }

  @Get()
  findAll() {
    return this.fatorAmbientalProjetoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fatorAmbientalProjetoService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFatorAmbientalProjetoDto: UpdateFatorAmbientalProjetoDto,
  ) {
    return this.fatorAmbientalProjetoService.update(
      +id,
      updateFatorAmbientalProjetoDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fatorAmbientalProjetoService.remove(+id);
  }
}
