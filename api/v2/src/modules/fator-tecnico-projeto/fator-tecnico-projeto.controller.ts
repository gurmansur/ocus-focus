import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../guards/auth.guard';
import { CreateFatorTecnicoProjetoDto } from './dto/create-fator-tecnico-projeto.dto';
import { UpdateFatorTecnicoProjetoDto } from './dto/update-fator-tecnico-projeto.dto';
import { FatorTecnicoProjetoService } from './fator-tecnico-projeto.service';

@UseGuards(AuthGuard)
@ApiTags('Fatores Técnicos')
@Controller('fatores-tecnicos')
export class FatorTecnicoProjetoController {
  constructor(
    private readonly fatorTecnicoProjetoService: FatorTecnicoProjetoService,
  ) {}

  @Get()
  findAll(
    @Query('projeto') projetoId: string,
    @Query('page') page?: string,
    @Query('size') pageSize?: string,
  ) {
    return this.fatorTecnicoProjetoService.findAll(
      +projetoId,
      +page,
      +pageSize,
    );
  }

  @Get('getById')
  findOne(@Query('fator') id: string) {
    return this.fatorTecnicoProjetoService.getById(+id);
  }

  @Post('new')
  create(
    @Query('projeto') projetoId: number,
    @Body() createFatorTecnicoProjetoDto: CreateFatorTecnicoProjetoDto,
  ) {
    return this.fatorTecnicoProjetoService.create(
      projetoId,
      createFatorTecnicoProjetoDto,
    );
  }

  @Patch('update')
  update(
    @Query('fatores') id: string,
    @Body() updateFatorTecnicoProjetoDto: UpdateFatorTecnicoProjetoDto,
  ) {
    return this.fatorTecnicoProjetoService.update(
      +id,
      updateFatorTecnicoProjetoDto,
    );
  }

  @Delete('delete')
  remove(@Query('idFat') id: string) {
    return this.fatorTecnicoProjetoService.remove(+id);
  }
}
