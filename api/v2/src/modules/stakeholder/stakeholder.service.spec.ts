import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjetoService } from '../projeto/projeto.service';
import { StatusPriorizacaoService } from '../status-priorizacao/status-priorizacao.service';
import { UsuarioService } from '../usuario/usuario.service';
import { StakeholderService } from './stakeholder.service';
import { Stakeholder } from './entities/stakeholder.entity';

describe('StakeholderService', () => {
  let service: StakeholderService;

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

    const mockUsuarioService = {
      findOne: jest.fn(),
      create: jest.fn(),
    };

    const mockProjetoService = {
      findOne: jest.fn(),
    };

    const mockStatusPriorizacaoService = {
      create: jest.fn(),
      findByStakeholder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StakeholderService,
        {
          provide: getRepositoryToken(Stakeholder),
          useValue: mockRepository,
        },
        {
          provide: UsuarioService,
          useValue: mockUsuarioService,
        },
        {
          provide: ProjetoService,
          useValue: mockProjetoService,
        },
        {
          provide: StatusPriorizacaoService,
          useValue: mockStatusPriorizacaoService,
        },
      ],
    }).compile();

    service = module.get<StakeholderService>(StakeholderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
