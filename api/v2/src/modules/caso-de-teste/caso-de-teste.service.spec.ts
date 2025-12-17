import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SuiteDeTesteService } from '../suite-de-teste/suite-de-teste.service';
import { CasoDeTesteService } from './caso-de-teste.service';
import { CasoDeTeste } from './entities/caso-de-teste.entity';

describe('CasoDeTesteService', () => {
  let service: CasoDeTesteService;

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

    const mockSuiteDeTesteService = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CasoDeTesteService,
        {
          provide: getRepositoryToken(CasoDeTeste),
          useValue: mockRepository,
        },
        {
          provide: SuiteDeTesteService,
          useValue: mockSuiteDeTesteService,
        },
      ],
    }).compile();

    service = module.get<CasoDeTesteService>(CasoDeTesteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
