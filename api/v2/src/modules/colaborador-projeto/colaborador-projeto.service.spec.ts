import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ColaboradorProjetoService } from './colaborador-projeto.service';
import { ColaboradorProjeto } from './entities/colaborador-projeto.entity';

describe('ColaboradorProjetoService', () => {
  let service: ColaboradorProjetoService;

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
        ColaboradorProjetoService,
        {
          provide: getRepositoryToken(ColaboradorProjeto),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ColaboradorProjetoService>(ColaboradorProjetoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
