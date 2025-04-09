import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { cleanupDatabase, initializeApp } from './test-utils';

describe('RequisitoController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let projetoId: number;
  let requisitoId: number;

  beforeAll(async () => {
    app = await initializeApp();

    // Create a test user and get auth token
    await request(app.getHttpServer()).post('/signup').send({
      nome: 'Requisito Test User',
      email: 'requisito.test@example.com',
      senha: 'Password123!',
      empresa: 'Empresa Teste',
      cargo: 'Analista de Requisitos',
    });

    const authResponse = await request(app.getHttpServer())
      .post('/signin-colaborador')
      .send({
        email: 'requisito.test@example.com',
        senha: 'Password123!',
      });

    authToken = authResponse.body.accessToken;

    // Create a test projeto
    const projetoResponse = await request(app.getHttpServer())
      .post('/projeto')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        nome: 'Projeto para Teste de Requisito',
        descricao: 'Projeto criado para testes e2e de Requisito',
        empresa: 'Empresa Teste',
        dataInicio: new Date().toISOString(),
        previsaoFim: new Date(
          Date.now() + 60 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        status: 'EM ANDAMENTO',
      });

    projetoId = projetoResponse.body.id;
  }, 30000);

  afterAll(async () => {
    await cleanupDatabase(app);
  }, 10000);

  describe('POST /requisito', () => {
    it('should create a new requisito', async () => {
      const createRequisitoDto = {
        descricao: 'Requisito de Teste E2E',
        tipo: 'FUNCIONAL',
        prioridade: 'ALTA',
        projetoId,
        numeroIdentificador: 1,
      };

      const response = await request(app.getHttpServer())
        .post('/requisito')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createRequisitoDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty(
        'descricao',
        createRequisitoDto.descricao,
      );
      expect(response.body).toHaveProperty('tipo', createRequisitoDto.tipo);
      expect(response.body).toHaveProperty(
        'prioridade',
        createRequisitoDto.prioridade,
      );
      expect(response.body).toHaveProperty('projetoId', projetoId);
      expect(response.body).toHaveProperty(
        'numeroIdentificador',
        createRequisitoDto.numeroIdentificador,
      );

      requisitoId = response.body.id;
    });

    it('should create a requisito não funcional', async () => {
      const createRequisitoNaoFuncionalDto = {
        descricao: 'Requisito Não Funcional de Teste E2E',
        tipo: 'NAO_FUNCIONAL',
        prioridade: 'MEDIA',
        projetoId,
        numeroIdentificador: 2,
      };

      const response = await request(app.getHttpServer())
        .post('/requisito')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createRequisitoNaoFuncionalDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty(
        'descricao',
        createRequisitoNaoFuncionalDto.descricao,
      );
      expect(response.body).toHaveProperty(
        'tipo',
        createRequisitoNaoFuncionalDto.tipo,
      );
      expect(response.body).toHaveProperty(
        'prioridade',
        createRequisitoNaoFuncionalDto.prioridade,
      );
    });

    it('should reject requisito creation with invalid data', async () => {
      const invalidRequisitoDto = {
        // Missing required fields
        prioridade: 'ALTA',
        projetoId,
      };

      await request(app.getHttpServer())
        .post('/requisito')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidRequisitoDto)
        .expect(400);
    });

    it('should reject requisito with invalid tipo', async () => {
      const invalidTipoDto = {
        descricao: 'Requisito com Tipo Inválido',
        tipo: 'TIPO_INVALIDO',
        prioridade: 'ALTA',
        projetoId,
        numeroIdentificador: 3,
      };

      await request(app.getHttpServer())
        .post('/requisito')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidTipoDto)
        .expect(400);
    });

    it('should reject requisito with invalid prioridade', async () => {
      const invalidPrioridadeDto = {
        descricao: 'Requisito com Prioridade Inválida',
        tipo: 'FUNCIONAL',
        prioridade: 'PRIORIDADE_INVALIDA',
        projetoId,
        numeroIdentificador: 4,
      };

      await request(app.getHttpServer())
        .post('/requisito')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidPrioridadeDto)
        .expect(400);
    });

    it('should reject unauthorized access', async () => {
      const createRequisitoDto = {
        descricao: 'Requisito Não Autorizado',
        tipo: 'FUNCIONAL',
        prioridade: 'ALTA',
        projetoId,
        numeroIdentificador: 5,
      };

      await request(app.getHttpServer())
        .post('/requisito')
        .send(createRequisitoDto)
        .expect(401);
    });
  });

  describe('GET /requisitos', () => {
    it('should return all requisitos', async () => {
      const response = await request(app.getHttpServer())
        .get('/requisitos')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      const createdRequisito = response.body.find(
        (requisito) => requisito.id === requisitoId,
      );
      expect(createdRequisito).toBeDefined();
    });

    it('should return requisitos filtered by projeto', async () => {
      const response = await request(app.getHttpServer())
        .get(`/requisitos?projetoId=${projetoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // All returned requisitos should belong to the specified projeto
      response.body.forEach((requisito) => {
        expect(requisito.projetoId).toBe(projetoId);
      });
    });

    it('should return requisitos filtered by tipo', async () => {
      const response = await request(app.getHttpServer())
        .get('/requisitos?tipo=FUNCIONAL')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      // All returned requisitos should have the specified tipo
      response.body.forEach((requisito) => {
        expect(requisito.tipo).toBe('FUNCIONAL');
      });
    });

    it('should return requisitos filtered by prioridade', async () => {
      const response = await request(app.getHttpServer())
        .get('/requisitos?prioridade=ALTA')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      // All returned requisitos should have the specified prioridade
      response.body.forEach((requisito) => {
        expect(requisito.prioridade).toBe('ALTA');
      });
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer()).get('/requisitos').expect(401);
    });
  });

  describe('GET /requisito/:id', () => {
    it('should return requisito by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/requisito/${requisitoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', requisitoId);
      expect(response.body).toHaveProperty('descricao');
      expect(response.body).toHaveProperty('tipo');
      expect(response.body).toHaveProperty('prioridade');
      expect(response.body).toHaveProperty('projetoId', projetoId);
    });

    it('should return 404 for non-existent requisito', async () => {
      await request(app.getHttpServer())
        .get('/requisito/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer())
        .get(`/requisito/${requisitoId}`)
        .expect(401);
    });
  });

  describe('PATCH /requisito/:id', () => {
    it('should update requisito details', async () => {
      const updateRequisitoDto = {
        descricao: 'Requisito de Teste Atualizado',
        prioridade: 'MEDIA',
      };

      const response = await request(app.getHttpServer())
        .patch(`/requisito/${requisitoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateRequisitoDto)
        .expect(200);

      expect(response.body).toHaveProperty('id', requisitoId);
      expect(response.body).toHaveProperty(
        'descricao',
        updateRequisitoDto.descricao,
      );
      expect(response.body).toHaveProperty(
        'prioridade',
        updateRequisitoDto.prioridade,
      );
    });

    it('should reject update with invalid tipo', async () => {
      const invalidTipoDto = {
        tipo: 'TIPO_INVALIDO',
      };

      await request(app.getHttpServer())
        .patch(`/requisito/${requisitoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidTipoDto)
        .expect(400);
    });

    it('should reject update with invalid prioridade', async () => {
      const invalidPrioridadeDto = {
        prioridade: 'PRIORIDADE_INVALIDA',
      };

      await request(app.getHttpServer())
        .patch(`/requisito/${requisitoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidPrioridadeDto)
        .expect(400);
    });

    it('should return 404 for non-existent requisito', async () => {
      const updateRequisitoDto = {
        descricao: 'Requisito Inexistente',
      };

      await request(app.getHttpServer())
        .patch('/requisito/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateRequisitoDto)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      const updateRequisitoDto = {
        descricao: 'Requisito Não Autorizado',
      };

      await request(app.getHttpServer())
        .patch(`/requisito/${requisitoId}`)
        .send(updateRequisitoDto)
        .expect(401);
    });
  });

  describe('DELETE /requisito/:id', () => {
    it('should delete requisito by id', async () => {
      // First create a requisito that we'll delete
      const createTempRequisitoDto = {
        descricao: 'Requisito Temporário para Deletar',
        tipo: 'FUNCIONAL',
        prioridade: 'BAIXA',
        projetoId,
        numeroIdentificador: 10,
      };

      const createResponse = await request(app.getHttpServer())
        .post('/requisito')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createTempRequisitoDto)
        .expect(201);

      const tempRequisitoId = createResponse.body.id;

      // Now delete it
      await request(app.getHttpServer())
        .delete(`/requisito/${tempRequisitoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify requisito was deleted
      await request(app.getHttpServer())
        .get(`/requisito/${tempRequisitoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 404 for non-existent requisito', async () => {
      await request(app.getHttpServer())
        .delete('/requisito/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer()).delete('/requisito/1').expect(401);
    });
  });
});
