import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { cleanupDatabase, initializeApp } from './test-utils';

describe('AtorController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let createdAtorId: number;
  let projetoId: number;

  beforeAll(async () => {
    app = await initializeApp();

    // Create a test user and get auth token
    await request(app.getHttpServer()).post('/signup').send({
      nome: 'Ator Test User',
      email: 'ator.test@example.com',
      senha: 'Password123!',
      empresa: 'Empresa Teste',
      cargo: 'Analista de Sistemas',
    });

    const authResponse = await request(app.getHttpServer())
      .post('/signin-colaborador')
      .send({
        email: 'ator.test@example.com',
        senha: 'Password123!',
      });

    authToken = authResponse.body.accessToken;

    // Create a test projeto for the ator tests
    const projetoResponse = await request(app.getHttpServer())
      .post('/projeto')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        nome: 'Projeto para Teste de Ator',
        descricao: 'Projeto criado para testes e2e de Ator',
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

  describe('POST /ator', () => {
    it('should create a new ator', async () => {
      const createAtorDto = {
        nome: 'Ator de Teste',
        descricao: 'Descrição do ator para teste e2e',
        projetoId: projetoId,
      };

      const response = await request(app.getHttpServer())
        .post('/ator')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createAtorDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('nome', createAtorDto.nome);
      expect(response.body).toHaveProperty(
        'descricao',
        createAtorDto.descricao,
      );
      expect(response.body).toHaveProperty(
        'projetoId',
        createAtorDto.projetoId,
      );

      createdAtorId = response.body.id;
    });

    it('should reject ator creation with invalid data', async () => {
      const invalidAtorDto = {
        // Missing required fields
        descricao: 'Ator inválido',
      };

      await request(app.getHttpServer())
        .post('/ator')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidAtorDto)
        .expect(400);
    });

    it('should reject unauthorized access', async () => {
      const createAtorDto = {
        nome: 'Ator Não Autorizado',
        descricao: 'Descrição do ator não autorizado',
        projetoId: projetoId,
      };

      await request(app.getHttpServer())
        .post('/ator')
        .send(createAtorDto)
        .expect(401);
    });
  });

  describe('GET /ator', () => {
    it('should return all atores', async () => {
      const response = await request(app.getHttpServer())
        .get('/ator')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      const createdAtor = response.body.find(
        (ator) => ator.id === createdAtorId,
      );
      expect(createdAtor).toBeDefined();
    });

    it('should return atores filtered by projeto', async () => {
      const response = await request(app.getHttpServer())
        .get(`/ator?projetoId=${projetoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // All returned atores should belong to the specified project
      response.body.forEach((ator) => {
        expect(ator.projetoId).toBe(projetoId);
      });
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer()).get('/ator').expect(401);
    });
  });

  describe('GET /ator/:id', () => {
    it('should return ator by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/ator/${createdAtorId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', createdAtorId);
      expect(response.body).toHaveProperty('nome');
      expect(response.body).toHaveProperty('descricao');
      expect(response.body).toHaveProperty('projetoId', projetoId);
    });

    it('should return 404 for non-existent ator', async () => {
      await request(app.getHttpServer())
        .get('/ator/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer())
        .get(`/ator/${createdAtorId}`)
        .expect(401);
    });
  });

  describe('PATCH /ator/:id', () => {
    it('should update ator by id', async () => {
      const updateAtorDto = {
        nome: 'Ator Atualizado',
        descricao: 'Descrição atualizada para teste e2e',
      };

      const response = await request(app.getHttpServer())
        .patch(`/ator/${createdAtorId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateAtorDto)
        .expect(200);

      expect(response.body).toHaveProperty('id', createdAtorId);
      expect(response.body).toHaveProperty('nome', updateAtorDto.nome);
      expect(response.body).toHaveProperty(
        'descricao',
        updateAtorDto.descricao,
      );
      expect(response.body).toHaveProperty('projetoId', projetoId);
    });

    it('should return 404 for non-existent ator', async () => {
      const updateAtorDto = {
        nome: 'Ator Inexistente',
      };

      await request(app.getHttpServer())
        .patch('/ator/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateAtorDto)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      const updateAtorDto = {
        nome: 'Ator Não Autorizado',
      };

      await request(app.getHttpServer())
        .patch(`/ator/${createdAtorId}`)
        .send(updateAtorDto)
        .expect(401);
    });
  });

  describe('DELETE /ator/:id', () => {
    it('should delete ator by id', async () => {
      await request(app.getHttpServer())
        .delete(`/ator/${createdAtorId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify ator was deleted
      await request(app.getHttpServer())
        .get(`/ator/${createdAtorId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 404 for non-existent ator', async () => {
      await request(app.getHttpServer())
        .delete('/ator/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer()).delete('/ator/1').expect(401);
    });
  });
});
