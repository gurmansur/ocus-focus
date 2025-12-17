import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FatorTecnicoProjetoService } from './fator-tecnico-projeto.service';
import { FatorTecnicoProjeto } from './entities/fator-tecnico-projeto.entity';

describe('FatorTecnicoProjetoService', () => {
  let service: FatorTecnicoProjetoService;

  beforeEach(async () => {
    const mockRepository = {
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
        FatorTecnicoProjetoService,
        {
          provide: getRepositoryToken(FatorTecnicoProjeto),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<FatorTecnicoProjetoService>(FatorTecnicoProjetoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
