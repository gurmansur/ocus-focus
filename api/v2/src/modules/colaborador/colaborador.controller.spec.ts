import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ColaboradorController } from './colaborador.controller';
import { ColaboradorService } from './colaborador.service';
import { Colaborador } from './entities/colaborador.entity';

describe('ColaboradorController', () => {
  let controller: ColaboradorController;

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
      controllers: [ColaboradorController],
      providers: [
        ColaboradorService,
        {
          provide: getRepositoryToken(Colaborador),
          useValue: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<ColaboradorController>(ColaboradorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
