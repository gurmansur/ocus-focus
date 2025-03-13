import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Colaborador } from '../colaborador/entities/colaborador.entity';
import { Kanban } from '../kanban/entities/kanban.entity';
import { Swimlane } from '../kanban/entities/swimlane.entity';
import { Projeto } from '../projeto/entities/projeto.entity';
import { Tag } from '../tag/entities/tag.entity';
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
      Tag
    ]),
  ],
  exports: [UserStoryService],
})
export class UserStoryModule {}
