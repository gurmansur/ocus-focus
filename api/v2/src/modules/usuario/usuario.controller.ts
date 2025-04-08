import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiDocs, Roles } from '../../decorators';
import { AuthGuard, RolesGuard } from '../../guards';
import {
  LoggingInterceptor,
  TimeoutInterceptor,
  TransformInterceptor,
} from '../../interceptors';
import { SanitizePipe } from '../../pipes';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UsuarioService } from './usuario.service';

/**
 * Controller responsável por gerenciar operações relacionadas a usuários
 */
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, TransformInterceptor, TimeoutInterceptor)
@ApiTags('Usuário')
@Controller('usuario')
export class UsuarioController {
  private readonly logger = new Logger(UsuarioController.name);

  constructor(private readonly usuarioService: UsuarioService) {}

  /**
   * Registra uma operação no log
   * @param operation Nome da operação
   * @param details Detalhes da operação
   */
  private logOperation(operation: string, details?: any): void {
    this.logger.log(
      `Operação: ${operation}${details ? ` - ${JSON.stringify(details)}` : ''}`,
    );
  }

  /**
   * Cria um novo usuário
   * @param createUsuarioDto Dados do usuário a ser criado
   * @returns Usuário criado
   */
  @Post()
  @ApiDocs({
    summary: 'Criar um novo usuário',
    status: HttpStatus.CREATED,
    responseDescription: 'Usuário criado com sucesso',
  })
  @Roles('admin')
  create(@Body(SanitizePipe) createUsuarioDto: CreateUsuarioDto) {
    this.logOperation('create', { dto: createUsuarioDto });
    return this.usuarioService.create(createUsuarioDto);
  }

  /**
   * Lista todos os usuários do sistema
   * @param paginated Se deve paginar os resultados
   * @param page Número da página
   * @returns Lista de usuários
   */
  @Get()
  @ApiDocs({
    summary: 'Listar todos os usuários',
    responseDescription: 'Lista de usuários recuperada com sucesso',
  })
  findAll(
    @Query('paginated') paginated?: boolean,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
  ) {
    this.logOperation('findAll', { paginated, page });
    // Melhoria de performance: definir valores padrão quando necessário
    return this.usuarioService.findAll(paginated, page || 1);
  }

  /**
   * Busca um usuário pelo ID
   * @param id ID do usuário
   * @returns Usuário encontrado
   */
  @Get(':id')
  @ApiDocs({
    summary: 'Obter um usuário pelo ID',
    responseDescription: 'Usuário recuperado com sucesso',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    this.logOperation('findOne', { id });
    return this.usuarioService.findOne(id);
  }

  /**
   * Atualiza um usuário existente
   * @param id ID do usuário
   * @param updateUsuarioDto Dados para atualização
   * @returns Usuário atualizado
   */
  @Patch(':id')
  @ApiDocs({
    summary: 'Atualizar um usuário',
    responseDescription: 'Usuário atualizado com sucesso',
  })
  @Roles('admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(SanitizePipe) updateUsuarioDto: UpdateUsuarioDto,
  ) {
    this.logOperation('update', { id, dto: updateUsuarioDto });
    return this.usuarioService.update(id, updateUsuarioDto);
  }

  /**
   * Remove um usuário
   * @param id ID do usuário
   * @returns Confirmação de remoção
   */
  @Delete(':id')
  @ApiDocs({
    summary: 'Remover um usuário',
    responseDescription: 'Usuário removido com sucesso',
    status: HttpStatus.NO_CONTENT,
  })
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    this.logOperation('remove', { id });
    return this.usuarioService.remove(id);
  }
}
