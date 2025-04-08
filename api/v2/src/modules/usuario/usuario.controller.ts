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
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ProtectedRoute } from '../../decorators/protected-route.decorator';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UsuarioDto } from './dto/usuario.dto';
import { UsuarioService } from './usuario.service';

@ApiTags('Usuário')
@ApiBearerAuth()
@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  /**
   * Cria um novo usuário
   * @param createUsuarioDto Dados do usuário
   * @returns O usuário criado
   */
  @ProtectedRoute('admin')
  @Post()
  @ApiOperation({
    summary: 'Criar usuário',
    description:
      'Cria um novo usuário no sistema com as informações fornecidas',
  })
  @ApiCreatedResponse({
    description: 'Usuário criado com sucesso',
    type: UsuarioDto,
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos fornecidos para criação do usuário',
  })
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.create(createUsuarioDto);
  }

  /**
   * Lista todos os usuários
   * @param paginated Indicador se a lista deve ser paginada
   * @param page Número da página
   * @returns Lista de usuários
   */
  @ProtectedRoute()
  @Get()
  @ApiOperation({
    summary: 'Listar usuários',
    description:
      'Retorna a lista de todos os usuários, com suporte a paginação',
  })
  @ApiOkResponse({
    description: 'Lista de usuários recuperada com sucesso',
    type: [UsuarioDto],
  })
  @ApiQuery({
    name: 'paginated',
    required: false,
    type: Boolean,
    description: 'Indica se a resposta deve ser paginada',
    example: true,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número da página a ser retornada (começa em 1)',
    example: 1,
  })
  findAll(
    @Query() { paginated, page }: { paginated?: boolean; page?: number },
  ) {
    return this.usuarioService.findAll(paginated, page);
  }

  /**
   * Busca um usuário por ID
   * @param id ID do usuário
   * @returns O usuário encontrado
   */
  @ProtectedRoute()
  @Get(':id')
  @ApiOperation({
    summary: 'Buscar usuário por ID',
    description: 'Recupera as informações de um usuário específico pelo seu ID',
  })
  @ApiOkResponse({
    description: 'Usuário encontrado',
    type: UsuarioDto,
  })
  @ApiNotFoundResponse({
    description: 'Usuário não encontrado com o ID fornecido',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do usuário a ser consultado',
    type: Number,
    example: 1,
  })
  findOne(@Param('id') id: number) {
    return this.usuarioService.findOne(id);
  }

  /**
   * Atualiza um usuário
   * @param id ID do usuário
   * @param updateUsuarioDto Dados para atualização
   * @returns O usuário atualizado
   */
  @ProtectedRoute('admin')
  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar usuário',
    description: 'Atualiza os dados de um usuário existente',
  })
  @ApiOkResponse({
    description: 'Usuário atualizado com sucesso',
    type: UsuarioDto,
  })
  @ApiNotFoundResponse({
    description: 'Usuário não encontrado com o ID fornecido',
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos fornecidos para atualização',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do usuário a ser atualizado',
    type: Number,
    example: 1,
  })
  update(
    @Param('id') id: number,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.usuarioService.update(id, updateUsuarioDto);
  }

  /**
   * Remove um usuário
   * @param id ID do usuário
   * @returns Confirmação de remoção
   */
  @ProtectedRoute('admin')
  @Delete(':id')
  @ApiOperation({
    summary: 'Remover usuário',
    description: 'Remove permanentemente um usuário do sistema',
  })
  @ApiOkResponse({
    description: 'Usuário removido com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Usuário removido com sucesso',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Usuário não encontrado com o ID fornecido',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do usuário a ser removido',
    type: Number,
    example: 1,
  })
  remove(@Param('id') id: number) {
    return this.usuarioService.remove(id);
  }
}
