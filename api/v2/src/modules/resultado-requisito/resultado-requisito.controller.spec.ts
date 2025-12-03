import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResultadoRequisitoController } from './resultado-requisito.controller';
import { ResultadoRequisitoService } from './resultado-requisito.service';
import { ResultadoRequisito } from './entities/resultado-requisito.entity';

describe('ResultadoRequisitoController', () => {
  let controller: ResultadoRequisitoController;

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
      controllers: [ResultadoRequisitoController],
      providers: [
        ResultadoRequisitoService,
        {
          provide: getRepositoryToken(ResultadoRequisito),
          useValue: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<ResultadoRequisitoController>(ResultadoRequisitoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
