import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../../config/typeorm.config';
import { Projeto } from '../projeto/entities/projeto.entity';
import { CasoDeTesteController } from './caso-de-teste.controller';
import { CasoDeTesteModule } from './caso-de-teste.module';
import { CasoDeTesteService } from './caso-de-teste.service';
import { CasoDeTesteDto } from './dto/caso-de-teste.dto';
import { CreateCasoDeTesteDto } from './dto/create-caso-de-teste.dto';
import { UpdateCasoDeTesteDto } from './dto/update-caso-de-teste.dto';
import { CasoDeTeste } from './entities/caso-de-teste.entity';

describe('CasoDeTesteController', () => {
  let controller: CasoDeTesteController;
  let service: CasoDeTesteService;
  jest.setTimeout(60000);

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CasoDeTesteModule,
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: `.env.${process.env.NODE_ENV}`,
        }),
        TypeOrmModule.forRootAsync({
          useClass: TypeOrmConfigService,
        }),
        TypeOrmModule.forFeature([CasoDeTeste]),
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
      };

      jest.spyOn(service, 'create').mockResolvedValueOnce({} as CasoDeTesteDto);

      const result = await controller.create(createDto, projeto);

      expect(service.create).toHaveBeenCalledWith(createDto, projeto);
      expect(result).toEqual({
        ...createDto,
        projeto,
        casoDeUso: undefined,
        id: expect.any(Number),
      } as CasoDeTesteDto);
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

      jest.spyOn(service, 'update').mockResolvedValueOnce({} as any);

      const result = await controller.update(id, updateDto);

      expect(service.update).toHaveBeenCalledWith(+id, updateDto);
      expect(result).toEqual(updateDto);
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
