import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../../guards/auth.guard';
import { NotificacaoService } from './notificacao.service';

@UseGuards(AuthGuard)
@ApiTags('Notificacoes')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Não autorizado' })
@Controller('notificacoes')
export class NotificacaoController {
  constructor(private readonly notificacaoService: NotificacaoService) {}

  @Get()
  findByUsuario(@Query('usuarioId') usuarioId: number) {
    return this.notificacaoService.findByUsuario(+usuarioId);
  }

  @Patch(':id/read')
  markRead(@Param('id', ParseIntPipe) id: number) {
    return this.notificacaoService.markRead(+id);
  }
}
