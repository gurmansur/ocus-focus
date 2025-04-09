import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { cleanupDatabase, initializeApp } from './test-utils';

describe('StatusPriorizacaoController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let createdStatusPriorizacaoId: number;

  beforeAll(async () => {
    app = await initializeApp();

    // Create a test user and get auth token
    await request(app.getHttpServer()).post('/signup').send({
      nome: 'Status Priorizacao Test User',
      email: 'status.priorizacao@example.com',
      senha: 'Password123!',
      empresa: 'Empresa Teste',
      cargo: 'Analista de Sistemas',
    });

    const authResponse = await request(app.getHttpServer())
      .post('/signin-colaborador')
      .send({
        email: 'status.priorizacao@example.com',
        senha: 'Password123!',
      });

    authToken = authResponse.body.accessToken;
  });

  afterAll(async () => {
    await cleanupDatabase(app);
  });

  describe('POST /status-priorizacao', () => {
    it('should create a new status priorizacao', async () => {
      const createStatusPriorizacaoDto = {
        nome: 'Status Priorizacao Teste',
        descricao: 'Status de priorização para testes e2e',
      };

      const response = await request(app.getHttpServer())
        .post('/status-priorizacao')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createStatusPriorizacaoDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty(
        'nome',
        createStatusPriorizacaoDto.nome,
      );
      expect(response.body).toHaveProperty(
        'descricao',
        createStatusPriorizacaoDto.descricao,
      );

      createdStatusPriorizacaoId = response.body.id;
    });

    it('should reject status priorizacao creation with invalid data', async () => {
      const invalidStatusPriorizacaoDto = {
        // Missing required fields
        descricao: 'Descrição sem nome',
      };

      await request(app.getHttpServer())
        .post('/status-priorizacao')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidStatusPriorizacaoDto)
        .expect(400);
    });

    it('should reject unauthorized access', async () => {
      const createStatusPriorizacaoDto = {
        nome: 'Status Não Autorizado',
        descricao: 'Este status não deveria ser criado',
      };

      await request(app.getHttpServer())
        .post('/status-priorizacao')
        .send(createStatusPriorizacaoDto)
        .expect(401);
    });
  });

  describe('GET /status-priorizacao', () => {
    it('should return all status priorizacao', async () => {
      const response = await request(app.getHttpServer())
        .get('/status-priorizacao')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      const createdStatusPriorizacao = response.body.find(
        (status) => status.id === createdStatusPriorizacaoId,
      );
      expect(createdStatusPriorizacao).toBeDefined();
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer()).get('/status-priorizacao').expect(401);
    });
  });

  describe('GET /status-priorizacao/:id', () => {
    it('should return status priorizacao by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/status-priorizacao/${createdStatusPriorizacaoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', createdStatusPriorizacaoId);
      expect(response.body).toHaveProperty('nome');
      expect(response.body).toHaveProperty('descricao');
    });

    it('should return 404 for non-existent status priorizacao', async () => {
      await request(app.getHttpServer())
        .get('/status-priorizacao/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer())
        .get(`/status-priorizacao/${createdStatusPriorizacaoId}`)
        .expect(401);
    });
  });

  describe('PATCH /status-priorizacao/:id', () => {
    it('should update status priorizacao details', async () => {
      const updateStatusPriorizacaoDto = {
        nome: 'Status Priorizacao Atualizado',
        descricao: 'Descrição atualizada para teste e2e',
      };

      const response = await request(app.getHttpServer())
        .patch(`/status-priorizacao/${createdStatusPriorizacaoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateStatusPriorizacaoDto)
        .expect(200);

      expect(response.body).toHaveProperty('id', createdStatusPriorizacaoId);
      expect(response.body).toHaveProperty(
        'nome',
        updateStatusPriorizacaoDto.nome,
      );
      expect(response.body).toHaveProperty(
        'descricao',
        updateStatusPriorizacaoDto.descricao,
      );
    });

    it('should return 404 for non-existent status priorizacao', async () => {
      const updateStatusPriorizacaoDto = {
        nome: 'Status Inexistente',
      };

      await request(app.getHttpServer())
        .patch('/status-priorizacao/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateStatusPriorizacaoDto)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      const updateStatusPriorizacaoDto = {
        nome: 'Status Não Autorizado',
      };

      await request(app.getHttpServer())
        .patch(`/status-priorizacao/${createdStatusPriorizacaoId}`)
        .send(updateStatusPriorizacaoDto)
        .expect(401);
    });
  });

  describe('DELETE /status-priorizacao/:id', () => {
    it('should delete status priorizacao by id', async () => {
      // First create a status that we'll delete
      const createTempStatusDto = {
        nome: 'Status Temporário para Deletar',
        descricao: 'Este status será deletado',
      };

      const createResponse = await request(app.getHttpServer())
        .post('/status-priorizacao')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createTempStatusDto)
        .expect(201);

      const tempStatusId = createResponse.body.id;

      // Now delete it
      await request(app.getHttpServer())
        .delete(`/status-priorizacao/${tempStatusId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify status was deleted
      await request(app.getHttpServer())
        .get(`/status-priorizacao/${tempStatusId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 404 for non-existent status priorizacao', async () => {
      await request(app.getHttpServer())
        .delete('/status-priorizacao/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer())
        .delete('/status-priorizacao/1')
        .expect(401);
    });
  });
});
