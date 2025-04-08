import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpStatus,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiDocs } from '../../decorators/api-docs.decorator';
import { ColaboradorAtual } from '../../decorators/colaborador-atual.decorator';
import { Roles } from '../../decorators/roles.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { SanitizePipe } from '../../pipes/sanitize.pipe';
import { ColaboradorDto } from '../colaborador/dto/colaborador.dto';
import { CreateProjetoDto } from './dto/create-projeto.dto';
import { UpdateProjetoDto } from './dto/update-projeto.dto';
import { ProjetoService } from './projeto.service';

@UseGuards(AuthGuard)
@ApiTags('Projeto')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Não autorizado' })
@Controller('projetos')
export class ProjetoController {
  constructor(private readonly projetoService: ProjetoService) {}

  @Post('new')
  @ApiDocs({
    summary: 'Criar um novo projeto',
    status: HttpStatus.CREATED,
    responseDescription: 'Projeto criado com sucesso',
  })
  create(
    @Body(SanitizePipe) createProjetoDto: CreateProjetoDto,
    @Query('user', ParseIntPipe) user: number,
  ) {
    return this.projetoService.create(createProjetoDto, user);
  }

  @Get()
  @ApiDocs({
    summary: 'Listar todos os projetos',
    responseDescription: 'Lista de projetos recuperada com sucesso',
  })
  findAll() {
    return this.projetoService.findAll();
  }

  @Get('findByNome')
  @ApiDocs({
    summary: 'Buscar projetos por nome',
    responseDescription: 'Projetos encontrados com sucesso',
  })
  findByNome(
    @Query('nome', SanitizePipe) nome: string,
    @Query('user', ParseIntPipe) colaboradorId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
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
  @ApiDocs({
    summary: 'Buscar projeto por ID',
    responseDescription: 'Projeto encontrado com sucesso',
  })
  findById(
    @Query('projeto', ParseIntPipe) id: number,
    @Query('colaborador', ParseIntPipe) colaboradorId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
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
  @ApiDocs({
    summary: 'Buscar projetos por ID do stakeholder',
    responseDescription: 'Projetos encontrados com sucesso',
  })
  findByIdStakeholder(
    @Query('stakeholder', ParseIntPipe) stakeholderId: number,
  ) {
    return this.projetoService.findByStakeholderId(stakeholderId);
  }

  @Get('metrics/total')
  @ApiDocs({
    summary: 'Obter o total de projetos de um usuário',
    responseDescription: 'Total de projetos obtido com sucesso',
  })
  findTotal(@Query('user', ParseIntPipe) user: number) {
    return this.projetoService.findTotal(user);
  }

  @Get('metrics/ongoing')
  @ApiDocs({
    summary: 'Obter a quantidade de projetos em andamento',
    responseDescription:
      'Quantidade de projetos em andamento obtida com sucesso',
  })
  findOngoingCount(@Query('user', ParseIntPipe) user: number) {
    return this.projetoService.findOngoingCount(user);
  }

  @Get('metrics/finished')
  @ApiDocs({
    summary: 'Obter a quantidade de projetos finalizados',
    responseDescription:
      'Quantidade de projetos finalizados obtida com sucesso',
  })
  findFinishedCount(@Query('user', ParseIntPipe) user: number) {
    return this.projetoService.findFinishedCount(user);
  }

  @Get('metrics/new')
  @ApiDocs({
    summary: 'Obter a quantidade de projetos novos',
    responseDescription: 'Quantidade de projetos novos obtida com sucesso',
  })
  findNewCount(@Query('user', ParseIntPipe) user: number) {
    return this.projetoService.findNewCount(user);
  }

  @Get('recentes')
  @ApiDocs({
    summary: 'Obter projetos recentes de um usuário',
    responseDescription: 'Projetos recentes obtidos com sucesso',
  })
  findRecentes(
    @Query('user', ParseIntPipe) user: number,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number,
  ) {
    return this.projetoService.findRecentes(user, limit);
  }

  @Patch('update')
  @ApiDocs({
    summary: 'Atualizar um projeto',
    responseDescription: 'Projeto atualizado com sucesso',
  })
  @Roles('admin', 'gerente')
  update(
    @Query('projeto', ParseIntPipe) id: number,
    @Body(SanitizePipe) updateProjetoDto: UpdateProjetoDto,
  ) {
    return this.projetoService.update(id, updateProjetoDto);
  }

  @Delete('delete')
  @ApiDocs({
    summary: 'Remover um projeto',
    responseDescription: 'Projeto removido com sucesso',
    status: HttpStatus.NO_CONTENT,
  })
  @Roles('admin')
  remove(@Query('projeto', ParseIntPipe) id: number) {
    return this.projetoService.remove(id);
  }

  @Get('colaboradores')
  @ApiDocs({
    summary: 'Listar colaboradores de um projeto',
    responseDescription: 'Lista de colaboradores recuperada com sucesso',
  })
  findColaboradores(
    @Query('projeto', ParseIntPipe) projetoId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
  ) {
    return this.projetoService.findColaboradores(projetoId, page, pageSize);
  }

  @Get('colaboradores/findByNome')
  @ApiDocs({
    summary: 'Buscar colaboradores de um projeto por nome',
    responseDescription: 'Colaboradores encontrados com sucesso',
  })
  findColaboradoresByNome(
    @Query('projeto', ParseIntPipe) projetoId: number,
    @Query('nome', SanitizePipe) nome: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
  ) {
    return this.projetoService.findColaboradoresByNome(
      projetoId,
      nome,
      page,
      pageSize,
    );
  }

  @Post('addColaborador')
  @ApiDocs({
    summary: 'Adicionar colaborador a um projeto',
    responseDescription: 'Colaborador adicionado com sucesso',
    status: HttpStatus.CREATED,
  })
  @Roles('admin', 'gerente')
  addColaborador(
    @Query('projeto', ParseIntPipe) projetoId: number,
    @Query('colaborador', ParseIntPipe) colaboradorId: number,
  ) {
    return this.projetoService.addColaborador(projetoId, colaboradorId);
  }

  @Delete('removeColaborador')
  @ApiDocs({
    summary: 'Remover colaborador de um projeto',
    responseDescription: 'Colaborador removido com sucesso',
    status: HttpStatus.NO_CONTENT,
  })
  @Roles('admin', 'gerente')
  removeColaborador(
    @Query('projeto', ParseIntPipe) projetoId: number,
    @Query('colaborador', ParseIntPipe) colaboradorId: number,
    @ColaboradorAtual() user: ColaboradorDto,
  ) {
    return this.projetoService.removeColaborador(
      projetoId,
      colaboradorId,
      user,
    );
  }
}
