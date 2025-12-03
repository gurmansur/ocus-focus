import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatusPriorizacaoController } from './status-priorizacao.controller';
import { StatusPriorizacaoService } from './status-priorizacao.service';
import { StatusPriorizacao } from './entities/status-priorizacao.entity';

describe('StatusPriorizacaoController', () => {
  let controller: StatusPriorizacaoController;

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
      controllers: [StatusPriorizacaoController],
      providers: [
        StatusPriorizacaoService,
        {
          provide: getRepositoryToken(StatusPriorizacao),
          useValue: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<StatusPriorizacaoController>(StatusPriorizacaoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
