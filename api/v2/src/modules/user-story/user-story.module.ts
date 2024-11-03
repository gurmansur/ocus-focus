import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserStory } from './entities/user-story.entity';
import { UserStoryController } from './user-story.controller';
import { UserStoryService } from './user-story.service';

@Module({
  controllers: [UserStoryController],
  providers: [UserStoryService],
  imports: [TypeOrmModule.forFeature([UserStory])],
  exports: [UserStoryService],
})
export class UserStoryModule {}
