import { Module } from '@nestjs/common';
import { UserStoryService } from './user-story.service';
import { UserStoryController } from './user-story.controller';

@Module({
  controllers: [UserStoryController],
  providers: [UserStoryService],
})
export class UserStoryModule {}
