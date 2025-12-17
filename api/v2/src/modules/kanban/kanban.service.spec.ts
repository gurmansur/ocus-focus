import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Projeto } from '../projeto/entities/projeto.entity';
import { UserStory } from '../user-story/entities/user-story.entity';
import { UserStoryService } from '../user-story/user-story.service';
import { KanbanService } from './kanban.service';
import { Kanban } from './entities/kanban.entity';
import { Swimlane } from './entities/swimlane.entity';

describe('KanbanService', () => {
  let service: KanbanService;

  beforeEach(async () => {
    const mockKanbanRepository = {
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

    const mockSwimlaneRepository = {
      findAndCount: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const mockUserStoryRepository = {
      findAndCount: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const mockUserStoryService = {
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KanbanService,
        {
          provide: getRepositoryToken(Kanban),
          useValue: mockKanbanRepository,
        },
        {
          provide: getRepositoryToken(Projeto),
          useValue: mockProjetoRepository,
        },
        {
          provide: getRepositoryToken(Swimlane),
          useValue: mockSwimlaneRepository,
        },
        {
          provide: getRepositoryToken(UserStory),
          useValue: mockUserStoryRepository,
        },
        {
          provide: UserStoryService,
          useValue: mockUserStoryService,
        },
      ],
    }).compile();

    service = module.get<KanbanService>(KanbanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
