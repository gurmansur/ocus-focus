import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { cleanupDatabase, initializeApp } from './test-utils';

describe('EstimativaController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let createdEstimativaId: number;
  let projetoId: number;
  let requisitoId: number;

  beforeAll(async () => {
    app = await initializeApp();

    // Create a test user and get auth token
    await request(app.getHttpServer()).post('/signup').send({
      nome: 'Estimativa Test User',
      email: 'estimativa.test@example.com',
      senha: 'Password123!',
      empresa: 'Empresa Teste',
      cargo: 'Analista de Sistemas',
    });

    const authResponse = await request(app.getHttpServer())
      .post('/signin-colaborador')
      .send({
        email: 'estimativa.test@example.com',
        senha: 'Password123!',
      });

    authToken = authResponse.body.accessToken;

    // Create a test projeto
    const projetoResponse = await request(app.getHttpServer())
      .post('/projeto')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        nome: 'Projeto para Teste de Estimativa',
        descricao: 'Projeto criado para testes e2e de Estimativa',
        empresa: 'Empresa Teste',
        dataInicio: new Date().toISOString(),
        previsaoFim: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        status: 'EM ANDAMENTO',
      });

    projetoId = projetoResponse.body.id;

    // Create a test requisito for the estimativa
    const requisitoResponse = await request(app.getHttpServer())
      .post('/requisito-funcional')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        nome: 'Requisito para Estimativa',
        especificacao: 'Especificação do requisito para teste e2e',
        projetoId: projetoId,
        numeroIdentificador: 1,
      });

    requisitoId = requisitoResponse.body.id;
  });

  afterAll(async () => {
    await cleanupDatabase(app);
  });

  describe('POST /estimativa', () => {
    it('should create a new estimativa', async () => {
      const createEstimativaDto = {
        tipo: 'PONTOS_DE_FUNCAO',
        valor: 8,
        observacao: 'Estimativa para o requisito de teste',
        requisitoId: requisitoId,
        projetoId: projetoId,
      };

      const response = await request(app.getHttpServer())
        .post('/estimativa')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createEstimativaDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('tipo', createEstimativaDto.tipo);
      expect(response.body).toHaveProperty('valor', createEstimativaDto.valor);
      expect(response.body).toHaveProperty(
        'observacao',
        createEstimativaDto.observacao,
      );
      expect(response.body).toHaveProperty(
        'requisitoId',
        createEstimativaDto.requisitoId,
      );
      expect(response.body).toHaveProperty(
        'projetoId',
        createEstimativaDto.projetoId,
      );

      createdEstimativaId = response.body.id;
    });

    it('should reject estimativa creation with invalid data', async () => {
      const invalidEstimativaDto = {
        // Missing required fields
        valor: 5,
      };

      await request(app.getHttpServer())
        .post('/estimativa')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidEstimativaDto)
        .expect(400);
    });

    it('should reject estimativa with invalid tipo', async () => {
      const invalidTipoDto = {
        tipo: 'TIPO_INVALIDO',
        valor: 5,
        requisitoId: requisitoId,
        projetoId: projetoId,
      };

      await request(app.getHttpServer())
        .post('/estimativa')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidTipoDto)
        .expect(400);
    });

    it('should reject unauthorized access', async () => {
      const createEstimativaDto = {
        tipo: 'STORY_POINTS',
        valor: 5,
        observacao: 'Estimativa não autorizada',
        requisitoId: requisitoId,
        projetoId: projetoId,
      };

      await request(app.getHttpServer())
        .post('/estimativa')
        .send(createEstimativaDto)
        .expect(401);
    });
  });

  describe('GET /estimativa', () => {
    it('should return all estimativas', async () => {
      const response = await request(app.getHttpServer())
        .get('/estimativa')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      const createdEstimativa = response.body.find(
        (estimativa) => estimativa.id === createdEstimativaId,
      );
      expect(createdEstimativa).toBeDefined();
    });

    it('should return estimativas filtered by projeto', async () => {
      const response = await request(app.getHttpServer())
        .get(`/estimativa?projetoId=${projetoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // All returned estimativas should belong to the specified project
      response.body.forEach((estimativa) => {
        expect(estimativa.projetoId).toBe(projetoId);
      });
    });

    it('should return estimativas filtered by requisito', async () => {
      const response = await request(app.getHttpServer())
        .get(`/estimativa?requisitoId=${requisitoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // All returned estimativas should belong to the specified requisito
      response.body.forEach((estimativa) => {
        expect(estimativa.requisitoId).toBe(requisitoId);
      });
    });

    it('should return estimativas filtered by tipo', async () => {
      const response = await request(app.getHttpServer())
        .get('/estimativa?tipo=PONTOS_DE_FUNCAO')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);

      // All returned estimativas should have the specified tipo
      response.body.forEach((estimativa) => {
        expect(estimativa.tipo).toBe('PONTOS_DE_FUNCAO');
      });
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer()).get('/estimativa').expect(401);
    });
  });

  describe('GET /estimativa/:id', () => {
    it('should return estimativa by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/estimativa/${createdEstimativaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', createdEstimativaId);
      expect(response.body).toHaveProperty('tipo');
      expect(response.body).toHaveProperty('valor');
      expect(response.body).toHaveProperty('observacao');
      expect(response.body).toHaveProperty('requisitoId', requisitoId);
      expect(response.body).toHaveProperty('projetoId', projetoId);
    });

    it('should return 404 for non-existent estimativa', async () => {
      await request(app.getHttpServer())
        .get('/estimativa/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer())
        .get(`/estimativa/${createdEstimativaId}`)
        .expect(401);
    });
  });

  describe('PATCH /estimativa/:id', () => {
    it('should update estimativa by id', async () => {
      const updateEstimativaDto = {
        valor: 13,
        observacao: 'Estimativa atualizada para teste e2e',
      };

      const response = await request(app.getHttpServer())
        .patch(`/estimativa/${createdEstimativaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateEstimativaDto)
        .expect(200);

      expect(response.body).toHaveProperty('id', createdEstimativaId);
      expect(response.body).toHaveProperty('valor', updateEstimativaDto.valor);
      expect(response.body).toHaveProperty(
        'observacao',
        updateEstimativaDto.observacao,
      );
      expect(response.body).toHaveProperty('requisitoId', requisitoId);
      expect(response.body).toHaveProperty('projetoId', projetoId);
    });

    it('should reject invalid tipo update', async () => {
      const invalidTipoUpdateDto = {
        tipo: 'TIPO_INVALIDO',
      };

      await request(app.getHttpServer())
        .patch(`/estimativa/${createdEstimativaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidTipoUpdateDto)
        .expect(400);
    });

    it('should return 404 for non-existent estimativa', async () => {
      const updateEstimativaDto = {
        valor: 21,
      };

      await request(app.getHttpServer())
        .patch('/estimativa/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateEstimativaDto)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      const updateEstimativaDto = {
        valor: 34,
      };

      await request(app.getHttpServer())
        .patch(`/estimativa/${createdEstimativaId}`)
        .send(updateEstimativaDto)
        .expect(401);
    });
  });

  describe('DELETE /estimativa/:id', () => {
    it('should delete estimativa by id', async () => {
      await request(app.getHttpServer())
        .delete(`/estimativa/${createdEstimativaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify estimativa was deleted
      await request(app.getHttpServer())
        .get(`/estimativa/${createdEstimativaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 404 for non-existent estimativa', async () => {
      await request(app.getHttpServer())
        .delete('/estimativa/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer()).delete('/estimativa/1').expect(401);
    });
  });
});
