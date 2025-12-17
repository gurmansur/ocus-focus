import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ProjetoAtual } from '../../decorators/projeto-atual.decorator';
import { Serialize } from '../../decorators/serialize.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { Projeto } from '../projeto/entities/projeto.entity';
import { CreateSuiteDeTesteDto } from './dto/create-suite-de-teste.dto';
import { SuiteDeTesteDto } from './dto/suite-de-teste.dto';
import { UpdateSuiteDeTesteDto } from './dto/update-suite-de-teste.dto';
import { SuiteDeTesteMapper } from './suite-de-teste.mapper';
import { SuiteDeTesteService } from './suite-de-teste.service';

@ApiTags('Suite de Teste')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Serialize()
@ApiUnauthorizedResponse({ description: 'Não autorizado' })
@Controller('suite-de-teste')
export class SuiteDeTesteController {
  constructor(private readonly suiteDeTesteService: SuiteDeTesteService) {}

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
  async findAll() {
    const response = await this.suiteDeTesteService.findAll();

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
  findOne(@Param('id') id: string) {
    return this.suiteDeTesteService.findOne(+id);
  }

  @Patch(':id/change-suite')
  @ApiResponse({
    status: 200,
    description: 'Suite de teste atualizada',
    type: SuiteDeTesteDto,
  })
  @ApiParam({ name: 'id', description: 'Id da suite de teste' })
  changeSuite(
    @Param('id') id: string,
    @Body() { suiteId }: { suiteId: number },
  ) {
    return this.suiteDeTesteService.changeSuite(+id, suiteId);
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
  ) {
    const bo = SuiteDeTesteMapper.updateSuiteDeTesteDtoToBo(
      updateSuiteDeTesteDto,
    );
    const response = await this.suiteDeTesteService.update(+id, bo);

    return SuiteDeTesteMapper.boToDto(response);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Suite de teste removida',
  })
  @ApiParam({ name: 'id', description: 'Id da suite de teste' })
  remove(@Param('id') id: string) {
    return this.suiteDeTesteService.remove(+id);
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
