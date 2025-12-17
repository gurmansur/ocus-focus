import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ColaboradorService } from './colaborador.service';
import { Colaborador } from './entities/colaborador.entity';

describe('ColaboradorService', () => {
  let service: ColaboradorService;

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
        ColaboradorService,
        {
          provide: getRepositoryToken(Colaborador),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ColaboradorService>(ColaboradorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
