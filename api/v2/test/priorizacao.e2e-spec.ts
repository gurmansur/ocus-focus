import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { cleanupDatabase, initializeApp } from './test-utils';

describe('PriorizacaoController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let projetoId: number;
  let requisitoId: number;
  let createdPriorizacaoId: number;

  beforeAll(async () => {
    app = await initializeApp();

    // Create a test user and get auth token
    await request(app.getHttpServer()).post('/signup').send({
      nome: 'Priorizacao Test User',
      email: 'priorizacao.test@example.com',
      senha: 'Password123!',
      empresa: 'Empresa Teste',
      cargo: 'Analista de Sistemas',
    });

    const authResponse = await request(app.getHttpServer())
      .post('/signin-colaborador')
      .send({
        email: 'priorizacao.test@example.com',
        senha: 'Password123!',
      });

    authToken = authResponse.body.accessToken;

    // Create a test projeto
    const projetoResponse = await request(app.getHttpServer())
      .post('/projeto')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        nome: 'Projeto para Teste de Priorização',
        descricao: 'Projeto criado para testes e2e de Priorização',
        empresa: 'Empresa Teste',
        dataInicio: new Date().toISOString(),
        previsaoFim: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        status: 'EM ANDAMENTO',
      });

    projetoId = projetoResponse.body.id;

    // Create a requisito to be prioritized
    const requisitoResponse = await request(app.getHttpServer())
      .post('/requisito-funcional')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        nome: 'Requisito para Priorização',
        especificacao: 'Especificação do requisito para teste e2e',
        projetoId: projetoId,
        numeroIdentificador: 1,
      });

    requisitoId = requisitoResponse.body.id;
  });

  afterAll(async () => {
    await cleanupDatabase(app);
  });

  describe('POST /priorizacao', () => {
    it('should create a new priorizacao', async () => {
      const createPriorizacaoDto = {
        requisitoId: requisitoId,
        valorNegocio: 5,
        valorRelativo: 4,
        custoRelativo: 3,
        riscoRelativo: 2,
        statusPriorizacaoId: 1, // Assuming a status ID 1 exists
        observacoes: 'Observações para teste e2e',
      };

      const response = await request(app.getHttpServer())
        .post('/priorizacao')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createPriorizacaoDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty(
        'requisitoId',
        createPriorizacaoDto.requisitoId,
      );
      expect(response.body).toHaveProperty(
        'valorNegocio',
        createPriorizacaoDto.valorNegocio,
      );
      expect(response.body).toHaveProperty(
        'valorRelativo',
        createPriorizacaoDto.valorRelativo,
      );
      expect(response.body).toHaveProperty(
        'custoRelativo',
        createPriorizacaoDto.custoRelativo,
      );
      expect(response.body).toHaveProperty(
        'riscoRelativo',
        createPriorizacaoDto.riscoRelativo,
      );
      expect(response.body).toHaveProperty(
        'statusPriorizacaoId',
        createPriorizacaoDto.statusPriorizacaoId,
      );
      expect(response.body).toHaveProperty(
        'observacoes',
        createPriorizacaoDto.observacoes,
      );

      createdPriorizacaoId = response.body.id;
    });

    it('should reject priorizacao creation with invalid data', async () => {
      const invalidPriorizacaoDto = {
        // Missing required fields
        requisitoId: requisitoId,
      };

      await request(app.getHttpServer())
        .post('/priorizacao')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidPriorizacaoDto)
        .expect(400);
    });

    it('should reject priorizacao with invalid value ranges', async () => {
      const invalidValuesDto = {
        requisitoId: requisitoId,
        valorNegocio: 11, // Assuming values should be between 1-10
        valorRelativo: 4,
        custoRelativo: 3,
        riscoRelativo: 2,
        statusPriorizacaoId: 1,
      };

      await request(app.getHttpServer())
        .post('/priorizacao')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidValuesDto)
        .expect(400);
    });

    it('should reject unauthorized access', async () => {
      const createPriorizacaoDto = {
        requisitoId: requisitoId,
        valorNegocio: 5,
        valorRelativo: 4,
        custoRelativo: 3,
        riscoRelativo: 2,
        statusPriorizacaoId: 1,
      };

      await request(app.getHttpServer())
        .post('/priorizacao')
        .send(createPriorizacaoDto)
        .expect(401);
    });
  });

  describe('GET /priorizacoes', () => {
    it('should return all priorizacoes', async () => {
      const response = await request(app.getHttpServer())
        .get('/priorizacoes')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      const createdPriorizacao = response.body.find(
        (priorizacao) => priorizacao.id === createdPriorizacaoId,
      );
      expect(createdPriorizacao).toBeDefined();
    });

    it('should return priorizacoes filtered by requisito', async () => {
      const response = await request(app.getHttpServer())
        .get(`/priorizacoes?requisitoId=${requisitoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // All returned priorizacoes should be for the specified requisito
      response.body.forEach((priorizacao) => {
        expect(priorizacao.requisitoId).toBe(requisitoId);
      });
    });

    it('should return priorizacoes filtered by status', async () => {
      const statusId = 1; // Assuming status ID 1 exists

      const response = await request(app.getHttpServer())
        .get(`/priorizacoes?statusPriorizacaoId=${statusId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);

      // All returned priorizacoes should have the specified status
      response.body.forEach((priorizacao) => {
        expect(priorizacao.statusPriorizacaoId).toBe(statusId);
      });
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer()).get('/priorizacoes').expect(401);
    });
  });

  describe('GET /priorizacao/:id', () => {
    it('should return priorizacao by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/priorizacao/${createdPriorizacaoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', createdPriorizacaoId);
      expect(response.body).toHaveProperty('requisitoId');
      expect(response.body).toHaveProperty('valorNegocio');
      expect(response.body).toHaveProperty('valorRelativo');
      expect(response.body).toHaveProperty('custoRelativo');
      expect(response.body).toHaveProperty('riscoRelativo');
      expect(response.body).toHaveProperty('statusPriorizacaoId');
    });

    it('should return 404 for non-existent priorizacao', async () => {
      await request(app.getHttpServer())
        .get('/priorizacao/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer())
        .get(`/priorizacao/${createdPriorizacaoId}`)
        .expect(401);
    });
  });

  describe('PATCH /priorizacao/:id', () => {
    it('should update priorizacao values', async () => {
      const updatePriorizacaoDto = {
        valorNegocio: 8,
        valorRelativo: 7,
        custoRelativo: 6,
        riscoRelativo: 5,
      };

      const response = await request(app.getHttpServer())
        .patch(`/priorizacao/${createdPriorizacaoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatePriorizacaoDto)
        .expect(200);

      expect(response.body).toHaveProperty('id', createdPriorizacaoId);
      expect(response.body).toHaveProperty(
        'valorNegocio',
        updatePriorizacaoDto.valorNegocio,
      );
      expect(response.body).toHaveProperty(
        'valorRelativo',
        updatePriorizacaoDto.valorRelativo,
      );
      expect(response.body).toHaveProperty(
        'custoRelativo',
        updatePriorizacaoDto.custoRelativo,
      );
      expect(response.body).toHaveProperty(
        'riscoRelativo',
        updatePriorizacaoDto.riscoRelativo,
      );
    });

    it('should update priorizacao status', async () => {
      const updateStatusDto = {
        statusPriorizacaoId: 2, // Assuming status ID 2 exists
      };

      const response = await request(app.getHttpServer())
        .patch(`/priorizacao/${createdPriorizacaoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateStatusDto)
        .expect(200);

      expect(response.body).toHaveProperty('id', createdPriorizacaoId);
      expect(response.body).toHaveProperty(
        'statusPriorizacaoId',
        updateStatusDto.statusPriorizacaoId,
      );
    });

    it('should reject invalid value updates', async () => {
      const invalidValuesUpdateDto = {
        valorNegocio: -1, // Assuming values should be positive
      };

      await request(app.getHttpServer())
        .patch(`/priorizacao/${createdPriorizacaoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidValuesUpdateDto)
        .expect(400);
    });

    it('should return 404 for non-existent priorizacao', async () => {
      const updatePriorizacaoDto = {
        valorNegocio: 9,
      };

      await request(app.getHttpServer())
        .patch('/priorizacao/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatePriorizacaoDto)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      const updatePriorizacaoDto = {
        valorNegocio: 9,
      };

      await request(app.getHttpServer())
        .patch(`/priorizacao/${createdPriorizacaoId}`)
        .send(updatePriorizacaoDto)
        .expect(401);
    });
  });

  describe('DELETE /priorizacao/:id', () => {
    it('should delete priorizacao by id', async () => {
      await request(app.getHttpServer())
        .delete(`/priorizacao/${createdPriorizacaoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify priorizacao was deleted
      await request(app.getHttpServer())
        .get(`/priorizacao/${createdPriorizacaoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 404 for non-existent priorizacao', async () => {
      await request(app.getHttpServer())
        .delete('/priorizacao/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer()).delete('/priorizacao/1').expect(401);
    });
  });
});
