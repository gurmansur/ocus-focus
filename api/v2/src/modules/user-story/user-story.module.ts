import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CasoUso } from '../caso-uso/entities/caso-uso.entity';
import { ColaboradorProjeto } from '../colaborador-projeto/entities/colaborador-projeto.entity';
import { Colaborador } from '../colaborador/entities/colaborador.entity';
import { Kanban } from '../kanban/entities/kanban.entity';
import { Swimlane } from '../kanban/entities/swimlane.entity';
import { NotificacaoModule } from '../notificacao/notificacao.module';
import { Projeto } from '../projeto/entities/projeto.entity';
import { Sprint } from '../sprint/entities/sprint.entity';
import { Stakeholder } from '../stakeholder/entities/stakeholder.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Comentario } from './entities/comentario.entity';
import { UserStory } from './entities/user-story.entity';
import { UserStoryController } from './user-story.controller';
import { UserStoryService } from './user-story.service';

@Module({
  controllers: [UserStoryController],
  providers: [UserStoryService],
  imports: [
    TypeOrmModule.forFeature([
      UserStory,
      Projeto,
      Kanban,
      Swimlane,
      Colaborador,
      ColaboradorProjeto,
      Sprint,
      CasoUso,
      Comentario,
      Usuario,
      Stakeholder,
    ]),
    NotificacaoModule,
  ],
  exports: [UserStoryService],
})
export class UserStoryModule {}
