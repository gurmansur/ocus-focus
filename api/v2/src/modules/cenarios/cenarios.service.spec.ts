import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CasoUsoService } from '../caso-uso/caso-uso.service';
import { CenariosService } from './cenarios.service';
import { Cenario } from './entities/cenario.entity';

describe('CenariosService', () => {
  let service: CenariosService;

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

    const mockCasoUsoService = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CenariosService,
        {
          provide: getRepositoryToken(Cenario),
          useValue: mockRepository,
        },
        {
          provide: CasoUsoService,
          useValue: mockCasoUsoService,
        },
      ],
    }).compile();

    service = module.get<CenariosService>(CenariosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
