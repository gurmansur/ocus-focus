import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ColaboradorProjetoController } from './colaborador-projeto.controller';
import { ColaboradorProjetoService } from './colaborador-projeto.service';
import { ColaboradorProjeto } from './entities/colaborador-projeto.entity';

describe('ColaboradorProjetoController', () => {
  let controller: ColaboradorProjetoController;

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
      controllers: [ColaboradorProjetoController],
      providers: [
        ColaboradorProjetoService,
        {
          provide: getRepositoryToken(ColaboradorProjeto),
          useValue: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<ColaboradorProjetoController>(
      ColaboradorProjetoController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
