import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RequisitoService } from '../requisito/requisito-funcional.service';
import { ResultadoRequisitoService } from '../resultado-requisito/resultado-requisito.service';
import { StatusPriorizacaoService } from '../status-priorizacao/status-priorizacao.service';
import { UsuarioService } from '../usuario/usuario.service';
import { Priorizacao } from './entities/priorizacao.entity';
import { PriorizacaoService } from './priorizacao.service';

describe('PriorizacaoService', () => {
  let service: PriorizacaoService;

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

    const mockUsuarioService = {
      findOne: jest.fn(),
    };

    const mockStatusPriorizacaoService = {
      updateParticipation: jest.fn(),
    };

    const mockRequisitoService = {
      getById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
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
          provide: UsuarioService,
          useValue: mockUsuarioService,
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

    service = module.get<PriorizacaoService>(PriorizacaoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
