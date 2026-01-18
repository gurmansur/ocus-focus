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
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BaseController } from '../../common/base/base.controller';
import { ProjetoAtual } from '../../decorators/projeto-atual.decorator';
import { Serialize } from '../../decorators/serialize.decorator';
import { Projeto } from '../projeto/entities/projeto.entity';
import { CreateSuiteDeTesteDto } from './dto/create-suite-de-teste.dto';
import { SuiteDeTesteDto } from './dto/suite-de-teste.dto';
import { UpdateSuiteDeTesteDto } from './dto/update-suite-de-teste.dto';
import { SuiteDeTesteMapper } from './suite-de-teste.mapper';
import { SuiteDeTesteService } from './suite-de-teste.service';

@ApiTags('Suite de Teste')
@ApiBearerAuth()
@Serialize()
@ApiUnauthorizedResponse({ description: 'Não autorizado' })
@Controller('suite-de-teste')
export class SuiteDeTesteController extends BaseController {
  constructor(private readonly suiteDeTesteService: SuiteDeTesteService) {
    super();
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Suite de teste criada com sucesso',
    type: SuiteDeTesteDto,
  })
  async create(
    @Body() createSuiteDeTesteDto: CreateSuiteDeTesteDto,
    @ProjetoAtual() projeto: Projeto,
  ) {
    const bo = SuiteDeTesteMapper.createSuiteDeTesteDtoToBo(
      createSuiteDeTesteDto,
    );

    const response = await this.suiteDeTesteService.create(bo, projeto);
    return SuiteDeTesteMapper.boToDto(response);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Lista de suites de teste',
    type: [SuiteDeTesteDto],
  })
  async findAll(@ProjetoAtual() projeto: Projeto) {
    const response = await this.suiteDeTesteService.findAll(projeto);

    return response.map((bo) => SuiteDeTesteMapper.boToDto(bo));
  }

  @Get('file-tree')
  @ApiResponse({
    status: 200,
    description: 'Árvore de arquivos',
    type: [SuiteDeTesteDto],
  })
  async getFileTree(
    @ProjetoAtual() projeto: Projeto,
    @Query('id') id?: string,
  ) {
    const response = await this.suiteDeTesteService.getFileTree(projeto, +id);

    return SuiteDeTesteMapper.fileTreeBoToDto(response);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Suite de teste encontrada',
    type: SuiteDeTesteDto,
  })
  @ApiParam({ name: 'id', description: 'Id da suite de teste' })
  async findOne(@Param('id') id: string, @ProjetoAtual() projeto: Projeto) {
    const response = await this.suiteDeTesteService.findOne(+id, projeto);
    return response
      ? SuiteDeTesteMapper.boToDto(SuiteDeTesteMapper.entityToBo(response))
      : null;
  }

  @Patch(':id/change-suite')
  @ApiResponse({
    status: 200,
    description: 'Suite de teste atualizada',
    type: SuiteDeTesteDto,
  })
  @ApiParam({ name: 'id', description: 'Id da suite de teste' })
  async changeSuite(
    @Param('id') id: string,
    @Body() { suiteId }: { suiteId: number },
    @ProjetoAtual() projeto: Projeto,
  ) {
    const response = await this.suiteDeTesteService.changeSuite(
      +id,
      suiteId,
      projeto,
    );
    return SuiteDeTesteMapper.boToDto(response);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Suite de teste atualizada',
    type: SuiteDeTesteDto,
  })
  @ApiParam({ name: 'id', description: 'Id da suite de teste' })
  async update(
    @Param('id') id: string,
    @Body() updateSuiteDeTesteDto: UpdateSuiteDeTesteDto,
    @ProjetoAtual() projeto: Projeto,
  ) {
    const bo = SuiteDeTesteMapper.updateSuiteDeTesteDtoToBo(
      updateSuiteDeTesteDto,
    );
    const response = await this.suiteDeTesteService.update(+id, bo, projeto);

    return SuiteDeTesteMapper.boToDto(response);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Suite de teste removida',
  })
  @ApiParam({ name: 'id', description: 'Id da suite de teste' })
  async remove(@Param('id') id: string, @ProjetoAtual() projeto: Projeto) {
    return this.suiteDeTesteService.remove(+id, projeto);
  }

  @Get(':id/run')
  @ApiResponse({
    status: 200,
    description: 'Suite de teste executada de forma automatizada',
  })
  //TODO: Implementar a execução da suite de teste
  @ApiExcludeEndpoint()
  @ApiParam({ name: 'id', description: 'Id da suite de teste' })
  runSuite(@Param('id') id: string) {
    return this.suiteDeTesteService.runSuite(+id);
  }
}
