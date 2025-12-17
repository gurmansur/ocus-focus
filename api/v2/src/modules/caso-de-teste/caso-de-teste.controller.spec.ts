import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Projeto } from '../projeto/entities/projeto.entity';
import { SuiteDeTesteService } from '../suite-de-teste/suite-de-teste.service';
import { CasoDeTesteController } from './caso-de-teste.controller';
import { CasoDeTesteService } from './caso-de-teste.service';
import { CasoDeTesteDto } from './dto/caso-de-teste.dto';
import { CreateCasoDeTesteDto } from './dto/create-caso-de-teste.dto';
import { UpdateCasoDeTesteDto } from './dto/update-caso-de-teste.dto';
import { CasoDeTeste } from './entities/caso-de-teste.entity';

describe('CasoDeTesteController', () => {
  let controller: CasoDeTesteController;
  let service: CasoDeTesteService;
  jest.setTimeout(60000);

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

    const mockSuiteDeTesteService = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CasoDeTesteController],
      providers: [
        CasoDeTesteService,
        {
          provide: getRepositoryToken(CasoDeTeste),
          useValue: mockRepository,
        },
        {
          provide: SuiteDeTesteService,
          useValue: mockSuiteDeTesteService,
        },
      ],
    }).compile();

    controller = module.get<CasoDeTesteController>(CasoDeTesteController);
    service = module.get<CasoDeTesteService>(CasoDeTesteService);
  });

  describe('create', () => {
    it('should create a new CasoDeTeste', async () => {
      const createDto: CreateCasoDeTesteDto = {
        nome: 'Teste',
        descricao: 'Teste',
        preCondicao: 'Teste',
        posCondicao: 'Teste',
        resultadoEsperado: 'Teste',
        prioridade: 'ALTA',
        complexidade: 'COMPLEXO',
        dadosEntrada: 'Teste',
        observacoes: 'Teste',
        status: 'ATIVO',
        metodo: 'MANUAL',
        tecnica: 'FUNCIONAL',
        casoDeUsoId: null,
      };

      const projeto: Projeto = {
        nome: 'Teste',
        descricao: 'Teste',
        status: 'EM ANDAMENTO',
        dataInicio: new Date(),
        previsaoFim: new Date(),
        atores: [],
        casosDeTeste: [],
        colaboradores: [],
        sprints: [],
        empresa: 'Teste',
        id: 1,
        estimativas: [],
        fatoresAmbientais: [],
        fatoresTecnicos: [],
        requisitos: [],
        reseFactor: 0,
        restFactor: 0,
        stakeholders: [],
        suitesDeTeste: [],
        userStories: [],
        configuracoesSelenium: [],
      };

      const mockResult: CasoDeTesteDto = {
        id: 1,
        nome: createDto.nome,
        descricao: createDto.descricao,
        preCondicao: createDto.preCondicao,
        posCondicao: createDto.posCondicao,
        resultadoEsperado: createDto.resultadoEsperado,
        prioridade: createDto.prioridade,
        complexidade: createDto.complexidade,
        dadosEntrada: createDto.dadosEntrada,
        observacoes: createDto.observacoes,
        status: createDto.status,
        metodo: createDto.metodo,
        tecnica: createDto.tecnica,
        casoDeUso: undefined,
        projeto,
      };
      jest.spyOn(service, 'create').mockResolvedValueOnce(mockResult);

      const result = await controller.create(createDto, projeto);

      expect(service.create).toHaveBeenCalledWith(createDto, projeto);
      expect(result).toMatchObject({
        id: mockResult.id,
        nome: mockResult.nome,
        descricao: mockResult.descricao,
        preCondicao: mockResult.preCondicao,
        posCondicao: mockResult.posCondicao,
        resultadoEsperado: mockResult.resultadoEsperado,
        prioridade: mockResult.prioridade,
        complexidade: mockResult.complexidade,
        dadosEntrada: mockResult.dadosEntrada,
        observacoes: mockResult.observacoes,
        status: mockResult.status,
        metodo: mockResult.metodo,
        tecnica: mockResult.tecnica,
        casoDeUso: mockResult.casoDeUso,
        projeto: mockResult.projeto,
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of CasoDeTeste', async () => {
      const projeto: Projeto = {
        nome: 'Teste',
        descricao: 'Teste',
        status: 'EM ANDAMENTO',
        dataInicio: new Date(),
        previsaoFim: new Date(),
        atores: [],
        casosDeTeste: [],
        colaboradores: [],
        sprints: [],
        empresa: 'Teste',
        id: 1,
        estimativas: [],
        fatoresAmbientais: [],
        fatoresTecnicos: [],
        requisitos: [],
        reseFactor: 0,
        restFactor: 0,
        stakeholders: [],
        suitesDeTeste: [],
        userStories: [],
        configuracoesSelenium: [],
      };

      const casoDeTesteDtoArray: CasoDeTesteDto[] = [
        {
          id: 1,
          projeto: projeto,
          nome: 'Teste',
          descricao: 'Teste',
          preCondicao: 'Teste',
          posCondicao: 'Teste',
          resultadoEsperado: 'Teste',
          prioridade: 'ALTA',
          complexidade: 'COMPLEXO',
          dadosEntrada: 'Teste',
          observacoes: 'Teste',
          status: 'ATIVO',
          metodo: 'MANUAL',
          tecnica: 'FUNCIONAL',
          suiteDeTeste: undefined,
          testadorDesignado: null,
          casoDeUso: {
            nome: 'Teste',
            descricao: 'Teste',
            complexidade: 'COMPLEXO',
          },
        },
        {
          id: 2,
          projeto: projeto,
          nome: 'Teste 2',
          descricao: 'Teste 2',
          preCondicao: 'Teste 2',
          posCondicao: 'Teste 2',
          resultadoEsperado: 'Teste 2',
          prioridade: 'ALTA',
          complexidade: 'COMPLEXO',
          dadosEntrada: 'Teste 2',
          observacoes: 'Teste 2',
          status: 'ATIVO',
          metodo: 'MANUAL',
          tecnica: 'FUNCIONAL',
          suiteDeTeste: undefined,
          testadorDesignado: null,
          casoDeUso: {
            nome: 'Teste',
            descricao: 'Teste',
            complexidade: 'COMPLEXO',
          },
        },
        {
          id: 3,
          projeto: projeto,
          nome: 'Teste 3',
          descricao: 'Teste 3',
          preCondicao: 'Teste 3',
          posCondicao: 'Teste 3',
          resultadoEsperado: 'Teste 3',
          prioridade: 'ALTA',
          complexidade: 'COMPLEXO',
          dadosEntrada: 'Teste 3',
          observacoes: 'Teste 3',
          status: 'ATIVO',
          metodo: 'MANUAL',
          tecnica: 'FUNCIONAL',
          suiteDeTeste: undefined,
          testadorDesignado: null,
          casoDeUso: {
            nome: 'Teste',
            descricao: 'Teste',
            complexidade: 'COMPLEXO',
          },
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValueOnce(casoDeTesteDtoArray);

      const result = await controller.findAll(projeto);

      expect(service.findAll).toHaveBeenCalledWith(projeto);
      expect(result).toEqual(casoDeTesteDtoArray);
    });
  });

  describe('findOne', () => {
    it('should return a CasoDeTeste', async () => {
      const id = '1';

      const casoDeTesteDto: CasoDeTesteDto = {
        id: 1,
        projeto: {
          nome: 'Teste',
          descricao: 'Teste',
          status: 'EM ANDAMENTO',
          dataInicio: new Date(),
          previsaoFim: new Date(),
          empresa: 'Teste',
        },
        nome: 'Teste',
        descricao: 'Teste',
        preCondicao: 'Teste',
        posCondicao: 'Teste',
        resultadoEsperado: 'Teste',
        prioridade: 'ALTA',
        complexidade: 'COMPLEXO',
        dadosEntrada: 'Teste',
        observacoes: 'Teste',
        status: 'ATIVO',
        metodo: 'MANUAL',
        tecnica: 'FUNCIONAL',
        casoDeUso: {
          nome: 'Teste',
          descricao: 'Teste',
          complexidade: 'COMPLEXO',
        },
      };

      jest.spyOn(service, 'findOne').mockResolvedValueOnce(casoDeTesteDto);

      const result = await controller.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(+id);
    });
  });

  describe('changeSuite', () => {
    it('should change the suite of a CasoDeTeste', async () => {
      const id = '1';
      const suiteId = 1;

      jest.spyOn(service, 'changeSuite').mockResolvedValueOnce({} as any);

      const result = await controller.changeSuite(id, { suiteId });

      expect(service.changeSuite).toHaveBeenCalledWith(+id, suiteId);
    });
  });

  describe('update', () => {
    it('should update a CasoDeTeste', async () => {
      const id = '1';
      const updateDto: UpdateCasoDeTesteDto = {
        nome: 'Teste',
        descricao: 'Teste',
        preCondicao: 'Teste',
        posCondicao: 'Teste',
        resultadoEsperado: 'Teste',
        prioridade: 'ALTA',
        complexidade: 'COMPLEXO',
        dadosEntrada: 'Teste',
        observacoes: 'Teste',
        status: 'ATIVO',
        metodo: 'MANUAL',
        tecnica: 'FUNCIONAL',
        casoDeUsoId: null,
      };

      const mockResult = {} as any;
      jest.spyOn(service, 'update').mockResolvedValueOnce(mockResult);

      const result = await controller.update(id, updateDto);

      expect(service.update).toHaveBeenCalledWith(+id, updateDto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('remove', () => {
    it('should remove a CasoDeTeste', async () => {
      const id = '1';

      jest.spyOn(service, 'remove').mockResolvedValueOnce({} as any);

      const result = await controller.remove(id);

      expect(service.remove).toHaveBeenCalledWith(+id);
    });
  });
});
