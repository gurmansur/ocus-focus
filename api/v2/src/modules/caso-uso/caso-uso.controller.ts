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
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProjetoAtual } from '../../decorators/projeto-atual.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { Projeto } from '../projeto/entities/projeto.entity';
import { CasoUsoService } from './caso-uso.service';
import { CreateCasoUsoDto } from './dto/create-caso-uso.dto';
import { UpdateCasoUsoDto } from './dto/update-caso-uso.dto';

@UseGuards(AuthGuard)
@ApiTags('Caso de Uso')
@ApiResponse({ status: 401, description: 'Não autorizado' })
@ApiBearerAuth()
@Controller('caso-de-uso')
export class CasoUsoController {
  constructor(private readonly casoUsoService: CasoUsoService) {}

  @ApiResponse({
    status: 200,
    description: 'Retorna todos os casos de uso',
  })
  @Get()
  findAll(
    @Query('requisito') requisito: number,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @ProjetoAtual() projeto: Projeto,
  ) {
    return this.casoUsoService.findAll(requisito, page, pageSize, projeto);
  }

  // TODO fazer o DTO da resposta aqui e ver se o service retorna certo
  @ApiResponse({
    status: 200,
    description: 'Retorna um caso de uso buscando pelo nome',
  })
  @Get('findByNome')
  findByNome(@Query('nome') nome: string) {
    return this.casoUsoService.findByNome(nome);
  }

  @ApiResponse({
    status: 200,
    description: 'Retorna um caso de uso buscando pelo id',
  })
  @Get('findById')
  findOne(@Query('id') id: string) {
    return this.casoUsoService.findOne(+id);
  }

  @ApiResponse({
    status: 200,
    description: 'Retorna a quantiade total de casos de uso',
  })
  // aqui ele recebe o id de requisito funcional, mas tá certo
  // o nome da variável como caso
  @Get('metrics/total')
  getTotal(@Query('caso') caso: number) {
    return this.casoUsoService.getMetrics(caso);
  }

  @ApiResponse({
    status: 200,
    description: 'Retorna a quantidade de casos de uso simples',
  })
  @Get('metrics/simples')
  getTotalSimples(@Query('caso') caso: number) {
    return this.casoUsoService.getMetrics(caso, 'SIMPLES');
  }

  @ApiResponse({
    status: 200,
    description: 'Retorna a quantidade de casos de uso médios',
  })
  @Get('metrics/medios')
  getTotalMedios(@Query('caso') caso: number) {
    return this.casoUsoService.getMetrics(caso, 'MEDIO');
  }

  @ApiResponse({
    status: 200,
    description: 'Retorna a quantidade de casos de uso complexos',
  })
  @Get('metrics/complexos')
  getTotalComplexos(@Query('caso') caso: number) {
    return this.casoUsoService.getMetrics(caso, 'COMPLEXO');
  }

  @ApiResponse({
    status: 201,
    description: 'Cria um novo caso de uso',
    type: CreateCasoUsoDto,
  })
  @Post('new')
  create(
    @Body() createCasoUsoDto: CreateCasoUsoDto,
    @Query('requisito') requisitoId: number,
  ) {
    return this.casoUsoService.create(createCasoUsoDto, requisitoId);
  }

  @ApiResponse({
    status: 200,
    description: 'Atualiza um caso de uso',
    type: UpdateCasoUsoDto,
  })
  @Patch('update')
  update(
    @Query('caso') id: string,
    @Query('requisito') requisito: number,
    @Body() updateCasoUsoDto: UpdateCasoUsoDto,
  ) {
    return this.casoUsoService.update(+id, +requisito, updateCasoUsoDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Remove um caso de uso',
  })
  @Delete('delete')
  remove(@Query('id') id: string) {
    return this.casoUsoService.remove(+id);
  }
}
