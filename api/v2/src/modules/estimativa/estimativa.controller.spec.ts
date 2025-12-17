import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ator } from '../ator/entities/ator.entity';
import { CasoUso } from '../caso-uso/entities/caso-uso.entity';
import { ProjetoService } from '../projeto/projeto.service';
import { EstimativaController } from './estimativa.controller';
import { EstimativaService } from './estimativa.service';
import { Estimativa } from './entities/estimativa.entity';

describe('EstimativaController', () => {
  let controller: EstimativaController;

  beforeEach(async () => {
    const mockEstimativaRepository = {
      findAndCount: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const mockAtorRepository = {
      findAndCount: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    };

    const mockCasoUsoRepository = {
      findAndCount: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    };

    const mockProjetoService = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstimativaController],
      providers: [
        EstimativaService,
        {
          provide: getRepositoryToken(Estimativa),
          useValue: mockEstimativaRepository,
        },
        {
          provide: getRepositoryToken(Ator),
          useValue: mockAtorRepository,
        },
        {
          provide: getRepositoryToken(CasoUso),
          useValue: mockCasoUsoRepository,
        },
        {
          provide: ProjetoService,
          useValue: mockProjetoService,
        },
      ],
    }).compile();

    controller = module.get<EstimativaController>(EstimativaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
