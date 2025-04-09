import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { cleanupDatabase, initializeApp } from './test-utils';

describe('CenariosController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let createdCenarioId: number;
  let projetoId: number;

  beforeAll(async () => {
    app = await initializeApp();

    // Create a test user and get auth token
    await request(app.getHttpServer()).post('/signup').send({
      nome: 'Cenarios Test User',
      email: 'cenarios.test@example.com',
      senha: 'Password123!',
      empresa: 'Empresa Teste',
      cargo: 'Analista de Sistemas',
    });

    const authResponse = await request(app.getHttpServer())
      .post('/signin-colaborador')
      .send({
        email: 'cenarios.test@example.com',
        senha: 'Password123!',
      });

    authToken = authResponse.body.accessToken;

    // Create a test projeto
    const projetoResponse = await request(app.getHttpServer())
      .post('/projeto')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        nome: 'Projeto para Teste de Cenários',
        descricao: 'Projeto criado para testes e2e de Cenários',
        empresa: 'Empresa Teste',
        dataInicio: new Date().toISOString(),
        previsaoFim: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        status: 'EM ANDAMENTO',
      });

    projetoId = projetoResponse.body.id;
  });

  afterAll(async () => {
    await cleanupDatabase(app);
  });

  describe('POST /cenarios', () => {
    it('should create a new cenario', async () => {
      const createCenarioDto = {
        nome: 'Cenário de Teste E2E',
        descricao: 'Descrição do cenário para teste e2e',
        tipo: 'POSITIVO',
        projetoId: projetoId,
      };

      const response = await request(app.getHttpServer())
        .post('/cenarios')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createCenarioDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('nome', createCenarioDto.nome);
      expect(response.body).toHaveProperty(
        'descricao',
        createCenarioDto.descricao,
      );
      expect(response.body).toHaveProperty('tipo', createCenarioDto.tipo);
      expect(response.body).toHaveProperty(
        'projetoId',
        createCenarioDto.projetoId,
      );

      createdCenarioId = response.body.id;
    });

    it('should reject cenario creation with invalid data', async () => {
      const invalidCenarioDto = {
        // Missing required fields
        descricao: 'Cenário inválido',
      };

      await request(app.getHttpServer())
        .post('/cenarios')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidCenarioDto)
        .expect(400);
    });

    it('should reject unauthorized access', async () => {
      const createCenarioDto = {
        nome: 'Cenário Não Autorizado',
        descricao: 'Descrição do cenário não autorizado',
        tipo: 'POSITIVO',
        projetoId: projetoId,
      };

      await request(app.getHttpServer())
        .post('/cenarios')
        .send(createCenarioDto)
        .expect(401);
    });
  });

  describe('GET /cenarios', () => {
    it('should return all cenarios', async () => {
      const response = await request(app.getHttpServer())
        .get('/cenarios')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      const createdCenario = response.body.find(
        (cenario) => cenario.id === createdCenarioId,
      );
      expect(createdCenario).toBeDefined();
    });

    it('should return cenarios filtered by projeto', async () => {
      const response = await request(app.getHttpServer())
        .get(`/cenarios?projetoId=${projetoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // All returned cenarios should belong to the specified project
      response.body.forEach((cenario) => {
        expect(cenario.projetoId).toBe(projetoId);
      });
    });

    it('should return cenarios filtered by tipo', async () => {
      const response = await request(app.getHttpServer())
        .get('/cenarios?tipo=POSITIVO')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);

      // All returned cenarios should have the specified tipo
      response.body.forEach((cenario) => {
        expect(cenario.tipo).toBe('POSITIVO');
      });
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer()).get('/cenarios').expect(401);
    });
  });

  describe('GET /cenarios/:id', () => {
    it('should return cenario by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/cenarios/${createdCenarioId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', createdCenarioId);
      expect(response.body).toHaveProperty('nome');
      expect(response.body).toHaveProperty('descricao');
      expect(response.body).toHaveProperty('tipo');
      expect(response.body).toHaveProperty('projetoId', projetoId);
    });

    it('should return 404 for non-existent cenario', async () => {
      await request(app.getHttpServer())
        .get('/cenarios/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer())
        .get(`/cenarios/${createdCenarioId}`)
        .expect(401);
    });
  });

  describe('PATCH /cenarios/:id', () => {
    it('should update cenario by id', async () => {
      const updateCenarioDto = {
        nome: 'Cenário Atualizado',
        descricao: 'Descrição atualizada para teste e2e',
        tipo: 'NEGATIVO',
      };

      const response = await request(app.getHttpServer())
        .patch(`/cenarios/${createdCenarioId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateCenarioDto)
        .expect(200);

      expect(response.body).toHaveProperty('id', createdCenarioId);
      expect(response.body).toHaveProperty('nome', updateCenarioDto.nome);
      expect(response.body).toHaveProperty(
        'descricao',
        updateCenarioDto.descricao,
      );
      expect(response.body).toHaveProperty('tipo', updateCenarioDto.tipo);
      expect(response.body).toHaveProperty('projetoId', projetoId);
    });

    it('should return 404 for non-existent cenario', async () => {
      const updateCenarioDto = {
        nome: 'Cenário Inexistente',
      };

      await request(app.getHttpServer())
        .patch('/cenarios/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateCenarioDto)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      const updateCenarioDto = {
        nome: 'Cenário Não Autorizado',
      };

      await request(app.getHttpServer())
        .patch(`/cenarios/${createdCenarioId}`)
        .send(updateCenarioDto)
        .expect(401);
    });
  });

  describe('DELETE /cenarios/:id', () => {
    it('should delete cenario by id', async () => {
      await request(app.getHttpServer())
        .delete(`/cenarios/${createdCenarioId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify cenario was deleted
      await request(app.getHttpServer())
        .get(`/cenarios/${createdCenarioId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 404 for non-existent cenario', async () => {
      await request(app.getHttpServer())
        .delete('/cenarios/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer()).delete('/cenarios/1').expect(401);
    });
  });
});
