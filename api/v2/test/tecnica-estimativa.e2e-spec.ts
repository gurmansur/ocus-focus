import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { cleanupDatabase, initializeApp } from './test-utils';

describe('TecnicaEstimativaController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let projetoId: number;
  let tecnicaEstimativaId: number;

  beforeAll(async () => {
    app = await initializeApp();

    // Create a test user and get auth token
    await request(app.getHttpServer()).post('/signup').send({
      nome: 'Tecnica Estimativa Test User',
      email: 'tecnica.estimativa.test@example.com',
      senha: 'Password123!',
      empresa: 'Empresa Teste',
      cargo: 'Analista de Sistemas',
    });

    const authResponse = await request(app.getHttpServer())
      .post('/signin-colaborador')
      .send({
        email: 'tecnica.estimativa.test@example.com',
        senha: 'Password123!',
      });

    authToken = authResponse.body.accessToken;

    // Create a test projeto
    const projetoResponse = await request(app.getHttpServer())
      .post('/projeto')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        nome: 'Projeto para Teste de Técnica de Estimativa',
        descricao: 'Projeto criado para testes e2e de Técnica de Estimativa',
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

  describe('POST /tecnica-estimativa', () => {
    it('should create a new tecnica-estimativa', async () => {
      const createTecnicaDto = {
        nome: 'Técnica de Estimativa Teste',
        descricao: 'Descrição da técnica de estimativa para teste e2e',
        projetoId: projetoId,
      };

      const response = await request(app.getHttpServer())
        .post('/tecnica-estimativa')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createTecnicaDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('nome', createTecnicaDto.nome);
      expect(response.body).toHaveProperty(
        'descricao',
        createTecnicaDto.descricao,
      );
      expect(response.body).toHaveProperty(
        'projetoId',
        createTecnicaDto.projetoId,
      );

      tecnicaEstimativaId = response.body.id;
    });

    it('should reject tecnica-estimativa creation with invalid data', async () => {
      const invalidTecnicaDto = {
        // Missing required fields
        descricao: 'Descrição sem nome',
        projetoId: projetoId,
      };

      await request(app.getHttpServer())
        .post('/tecnica-estimativa')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidTecnicaDto)
        .expect(400);
    });

    it('should reject tecnica-estimativa without projetoId', async () => {
      const invalidTecnicaDto = {
        nome: 'Técnica sem Projeto',
        descricao: 'Descrição da técnica sem projeto',
      };

      await request(app.getHttpServer())
        .post('/tecnica-estimativa')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidTecnicaDto)
        .expect(400);
    });

    it('should reject unauthorized access', async () => {
      const createTecnicaDto = {
        nome: 'Técnica Não Autorizada',
        descricao: 'Descrição da técnica não autorizada',
        projetoId: projetoId,
      };

      await request(app.getHttpServer())
        .post('/tecnica-estimativa')
        .send(createTecnicaDto)
        .expect(401);
    });
  });

  describe('GET /tecnicas-estimativa', () => {
    it('should return all tecnicas-estimativa', async () => {
      const response = await request(app.getHttpServer())
        .get('/tecnicas-estimativa')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      const createdTecnica = response.body.find(
        (tecnica) => tecnica.id === tecnicaEstimativaId,
      );
      expect(createdTecnica).toBeDefined();
    });

    it('should return tecnicas-estimativa filtered by projeto', async () => {
      const response = await request(app.getHttpServer())
        .get(`/tecnicas-estimativa?projetoId=${projetoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // All returned tecnicas should belong to the specified projeto
      response.body.forEach((tecnica) => {
        expect(tecnica.projetoId).toBe(projetoId);
      });
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer())
        .get('/tecnicas-estimativa')
        .expect(401);
    });
  });

  describe('GET /tecnica-estimativa/:id', () => {
    it('should return tecnica-estimativa by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/tecnica-estimativa/${tecnicaEstimativaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', tecnicaEstimativaId);
      expect(response.body).toHaveProperty('nome');
      expect(response.body).toHaveProperty('descricao');
      expect(response.body).toHaveProperty('projetoId', projetoId);
    });

    it('should return 404 for non-existent tecnica-estimativa', async () => {
      await request(app.getHttpServer())
        .get('/tecnica-estimativa/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer())
        .get(`/tecnica-estimativa/${tecnicaEstimativaId}`)
        .expect(401);
    });
  });

  describe('PATCH /tecnica-estimativa/:id', () => {
    it('should update tecnica-estimativa details', async () => {
      const updateTecnicaDto = {
        nome: 'Técnica de Estimativa Atualizada',
        descricao: 'Descrição atualizada para teste e2e',
      };

      const response = await request(app.getHttpServer())
        .patch(`/tecnica-estimativa/${tecnicaEstimativaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateTecnicaDto)
        .expect(200);

      expect(response.body).toHaveProperty('id', tecnicaEstimativaId);
      expect(response.body).toHaveProperty('nome', updateTecnicaDto.nome);
      expect(response.body).toHaveProperty(
        'descricao',
        updateTecnicaDto.descricao,
      );
    });

    it('should return 404 for non-existent tecnica-estimativa', async () => {
      const updateTecnicaDto = {
        nome: 'Técnica Inexistente',
      };

      await request(app.getHttpServer())
        .patch('/tecnica-estimativa/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateTecnicaDto)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      const updateTecnicaDto = {
        nome: 'Técnica Não Autorizada',
      };

      await request(app.getHttpServer())
        .patch(`/tecnica-estimativa/${tecnicaEstimativaId}`)
        .send(updateTecnicaDto)
        .expect(401);
    });
  });

  describe('DELETE /tecnica-estimativa/:id', () => {
    it('should delete tecnica-estimativa by id', async () => {
      // First create a tecnica-estimativa that we'll delete
      const createTempTecnicaDto = {
        nome: 'Técnica Temporária para Deletar',
        descricao: 'Esta técnica será deletada',
        projetoId: projetoId,
      };

      const createResponse = await request(app.getHttpServer())
        .post('/tecnica-estimativa')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createTempTecnicaDto)
        .expect(201);

      const tempTecnicaId = createResponse.body.id;

      // Now delete it
      await request(app.getHttpServer())
        .delete(`/tecnica-estimativa/${tempTecnicaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify tecnica was deleted
      await request(app.getHttpServer())
        .get(`/tecnica-estimativa/${tempTecnicaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 404 for non-existent tecnica-estimativa', async () => {
      await request(app.getHttpServer())
        .delete('/tecnica-estimativa/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer())
        .delete('/tecnica-estimativa/1')
        .expect(401);
    });
  });
});
