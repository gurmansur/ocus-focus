import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ColaboradorProjetoService } from '../colaborador-projeto/colaborador-projeto.service';
import { ColaboradorService } from '../colaborador/colaborador.service';
import { KanbanService } from '../kanban/kanban.service';
import { ProjetoService } from './projeto.service';
import { Projeto } from './entities/projeto.entity';

describe('ProjetoService', () => {
  let service: ProjetoService;

  beforeEach(async () => {
    const mockRepository = {
      findAndCount: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const mockColaboradorProjetoService = {
      create: jest.fn(),
      findColaboradoresByProjetoId: jest.fn(),
      findColaboradoresByNome: jest.fn(),
      removeByProjetoAndColaborador: jest.fn(),
    };

    const mockColaboradorService = {
      findOne: jest.fn(),
    };

    const mockKanbanService = {
      createKanban: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjetoService,
        {
          provide: getRepositoryToken(Projeto),
          useValue: mockRepository,
        },
        {
          provide: ColaboradorProjetoService,
          useValue: mockColaboradorProjetoService,
        },
        {
          provide: ColaboradorService,
          useValue: mockColaboradorService,
        },
        {
          provide: KanbanService,
          useValue: mockKanbanService,
        },
      ],
    }).compile();

    service = module.get<ProjetoService>(ProjetoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
