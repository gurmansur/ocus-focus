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
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateFatorAmbientalProjetoDto } from './dto/create-fator-ambiental-projeto.dto';
import { UpdateFatorAmbientalProjetoDto } from './dto/update-fator-ambiental-projeto.dto';
import { FatorAmbientalProjetoService } from './fator-ambiental-projeto.service';

@UseGuards(AuthGuard)
@ApiTags('Fatores Ambientais')
@Controller('fatores-ambientais')
export class FatorAmbientalProjetoController {
  constructor(
    private readonly fatorAmbientalProjetoService: FatorAmbientalProjetoService,
  ) {}

  @Get()
  findAll(
    @Query('projeto') projeto: number,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.fatorAmbientalProjetoService.findAll(projeto, page, pageSize);
  }

  @Get('findById')
  findOne(@Query('fator') id: string) {
    return this.fatorAmbientalProjetoService.getById(+id);
  }

  @Post()
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
