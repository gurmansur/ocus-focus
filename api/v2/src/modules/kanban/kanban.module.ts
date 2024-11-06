import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Projeto } from '../projeto/entities/projeto.entity';
import { UserStoryModule } from '../user-story/user-story.module';
import { Kanban } from './entities/kanban.entity';
import { Swimlane } from './entities/swimlane.entity';
import { KanbanController } from './kanban.controller';
import { KanbanService } from './kanban.service';

@Module({
  controllers: [KanbanController],
  providers: [KanbanService],
  imports: [
    TypeOrmModule.forFeature([Kanban, Swimlane, Projeto]),
    UserStoryModule,
  ],
  exports: [KanbanService],
})
export class KanbanModule {}
