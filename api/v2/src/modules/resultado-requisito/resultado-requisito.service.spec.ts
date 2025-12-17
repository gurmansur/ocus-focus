import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResultadoRequisitoService } from './resultado-requisito.service';
import { ResultadoRequisito } from './entities/resultado-requisito.entity';

describe('ResultadoRequisitoService', () => {
  let service: ResultadoRequisitoService;

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
        ResultadoRequisitoService,
        {
          provide: getRepositoryToken(ResultadoRequisito),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ResultadoRequisitoService>(ResultadoRequisitoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
