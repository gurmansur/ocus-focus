import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillingModule } from '../billing/billing.module';
import { Projeto } from '../projeto/entities/projeto.entity';
import { UserStory } from '../user-story/entities/user-story.entity';
import { UserStoryModule } from '../user-story/user-story.module';
import { Kanban } from './entities/kanban.entity';
import { Swimlane } from './entities/swimlane.entity';
import { KanbanController } from './kanban.controller';
import { KanbanRepository } from './kanban.repository';
import { KanbanService } from './kanban.service';

@Module({
  controllers: [KanbanController],
  providers: [KanbanService, KanbanRepository],
  imports: [
    TypeOrmModule.forFeature([Kanban, Swimlane, Projeto, UserStory]),
    UserStoryModule,
    BillingModule,
  ],
  exports: [KanbanService],
})
export class KanbanModule {}
