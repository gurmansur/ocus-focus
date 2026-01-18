import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../common/base/base.controller';
import { ProjetoAtual } from '../../decorators/projeto-atual.decorator';
import { Serialize } from '../../decorators/serialize.decorator';
import { Projeto } from '../projeto/entities/projeto.entity';
import { ColaboradorService } from './colaborador.service';
import { CreateColaboradorDto } from './dto/create-colaborador.dto';
import { UpdateColaboradorDto } from './dto/update-colaborador.dto';

@Serialize()
@ApiTags('Colaborador')
@Controller('colaboradores')
export class ColaboradorController extends BaseController {
  constructor(private readonly colaboradorService: ColaboradorService) {
    super();
  }

  @Post()
  create(@Body() createColaboradorDto: CreateColaboradorDto) {
    return this.colaboradorService.create(createColaboradorDto);
  }

  @Get('projeto')
  findAllFromProject(@ProjetoAtual() projeto: Projeto) {
    return this.colaboradorService.findAllFromProject(+projeto.id);
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
