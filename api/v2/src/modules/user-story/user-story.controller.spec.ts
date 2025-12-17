import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Colaborador } from '../colaborador/entities/colaborador.entity';
import { Kanban } from '../kanban/entities/kanban.entity';
import { Projeto } from '../projeto/entities/projeto.entity';
import { Swimlane } from '../kanban/entities/swimlane.entity';
import { UserStoryController } from './user-story.controller';
import { UserStoryService } from './user-story.service';
import { UserStory } from './entities/user-story.entity';

describe('UserStoryController', () => {
  let controller: UserStoryController;

  beforeEach(async () => {
    const mockUserStoryRepository = {
      findAndCount: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const mockColaboradorRepository = {
      findAndCount: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const mockProjetoRepository = {
      findAndCount: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const mockKanbanRepository = {
      findAndCount: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const mockSwimlaneRepository = {
      findAndCount: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserStoryController],
      providers: [
        UserStoryService,
        {
          provide: getRepositoryToken(UserStory),
          useValue: mockUserStoryRepository,
        },
        {
          provide: getRepositoryToken(Colaborador),
          useValue: mockColaboradorRepository,
        },
        {
          provide: getRepositoryToken(Projeto),
          useValue: mockProjetoRepository,
        },
        {
          provide: getRepositoryToken(Kanban),
          useValue: mockKanbanRepository,
        },
        {
          provide: getRepositoryToken(Swimlane),
          useValue: mockSwimlaneRepository,
        },
      ],
    }).compile();

    controller = module.get<UserStoryController>(UserStoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
