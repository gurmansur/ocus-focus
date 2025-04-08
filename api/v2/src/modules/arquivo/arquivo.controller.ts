import { ApiBearerAuth } from '@nestjs/swagger';
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
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProtectedRoute } from '../../decorators/protected-route.decorator';
import { ArquivoService } from './arquivo.service';
import { CreateArquivoDto } from './dto/create-arquivo.dto';
import { UpdateArquivoDto } from './dto/update-arquivo.dto';

@ApiTags('Arquivo')
@ApiBearerAuth()
@Controller('arquivo')
export class ArquivoController {
  constructor(private readonly arquivoService: ArquivoService) {}

  /**
   * Cria um novo arquivo
   * @param createArquivoDto Dados do arquivo
   * @returns O arquivo criado
   */
  @ProtectedRoute('admin', 'gerente', 'analista')
  @Post()
  @ApiOperation({ summary: 'Criar', description: 'Cria um novo recurso' })
  @ApiCreatedResponse({ description: 'Recurso criado com sucesso' })
  @ApiOperation({ summary: 'Criar', description: 'Cria um novo recurso' })
  @ApiCreatedResponse({ description: 'Recurso criado com sucesso' })
  @ApiOkResponse({ description: 'Arquivo criado com sucesso' })
  create(@Body() createArquivoDto: CreateArquivoDto) {
    return this.arquivoService.create(createArquivoDto);
  }

  /**
   * Lista todos os arquivos
   * @returns Lista de arquivos
   */
  @ProtectedRoute()
  @Get()
  @ApiOperation({
    summary: 'Buscar',
    description: 'Busca recursos específicos',
  })
  @ApiOperation({ summary: 'Listar', description: 'Lista todos os recursos' })
  @ApiOkResponse({ description: 'Lista de arquivos' })
  findAll() {
    return this.arquivoService.findAll();
  }

  /**
   * Busca um arquivo pelo ID
   * @param id ID do arquivo
   * @returns O arquivo encontrado
   */
  @ProtectedRoute()
  @Get(':id')
  @ApiOperation({
    summary: 'Buscar',
    description: 'Busca recursos específicos',
  })
  @ApiOkResponse({ description: 'Arquivo encontrado' })
  findOne(@Param('id') id: string) {
    return this.arquivoService.findOne(+id);
  }

  /**
   * Atualiza um arquivo
   * @param id ID do arquivo
   * @param updateArquivoDto Dados para atualização
   * @returns O arquivo atualizado
   */
  @ProtectedRoute('admin', 'gerente', 'analista')
  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar',
    description: 'Atualiza um recurso existente',
  })
  @ApiResponse({ status: 200, description: 'Recurso atualizado com sucesso' })
  @ApiOkResponse({ description: 'Arquivo atualizado com sucesso' })
  update(@Param('id') id: string, @Body() updateArquivoDto: UpdateArquivoDto) {
    return this.arquivoService.update(+id, updateArquivoDto);
  }

  /**
   * Remove um arquivo
   * @param id ID do arquivo
   * @returns Confirmação de remoção
   */
  @ProtectedRoute('admin', 'gerente')
  @Delete(':id')
  @ApiOperation({ summary: 'Remover', description: 'Remove um recurso' })
  @ApiResponse({ status: 200, description: 'Recurso removido com sucesso' })
  @ApiOkResponse({ description: 'Arquivo removido com sucesso' })
  remove(@Param('id') id: string) {
    return this.arquivoService.remove(+id);
  }
}
