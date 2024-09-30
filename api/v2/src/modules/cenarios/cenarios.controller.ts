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
import { AuthGuard } from 'src/guards/auth.guard';
import { CenariosService } from './cenarios.service';
import { CreateCenarioDto } from './dto/create-cenario.dto';
import { UpdateCenarioDto } from './dto/update-cenario.dto';

@UseGuards(AuthGuard)
@Controller('cenarios')
export class CenariosController {
  constructor(private readonly cenariosService: CenariosService) {}

  @Get()
  findAll(
    @Query() { paginated, page }: { paginated?: boolean; page?: number },
  ) {
    return this.cenariosService.findAll(paginated, page);
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
  create(@Body() createCenarioDto: CreateCenarioDto) {
    return this.cenariosService.create(createCenarioDto);
  }

  @Patch('update')
  update(
    @Query('id') id: string,
    @Query('caso') casoId: string,
    @Body() updateCenarioDto: UpdateCenarioDto,
  ) {
    return this.cenariosService.update(+id, +casoId, updateCenarioDto);
  }

  @Delete('delete')
  remove(@Query('id') id: string) {
    return this.cenariosService.remove(+id);
  }
}
