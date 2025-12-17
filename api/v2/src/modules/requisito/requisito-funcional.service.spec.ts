import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequisitoService } from './requisito-funcional.service';
import { RequisitoFuncional } from './entities/requisito-funcional.entity';

describe('RequisitoService', () => {
  let service: RequisitoService;

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
        RequisitoService,
        {
          provide: getRepositoryToken(RequisitoFuncional),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<RequisitoService>(RequisitoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
