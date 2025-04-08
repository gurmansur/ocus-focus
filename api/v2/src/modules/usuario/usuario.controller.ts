import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiDocs } from '../../decorators/api-docs.decorator';
import { Roles } from '../../decorators/roles.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { SanitizePipe } from '../../pipes/sanitize.pipe';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UsuarioService } from './usuario.service';

@UseGuards(AuthGuard)
@ApiTags('Usuário')
@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  @ApiDocs({
    summary: 'Criar um novo usuário',
    status: HttpStatus.CREATED,
    responseDescription: 'Usuário criado com sucesso',
  })
  @Roles('admin')
  create(@Body(SanitizePipe) createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.create(createUsuarioDto);
  }

  @Get()
  @ApiDocs({
    summary: 'Listar todos os usuários',
    responseDescription: 'Lista de usuários recuperada com sucesso',
  })
  findAll(
    @Query('paginated') paginated?: boolean,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
  ) {
    // Melhoria de performance: definir valores padrão quando necessário
    return this.usuarioService.findAll(paginated, page || 1);
  }

  @Get(':id')
  @ApiDocs({
    summary: 'Obter um usuário pelo ID',
    responseDescription: 'Usuário recuperado com sucesso',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usuarioService.findOne(id);
  }

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
    return this.usuarioService.update(id, updateUsuarioDto);
  }

  @Delete(':id')
  @ApiDocs({
    summary: 'Remover um usuário',
    responseDescription: 'Usuário removido com sucesso',
    status: HttpStatus.NO_CONTENT,
  })
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usuarioService.remove(id);
  }
}
