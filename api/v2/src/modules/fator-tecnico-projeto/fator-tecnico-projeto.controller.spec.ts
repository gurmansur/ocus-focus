import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FatorTecnicoProjetoController } from './fator-tecnico-projeto.controller';
import { FatorTecnicoProjetoService } from './fator-tecnico-projeto.service';
import { FatorTecnicoProjeto } from './entities/fator-tecnico-projeto.entity';

describe('FatorTecnicoProjetoController', () => {
  let controller: FatorTecnicoProjetoController;

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
      controllers: [FatorTecnicoProjetoController],
      providers: [
        FatorTecnicoProjetoService,
        {
          provide: getRepositoryToken(FatorTecnicoProjeto),
          useValue: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<FatorTecnicoProjetoController>(FatorTecnicoProjetoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
