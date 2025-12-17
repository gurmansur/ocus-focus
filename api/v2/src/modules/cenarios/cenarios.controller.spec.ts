import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CasoUsoService } from '../caso-uso/caso-uso.service';
import { CenariosController } from './cenarios.controller';
import { CenariosService } from './cenarios.service';
import { Cenario } from './entities/cenario.entity';

describe('CenariosController', () => {
  let controller: CenariosController;

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
      controllers: [CenariosController],
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

    controller = module.get<CenariosController>(CenariosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
