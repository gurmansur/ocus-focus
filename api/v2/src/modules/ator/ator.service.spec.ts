import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjetoService } from '../projeto/projeto.service';
import { AtorService } from './ator.service';
import { Ator } from './entities/ator.entity';

describe('AtorService', () => {
  let service: AtorService;

  beforeEach(async () => {
    const mockRepository = {
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
      providers: [
        AtorService,
        {
          provide: getRepositoryToken(Ator),
          useValue: mockRepository,
        },
        {
          provide: ProjetoService,
          useValue: mockProjetoService,
        },
      ],
    }).compile();

    service = module.get<AtorService>(AtorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
