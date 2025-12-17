import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CasoDeTesteService } from '../caso-de-teste/caso-de-teste.service';
import { SuiteDeTeste } from './entities/suite-de-teste.entity';
import { SuiteDeTesteController } from './suite-de-teste.controller';
import { SuiteDeTesteService } from './suite-de-teste.service';

describe('SuiteDeTesteController', () => {
  let controller: SuiteDeTesteController;

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
      controllers: [SuiteDeTesteController],
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

    controller = module.get<SuiteDeTesteController>(SuiteDeTesteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
