import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { cleanupDatabase, initializeApp } from './test-utils';

describe('ResultadoRequisitoController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let projetoId: number;
  let requisitoId: number;
  let createdResultadoRequisitoId: number;

  beforeAll(async () => {
    app = await initializeApp();

    // Create a test user and get auth token
    await request(app.getHttpServer()).post('/signup').send({
      nome: 'Resultado Requisito Test User',
      email: 'resultado.requisito@example.com',
      senha: 'Password123!',
      empresa: 'Empresa Teste',
      cargo: 'Analista de Sistemas',
    });

    const authResponse = await request(app.getHttpServer())
      .post('/signin-colaborador')
      .send({
        email: 'resultado.requisito@example.com',
        senha: 'Password123!',
      });

    authToken = authResponse.body.accessToken;

    // Create a test projeto
    const projetoResponse = await request(app.getHttpServer())
      .post('/projeto')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        nome: 'Projeto para Teste de Resultado Requisito',
        descricao: 'Projeto criado para testes e2e de Resultado Requisito',
        empresa: 'Empresa Teste',
        dataInicio: new Date().toISOString(),
        previsaoFim: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        status: 'EM ANDAMENTO',
      });

    projetoId = projetoResponse.body.id;

    // Create a requisito
    const requisitoResponse = await request(app.getHttpServer())
      .post('/requisito-funcional')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        nome: 'Requisito para Resultado',
        especificacao: 'Especificação do requisito para teste e2e de resultado',
        projetoId: projetoId,
        numeroIdentificador: 1,
      });

    requisitoId = requisitoResponse.body.id;
  });

  afterAll(async () => {
    await cleanupDatabase(app);
  });

  describe('POST /resultado-requisito', () => {
    it('should create a new resultado requisito', async () => {
      const createResultadoRequisitoDto = {
        requisitoId: requisitoId,
        resultado: 'APROVADO',
        observacoes: 'Requisito aprovado após testes',
        dataTeste: new Date().toISOString(),
      };

      const response = await request(app.getHttpServer())
        .post('/resultado-requisito')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createResultadoRequisitoDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty(
        'requisitoId',
        createResultadoRequisitoDto.requisitoId,
      );
      expect(response.body).toHaveProperty(
        'resultado',
        createResultadoRequisitoDto.resultado,
      );
      expect(response.body).toHaveProperty(
        'observacoes',
        createResultadoRequisitoDto.observacoes,
      );
      expect(response.body).toHaveProperty('dataTeste');

      createdResultadoRequisitoId = response.body.id;
    });

    it('should reject resultado requisito creation with invalid data', async () => {
      const invalidResultadoRequisitoDto = {
        // Missing required fields
        requisitoId: requisitoId,
      };

      await request(app.getHttpServer())
        .post('/resultado-requisito')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidResultadoRequisitoDto)
        .expect(400);
    });

    it('should reject resultado requisito with invalid resultado value', async () => {
      const invalidResultadoDto = {
        requisitoId: requisitoId,
        resultado: 'STATUS_INVALIDO', // Assuming valid values are APROVADO, REPROVADO, etc.
        dataTeste: new Date().toISOString(),
      };

      await request(app.getHttpServer())
        .post('/resultado-requisito')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidResultadoDto)
        .expect(400);
    });

    it('should reject unauthorized access', async () => {
      const createResultadoRequisitoDto = {
        requisitoId: requisitoId,
        resultado: 'APROVADO',
        observacoes: 'Requisito aprovado após testes',
        dataTeste: new Date().toISOString(),
      };

      await request(app.getHttpServer())
        .post('/resultado-requisito')
        .send(createResultadoRequisitoDto)
        .expect(401);
    });
  });

  describe('GET /resultados-requisito', () => {
    it('should return all resultados requisito', async () => {
      const response = await request(app.getHttpServer())
        .get('/resultados-requisito')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      const createdResultadoRequisito = response.body.find(
        (resultado) => resultado.id === createdResultadoRequisitoId,
      );
      expect(createdResultadoRequisito).toBeDefined();
    });

    it('should return resultados filtered by requisito', async () => {
      const response = await request(app.getHttpServer())
        .get(`/resultados-requisito?requisitoId=${requisitoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // All returned resultados should be for the specified requisito
      response.body.forEach((resultado) => {
        expect(resultado.requisitoId).toBe(requisitoId);
      });
    });

    it('should return resultados filtered by resultado status', async () => {
      const response = await request(app.getHttpServer())
        .get('/resultados-requisito?resultado=APROVADO')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);

      // All returned resultados should have the specified status
      response.body.forEach((resultado) => {
        expect(resultado.resultado).toBe('APROVADO');
      });
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer())
        .get('/resultados-requisito')
        .expect(401);
    });
  });

  describe('GET /resultado-requisito/:id', () => {
    it('should return resultado requisito by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/resultado-requisito/${createdResultadoRequisitoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', createdResultadoRequisitoId);
      expect(response.body).toHaveProperty('requisitoId');
      expect(response.body).toHaveProperty('resultado');
      expect(response.body).toHaveProperty('observacoes');
      expect(response.body).toHaveProperty('dataTeste');
    });

    it('should return 404 for non-existent resultado requisito', async () => {
      await request(app.getHttpServer())
        .get('/resultado-requisito/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer())
        .get(`/resultado-requisito/${createdResultadoRequisitoId}`)
        .expect(401);
    });
  });

  describe('PATCH /resultado-requisito/:id', () => {
    it('should update resultado requisito details', async () => {
      const updateResultadoRequisitoDto = {
        resultado: 'REPROVADO',
        observacoes: 'Requisito reprovado após reavaliação',
      };

      const response = await request(app.getHttpServer())
        .patch(`/resultado-requisito/${createdResultadoRequisitoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateResultadoRequisitoDto)
        .expect(200);

      expect(response.body).toHaveProperty('id', createdResultadoRequisitoId);
      expect(response.body).toHaveProperty(
        'resultado',
        updateResultadoRequisitoDto.resultado,
      );
      expect(response.body).toHaveProperty(
        'observacoes',
        updateResultadoRequisitoDto.observacoes,
      );
    });

    it('should reject invalid resultado value update', async () => {
      const invalidResultadoUpdateDto = {
        resultado: 'STATUS_INVALIDO',
      };

      await request(app.getHttpServer())
        .patch(`/resultado-requisito/${createdResultadoRequisitoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidResultadoUpdateDto)
        .expect(400);
    });

    it('should return 404 for non-existent resultado requisito', async () => {
      const updateResultadoRequisitoDto = {
        resultado: 'APROVADO',
      };

      await request(app.getHttpServer())
        .patch('/resultado-requisito/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateResultadoRequisitoDto)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      const updateResultadoRequisitoDto = {
        resultado: 'APROVADO',
      };

      await request(app.getHttpServer())
        .patch(`/resultado-requisito/${createdResultadoRequisitoId}`)
        .send(updateResultadoRequisitoDto)
        .expect(401);
    });
  });

  describe('DELETE /resultado-requisito/:id', () => {
    it('should delete resultado requisito by id', async () => {
      // First create a temporary resultado requisito that we'll delete
      const createTempResultadoDto = {
        requisitoId: requisitoId,
        resultado: 'APROVADO',
        observacoes: 'Resultado temporário para ser deletado',
        dataTeste: new Date().toISOString(),
      };

      const createResponse = await request(app.getHttpServer())
        .post('/resultado-requisito')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createTempResultadoDto)
        .expect(201);

      const tempResultadoId = createResponse.body.id;

      // Now delete it
      await request(app.getHttpServer())
        .delete(`/resultado-requisito/${tempResultadoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify the resultado was deleted
      await request(app.getHttpServer())
        .get(`/resultado-requisito/${tempResultadoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 404 for non-existent resultado requisito', async () => {
      await request(app.getHttpServer())
        .delete('/resultado-requisito/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer())
        .delete('/resultado-requisito/1')
        .expect(401);
    });
  });
});
