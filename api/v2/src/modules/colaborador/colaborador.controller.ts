import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ColaboradorService } from './colaborador.service';
import { ColaboradorDto } from './dto/colaborador.dto';
import { CreateColaboradorDto } from './dto/create-colaborador.dto';
import { UpdateColaboradorDto } from './dto/update-colaborador.dto';

@Serialize(ColaboradorDto)
@UseGuards(AuthGuard)
@Controller('colaboradores')
export class ColaboradorController {
  constructor(private readonly colaboradorService: ColaboradorService) {}

  @Post()
  create(@Body() createColaboradorDto: CreateColaboradorDto) {
    return this.colaboradorService.create(createColaboradorDto);
  }

  @Get()
  findAll(@Query('name') name: string, @Query('projeto') projetoId: number) {
    return this.colaboradorService.findAll(
      name,
      projetoId ? projetoId : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.colaboradorService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateColaboradorDto: UpdateColaboradorDto,
  ) {
    return this.colaboradorService.update(+id, updateColaboradorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.colaboradorService.remove(+id);
  }
}
