import {
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
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateRequisitoDto } from './dto/create-requisito.dto';
import { UpdateRequisitoDto } from './dto/update-requisito.dto';
import { RequisitoService } from './requisito-funcional.service';

@UseGuards(AuthGuard)
@ApiTags('Requisito')
@Controller('requisitos')
export class RequisitoController {
  constructor(private readonly requisitoService: RequisitoService) {}

  @Get()
  list(
    @Query('projeto') projetoId: number,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.requisitoService.list(projetoId, page, pageSize);
  }

  @Get('/findByNome')
  listByNamePaginated(
    @Query('nome') nome: string,
    @Query('projeto', ParseIntPipe) projetoId: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
  ) {
    return this.requisitoService.listByNamePaginated(
      nome,
      projetoId,
      page,
      pageSize,
    );
  }

  @Get('/findById')
  getById(@Query('id', ParseIntPipe) id: number) {
    return this.requisitoService.getById(id);
  }

  @Post('/new')
  create(
    @Body() createRequisitoDto: CreateRequisitoDto,
    @Query('projeto') projetoId: number,
  ) {
    return this.requisitoService.create(createRequisitoDto, projetoId);
  }

  @Patch('/update')
  update(
    @Body() updateRequisitoDto: UpdateRequisitoDto,
    @Query('projeto') projetoId: number,
    @Query('requisito') requisitoId: number,
  ) {
    return this.requisitoService.update(
      updateRequisitoDto,
      projetoId,
      requisitoId,
    );
  }

  @Delete('/delete')
  delete(@Query('requisito') requisitoId: number) {
    return this.requisitoService.delete(requisitoId);
  }

  @Get('/resultados/list')
  listResultados(
    @Query('projeto') projetoId: number,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.requisitoService.listResultados(projetoId, page, pageSize);
  }

  @Get('/resultados/findByNome')
  listResultadosByName(
    @Query('nome') nome: string,
    @Query('projeto') projetoId: number,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.requisitoService.listResultadosByName(
      nome,
      projetoId,
      page,
      pageSize,
    );
  }

  @Get('/priorizacao-stakeholders')
  listPriorizacaoStakeholdersWithoutPagination(
    @Query('projeto') projetoId: number,
  ) {
    return this.requisitoService.listPriorizacaoStakeholdersWithoutPagination(
      projetoId,
    );
  }

  @Get('/priorizacao-stakeholders/list')
  listPriorizacaoStakeholders(
    @Query('projeto') projetoId: number,
    @Query('stakeholder') stakeholderId: number,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.requisitoService.listPriorizacaoStakeholders(
      projetoId,
      stakeholderId,
      page,
      pageSize,
    );
  }

  @Get('/priorizacao-stakeholders/findByNome')
  listPriorizacaoStakeholdersByNome(
    @Query('nome') body: string,
    @Query('projeto') projetoId: number,
    @Query('stakeholder') stakeholderId: number,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.requisitoService.listPriorizacaoStakeholdersByNome(
      body,
      projetoId,
      stakeholderId,
      page,
      pageSize,
    );
  }
}
