import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequisitoService } from '../requisito/requisito-funcional.service';
import { CasoUsoController } from './caso-uso.controller';
import { CasoUsoService } from './caso-uso.service';
import { CasoUso } from './entities/caso-uso.entity';

describe('CasoUsoController', () => {
  let controller: CasoUsoController;

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

    const mockRequisitoService = {
      getById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CasoUsoController],
      providers: [
        CasoUsoService,
        {
          provide: getRepositoryToken(CasoUso),
          useValue: mockRepository,
        },
        {
          provide: RequisitoService,
          useValue: mockRequisitoService,
        },
      ],
    }).compile();

    controller = module.get<CasoUsoController>(CasoUsoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
