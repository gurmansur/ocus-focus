import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FatorAmbiental } from '../fatores-ambientais/entities/fatores-ambientais.entity';
import { FatorAmbientalProjetoService } from './fator-ambiental-projeto.service';
import { FatorAmbientalProjeto } from './entities/fator-ambiental-projeto.entity';

describe('FatorAmbientalProjetoService', () => {
  let service: FatorAmbientalProjetoService;

  beforeEach(async () => {
    const mockFatorAmbientalProjetoRepository = {
      findAndCount: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const mockFatorAmbientalRepository = {
      findAndCount: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FatorAmbientalProjetoService,
        {
          provide: getRepositoryToken(FatorAmbientalProjeto),
          useValue: mockFatorAmbientalProjetoRepository,
        },
        {
          provide: getRepositoryToken(FatorAmbiental),
          useValue: mockFatorAmbientalRepository,
        },
      ],
    }).compile();

    service = module.get<FatorAmbientalProjetoService>(FatorAmbientalProjetoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
