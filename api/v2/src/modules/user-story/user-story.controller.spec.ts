import { Test, TestingModule } from '@nestjs/testing';
import { UserStoryController } from './user-story.controller';
import { UserStoryService } from './user-story.service';

describe('UserStoryController', () => {
  let controller: UserStoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserStoryController],
      providers: [UserStoryService],
    }).compile();

    controller = module.get<UserStoryController>(UserStoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
