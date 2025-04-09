import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { cleanupDatabase, initializeApp } from './test-utils';

describe('CasoUsoController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let createdCasoUsoId: number;
  let projetoId: number;
  let atorId: number;

  beforeAll(async () => {
    app = await initializeApp();

    // Create a test user and get auth token
    await request(app.getHttpServer()).post('/signup').send({
      nome: 'Caso Uso User',
      email: 'caso.uso@example.com',
      senha: 'Password123!',
      empresa: 'Empresa Teste',
      cargo: 'Analista de Sistemas',
    });

    const authResponse = await request(app.getHttpServer())
      .post('/signin-colaborador')
      .send({
        email: 'caso.uso@example.com',
        senha: 'Password123!',
      });

    authToken = authResponse.body.accessToken;

    // Create a test projeto
    const projetoResponse = await request(app.getHttpServer())
      .post('/projeto')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        nome: 'Projeto para Teste de Caso de Uso',
        descricao: 'Projeto criado para testes e2e de Caso de Uso',
        empresa: 'Empresa Teste',
        dataInicio: new Date().toISOString(),
        previsaoFim: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        status: 'EM ANDAMENTO',
      });

    projetoId = projetoResponse.body.id;

    // Create an ator for the caso de uso
    const atorResponse = await request(app.getHttpServer())
      .post('/ator')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        nome: 'Ator para Caso de Uso',
        descricao: 'Descrição do ator para teste e2e',
        projetoId: projetoId,
      });

    atorId = atorResponse.body.id;
  });

  afterAll(async () => {
    await cleanupDatabase(app);
  });

  describe('POST /caso-uso', () => {
    it('should create a new caso de uso', async () => {
      const createCasoUsoDto = {
        nome: 'Caso de Uso E2E',
        descricao: 'Descrição do caso de uso para teste e2e',
        preCondicao: 'Pré-condição do caso de uso',
        posCondicao: 'Pós-condição do caso de uso',
        fluxoPrincipal: 'Fluxo principal do caso de uso',
        fluxoAlternativo: 'Fluxo alternativo do caso de uso',
        atorId: atorId,
        projetoId: projetoId,
      };

      const response = await request(app.getHttpServer())
        .post('/caso-uso')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createCasoUsoDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('nome', createCasoUsoDto.nome);
      expect(response.body).toHaveProperty(
        'descricao',
        createCasoUsoDto.descricao,
      );
      expect(response.body).toHaveProperty(
        'preCondicao',
        createCasoUsoDto.preCondicao,
      );
      expect(response.body).toHaveProperty(
        'posCondicao',
        createCasoUsoDto.posCondicao,
      );
      expect(response.body).toHaveProperty(
        'fluxoPrincipal',
        createCasoUsoDto.fluxoPrincipal,
      );
      expect(response.body).toHaveProperty(
        'fluxoAlternativo',
        createCasoUsoDto.fluxoAlternativo,
      );
      expect(response.body).toHaveProperty('atorId', createCasoUsoDto.atorId);
      expect(response.body).toHaveProperty(
        'projetoId',
        createCasoUsoDto.projetoId,
      );

      createdCasoUsoId = response.body.id;
    });

    it('should reject caso de uso creation with invalid data', async () => {
      const invalidCasoUsoDto = {
        // Missing required fields
        descricao: 'Caso de Uso inválido',
      };

      await request(app.getHttpServer())
        .post('/caso-uso')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidCasoUsoDto)
        .expect(400);
    });

    it('should reject unauthorized access', async () => {
      const createCasoUsoDto = {
        nome: 'Caso de Uso Não Autorizado',
        descricao: 'Descrição do caso de uso não autorizado',
        projetoId: projetoId,
      };

      await request(app.getHttpServer())
        .post('/caso-uso')
        .send(createCasoUsoDto)
        .expect(401);
    });
  });

  describe('GET /caso-uso', () => {
    it('should return all casos de uso', async () => {
      const response = await request(app.getHttpServer())
        .get('/caso-uso')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      const createdCasoUso = response.body.find(
        (caso) => caso.id === createdCasoUsoId,
      );
      expect(createdCasoUso).toBeDefined();
    });

    it('should return casos de uso filtered by projeto', async () => {
      const response = await request(app.getHttpServer())
        .get(`/caso-uso?projetoId=${projetoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // All returned casos de uso should belong to the specified project
      response.body.forEach((caso) => {
        expect(caso.projetoId).toBe(projetoId);
      });
    });

    it('should return casos de uso filtered by ator', async () => {
      const response = await request(app.getHttpServer())
        .get(`/caso-uso?atorId=${atorId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // All returned casos de uso should belong to the specified ator
      response.body.forEach((caso) => {
        expect(caso.atorId).toBe(atorId);
      });
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer()).get('/caso-uso').expect(401);
    });
  });

  describe('GET /caso-uso/:id', () => {
    it('should return caso de uso by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/caso-uso/${createdCasoUsoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', createdCasoUsoId);
      expect(response.body).toHaveProperty('nome');
      expect(response.body).toHaveProperty('descricao');
      expect(response.body).toHaveProperty('atorId', atorId);
      expect(response.body).toHaveProperty('projetoId', projetoId);
    });

    it('should return 404 for non-existent caso de uso', async () => {
      await request(app.getHttpServer())
        .get('/caso-uso/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer())
        .get(`/caso-uso/${createdCasoUsoId}`)
        .expect(401);
    });
  });

  describe('PATCH /caso-uso/:id', () => {
    it('should update caso de uso by id', async () => {
      const updateCasoUsoDto = {
        nome: 'Caso de Uso Atualizado',
        descricao: 'Descrição atualizada para teste e2e',
        fluxoPrincipal: 'Fluxo principal atualizado',
      };

      const response = await request(app.getHttpServer())
        .patch(`/caso-uso/${createdCasoUsoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateCasoUsoDto)
        .expect(200);

      expect(response.body).toHaveProperty('id', createdCasoUsoId);
      expect(response.body).toHaveProperty('nome', updateCasoUsoDto.nome);
      expect(response.body).toHaveProperty(
        'descricao',
        updateCasoUsoDto.descricao,
      );
      expect(response.body).toHaveProperty(
        'fluxoPrincipal',
        updateCasoUsoDto.fluxoPrincipal,
      );
      expect(response.body).toHaveProperty('atorId', atorId);
      expect(response.body).toHaveProperty('projetoId', projetoId);
    });

    it('should return 404 for non-existent caso de uso', async () => {
      const updateCasoUsoDto = {
        nome: 'Caso de Uso Inexistente',
      };

      await request(app.getHttpServer())
        .patch('/caso-uso/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateCasoUsoDto)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      const updateCasoUsoDto = {
        nome: 'Caso de Uso Não Autorizado',
      };

      await request(app.getHttpServer())
        .patch(`/caso-uso/${createdCasoUsoId}`)
        .send(updateCasoUsoDto)
        .expect(401);
    });
  });

  describe('DELETE /caso-uso/:id', () => {
    it('should delete caso de uso by id', async () => {
      await request(app.getHttpServer())
        .delete(`/caso-uso/${createdCasoUsoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify caso de uso was deleted
      await request(app.getHttpServer())
        .get(`/caso-uso/${createdCasoUsoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 404 for non-existent caso de uso', async () => {
      await request(app.getHttpServer())
        .delete('/caso-uso/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer()).delete('/caso-uso/1').expect(401);
    });
  });
});
