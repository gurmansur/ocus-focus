import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequisitoService } from '../requisito/requisito-funcional.service';
import { ResultadoRequisitoService } from '../resultado-requisito/resultado-requisito.service';
import { StakeholderService } from '../stakeholder/stakeholder.service';
import { StatusPriorizacaoService } from '../status-priorizacao/status-priorizacao.service';
import { PriorizacaoController } from './priorizacao.controller';
import { PriorizacaoService } from './priorizacao.service';
import { Priorizacao } from './entities/priorizacao.entity';

describe('PriorizacaoController', () => {
  let controller: PriorizacaoController;

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

    const mockResultadoRequisitoService = {
      create: jest.fn(),
    };

    const mockStakeholderService = {
      findOne: jest.fn(),
    };

    const mockStatusPriorizacaoService = {
      updateParticipation: jest.fn(),
    };

    const mockRequisitoService = {
      getById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PriorizacaoController],
      providers: [
        PriorizacaoService,
        {
          provide: getRepositoryToken(Priorizacao),
          useValue: mockRepository,
        },
        {
          provide: ResultadoRequisitoService,
          useValue: mockResultadoRequisitoService,
        },
        {
          provide: StakeholderService,
          useValue: mockStakeholderService,
        },
        {
          provide: StatusPriorizacaoService,
          useValue: mockStatusPriorizacaoService,
        },
        {
          provide: RequisitoService,
          useValue: mockRequisitoService,
        },
      ],
    }).compile();

    controller = module.get<PriorizacaoController>(PriorizacaoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
