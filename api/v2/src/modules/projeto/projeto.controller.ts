import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BaseController } from '../../common/base/base.controller';
import { ColaboradorAtual } from '../../decorators/colaborador-atual.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { BillingService } from '../billing/billing.service';
import { ColaboradorService } from '../colaborador/colaborador.service';
import { ColaboradorDto } from '../colaborador/dto/colaborador.dto';
import { CreateProjetoDto } from './dto/create-projeto.dto';
import { UpdateProjetoDto } from './dto/update-projeto.dto';
import { ProjetoService } from './projeto.service';

@ApiTags('Projeto')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Não autorizado' })
@UseGuards(AuthGuard)
@Controller('projetos')
export class ProjetoController extends BaseController {
  constructor(
    private readonly projetoService: ProjetoService,
    private readonly billingService: BillingService,
    private readonly colaboradorService: ColaboradorService,
  ) {
    super();
  }

  @ApiOperation({ summary: 'Criar novo projeto' })
  @Post('new')
  async create(
    @Body() createProjetoDto: CreateProjetoDto,
    @Query('user') user: number,
    @ColaboradorAtual() colaborador: ColaboradorDto,
  ) {
    // Load full colaborador to access usuario relationship
    const colaboradorFull = await this.colaboradorService.findOne(
      colaborador.id,
    );

    // Validate project limit
    const limites = await this.billingService.verificarLimitesAssinatura(
      colaboradorFull.usuario,
    );

    if (limites.limiteProjetos !== null) {
      const projetoCount = await this.projetoService.countUserProjects(
        colaboradorFull.usuario.id,
      );

      if (projetoCount >= limites.limiteProjetos) {
        throw new BadRequestException(
          `Limite de ${limites.limiteProjetos} projeto(s) atingido. Faça upgrade de plano para criar mais projetos.`,
        );
      }
    }

    return this.projetoService.create(createProjetoDto, user);
  }

  @Get()
  findAll(@ColaboradorAtual() user: ColaboradorDto) {
    return this.projetoService.findAll(user.id);
  }

  @Get('findByNome')
  findByNome(
    @Query('nome') nome: string,
    @Query('user') colaboradorId: number,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.projetoService.findByNome(
      nome,
      colaboradorId,
      !!pageSize,
      page,
      pageSize,
    );
  }

  @Get('findById')
  findById(
    @Query('projeto') id: number,
    @Query('colaborador') colaboradorId: number,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.projetoService.findById(
      id,
      colaboradorId,
      !!pageSize,
      page,
      pageSize,
    );
  }

  @Get('findByIdStakeholder')
  findByIdStakeholder(@Query('stakeholder') stakeholderId: number) {
    return this.projetoService.findByStakeholderId(stakeholderId);
  }

  @Get('metrics/total')
  findTotal(@Query('user') user: number) {
    return this.projetoService.findTotal(user);
  }

  @Get('metrics/ongoing')
  findOngoingCount(@Query('user') user: number) {
    return this.projetoService.findOngoingCount(user);
  }

  @Get('metrics/finished')
  findFinishedCount(@Query('user') user: number) {
    return this.projetoService.findFinishedCount(user);
  }

  @Get('metrics/new')
  findNewCount(@Query('user') user: number) {
    return this.projetoService.findNewCount(user);
  }

  @Get('recentes')
  findRecentes(
    @Query('user', ParseIntPipe) user: number,
    @Query('limit') limit: number,
  ) {
    return this.projetoService.findRecentes(user, limit);
  }

  @Patch('update')
  update(
    @Query('projeto') id: number,
    @Body() updateProjetoDto: UpdateProjetoDto,
  ) {
    return this.projetoService.update(+id, updateProjetoDto);
  }

  @Delete('delete')
  remove(@Query('projeto') id: number) {
    return this.projetoService.remove(+id);
  }

  @Get('colaboradores')
  findColaboradores(
    @Query('projeto') projetoId: number,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.projetoService.findColaboradores(projetoId, page, pageSize);
  }

  @Get('colaboradores/findByNome')
  findColaboradoresByNome(
    @Query('projeto') projetoId: number,
    @Query('nome') nome: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.projetoService.findColaboradoresByNome(
      projetoId,
      nome,
      page,
      pageSize,
    );
  }

  @Post('addColaborador')
  addColaborador(
    @Query('projeto') projetoId: number,
    @Query('colaborador') colaboradorId: number,
  ) {
    return this.projetoService.addColaborador(projetoId, colaboradorId);
  }

  @Delete('removeColaborador')
  removeColaborador(
    @Query('projeto') projetoId: number,
    @Query('colaborador') colaboradorId: number,
    @ColaboradorAtual() user: ColaboradorDto,
  ) {
    return this.projetoService.removeColaborador(
      projetoId,
      colaboradorId,
      user,
    );
  }
}
