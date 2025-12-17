import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjetoService } from '../projeto/projeto.service';
import { AtorController } from './ator.controller';
import { AtorService } from './ator.service';
import { Ator } from './entities/ator.entity';

describe('AtorController', () => {
  let controller: AtorController;

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
      controllers: [AtorController],
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

    controller = module.get<AtorController>(AtorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
