import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TreeRepository } from 'typeorm';
import { CasoDeTesteService } from '../caso-de-teste/caso-de-teste.service';
import { SuiteDeTesteService } from './suite-de-teste.service';
import { SuiteDeTeste } from './entities/suite-de-teste.entity';

describe('SuiteDeTesteService', () => {
  let service: SuiteDeTesteService;

  beforeEach(async () => {
    const mockRepository = {
      findAndCount: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findTrees: jest.fn(),
      findDescendantsTree: jest.fn(),
    };

    const mockCasoDeTesteService = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SuiteDeTesteService,
        {
          provide: getRepositoryToken(SuiteDeTeste),
          useValue: mockRepository,
        },
        {
          provide: CasoDeTesteService,
          useValue: mockCasoDeTesteService,
        },
      ],
    }).compile();

    service = module.get<SuiteDeTesteService>(SuiteDeTesteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
