import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BaseController } from '../../common/base/base.controller';
import { ProjetoAtual } from '../../decorators/projeto-atual.decorator';
import { Projeto } from '../projeto/entities/projeto.entity';
import { ConfiguracaoSeleniumMapper } from './configuracao-selenium.mapper';
import { ConfiguracaoSeleniumService } from './configuracao-selenium.service';
import { ConfiguracaoSeleniumDto } from './dto/configuracao-selenium.dto';
import { CreateConfiguracaoSeleniumDto } from './dto/create-configuracao-selenium.dto';
import { UpdateConfiguracaoSeleniumDto } from './dto/update-configuracao-selenium.dto';

@ApiTags('Configuração Selenium')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Não autorizado' })
@Controller('configuracao-selenium')
export class ConfiguracaoSeleniumController extends BaseController {
  constructor(
    private readonly configuracaoSeleniumService: ConfiguracaoSeleniumService,
  ) {
    super();
  }

  @ApiResponse({
    status: 201,
    description: 'Criado com sucesso',
    type: ConfiguracaoSeleniumDto,
  })
  @Post()
  async create(
    @Body() createConfiguracaoSeleniumDto: CreateConfiguracaoSeleniumDto,
  ) {
    const bo = ConfiguracaoSeleniumMapper.createDtoToBo(
      createConfiguracaoSeleniumDto,
    );
    const result = await this.configuracaoSeleniumService.create(bo);
    return ConfiguracaoSeleniumMapper.boToDto(result);
  }

  @ApiResponse({
    status: 200,
    description: 'Lista de configurações',
    type: [ConfiguracaoSeleniumDto],
  })
  @Get()
  async findAll(@ProjetoAtual() projeto: Projeto) {
    const bos = await this.configuracaoSeleniumService.findAll(projeto);
    return bos.map((bo) => ConfiguracaoSeleniumMapper.boToDto(bo));
  }

  @ApiResponse({
    status: 200,
    description: 'Configuração ativa do projeto',
    type: ConfiguracaoSeleniumDto,
  })
  @Get('ativa')
  async findAtiva(@ProjetoAtual() projeto: Projeto) {
    const bo =
      await this.configuracaoSeleniumService.findAtivaPorProjeto(projeto);
    return ConfiguracaoSeleniumMapper.boToDto(bo);
  }

  @ApiResponse({
    status: 200,
    description: 'Configuração encontrada',
    type: ConfiguracaoSeleniumDto,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID da configuração',
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const bo = await this.configuracaoSeleniumService.findOne(+id);
    return ConfiguracaoSeleniumMapper.boToDto(bo);
  }

  @ApiResponse({
    status: 200,
    description: 'Atualizado com sucesso',
    type: ConfiguracaoSeleniumDto,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID da configuração',
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateConfiguracaoSeleniumDto: UpdateConfiguracaoSeleniumDto,
  ) {
    const bo = ConfiguracaoSeleniumMapper.updateDtoToBo(
      updateConfiguracaoSeleniumDto,
    );
    const result = await this.configuracaoSeleniumService.update(+id, bo);
    return ConfiguracaoSeleniumMapper.boToDto(result);
  }

  @ApiResponse({
    status: 200,
    description: 'Removido com sucesso',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID da configuração',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.configuracaoSeleniumService.remove(+id);
  }
}
