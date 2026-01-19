import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Kanban } from '../kanban/entities/kanban.entity';
import { Swimlane } from '../kanban/entities/swimlane.entity';
import { Projeto } from '../projeto/entities/projeto.entity';
import { UsuarioProjeto } from '../usuario-projeto/entities/usuario-projeto.entity';
import { UserStory } from './entities/user-story.entity';
import { UserStoryController } from './user-story.controller';
import { UserStoryService } from './user-story.service';

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

    const mockUsuarioProjetoRepository = {
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
          provide: getRepositoryToken(UsuarioProjeto),
          useValue: mockUsuarioProjetoRepository,
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
