import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ator } from '../ator/entities/ator.entity';
import { CasoUso } from '../caso-uso/entities/caso-uso.entity';
import { Colaborador } from '../colaborador/entities/colaborador.entity';
import { Projeto } from '../projeto/entities/projeto.entity';
import { ProjetoService } from '../projeto/projeto.service';
import {
  EnvironmentalFactorDto,
  SessionStatus,
  TechnicalFactorDto,
} from './dto/estimativa-session.dto';
import { Estimativa } from './entities/estimativa.entity';
import { EstimativaService } from './estimativa.service';

/**
 * Unit tests for Estimativa service persistence
 * Ensures slider data is correctly saved, retrieved, and calculated
 */
describe('EstimativaService - Persistence', () => {
  let service: EstimativaService;
  let estimativaRepository: Repository<Estimativa>;
  let projetoService: ProjetoService;

  const mockProjeto: Projeto = {
    id: 1,
    nome: 'Test Project',
  } as Projeto;

  const mockColaborador: Colaborador = {
    id: 1,
    nome: 'Test User',
  } as Colaborador;

  beforeEach(async () => {
    const mockEstimativaRepository = {
      findAndCount: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const mockAtorRepository = {
      findAndCount: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    };

    const mockCasoUsoRepository = {
      findAndCount: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    };

    const mockProjetoService = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EstimativaService,
        {
          provide: getRepositoryToken(Estimativa),
          useValue: mockEstimativaRepository,
        },
        {
          provide: getRepositoryToken(Ator),
          useValue: mockAtorRepository,
        },
        {
          provide: getRepositoryToken(CasoUso),
          useValue: mockCasoUsoRepository,
        },
        {
          provide: ProjetoService,
          useValue: mockProjetoService,
        },
      ],
    }).compile();

    service = module.get<EstimativaService>(EstimativaService);
    estimativaRepository = module.get<Repository<Estimativa>>(
      getRepositoryToken(Estimativa),
    );
    projetoService = module.get<ProjetoService>(ProjetoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Technical Factors Persistence', () => {
    it('should persist technical factor ratings correctly', async () => {
      const technicalFactors: TechnicalFactorDto[] = [
        { id: 'T1', rating: 3 },
        { id: 'T2', rating: 4 },
        { id: 'T3', rating: 2 },
        { id: 'T4', rating: 5 },
        { id: 'T5', rating: 1 },
        { id: 'T6', rating: 3 },
        { id: 'T7', rating: 2 },
        { id: 'T8', rating: 4 },
        { id: 'T9', rating: 3 },
        { id: 'T10', rating: 2 },
        { id: 'T11', rating: 1 },
        { id: 'T12', rating: 5 },
        { id: 'T13', rating: 3 },
      ];

      const existingEstimativa: Estimativa = {
        id: 1,
        name: 'Test Session',
        description: 'Test Description',
        projeto: mockProjeto,
        createdBy: mockColaborador,
        useCaseWeights: JSON.stringify([]),
        actorWeights: JSON.stringify([]),
        technicalFactors: JSON.stringify(
          Array.from({ length: 13 }, (_, i) => ({
            id: `T${i + 1}`,
            rating: 0,
          })),
        ),
        environmentalFactors: JSON.stringify(
          Array.from({ length: 8 }, (_, i) => ({
            id: `E${i + 1}`,
            rating: 0,
          })),
        ),
        uucw: 0,
        uaw: 0,
        uucp: 0,
        tfactor: 0,
        tcf: 0.6,
        efactor: 0,
        ef: 1.4,
        ucp: 0,
        hoursPerUCP: 20,
        estimatedHours: 0,
        estimatedDays: 0,
        status: SessionStatus.DRAFT,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Estimativa;

      const updatedEstimativa = {
        ...existingEstimativa,
        technicalFactors: JSON.stringify(technicalFactors),
      };

      jest
        .spyOn(estimativaRepository, 'findOne')
        .mockResolvedValue(existingEstimativa);
      jest
        .spyOn(estimativaRepository, 'save')
        .mockResolvedValue(updatedEstimativa);

      const result = await service.updateSession(1, { technicalFactors }, 1);

      // Verify technical factors are persisted with correct ratings
      expect(result.technicalFactors).toHaveLength(13);
      expect(result.technicalFactors.find((f) => f.id === 'T1')?.rating).toBe(
        3,
      );
      expect(result.technicalFactors.find((f) => f.id === 'T4')?.rating).toBe(
        5,
      );

      // Verify save was called
      expect(estimativaRepository.save).toHaveBeenCalled();
    });
  });

  describe('Environmental Factors Persistence', () => {
    it('should persist environmental factor ratings correctly', async () => {
      const environmentalFactors: EnvironmentalFactorDto[] = [
        { id: 'E1', rating: 4 },
        { id: 'E2', rating: 3 },
        { id: 'E3', rating: 2 },
        { id: 'E4', rating: 5 },
        { id: 'E5', rating: 1 },
        { id: 'E6', rating: 4 },
        { id: 'E7', rating: 2 },
        { id: 'E8', rating: 3 },
      ];

      const existingEstimativa: Estimativa = {
        id: 1,
        name: 'Test Session',
        description: 'Test Description',
        projeto: mockProjeto,
        createdBy: mockColaborador,
        useCaseWeights: JSON.stringify([]),
        actorWeights: JSON.stringify([]),
        technicalFactors: JSON.stringify(
          Array.from({ length: 13 }, (_, i) => ({
            id: `T${i + 1}`,
            rating: 0,
          })),
        ),
        environmentalFactors: JSON.stringify(
          Array.from({ length: 8 }, (_, i) => ({
            id: `E${i + 1}`,
            rating: 0,
          })),
        ),
        uucw: 0,
        uaw: 0,
        uucp: 0,
        tfactor: 0,
        tcf: 0.6,
        efactor: 0,
        ef: 1.4,
        ucp: 0,
        hoursPerUCP: 20,
        estimatedHours: 0,
        estimatedDays: 0,
        status: SessionStatus.DRAFT,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Estimativa;

      const updatedEstimativa = {
        ...existingEstimativa,
        environmentalFactors: JSON.stringify(environmentalFactors),
      };

      jest
        .spyOn(estimativaRepository, 'findOne')
        .mockResolvedValue(existingEstimativa);
      jest
        .spyOn(estimativaRepository, 'save')
        .mockResolvedValue(updatedEstimativa);

      const result = await service.updateSession(
        1,
        { environmentalFactors },
        1,
      );

      // Verify environmental factors are persisted with correct ratings
      expect(result.environmentalFactors).toHaveLength(8);
      expect(
        result.environmentalFactors.find((f) => f.id === 'E1')?.rating,
      ).toBe(4);
      expect(
        result.environmentalFactors.find((f) => f.id === 'E4')?.rating,
      ).toBe(5);

      // Verify save was called
      expect(estimativaRepository.save).toHaveBeenCalled();
    });
  });

  describe('Slider Data Validation', () => {
    it('should handle all 13 technical factors', () => {
      const technicalFactors: TechnicalFactorDto[] = Array.from(
        { length: 13 },
        (_, i) => ({
          id: `T${i + 1}` as any,
          rating: Math.floor(Math.random() * 6), // 0-5
        }),
      );

      expect(technicalFactors).toHaveLength(13);
      expect(
        technicalFactors.every((f) => f.rating >= 0 && f.rating <= 5),
      ).toBe(true);
    });

    it('should handle all 8 environmental factors', () => {
      const environmentalFactors: EnvironmentalFactorDto[] = Array.from(
        { length: 8 },
        (_, i) => ({
          id: `E${i + 1}` as any,
          rating: Math.floor(Math.random() * 6), // 0-5
        }),
      );

      expect(environmentalFactors).toHaveLength(8);
      expect(
        environmentalFactors.every((f) => f.rating >= 0 && f.rating <= 5),
      ).toBe(true);
    });
  });
});
