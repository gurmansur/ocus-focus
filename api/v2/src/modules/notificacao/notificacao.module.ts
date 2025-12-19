import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comentario } from '../user-story/entities/comentario.entity';
import { UserStory } from '../user-story/entities/user-story.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Notificacao } from './entities/notificacao.entity';
import { NotificacaoController } from './notificacao.controller';
import { NotificacaoService } from './notificacao.service';

@Module({
  controllers: [NotificacaoController],
  providers: [NotificacaoService],
  imports: [
    TypeOrmModule.forFeature([Notificacao, Usuario, UserStory, Comentario]),
  ],
  exports: [NotificacaoService],
})
export class NotificacaoModule {}
