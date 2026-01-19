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
import { UsuarioAtual } from '../../decorators/usuario-atual.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { BillingService } from '../billing/billing.service';
import { Usuario } from '../usuario/entities/usuario.entity';
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
  ) {
    super();
  }

  @ApiOperation({ summary: 'Criar novo projeto' })
  @Post('new')
  async create(
    @Body() createProjetoDto: CreateProjetoDto,
    @Query('user') user: number,
    @UsuarioAtual() usuario: Usuario,
  ) {
    // Validate project limit
    const limites =
      await this.billingService.verificarLimitesAssinatura(usuario);

    if (limites.limiteProjetos !== null) {
      const projetoCount = await this.projetoService.countUserProjects(
        usuario.id,
      );

      if (projetoCount >= limites.limiteProjetos) {
        throw new BadRequestException(
          `Limite de ${limites.limiteProjetos} projeto(s) atingido. Faça upgrade de plano para criar mais projetos.`,
        );
      }
    }

    return this.projetoService.create(createProjetoDto, usuario.id);
  }

  @Get()
  findAll(@UsuarioAtual() user: Usuario) {
    return this.projetoService.findAll(user.id);
  }

  @Get('findByNome')
  findByNome(
    @Query('nome') nome: string,
    @UsuarioAtual() user: Usuario,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.projetoService.findByNome(
      nome,
      user.id,
      !!pageSize,
      page,
      pageSize,
    );
  }

  @Get('findById')
  findById(
    @Query('projeto') id: number,
    @UsuarioAtual() user: Usuario,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.projetoService.findById(
      id,
      user.id,
      !!pageSize,
      page,
      pageSize,
    );
  }

  @Get('metrics/total')
  findTotal(@UsuarioAtual() user: Usuario) {
    return this.projetoService.findTotal(user.id);
  }

  @Get('metrics/ongoing')
  findOngoingCount(@UsuarioAtual() user: Usuario) {
    return this.projetoService.findOngoingCount(user.id);
  }

  @Get('metrics/finished')
  findFinishedCount(@UsuarioAtual() user: Usuario) {
    return this.projetoService.findFinishedCount(user.id);
  }

  @Get('metrics/new')
  findNewCount(@UsuarioAtual() user: Usuario) {
    return this.projetoService.findNewCount(user.id);
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
    return this.projetoService.findUsuarios(projetoId, page, pageSize);
  }

  @Get('colaboradores/findByNome')
  findColaboradoresByNome(
    @Query('projeto') projetoId: number,
    @Query('nome') nome: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.projetoService.findUsuariosByNome(
      projetoId,
      nome,
      page,
      pageSize,
    );
  }

  @Post('addColaborador')
  addColaborador(
    @Query('projeto') projetoId: number,
    @Query('colaborador') usuarioId: number,
  ) {
    return this.projetoService.addUsuario(projetoId, usuarioId);
  }

  @Delete('removeColaborador')
  removeColaborador(
    @Query('projeto') projetoId: number,
    @Query('colaborador') usuarioId: number,
    @UsuarioAtual() user: Usuario,
  ) {
    return this.projetoService.removeUsuario(projetoId, usuarioId, user.id);
  }
}
