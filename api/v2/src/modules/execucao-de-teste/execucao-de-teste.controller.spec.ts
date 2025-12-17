import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CasoDeTesteService } from '../caso-de-teste/caso-de-teste.service';
import { SuiteDeTesteService } from '../suite-de-teste/suite-de-teste.service';
import { ExecucaoDeTesteController } from './execucao-de-teste.controller';
import { ExecucaoDeTesteService } from './execucao-de-teste.service';
import { ExecucaoDeTeste } from './entities/execucao-de-teste.entity';

describe('ExecucaoDeTesteController', () => {
  let controller: ExecucaoDeTesteController;

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

    const mockCasoDeTesteService = {
      findOne: jest.fn(),
    };

    const mockSuiteDeTesteService = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExecucaoDeTesteController],
      providers: [
        ExecucaoDeTesteService,
        {
          provide: getRepositoryToken(ExecucaoDeTeste),
          useValue: mockRepository,
        },
        {
          provide: CasoDeTesteService,
          useValue: mockCasoDeTesteService,
        },
        {
          provide: SuiteDeTesteService,
          useValue: mockSuiteDeTesteService,
        },
      ],
    }).compile();

    controller = module.get<ExecucaoDeTesteController>(
      ExecucaoDeTesteController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
