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
import { CreateFatorAmbientalProjetoDto } from './dto/create-fator-ambiental-projeto.dto';
import { UpdateFatorAmbientalProjetoDto } from './dto/update-fator-ambiental-projeto.dto';
import { FatorAmbientalProjetoService } from './fator-ambiental-projeto.service';

@ApiTags('Fatores Ambientais')
@Controller('fatores-ambientais')
export class FatorAmbientalProjetoController extends BaseController {
  constructor(
    private readonly fatorAmbientalProjetoService: FatorAmbientalProjetoService,
  ) {
    super();
  }

  @Get()
  findAll(
    @Query('projeto') projeto: number,
    @Query('page') page: number,
    @Query('size') pageSize: number,
  ) {
    return this.fatorAmbientalProjetoService.findAll(projeto, page, pageSize);
  }

  @Get('findById')
  findOne(@Query('fator') id: string) {
    return this.fatorAmbientalProjetoService.getById(+id);
  }

  @Post('new')
  create(
    @Query('projeto') projeto: number,
    @Body() createFatorAmbientalProjetoDto: CreateFatorAmbientalProjetoDto,
  ) {
    return this.fatorAmbientalProjetoService.create(
      projeto,
      createFatorAmbientalProjetoDto,
    );
  }

  @Patch('update')
  update(
    @Query('fatores') id: string,
    @Body() updateFatorAmbientalProjetoDto: UpdateFatorAmbientalProjetoDto,
  ) {
    return this.fatorAmbientalProjetoService.update(
      +id,
      updateFatorAmbientalProjetoDto,
    );
  }

  @Delete('delete')
  remove(@Query('idFat') id: string) {
    return this.fatorAmbientalProjetoService.remove(+id);
  }
}
