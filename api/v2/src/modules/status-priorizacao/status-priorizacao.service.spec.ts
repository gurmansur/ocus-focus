import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatusPriorizacaoService } from './status-priorizacao.service';
import { StatusPriorizacao } from './entities/status-priorizacao.entity';

describe('StatusPriorizacaoService', () => {
  let service: StatusPriorizacaoService;

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
        StatusPriorizacaoService,
        {
          provide: getRepositoryToken(StatusPriorizacao),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<StatusPriorizacaoService>(StatusPriorizacaoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
