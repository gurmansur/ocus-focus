import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FatorAmbiental } from '../fatores-ambientais/entities/fatores-ambientais.entity';
import { FatorAmbientalProjetoController } from './fator-ambiental-projeto.controller';
import { FatorAmbientalProjetoService } from './fator-ambiental-projeto.service';
import { FatorAmbientalProjeto } from './entities/fator-ambiental-projeto.entity';

describe('FatorAmbientalProjetoController', () => {
  let controller: FatorAmbientalProjetoController;

  beforeEach(async () => {
    const mockFatorAmbientalProjetoRepository = {
      findAndCount: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const mockFatorAmbientalRepository = {
      findAndCount: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FatorAmbientalProjetoController],
      providers: [
        FatorAmbientalProjetoService,
        {
          provide: getRepositoryToken(FatorAmbientalProjeto),
          useValue: mockFatorAmbientalProjetoRepository,
        },
        {
          provide: getRepositoryToken(FatorAmbiental),
          useValue: mockFatorAmbientalRepository,
        },
      ],
    }).compile();

    controller = module.get<FatorAmbientalProjetoController>(
      FatorAmbientalProjetoController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
