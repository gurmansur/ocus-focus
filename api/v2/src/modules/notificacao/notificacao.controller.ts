import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BaseController } from '../../common/base/base.controller';
import { NotificacaoService } from './notificacao.service';

@ApiTags('Notificacoes')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Não autorizado' })
@Controller('notificacoes')
export class NotificacaoController extends BaseController {
  constructor(private readonly notificacaoService: NotificacaoService) {
    super();
  }

  @Get()
  findByUsuario(@Query('usuarioId') usuarioId: number) {
    return this.notificacaoService.findByUsuario(+usuarioId);
  }

  @Patch(':id/read')
  markRead(@Param('id', ParseIntPipe) id: number) {
    return this.notificacaoService.markRead(+id);
  }
}
