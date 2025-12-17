import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ColaboradorProjetoService } from '../colaborador-projeto/colaborador-projeto.service';
import { ColaboradorService } from '../colaborador/colaborador.service';
import { KanbanService } from '../kanban/kanban.service';
import { ProjetoController } from './projeto.controller';
import { ProjetoService } from './projeto.service';
import { Projeto } from './entities/projeto.entity';

describe('ProjetoController', () => {
  let controller: ProjetoController;

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
      controllers: [ProjetoController],
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

    controller = module.get<ProjetoController>(ProjetoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
