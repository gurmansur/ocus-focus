import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BaseController } from '../../common/base/base.controller';
import { ProjetoAtual } from '../../decorators/projeto-atual.decorator';
import { UsuarioAtual } from '../../decorators/usuario-atual.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { Projeto } from '../projeto/entities/projeto.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { UserRole } from '../usuario/enums/user-role.enum';
import { UsuarioProjetoService } from './usuario-projeto.service';

@ApiTags('Usuario Projeto')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Não autorizado' })
@UseGuards(AuthGuard)
@Controller('usuario-projeto')
export class UsuarioProjetoController extends BaseController {
  constructor(private readonly usuarioProjetoService: UsuarioProjetoService) {
    super();
  }

  @Get('role/current')
  async getCurrentUserRole(
    @UsuarioAtual() usuario: Usuario,
    @ProjetoAtual() projeto: Projeto,
  ) {
    const usuarioProjeto =
      await this.usuarioProjetoService.findByUsuarioAndProjeto(
        usuario.id,
        projeto.id,
      );

    if (!usuarioProjeto) {
      return { role: UserRole.COLABORADOR };
    }

    return { role: usuarioProjeto.role };
  }

  @Get()
  async findByProjeto(@ProjetoAtual() projeto: Projeto) {
    return this.usuarioProjetoService.findByProjeto(projeto.id);
  }

  @Post()
  async addUsuarioToProjeto(
    @Body()
    body: {
      usuarioId: number;
      projetoId: number;
      role: UserRole;
      administrador?: boolean;
    },
  ) {
    const { usuarioId, projetoId, role, administrador = false } = body;
    return this.usuarioProjetoService.create({
      usuarioId,
      projetoId,
      role,
      administrador,
    });
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body()
    updates: { role?: UserRole; administrador?: boolean; ativo?: boolean },
  ) {
    return this.usuarioProjetoService.update(+id, updates);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usuarioProjetoService.remove(+id);
  }
}
