import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../common/base/base.controller';
import { CenariosService } from './cenarios.service';
import { CreateCenarioDto } from './dto/create-cenario.dto';
import { UpdateCenarioDto } from './dto/update-cenario.dto';

@ApiTags('Cenário')
@Controller('cenarios')
export class CenariosController extends BaseController {
  constructor(private readonly cenariosService: CenariosService) {
    super();
  }

  @Get()
  findAll(
    @Query('caso') caso: number,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.cenariosService.findAll(caso, page, pageSize);
  }

  @Get('findById')
  findById(@Query('id') id: string) {
    return this.cenariosService.findOne(+id);
  }

  @Get('findByNome')
  findByNome(@Query('nome') nome: string) {
    return this.cenariosService.findByNome(nome);
  }

  @Post('new')
  create(
    @Body() createCenarioDto: CreateCenarioDto,
    @Query('caso') casoId: string,
  ) {
    return this.cenariosService.create(createCenarioDto, +casoId);
  }

  @Patch('update')
  update(
    @Query('cenario') id: string,
    @Query('caso') casoId: string,
    @Body() updateCenarioDto: UpdateCenarioDto,
  ) {
    return this.cenariosService.update(+id, +casoId, updateCenarioDto);
  }

  @Delete('delete')
  remove(@Query('cenario') id: string) {
    return this.cenariosService.remove(+id);
  }
}
